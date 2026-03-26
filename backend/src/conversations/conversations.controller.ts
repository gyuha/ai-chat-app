import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { SessionUser } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConversationDetailDto } from './dto/conversation-detail.dto';
import { ConversationsService } from './conversations.service';
import { ConversationSummaryDto } from './dto/conversation-summary.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { OpenrouterChatService } from './openrouter-chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly openrouterChatService: OpenrouterChatService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: SessionUser,
    @Body() dto: CreateConversationDto,
  ): Promise<ConversationSummaryDto> {
    return this.conversationsService.createConversation(user.id, dto.mode);
  }

  @Get()
  list(@CurrentUser() user: SessionUser): Promise<ConversationSummaryDto[]> {
    return this.conversationsService.listForUser(user.id);
  }

  @Get(':id')
  get(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
  ): Promise<ConversationDetailDto> {
    return this.conversationsService.getForUser(user.id, id);
  }

  @Post(':id/chat')
  chat(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @Res() response: Response,
  ): Promise<void> {
    return this.openrouterChatService.streamConversation({
      response,
      userId: user.id,
      conversationId: id,
      content: dto.content,
    });
  }
}
