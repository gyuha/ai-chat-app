import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, MessageService],
  exports: [ChatService, MessageService],
})
export class ChatModule {}
