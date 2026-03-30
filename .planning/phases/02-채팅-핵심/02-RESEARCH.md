# Phase 2: 채팅 핵심 - Research

**Researched:** 2026-03-31
**Domain:** OpenRouter API SSE 스트리밍 + React 채팅 UI + 마크다운 렌더링
**Confidence:** MEDIUM (웹 검색 API 불가, npm registry + 기존 지식 + 코드베이스 분석 기반)

## Summary

Phase 2는 OpenRouter Chat 앱의 핵심 가치인 "실시간 스트리밍 채팅"을 구현한다. Phase 1에서 구축된 IndexedDB(Dexie.js) 데이터 계층, Zustand UI 상태, TanStack Query 캐싱, TanStack Router 라우팅 기반 위에 채팅 기능을 올린다.

핵심 구현 영역은 세 가지다: (1) OpenRouter API와의 SSE 스트리밍 통신 (fetch + ReadableStream + AbortController), (2) 스트리밍 채팅 UI (메시지 목록, 오토스크롤, 입력 영역, 로딩 인디케이터), (3) 마크다운 렌더링 (react-markdown + remark-gfm + rehype-highlight). 추가로 무료 모델 목록 조회, API 오류 처리(토스트 알림, 429 Rate Limit 안내, 재시도 버튼)도 포함된다.

**Primary recommendation:** SSE 파싱은 브라우저 내장 fetch + ReadableStream을 직접 사용하고, 별도 라이브러리(@microsoft/fetch-event-source, eventsource-parser)는 도입하지 마라. OpenRouter API는 POST 요청이 필요하고 AbortController로 중단해야 하므로 EventSource(POST 미지원) 대신 fetch가 적합하다. 마크다운 렌더링은 CLAUDE.md에서 확정된 react-markdown + remark-gfm + rehype-highlight 조합을 그대로 사용하며, highlight.js는 rehype-highlight의 peer dependency로 설치한다.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CHAT-01 | 사용자가 메시지를 전송하고 SSE 스트리밍으로 실시간 토큰 단위 응답을 받을 수 있다 | fetch + ReadableStream으로 SSE 파싱, AbortController로 스트림 제어, Zustand로 스트리밍 상태 관리 |
| CHAT-02 | 사용자가 Stop 버튼으로 스트리밍 응답을 중단할 수 있다 (AbortController) | AbortController.abort() 호출로 fetch 취소, AbortError 처리 |
| CHAT-03 | 어시스턴트 응답이 마크다운으로 렌더링된다 (코드블록 구문 강조 포함) | react-markdown v10 + remark-gfm v4 + rehype-highlight v7 + highlight.js v11 |
| CHAT-06 | 스트리밍 중 오토스크롤이 동작한다 (사용자 수동 스크롤 시 자동 스크롤 중지) | IntersectionObserver 또는 scroll 이벤트로 사용자 스크롤 감지, 조건부 scrollToBottom |
| CHAT-07 | 응답 대기 중 로딩 인디케이터가 표시된다 | 스트리밍 상태에 따른 Lucide Loader2 스피너 또는 타이핑 인디케이터 |
| CHAT-08 | Enter로 전송, Shift+Enter로 줄바꿈이 동작한다 | textarea onKeyDown 핸들러에서 key === "Enter" && !shiftKey 체크 |
| MODL-01 | 사용자가 무료 모델 목록을 조회하고 대화별로 모델을 선택할 수 있다 | OpenRouter GET /api/v1/models API 호출, pricing이 "0"인 모델 필터링 |
| MODL-02 | API 오류 시 토스트 알림이 표시된다 | sonner v2 토스트 라이브러리 + shadcn/ui Toaster 컴포넌트 |
| MODL-03 | Rate Limit(429) 초과 시 사용자에게 안내가 표시된다 | HTTP 429 응답 감지, 한국어 안내 토스트 ("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.") |
| MODL-04 | API 오류 발생 시 재시도 버튼이 표시된다 | 오류 메시지와 함께 재시도 버튼 UI, 동일 요청 재전송 로직 |
</phase_requirements>

## Standard Stack

