import { describe, expect, it } from 'vitest';

import { parseEnv } from './env.schema.js';

describe('parseEnv', () => {
  it('parses required server environment variables', () => {
    const parsed = parseEnv({
      OPENROUTER_API_KEY: 'test-key',
      OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
      OPENROUTER_MODEL_ALLOWLIST: 'openrouter/auto,google/gemini-2.0-flash-exp:free',
      CHAT_STORAGE_MODE: 'memory',
      CHAT_STORAGE_DIR: './data/chats',
      PORT: '4000',
    });

    expect(parsed.PORT).toBe(4000);
    expect(parsed.OPENROUTER_MODEL_ALLOWLIST).toContain('openrouter/auto');
  });
});
