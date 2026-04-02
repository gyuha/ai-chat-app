# Domain Pitfalls: React AI Chat App

**Project:** AI Chat Web App (React + Vite + OpenRouter API)
**Researched:** 2026-04-02
**Confidence:** MEDIUM-HIGH

---

## Critical Pitfalls

Mistakes that cause rewrites, data loss, or security vulnerabilities.

### Pitfall 1: Streaming Response Without Proper Cleanup

**What goes wrong:** When user navigates away or sends new message while AI is still streaming, the stream continues in the background or leaves dangling event listeners.

**Why it happens:** `fetch()` with streaming `ReadableStream` does not auto-cancel when component unmounts. `AbortController` is not wired up.

**Consequences:**
- Memory leaks
- State updates on unmounted components (React warning: "Can't perform a React state update on an unmounted component")
- Race conditions where slower previous stream overwrites newer response
- API token waste (stream continues even after user left)

**Prevention:**
```typescript
// Use AbortController for all streaming fetch calls
const [messages, setMessages] = useState<Message[]>([]);
const [isStreaming, setIsStreaming] = useState(false);
const abortControllerRef = useRef<AbortController | null>(null);

const sendMessage = async (content: string) => {
  // Cancel any ongoing stream
  abortControllerRef.current?.abort();
  abortControllerRef.current = new AbortController();

  setIsStreaming(true);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [...messages, { role: 'user', content }] }),
      signal: abortControllerRef.current.signal, // CRITICAL
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      const chunk = decoder.decode(value);
      // Append chunk to streaming message state
    }
  } catch (err) {
    if (err.name === 'AbortError') return; // Expected on cancel
  } finally {
    setIsStreaming(false);
  }
};

// Cleanup on unmount
useEffect(() => {
  return () => {
    abortControllerRef.current?.abort();
  };
}, []);
```

**Detection:** React DevTools "Components" tab shows updates after unmount. Console shows "Can't perform a React state update on an unmounted component".

**Phase mapping:** Phase 2 (Streaming Implementation) must implement AbortController.

---

### Pitfall 2: localStorage Quota Exceeded (5MB Limit)

**What goes wrong:** Chat history grows and suddenly all messages disappear. localStorage throws `QuotaExceededError`.

**Why it happens:**
- localStorage has ~5-10MB limit per origin (varies by browser)
- No error handling for `setItem()` failures
- No size monitoring when storing conversations

**Consequences:**
- Silent data loss (catch block not implemented)
- Entire app breaks if localStorage is full
- User loses all conversation history

**Prevention:**
```typescript
// Wrapper with error handling and size monitoring
const STORAGE_KEY = 'ai-chat-data';

interface StorageData {
  conversations: Conversation[];
  settings: Settings;
}

function saveToStorage(data: StorageData): boolean {
  try {
    const serialized = JSON.stringify(data);
    // Check size (rough estimate: 1 character = 2 bytes in UTF-16)
    if (serialized.length > 4 * 1024 * 1024) { // 4MB soft limit
      console.warn('Storage approaching limit');
      // Trigger cleanup or warn user
    }
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      // Implement cleanup strategy
      evictOldConversations();
      return false;
    }
    console.error('Storage error:', e);
    return false;
  }
}

function loadFromStorage(): StorageData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load storage:', e);
    return null;
  }
}
```

**Detection:** `try/catch` around localStorage operations. Monitor console for QuotaExceededError.

**Phase mapping:** Phase 3 (Data Persistence) must implement storage wrapper with error handling.

---

### Pitfall 3: Stale Closure in useEffect with Streaming State

**What goes wrong:** Streaming response uses outdated `messages` array. New messages don't appear in API calls.

**Why it happens:** useEffect dependency array or stale state captured in closure. When using functional updates (`setMessages(prev => ...)`), this is avoided, but direct state read inside async callbacks captures stale value.

**Consequences:**
- API sends incomplete conversation history
- AI responds to old messages, not full context
- Silent bug: appears to work but context is lost

**Prevention:**
```typescript
// WRONG - stale closure
useEffect(() => {
  let ignore = false;

  async function fetchResponse() {
    const response = await fetch('/api/chat', {
      body: JSON.stringify({ messages }) // 'messages' is stale!
    });
    // ...
  }

  fetchResponse();
  return () => { ignore = true; };
}, []); // Empty deps but 'messages' captured

// CORRECT - use ref or functional updates
const messagesRef = useRef(messages);
messagesRef.current = messages;

useEffect(() => {
  let ignore = false;

  async function fetchResponse() {
    const response = await fetch('/api/chat', {
      body: JSON.stringify({ messages: messagesRef.current }) // Fresh ref
    });
    // ...
  }

  fetchResponse();
  return () => { ignore = true; };
}, []); // Empty deps, ref is stable
```

