import { useState, useEffect } from "react"
import { getSetting, setSetting, deleteSetting } from "@/db"

export interface UseSettingsReturn {
  apiKey: string | null
  defaultModel: string | null
  systemPrompt: string
  isLoading: boolean
  error: string | null
  saveApiKey: (key: string) => Promise<boolean>
  clearApiKey: () => Promise<void>
  saveDefaultModel: (model: string) => Promise<void>
  saveSystemPrompt: (prompt: string) => Promise<void>
}

export function useSettings(): UseSettingsReturn {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [defaultModel, setDefaultModel] = useState<string | null>(null)
  const [systemPrompt, setSystemPrompt] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [storedApiKey, storedModel, storedPrompt] = await Promise.all([
          getSetting("apiKey"),
          getSetting("defaultModel"),
          getSetting("systemPrompt"),
        ])
        if (storedApiKey) setApiKey(storedApiKey)
        if (storedModel) setDefaultModel(storedModel)
        if (storedPrompt !== undefined) setSystemPrompt(storedPrompt)
      } catch (err) {
        setError("설정을 불러오는데 실패했습니다.")
        console.error("Failed to load settings:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const saveApiKey = async (key: string): Promise<boolean> => {
    setError(null)
    try {
      // Basic validation - try to save it
      await setSetting("apiKey", key)
      setApiKey(key)
      return true
    } catch (err) {
      setError("API 키 저장에 실패했습니다.")
      console.error("Failed to save API key:", err)
      return false
    }
  }

  const clearApiKey = async (): Promise<void> => {
    setError(null)
    try {
      await deleteSetting("apiKey")
      setApiKey(null)
    } catch (err) {
      setError("API 키 삭제에 실패했습니다.")
      console.error("Failed to clear API key:", err)
    }
  }

  const saveDefaultModel = async (model: string): Promise<void> => {
    try {
      await setSetting("defaultModel", model)
      setDefaultModel(model)
    } catch (err) {
      console.error("Failed to save default model:", err)
    }
  }

  const saveSystemPrompt = async (prompt: string): Promise<void> => {
    try {
      await setSetting("systemPrompt", prompt)
      setSystemPrompt(prompt)
    } catch (err) {
      console.error("Failed to save system prompt:", err)
    }
  }

  return {
    apiKey,
    defaultModel,
    systemPrompt,
    isLoading,
    error,
    saveApiKey,
    clearApiKey,
    saveDefaultModel,
    saveSystemPrompt,
  }
}
