import Dexie, { type EntityTable } from "dexie";

export interface Setting {
  key: string;
  value: string;
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  systemPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

class OpenRouterChatDB extends Dexie {
  settings!: EntityTable<Setting, "key">;
  conversations!: EntityTable<Conversation, "id">;
  messages!: EntityTable<Message, "id">;

  constructor() {
    super("openrouter-chat-db");
    this.version(1).stores({
      settings: "key",
      conversations: "id, updatedAt",
      messages: "id, conversationId, createdAt",
    });
  }
}

export const db = new OpenRouterChatDB();
