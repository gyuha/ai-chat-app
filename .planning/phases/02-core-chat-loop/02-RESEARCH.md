# Phase 2: Core Chat Loop - Research

**Researched:** 2026-04-02
**Domain:** React streaming chat UI + OpenRouter API integration
**Confidence:** MEDIUM

## Summary

Phase 2 implements the core chat loop: message input, streaming AI responses, cancellation, and auto-scroll. The key technical challenges are:
1. **OpenRouter streaming format** - OpenAI-compatible SSE with `chat.completion.chunk` events
2. **Token-by-token rendering** - Accumulate streamed text in React state
3. **Request cancellation** - AbortController with streaming fetch
4. **Input state management** - Disable input during streaming
5. **Auto-scroll** - useRef + scrollIntoView pattern

**Primary recommendation:** Use native Fetch API with ReadableStream for streaming (no library needed), AbortController for cancellation, and update Context state incrementally as tokens arrive.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- OpenRouter API only (no other AI providers)
- localStorage persistence only (IndexedDB not used)
- No authentication system

### Claude's Discretion
- Streaming implementation approach (native Fetch vs library)
- Component architecture for chat UI

### Deferred Ideas (OUT OF SCOPE)
- Markdown rendering (Phase 2 v2 requirements - UX-03)
- Code block copy buttons (Phase 2 v2 - UX-04)
- Theme switching (Phase 2 v2 - UX-01)

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MSG-01 | 사용자는 텍스트 입력창에 메시지 작성 가능 | Textarea component with React state |
| MSG-02 | Enter로 메시지 전송 (Shift+Enter는 줄바꿈) | Keyboard event handling with Enter/Shift+Enter detection |
| MSG-03 | 빈 메시지는 전송 불가 (입력 방지) | Trim check before submission |
| MSG-04 | AI 응답은 실시간 스트리밍으로 토큰 단위 표시 | OpenRouter SSE streaming with ReadableStream |
| MSG-05 | AI 응답 완료 전 취소 버튼으로 중단 가능 | AbortController with streaming fetch |
| MSG-06 | 메시지 전송 중 입력창 비활성화 (중복 전송 방지) | isStreaming state in Context |
| MSG-07 | 메시지 영역은 자동 스크롤로 최신 메시지 위치 | useRef + scrollIntoView pattern |

## Standard Stack

### Core (Already in project)
| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.x | UI framework with concurrent features |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |

### No Additional Dependencies Required
| Library | Why Not Needed |
|---------|----------------|
| @ai-sdk/sdk | OpenRouter has simple REST API, native Fetch sufficient |
| eventsource | SSE not used - OpenRouter uses chunked transfer encoding |
| any streaming library | Native Fetch + ReadableStream handles everything |

### Verified Package Versions (npm registry - April 2026)
```
react: 19.2.4
vite: 8.0.3
typescript: 6.0.2
tailwindcss: 4.2.2
@tailwindcss/typography: 0.5.19
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── ChatArea.tsx      # Main chat container (already exists)
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── chat/
│       ├── ChatInput.tsx     # NEW: Message input component
│       ├── MessageList.tsx   # NEW: Messages with auto-scroll
│       └── MessageBubble.tsx # NEW: Individual message display
├── hooks/
│   └── useLocalStorage.ts    # Already exists
├── context/
│   └── ChatContext.tsx       # Already exists - add streaming state
├── lib/
│   └── openrouter.ts         # NEW: API client with streaming
└── types/
    └── chat.ts              # Already exists
```

### Pattern 1: OpenRouter Streaming Request

**What:** Send a POST request with `stream: true` and read SSE responses incrementally.

**When to use:** Every AI message request

**Example:**
```typescript
// Source: OpenAI-compatible API (OpenRouter uses same format)
// Verified via: OpenRouter docs confirm OpenAI compatibility

async function* streamAIResponse(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  signal: AbortSignal
) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
    signal,
  });

  if (!response.body) {
    throw new Error('ReadableStream not supported');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) yield delta;
          } catch {}
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
```

**SSE Response Format (OpenAI-compatible):**
```
data: {"id":"...","object":"chat.completion.chunk","created":...,"model":"...","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"...","object":"chat.completion.chunk","created":...,"model":"...","choices":[{"index":0,"delta":{"content":" world"},"finish_reason":null}]}

data: [DONE]
```

**Confidence:** MEDIUM - Based on OpenAI API training data, verified indirectly via OpenRouter docs confirming OpenAI compatibility

### Pattern 2: Streaming State in Context+Reducer

**What:** Add streaming state to ChatContext to track in-progress AI responses.

**When to use:** Managing streaming state across components

