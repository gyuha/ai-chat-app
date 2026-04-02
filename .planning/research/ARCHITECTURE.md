# Architecture Patterns

**Domain:** AI Chat Web Application (React + Vite SPA)
**Researched:** 2026-04-02
**Confidence:** MEDIUM

## Recommended Architecture

```
App
├── ChatProvider (Context + Reducer)
│   ├── conversations: Conversation[]
│   ├── activeConversationId: string | null
│   ├── apiKey: string | null
│   └── selectedModel: string
│
├── Sidebar
│   ├── ConversationList
│   │   └── ConversationItem (per conversation)
│   └── ModelSelector
│
└── ChatArea
    ├── MessageList
    │   └── Message (per message: user/assistant)
    ├── StreamingMessage (for active streaming response)
    └── MessageInput
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `ChatProvider` | Global state management via Context + useReducer | All child components via Context |
| `Sidebar` | Conversation CRUD, model selection | ChatProvider for state |
| `ConversationList` | Display conversation list | ChatProvider (reads conversations) |
| `ConversationItem` | Single conversation row, click to select | ChatProvider (select, delete actions) |
| `ModelSelector` | Dropdown for model selection | ChatProvider (selectedModel state) |
| `ChatArea` | Container for active conversation | ChatProvider (activeConversationId) |
| `MessageList` | Render all messages in conversation | ChatProvider (messages by conversationId) |
| `Message` | Single message bubble (user/assistant) | Props (content, role) |
| `StreamingMessage` | Accumulates SSE chunks via useRef | SSE handler, ChatProvider |
| `MessageInput` | Text input, submit handler | ChatProvider (add message, trigger API) |

### Data Flow

```
User Input → MessageInput → ChatProvider.dispatch({ type: 'ADD_MESSAGE' })
                                      ↓
                              OpenRouter API (SSE)
                                      ↓
                              StreamingMessage (accumulates via useRef)
                                      ↓
                              ChatProvider.dispatch({ type: 'STREAM_COMPLETE' })
                                      ↓
                              localStorage (persist)
```

## State Management Pattern

Use **Reducer + Context** pattern to avoid prop drilling:

```typescript
// State shape
interface ChatState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  apiKey: string | null;
  selectedModel: string;
}

// Separate contexts for state and dispatch
export const ChatContext = createContext<ChatState | null>(null);
export const ChatDispatchContext = createContext<Dispatch<ChatAction> | null>(null);

// Provider composes both
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={state}>
      <ChatDispatchContext.Provider value={dispatch}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatContext.Provider>
  );
}

// Custom hooks for clean access
export function useChatState() { return useContext(ChatContext); }
export function useChatDispatch() { return useContext(ChatDispatchContext); }
```

### Reducer Actions

```typescript
type ChatAction =
  | { type: 'SET_API_KEY'; apiKey: string }
  | { type: 'SELECT_MODEL'; model: string }
  | { type: 'CREATE_CONVERSATION'; id: string }
  | { type: 'SELECT_CONVERSATION'; id: string }
  | { type: 'DELETE_CONVERSATION'; id: string }
  | { type: 'ADD_MESSAGE'; conversationId: string; message: Message }
  | { type: 'STREAM_TOKEN'; conversationId: string; token: string }
  | { type: 'LOAD_FROM_STORAGE'; state: Partial<ChatState> };
```

## Streaming Implementation Pattern

For SSE streaming responses, use **useRef for accumulation + periodic state updates**:

```typescript
function StreamingMessage({ conversationId, onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const accumulatedRef = useRef('');

  // SSE handler
  function handleChunk(chunk: string) {
    accumulatedRef.current += chunk;

    // Update state periodically (every 3-5 chars) to balance smoothness vs performance
    if (accumulatedRef.current.length % 4 === 0) {
      setDisplayText(accumulatedRef.current);
    }
  }

  // On stream complete, flush remaining and persist
  function handleComplete() {
    setDisplayText(accumulatedRef.current);
    onComplete(accumulatedRef.current);
  }

  return <div className="streaming-message">{displayText}</div>;
}
```

**Why useRef over direct state:**
- SSE delivers chars rapidly (50-100ms per token)
- Updating state on every char causes excessive re-renders
- useRef accumulates without triggering renders
- State updates throttled for smooth UI

## localStorage Persistence Pattern

```typescript
// Persistence on every state change
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  const newState = reducer(state, action);

  // Persist asynchronously to avoid blocking UI
  requestIdleCallback(() => {
    localStorage.setItem('chat_state', JSON.stringify({
      conversations: newState.conversations,
      activeConversationId: newState.activeConversationId,
      selectedModel: newState.selectedModel,
      // DO NOT persist apiKey (security)
    }));
  });

  return newState;
}

// Load on app init
const stored = localStorage.getItem('chat_state');
if (stored) {
  const parsed = JSON.parse(stored);
  initialState = { ...initialState, ...parsed };
}
```

**Important:** Store API key separately or not at all for security. localStorage is synchronous and blocks main thread - use `requestIdleCallback` for writes.

## Scalability Considerations

| Concern | At 100 Users | At 10K Users | At 1M Users |
|---------|--------------|--------------|-------------|
| localStorage | ~2MB typical usage | N/A (browser limit ~5-10MB) | N/A |
| State updates | Context re-renders all consumers | Use multiple contexts to split | Consider virtualized message list |
| SSE connections | 1 per chat tab | 6 max per domain (SSE limit) | Requires multi-tab handling |

**Note:** This is a client-side only app. No server scaling concerns.

## Build Order Implications

| Phase | Components to Build | Rationale |
|-------|---------------------|-----------|
| 1 | `ChatProvider` + basic layout | Foundation; all features depend on state |
| 2 | Sidebar + `ConversationList` | UI structure visible early |
| 3 | `MessageInput` + non-streaming send | Test API integration |
| 4 | `StreamingMessage` + SSE handling | Core differentiator |
| 5 | `ModelSelector` | Simple dropdown |
| 6 | localStorage persistence | icing on cake - verify all state flows first |

## Anti-Patterns to Avoid

### 1. Prop Drilling
**Bad:** `<MessageList messages={messages} onDelete={handleDelete} onEdit={handleEdit} />`
**Instead:** Use Context + dispatch

### 2. Direct State Mutation in Streaming
**Bad:** `setText(text + chunk)` on every SSE event
**Instead:** Accumulate in useRef, update state periodically

### 3. Blocking localStorage Writes
**Bad:** `localStorage.setItem()` synchronously in reducer
**Instead:** `requestIdleCallback(() => localStorage.setItem(...))`

### 4. Storing API Key in localStorage
**Bad:** `localStorage.setItem('apiKey', key)` - XSS vulnerability
**Instead:** Session-only or not persisted; let user re-enter

## Sources

- [React Managing State](https://react.dev/learn/managing-state) — Context + Reducer pattern (HIGH)
- [React Scaling Up](https://react.dev/learn/scaling-up-with-reducer-and-context) — Reducer + Context (HIGH)
- [React useRef](https://react.dev/learn/referencing-values-with-refs) — useRef for mutable values (HIGH)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) — API methods, sync nature (HIGH)
- [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) — SSE client interface (HIGH)
- [Using SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) — Event stream format (HIGH)
- [OpenRouter Docs](https://openrouter.ai/docs) — Streaming support confirmed (MEDIUM)
- [Vite Guide](https://vite.dev/guide/) — SPA entry point structure (MEDIUM)
