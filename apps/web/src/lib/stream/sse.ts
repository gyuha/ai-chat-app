import type { StreamEvent } from '@repo/contracts';

const parseFrame = (frame: string): StreamEvent | null => {
  const normalized = frame.trim();
  if (!normalized) {
    return null;
  }

  let eventName = 'message';
  const dataLines: string[] = [];

  for (const line of normalized.split('\n')) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
      continue;
    }

    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }

  if (!dataLines.length) {
    return null;
  }

  return {
    event: eventName as StreamEvent['event'],
    data: JSON.parse(dataLines.join('\n')) as StreamEvent['data'],
  } as StreamEvent;
};

export const iterateSseStream = async function* (
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<StreamEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    buffer = buffer.replaceAll('\r\n', '\n');

    while (buffer.includes('\n\n')) {
      const boundary = buffer.indexOf('\n\n');
      const frame = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      const event = parseFrame(frame);
      if (event) {
        yield event;
      }
    }
  }

  const event = parseFrame(buffer);
  if (event) {
    yield event;
  }
};
