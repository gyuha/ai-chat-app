import { Module } from '@nestjs/common';

import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { OpenrouterChatService } from './openrouter-chat.service';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService, OpenrouterChatService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
