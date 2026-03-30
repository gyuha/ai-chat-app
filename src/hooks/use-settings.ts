import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/db";

export const SETTINGS_KEYS = {
  API_KEY: "apiKey",
  DEFAULT_MODEL_ID: "defaultModelId",
  SYSTEM_PROMPT: "systemPrompt",
} as const;

export type SettingKey = (typeof SETTINGS_KEYS)[keyof typeof SETTINGS_KEYS];

export function useSetting(key: string) {
  return useQuery<string | null>({
    queryKey: ["settings", key],
    queryFn: async () => {
      const setting = await db.settings.get(key);
      return setting?.value ?? null;
    },
  });
}

export function useSaveSetting() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { key: string; value: string }>({
    mutationFn: async ({ key, value }) => {
      await db.settings.put({ key, value });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["settings", variables.key] });
    },
  });
}

export function useDeleteSetting() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (key) => {
      await db.settings.delete(key);
    },
    onSuccess: (_data, key) => {
      queryClient.invalidateQueries({ queryKey: ["settings", key] });
    },
  });
}