**Changes needed to ChatContext:**
```typescript
// Add to ChatState interface:
interface ChatState {
  // ... existing fields
  streamingMessageId: string | null;  // NEW: ID of message being streamed
  isStreaming: boolean;               // NEW: true while AI is responding
}

// Add to ChatAction type:
type ChatAction =
  | { type: 'START_STREAMING'; payload: { conversationId: string; messageId: string } }
  | { type: 'APPEND_TO_STREAM'; payload: { messageId: string; delta: string } }
  | { type: 'FINISH_STREAMING'; payload: { messageId: string } }
  | { type: 'CANCEL_STREAMING' }

// Example reducer changes:
case 'START_STREAMING':
  return { ...state, streamingMessageId: action.payload.messageId, isStreaming: true };

case 'APPEND_TO_STREAM':
  // Need to update the message content incrementally
  // This requires updating the message in conversations array
  return state; // Implementation depends on how we handle streaming messages

case 'FINISH_STREAMING':
case 'CANCEL_STREAMING':
  return { ...state, streamingMessageId: null, isStreaming: false };
```

**Alternative approach (simpler):** Keep streaming state local to ChatInput component, only update Context when message is complete. This avoids partial state updates during streaming.

**Recommendation:** Start with local streaming state (simpler), migrate to Context if needed.

**Confidence:** HIGH - Standard React patterns

### Pattern 3: Auto-Scroll with useRef

**What:** Use useRef to reference the last message element and scroll it into view.

**When to use:** Any chat UI that needs to show latest messages

**Example:**
```typescript
// Source: MDN Web Docs - ReadableStream, React best practices
import { useEffect, useRef } from 'react';

function MessageList() {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="overflow-y-auto">
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```

**Key points:**
- `scrollIntoView({ behavior: 'smooth' })` for smooth scrolling
- Place empty div at bottom with ref
- Trigger scroll when messages array changes

**Confidence:** HIGH - Standard React pattern, MDN verified

### Pattern 4: Input State Management (MSG-02, MSG-03, MSG-06)

**What:** Control Enter key behavior and disable input during streaming.

**Example:**
```typescript
function ChatInput() {
  const [input, setInput] = useState('');
  const { isStreaming } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // MSG-02: Shift+Enter = newline, Enter = submit
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // MSG-03: Don't submit empty message
      if (input.trim() && !isStreaming) {
        submitMessage(input);
      }
    }
  };

  // MSG-06: Disable textarea during streaming
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <textarea
      ref={textareaRef}
      value={input}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={isStreaming}
      placeholder={isStreaming ? 'Waiting for response...' : 'Type a message...'}
      className={`w-full resize-none rounded-lg border p-3 ${
        isStreaming ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      }`}
    />
  );
}
```

**Confidence:** HIGH - Standard React patterns

### Pattern 5: AbortController for Cancellation (MSG-05)

**What:** Use AbortController to cancel in-flight streaming request.

**Example:**
```typescript
function ChatInput() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const submitMessage = async (content: string) => {
    // Cancel any existing stream
    cancelStream();

    // Create new AbortController
    abortControllerRef.current = new AbortController();

    // Create placeholder message
    const messageId = crypto.randomUUID();
    addMessage(conversationId, {
      id: messageId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    });

    // Stream response
    try {
      for await (const delta of streamAIResponse(apiKey, model, messages, abortControllerRef.current.signal)) {
        // Append delta to message content
        updateStreamingMessage(messageId, delta);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Handle error
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Cancel button calls cancelStream()
  return (
    <>
      <textarea disabled={isStreaming} />
      {isStreaming && <button onClick={cancelStream}>Cancel</button>}
    </>
  );
}
```

**Key point:** AbortController.abort() causes fetch to throw AbortError, which we catch and ignore for cancellation.

**Confidence:** HIGH - Standard Web API pattern, MDN verified

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Streaming | Custom SSE parser | Native ReadableStream + TextDecoder | Built into all modern browsers, handles chunked encoding correctly |
| Request cancellation | Custom timeout/cancellation logic | AbortController | Standard Web API, works with fetch and streams |
| Auto-scroll | Scroll position calculation | scrollIntoView({ behavior: 'smooth' }) | Standard DOM API, handles all edge cases |
| Text input resizing | Fixed-height textarea | Auto-resize with scrollHeight | Native behavior, no library needed |

**Key insight:** The Web Platform provides all necessary APIs for streaming chat. No additional libraries required.

## Common Pitfalls

### Pitfall 1: Chunked Encoding Parsing
**What goes wrong:** SSE data arrives in incomplete chunks, causing JSON parse errors or missing tokens.
**Why it happens:** HTTP chunked transfer encoding splits data arbitrarily, not at SSE event boundaries.
**How to avoid:** Buffer chunks and split on `\n`, only parse complete `data: ` lines.
**Warning signs:** Intermittent missing characters, "Unexpected end of JSON input" errors.

### Pitfall 2: Double-submit Prevention (MSG-06)
**What goes wrong:** User can submit multiple messages before first one completes.
**Why it happens:** No locking mechanism during streaming state.
**How to avoid:** Disable input textarea AND submit button during `isStreaming` state.
**Warning signs:** Multiple AI responses appearing simultaneously, message order corrupted.

