import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ChatState, ChatAction, Conversation, Message } from '../types/chat';
import { useLocalStorage } from '../hooks/useLocalStorage';

const initialState: ChatState = {
  apiKey: null,
  conversations: [],
  selectedConversationId: null,
  selectedModel: 'openrouter/free-models',
  isValidating: false,
  isStreaming: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload, error: null };
    case 'SET_API_KEY_VALIDATING':
      return { ...state, isValidating: action.payload };
    case 'SET_API_KEY_ERROR':
      return { ...state, error: action.payload, isValidating: false };
    case 'CREATE_CHAT': {
      const newChat: Conversation = {
        id: crypto.randomUUID(),
        name: 'New conversation',
        messages: [],
        model: state.selectedModel,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return {
        ...state,
        conversations: [newChat, ...state.conversations],
        selectedConversationId: newChat.id,
      };
    }
    case 'SELECT_CHAT':
      return { ...state, selectedConversationId: action.payload };
    case 'DELETE_CHAT': {
      const remaining = state.conversations.filter(c => c.id !== action.payload);
      return {
        ...state,
        conversations: remaining,
        selectedConversationId:
          state.selectedConversationId === action.payload
            ? remaining[0]?.id || null
            : state.selectedConversationId,
      };
    }
    case 'ADD_MESSAGE': {
      const { conversationId, message } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map(c => {
          if (c.id !== conversationId) return c;
          const isFirstMessage = c.messages.length === 0;
          const shouldUpdateName = isFirstMessage && message.role === 'user';
          return {
            ...c,
            messages: [...c.messages, message],
            updatedAt: Date.now(),
            name: shouldUpdateName
              ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
              : c.name,
          };
        }),
      };
    }
    case 'UPDATE_MESSAGE': {
      const { conversationId, messageId, content } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map(c => {
          if (c.id !== conversationId) return c;
          return {
            ...c,
            messages: c.messages.map(m =>
              m.id === messageId ? { ...m, content: m.content + content } : m
            ),
            updatedAt: Date.now(),
          };
        }),
      };
    }
    case 'UPDATE_CHAT_NAME': {
      const { conversationId, name } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === conversationId ? { ...c, name, updatedAt: Date.now() } : c
        ),
      };
    }
    case 'SET_MODEL':
      return { ...state, selectedModel: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'START_STREAMING':
      return { ...state, isStreaming: true };
    case 'FINISH_STREAMING':
    case 'CANCEL_STREAMING':
      return { ...state, isStreaming: false };
    default:
      return state;
  }
}

interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  createChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  updateChatName: (conversationId: string, name: string) => void;
  setModel: (model: string) => void;
  setApiKey: (key: string) => void;
  startStreaming: () => void;
  finishStreaming: () => void;
  cancelStreaming: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [savedState, setSavedState] = useLocalStorage<Partial<ChatState>>('chat-state', {});
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    ...savedState,
    apiKey: savedState.apiKey || null,
  });

  // Persist state changes to localStorage
  useEffect(() => {
    const { apiKey, selectedModel, conversations } = state;
    setSavedState({ apiKey, selectedModel, conversations });
  }, [state, setSavedState]);

  const createChat = () => dispatch({ type: 'CREATE_CHAT' });
  const selectChat = (id: string) => dispatch({ type: 'SELECT_CHAT', payload: id });
  const deleteChat = (id: string) => dispatch({ type: 'DELETE_CHAT', payload: id });
  const addMessage = (conversationId: string, message: Message) =>
    dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message } });
  const updateMessage = (conversationId: string, messageId: string, content: string) =>
    dispatch({ type: 'UPDATE_MESSAGE', payload: { conversationId, messageId, content } });
  const updateChatName = (conversationId: string, name: string) =>
    dispatch({ type: 'UPDATE_CHAT_NAME', payload: { conversationId, name } });
  const setModel = (model: string) => dispatch({ type: 'SET_MODEL', payload: model });
  const setApiKey = (key: string) => dispatch({ type: 'SET_API_KEY', payload: key });
  const startStreaming = () => dispatch({ type: 'START_STREAMING' });
  const finishStreaming = () => dispatch({ type: 'FINISH_STREAMING' });
  const cancelStreaming = () => dispatch({ type: 'CANCEL_STREAMING' });

  return (
    <ChatContext.Provider
      value={{ state, dispatch, createChat, selectChat, deleteChat, addMessage, updateMessage, updateChatName, setModel, setApiKey, startStreaming, finishStreaming, cancelStreaming }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
