import { useQuery } from "@tanstack/react-query";
import { fetchFreeModels } from "@/services/openrouter-api";

export interface ModelInfo {
  id: string;
  name: string;
  contextLength?: number;
  description?: string;
}

export function useFreeModels() {
  return useQuery<ModelInfo[]>({
    queryKey: ["free-models"],
    queryFn: () => fetchFreeModels(),
    staleTime: 1000 * 60 * 30, // 30분 캐시
    gcTime: 1000 * 60 * 60, // 1시간 GC
  });
}