### Pitfall 3: Stale Closure in Streaming
**What goes wrong:** State updates in streaming loop reference stale values.
**Why it happens:** JavaScript closures capture variable values at creation time, not execution time.
**How to avoid:** Use ref for values that change during streaming (e.g., abort controller), or use functional state updates.
**Warning signs:** Messages appending to wrong conversation, cancellation not working.

### Pitfall 4: Memory Leaks from Unclosed Streams
**What goes wrong:** Stream not properly closed on unmount or cancellation.
**Why it happens:** Forgetting to call `reader.releaseLock()` or not handling AbortError.
**How to avoid:** Use `try/finally` to ensure cleanup, cancel AbortController on component unmount.
**Warning signs:** "ReadableStream reader already released" errors, increasing memory usage.

### Pitfall 5: Auto-scroll Interrupting User Scroll
**What goes wrong:** Auto-scroll kicks in while user is reading older messages.
**Why it happens:** `scrollIntoView` runs whenever messages array changes, even if user scrolled up.
**How to avoid:** Track if user is near bottom; only auto-scroll if within ~100px of bottom.
**Warning signs:** User complains chat jumps unexpectedly when reading history.

## Code Examples

### Complete Streaming Flow (High Confidence)
```typescript
// 1. Create streaming API function
async function* streamOpenRouter(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  signal: AbortSignal
) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Chat App',
    },
    body: JSON.stringify({ model, messages, stream: true }),
    signal,
  });

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) yield content;
          } catch {}
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// 2. ChatInput component with streaming
function ChatInput({ conversationId, disabled }) {
  const [input, setInput] = useState('');
  const abortControllerRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || isStreaming) return;

    const content = input.trim();
    setInput('');
    setIsStreaming(true);

    abortControllerRef.current = new AbortController();

    // Add user message
    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, content, createdAt: Date.now() };
    addMessage(conversationId, userMessage);

    // Add placeholder assistant message
    const assistantMessageId = crypto.randomUUID();
    addMessage(conversationId, { id: assistantMessageId, role: 'assistant', content: '', createdAt: Date.now() });

    try {
      // Stream from OpenRouter
      for await (const delta of streamOpenRouter(apiKey, model, messages, abortControllerRef.current.signal)) {
        // Append delta to assistant message
        appendToMessage(conversationId, assistantMessageId, delta);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Handle error
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <div className="flex gap-2">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        disabled={disabled || isStreaming}
      />
      {isStreaming ? (
        <button onClick={handleCancel}>Cancel</button>
      ) : (
        <button onClick={handleSubmit} disabled={!input.trim()}>Send</button>
      )}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Polling for updates | Streaming with SSE | ~2022 | Real-time responses, lower latency |
| Full response render | Token-by-token | ~2022 | Appears faster, better UX |
| XMLHttpRequest | Fetch + ReadableStream | ~2019 | Modern API, better cancellation |
| Library (Axios, etc.) | Native Fetch | ~2020 | Less dependencies, full control |

**Deprecated/outdated:**
- `EventSource` (SSE client): Not used - OpenRouter uses chunked transfer, not SSE
- `XMLHttpRequest`: Replaced by Fetch API

## Open Questions

1. **OpenRouter streaming endpoint URL**
   - What we know: OpenRouter docs confirm OpenAI-compatible API at `/api/v1/chat/completions`
   - What's unclear: Exact streaming response format details (SSE vs chunked)
   - Recommendation: Test with actual API call to verify format

2. **Streaming state management approach**
   - What we know: Both local state and Context-based approaches work
   - What's unclear: Which is cleaner for this codebase's patterns
   - Recommendation: Start with local streaming state, migrate if needed

3. **Error handling during streaming**
   - What we know: AbortError indicates intentional cancellation
   - What's unclear: How to handle network errors mid-stream, rate limits
   - Recommendation: Show error message in chat, allow retry

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified beyond OpenRouter API)

The phase uses only:
- React 19.x (already installed)
- Native Fetch API (built into browsers)
- Native ReadableStream (built into browsers)
- AbortController (built into browsers)

No additional npm packages, CLIs, or services required.

## Sources

### Primary (HIGH confidence)
- [MDN Web Docs - ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) - Streaming with fetch
- [MDN Web Docs - AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) - Request cancellation
- [React Documentation](https://react.dev/learn) - React patterns for state and effects

### Secondary (MEDIUM confidence)
- [OpenRouter Documentation](https://openrouter.ai/docs) - API structure, confirmed OpenAI-compatible
- [Vercel AI SDK Streaming Guide](https://ai-sdk.dev/docs/foundations/streaming) - SSE event format patterns
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Streaming with fetch examples

### Tertiary (LOW confidence - needs validation)
- OpenRouter streaming SSE event names (not directly verified - recommend testing with actual API call)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using native browser APIs, no new dependencies
- Architecture: HIGH - Standard React patterns well-established
- Pitfalls: MEDIUM - Based on general streaming knowledge, not project-tested

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (30 days - stable domain)
