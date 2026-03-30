import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSettings } from "@/hooks/use-settings"
import { useModels } from "@/hooks/use-models"
import { useToast, ToastContainer } from "@/components/ui/toast"

export function SettingsPage() {
  const {
    apiKey,
    defaultModel,
    systemPrompt,
    saveApiKey,
    clearApiKey,
    saveDefaultModel,
    saveSystemPrompt,
    error: settingsError,
  } = useSettings()

  const [localKey, setLocalKey] = useState("")
  const [localModel, setLocalModel] = useState(defaultModel || "")
  const [localPrompt, setLocalPrompt] = useState(systemPrompt)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const { toast, toasts } = useToast()

  const { data: models, isLoading: modelsLoading } = useModels(apiKey)

  useEffect(() => {
    if (defaultModel) setLocalModel(defaultModel)
  }, [defaultModel])

  useEffect(() => {
    if (systemPrompt !== undefined) setLocalPrompt(systemPrompt)
  }, [systemPrompt])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (localKey) {
        const valid = await saveApiKey(localKey)
        if (!valid) {
          toast({ title: "오류", description: "API 키가 유효하지 않습니다.", variant: "destructive" })
          setIsSaving(false)
          return
        }
      }
      if (localModel) {
        await saveDefaultModel(localModel)
      }
      await saveSystemPrompt(localPrompt)
      toast({ title: "저장 완료", description: "설정이 저장되었습니다." })
      if (localKey) setLocalKey("")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteKey = async () => {
    await clearApiKey()
    toast({ title: "삭제 완료", description: "API 키가 삭제되었습니다." })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ToastContainer toasts={toasts} />
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-lg font-semibold">설정</h1>
          <Button variant="ghost" onClick={() => navigate({ to: "/" })}>
            ← 채팅으로
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-8 max-w-2xl space-y-8">
        {/* API Key Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">API 키</h2>
          <div className="space-y-3">
            {apiKey ? (
              <>
                <Input
                  type="password"
                  value="••••••••••••••••"
                  disabled
                  className="bg-muted"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newKey = window.prompt("새 API 키를 입력하세요")
                      if (newKey) setLocalKey(newKey)
                    }}
                    className="flex-1"
                  >
                    변경
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteKey}
                    className="flex-1"
                  >
                    삭제
                  </Button>
                </div>
              </>
            ) : (
              <Input
                type="password"
                placeholder="OpenRouter API 키를 입력하세요"
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
              />
            )}
            {settingsError && (
              <p className="text-sm text-destructive">{settingsError}</p>
            )}
          </div>
        </section>

        {/* Model Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">기본 모델</h2>
          <Select
            value={localModel}
            onValueChange={setLocalModel}
            disabled={modelsLoading || !apiKey}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={apiKey ? "모델 선택" : "먼저 API 키를 입력하세요"} />
            </SelectTrigger>
            <SelectContent>
              {models?.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name || model.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* System Prompt Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">시스템 프롬프트</h2>
          <Textarea
            placeholder="AI의 동작을 지정하는 프롬프트를 입력하세요 (선택)"
            value={localPrompt}
            onChange={(e) => setLocalPrompt(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </section>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
          size="lg"
        >
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </main>
    </div>
  )
}