**Detection:** Console logs show different message counts than expected. API receives incomplete history.

**Phase mapping:** Phase 2 (Streaming Implementation) must use ref pattern for async operations.

---

### Pitfall 4: XSS via Markdown Rendering of AI Responses

**What goes wrong:** AI returns malicious JavaScript embedded in markdown. App renders it with `dangerouslySetInnerHTML` and attacker steals API keys or session data.

**Why it happens:**
- AI can be tricked into outputting malicious code
- Using `dangerouslySetInnerHTML` for markdown rendering
- No sanitization of AI output before rendering

**Consequences:**
- Complete compromise of user data
- API key theft
- Session hijacking

**Prevention:**
```typescript
import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Configure marked safely
marked.setOptions({
  breaks: true,
  gfm: true,
});

function renderMarkdown(content: string): string {
  const html = marked.parse(content);
  // Sanitize after markdown parsing to handle embedded HTML
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'blockquote',
                   'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

// In component
<div
  dangerouslySetInnerHTML={{ __html: renderMarkdown(aiMessage.content) }}
/>
```

**Also sanitize URLs in links:**
```typescript
// React automatically sanitizes javascript: URLs in hrefs
// But always use this pattern for user-generated URLs
<a href={url} target="_blank" rel="noopener noreferrer">
```

**Detection:** Security audit. Code review for `dangerouslySetInnerHTML` usage.

**Phase mapping:** Phase 4 (Message Rendering) must include DOMPurify sanitization.

---

## Moderate Pitfalls

Issues that cause confusion, bugs, or degraded UX but don't require rewrites.

### Pitfall 5: Multiple Rapid Messages Cause State Corruption

**What goes wrong:** User clicks send multiple times quickly. Multiple streams race. Final display shows mixed or corrupted messages.

**Why it happens:** No debouncing on send button. No prevention of new messages while streaming. Race condition between multiple fetch requests.

**Prevention:**
```typescript
const [isStreaming, setIsStreaming] = useState(false);

const sendMessage = async (content: string) => {
  if (isStreaming) return; // Prevent during streaming
  if (!content.trim()) return; // Prevent empty

  setIsStreaming(true);
  setInput(''); // Clear input immediately

  try {
    // ... streaming logic
  } finally {
    setIsStreaming(false);
  }
};

// Button disabled during streaming
<button disabled={isStreaming || !input.trim()}>
  Send
</button>
```

**Phase mapping:** Phase 2 (Streaming Implementation).

---

### Pitfall 6: Context Re-render Cascade

**What goes wrong:** Changing one piece of chat state (e.g., streaming boolean) causes entire app to re-render. Chat feels sluggish.

**Why it happens:** Single monolithic context with non-memoized values. Every state change in ChatContext triggers re-render of all consumers.

**Prevention:**
```typescript
// Split contexts by update frequency
const ChatHistoryContext = createContext<Message[]>([]);
const StreamingStatusContext = createContext<boolean>(false);
const InputStateContext = createContext<string>('');

// Or memoize the context value
const chatContextValue = useMemo(() => ({
  messages,
  addMessage,
}), [messages, addMessage]);
```

**Phase mapping:** Phase 3 (Data Persistence) or Phase 5 (Performance).

---

### Pitfall 7: Missing Error Handling for API Failures

**What goes wrong:** Network error or API rate limit. App silently fails. User thinks message was sent but AI never responds.

**Why it happens:** Error handling not implemented on fetch call. Only happy path coded.

**Prevention:**
```typescript
try {
  const response = await fetch('/api/chat', options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ChatAPIError(
      error.message || `HTTP ${response.status}`,
      response.status,
      error.code
    );
  }

  // Handle streaming or JSON response
} catch (e) {
  if (e instanceof ChatAPIError) {
    showError(e.message); // "Rate limit exceeded. Try again in 60s."
  } else if (e.name === 'AbortError') {
    // User cancelled, don't show error
  } else {
    showError('Network error. Check your connection.');
  }
}
```

**Phase mapping:** Phase 2 (Streaming Implementation).

---

### Pitfall 8: localStorage Data Corruption from Invalid JSON

**What goes wrong:** App reads localStorage on startup and crashes. JSON parse error. All conversations gone.

**Why it happens:**
- App was updated with schema change
- Browser storage was manually edited
- Partial write during previous save (browser crash)

