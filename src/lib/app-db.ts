import Dexie, { type EntityTable } from 'dexie';

export const SETTINGS_KEYS = {
  defaultModelId: 'defaultModelId',
  defaultSystemPrompt: 'defaultSystemPrompt',
  openRouterApiKey: 'openRouterApiKey',
} as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[keyof typeof SETTINGS_KEYS];

export type SettingRecord = {
  key: SettingsKey;
  value: string;
};

class AppDatabase extends Dexie {
  settings!: EntityTable<SettingRecord, 'key'>;

  constructor() {
    super('openrouter-chat-db');

    this.version(1).stores({
      settings: 'key',
    });
  }
}

export const appDb = new AppDatabase();

export async function getSetting(key: SettingsKey) {
  return appDb.settings.get(key);
}

export async function getSettingsSnapshot() {
  const entries = await appDb.settings.toArray();

  return {
    defaultModelId:
      entries.find((entry) => entry.key === SETTINGS_KEYS.defaultModelId)
        ?.value ?? null,
    defaultSystemPrompt:
      entries.find((entry) => entry.key === SETTINGS_KEYS.defaultSystemPrompt)
        ?.value ?? null,
    openRouterApiKey:
      entries.find((entry) => entry.key === SETTINGS_KEYS.openRouterApiKey)
        ?.value ?? null,
  };
}

export async function removeSetting(key: SettingsKey) {
  await appDb.settings.delete(key);
}

export async function resetAppDb() {
  await appDb.settings.clear();
}

export async function setSetting(key: SettingsKey, value: string) {
  await appDb.settings.put({
    key,
    value,
  });
}
