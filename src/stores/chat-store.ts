import { create } from "zustand"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: number
}

interface ChatState {
  messages: Message[]
  isStreaming: boolean
  abortController: AbortController | null
  selectedModel: string | null
  systemPrompt: string

  // Streaming message being built (for real-time token updates)
  streamingContent: string

  // Actions
  addMessage: (msg: Omit<Message, "id" | "createdAt">) => string // returns id
  updateStreamingMessage: (content: string) => void
  setStreaming: (streaming: boolean) => void
  setAbortController: (controller: AbortController | null) => void
  setStreamingContent: (content: string) => void
  clearMessages: () => void
  setSelectedModel: (model: string | null) => void
  setSystemPrompt: (prompt: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  abortController: null,
  selectedModel: null,
  systemPrompt: "",
  streamingContent: "",

  addMessage: (msg) => {
    const id = crypto.randomUUID()
    const createdAt = Date.now()
    set((state) => ({
      messages: [...state.messages, { ...msg, id, createdAt }],
    }))
    return id
  },

  updateStreamingMessage: (content) =>
    set((state) => {
      const lastMsg = state.messages[state.messages.length - 1]
      if (lastMsg && lastMsg.role === "assistant") {
        const updated = [...state.messages]
        updated[updated.length - 1] = { ...lastMsg, content }
        return { messages: updated }
      }
      return {}
    }),

  setStreaming: (isStreaming) => set({ isStreaming }),
  setAbortController: (abortController) => set({ abortController }),
  setStreamingContent: (streamingContent) => set({ streamingContent }),

  clearMessages: () => set({ messages: [], streamingContent: "" }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
}))