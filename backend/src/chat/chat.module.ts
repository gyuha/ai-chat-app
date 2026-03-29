import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { OpenRouterModule } from '../openrouter/openrouter.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [OpenRouterModule, PrismaModule],
  controllers: [ChatController],
  providers: [ChatService, MessageService],
  exports: [ChatService, MessageService],
})
export class ChatModule {}
