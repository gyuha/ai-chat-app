# Phase 1: Foundation - Research

**Researched:** 2026-03-30
**Domain:** OpenRouter API integration, streaming chat, API key management
**Confidence:** HIGH

## Summary

Phase 1 implements the foundation: API key management, free model selection, and streaming Markdown chat. The project is a fresh React 19 + Vite SPA with shadcn/ui + Tailwind CSS v4. OpenRouter's OpenAI-compatible API handles chat completions with SSE streaming. Settings (API key, default model) are stored in IndexedDB via Dexie.js. TanStack Query caches the models list.

**Primary recommendation:** Use OpenRouter's `POST /api/v1/chat/completions` with `stream: true`, parse SSE manually (no SDK), store settings in Dexie.js `settings` table, cache models with TanStack Query using `staleTime: 10 minutes`.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** API 키 없으면 전체 화면 가이드 + 입력 표시 (전체 화면 모달 아님, 메인 영역 활용)
- **D-02:** 설정 페이지(/settings)에서 API 키 변경/삭제
- **D-03:** 드롭다운 방식으로 모델 선택
- **D-04:** 무료 모델 필터링: `pricing.prompt === "0" && pricing.completion === "0"`
- **D-05:** TanStack Query로 모델 목록 캐싱 (staleTime: 10분)
- **D-06:** 토큰 단위 실시간 렌더링
- **D-07:** Markdown 렌더링은 스트리밍 완료 후 또는 코드블록 시작 시점에만 적용
- **D-08:** Stop 버튼으로 AbortController 사용, 스트리밍 중단
- **D-09:** API 에러 시 shadcn/ui toast 사용
- **D-10:** Rate limit 초과 시 사용자에게 안내 메시지 표시
- **D-11:** 글로벌 시스템 프롬프트는 settings에 저장

### Claude's Discretion

- Exact Markdown rendering approach during streaming (debounce 전략)
- Exact loading indicator design
- Exact API error message formatting

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within Phase 1 scope

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | 사용자가 OpenRouter API 키를 입력하여 저장할 수 있다 | Dexie.js settings table, input flow per D-01 |
| AUTH-02 | 저장된 API 키의 유효성을 API 호출로 검증할 수 있다 | OpenRouter GET /api/v1/models validation |
| AUTH-03 | 사용자가 설정 페이지에서 API 키를 변경/삭제할 수 있다 | Settings page at /settings, Dexie.js CRUD |
| MODL-01 | 앱이 OpenRouter Models API에서 모델 목록을 조회할 수 있다 | GET https://openrouter.ai/api/v1/models |
| MODL-02 | 앱이 무료 모델(prompt=0, completion=0)만 필터링하여 표시할 수 있다 | Filter `pricing.prompt === "0" && pricing.completion === "0"` |
| MODL-03 | 사용자가 대화에 사용할 모델을 선택할 수 있다 | Dropdown per D-03, stored in Zustand + persisted |
| MODL-04 | 사용자가 기본 모델을 설정으로 저장할 수 있다 | Dexie.js settings table, defaultModel field |
| CHAT-01 | 사용자가 텍스트 메시지를 입력하고 AI 응답을 받을 수 있다 | POST /api/v1/chat/completions with messages array |
| CHAT-02 | AI 응답이 스트리밍 방식으로 실시간 표시된다 | SSE streaming with `data: {...}` chunks |
| CHAT-03 | AI 응답이 Markdown으로 렌더링된다 (코드블록 하이라이팅 포함) | react-markdown + remark-gfm + rehype-highlight |
| CHAT-04 | 메시지 전송 중 로딩 인디케이터가 표시된다 | UI indicator while streaming |
| CHAT-05 | 사용자가 스트리밍 중 Stop 버튼으로 응답을 중단할 수 있다 | AbortController, per D-08 |
| CHAT-06 | 시스템 프롬프트를 설정할 수 있다 (글로벌 또는 대화별) | Global in settings per D-11, conversation-level in Phase 3 |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | UI Framework | Project constraint |
| Vite | 8.0.3 | Build Tool | Project constraint |
| TypeScript | 6.0.2 | Type System | Project constraint |

### UI
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | 0.9.5 | Component Library | Buttons, inputs, dropdowns, toasts |
| Tailwind CSS | 4.2.2 | Utility CSS | Layout, styling |

