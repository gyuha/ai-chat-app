import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ChatDetail, ChatMessage } from '@repo/contracts';

import type { ChatRepository, CreateChatInput } from '../../modules/chats/chats.repository.js';

const createId = () => crypto.randomUUID();

export class FileChatRepository implements ChatRepository {
  private lastTimestamp = 0;

  constructor(private readonly directory: string) {}

  private getPath(chatId: string) {
    return join(this.directory, `${chatId}.json`);
  }

  private nextTimestamp() {
    const now = Date.now();
    this.lastTimestamp = now > this.lastTimestamp ? now : this.lastTimestamp + 1;
    return new Date(this.lastTimestamp).toISOString();
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
    const entries = await readdir(this.directory);
    const chats = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) => {
          try {
            const content = await readFile(join(this.directory, entry), 'utf8');
            return JSON.parse(content) as ChatDetail;
          } catch {
            return null;
          }
        }),
    );

    return chats
      .filter((chat): chat is ChatDetail => chat !== null)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(({ messages: _messages, ...summary }) => summary);
  }

  async get(chatId: string) {
    return this.load(chatId);
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
    chat.updatedAt = this.nextTimestamp();
    await this.save(chat);
  }

  async updateTitle(chatId: string, title: string) {
    const chat = await this.load(chatId);
    if (!chat) return;
    chat.title = title;
    chat.updatedAt = this.nextTimestamp();
    await this.save(chat);
  }
}
