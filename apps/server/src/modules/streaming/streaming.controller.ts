import { Body, Controller, Inject, Param, Post, Res } from '@nestjs/common';
import type { StreamEvent } from '@repo/contracts';
import type { Response } from 'express';

// biome-ignore lint/style/useImportType: Nest ValidationPipe needs the DTO as runtime metadata.
import { CreateMessageDto } from './dto/create-message.dto.js';
import { StreamingService } from './streaming.service.js';

const writeEvent = (response: Response, event: StreamEvent['event'], data: StreamEvent['data']) => {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(data)}\n\n`);
};

@Controller('chats/:chatId')
export class StreamingController {
  constructor(@Inject(StreamingService) private readonly streamingService: StreamingService) {}

  @Post('messages/stream')
  async streamMessage(
    @Param('chatId') chatId: string,
    @Body() body: CreateMessageDto,
    @Res() response: Response,
  ) {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders?.();

    const abortController = new AbortController();
    const stop = () => abortController.abort();
    response.on('close', stop);

    try {
      for await (const event of this.streamingService.streamMessage({
        chatId,
        prompt: body.prompt,
        signal: abortController.signal,
      })) {
        writeEvent(response, event.event, event.data);
      }
    } finally {
      response.off('close', stop);
      if (!response.writableEnded) {
        response.end();
      }
    }
  }

  @Post('regenerate/stream')
  async regenerateMessage(@Param('chatId') chatId: string, @Res() response: Response) {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders?.();

    const abortController = new AbortController();
    const stop = () => abortController.abort();
    response.on('close', stop);

    try {
      for await (const event of this.streamingService.streamRegenerate({
        chatId,
        signal: abortController.signal,
      })) {
        writeEvent(response, event.event, event.data);
      }
    } finally {
      response.off('close', stop);
      if (!response.writableEnded) {
        response.end();
      }
    }
  }
}
