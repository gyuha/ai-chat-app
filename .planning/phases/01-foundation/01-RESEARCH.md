# Phase 1: Foundation - Research

**Researched:** 2026-04-02
**Domain:** React SPA with OpenRouter API integration, localStorage persistence, ChatGPT-style layout
**Confidence:** MEDIUM

## Summary

Phase 1 establishes the project foundation: Vite + React + TypeScript + Tailwind CSS scaffolding, ChatProvider (Context + Reducer) architecture, and API key management with conversation CRUD. All decisions are locked from CONTEXT.md. The main technical uncertainties are around OpenRouter API key validation details (documentation inaccessible during research), which must be verified during implementation.

**Primary recommendation:** Use `npm create vite@latest` with react-ts template, then integrate Tailwind CSS v4 via `@tailwindcss/vite` plugin. No official OpenRouter SDK exists - use native fetch with Bearer token auth.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** ChatGPT一模一样 레이아웃 -- 사이드바 260px, 메인 영역 flex-1, 중앙 정렬 채팅 컨테이너 (max-width 768px)
- **D-02:** 색상 scheme -- Light만 지원 (Dark 없음)
- **D-03:** API 키 입력 UI -- Modal overlay 방식 (중앙 팝업, 입력 완료 전 메인 UI 비활성화)
- **D-04:** API 키 유효하지 않을 때 -- Modal 내 에러 메시지 표시
- **D-05:** 사이드바 대화 목록 -- 제목만 표시 (클릭으로 선택)
- **D-06:** 새 대화 버튼 -- 사이드바 상단 고정
- **D-07:** 대화 삭제 -- 대화 우측에 삭제 아이콘 (hover 시 표시)

### Claude's Discretion
- 구체적인 색상 값 (Tailwind 클래스)
- Typography 세밀한 설정
- 모달 애니메이션 효과
- 입력 폼 스타일 세밀한 설정

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| API-01 | 사용자는 API 키 입력 필드에 OpenRouter API 키를 입력 가능 | Modal overlay input with secure field type |
| API-02 | 사용자는 "연결" 버튼으로 API 키 유효성 검사 가능 | OpenRouter `/api/v1/auth/key` endpoint (UNVERIFIED) |
| API-03 | API 키는 localStorage에 저장되어 페이지 새로고침 후에도 유지 | localStorage.setItem/getItem pattern |
| API-04 | API 키 유효하지 않을 때 오류 메시지 표시 | Modal error state display |
| CHAT-01 | 사용자는 사이드바에서 "새 대화" 버튼으로 새 대화방 생성 가능 | Sidebar header button, ChatProvider.createChat() |
| CHAT-02 | 사용자는 사이드바에서 기존 대화방 클릭하여 선택 가능 | Sidebar clickable items, ChatProvider.selectChat() |
| CHAT-03 | 사용자는 사이드바에서 대화방 삭제 가능 | Sidebar delete icon (hover), ChatProvider.deleteChat() |
| CHAT-04 | 대화방 이름은 첫 번째 사용자 메시지 내용으로 자동 설정 | ChatProvider action on first message |
| CHAT-05 | 선택된 대화방의 메시지 목록이 메인 영역에 표시 | ChatArea component reading from ChatProvider |
| MODEL-01 | 사용자는 오른쪽 상단 셀렉트 박스에서 무료 모델 선택 가능 | Header model select, ChatProvider.setModel() |
| MODEL-02 | 선택된 모델은 localStorage에 저장 | localStorage persistence pattern |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vite | ^6.x | Build tool & dev server | Fast HMR, standard React SPA tool |
| React | ^19.x | UI framework | Core constraint from CLAUDE.md |
| TypeScript | ^5.x | Type safety | Catches errors early, better DX |
| Tailwind CSS | ^4.2.x | Styling | CSS-first config, excellent ChatGPT-like layout support |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/vite | ^4.2.x | Tailwind Vite integration | Required for Tailwind v4 |
| openai (fetch-based) | N/A | API calls | Direct fetch to OpenRouter API (no official SDK) |

**Installation:**
```bash
npm create vite@latest . -- --template react-ts
npm install -D tailwindcss @tailwindcss/vite
npm install
```

