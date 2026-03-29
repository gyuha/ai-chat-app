import { Inject, Injectable } from '@nestjs/common';

import type { ChatMessage, StreamEvent, StreamMessageStartData, StreamMode } from '@repo/contracts';

import { OpenRouterClient } from '../../infrastructure/openrouter/openrouter.client.js';
import { CHAT_REPOSITORY } from '../../shared/tokens.js';
import type { ChatRepository } from '../chats/chats.repository.js';
import { ChatsService } from '../chats/chats.service.js';

interface BaseStreamInput {
  chatId: string;
  signal?: AbortSignal;
}

interface MessageStreamInput extends BaseStreamInput {
  prompt: string;
}

const createId = () => crypto.randomUUID();

const createMessage = (
  role: ChatMessage['role'],
  content: string,
  status: ChatMessage['status'],
  id: string = createId(),
): ChatMessage => ({
  id,
  role,
  content,
  createdAt: new Date().toISOString(),
  status,
});

const toModelMessages = (messages: ChatMessage[], systemPrompt: string) => [
  ...(systemPrompt.trim()
    ? [
        {
          role: 'system',
          content: systemPrompt.trim(),
        },
      ]
    : []),
  ...messages.map((message) => ({
    role: message.role,
    content: message.content,
  })),
];

@Injectable()
export class StreamingService {
  constructor(
    @Inject(CHAT_REPOSITORY) private readonly chatRepository: ChatRepository,
    @Inject(ChatsService) private readonly chatsService: ChatsService,
    @Inject(OpenRouterClient)
    private readonly openRouterClient: Pick<OpenRouterClient, 'streamChat'>,
  ) {}

  async *streamMessage(input: MessageStreamInput): AsyncGenerator<StreamEvent> {
    const chat = await this.chatsService.get(input.chatId);
    const userMessage = createMessage('user', input.prompt.trim(), 'complete');
    const assistantMessageId = createId();
    const streamStart = this.createStartEvent(
      'message',
      chat.id,
      chat.settings.modelId,
      chat.title,
      {
        chatId: chat.id,
        messageId: assistantMessageId,
        role: 'assistant',
      },
    );

    await this.chatRepository.appendMessage(chat.id, userMessage);

    yield streamStart.meta;
    yield streamStart.start;

    let assistantContent = '';

    try {
      for await (const chunk of this.openRouterClient.streamChat({
        model: chat.settings.modelId,
        messages: toModelMessages([...chat.messages, userMessage], chat.settings.systemPrompt),
        signal: input.signal,
      })) {
        if (!chunk.delta) {
          continue;
        }

        assistantContent += chunk.delta;
        yield {
          event: 'message:delta',
          data: {
            chatId: chat.id,
            messageId: assistantMessageId,
            delta: chunk.delta,
            content: assistantContent,
          },
        };
      }

      yield await this.finishMessageStream({
        chatId: chat.id,
        content: assistantContent,
        messageId: assistantMessageId,
        status: 'complete',
      });
    } catch (error) {
      if (this.isAbort(error, input.signal)) {
        await this.persistStoppedMessage(chat.id, assistantMessageId, assistantContent);
        return;
      }

      yield this.createError(chat.id, assistantMessageId, 'stream_failed');
    }
  }

