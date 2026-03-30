import { useFreeModels } from "@/hooks/use-free-models";
import { useSetting, SETTINGS_KEYS } from "@/hooks/use-settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface ModelSelectorPopoverProps {
  modelId: string;
  onModelChange: (modelId: string) => void;
}

function formatContextLength(bytes?: number): string {
  if (!bytes) return "";
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)}M`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)}K`;
  return String(bytes);
}

export function ModelSelectorPopover({
  modelId,
  onModelChange,
}: ModelSelectorPopoverProps) {
  const { data: models, isLoading, isError } = useFreeModels();
  const { data: defaultModelId } = useSetting(SETTINGS_KEYS.DEFAULT_MODEL_ID);

  const currentModel =
    models?.find((m) => m.id === modelId) ??
    models?.find((m) => m.id === defaultModelId);

  if (isLoading) {
    return <Skeleton className="h-8 w-40" />;
  }

  if (isError || !models) {
    return (
      <span className="text-sm text-muted-foreground">
        모델을 불러올 수 없습니다
      </span>
    );
  }

  if (models.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">
        사용 가능한 무료 모델이 없습니다
      </span>
    );
  }

  return (
    <Select value={modelId} onValueChange={onModelChange}>
      <SelectTrigger size="sm" className="w-[200px] cursor-pointer">
        <SelectValue>
          {currentModel?.name ?? modelId}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <span className="truncate">
              {model.name}
              {model.contextLength
                ? ` (${formatContextLength(model.contextLength)})`
                : ""}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