### Core (Phase 2 추가)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-markdown | 10.1.0 | 마크다운 렌더링 | CLAUDE.md 확정. ESM-only, XSS 보호 내장 |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown | CLAUDE.md 확정. 테이블, 취소선, 자동 링크 |
| rehype-highlight | 7.0.2 | 코드 구문 강조 | CLAUDE.md 확정. highlight.js 기반, 190+ 언어 |
| highlight.js | 11.11.1 | 구문 강조 엔진 | rehype-highlight의 peer dependency |
| sonner | 2.0.7 | 토스트 알림 | shadcn/ui 공식 토스트 솔루션. 다크모드 지원, 가볍고 접근성 좋음 |

### Already Installed (Phase 1)
| Library | Version | Purpose | Phase 2 Usage |
|---------|---------|---------|---------------|
| react | 19.2.4 | UI 라이브러리 | 컴포넌트 렌더링 |
| react-dom | 19.2.4 | React DOM | 포털 등 |
| dexie | 4.4.1 | IndexedDB ORM | 메시지 저장/조회 |
| @tanstack/react-query | 5.95.2 | 서버 상태/캐싱 | 모델 목록 쿼리, 메시지 쿼리 |
| @tanstack/react-router | 1.168.8 | 라우팅 | /chat/$conversationId 파라미터 접근 |
| zustand | 5.0.12 | 클라이언트 상태 | 스트리밍 상태 관리 |
| lucide-react | 1.7.0 | 아이콘 | Send, Square(Stop), Loader2, RefreshCw 등 |
| radix-ui | ^1.4.3 | UI primitives | Popover(모델 선택), 기존 Select 등 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| fetch + ReadableStream (직접) | @microsoft/fetch-event-source | 라이브러리는 재연결 로직 제공하지만 이 앱은 재연결 불필요. AbortController로 충분 |
| fetch + ReadableStream (직접) | eventsource-parser (Vercel) | SSE 파싱 유틸리티지만 파싱 로직이 간단해 오버엔지니어링 |
| react-markdown | react-syntax-highlighter | 더 무거움. rehype-highlight가 highlight.js 직접 사용으로 가벼움 |
| sonner | 커스텀 토스트 | 접근성, 스택 관리, 애니메이션 직접 구현 필요. sonner가 shadcn/ui 공식 권장 |
| Zustand (스트리밍 상태) | React useState only | 여러 컴포넌트에서 스트리밍 상태 공유 필요. Zustand가 글로벌 접근에 적합 |

**Installation:**
```bash
pnpm add react-markdown remark-gfm rehype-highlight highlight.js sonner
```

**Version verification:** 2026-03-31 npm registry 직접 조회 완료.

## Architecture Patterns

### Recommended Project Structure (Phase 2 확장)
```
src/
├── components/
│   ├── chat/                     # Phase 2 신규
│   │   ├── ChatPage.tsx          # 채팅 페이지 메인 컴포넌트
│   │   ├── ChatHeader.tsx        # 모델 선택 + 대화 제목
│   │   ├── MessageList.tsx       # 메시지 목록 (오토스크롤)
│   │   ├── MessageItem.tsx       # 개별 메시지 (마크다운 렌더링)
│   │   ├── MessageInput.tsx      # 입력 영역 (Enter/Shift+Enter)
│   │   ├── StreamingIndicator.tsx # 로딩/타이핑 인디케이터
│   │   └── ModelSelectorPopover.tsx # 대화별 모델 선택 팝오버
│   ├── ui/
│   │   ├── ... (기존 컴포넌트)
│   │   └── sonner.tsx            # shadcn/ui Toaster 래핑 (신규)
│   ├── conversation/             # Phase 1 (기존)
│   ├── layout/                   # Phase 1 (기존)
│   └── settings/                 # Phase 1 (기존)
├── db/
│   └── index.ts                  # Dexie.js (기존, 메시지 활용)
├── hooks/
│   ├── use-conversations.ts      # Phase 1 (기존)
│   ├── use-settings.ts           # Phase 1 (기존)
│   ├── use-messages.ts           # Phase 2 신규: 메시지 CRUD 훅
│   ├── use-chat-stream.ts        # Phase 2 신규: SSE 스트리밍 훅
│   └── use-free-models.ts        # Phase 2 신규: 무료 모델 목록 훅
├── services/                     # Phase 2 신규
│   └── openrouter-api.ts         # OpenRouter API 호출 함수
├── stores/
│   └── ui-store.ts               # Phase 1 (기존, 확장 가능)
├── routes/
│   ├── __root.tsx                # Toaster 추가 필요
│   ├── index.tsx                 # 빈 상태 / API 키 안내
│   ├── chat/
│   │   └── $conversationId.tsx   # ChatPage 렌더링
│   └── settings.tsx              # Phase 1 (기존)
├── lib/
│   ├── utils.ts                  # 기존
│   └── sse-parser.ts             # Phase 2 신규: SSE 파싱 유틸리티
└── main.tsx                      # 기존
```

