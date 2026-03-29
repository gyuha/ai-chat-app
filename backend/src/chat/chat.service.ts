import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenRouterService } from '../openrouter/openrouter.service';
import { CreateChatDto, UpdateChatDto } from './dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private openRouterService: OpenRouterService,
  ) {}

  async createChat(userId: string, dto: CreateChatDto) {
    return this.prisma.chat.create({
      data: {
        userId,
        systemPrompt: dto.systemPrompt,
      },
    });
  }

  async getChats(userId: string) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getChatById(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return chat;
  }

  async deleteChat(chatId: string, userId: string) {
    const chat = await this.getChatById(chatId, userId);

    await this.prisma.chat.delete({
      where: { id: chatId },
    });

    return { message: 'Chat deleted successfully' };
  }

  async updateChat(chatId: string, userId: string, dto: UpdateChatDto) {
    await this.getChatById(chatId, userId);

    return this.prisma.chat.update({
      where: { id: chatId },
      data: dto,
    });
  }

  async generateTitleAsync(chatId: string, firstMessage: string) {
    // 비동기로 제목 생성 (사용자 요청을 차단하지 않음)
    setImmediate(async () => {
      try {
        this.logger.log(`Generating title for chat ${chatId}`);
        const title = await this.openRouterService.generateChatTitle(firstMessage);

        await this.prisma.chat.update({
          where: { id: chatId },
          data: { title },
        });

        this.logger.log(`Title generated for chat ${chatId}: ${title}`);
      } catch (error) {
        this.logger.error(`Failed to generate title for chat ${chatId}:`, error);
      }
    });
  }
}