**Prevention:**
```typescript
function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem('conversations');
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    // Validate schema
    if (!Array.isArray(parsed)) {
      console.error('Invalid conversations format, resetting');
      return [];
    }

    return parsed.filter(conv =>
      conv.id &&
      conv.messages &&
      Array.isArray(conv.messages)
    );
  } catch (e) {
    console.error('Failed to load conversations:', e);
    return []; // Graceful fallback, don't crash
  }
}
```

**Phase mapping:** Phase 3 (Data Persistence).

---

### Pitfall 9: Model Selection Not Persisted

**What goes wrong:** User selects free model. Refreshes page. Model resets to default. User confused.

**Why it happens:** Model selection stored only in component state, not persisted to localStorage.

**Prevention:**
```typescript
const [selectedModel, setSelectedModel] = useState<string>(() => {
  return localStorage.getItem('selected-model') || 'free-model-id';
});

const handleModelChange = (modelId: string) => {
  setSelectedModel(modelId);
  localStorage.setItem('selected-model', modelId);
};
```

**Phase mapping:** Phase 1 (Basic Structure) or Phase 3 (Data Persistence).

---

## Minor Pitfalls

Cosmetic issues or edge cases that cause minor problems.

### Pitfall 10: Scroll Position Lost on New Messages

**What goes wrong:** User scrolled up to read old messages. New message arrives. View jumps to bottom. User loses place.

**Prevention:**
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);
const [autoScroll, setAutoScroll] = useState(true);

const scrollToBottom = () => {
  if (autoScroll) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
};

useEffect(() => {
  scrollToBottom();
}, [messages]);

// User can toggle auto-scroll if they scrolled up
const handleScroll = () => {
  const el = messagesContainerRef.current;
  if (el) {
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 100;
    setAutoScroll(isAtBottom);
  }
};
```

**Phase mapping:** Phase 4 (Message Rendering).

---

### Pitfall 11: Empty State Not Handled

**What goes wrong:** Fresh user with no conversations sees blank sidebar. Doesn't know what to do.

**Prevention:**
```typescript
{conversations.length === 0 ? (
  <div className="empty-state">
    <p>No conversations yet</p>
    <button onClick={createNewConversation}>
      Start a new chat
    </button>
  </div>
) : (
  conversations.map(conv => <ConversationItem key={conv.id} conv={conv} />)
)}
```

**Phase mapping:** Phase 1 (Basic Structure).

---

### Pitfall 12: Long Messages Break Layout

**What goes wrong:** Very long AI response or code block. Sidebar pushed off screen. Layout breaks.

**Prevention:**
```css
/* CSS for message containers */
.message-content {
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

.message-content pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
```

**Phase mapping:** Phase 4 (Message Rendering).

---

## Phase-Specific Warnings

| Phase | Critical Pitfalls | Mitigation |
|-------|-------------------|------------|
| Phase 1: Basic Setup | Pitfall 9 (model not persisted) | Store settings in localStorage immediately |
| Phase 2: Streaming | Pitfalls 1, 3, 5, 7 | AbortController, ref pattern, disabled button, error handling |
| Phase 3: Persistence | Pitfalls 2, 8 | Storage wrapper with try/catch, schema validation |
| Phase 4: Rendering | Pitfalls 4, 10, 12 | DOMPurify, scroll management, CSS overflow |
| Phase 5: Polish | Pitfall 6 | Context splitting or memoization |

---

## Quick Reference Checklist

**Before Phase 2 (Streaming):**
- [ ] AbortController wired to fetch
- [ ] Cleanup function in useEffect
- [ ] Error handling for network failures
- [ ] Button disabled during streaming
- [ ] Ref pattern for async state

**Before Phase 3 (Persistence):**
- [ ] localStorage wrapper with try/catch
- [ ] Schema validation on load
- [ ] Size monitoring before writes
- [ ] Graceful degradation on QuotaExceededError

**Before Phase 4 (Rendering):**
- [ ] DOMPurify sanitization
- [ ] Markdown parsing with safe config
- [ ] Scroll position management
- [ ] CSS overflow handling

---

## Sources

| Source | Confidence | Content |
|--------|------------|---------|
| [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) | HIGH | localStorage limits, exceptions |
| [MDN ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) | HIGH | Streaming patterns, mistakes |
| [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) | HIGH | Cancel pattern for fetch |
| [React.dev useEffect](https://react.dev/reference/react/useEffect) | HIGH | Cleanup, stale closure, race conditions |
| [React.dev useState](https://react.dev/reference/react/useState) | HIGH | State update patterns |
| [React.dev useContext](https://react.dev/reference/react/useContext) | HIGH | Context performance issues |
| [React sanitizeURL](https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/shared/sanitizeURL.js) | HIGH | javascript: URL blocking |
| [OpenRouter Docs](https://openrouter.ai/docs) | HIGH | API errors, rate limits, streaming |
