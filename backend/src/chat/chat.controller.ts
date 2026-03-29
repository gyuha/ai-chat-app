import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatDto, UpdateChatDto } from './dto';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

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
}
