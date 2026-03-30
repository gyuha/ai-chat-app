import Dexie, { type Table } from "dexie"

export interface Setting {
  key: string // "apiKey" | "defaultModel" | "systemPrompt"
  value: string
}

export interface Conversation {
  id?: number
  title: string
  createdAt: number
  updatedAt: number
}

export interface Message {
  id?: number
  conversationId: number
  role: "user" | "assistant" | "system"
  content: string
  createdAt: number
}

class ChatDatabase extends Dexie {
  settings!: Table<Setting>
  conversations!: Table<Conversation>
  messages!: Table<Message>

  constructor() {
    super("OpenRouterChat")
    this.version(1).stores({
      settings: "key",
      conversations: "++id, updatedAt",
      messages: "++id, conversationId, createdAt",
    })
  }
}

export const db = new ChatDatabase()

// Settings helpers
export async function getSetting(key: string): Promise<string | undefined> {
  const setting = await db.settings.get(key)
  return setting?.value
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value })
}

export async function deleteSetting(key: string): Promise<void> {
  await db.settings.delete(key)
}