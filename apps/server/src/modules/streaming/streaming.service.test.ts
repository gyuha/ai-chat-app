import { describe, expect, it } from 'vitest';
import type { OpenRouterStreamChunk } from '../../infrastructure/openrouter/openrouter.client.js';
import { MemoryChatRepository } from '../../infrastructure/storage/memory-chat.repository.js';
import type { AppConfig } from '../../shared/tokens.js';
import { ChatsService } from '../chats/chats.service.js';
import { StreamingService } from './streaming.service.js';

const createConfig = (): AppConfig => ({
  port: 4000,
  openRouter: {
    apiKey: 'test-key',
    baseUrl: 'https://openrouter.ai/api/v1',
    modelAllowlist: ['openrouter/auto'],
    models: [
      {
        id: 'openrouter/auto',
        label: 'auto',
        provider: 'openrouter',
      },
    ],
  },
  storage: {
    mode: 'memory',
    directory: './data',
  },
});

const collectEvents = async (stream: AsyncIterable<unknown>) => {
  const events: unknown[] = [];
  for await (const event of stream) {
    events.push(event);
  }

  return events;
};

const createClient = (chunks: OpenRouterStreamChunk[]) => ({
  streamChat: async function* () {
    for (const chunk of chunks) {
      yield chunk;
    }
  },
});

describe('StreamingService', () => {
  it('streams assistant deltas and persists both user and assistant messages', async () => {
    const repository = new MemoryChatRepository();
    const chatsService = new ChatsService(repository, createConfig());
    const chat = await chatsService.create();
    const service = new StreamingService(
      repository,
      chatsService,
      createClient([{ delta: 'Hello' }, { delta: ' world' }]),
    );

    const events = await collectEvents(
      service.streamMessage({
        chatId: chat.id,
        prompt: 'Say hello',
      }),
    );

    expect(events).toHaveLength(5);
    expect(events[0]).toMatchObject({ event: 'meta' });
    expect(events[1]).toMatchObject({ event: 'message:start' });
    expect(events[2]).toMatchObject({
      event: 'message:delta',
      data: {
        delta: 'Hello',
        content: 'Hello',
      },
    });
    expect(events[3]).toMatchObject({
      event: 'message:delta',
      data: {
        delta: ' world',
        content: 'Hello world',
      },
    });
    expect(events[4]).toMatchObject({
      event: 'message:done',
      data: {
        content: 'Hello world',
        status: 'complete',
      },
    });

    const updated = await chatsService.get(chat.id);
    expect(updated.messages).toHaveLength(2);
    expect(updated.messages[0]).toMatchObject({
      role: 'user',
      content: 'Say hello',
      status: 'complete',
    });
    expect(updated.messages[1]).toMatchObject({
      role: 'assistant',
      content: 'Hello world',
      status: 'complete',
    });
  });

  it('replaces the last assistant message during regenerate', async () => {
    const repository = new MemoryChatRepository();
    const chatsService = new ChatsService(repository, createConfig());
    const chat = await chatsService.create();
    await repository.appendMessage(chat.id, {
      id: 'user-1',
      role: 'user',
      content: 'Original prompt',
      createdAt: new Date().toISOString(),
      status: 'complete',
    });
    await repository.appendMessage(chat.id, {
      id: 'assistant-1',
      role: 'assistant',
      content: 'Old answer',
      createdAt: new Date().toISOString(),
      status: 'complete',
    });

    const service = new StreamingService(
      repository,
      chatsService,
      createClient([{ delta: 'New answer' }]),
    );

    const events = await collectEvents(
      service.streamRegenerate({
        chatId: chat.id,
      }),
    );

    expect(events[1]).toMatchObject({
      event: 'message:start',
      data: {
        replaceMessageId: 'assistant-1',
      },
    });

    const updated = await chatsService.get(chat.id);
    expect(updated.messages).toHaveLength(2);
    expect(updated.messages[1]).toMatchObject({
      role: 'assistant',
      content: 'New answer',
      status: 'complete',
    });
    expect(updated.messages[1]?.id).not.toBe('assistant-1');
  });
});
