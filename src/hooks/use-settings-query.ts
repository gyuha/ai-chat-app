import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteApiKey,
  getSettings,
  replaceApiKeyAfterValidation,
  saveApiKeyAfterValidation,
  setDefaultModelId,
  setDefaultSystemPrompt,
} from '@/lib/settings-service';

export const settingsQueryKey = ['settings'] as const;

export function useSettingsQuery() {
  return useQuery({
    queryFn: getSettings,
    queryKey: settingsQueryKey,
  });
}

export function useSettingsActions() {
  const queryClient = useQueryClient();

  async function refreshSettings() {
    const nextSettings = await getSettings();

    queryClient.setQueryData(settingsQueryKey, nextSettings);
  }

  return {
    deleteApiKey: async () => {
      await deleteApiKey();
      await refreshSettings();
      await queryClient.invalidateQueries({
        queryKey: ['free-models'],
      });
    },
    replaceApiKeyAfterValidation: async (apiKey: string) => {
      await replaceApiKeyAfterValidation(apiKey);
      await refreshSettings();
      await queryClient.invalidateQueries({
        queryKey: ['free-models'],
      });
    },
    saveApiKeyAfterValidation: async (apiKey: string) => {
      await saveApiKeyAfterValidation(apiKey);
      await refreshSettings();
      await queryClient.invalidateQueries({
        queryKey: ['free-models'],
      });
    },
    setDefaultModelId: async (modelId: string | null) => {
      await setDefaultModelId(modelId);
      await refreshSettings();
    },
    setDefaultSystemPrompt: async (systemPrompt: string | null) => {
      await setDefaultSystemPrompt(systemPrompt);
      await refreshSettings();
    },
  };
}
