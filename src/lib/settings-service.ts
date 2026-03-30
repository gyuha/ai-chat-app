import {
  getSettingsSnapshot,
  removeSetting,
  SETTINGS_KEYS,
  setSetting,
} from '@/lib/app-db';
import type { OpenRouterModel } from '@/lib/openrouter-client';

export type AppSettings = {
  defaultModelId: string | null;
  defaultSystemPrompt: string | null;
  openRouterApiKey: string | null;
};

function normalizeTextValue(value: string | null | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

export async function clearInvalidDefaultModel(models: OpenRouterModel[]) {
  const settings = await getSettings();

  if (!settings.defaultModelId) {
    return false;
  }

  const hasMatchingModel = models.some(
    (model) => model.id === settings.defaultModelId,
  );

  if (hasMatchingModel) {
    return false;
  }

  await removeSetting(SETTINGS_KEYS.defaultModelId);

  return true;
}

export async function deleteApiKey() {
  await removeSetting(SETTINGS_KEYS.openRouterApiKey);
}

export async function getSettings(): Promise<AppSettings> {
  return getSettingsSnapshot();
}

export async function replaceApiKeyAfterValidation(apiKey: string) {
  await setSetting(SETTINGS_KEYS.openRouterApiKey, apiKey);
}

export async function saveApiKeyAfterValidation(apiKey: string) {
  await setSetting(SETTINGS_KEYS.openRouterApiKey, apiKey);
}

export async function setDefaultModelId(modelId: string | null) {
  const normalizedModelId = normalizeTextValue(modelId);

  if (!normalizedModelId) {
    await removeSetting(SETTINGS_KEYS.defaultModelId);
    return;
  }

  await setSetting(SETTINGS_KEYS.defaultModelId, normalizedModelId);
}

export async function setDefaultSystemPrompt(systemPrompt: string | null) {
  const normalizedPrompt = normalizeTextValue(systemPrompt);

  if (!normalizedPrompt) {
    await removeSetting(SETTINGS_KEYS.defaultSystemPrompt);
    return;
  }

  await setSetting(SETTINGS_KEYS.defaultSystemPrompt, normalizedPrompt);
}
