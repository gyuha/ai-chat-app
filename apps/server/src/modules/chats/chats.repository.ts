import type { ChatDetail, ChatMessage, ChatSettings, ChatSummary } from '@repo/contracts';

export interface CreateChatInput {
  title?: string;
  settings: ChatSettings;
}

export interface ChatRepository {
  list(): Promise<ChatSummary[]>;
  get(chatId: string): Promise<ChatDetail | null>;
  create(input: CreateChatInput): Promise<ChatDetail>;
  delete(chatId: string): Promise<void>;
  appendMessage(chatId: string, message: ChatMessage): Promise<void>;
  replaceMessages(chatId: string, messages: ChatMessage[]): Promise<void>;
  updateTitle(chatId: string, title: string): Promise<void>;
}
