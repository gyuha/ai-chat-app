import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useSetting,
  useSaveSetting,
  SETTINGS_KEYS,
} from "@/hooks/use-settings";

const DEFAULT_PROMPT = "You are a helpful assistant.";

export function SystemPromptInput() {
  const { data: savedPrompt, isLoading } = useSetting(SETTINGS_KEYS.SYSTEM_PROMPT);
  const saveMutation = useSaveSetting();
  const [inputValue, setInputValue] = useState<string | null>(null);

  const displayValue = inputValue ?? savedPrompt ?? DEFAULT_PROMPT;
  const isSaving = saveMutation.isPending;
  const hasChanges = inputValue !== null && inputValue !== (savedPrompt ?? DEFAULT_PROMPT);

  function handleSave() {
    if (inputValue === null) return;
    saveMutation.mutate(
      { key: SETTINGS_KEYS.SYSTEM_PROMPT, value: inputValue },
      {
        onSuccess: () => {
          setInputValue(null);
        },
      },
    );
  }

  function handleReset() {
    setInputValue(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>시스템 프롬프트</Label>
        <div className="h-20 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label>시스템 프롬프트</Label>
        <p className="text-xs text-muted-foreground">
          AI의 동작 방식을 제어하는 지시사항입니다.
        </p>
      </div>
      <Textarea
        value={displayValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isSaving}
        rows={3}
        className="min-h-[72px]"
      />
      {hasChanges && (
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving || !inputValue?.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" />
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            취소
          </Button>
        </div>
      )}
    </div>
  );
}
