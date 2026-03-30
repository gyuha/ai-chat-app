import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useSettings } from "@/hooks/use-settings"
import { useModels } from "@/hooks/use-models"
import { useChatStore } from "@/stores/chat-store"

export function ModelSelector() {
  const { apiKey, defaultModel, saveDefaultModel } = useSettings()
  const { data: models, isLoading } = useModels(apiKey)
  const selectedModel = useChatStore((s) => s.selectedModel)

  const handleSelect = (modelId: string) => {
    useChatStore.getState().setSelectedModel(modelId)
    saveDefaultModel(modelId)
  }

  if (isLoading) {
    return <Skeleton className="w-[200px] h-9" />
  }

  return (
    <Select
      value={selectedModel || defaultModel || ""}
      onValueChange={handleSelect}
      disabled={!apiKey}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="모델 선택" />
      </SelectTrigger>
      <SelectContent>
        {models?.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name || model.id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