### Pattern 1: fetch + ReadableStream SSE 스트리밍
**What:** 브라우저 내장 fetch API로 SSE 스트림 수신 및 토큰 단위 파싱
**When to use:** OpenRouter API 채팅 스트리밍
**Example:**
```typescript
// src/services/openrouter-api.ts
import type { Message } from "@/db";

interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: Error) => void;
}

export async function streamChatCompletion(
  apiKey: string,
  modelId: string,
  messages: Pick<Message, "role" | "content">[],
  systemPrompt: string | null,
  signal: AbortSignal,
  callbacks: StreamCallbacks,
): Promise<void> {
  const apiMessages = [];
  if (systemPrompt) {
    apiMessages.push({ role: "system", content: systemPrompt });
  }
  apiMessages.push(...messages);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: apiMessages,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `API 오류 (${response.status})`;
    try {
      const parsed = JSON.parse(errorBody);
      errorMessage = parsed.error?.message ?? errorMessage;
    } catch { /* JSON 파싱 실패 시 기본 메시지 사용 */ }

    const error = new Error(errorMessage) as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("ReadableStream을 지원하지 않는 브라우저입니다.");

  const decoder = new TextDecoder();
  let buffer = "";
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE 라인 단위 파싱
    const lines = buffer.split("\n");
    // 마지막 요소는 불완전할 수 있으므로 버퍼에 유지
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(":")) continue; // 빈 줄, 주석 무시
      if (!trimmed.startsWith("data: ")) continue;

      const data = trimmed.slice(6); // "data: " 제거
      if (data === "[DONE]") {
        callbacks.onComplete(fullContent);
        return;
      }

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta;
        if (delta?.content) {
          fullContent += delta.content;
          callbacks.onToken(delta.content);
        }
      } catch {
        // 파싱 실패 시 스킵 (불완전한 청크 가능성)
      }
    }
  }

  // 스트림이 [DONE] 없이 종료된 경우
  if (fullContent) {
    callbacks.onComplete(fullContent);
  }
}
```

### Pattern 2: useChatStream 커스텀 훅
**What:** SSE 스트리밍 상태를 관리하는 React 훅
**When to use:** 채팅 페이지에서 스트리밍 채팅 제어
**Example:**
```typescript
// src/hooks/use-chat-stream.ts
import { useCallback, useRef, useState } from "react";
import { streamChatCompletion } from "@/services/openrouter-api";
import type { Message } from "@/db";
import { useSetting, SETTINGS_KEYS } from "@/hooks/use-settings";

interface UseChatStreamReturn {
  streamingContent: string;
  isStreaming: boolean;
  error: Error | null;
  sendMessage: (messages: Pick<Message, "role" | "content">[]) => Promise<string>;
  stopStreaming: () => void;
  retry: () => void;
}

export function useChatStream(
  modelId: string,
  systemPrompt: string | null,
): UseChatStreamReturn {
  const { data: apiKey } = useSetting(SETTINGS_KEYS.API_KEY);
  const abortRef = useRef<AbortController | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastMessagesRef = useRef<Pick<Message, "role" | "content">[]>([]);
  const retryFnRef = useRef<(() => void) | null>(null);

  const sendMessage = useCallback(async (
    messages: Pick<Message, "role" | "content">[],
  ) => {
    if (!apiKey) throw new Error("API 키가 설정되지 않았습니다.");

    // 이전 스트림 중단
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsStreaming(true);
    setError(null);
    setStreamingContent("");
    lastMessagesRef.current = messages;

    try {
      return await streamChatCompletion(
        apiKey,
        modelId,
        messages,
        systemPrompt,
        controller.signal,
        {
          onToken: (token) => setStreamingContent((prev) => prev + token),
          onComplete: () => { /* 호출자에서 처리 */ },
          onError: (err) => { throw err; },
        },
      );
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // 사용자가 중단 - 에러 아님
      } else {
        setError(err as Error);
        throw err;
      }
    } finally {
      setIsStreaming(false);
    }
  }, [apiKey, modelId, systemPrompt]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  return { streamingContent, isStreaming, error, sendMessage, stopStreaming, retry: () => retryFnRef.current?.() };
}
```

