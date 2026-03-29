import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';

import type { ChatDetail, ChatSettings, ChatSummary } from '@repo/contracts';

import { ChatsService } from './chats.service.js';

interface CreateChatBody {
  title?: string;
  settings?: Partial<ChatSettings>;
}

@Controller('chats')
export class ChatsController {
  constructor(@Inject(ChatsService) private readonly chatsService: ChatsService) {}

  @Get()
  listChats(): Promise<ChatSummary[]> {
    return this.chatsService.list();
  }

  @Get(':chatId')
  getChat(@Param('chatId') chatId: string): Promise<ChatDetail> {
    return this.chatsService.get(chatId);
  }

  @Post()
  createChat(@Body() body?: CreateChatBody): Promise<ChatDetail> {
    return this.chatsService.create(body);
  }
}
