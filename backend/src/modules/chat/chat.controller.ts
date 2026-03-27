import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatCompletionDto } from './dto/chat-completion.dto';
import { User } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('api/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('completions')
  @HttpCode(HttpStatus.OK)
  async chatCompletion(
    @User() user: any,
    @Body() chatCompletionDto: ChatCompletionDto,
  ) {
    return this.chatService.chatCompletion(
      user.userId,
      chatCompletionDto.message,
      chatCompletionDto.chatId,
      chatCompletionDto.model,
    );
  }

  @Get('history')
  async getChatHistory(@User() user: any) {
    return this.chatService.getChatHistory(user.userId);
  }

  @Get(':chatId')
  async getChatDetail(
    @User() user: any,
    @Param('chatId') chatId: string,
  ) {
    return this.chatService.getChatDetail(user.userId, chatId);
  }
}
