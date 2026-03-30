import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useSetting,
  useSaveSetting,
  useDeleteSetting,
  SETTINGS_KEYS,
} from "@/hooks/use-settings";

function maskApiKey(key: string): string {
  if (key.length <= 3) return "sk-***";
  return `${key.slice(0, 5)}${"*".repeat(Math.max(key.length - 5, 4))}`;
}

export function ApiKeyInput() {
  const { data: apiKey, isLoading } = useSetting(SETTINGS_KEYS.API_KEY);
  const saveMutation = useSaveSetting();
  const deleteMutation = useDeleteSetting();
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const hasKey = apiKey !== null && apiKey !== undefined;
  const isSaving = saveMutation.isPending || deleteMutation.isPending;

  function handleSave() {
    if (!inputValue.trim()) return;
    saveMutation.mutate(
      { key: SETTINGS_KEYS.API_KEY, value: inputValue.trim() },
      {
        onSuccess: () => {
          setInputValue("");
          setEditMode(false);
        },
      },
    );
  }

  function handleChange() {
    setEditMode(true);
    setInputValue(apiKey ?? "");
  }

  function handleDelete() {
    if (window.confirm("API 키를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      deleteMutation.mutate(SETTINGS_KEYS.API_KEY, {
        onSuccess: () => {
          setEditMode(false);
          setInputValue("");
        },
      });
    }
  }

  function handleCancel() {
    setEditMode(false);
    setInputValue("");
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>OpenRouter API 키</Label>
        <div className="h-10 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (!hasKey || editMode) {
    return (
      <div className="space-y-2">
        <Label>OpenRouter API 키</Label>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="sk-or-..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSaving}
          />
          <Button onClick={handleSave} disabled={isSaving || !inputValue.trim()}>
            {saveMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </Button>
          {editMode && (
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              취소
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>OpenRouter API 키</Label>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
          {maskApiKey(apiKey)}
        </code>
        <Button variant="outline" onClick={handleChange} disabled={isSaving}>
          변경
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
          {deleteMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              삭제 중...
            </>
          ) : (
            "삭제"
          )}
        </Button>
      </div>
    </div>
  );
}
