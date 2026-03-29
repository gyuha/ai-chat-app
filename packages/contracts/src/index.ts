export type ModelProvider = 'openrouter';

export interface ModelOption {
  id: string;
  label: string;
  provider: ModelProvider;
  description?: string;
}

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  status?: 'pending' | 'streaming' | 'complete' | 'stopped' | 'error';
}

export interface ChatSettings {
  modelId: string;
  systemPrompt: string;
}

export interface ChatSummary {
  id: string;
  title: string;
  updatedAt: string;
  settings: ChatSettings;
}

export interface ChatDetail extends ChatSummary {
  messages: ChatMessage[];
}

export type StreamEventType =
  | 'message:start'
  | 'message:delta'
  | 'message:done'
  | 'error'
  | 'heartbeat';

export interface StreamEvent<TType extends StreamEventType = StreamEventType> {
  event: TType;
  data: Record<string, unknown>;
}
