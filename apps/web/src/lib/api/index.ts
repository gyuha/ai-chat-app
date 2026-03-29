import type {
  ChatDetail,
  ChatSettings,
  ChatSummary,
  MessageStreamRequest,
  ModelOption,
  StreamEvent,
} from '@repo/contracts';

import { iterateSseStream } from '../stream/sse';

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  body?: BodyInit | null;
}

const readErrorMessage = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    return payload?.message ?? `Request failed for ${response.url}`;
  }

  return (await response.text().catch(() => '')) || `Request failed for ${response.url}`;
};

const request = async <T>(path: string, init?: RequestOptions): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    } as HeadersInit,
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return response.json() as Promise<T>;
};

const requestStream = async (path: string, init?: RequestOptions) => {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: 'text/event-stream',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    } as HeadersInit,
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  if (!response.body) {
    throw new ApiError(`Stream body missing for ${path}`, response.status);
  }

  return response.body;
};

export const fetchHealth = () => request<HealthResponse>('/api/v1/health');
export const fetchModels = () => request<ModelOption[]>('/api/v1/models');
export const fetchChats = () => request<ChatSummary[]>('/api/v1/chats');
export const fetchChatDetail = (chatId: string) => request<ChatDetail>(`/api/v1/chats/${chatId}`);

export interface CreateChatRequest {
  title?: string;
  settings?: Partial<ChatSettings>;
}

export const createChat = (input?: CreateChatRequest) =>
  request<ChatDetail>('/api/v1/chats', {
    method: 'POST',
    body: JSON.stringify(input ?? {}),
  });

export const streamChatMessage = async function* (
  chatId: string,
  input: MessageStreamRequest,
  signal?: AbortSignal,
): AsyncGenerator<StreamEvent> {
  const stream = await requestStream(`/api/v1/chats/${chatId}/messages/stream`, {
    method: 'POST',
    body: JSON.stringify(input),
    signal,
  });

  yield* iterateSseStream(stream);
};

export const streamRegenerateMessage = async function* (
  chatId: string,
  signal?: AbortSignal,
): AsyncGenerator<StreamEvent> {
  const stream = await requestStream(`/api/v1/chats/${chatId}/regenerate/stream`, {
    method: 'POST',
    signal,
  });

  yield* iterateSseStream(stream);
};

export const getApiBaseUrl = (input?: string) => input ?? '/api/v1';
