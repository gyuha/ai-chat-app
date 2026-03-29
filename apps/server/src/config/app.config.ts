import type { ModelOption } from '@repo/contracts';

import { parseEnv } from './env.schema.js';

export interface AppConfig {
  port: number;
  openRouter: {
    apiKey: string;
    baseUrl: string;
    modelAllowlist: string[];
    models: ModelOption[];
  };
  storage: {
    mode: 'memory' | 'file';
    directory: string;
  };
}

export const createAppConfig = (env: NodeJS.ProcessEnv): AppConfig => {
  const parsed = parseEnv(env);
  const modelAllowlist = parsed.OPENROUTER_MODEL_ALLOWLIST.split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    port: parsed.PORT,
    openRouter: {
      apiKey: parsed.OPENROUTER_API_KEY,
      baseUrl: parsed.OPENROUTER_BASE_URL,
      modelAllowlist,
      models: modelAllowlist.map((id) => ({
        id,
        label: id.split('/').at(-1) ?? id,
        provider: 'openrouter',
      })),
    },
    storage: {
      mode: parsed.CHAT_STORAGE_MODE,
      directory: parsed.CHAT_STORAGE_DIR,
    },
  };
};

export const appConfig = () => createAppConfig(process.env);
