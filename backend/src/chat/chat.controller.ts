import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards, Req, Res, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { CreateChatDto, UpdateChatDto } from './dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { OpenRouterService } from '../openrouter/openrouter.service';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private openRouterService: OpenRouterService,
  ) {}

  @Post()
  createChat(@Req() req, @Body() dto: CreateChatDto) {
    return this.chatService.createChat(req.user.userId, dto);
  }

  @Get()
  getChats(@Req() req) {
    return this.chatService.getChats(req.user.userId);
  }

  @Get(':id')
  getChat(@Param('id') id: string, @Req() req) {
    return this.chatService.getChatById(id, req.user.userId);
  }

  @Delete(':id')
  deleteChat(@Param('id') id: string, @Req() req) {
    return this.chatService.deleteChat(id, req.user.userId);
  }

  @Put(':id')
  updateChat(@Param('id') id: string, @Req() req, @Body() dto: UpdateChatDto) {
    return this.chatService.updateChat(id, req.user.userId, dto);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') chatId: string,
    @Req() req,
    @Body() dto: CreateMessageDto,
    @Res() res: Response,
  ) {
    // 대화 소유권 확인
    const chat = await this.chatService.getChatById(chatId, req.user.userId);

    // 사용자 메시지 저장
    await this.messageService.createMessage(chatId, dto.content, 'user', 'completed');

    // 첫 번째 메시지인 경우 제목 생성 트리거
    const messages = await this.messageService.getMessages(chatId);
    if (messages.length === 1) {
      this.chatService.generateTitleAsync(chatId, dto.content);
    }

    // AI 메시지를 streaming 상태로 생성
    const assistantMessage = await this.messageService.createMessage(
      chatId,
      '',
      'assistant',
      'streaming',
    );

    // 이전 대화 기록 로드 (메시지 목록은 이미 가져옴)

    // OpenRouter API 호출을 위한 메시지 배열 구성
    const apiMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 시스템 프롬프트 추가
    if (chat.systemPrompt) {
      apiMessages.unshift({
        role: 'system',
        content: chat.systemPrompt,
      });
    }

    // AbortController 생성 (클라이언트 연결 해제 시 사용)
    const abortController = new AbortController();

    // 클라이언트 연결 해제 시 요청 취소
    req.on('close', () => {
      if (!res.writableEnded) {
        abortController.abort();
      }
    });

    // SSE 헤더 설정
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      // OpenRouter 스트리밍 호출
      const stream = await this.openRouterService.streamChat(
        apiMessages,
        dto.model,
        abortController.signal,
      );

      let fullContent = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullContent += content;

        // SSE 형식으로 전송
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }

      // 스트리밍 완료 후 메시지 업데이트
      await this.messageService.updateMessageContent(assistantMessage.id, fullContent);
      await this.messageService.updateMessageStatus(assistantMessage.id, 'completed');

      // 완료 신호 전송
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      // 에러 처리
      if (error.name === 'AbortError') {
        await this.messageService.updateMessageStatus(assistantMessage.id, 'stopped');
        res.write('data: {"error":"stopped"}\n\n');
      } else {
        await this.messageService.updateMessageStatus(assistantMessage.id, 'error');
        res.write(`data: {"error":"${error.message}"}\n\n`);
      }
      res.end();
    }
  }

  @Get(':id/messages')
  async getMessages(
    @Param('id') chatId: string,
    @Req() req,
    @Query('cursor') cursor?: string,
    @Query('limit', new DefaultValuePipe(50), new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    // 대화 소유권 확인
    await this.chatService.getChatById(chatId, req.user.userId);

    // limit 최대값 제한
    const sanitizedLimit = Math.min(limit || 50, 100);

    return this.messageService.getMessages(chatId, sanitizedLimit, cursor);
  }
}
