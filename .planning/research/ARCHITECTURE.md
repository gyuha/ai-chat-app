# Architecture Research

**Domain:** 브라우저 전용 OpenRouter chat app
**Researched:** 2026-03-31
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Sidebar   Header   MessageList   Composer   Settings      │
├─────────────────────────────────────────────────────────────┤
│                   App Orchestration Layer                  │
├─────────────────────────────────────────────────────────────┤
│  Router  Query Client  Chat Controller  Theme Controller   │
├─────────────────────────────────────────────────────────────┤
│                    Domain / State Layer                    │
├─────────────────────────────────────────────────────────────┤
│  Settings Store   Conversation Store   Stream State        │
├─────────────────────────────────────────────────────────────┤
│                  Data / Integration Layer                  │
├─────────────────────────────────────────────────────────────┤
│  OpenRouter API Client   Dexie DB   Markdown Rendering     │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| App Shell | sidebar + chat pane + responsive layout | route layout + shared shell component |
| OpenRouter Client | models 조회, chat completion 호출, stream 파싱 | typed fetch wrapper + SSE parser |
| Persistence Layer | settings/conversations/messages 저장 | Dexie tables + repository helpers |
| UI State Layer | sidebar open 상태, 현재 conversation, composing 상태 | Zustand store |
| Server State Layer | 모델 목록/검증 결과 캐시 | TanStack Query hooks |
| Renderer Layer | assistant Markdown/코드블록 표시 | react-markdown + plugins |

## Recommended Project Structure

```text
src/
├── routes/                # TanStack Router route definitions
│   ├── __root.tsx         # 공통 레이아웃
│   ├── index.tsx          # 빈 상태 / 새 대화 시작점
│   ├── chat/              # conversation route
│   └── settings/          # 설정 화면
├── features/              # 도메인별 UI/로직 묶음
│   ├── chat/              # composer, stream, message list
│   ├── sidebar/           # conversation list, new chat
│   ├── models/            # model selector, free filter
│   └── settings/          # API key, theme, defaults
├── services/              # OpenRouter, Dexie, parsing helpers
├── store/                 # Zustand stores
├── db/                    # Dexie schema and persistence helpers
├── components/            # 재사용 공통 UI
├── lib/                   # utility helpers, constants
└── styles/                # global styles / theme glue
```

### Structure Rationale

- **routes/**: URL 기반 진입점과 화면 책임을 분명히 분리하기 위해
- **features/**: 채팅/사이드바/설정 같은 기능 단위 응집도를 높이기 위해
- **services/**: OpenRouter 호출, stream 파싱, Dexie 접근을 UI에서 분리하기 위해
- **store/**: 전역 UI 상태와 도메인 상태를 한곳에서 관리하기 위해
- **db/**: IndexedDB schema/versioning 변경을 독립적으로 다루기 위해

## Architectural Patterns

### Pattern 1: Thin Route, Fat Feature

**What:** route 파일은 화면 진입과 조립만 담당하고, 실제 로직은 feature 모듈에 둔다.
**When to use:** chat route, settings route, sidebar shell 구성 시
**Trade-offs:** 구조가 약간 늘어나지만 재사용성과 테스트성이 좋아진다.

**Example:**
```typescript
export function ChatRoute() {
  return <ChatScreen conversationId={params.conversationId} />;
}
```

### Pattern 2: Query for remote, Zustand for local

**What:** OpenRouter 모델 목록과 key 검증은 TanStack Query, sidebar/stream UI 상태는 Zustand로 분리한다.
**When to use:** 데이터 출처와 생명주기가 명확히 다른 경우
**Trade-offs:** 두 도구를 함께 써야 하지만 역할 분리가 분명해진다.

**Example:**
```typescript
const { data: models } = useQuery(modelsQueryOptions);
const { activeConversationId, setActiveConversationId } = useChatStore();
```

### Pattern 3: Stream-first message lifecycle

**What:** assistant 메시지를 빈 placeholder로 만들고 스트리밍 chunk를 누적 갱신한다.
**When to use:** SSE 기반 chat completion 응답 처리 시
**Trade-offs:** 구현 난이도는 올라가지만 UX가 훨씬 자연스럽다.

## Data Flow

### Request Flow

```text
사용자 입력
    ↓
Composer → submit handler → OpenRouter client → text/event-stream
    ↓
placeholder assistant message 생성 → chunk append → 완료 시 Dexie 저장
```

### State Management

```text
Zustand store
    ↓
Sidebar / Chat UI / Composer
    ↔ actions
stream status, active conversation, drawer state 업데이트
```

### Key Data Flows

1. **API key flow:** 입력 → 검증 요청 → settings 저장 → 이후 모든 API 요청에 주입
2. **Model flow:** `/models` 조회 → free filter → 기본 모델/대화별 모델 선택 → chat request 반영
3. **Conversation flow:** 새 대화 생성 → 메시지 append → updatedAt 갱신 → sidebar 정렬 반영

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 개인/소규모 사용 | 현재 구조로 충분, IndexedDB + local state 중심 |
| 대화 수 증가 | Dexie index 최적화, query pagination/virtualized list 고려 |
| 긴 대화/긴 응답 | message virtualization, markdown render 최적화 우선 |

### Scaling Priorities

1. **First bottleneck:** 긴 conversation 렌더링 — virtualization 또는 chunked rendering으로 대응
2. **Second bottleneck:** IndexedDB 조회량 증가 — 인덱스와 최신순 쿼리 최적화로 대응

## Anti-Patterns

### Anti-Pattern 1: fetch 로직을 component마다 분산

**What people do:** 각 화면/컴포넌트에서 직접 OpenRouter fetch를 호출한다.
**Why it's wrong:** 헤더, 에러 처리, stream 파싱, rate limit 대응이 중복된다.
**Do this instead:** 공통 OpenRouter service/client 레이어를 둔다.

### Anti-Pattern 2: localStorage에 전체 메시지를 저장

**What people do:** 구현이 쉬워 보여서 localStorage에 모든 대화를 몰아넣는다.
**Why it's wrong:** 정렬/검색/크기 제한/부분 갱신이 빠르게 문제 된다.
**Do this instead:** Dexie schema로 분리 저장한다.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| OpenRouter Models API | query hook + free filtering | API key 검증과 모델 선택에 재사용 |
| OpenRouter Chat API | service + SSE stream parser | AbortController 취소와 에러 분기 필수 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| routes ↔ features | props / route params | route는 thin 유지 |
| features ↔ services | typed function calls | API와 persistence 세부 구현 숨김 |
| services ↔ db | repository/direct table helpers | schema 변경 영향 최소화 |
| query ↔ store | explicit synchronization only | remote cache와 local UI state를 혼합하지 않기 |

## Sources

- `PROMPT.md` — 고정 요구사항과 UI 구조
- https://openrouter.ai/docs/api/reference/streaming — stream lifecycle와 cancellation 참고
- https://openrouter.ai/docs/api/api-reference/models/get-models.mdx — 모델 조회 경로 확인
- https://github.com/josephgodwinkimani/openrouter-web — 브라우저 기반 구현 참고

---
*Architecture research for: frontend-only OpenRouter chat app*
*Researched: 2026-03-31*