### State & Data
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zustand | 5.0.12 | Client state | Chat messages, selected model, streaming state |
| TanStack Query | 5.95.2 | Server state | Models list caching |
| Dexie.js | 4.4.1 | IndexedDB ORM | Settings persistence (API key, default model, system prompt) |

### Markdown
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-markdown | 10.1.0 | Markdown parsing | AI response rendering |
| remark-gfm | 4.0.1 | GFM support | Tables, strikethrough, task lists |
| rehype-highlight | 7.0.2 | Syntax highlighting | Code blocks |

### HTTP
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Built-in fetch | native | HTTP client | OpenRouter API calls |

**Installation:**
```bash
pnpm add zustand @tanstack/react-query dexie react-markdown remark-gfm rehype-highlight
```

**Version verification:** All versions verified via npm registry 2026-03-30.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── api/                  # OpenRouter API calls
│   ├── client.ts         # Fetch wrapper with auth
│   └── openrouter.ts     # API-specific functions
├── components/           # UI components
│   └── ui/              # shadcn/ui components
├── db/                   # Dexie.js database
│   └── index.ts         # Database schema and instance
├── hooks/                # Custom React hooks
│   ├── use-chat.ts      # Chat streaming hook
│   └── use-models.ts    # Models query hook
├── stores/               # Zustand stores
│   └── chat-store.ts    # Chat state (messages, streaming, abort)
└── lib/                  # Utilities
    └── utils.ts         # cn() helper
```

### Pattern 1: OpenRouter API Client
**What:** Typed fetch wrapper with API key injection
**When to use:** Every API call to OpenRouter
**Example:**
```typescript
// Source: OpenRouter API docs + OpenAI compatibility
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

async function openRouterRequest<T>(
  endpoint: string,
  options: RequestInit & { apiKey: string }
): Promise<T> {
  const { apiKey, ...fetchOptions } = options;
  const response = await fetch(`${OPENROUTER_BASE}${endpoint}`, {
    ...fetchOptions,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new OpenRouterError(response.status, error?.error?.message);
  }
  return response.json();
}
```

### Pattern 2: SSE Streaming Parser
**What:** Async generator that yields SSE chunks as parsed JSON
**When to use:** Chat streaming (CHAT-02)
**Example:**
```typescript
// Source: OpenRouter streaming docs
async function* parseSSEStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return;
        yield JSON.parse(data);
      }
      // Skip keep-alive comments ": OPENROUTER PROCESSING"
    }
  }
}
```

### Pattern 3: Dexie.js Settings Schema
**What:** IndexedDB schema for app settings
**When to use:** AUTH-01, AUTH-03, MODL-04, CHAT-06
**Example:**
```typescript
// Source: Dexie.js documentation
import Dexie from "dexie";

class ChatDatabase extends Dexie {
  settings!: Table<Setting>;
  conversations!: Table<Conversation>;  // Phase 2
  messages!: Table<Message>;            // Phase 2

  constructor() {
    super("OpenRouterChat");
    this.version(1).stores({
      settings: "key",  // primary key: "apiKey", "defaultModel", "systemPrompt"
      conversations: "++id, updatedAt",
      messages: "++id, conversationId, createdAt",
    });
  }
}

interface Setting {
  key: string;  // "apiKey" | "defaultModel" | "systemPrompt"
  value: string;
}
```

### Pattern 4: Zustand Chat Store
**What:** Client state for chat messages and streaming control
**When to use:** CHAT-01 through CHAT-06
**Example:**
```typescript
// Source: Zustand documentation
import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  abortController: AbortController | null;
  selectedModel: string | null;
  // Actions
  addMessage: (msg: Omit<Message, "id" | "createdAt">) => void;
  setStreaming: (streaming: boolean) => void;
  setAbortController: (controller: AbortController | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  abortController: null,
  selectedModel: null,
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: crypto.randomUUID(), createdAt: Date.now() },
      ],
    })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setAbortController: (abortController) => set({ abortController }),
  clearMessages: () => set({ messages: [] }),
}));
```

### Pattern 5: TanStack Query Models Hook
**What:** Hook that fetches and caches the models list
**When to use:** MODL-01, MODL-02
**Example:**
```typescript
// Source: TanStack Query documentation
import { useQuery } from "@tanstack/react-query";

interface OpenRouterModel {
  id: string;
  name: string;
  pricing: { prompt: string; completion: string };
}

async function fetchModels(apiKey: string): Promise<OpenRouterModel[]> {
  const res = await openRouterRequest<{ data: OpenRouterModel[] }>(
    "/models",
    { apiKey }
  );
  return res.data;
}

