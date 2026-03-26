import { Injectable, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { ConversationDetailDto } from './dto/conversation-detail.dto';
import { ConversationSummaryDto } from './dto/conversation-summary.dto';

type CreateConversationMode = 'default' | 'bootstrap';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async assertOwnedConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      select: {
        id: true,
        title: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async createConversation(
    userId: string,
    mode: CreateConversationMode = 'default',
  ): Promise<ConversationSummaryDto> {
    if (mode === 'bootstrap') {
      return this.prisma.$transaction(async (tx) => {
        const existing = await tx.conversation.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            title: true,
          },
        });

        if (existing) {
          return existing;
        }

        return tx.conversation.create({
          data: {
            userId,
            title: '새 대화',
          },
          select: {
            id: true,
            title: true,
          },
        });
      });
    }

    return this.prisma.conversation.create({
      data: {
        userId,
        title: '새 대화',
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  listForUser(userId: string): Promise<ConversationSummaryDto[]> {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
      },
    });
  }

  async getForUser(userId: string, id: string): Promise<ConversationDetailDto> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            role: true,
            content: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async streamChatForUser(
    userId: string,
    conversationId: string,
    content: string,
    response: Response,
  ): Promise<void> {
    await this.assertOwnedConversation(userId, conversationId);

    const conversationHistory = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      select: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            role: true,
            content: true,
          },
        },
      },
    });

    if (!conversationHistory) {
      throw new NotFoundException('Conversation not found');
    }

    await this.prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content,
      },
    });

    const upstreamResponse = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL,
          stream: true,
          messages: [
            ...conversationHistory.messages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
            {
              role: 'user',
              content,
            },
          ],
        }),
      },
    );

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      throw new Error('OpenRouter request failed');
    }

    response.status(201);
    response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');

    const reader = upstreamResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assistantContent = '';

    const processEvent = (eventPayload: string) => {
      const trimmed = eventPayload.trim();

      if (!trimmed || trimmed.startsWith(':')) {
        return;
      }

      const dataLines = trimmed
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice('data:'.length).trim());

      for (const line of dataLines) {
        if (!line || line === '[DONE]') {
          continue;
        }

        const parsed = JSON.parse(line) as {
          error?: { message?: string };
          choices?: Array<{
            delta?: { content?: string };
            finish_reason?: string | null;
          }>;
        };

        if (parsed.error?.message) {
          throw new Error(parsed.error.message);
        }

        const choice = parsed.choices?.[0];

        if (choice?.finish_reason === 'error') {
          throw new Error('OpenRouter stream error');
        }

        const delta = choice?.delta?.content ?? '';

        if (!delta) {
          continue;
        }

        assistantContent += delta;
        response.write(delta);
      }
    };

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        buffer += decoder.decode();
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      while (buffer.includes('\n\n')) {
        const boundaryIndex = buffer.indexOf('\n\n');
        const eventPayload = buffer.slice(0, boundaryIndex);
        buffer = buffer.slice(boundaryIndex + 2);
        processEvent(eventPayload);
      }
    }

    if (buffer.trim()) {
      processEvent(buffer);
    }

    if (assistantContent.length > 0) {
      await this.prisma.message.create({
        data: {
          conversationId,
          role: 'assistant',
          content: assistantContent,
        },
      });
    }

    response.end();
  }
}
