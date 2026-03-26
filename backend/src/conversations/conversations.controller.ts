import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { SessionUser } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConversationsService } from './conversations.service';
import { ConversationSummaryDto } from './dto/conversation-summary.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

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
  ): Promise<ConversationSummaryDto> {
    return this.conversationsService.getForUser(user.id, id);
  }
}
