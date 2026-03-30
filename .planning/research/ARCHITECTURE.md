# Architecture Patterns

**Domain:** OpenRouter API Streaming Chat Application
**Researched:** 2026-03-30
**Confidence:** MEDIUM-HIGH

## Overview

A frontend-only React SPA that communicates directly with OpenRouter's OpenAI-compatible API. The architecture follows a **layered component hierarchy** with **separation between UI state, server state, and persistence**.

## Recommended Architecture

```
src/
├── components/           # UI layer (pure presentation)
│   ├── ui/             # shadcn/ui primitives
│   ├── chat/           # Chat-specific components
│   └── settings/       # Settings/API key management
├── hooks/              # Custom React hooks (UI logic)
├── stores/             # Zustand stores (client state)
├── api/                # API client layer
├── db/                 # Dexie.js (IndexedDB)
├── lib/                # Utilities
└── routes/             # TanStack Router file-based routes
```

### Component Hierarchy

```
App
├── Sidebar (路由: /)
│   ├── ConversationList
│   └── NewChatButton
├── ChatArea (路由: /chat/:id)
│   ├── ChatHeader (model selector, conversation title)
│   ├── MessageList
│   │   └── Message (user | assistant)
│   │       ├── MarkdownContent
│   │       └── CodeBlock (syntax highlighted)
│   ├── ChatInput
│   │   ├── Textarea (auto-resize)
│   │   └── SendButton
│   └── StreamingIndicator (when AI is responding)
└── SettingsDialog (路由: /settings)
    ├── ApiKeyInput
    └── ModelPreferences
```

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `ChatArea` | Orchestrates chat flow, holds message list state | Stores: chatStore, apiStore |
| `MessageList` | Renders messages, auto-scrolls to bottom | Props: messages[], isStreaming |
| `Message` | Renders single message (user/assistant) | Props: message, onRetry |
| `ChatInput` | User input, Enter to send, Shift+Enter newline | Props: onSend, disabled |
| `ChatHeader` | Shows current model, conversation title | Props: conversationId |
| `Sidebar` | Navigation, conversation list | Stores: conversationStore |
| `SettingsDialog` | API key management | Stores: settingsStore |

## Data Flow

### Message Flow (Streaming)

```
User types message
       ↓
ChatInput.onSend(message)
       ↓
chatStore.addMessage({ role: 'user', content })
       ↓
api.postChatMessage() — fetch with ReadableStream
       ↓
Streamed chunks → chatStore.updateMessage() (streaming)
       ↓
MessageList re-renders with each chunk
       ↓
Complete → chatStore.finalizeMessage()
```

### API Key Flow

```
SettingsDialog → settingsStore.setApiKey()
       ↓
Encrypted in IndexedDB via Dexie
       ↓
api.getHeaders() reads from settingsStore
       ↓
All OpenRouter calls include Authorization header
```

### Persistence Flow

```
On conversation change:
  chatStore.subscribe → debounce 500ms → db.conversations.put()

On app load:
  db.conversations.toArray() → conversationStore.loadAll()
  db.messages.where('conversationId').equals(id) → chatStore.loadMessages(id)
```

## Key Architecture Patterns

### Pattern 1: Streaming Message State

**What:** Assistant messages accumulate via incremental updates during streaming.

**When:** User sends message and waits for AI response.

**Implementation:**
```typescript
// In chatStore
streamingMessage: {
  id: string;
  content: string;       // Accumulates as chunks arrive
  status: 'streaming' | 'complete' | 'error';
}

// On chunk arrival
updateStreamingMessage(chunk: string) {
  this.streamingMessage.content += chunk;
}

// On complete
finalizeStreamingMessage() {
  this.messages.push({ ...this.streamingMessage, status: 'complete' });
  this.streamingMessage = null;
}
```

### Pattern 2: Optimistic UI with Rollback

**What:** User messages appear immediately; errors trigger rollback.

**When:** Sending a message.

**Example:**
```typescript
// Optimistically add
const tempId = crypto.randomUUID();
addMessage({ id: tempId, role: 'user', content, status: 'pending' });

try {
  await api.sendMessage(conversationId, messages);
  // On success, status becomes 'sent'
  updateMessage(tempId, { status: 'sent' });
} catch (error) {
  // On error, mark as failed with retry option
  updateMessage(tempId, { status: 'error', error: error.message });
}
```

### Pattern 3: Debounced Persistence

**What:** IndexedDB writes are debounced to avoid excessive I/O during rapid updates.

**When:** Streaming messages or editing conversation titles.

