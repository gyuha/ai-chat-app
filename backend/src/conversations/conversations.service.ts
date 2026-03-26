import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ConversationSummaryDto } from './dto/conversation-summary.dto';

type CreateConversationMode = 'default' | 'bootstrap';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(
    userId: string,
    mode: CreateConversationMode = 'default',
  ): Promise<ConversationSummaryDto> {
    if (mode === 'bootstrap') {
      return this.prisma.$transaction(async (tx) => {
        const existing = await tx.conversation.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            title: true,
          },
        });

        if (existing) {
          return existing;
        }

        return tx.conversation.create({
          data: {
            userId,
            title: '새 대화',
          },
          select: {
            id: true,
            title: true,
          },
        });
      });
    }

    return this.prisma.conversation.create({
      data: {
        userId,
        title: '새 대화',
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  listForUser(userId: string): Promise<ConversationSummaryDto[]> {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
      },
    });
  }

  async getForUser(userId: string, id: string): Promise<ConversationSummaryDto> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }
}
