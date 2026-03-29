import type { ChatDetail, ChatSettings, ChatSummary, ModelOption } from '@repo/contracts';

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

interface RequestOptions extends RequestInit {
  body?: BodyInit | null;
}

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
    throw new Error(`Request failed for ${path}`);
  }

  return response.json() as Promise<T>;
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

export const getApiBaseUrl = (input?: string) => input ?? '/api/v1';
