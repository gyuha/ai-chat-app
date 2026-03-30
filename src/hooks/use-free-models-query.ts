import { useQuery } from '@tanstack/react-query';

import { fetchFreeOpenRouterModels } from '@/lib/openrouter-client';
import { clearInvalidDefaultModel } from '@/lib/settings-service';

export function useFreeModelsQuery(apiKey: string | null | undefined) {
  return useQuery({
    enabled: Boolean(apiKey),
    queryFn: async () => {
      if (!apiKey) {
        return [];
      }

      const models = await fetchFreeOpenRouterModels(apiKey);

      await clearInvalidDefaultModel(models);

      return models;
    },
    queryKey: ['free-models', apiKey],
    staleTime: 600000,
  });
}
