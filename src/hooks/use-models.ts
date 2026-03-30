import { useQuery } from "@tanstack/react-query"

export interface OpenRouterModel {
  id: string
  name?: string
  description?: string
  pricing?: {
    prompt: number
    completion: number
  }
}

export interface UseModelsReturn {
  data: OpenRouterModel[] | undefined
  isLoading: boolean
  error: Error | null
}

export function useModels(apiKey: string | null) {
  return useQuery({
    queryKey: ["models", apiKey],
    queryFn: async (): Promise<OpenRouterModel[]> => {
      if (!apiKey) {
        throw new Error("API key required")
      }

      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`)
      }

      const data = await response.json()
      return data.data || []
    },
    enabled: !!apiKey,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  })
}
