import { useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsQueryKey } from '@/hooks/use-settings-query';
import { fetchFreeOpenRouterModels } from '@/lib/openrouter-client';
import { clearInvalidDefaultModel, getSettings } from '@/lib/settings-service';

export function useFreeModelsQuery(apiKey: string | null | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    enabled: Boolean(apiKey),
    queryFn: async () => {
      if (!apiKey) {
        return [];
      }

      const models = await fetchFreeOpenRouterModels(apiKey);

      const clearedInvalidModel = await clearInvalidDefaultModel(models);

      if (clearedInvalidModel) {
        const nextSettings = await getSettings();

        queryClient.setQueryData(settingsQueryKey, nextSettings);
      }

      return models;
    },
    queryKey: ['free-models', apiKey],
    staleTime: 600000,
  });
}
