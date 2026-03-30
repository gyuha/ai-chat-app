import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  useSetting,
  useSaveSetting,
  SETTINGS_KEYS,
} from "@/hooks/use-settings";

const FREE_MODELS = [
  { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B" },
  { id: "meta-llama/llama-4-maverick:free", name: "Llama 4 Maverick" },
  { id: "qwen/qwen3-32b:free", name: "Qwen 3 32B" },
  { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek V3" },
] as const;

export function ModelSelector() {
  const { data: modelId, isLoading } = useSetting(SETTINGS_KEYS.DEFAULT_MODEL_ID);
  const saveMutation = useSaveSetting();
  const isSaving = saveMutation.isPending;

  function handleValueChange(value: string) {
    saveMutation.mutate({ key: SETTINGS_KEYS.DEFAULT_MODEL_ID, value });
  }

  return (
    <div className="space-y-2">
      <Label>기본 모델</Label>
      <Select
        value={modelId ?? ""}
        onValueChange={handleValueChange}
        disabled={isLoading || isSaving}
      >
        <SelectTrigger>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              불러오는 중...
            </span>
          ) : (
            <SelectValue placeholder="모델을 선택하세요" />
          )}
        </SelectTrigger>
        <SelectContent>
          {FREE_MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
