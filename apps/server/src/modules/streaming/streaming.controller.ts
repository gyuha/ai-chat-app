import { Controller, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

const writeEvent = (response: Response, event: string, data: Record<string, unknown>) => {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(data)}\n\n`);
};

@Controller('chats/:chatId')
export class StreamingController {
  @Post('messages/stream')
  streamMessage(@Param('chatId') chatId: string, @Res() response: Response) {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');

    writeEvent(response, 'message:start', {
      chatId,
      messageId: 'phase-1-skeleton',
      role: 'assistant',
    });
    writeEvent(response, 'heartbeat', { ok: true });
    writeEvent(response, 'message:done', { chatId, messageId: 'phase-1-skeleton' });
    response.end();
  }

  @Post('regenerate/stream')
  regenerateMessage(@Param('chatId') chatId: string, @Res() response: Response) {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');

    writeEvent(response, 'message:start', {
      chatId,
      messageId: 'phase-1-regenerate-skeleton',
      role: 'assistant',
    });
    writeEvent(response, 'heartbeat', { ok: true });
    writeEvent(response, 'message:done', {
      chatId,
      messageId: 'phase-1-regenerate-skeleton',
    });
    response.end();
  }
}
