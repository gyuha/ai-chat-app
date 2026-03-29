import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(chatId: string, content: string, role: string, status: string = 'completed') {
    return this.prisma.message.create({
      data: {
        chatId,
        content,
        role,
        status,
      },
    });
  }

  async getMessages(chatId: string, limit: number = 50, cursor?: string) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
    });
  }

  async updateMessageStatus(messageId: string, status: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { status },
    });
  }

  async updateMessageContent(messageId: string, content: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { content },
    });
  }

  async getLastAssistantMessage(chatId: string) {
    return this.prisma.message.findFirst({
      where: {
        chatId,
        role: 'assistant',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteMessage(messageId: string) {
    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }
}
