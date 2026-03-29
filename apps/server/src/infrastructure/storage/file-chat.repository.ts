import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ChatDetail, ChatMessage } from '@repo/contracts';

import type { ChatRepository, CreateChatInput } from '../../modules/chats/chats.repository.js';

const createId = () => crypto.randomUUID();

export class FileChatRepository implements ChatRepository {
  constructor(private readonly directory: string) {}

  private getPath(chatId: string) {
    return join(this.directory, `${chatId}.json`);
  }

  private async ensureDir() {
    await mkdir(this.directory, { recursive: true });
  }

  private async save(chat: ChatDetail) {
    await this.ensureDir();
    await writeFile(this.getPath(chat.id), JSON.stringify(chat, null, 2), 'utf8');
  }

  private async load(chatId: string) {
    try {
      const content = await readFile(this.getPath(chatId), 'utf8');
      return JSON.parse(content) as ChatDetail;
    } catch {
      return null;
    }
  }

  async list() {
    await this.ensureDir();
    const indexPath = join(this.directory, 'index.json');
    try {
      const content = await readFile(indexPath, 'utf8');
      return JSON.parse(content) as ChatDetail[];
    } catch {
      return [];
    }
  }

  async get(chatId: string) {
    return this.load(chatId);
  }

  async create(input: CreateChatInput) {
    const now = new Date().toISOString();
    const chat: ChatDetail = {
      id: createId(),
      title: input.title ?? 'New chat',
      updatedAt: now,
      settings: input.settings,
      messages: [],
    };
    await this.save(chat);
    return chat;
  }

  async delete(chatId: string) {
    await rm(this.getPath(chatId), { force: true });
  }

  async appendMessage(chatId: string, message: ChatMessage) {
    const chat = await this.load(chatId);
    if (!chat) return;
    chat.messages.push(message);
    chat.updatedAt = new Date().toISOString();
    await this.save(chat);
  }

  async updateTitle(chatId: string, title: string) {
    const chat = await this.load(chatId);
    if (!chat) return;
    chat.title = title;
    chat.updatedAt = new Date().toISOString();
    await this.save(chat);
  }
}
