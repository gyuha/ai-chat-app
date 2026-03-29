import { z } from 'zod';

export const envSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(1, 'OPENROUTER_API_KEY is required'),
  OPENROUTER_BASE_URL: z.url().default('https://openrouter.ai/api/v1'),
  OPENROUTER_MODEL_ALLOWLIST: z.string().min(1, 'OPENROUTER_MODEL_ALLOWLIST is required'),
  CHAT_STORAGE_MODE: z.enum(['memory', 'file']).default('memory'),
  CHAT_STORAGE_DIR: z.string().min(1).default('./apps/server/data/chats'),
  PORT: z.coerce.number().int().positive().default(4000),
});

export type EnvSchema = z.infer<typeof envSchema>;

export const parseEnv = (input: NodeJS.ProcessEnv): EnvSchema => envSchema.parse(input);
