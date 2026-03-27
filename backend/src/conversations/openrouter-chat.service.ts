import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { ConversationsService } from './conversations.service';

type StreamConversationParams = {
  response: ExpressResponse;
  userId: string;
  conversationId: string;
  content: string;
};

@Injectable()
export class OpenrouterChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly conversationsService: ConversationsService,
  ) {}

  private async readUpstreamError(response: globalThis.Response) {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as {
        error?: { message?: string };
        message?: string;
      };

      if (payload.error?.message) {
        return payload.error.message;
      }

      if (payload.message) {
        return payload.message;
      }
    }

    const text = await response.text();

    if (text.trim()) {
      return text.trim();
    }

    return `OpenRouter request failed with status ${response.status}`;
  }

  async streamConversation({
    response,
    userId,
    conversationId,
    content,
  }: StreamConversationParams): Promise<void> {
    await this.conversationsService.assertOwnedConversation(userId, conversationId);

    const conversationHistory = await this.conversationsService.getMessageHistoryForUser(
      userId,
      conversationId,
    );

    await this.prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content,
      },
    });

    let upstreamResponse: globalThis.Response;

    try {
      upstreamResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL,
          stream: true,
          messages: [
            ...conversationHistory.map((message) => ({
              role: message.role,
              content: message.content,
            })),
            {
              role: 'user',
              content,
            },
          ],
        }),
      });
    } catch {
      throw new BadGatewayException('OpenRouter 요청에 도달하지 못했습니다.');
    }

    if (!upstreamResponse.ok) {
      throw new BadGatewayException(await this.readUpstreamError(upstreamResponse));
    }

    if (!upstreamResponse.body) {
      throw new InternalServerErrorException('OpenRouter stream body is missing');
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
          throw new InternalServerErrorException(parsed.error.message);
        }

        const choice = parsed.choices?.[0];

        if (choice?.finish_reason === 'error') {
          throw new InternalServerErrorException('OpenRouter stream error');
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