### Pattern 3: 메시지 CRUD 훅
**What:** Dexie.js로 메시지를 저장하고 조회하는 훅
**When to use:** 대화 내 메시지 목록 조회, 메시지 저장
**Example:**
```typescript
// src/hooks/use-messages.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db, type Message } from "@/db";

export function useMessages(conversationId: string) {
  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      return db.messages
        .where("conversationId")
        .equals(conversationId)
        .sortBy("createdAt");
    },
    enabled: !!conversationId,
  });
}

export function useAddMessage() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Omit<Message, "createdAt">>({
    mutationFn: async (message) => {
      await db.messages.add({
        ...message,
        createdAt: new Date(),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
    },
  });
}
```

### Pattern 4: 무료 모델 목록 조회
**What:** OpenRouter API에서 무료 모델 목록을 가져오는 훅
**When to use:** 모델 선택 UI, 대화 헤더의 모델 선택
**Example:**
```typescript
// src/hooks/use-free-models.ts
import { useQuery } from "@tanstack/react-query";

interface ModelInfo {
  id: string;
  name: string;
  contextLength?: number;
  description?: string;
}

export function useFreeModels() {
  return useQuery<ModelInfo[]>({
    queryKey: ["free-models"],
    queryFn: async () => {
      const response = await fetch("https://openrouter.ai/api/v1/models");
      if (!response.ok) throw new Error("모델 목록을 불러올 수 없습니다.");
      const data = await response.json();

      return data.data
        .filter((model: Record<string, unknown>) => {
          const pricing = model.pricing as Record<string, string> | undefined;
          return pricing?.prompt === "0" && pricing?.completion === "0";
        })
        .map((model: Record<string, unknown>) => ({
          id: model.id as string,
          name: (model.name as string) || (model.id as string),
          contextLength: model.context_length as number | undefined,
          description: model.description as string | undefined,
        }))
        .sort((a: ModelInfo, b: ModelInfo) => a.name.localeCompare(b.name));
    },
    staleTime: 1000 * 60 * 30, // 30분 캐시 (모델 목록은 자주 변하지 않음)
    gcTime: 1000 * 60 * 60,    // 1시간 GC
  });
}
```

### Pattern 5: 오토스크롤
**What:** 스트리밍 중 자동 스크롤, 사용자 수동 스크롤 시 중지
**When to use:** 메시지 목록 컨테이너
**Example:**
```typescript
// 커스텀 훅 패턴
function useAutoScroll(isStreaming: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    // 하단에서 100px 이내면 자동 스크롤 유지
    shouldAutoScrollRef.current = scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  useEffect(() => {
    if (isStreaming && shouldAutoScrollRef.current) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isStreaming]); // streamingContent 변경 시마다 실행하려면 의존성 추가 필요

  return { containerRef, handleScroll };
}
```

### Pattern 6: Enter/Shift+Enter 입력 처리
**What:** textarea에서 Enter로 전송, Shift+Enter로 줄바꿈
**When to use:** 메시지 입력 영역
**Example:**
```typescript
function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}
```

