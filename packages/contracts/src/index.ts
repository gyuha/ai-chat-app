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

export type StreamMode = 'message' | 'regenerate';

export type StreamEventType =
  | 'meta'
  | 'message:start'
  | 'message:delta'
  | 'message:done'
  | 'error'
  | 'heartbeat';

export interface MessageStreamRequest {
  prompt: string;
}

export interface StreamMetaData {
  chatId: string;
  mode: StreamMode;
  modelId: string;
  title: string;
}

export interface StreamMessageStartData {
  chatId: string;
  messageId: string;
  role: 'assistant';
  replaceMessageId?: string;
}

export interface StreamMessageDeltaData {
  chatId: string;
  messageId: string;
  delta: string;
  content: string;
}

export interface StreamMessageDoneData {
  chatId: string;
  messageId: string;
  content: string;
  status: Extract<ChatMessage['status'], 'complete' | 'stopped'>;
  chat: ChatDetail;
  replaceMessageId?: string;
}

export interface StreamErrorData {
  chatId: string;
  code: 'chat_not_found' | 'stream_failed' | 'validation_error' | 'regenerate_not_available';
  message: string;
  messageId?: string;
}

export interface StreamHeartbeatData {
  chatId: string;
  ok: true;
}

export interface StreamEventMap {
  meta: StreamMetaData;
  'message:start': StreamMessageStartData;
  'message:delta': StreamMessageDeltaData;
  'message:done': StreamMessageDoneData;
  error: StreamErrorData;
  heartbeat: StreamHeartbeatData;
}

export type StreamEvent<TType extends StreamEventType = StreamEventType> = {
  [Type in TType]: {
    event: Type;
    data: StreamEventMap[Type];
  };
}[TType];
