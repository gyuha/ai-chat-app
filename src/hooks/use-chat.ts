import { useCallback } from "react"
import { useChatStore, type Message } from "@/stores/chat-store"
import { getSetting } from "@/db"

export interface UseChatReturn {
  sendMessage: (content: string) => Promise<void>
  stop: () => void
  isStreaming: boolean
  messages: Message[]
}

export function useChat(): UseChatReturn {
  const {
    messages,
    isStreaming,
    setStreaming,
    addMessage,
    updateStreamingMessage,
    setStreamingContent,
    abortController,
    setAbortController,
    selectedModel,
    systemPrompt,
  } = useChatStore()

  const stop = useCallback(() => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setStreaming(false)
    }
  }, [abortController, setAbortController, setStreaming])

  const sendMessage = useCallback(
    async (content: string) => {
      // Get API key and model
      const apiKey = await getSetting("apiKey")
      if (!apiKey) {
        throw new Error("API key not set")
      }

      const model = selectedModel || (await getSetting("defaultModel")) || "google/gemini-2.0-flash-thinking-exp-01-21"

      // Create abort controller for this request
      const controller = new AbortController()
      setAbortController(controller)

      // Add user message to store
      addMessage({ role: "user", content })

      // Start streaming
      setStreaming(true)
      setStreamingContent("")

      try {
        // Build messages for API
        const apiMessages: { role: string; content: string }[] = []
        if (systemPrompt) {
          apiMessages.push({ role: "system", content: systemPrompt })
        }
        // Include previous messages
        const previousMessages = useChatStore.getState().messages.slice(0, -1) // Exclude the one we just added
        for (const msg of previousMessages) {
          apiMessages.push({ role: msg.role, content: msg.content })
        }
        // Add current user message
        apiMessages.push({ role: "user", content })

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: apiMessages,
            stream: true,
          }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error?.message || `HTTP ${response.status}`)
        }

        // Add assistant message placeholder
        const assistantId = addMessage({ role: "assistant", content: "" })

        // Read streaming response
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error("No response body")
        }

        let assistantContent = ""
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue

              try {
                const parsed = JSON.parse(data)
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) {
                  assistantContent += delta
                  updateStreamingMessage(assistantContent)
                  setStreamingContent(assistantContent)
                }
              } catch {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }

        // Finalize the message
        useChatStore.getState().messages
        const messages = useChatStore.getState().messages
        const msgIndex = messages.findIndex((m) => m.id === assistantId)
        if (msgIndex !== -1) {
          messages[msgIndex] = { ...messages[msgIndex], content: assistantContent }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // User cancelled - stop was called
        } else {
          // Add error message
          addMessage({
            role: "assistant",
            content: `오류가 발생했습니다: ${(err as Error).message}`,
          })
          console.error("Chat error:", err)
        }
      } finally {
        setStreaming(false)
        setAbortController(null)
        setStreamingContent("")
      }
    },
    [
      selectedModel,
      systemPrompt,
      setStreaming,
      addMessage,
      updateStreamingMessage,
      setStreamingContent,
      setAbortController,
    ]
  )

  return {
    sendMessage,
    stop,
    isStreaming,
    messages,
  }
}
