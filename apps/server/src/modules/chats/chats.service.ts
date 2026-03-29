import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { ChatDetail, ChatSettings } from '@repo/contracts';

import { APP_CONFIG, type AppConfig, CHAT_REPOSITORY } from '../../shared/tokens.js';
import type { ChatRepository } from './chats.repository.js';

export interface CreateChatRequest {
  title?: string;
  settings?: Partial<ChatSettings>;
}

@Injectable()
export class ChatsService {
  constructor(
    @Inject(CHAT_REPOSITORY) private readonly chatRepository: ChatRepository,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  list() {
    return this.chatRepository.list();
  }

  async get(chatId: string) {
    const chat = await this.chatRepository.get(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat ${chatId} not found`);
    }

    return chat;
  }

  async create(input?: CreateChatRequest): Promise<ChatDetail> {
    const defaultModel = this.config.openRouter.models[0];
    if (!defaultModel) {
      throw new NotFoundException('No allowlisted models available');
    }

    return this.chatRepository.create({
      title: input?.title,
      settings: {
        modelId: input?.settings?.modelId ?? defaultModel.id,
        systemPrompt: input?.settings?.systemPrompt ?? '',
      },
    });
  }
}