### Anti-Patterns to Avoid
- **EventSource 사용:** EventSource는 GET 요청만 지원하며 AbortController를 사용할 수 없다. OpenRouter는 POST 요청이 필요하므로 반드시 fetch 사용
- **스트리밍 상태를 TanStack Query로 관리:** TanStack Query는 요청-응답 패턴에 적합하지, 지속적인 스트리밍 상태에는 부적합. Zustand나 useState 사용
- **streamingContent를 Dexie에 실시간 저장:** 매 토큰마다 IndexedDB에 쓰면 성능 저하. 스트리밍 완료 후 한 번에 저장
- **highlight.js 전체 언어 번들 임포트:** highlight.js/lib/common만 임포트하여 번들 크기 관리
- **모델 목록을 매 요청마다 호출:** TanStack Query의 staleTime(30분)으로 캐싱하여 불필요한 API 호출 방지

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 마크다운 렌더링 | 커스텀 마크다운 파서 | react-markdown + remark-gfm | XSS 보호, GFM 테이블, 파싱 엣지 케이스 |
| 코드 구문 강조 | 커스텀 하이라이터 | rehype-highlight + highlight.js | 190+ 언어, 자동 감지, 테마 시스템 |
| 토스트 알림 | 커스텀 알림 컴포넌트 | sonner (shadcn/ui 통합) | 접근성, 스택 관리, 애니메이션, 포지셔닝 |
| SSE 파싱 | 복잡한 파서 라이브러리 | 간단한 문자열 split 방식 | OpenRouter SSE는 표준 형식, 20줄 코드로 충분 |
| 오토스크롤 | IntersectionObserver 복잡 구현 | scrollHeight 체크 + flag | 간단하고 직관적, 채팅 앱에 충분 |

**Key insight:** 이 페이즈의 가장 중요한 코드는 SSE 스트리밍 로직이다. 라이브러리 없이 fetch + ReadableStream으로 충분히 구현 가능하며, 오히려 라이브러리 도입이 AbortController 연동을 복잡하게 만든다.

## Common Pitfalls

### Pitfall 1: SSE 버퍼 경계 처리
**What goes wrong:** SSE 청크가 "data: " 단위로 깔끔하게 나뉘지 않음. 여러 SSE 이벤트가 하나의 청크에 섞이거나, 하나의 이벤트가 여러 청크에 걸쳐 분할됨
**Why it happens:** TCP 스트림은 애플리케이션 레벨 메시지 경계를 보존하지 않음
**How to avoid:** 버퍼를 유지하고 개행 문자(`\n`)로 줄 단위 파싱. 마지막 불완전 줄은 다음 읽기에 이어붙임. 위 Pattern 1 코드 참조
**Warning signs:** 마크다운이 깨지거나, JSON.parse 에러 빈번 발생

### Pitfall 2: AbortController와 Strict Mode 이중 마운트
**What goes wrong:** React 19 StrictMode에서 useEffect가 두 번 실행되어 스트림이 두 번 시작됨
**Why it happens:** StrictMode는 개발 모드에서 의도적으로 컴포넌트를 두 번 마운트
**How to avoid:** AbortController를 useRef에 보관. 새 스트림 시작 전 기존 컨트롤러 abort. cleanup 함수에서 abort
**Warning signs:** 개발 모드에서 스트림이 두 번 실행, 응답이 두 번 출력

### Pitfall 3: 스트리밍 중 마크다운 깨짐
**What goes wrong:** 불완전한 마크다운(예: 코드블록 열고 닫기 전)이 깨져 보임
**Why it happens:** 토큰 단위로 들어오는 내용이 완전한 마크다운 구조가 아님
**How to avoid:** Phase 2에서는 react-markdown에 완성된 내용만 전달. Phase 4(CHAT-04)에서 점진적 렌더링 개선
**Warning signs:** 코드블록이 닫히기 전까지 렌더링이 깨짐

