# Phase 1: Foundation & Secure Proxy - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

이 phase는 구현 가능한 모노레포 골격, 공통 타입 경계, NestJS 보안 프록시 API, 모델 allowlist, 기본 저장소 추상화를 완성하는 단계다. Chat UI 자체를 완성하는 것이 아니라, Phase 2와 3이 안전하게 올라갈 수 있는 기반을 고정한다.

</domain>

<decisions>
## Implementation Decisions

### Workspace topology
- **D-01:** `pnpm workspace` 기반 모노레포로 시작하고, 최상위에 `apps/web`, `apps/server`, `packages/contracts`, `packages/config`를 둔다.
- **D-02:** 공통 타입은 `packages/contracts` 하나로 시작하고, 서버 DTO class는 백엔드 내부에 유지한다.
- **D-03:** `turbo`는 Phase 1에 넣지 않는다. 루트 스크립트는 `pnpm dev/build/lint/typecheck/test` 체계로 먼저 고정한다.

### Backend API boundary
- **D-04:** NestJS는 `health`, `models`, `chats`, `streaming` 모듈 경계로 시작한다.
- **D-05:** 모델 allowlist는 서버 env(`OPENROUTER_MODEL_ALLOWLIST`)에서 관리하고, web은 `/api/v1/models` 결과만 소비한다.
- **D-06:** OpenRouter 호출 책임은 `infrastructure/openrouter` 하위 client로 고립하고, controller/service는 내부 정규화된 타입만 다룬다.

### Streaming contract
- **D-07:** 채팅 스트리밍은 `POST /api/v1/chats/:chatId/messages/stream`와 `POST /api/v1/chats/:chatId/regenerate/stream`로 표준화한다.
- **D-08:** 응답 포맷은 `text/event-stream` 기반 이벤트 스트림으로 통일하고, 최소 이벤트는 `message:start`, `message:delta`, `message:done`, `error`, `heartbeat`를 포함한다.
- **D-09:** 브라우저 중단은 `AbortController`를 사용하고, 서버는 upstream OpenRouter fetch abort를 전달해야 한다.

### Persistence seam
- **D-10:** 저장소 계층은 `ChatRepository` 인터페이스를 먼저 정의하고 `memory`와 `file` adapter를 동시에 스캐폴드한다.
- **D-11:** file adapter는 로컬 개발용 기본값으로 두되, PostgreSQL adapter를 나중에 꽂을 수 있도록 repository contract를 persistence-agnostic하게 유지한다.
- **D-12:** 제목 자동 생성 로직 자체는 Phase 4로 미루지만, 제목 필드와 저장 구조는 Phase 1부터 지원 가능한 형태로 설계한다.

### Minimal frontend foundation
- **D-13:** Phase 1의 web 범위는 "실제 채팅 UI"가 아니라 `Vite + React + TanStack Router + Query` 기본 앱과 내부 API smoke path 연결까지다.
- **D-14:** `ui-ux-pro-max` 권고를 따라 shadcn `SidebarProvider`와 dark-mode token 구조를 초기에 깔아 두되, 실제 sidebar 경험 완성은 Phase 2에서 다룬다.
- **D-15:** 접근성 기반 규칙은 Phase 1부터 깨지지 않게 잡는다. 즉, focus-visible 스타일과 모바일 overflow 방지 토큰은 초기 theme layer에 포함한다.

### the agent's Discretion
- **D-16:** 정확한 패키지 버전은 현재 안정 버전 범위에서 planner/researcher가 확정한다.
- **D-17:** health endpoint payload의 세부 필드와 내부 에러 코드 naming은 planner가 구현 편의에 맞게 정한다.
- **D-18:** contracts package 내부 파일 분할 방식(`chat.ts`, `models.ts`, `stream.ts`)은 구현 시점에 가장 단순한 구조를 선택한다.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and constraints
- `.planning/PROJECT.md` — 제품 목표, 핵심 제약, 기술 스택, 보안/확장성 원칙
- `.planning/REQUIREMENTS.md` — `SET-04`, `PLAT-01`, `PLAT-02`, `PLAT-03`, `PLAT-04`의 요구사항 정의와 phase traceability
- `.planning/ROADMAP.md` — Phase 1 목표, 성공 기준, 선행 계획 단위

### Product and UX direction
- `.planning/PRD.md` — `UI UX Pro Max 초기 제안`, `정보 구조`, `UX/UI 설계 원칙`, `shadcn/ui 후보`
- `.planning/TECH-DESIGN.md` — `아키텍처 요약`, `모노레포 및 명령 체계`, `프론트엔드 구조`, `백엔드 구조`, `API 설계`, `상태관리 설계`, `스트리밍 처리 방식`, `보안 체크리스트`

### Phase execution guidance
- `.planning/PHASE-1-KICKOFF.md` — Phase 1 작업 항목과 Definition of Done
- `.planning/PHASE-PROMPTS.md` — Phase 1 planning 시 추가 컨텍스트와 UI UX Pro Max 호출 전략
- `.planning/research/STACK.md` — 권장 기술 조합과 비권장 선택
- `.planning/research/ARCHITECTURE.md` — 컴포넌트 경계, 데이터 흐름, 빌드 순서
- `.planning/research/PITFALLS.md` — 키 노출, 스트리밍, 상태 분리 관련 위험 지점
- `.planning/research/SUMMARY.md` — 초기 리서치의 핵심 결론

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 기존 구현 코드 없음 — 현재 재사용 가능한 자산은 planning 문서와 agreed architecture뿐이다.
- `.planning/TECH-DESIGN.md`의 API/폴더 구조 초안 — 초기 스캐폴드 기준점으로 재사용 가능
- `ui-ux-pro-max` 조사 결과 — shadcn `SidebarProvider`, dark mode token, focus-visible 규칙을 초기 foundation에 반영 가능

### Established Patterns
- greenfield 상태이므로 실제 코드 패턴은 아직 없다.
- 문서 기준 확정 패턴:
  - monorepo + shared contracts
  - Query는 서버 상태 전용, Zustand는 UI 상태 전용
  - NestJS module/service/repository 분리
  - OpenRouter는 server-only proxy

### Integration Points
- `apps/server`는 이후 Phase 2/3에서 web이 호출할 models/chats/streaming API의 단일 진입점이 된다.
- `packages/contracts`는 server 응답과 web 소비 타입의 접점이 된다.
- `apps/web`의 router/provider layer는 이후 sidebar/chat shell이 붙는 기반이 된다.

</code_context>

<specifics>
## Specific Ideas

- `[auto] Workspace structure` → `apps/web + apps/server + packages/contracts + packages/config`
- `[auto] Backend boundary` → NestJS `health/models/chats/streaming` 모듈로 시작
- `[auto] Streaming transport` → POST + `text/event-stream` 표준화
- `[auto] Persistence seam` → `memory`와 `file` adapter를 동시에 스캐폴드
- `[auto][ui-ux-pro-max]` → custom sidebar를 만들지 말고 shadcn `SidebarProvider`를 layout 레벨에서 준비
- `[auto][ui-ux-pro-max]` → dark mode token과 focus-visible 규칙을 Phase 1 theme layer에 포함

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 01-foundation-secure-proxy*
*Context gathered: 2026-03-29*