**Implementation:**
```typescript
// Subscribe to store changes with debounce
let debounceTimer: NodeJS.Timeout;

chatStore.subscribe((state) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    db.transaction('rw', db.conversations, db.messages, () => {
      db.conversations.put(state.currentConversation);
      db.messages.bulkPut(state.messages);
    });
  }, 500);
});
```

### Pattern 4: API Layer Abstraction

**What:** All OpenRouter calls go through a typed API layer, not directly in components.

**When:** Any API interaction.

**Structure:**
```typescript
// api/openrouter.ts
export const openrouterApi = {
  listModels: () => fetch('/v1/models', { headers: getHeaders() }),
  chat: (messages, model) => fetch('/v1/chat/completions', {
    method: 'POST',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: true }),
  }),
};
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct API Calls in Components

**What:** Calling `fetch()` directly inside React components.

**Why bad:** No reusability, hard to test, no central error handling.

**Instead:** Use custom hooks or API modules (`useSendMessage`, `openrouterApi`).

### Anti-Pattern 2: Storing Messages Only in State

**What:** Keeping all messages only in Zustand/store memory.

**Why bad:** Data loss on refresh. IndexedDB is the source of truth for conversations.

**Instead:** Persist on change with debounce; hydrate on load.

### Anti-Pattern 3: Blocking UI During Streaming

**What:** Using `response.json()` instead of streaming, or not updating UI until complete.

**Why bad:** Opposite of streaming UX — user sees nothing until entire response arrives.

**Instead:** Process chunks as they arrive; render incrementally.

### Anti-Pattern 4: No Error Boundaries Around Messages

**What:** Single message rendering error crashes entire chat.

**Why bad:** One malformed markdown breaks the whole conversation.

**Instead:** Wrap each `Message` in an error boundary.

## Scalability Considerations

| Concern | At 10 conversations | At 100 conversations | At 1000 conversations |
|---------|---------------------|----------------------|----------------------|
| Message list | Render all | Virtual scrolling needed | Virtual scrolling required |
| IndexedDB writes | Debounce 500ms | Debounce 500ms | Consider batching |
| Sidebar list | Render all | Virtual scrolling | Virtual scrolling |
| Memory | ~50 messages avg | ~50 messages avg | Consider pagination |

## Build Order Implications

### Phase 1: Core Chat (Focus Component: `ChatArea`)

**Why:** The main chat loop is the core feature. Build this first to validate the streaming API integration.

**Components to build:**
1. `ChatInput` — basic text input, send button
2. `MessageList` + `Message` — display messages
3. `ChatArea` — orchestrate the loop
4. `openrouterApi.chat()` — streaming fetch
5. `chatStore` — message state management

**Dependency chain:** `ChatInput` → `MessageList` → `ChatArea` → `openrouterApi`

### Phase 2: Persistence (Focus Component: `db/`)

**Why:** After core chat works, layer in persistence so conversations survive refresh.

**Components to build:**
1. Dexie schema (`conversations`, `messages`)
2. `useConversations` hook — CRUD operations
3. Debounced persistence in `chatStore`

### Phase 3: Navigation & Sidebar (Focus Component: `Sidebar`)

**Why:** Once persistence works, add conversation management.

**Components to build:**
1. `Sidebar` with `ConversationList`
2. TanStack Router routes (`/`, `/chat/:id`, `/settings`)
3. `conversationStore`

### Phase 4: Settings & Model Selection

**Why:** After basic flow works, add API key management and model selection.

**Components to build:**
1. `SettingsDialog`
2. `ChatHeader` with model selector
3. `openrouterApi.listModels()`
4. `settingsStore`

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Component hierarchy | HIGH | Standard React patterns, clear boundaries |
| Streaming implementation | HIGH | OpenAI-compatible API, well-documented |
| State management (Zustand) | HIGH | Zustand + Dexie is proven for this use case |
| TanStack Query usage | MEDIUM | v5 patterns for streaming may differ slightly |
| Build order | MEDIUM | Suggested order, actual may vary by team velocity |

## Sources

- TanStack Query v5 documentation (streaming support)
- OpenRouter API documentation (OpenAI-compatible endpoints)
- Dexie.js documentation (IndexedDB ORM)
- Zustand streaming chat examples (community patterns)
- React component composition patterns (established best practices)

## Research Flags

- **Phase 1:** LOW research needed — well-established streaming chat patterns
- **Phase 2:** MEDIUM — Dexie.js + Zustand integration patterns may need validation
- **Phase 4:** MEDIUM — OpenRouter streaming with TanStack Query v5 specific patterns