### Pitfall 4: 메시지 저장 시점
**What goes wrong:** 스트리밍 중 매 토큰마다 IndexedDB에 쓰거나, 스트림 완료 후 저장을 잊음
**Why it happens:** 저장 시점 설계 누락
**How to avoid:** (1) 사용자 메시지는 전송 즉시 IndexedDB에 저장, (2) 어시스턴트 메시지는 스트리밍 완료 후 한 번에 저장, (3) 중단 시에도 현재까지의 내용 저장
**Warning signs:** 페이지 새로고침 후 메시지 누락, 또는 IndexedDB 쓰기 지연

### Pitfall 5: API 키 미설정 시 채팅 시도
**What goes wrong:** API 키 없이 채팅 전송 시 API 호출 실패
**Why it happens:** 채팅 UI가 API 키 존재 여부를 확인하지 않음
**How to avoid:** 채팅 페이지 진입 시 API 키 확인, 없으면 EmptyApiKeyListener 표시. 전송 버튼 비활성화
**Warning signs:** API 키 없이 전송 시 401 에러

### Pitfall 6: highlight.js 번들 크기
**What goes wrong:** highlight.js 전체 언어를 임포트하면 번들이 1MB 이상 증가
**Why it happens:** highlight.js는 기본적으로 모든 언어를 포함
**How to avoid:** `import hljs from 'highlight.js/lib/common'` 사용 (약 45개 일반 언어만 포함). rehype-highlight 설정에서 언어 서브셋 지정
**Warning signs:** Vite 빌드 경고, 초기 로딩 지연

### Pitfall 7: 429 Rate Limit 처리 누락
**What goes wrong:** Rate limit 초과 시 일반 에러 메시지만 표시
**Why it happens:** HTTP 상태 코드별 분기 처리 누락
**How to avoid:** error.status === 429를 감지하여 "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." 한국어 안내 토스트 표시
**Warning signs:** Rate limit 시 의미 없는 에러 메시지

### Pitfall 8: 오토스크롤이 사용자 스크롤을 방해
**What goes wrong:** 사용자가 과거 메시지를 읽으려 스크롤해도 자동으로 하단으로 이동
**Why it happens:** 오토스크롤이 항상 활성화
**How to avoid:** shouldAutoScrollRef 플래그로 사용자 스크롤 감지. 하단에서 100px 이내일 때만 자동 스크롤
**Warning signs:** 사용자가 스크롤을 올려도 계속 하단으로 강제 이동

## Code Examples

### OpenRouter SSE 스트림 파싱 핵심 로직
```typescript
// Source: OpenAI 호환 SSE 표준 + fetch ReadableStream API
const reader = response.body!.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? ""; // 마지막 불완전 줄 유지

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(":")) continue;
    if (!trimmed.startsWith("data: ")) continue;

    const data = trimmed.slice(6);
    if (data === "[DONE]") return;

    try {
      const parsed = JSON.parse(data);
      const content = parsed.choices?.[0]?.delta?.content;
      if (content) {
        // 토큰 처리
      }
    } catch {
      // 불완전한 JSON 스킵
    }
  }
}
```

### react-markdown + remark-gfm + rehype-highlight 설정
```typescript
// Source: react-markdown v10 + rehype-highlight v7 공식 패턴
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // 다크 테마

function MessageContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      {content}
    </ReactMarkdown>
  );
}
```

### sonner 토스트 설정
```typescript
// src/components/ui/sonner.tsx (shadcn/ui 패턴)
import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          error: "group-[.toast]:border-destructive",
        },
      }}
    />
  );
}

export { Toaster };
```

```typescript
// __root.tsx에 Toaster 추가
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <SidebarLayout>
      <Outlet />
      <Toaster />
    </SidebarLayout>
  ),
});
```

