# Architecture Research (아키텍처 리서치)

**Domain:** Multi-user OpenRouter-based web chat application
**Researched:** 2026-03-25
**Confidence:** HIGH

## Standard Architecture (표준 아키텍처)

### System Overview (시스템 개요)

```text
┌─────────────────────────────────────────────────────────────┐
│                     React Client App                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Auth Pages   │  │ Chat Layout  │  │ Conversation UI  │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │
│         │                 │                   │             │
├─────────┴─────────────────┴───────────────────┴─────────────┤
│                API + Streaming Boundary                      │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │ NestJS API (Auth, Conversations, Chat Proxy)         │  │
│  └───────────────┬───────────────────┬───────────────────┘  │
├──────────────────┴───────────────────┴──────────────────────┤
│                      Persistence Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ SQLite DB    │  │ Session Data │  │ Env Config       │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities (컴포넌트 책임)

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| React app | 로그인, 라우팅, 채팅 UI, 스트리밍 표시 | Vite + TanStack Router + TanStack Query + Zustand |
| Auth module | 가입, 로그인, 세션 검증 | NestJS Auth module + password hashing + cookie/session or token |
| Chat proxy module | OpenRouter 호출, 스트리밍 중계 | NestJS controller/service using server-side env config |
| Conversation module | 대화/메시지 CRUD 및 사용자 소유권 검증 | NestJS service + ORM + SQLite |

## Recommended Project Structure (권장 프로젝트 구조)

```text
apps/
├── server/             # NestJS backend
│   ├── src/
│   │   ├── auth/       # authentication module
│   │   ├── chat/       # OpenRouter proxy and streaming
│   │   ├── conversations/ # conversation/message persistence
│   │   ├── common/     # guards, filters, config
│   │   └── db/         # ORM and schema bootstrap
├── web/                # React frontend
│   ├── src/
│   │   ├── routes/     # TanStack Router routes
│   │   ├── features/   # auth/chat feature slices
│   │   ├── components/ # shared UI
│   │   ├── stores/     # zustand ephemeral state
│   │   └── lib/        # api client, query client, utils
└── packages/           # shared config or types if needed
```

### Structure Rationale (구조 근거)

- **apps/server:** 인증, 외부 API, DB 접근을 Nest 모듈 단위로 분리하기 쉽다
- **apps/web:** 페이지 라우팅과 feature UI를 분리해 채팅/인증 흐름을 명확히 유지한다
- **packages/:** 공용 타입이나 설정이 커질 때 확장 여지를 남긴다

## Architectural Patterns (아키텍처 패턴)

### Pattern 1: Backend-for-Frontend Proxy

**What:** 브라우저가 외부 AI API를 직접 호출하지 않고 NestJS가 대신 호출한다  
**When to use:** API 키를 숨기고 모델 정책을 중앙 통제해야 할 때  
**Trade-offs:** 보안과 통제는 좋아지지만 서버 구현이 추가된다

**Example:**
```typescript
// Controller -> Service -> OpenRouter API
```

### Pattern 2: Persisted Conversation Aggregate

**What:** 대화와 메시지를 사용자 소유 단위 aggregate로 저장한다  
**When to use:** 목록/상세/히스토리를 함께 복원해야 할 때  
**Trade-offs:** 단순 로그 저장보다 구조화가 필요하지만 조회와 권한 검증이 쉬워진다

**Example:**
```typescript
// conversation(id, userId) -> messages(conversationId, role, content)
```

### Pattern 3: Server State + UI State Split

**What:** React Query로 서버 상태를, Zustand로 임시 입력/선택 상태를 관리한다  
**When to use:** 대화 데이터는 서버에서 오고, 입력/스트리밍 표시 같은 UI 상태도 필요한 경우  
**Trade-offs:** 상태 경계 설계가 필요하지만 캐시와 UI 반응성을 둘 다 확보한다

## Data Flow (데이터 흐름)

### Request Flow (요청 흐름)

```text
[User submits message]
    ↓
[Chat input component] → [API client] → [NestJS controller] → [Chat service]
    ↓                                                        ↓
[Streaming UI update] ← [stream parser] ← [OpenRouter response] ← [OpenRouter API]
```

### State Management (상태 관리)

```text
[SQLite persisted data]
    ↓
[NestJS API]
    ↓
[TanStack Query cache] ←→ [Mutations / refetch]
    ↓
[React components] ←→ [Zustand UI state]
```

### Key Data Flows (핵심 데이터 흐름)

1. **Authentication flow:** 회원가입/로그인 후 보호 라우트 진입과 세션 확인
2. **Conversation load flow:** 대화 목록 조회 후 특정 대화 메시지 복원
3. **Streaming chat flow:** 사용자 메시지 저장, OpenRouter 스트리밍 중계, 완료 후 최종 메시지 저장

## Scaling Considerations (확장 고려사항)

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | NestJS 단일 인스턴스 + SQLite로 충분 |
| 1k-100k users | PostgreSQL 전환, 세션 저장소 분리, 비동기 로그 처리 고려 |
| 100k+ users | 읽기/쓰기 분리, 큐 기반 작업, OpenRouter rate limiting 계층 강화 |

### Scaling Priorities (확장 우선순위)

1. **First bottleneck:** 스트리밍 요청 수와 SQLite write contention
2. **Second bottleneck:** 인증/히스토리 조회 부하와 세션 저장 전략

## Anti-Patterns (안티패턴)

### Anti-Pattern 1: Frontend-Direct AI Calls

**What people do:** 브라우저에서 OpenRouter를 직접 호출한다  
**Why it's wrong:** API 키 노출과 abuse 제어 불가 문제가 생긴다  
**Do this instead:** NestJS 서버에서 키와 모델 정책을 관리한다

### Anti-Pattern 2: One Giant Chat Module

**What people do:** 인증, 대화 저장, OpenRouter 호출을 한 서비스에 몰아넣는다  
**Why it's wrong:** 테스트와 변경 범위가 커지고 보안 경계가 흐려진다  
**Do this instead:** auth, chat, conversations 모듈로 경계를 나눈다

## Integration Points (통합 지점)

### External Services (외부 서비스)

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| OpenRouter | Server-side HTTP client + streamed response relay | 모델 ID와 API 키를 env에서 주입 |

### Internal Boundaries (내부 경계)

| Boundary | Communication | Notes |
|----------|---------------|-------|
| web ↔ server | HTTP + streaming response | 인증 정보와 에러 형식 일관화 필요 |
| auth ↔ conversations | authenticated user context | 모든 대화 조회는 userId 기준으로 필터링 |
| conversations ↔ chat | persisted conversation references | 스트리밍 완료 후 assistant 메시지 저장 규칙 필요 |

## Sources (출처)

- https://openrouter.ai/docs/quickstart
- https://openrouter.ai/docs/api-reference/overview
- https://docs.nestjs.com/
- https://tanstack.com/query/latest
- https://tanstack.com/router/latest

---
*Architecture research for: Multi-user OpenRouter-based web chat application*
*Researched: 2026-03-25*