**Version verification:** Verified 2026-04-02
- `tailwindcss`: 4.2.2 (latest)
- `@tailwindcss/vite`: 4.2.2 (matches tailwindcss)
- `vite`: ^6.x (npm create vite defaults to latest)

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v4 postcss | Tailwind v3 + postcss | v4 has simpler setup but v3 is more documented |
| @tailwindcss/vite | autoprefixer + postcss | Official plugin is the recommended v4 approach |

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx       # 260px sidebar with chat list
│   │   ├── Header.tsx        # Model selector, right-aligned
│   │   └── ChatArea.tsx      # Main chat container, max-w-768px
│   ├── chat/
│   │   ├── ChatList.tsx      # Sidebar chat list
│   │   └── ChatItem.tsx      # Individual chat item
│   └── modals/
│       └── ApiKeyModal.tsx   # API key input overlay
├── context/
│   └── ChatContext.tsx       # Context + Reducer provider
├── hooks/
│   ├── useLocalStorage.ts    # localStorage with error handling
│   └── useChat.ts            # Chat actions wrapper
├── types/
│   └── chat.ts               # TypeScript interfaces
├── lib/
│   └── api.ts                # OpenRouter API calls
├── App.tsx                   # Root layout
└── main.tsx                  # Entry point
```

### Pattern 1: ChatProvider (Context + Reducer)

**What:** Global state management using React Context + useReducer
**When to use:** All chat state (conversations, messages, API key, selected model)
**Source:** Standard React pattern (training data)

```typescript
// types/chat.ts
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  apiKey: string | null;
  conversations: Conversation[];
  selectedConversationId: string | null;
  selectedModel: string;
  isValidating: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'SET_API_KEY_VALIDATING'; payload: boolean }
  | { type: 'SET_API_KEY_ERROR'; payload: string }
  | { type: 'CREATE_CHAT' }
  | { type: 'SELECT_CHAT'; payload: string }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'UPDATE_CHAT_NAME'; payload: { conversationId: string; name: string } }
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<ChatState> };
```

### Pattern 2: localStorage Persistence Hook

**What:** Custom hook for localStorage with quota error handling
**When to use:** Persisting API key, model selection, conversations
**Source:** Standard pattern (training data)

```typescript
// hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('localStorage quota exceeded');
      }
      throw error;
    }
  };

  return [storedValue, setValue] as const;
}
```

### Pattern 3: Modal Overlay

**What:** Blocking modal for API key input
**When to use:** API-01, API-02, API-04 requirements
**CSS:** Fixed position overlay with centered modal content

```tsx
// modals/ApiKeyModal.tsx pattern
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="bg-white rounded-lg p-6 w-full max-w-md">
    <h2 className="text-lg font-semibold mb-4">Enter API Key</h2>
    <input
      type="password"
      className="w-full px-3 py-2 border rounded-lg"
      placeholder="sk-or-..."
    />
    {error && <p className="text-red-500 mt-2">{error}</p>}
    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg">
      Connect
    </button>
  </div>
</div>
```

### Anti-Patterns to Avoid

- **Tailwind arbitrary values for layout:** Use fixed Tailwind classes (w-[260px]) is acceptable but prefer standard w-64 if close enough
- **Direct localStorage access in components:** Always use useLocalStorage hook for consistency
- **Modal closing on overlay click:** D-03 implies user must explicitly close, so disable backdrop click

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| API key validation | Custom validation logic | OpenRouter API endpoint | OpenRouter knows if key is valid |
| Unique ID generation | Math.random() | crypto.randomUUID() | Built-in, no dependencies |
| Date handling | External library | Date.now() timestamps | Simple numeric timestamps sufficient |

**Key insight:** OpenRouter API key validation should call the API itself, not do client-side format checking (keys look like `sk-or-v1-...` but format can change).

## Common Pitfalls

### Pitfall 1: Tailwind v4 CSS Import
**What goes wrong:** Old `@tailwind directives` don't work with v4
**Why it happens:** Tailwind v4 uses `@import "tailwindcss"` instead
**How to avoid:** Follow v4 setup exactly -- install `@tailwindcss/vite` and use CSS import
**Warning signs:** Styles not applying, build warnings about tailwind directives

### Pitfall 2: localStorage Quota Exceeded
**What goes wrong:** Large conversation history causes silent failures
**Why it happens:** localStorage has ~5MB limit per origin
**How to avoid:** Implement error handling in useLocalStorage, handle STORE-03 requirement
**Warning signs:** Conversations not saving, no error shown to user

### Pitfall 3: API Key Validation with Real Network
**What goes wrong:** Validation timeout or network error shows wrong message
**Why it happens:** API-02 requires actual network call to OpenRouter
**How to avoid:** Use proper loading state, clear error messages, consider caching validation result
**Warning signs:** "Invalid API key" shown for network errors

### Pitfall 4: Context Re-render Performance
**What goes wrong:** Every message update re-renders entire app
**Why it happens:** Context value changes on every message add
**How to avoid:** Split context into multiple smaller contexts, or use useMemo for derived values
**Warning signs:** Slow typing, UI lag with long conversations

## Code Examples

### Vite + React + Tailwind v4 Setup (Verified via WebFetch)

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

### OpenRouter API Key Validation (UNVERIFIED - based on training data)

```typescript
// lib/api.ts
const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

