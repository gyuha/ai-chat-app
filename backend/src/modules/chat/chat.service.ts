import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as crypto from 'crypto';

interface OpenRouterMessage {
  role: string;
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async chatCompletion(userId: string, message: string, chatId?: string, model?: string) {
    const defaultModel = 'openrouter/auto:free';
    const selectedModel = model || defaultModel;

    let chat;

    if (chatId) {
      chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
      if (!chat) throw new NotFoundException('채팅을 찾을 수 없습니다.');
      if (chat.userId !== userId) throw new ForbiddenException('접근 권한이 없습니다.');
    } else {
      chat = await this.prisma.chat.create({
        data: { userId, title: message.substring(0, 30) + '...' },
      });
    }

    // 히스토리 조회 (유저 메시지 저장 전)
    const history = await this.getChatMessagesForOpenRouter(chat.id);

    // 사용자 메시지 저장
    await this.prisma.message.create({
      data: { chatId: chat.id, role: 'user', content: message },
    });

    // OpenRouter API 호출 (트랜잭션 밖에서 수행 - DB 락 방지)
    const openRouterResponse = await this.callOpenRouter(selectedModel, message, history);
    const assistantMessage = openRouterResponse.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('OpenRouter 응답이 없습니다.');
    }

    // 어시스턴트 메시지 저장 및 채팅 업데이트
    await this.prisma.message.create({
      data: { chatId: chat.id, role: 'assistant', content: assistantMessage },
    });
    await this.prisma.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    return {
      chatId: chat.id,
      message: {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: assistantMessage,
        createdAt: new Date().toISOString(),
      },
    };
  }

  private async getChatMessagesForOpenRouter(chatId: string): Promise<OpenRouterMessage[]> {
    const messages = await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      take: 20,
      select: {
        role: true,
        content: true,
      },
    });

    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  private async callOpenRouter(
    model: string,
    userMessage: string,
    history: OpenRouterMessage[],
  ): Promise<OpenRouterResponse> {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');

    if (!apiKey) {
      throw new Error('OpenRouter API key가 없습니다.');
    }

    const messages: OpenRouterMessage[] = [
      ...history,
      { role: 'user', content: userMessage },
    ];

    const requestBody: OpenRouterRequest = {
      model,
      messages,
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ai-chat-app.com',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API 오류: ${response.status}`);
    }

    return response.json();
  }

  async getChatHistory(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    });

    return chats.map((chat) => ({
      id: chat.id,
      title: chat.title || '제목 없음',
      updatedAt: chat.updatedAt.toISOString(),
      messageCount: chat._count.messages,
    }));
  }

  async getChatDetail(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('채팅을 찾을 수 없습니다.');
    }

    if (chat.userId !== userId) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    const messages = await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    return {
      id: chat.id,
      title: chat.title,
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
      })),
    };
  }
}
