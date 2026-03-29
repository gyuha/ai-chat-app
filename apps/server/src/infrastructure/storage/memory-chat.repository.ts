import type { ChatDetail, ChatMessage } from '@repo/contracts';

import type { ChatRepository, CreateChatInput } from '../../modules/chats/chats.repository.js';

const createId = () => crypto.randomUUID();

export class MemoryChatRepository implements ChatRepository {
  private readonly chats = new Map<string, ChatDetail>();
  private lastTimestamp = 0;

  private nextTimestamp() {
    const now = Date.now();
    this.lastTimestamp = now > this.lastTimestamp ? now : this.lastTimestamp + 1;
    return new Date(this.lastTimestamp).toISOString();
  }

  async list() {
    return [...this.chats.values()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(({ messages: _messages, ...summary }) => summary);
  }

  async get(chatId: string) {
    return this.chats.get(chatId) ?? null;
  }

  async create(input: CreateChatInput) {
    const now = this.nextTimestamp();
    const chat: ChatDetail = {
      id: createId(),
      title: input.title ?? 'New chat',
      updatedAt: now,
      settings: input.settings,
      messages: [],
    };

    this.chats.set(chat.id, chat);
    return chat;
  }

  async delete(chatId: string) {
    this.chats.delete(chatId);
  }

  async appendMessage(chatId: string, message: ChatMessage) {
    const chat = this.chats.get(chatId);
    if (!chat) return;
    chat.messages.push(message);
    chat.updatedAt = this.nextTimestamp();
  }

  async replaceMessages(chatId: string, messages: ChatMessage[]) {
    const chat = this.chats.get(chatId);
    if (!chat) return;
    chat.messages = messages;
    chat.updatedAt = this.nextTimestamp();
  }

  async updateTitle(chatId: string, title: string) {
    const chat = this.chats.get(chatId);
    if (!chat) return;
    chat.title = title;
    chat.updatedAt = this.nextTimestamp();
  }
}