export function useModels(apiKey: string | null) {
  return useQuery({
    queryKey: ["models", apiKey],
    queryFn: () => fetchModels(apiKey!),
    enabled: !!apiKey,
    staleTime: 10 * 60 * 1000, // 10 minutes per D-05
    select: (models) =>
      models.filter(
        (m) => m.pricing.prompt === "0" && m.pricing.completion === "0"
      ), // Free models only per D-04
  });
}
```

### Pattern 6: Streaming Chat Hook
**What:** Hook that handles the full streaming chat flow
**When to use:** CHAT-01, CHAT-02, CHAT-05
**Example:**
```typescript
// Source: OpenRouter streaming + Zustand patterns
function useChat() {
  const { apiKey } = useSettings(); // from Dexie
  const { messages, addMessage, setStreaming, setAbortController } = useChatStore();
  const chatContext = useChatContext(); // contains selectedModel, systemPrompt

  const sendMessage = async (content: string) => {
    const controller = new AbortController();
    setAbortController(controller);
    setStreaming(true);

    // Add user message
    addMessage({ role: "user", content });

    // Prepare messages array with system prompt
    const apiMessages = [
      ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content },
    ];

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: apiMessages,
            stream: true,
          }),
          signal: controller.signal,
        }
      );

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE... (see Pattern 2)
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (data === "[DONE]") continue;
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              // Real-time update per D-06
              updateAssistantMessage(assistantContent);
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User stopped - don't add error
      } else {
        // Handle error per D-09, D-10
        showErrorToast((err as Error).message);
      }
    } finally {
      setStreaming(false);
      setAbortController(null);
    }
  };

  const stop = () => abortController?.abort();

  return { messages, sendMessage, stop, isStreaming };
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| IndexedDB access | Raw IDB API | Dexie.js | Dexie has simpler API, better TypeScript support, reactive queries |
| Markdown rendering | Custom parser | react-markdown + remark-gfm + rehype-highlight | Edge cases handled, GFM support, syntax highlighting |
| HTTP client | axios | Built-in fetch | OpenAI-compatible API is simple, no need for axios overhead |
| SSE parsing | eventsource-parser | Manual parsing | Simple enough for manual parsing, no extra dependency |
| Toast notifications | Custom toasts | shadcn/ui Sonner | Accessible, animated, easy to integrate |
| Settings storage | localStorage | Dexie.js | localStorage is synchronous, Dexie is async and reactive |

---

## Common Pitfalls

### Pitfall 1: Streaming mid-stream errors ignored
**What goes wrong:** HTTP 200 with SSE `finish_reason: "error"` gets treated as success.
**Why it happens:** SSE errors appear inside `data: {...}` chunks, not as HTTP errors.
**How to avoid:** Check for `error` field in SSE chunk and `finish_reason: "error"` — show error toast and stop.
**Warning signs:** Error messages appearing in chat as normal text.

### Pitfall 2: Response body consumed twice
**What goes wrong:** `TypeError: Body has already been consumed`.
**Why it happens:** Fetch body is a `ReadableStream` — can only be read once. Need `response.clone()` for multiple consumers.
**How to avoid:** Use `response.clone()` if UI streaming and DB saving both read the body. For Phase 1, no DB saving yet, so not critical.
**Warning signs:** "Body has already been consumed" error in console.

### Pitfall 3: AbortController called after fetch completes
**What goes wrong:** `AbortError` thrown after stream finishes.
**Why it happens:** Calling `controller.abort()` after response.body is fully read.
**How to avoid:** Check `isStreaming` state before aborting; only abort while actively streaming.
**Warning signs:** Uncaught AbortError in console after stopping.

### Pitfall 4: Free models filter misses edge cases
**What goes wrong:** Some free models have `"0.0"` instead of `"0"` for pricing.
**Why it happens:** Price is a string comparison, not numeric.
**How to avoid:** Use `parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0` or handle both formats.

### Pitfall 5: No API key validation on save
**What goes wrong:** Invalid API key saved without verification, user sees cryptic errors later.
**Why it happens:** AUTH-01 and AUTH-02 could be implemented separately without validation.
**How to avoid:** Immediately call `GET /api/v1/models` after save to validate. Show success or error inline.

---

## Code Examples