### API 오류 처리 + 토스트
```typescript
import { toast } from "sonner";

function handleApiError(error: unknown) {
  const err = error as Error & { status?: number };

  if (err.status === 429) {
    toast.error("요청이 너무 많습니다", {
      description: "잠시 후 다시 시도해주세요.",
    });
  } else if (err.status === 401) {
    toast.error("API 키가 유효하지 않습니다", {
      description: "설정에서 API 키를 확인해주세요.",
    });
  } else {
    toast.error("오류가 발생했습니다", {
      description: err.message,
    });
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| EventSource API | fetch + ReadableStream | 브라우저 표준화 | POST + AbortController 지원, 더 유연한 스트림 제어 |
| react-markdown v8 (CJS) | react-markdown v9+ (ESM only) | 2023-2024 | ESM 필수, 번들러 설정 주의 |
| highlight.js 전체 번들 | highlight.js/lib/common | highlight.js 11.x | 번들 크기 90% 감소 |
| 커스텀 토스트 | sonner (shadcn/ui 공식) | 2024-2025 | 접근성, 애니메이션, 다크모드 자동 지원 |
| shadcn/ui 커스텀 Toaster | shadcn/ui sonner 통합 | 2024 | CLI로 쉽게 추가, 테마 통합 |

**Deprecated/outdated:**
- EventSource (SSE): POST 미지원, AbortController 미지원. fetch로 대체
- react-syntax-highlighter: 더 무거움. rehype-highlight + highlight.js가 더 가벼움
- shadcn/ui 구형 toast: sonner 기반으로 대체됨

## Open Questions

1. **스트리밍 상태 관리: Zustand vs useState**
   - What we know: 스트리밍 상태(streamingContent, isStreaming)를 여러 컴포넌트에서 공유해야 함
   - What's unclear: 상태 공유 범위가 채팅 페이지 내인지 전역인지
   - Recommendation: 채팅 페이지 내에서만 공유하므로 useState + prop drilling 또는 Context가 적합. Zustand는 필요 시 확장

2. **대화별 모델 선택 UX**
   - What we know: MODL-01에서 대화별 모델 선택 요구. Phase 1 ModelSelector는 설정 페이지용(글로벌 기본 모델)
   - What's unclear: 채팅 헤더에서 Popover, Select, 또는 Dropdown 중 어느 UI 패턴 사용
   - Recommendation: shadcn/ui Select (기존 패턴 일관성) 또는 Popover (더 많은 정보 표시 가능). Popover 권장 (모델명 + context length 표시)

3. **스트리밍 중단 시 메시지 저장 정책**
   - What we know: AbortController로 중단 시 부분 응답이 존재할 수 있음
   - What's unclear: 중단된 응답을 저장할지, 무시할지
   - Recommendation: 중단 시에도 현재까지 받은 내용을 "assistant" 메시지로 저장 (ChatGPT 동작 방식과 일치)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite, 빌드 | ✓ | 24.13.0 | -- |
| pnpm | 패키지 매니저 | ✓ | 10.28.2 | -- |
| OpenRouter API | 채팅 스트리밍 | ✓ (인터넷 필요) | -- | 로컬 개발 환경에서 항상 온라인 |

**Missing dependencies with no fallback:**
- 없음. 모든 필수 도구 사용 가능.

**Missing dependencies with fallback:**
- 없음.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | vite.config.ts (Vite 통합, 별도 vitest.config 없음) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CHAT-01 | SSE 스트리밍으로 토큰 단위 응답 수신 | unit | `pnpm test src/__tests__/sse-parser.test.ts` | Wave 0 |
| CHAT-02 | AbortController로 스트림 중단 | unit | `pnpm test src/__tests__/use-chat-stream.test.ts` | Wave 0 |
| CHAT-03 | 마크다운 렌더링 | unit | `pnpm test src/__tests__/message-item.test.ts` | Wave 0 |
| CHAT-06 | 오토스크롤 동작 | unit | `pnpm test src/__tests__/use-auto-scroll.test.ts` | Wave 0 |
| CHAT-07 | 로딩 인디케이터 | manual | -- | -- |
| CHAT-08 | Enter/Shift+Enter | unit | `pnpm test src/__tests__/message-input.test.ts` | Wave 0 |
| MODL-01 | 무료 모델 목록 조회 | unit | `pnpm test src/__tests__/use-free-models.test.ts` | Wave 0 |
| MODL-02 | API 오류 토스트 | unit | `pnpm test src/__tests__/error-handler.test.ts` | Wave 0 |
| MODL-03 | 429 Rate Limit 안내 | unit | `pnpm test src/__tests__/error-handler.test.ts` | Wave 0 |
| MODL-04 | 재시도 버튼 | manual | -- | -- |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test && pnpm build`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/sse-parser.test.ts` -- SSE 파싱 로직 테스트
- [ ] `src/__tests__/use-chat-stream.test.ts` -- 스트리밍 훅 테스트 (모킹 필요)
- [ ] `src/__tests__/use-free-models.test.ts` -- 모델 목록 훅 테스트
- [ ] `src/__tests__/error-handler.test.ts` -- API 오류 처리 테스트
- [ ] `src/__tests__/message-input.test.ts` -- Enter/Shift+Enter 테스트
- [ ] `src/__tests__/use-auto-scroll.test.ts` -- 오토스크롤 훅 테스트

## Sources

### Primary (HIGH confidence)
- npm registry (2026-03-31 조회): react-markdown 10.1.0, remark-gfm 4.0.1, rehype-highlight 7.0.2, highlight.js 11.11.1, sonner 2.0.7
- CLAUDE.md: 프로젝트 기술 스택 확정 사항
- 기존 코드베이스 분석: Phase 1 완성 코드 (db/index.ts, hooks/, components/, routes/)

### Secondary (MEDIUM confidence)
- OpenRouter API SSE 형식 (OpenAI 호환 표준, 훈련 데이터 기반)
- fetch + ReadableStream SSE 패턴 (MDN Web Docs, 훈련 데이터 기반)
- react-markdown v10 + rehype-highlight 통합 패턴 (훈련 데이터 기반, 버전 확인 완료)
- sonner + shadcn/ui 통합 패턴 (훈련 데이터 기반, shadcn/ui 공식 권장)

### Tertiary (LOW confidence)
- OpenRouter 무료 모델 목록 API 응답 형식 (훈련 데이터 기반, 실제 응답 확인 필요)
- OpenRouter 429 Rate Limit 응답 형식 (훈련 데이터 기반, 실제 확인 필요)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - 모든 버전 npm registry에서 직접 확인, CLAUDE.md 확정 스택
- Architecture: MEDIUM - 패턴은 검증되었으나 SSE 스트리밍 실제 동작은 API 호출로 검증 필요
- Pitfalls: HIGH - SSE 버퍼링, AbortController, StrictMode 등 잘 알려진 함정

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (안정적인 라이브러리, 30일 유효)

## Project Constraints (from CLAUDE.md)

### 기술 스택 (확정)
- React 19 + Vite 6 + TypeScript (strict)
- pnpm (패키지 매니저)
- Biome (lint + format, ESLint/Prettier 대체)
- shadcn/ui + Tailwind CSS v4
- Zustand (클라이언트 전역 상태)
- TanStack Query v5 (서버 상태/캐싱)
- TanStack Router (파일 기반 라우팅)
- Dexie.js v4 (IndexedDB ORM)
- react-markdown + remark-gfm + rehype-highlight

### 코딩 컨벤션
- 한국어 UI (버튼, 라벨, 안내 문구)
- 코드 식별자는 영어, 문서는 한국어
- PascalCase: 컴포넌트/클래스, camelCase: 변수/함수, kebab-case: 폴더/파일명
- 다크모드 기본 활성

### 아키텍처 제약
- DB명: `openrouter-chat-db`
- 테이블: settings(key PK), conversations(id PK uuid), messages(id PK uuid, conversationId indexed)
- OpenRouter API: Base URL `https://openrouter.ai/api/v1`, Bearer 인증
- 사이드바: 280px, 접기 가능
- 반응형 분기: 1024px 기준
- 로컬 개발 환경만, 백엔드 없음

### 금지 사항
- Redux, MobX, Apollo Client 사용 금지
- localStorage 대신 IndexedDB 사용
- Styled Components, emotion 사용 금지
- Next.js, CRA 사용 금지
- ESLint + Prettier 대신 Biome 사용

### GSD 스킬 사용
- UI 관련 작업 시 ui-ux-pro-max 스킬 함께 사용하여 UI/UX 품질 향상
- 생성 문서는 한국어로 작성
