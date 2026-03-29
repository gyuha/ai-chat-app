import { describe, expect, it } from 'vitest';

import { iterateSseStream } from './sse';

const encoder = new TextEncoder();

const readEvents = async (chunks: string[]) => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  const events = [];
  for await (const event of iterateSseStream(stream)) {
    events.push(event);
  }

  return events;
};

describe('iterateSseStream', () => {
  it('parses events across arbitrary chunk boundaries', async () => {
    const events = await readEvents([
      'event: message:start\n',
      'data: {"chatId":"chat-1","messageId":"m-1"}\n\n',
      'event: message:delta\n',
      'data: {"chatId":"chat-1","messageId":"m-1","delta":"Hel',
      'lo","content":"Hello"}\n\n',
    ]);

    expect(events).toEqual([
      {
        event: 'message:start',
        data: {
          chatId: 'chat-1',
          messageId: 'm-1',
        },
      },
      {
        event: 'message:delta',
        data: {
          chatId: 'chat-1',
          messageId: 'm-1',
          delta: 'Hello',
          content: 'Hello',
        },
      },
    ]);
  });
});
