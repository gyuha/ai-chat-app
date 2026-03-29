import { Inject, Injectable } from '@nestjs/common';

import type { AppConfig } from '../../config/app.config.js';
import { APP_CONFIG } from '../../shared/tokens.js';

export interface OpenRouterStreamChunk {
  delta: string;
  finishReason?: string | null;
}

export interface OpenRouterStreamInput {
  model: string;
  messages: Array<{ role: string; content: string }>;
  signal?: AbortSignal;
}

const parseSsePayloads = async function* (body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
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
      const frame = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);

      if (!frame) {
        continue;
      }

      const payload = frame
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .join('\n');

      if (payload) {
        yield payload;
      }
    }
  }

  const rest = buffer.trim();
  if (!rest) {
    return;
  }

  const payload = rest
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .join('\n');

  if (payload) {
    yield payload;
  }
};

const extractContent = (input: unknown): string => {
  if (typeof input === 'string') {
    return input;
  }

  if (!Array.isArray(input)) {
    return '';
  }

  return input
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      if (typeof item === 'object' && item !== null && 'text' in item) {
        const text = item.text;
        return typeof text === 'string' ? text : '';
      }

      return '';
    })
    .join('');
};

@Injectable()
export class OpenRouterClient {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  createHeaders() {
    return {
      Authorization: `Bearer ${this.config.openRouter.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'OpenRouter Free Chat Web App',
    };
  }

  async *streamChat(input: OpenRouterStreamInput): AsyncGenerator<OpenRouterStreamChunk> {
    const response = await fetch(`${this.config.openRouter.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.createHeaders(),
      body: JSON.stringify({
        model: input.model,
        messages: input.messages,
        stream: true,
      }),
      signal: input.signal,
    });

    if (!response.ok || !response.body) {
      const detail = await response.text().catch(() => '');
      throw new Error(
        detail
          ? `OpenRouter request failed (${response.status}): ${detail}`
          : `OpenRouter request failed (${response.status})`,
      );
    }

    for await (const payload of parseSsePayloads(response.body)) {
      if (payload === '[DONE]') {
        break;
      }

      const parsed = JSON.parse(payload) as {
        choices?: Array<{
          delta?: {
            content?: unknown;
          };
          finish_reason?: string | null;
        }>;
      };
      const choice = parsed.choices?.[0];
      const delta = extractContent(choice?.delta?.content);

      if (delta || choice?.finish_reason) {
        yield {
          delta,
          finishReason: choice?.finish_reason,
        };
      }
    }
  }
}
