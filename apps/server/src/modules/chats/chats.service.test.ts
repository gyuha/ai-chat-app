import { describe, expect, it } from 'vitest';

import { MemoryChatRepository } from '../../infrastructure/storage/memory-chat.repository.js';
import { ChatsService } from './chats.service.js';

describe('ChatsService', () => {
  it('creates chats with the default allowlisted model', async () => {
    const service = new ChatsService(new MemoryChatRepository(), {
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

    const created = await service.create();

    expect(created.title).toBe('New chat');
    expect(created.settings.modelId).toBe('openrouter/auto');
  });

  it('lists chats in reverse updated order', async () => {
    const repository = new MemoryChatRepository();
    const service = new ChatsService(repository, {
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

    const first = await service.create();
    const second = await service.create();
    await repository.updateTitle(first.id, 'Older');
    await repository.updateTitle(second.id, 'Newer');

    const chats = await service.list();

    expect(chats[0]?.id).toBe(second.id);
    expect(chats[1]?.id).toBe(first.id);
  });
});
