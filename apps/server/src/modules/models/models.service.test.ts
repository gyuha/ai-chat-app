import { describe, expect, it } from 'vitest';

import { ModelsService } from './models.service.js';

describe('ModelsService', () => {
  it('returns allowlisted models from config', () => {
    const service = new ModelsService({
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

    expect(service.listModels()).toEqual([
      {
        id: 'openrouter/auto',
        label: 'auto',
        provider: 'openrouter',
      },
    ]);
  });
});
