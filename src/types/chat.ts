export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatState {
  apiKey: string | null;
  conversations: Conversation[];
  selectedConversationId: string | null;
  selectedModel: string;
  isValidating: boolean;
  error: string | null;
}

export type ChatAction =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'SET_API_KEY_VALIDATING'; payload: boolean }
  | { type: 'SET_API_KEY_ERROR'; payload: string }
  | { type: 'CREATE_CHAT' }
  | { type: 'SELECT_CHAT'; payload: string }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'UPDATE_MESSAGE'; payload: { conversationId: string; messageId: string; content: string } }
  | { type: 'UPDATE_CHAT_NAME'; payload: { conversationId: string; name: string } }
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<ChatState> };