  async *streamRegenerate(input: BaseStreamInput): AsyncGenerator<StreamEvent> {
    const chat = await this.chatsService.get(input.chatId);
    const lastAssistantIndex = this.findLastAssistantIndex(chat.messages);
    if (lastAssistantIndex === -1) {
      yield this.createError(chat.id, undefined, 'regenerate_not_available');
      return;
    }

    const replaceMessageId = chat.messages[lastAssistantIndex]?.id;
    const retainedMessages = chat.messages.filter((_, index) => index !== lastAssistantIndex);
    const assistantMessageId = createId();
    const streamStart = this.createStartEvent(
      'regenerate',
      chat.id,
      chat.settings.modelId,
      chat.title,
      {
        chatId: chat.id,
        messageId: assistantMessageId,
        role: 'assistant',
        replaceMessageId,
      },
    );

    yield streamStart.meta;
    yield streamStart.start;

    let assistantContent = '';

    try {
      for await (const chunk of this.openRouterClient.streamChat({
        model: chat.settings.modelId,
        messages: toModelMessages(retainedMessages, chat.settings.systemPrompt),
        signal: input.signal,
      })) {
        if (!chunk.delta) {
          continue;
        }

        assistantContent += chunk.delta;
        yield {
          event: 'message:delta',
          data: {
            chatId: chat.id,
            messageId: assistantMessageId,
            delta: chunk.delta,
            content: assistantContent,
          },
        };
      }

      yield await this.finishRegenerateStream({
        chatId: chat.id,
        baseMessages: retainedMessages,
        content: assistantContent,
        messageId: assistantMessageId,
        replaceMessageId,
        status: 'complete',
      });
    } catch (error) {
      if (this.isAbort(error, input.signal)) {
        await this.persistStoppedRegenerate(
          chat.id,
          retainedMessages,
          assistantMessageId,
          assistantContent,
        );
        return;
      }

      yield this.createError(chat.id, assistantMessageId, 'stream_failed');
    }
  }

  private createStartEvent(
    mode: StreamMode,
    chatId: string,
    modelId: string,
    title: string,
    start: StreamMessageStartData,
  ) {
    return {
      meta: {
        event: 'meta' as const,
        data: {
          chatId,
          mode,
          modelId,
          title,
        },
      },
      start: {
        event: 'message:start' as const,
        data: start,
      },
    };
  }

  private async finishMessageStream(input: {
    chatId: string;
    messageId: string;
    content: string;
    status: Extract<ChatMessage['status'], 'complete' | 'stopped'>;
  }): Promise<StreamEvent<'message:done'>> {
    await this.chatRepository.appendMessage(
      input.chatId,
      createMessage('assistant', input.content, input.status, input.messageId),
    );

    const updatedChat = await this.chatsService.get(input.chatId);
    return {
      event: 'message:done',
      data: {
        chatId: input.chatId,
        messageId: input.messageId,
        content: input.content,
        status: input.status,
        chat: updatedChat,
      },
    };
  }

  private async finishRegenerateStream(input: {
    chatId: string;
    baseMessages: ChatMessage[];
    messageId: string;
    content: string;
    replaceMessageId?: string;
    status: Extract<ChatMessage['status'], 'complete' | 'stopped'>;
  }): Promise<StreamEvent<'message:done'>> {
    await this.chatRepository.replaceMessages(input.chatId, [
      ...input.baseMessages,
      createMessage('assistant', input.content, input.status, input.messageId),
    ]);

    const updatedChat = await this.chatsService.get(input.chatId);
    return {
      event: 'message:done',
      data: {
        chatId: input.chatId,
        messageId: input.messageId,
        content: input.content,
        status: input.status,
        chat: updatedChat,
        replaceMessageId: input.replaceMessageId,
      },
    };
  }

  private async persistStoppedMessage(chatId: string, messageId: string, content: string) {
    if (!content) {
      return;
    }

    await this.chatRepository.appendMessage(
      chatId,
      createMessage('assistant', content, 'stopped', messageId),
    );
  }

  private async persistStoppedRegenerate(
    chatId: string,
    baseMessages: ChatMessage[],
    messageId: string,
    content: string,
  ) {
    if (!content) {
      return;
    }

    await this.chatRepository.replaceMessages(chatId, [
      ...baseMessages,
      createMessage('assistant', content, 'stopped', messageId),
    ]);
  }

  private createError(
    chatId: string,
    messageId: string | undefined,
    code: 'stream_failed' | 'regenerate_not_available',
  ): StreamEvent<'error'> {
    return {
      event: 'error',
      data: {
        chatId,
        code,
        messageId,
        message:
          code === 'regenerate_not_available'
            ? '재생성할 assistant 응답이 없습니다.'
            : '응답 생성 중 문제가 발생했습니다. 다시 시도해 주세요.',
      },
    };
  }

  private isAbort(error: unknown, signal?: AbortSignal) {
    return signal?.aborted || (error instanceof Error && error.name === 'AbortError');
  }

  private findLastAssistantIndex(messages: ChatMessage[]) {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.role === 'assistant') {
        return index;
      }
    }

    return -1;
  }
}
