import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ChatState, ChatAction, Conversation, Message } from '../types/chat';
import { useLocalStorage } from '../hooks/useLocalStorage';

const initialState: ChatState = {
  apiKey: null,
  conversations: [],
  selectedConversationId: null,
  selectedModel: 'openrouter/free-models',
  isValidating: false,
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
        conversations: state.conversations.map(c =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
            : c
        ),
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
  updateChatName: (conversationId: string, name: string) => void;
  setModel: (model: string) => void;
  setApiKey: (key: string) => void;
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
  const updateChatName = (conversationId: string, name: string) =>
    dispatch({ type: 'UPDATE_CHAT_NAME', payload: { conversationId, name } });
  const setModel = (model: string) => dispatch({ type: 'SET_MODEL', payload: model });
  const setApiKey = (key: string) => dispatch({ type: 'SET_API_KEY', payload: key });

  return (
    <ChatContext.Provider
      value={{ state, dispatch, createChat, selectChat, deleteChat, addMessage, updateChatName, setModel, setApiKey }}
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