### API Key Input Component
```typescript
// Source: shadcn/ui Input + our D-01, D-09
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSettings } from "@/hooks/use-settings";

export function ApiKeyInput() {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { saveApiKey } = useSettings();

  const handleSave = async () => {
    setError(null);
    try {
      await saveApiKey(key);
      // Success - redirect or show inline
    } catch (err) {
      setError("유효하지 않은 API 키입니다."); // D-09: Korean error
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="password"
        placeholder="OpenRouter API 키를 입력하세요"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleSave}>저장</Button>
    </div>
  );
}
```

### Model Selector Dropdown
```typescript
// Source: shadcn/ui Select + D-03, D-04
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModels } from "@/hooks/use-models";

export function ModelSelector() {
  const { apiKey } = useSettings();
  const { data: models, isLoading } = useModels(apiKey);

  return (
    <Select onValueChange={(modelId) => setSelectedModel(modelId)}>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="모델 선택" />
      </SelectTrigger>
      <SelectContent>
        {models?.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name || model.id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Markdown Chat Message
```typescript
// Source: react-markdown + D-07
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface ChatMessageProps {
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ content, isStreaming }: ChatMessageProps) {
  // Delay markdown rendering until streaming complete or code block starts
  const shouldRenderMarkdown = !isStreaming || content.includes("```");

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        skipHtml={false}
      >
        {shouldRenderMarkdown ? content : content}
      </ReactMarkdown>
    </div>
  );
}
```

### Stop Button
```typescript
// Source: shadcn/ui Button + D-08
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat-store";

export function StopButton() {
  const { isStreaming, stop } = useChatStore();

  if (!isStreaming) return null;

  return (
    <Button variant="outline" onClick={stop}>
      Stop
    </Button>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SDK-based API calls | Direct fetch + SSE parsing | 2024-2025 | Less dependencies, full control |
| localStorage for settings | IndexedDB via Dexie.js | 2024+ | Async, reactive, better for complex data |
| Single-message render | Token-by-token streaming | 2022+ (ChatGPT) | Real-time feel, perceived speed |
| Separate lint + format | Biome unified lint+format | 2024 | Faster, single tool |

**Deprecated/outdated:**
- `eventsource-parser` library: No longer needed for simple SSE parsing
- SWR for server state: TanStack Query has better caching and devtools

---

## Open Questions

1. **Should the API key be encrypted before IndexedDB storage?**
   - What we know: PITFALLS.md documents the security concern (API key in plain text)
   - What's unclear: Level of effort vs. security gain for v1
   - Recommendation: Accept plain IndexedDB storage for Phase 1 (matches Out of Scope decision)

2. **How to handle the initial "no API key" state UX?**
   - What we know: D-01 says "메인 영역 활용" (use main area, not modal)
   - What's unclear: Exact layout — full-page takeover or inline prompt?
   - Recommendation: Full-page takeover with centered card (ChatGPT-style onboarding)

3. **Where does the settings page live?**
   - What we know: D-02 says `/settings` route
   - What's unclear: If TanStack Router is set up yet (this is Phase 1)
   - Recommendation: Implement `/settings` route as part of Phase 1 routing setup

---

## Environment Availability

> Step 2.6: SKIPPED (no external dependencies beyond project dependencies — all required packages are in node_modules)

---

## Validation Architecture

> Skipped — `workflow.nyquist_validation` is explicitly `false` in `.planning/config.json`

---

## Sources

### Primary (HIGH confidence)
- [OpenRouter Streaming Documentation](https://openrouter.ai/docs/api/reference/streaming) — SSE format, parsing algorithm, error handling
- [OpenRouter Chat Completions API](https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request) — endpoint, headers, request/response format
- [OpenRouter Error Handling](https://openrouter.ai/docs/api/reference/errors-and-debugging) — HTTP status codes, error response format, retry guidance
- npm registry — package versions verified 2026-03-30

### Secondary (MEDIUM confidence)
- [Dexie.js Documentation](https://dexie.org/docs/) — IndexedDB ORM patterns (partial page fetch)
- [TanStack Query Documentation](https://tanstack.com/query/latest) — caching patterns
- [Zustand Documentation](https://zustand.docs.pmnd.rs/) — state management patterns
- [react-markdown Documentation](https://reactmarkdown.dev/) — React 19 compatibility

### Tertiary (LOW confidence)
- Community patterns for SSE streaming in React (not verified against official docs)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified, libraries are mainstream
- Architecture: HIGH — patterns match official docs + established practices
- Pitfalls: MEDIUM — sourced from PITFALLS.md research, some verified via OpenRouter docs

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (30 days — stable technology domain)
