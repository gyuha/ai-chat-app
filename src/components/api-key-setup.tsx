import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/hooks/use-settings"

export function ApiKeySetup() {
  const [isEditing, setIsEditing] = useState(false)
  const [key, setKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { saveApiKey } = useSettings()

  const handleSave = async () => {
    if (!key.trim()) return
    setError(null)
    setIsValidating(true)

    const success = await saveApiKey(key.trim())

    setIsValidating(false)
    if (success) {
      // Refresh the page to show the chat interface
      window.location.reload()
    } else {
      setError("API 키가 유효하지 않습니다. 다시 확인해 주세요.")
    }
  }

  if (!isEditing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-4 w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              OpenRouter API 키가 필요합니다
            </h1>
            <p className="text-sm text-muted-foreground">
              무료 AI 모델과 대화하려면 API 키를 입력해 주세요.
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            className="w-full"
            size="lg"
          >
            API 키 입력
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-4 w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">OpenRouter API 키 입력</h2>
          <p className="text-sm text-muted-foreground">
            openrouter.ai에서 API 키를 생성할 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <Input
            type="password"
            placeholder="OpenRouter API 키를 입력하세요"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={isValidating}
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setKey("")
                setError(null)
              }}
              disabled={isValidating}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={!key.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? "확인 중..." : "API 키 저장"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