interface KeyValidationResult {
  valid: boolean;
  error?: string;
}

async function validateApiKey(apiKey: string): Promise<KeyValidationResult> {
  try {
    const response = await fetch(`${OPENROUTER_API_BASE}/auth/key`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      return { valid: true };
    }

    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    return { valid: false, error: error.error || 'Invalid API key' };
  } catch (err) {
    return { valid: false, error: 'Network error - please try again' };
  }
}
```

### Conversation CRUD with Context (Pattern from training data)

```typescript
// context/ChatContext.tsx
const initialState: ChatState = {
  apiKey: null,
  conversations: [],
  selectedConversationId: null,
  selectedModel: 'openrouter/free-models', // Default free model
  isValidating: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
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
    case 'DELETE_CHAT':
      return {
        ...state,
        conversations: state.conversations.filter(c => c.id !== action.payload),
        selectedConversationId:
          state.selectedConversationId === action.payload
            ? state.conversations[0]?.id || null
            : state.selectedConversationId,
      };
    default:
      return state;
  }
}
```

### Sidebar Layout (ChatGPT-style)

```tsx
// components/layout/Sidebar.tsx
<div className="w-[260px] h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
  {/* New chat button - top */}
  <div className="p-3">
    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
      <span>+</span>
      <span>New chat</span>
    </button>
  </div>

  {/* Chat list */}
  <div className="flex-1 overflow-y-auto">
    {conversations.map(conv => (
      <div
        key={conv.id}
        className="group relative px-3 py-2 cursor-pointer hover:bg-gray-100"
      >
        <span className="truncate">{conv.name}</span>
        {/* Delete icon - visible on hover */}
        <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500">
          <TrashIcon />
        </button>
      </div>
    ))}
  </div>
</div>
```

### Main Chat Area (Centered, max-width 768px)

```tsx
// components/layout/ChatArea.tsx
<div className="flex-1 flex flex-col">
  {/* Header with model selector */}
  <header className="h-14 px-4 flex items-center justify-end border-b">
    <select className="px-3 py-1.5 rounded-lg border bg-white text-sm">
      <option value="openrouter/free-models">Free Models</option>
    </select>
  </header>

  {/* Chat messages - centered container */}
  <main className="flex-1 overflow-y-auto">
    <div className="max-w-[768px] mx-auto px-4 py-6">
      {/* Messages rendered here */}
    </div>
  </main>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind postcss plugin | @tailwindcss/vite plugin | Tailwind v4 (2024) | Simpler config, faster builds |
| create-react-app | Vite | 2020+ | 10x faster dev server |
| Redux | Context + useReducer | React 16.3+ (2018) | Less boilerplate for this use case |

**Deprecated/outdated:**
- Tailwind v3 `@tailwind` directives: Use `@import "tailwindcss"` in v4
- CRA (create-react-app): Vite is the modern standard

## Open Questions

1. **OpenRouter API Key Validation Endpoint**
   - What we know: OpenRouter uses Bearer token auth at `https://openrouter.ai/api/v1`
   - What's unclear: Exact endpoint for key validation (`/auth/key` vs `/api-keys` vs other)
   - Recommendation: Verify endpoint during implementation by testing with a known key

2. **Free Models List**
   - What we know: OpenRouter has free models accessible via `:free` suffix
   - What's unclear: Exact model IDs to populate the selector
   - Recommendation: Use OpenRouter `/models` endpoint to dynamically fetch, or hardcode known free models for Phase 1

3. **API Key Modal on First Load**
   - What we know: D-03 says modal overlay until API key entered
   - What's unclear: Should modal block ALL interaction or just prompt for key?
   - Recommendation: Block interaction until valid key OR show chat interface with prominent key prompt

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified -- this is a greenfield SPA project that will be scaffolded from scratch; all tools are local to the project: Vite, React, TypeScript, Tailwind)

## Validation Architecture

**Note:** `nyquist_validation` is set to `false` in `.planning/config.json` -- Validation Architecture section omitted.

## Sources

### Primary (HIGH confidence)
- Vite setup: https://vite.dev/guide/ -- Verified 2026-04-02
- Tailwind v4 Vite integration: https://tailwindcss.com/docs/guides/vite -- Verified 2026-04-02

### Secondary (MEDIUM confidence)
- OpenRouter API patterns: Based on training data, documentation inaccessible at research time
- React Context + Reducer patterns: Standard React patterns (training data)

### Tertiary (LOW confidence)
- OpenRouter key validation endpoint: Training data only, requires verification
- OpenRouter free model IDs: Training data only, requires verification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified package versions
- Architecture: MEDIUM - Standard patterns, Context7/OpenRouter docs not fully accessible
- Pitfalls: MEDIUM - Known Tailwind v4 transition issues from research

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (30 days for stable stack, package versions may need verification)
