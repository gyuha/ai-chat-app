# Phase 3: OpenRouter Streaming Chat - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

이 phase는 서버에 고정된 OpenRouter 무료 모델로 채팅 요청을 프록시하고, assistant 응답을 스트리밍 형태로 보여주며, 스트리밍 완료 후 해당 응답을 대화 히스토리에 저장하는 범위다. 모델 선택 UI, 멀티모달, 대화 히스토리 복원 UX 확장은 이 phase 범위가 아니다.

</domain>

<decisions>
## Implementation Decisions

### Composer Submission Behavior
- **D-01:** 메시지 입력창은 `Enter` 로 전송하고 `Shift+Enter` 로 줄바꿈한다.
- **D-02:** 전송 버튼은 보조 수단으로 유지할 수 있지만, 기본 상호작용은 키보드 전송 기준으로 설계한다.

### Input State During Streaming
- **D-03:** assistant 응답이 스트리밍 중이어도 입력창은 계속 활성 상태로 둔다.
- **D-04:** 스트리밍 중에는 추가 전송만 막고, 사용자가 다음 메시지를 미리 입력하는 것은 허용한다.

### the agent's Discretion
- 스트리밍 중 assistant 말풍선의 시각 표현, 커서/로더 스타일, 전송 버튼의 disabled 표현은 기존 최소형 UI 패턴에 맞춰 the agent가 정할 수 있다.
- OpenRouter 스트리밍을 어떤 전송 프로토콜로 브라우저에 중계할지(SSE, chunked fetch 등)는 현재 NestJS/React 구조에 가장 자연스러운 방식으로 the agent가 정할 수 있다.
- user 메시지와 assistant 메시지의 저장 타이밍 세부 구현은 Phase 목표(CHAT-01/02/03)를 만족하는 선에서 the agent가 설계할 수 있다.
- 스트리밍 오류 시 카피 문구와 미세한 복구 UI는 표준적이고 명확한 방향으로 the agent가 정할 수 있다.

</decisions>

<specifics>
## Specific Ideas

- 채팅 입력은 일반적인 AI/chat 제품처럼 빠르게 왕복하는 흐름을 선호한다.
- 사용자는 답변을 기다리는 동안에도 다음 메시지를 미리 써둘 수 있어야 한다.
- v1에서는 고급 composer 기능보다 안정적인 스트리밍과 저장 연계가 우선이다.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope
- `.planning/PROJECT.md` — 제품 핵심 가치, OpenRouter 서버 고정 정책, MVP 범위 제약
- `.planning/REQUIREMENTS.md` — CHAT-01, CHAT-02, CHAT-03 정의와 Phase 간 요구사항 경계
- `.planning/ROADMAP.md` — Phase 3 목표, 성공 기준, 03-01/03-02 계획 경계

### Prior Decisions
- `.planning/STATE.md` — 현재 milestone 진행 상태와 누적 결정
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — 세션 만료 처리, frontend/backend 분리, JWT 세션 전제
- `.planning/phases/02-conversation-persistence/02-CONTEXT.md` — 최소형 conversation shell, `새 대화`, auto-bootstrap, title-only list 결정

### Current Implementation
- `backend/src/auth/guards/jwt-auth.guard.ts` — 인증된 채팅 요청 보호 방식
- `backend/src/auth/decorators/current-user.decorator.ts` — 현재 사용자 식별 추출 방식
- `backend/src/conversations/conversations.service.ts` — conversation ownership, 생성/조회 패턴
- `frontend/src/routes/index.tsx` — 현재 보호된 conversation shell과 selected conversation 상태
- `frontend/src/features/conversations/api.ts` — conversation API 호출 패턴
- `frontend/src/lib/api/client.ts` — credentialed fetch wrapper와 에러 처리 규약

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/routes/index.tsx`: 이미 보호된 conversation shell과 selected conversation state가 있어 chat panel을 같은 진입점에 확장할 수 있다.
- `frontend/src/lib/api/client.ts`: credentialed fetch wrapper가 있어 chat 요청도 같은 인증 경계로 연결할 수 있다.
- `backend/src/conversations/conversations.service.ts`: conversation ownership 스코프가 이미 구현돼 있어 chat 저장도 같은 경계를 재사용할 수 있다.

### Established Patterns
- 인증된 frontend 진입은 TanStack Router `beforeLoad` 와 shared session bootstrap으로 보호한다.
- 서버 상태는 React Query 중심으로 가져오고, 새로 생긴 데이터는 query cache를 갱신하는 패턴을 사용한다.
- backend는 NestJS module/controller/service + Prisma 조합으로 도메인 경계를 나눈다.

### Integration Points
- backend는 기존 conversation/message persistence 위에 OpenRouter 프록시와 assistant 저장 흐름을 얹어야 한다.
- frontend는 현재 title-only list 옆 또는 아래에 메시지 패널과 composer를 붙이는 방식으로 자연스럽게 확장될 가능성이 높다.
- 스트리밍 완료 후 저장된 assistant 메시지는 Phase 4의 히스토리 복원 UX와 직접 이어진다.

</code_context>

<deferred>
## Deferred Ideas

- 모델 선택 UI — 서버 고정 무료 모델 정책 때문에 이번 phase 범위 밖
- 대화 히스토리 복원 UX 정교화 — Phase 4 범위
- 파일 첨부, 멀티모달 입력, 프롬프트 프리셋 — v1 범위 밖

</deferred>

---

*Phase: 03-openrouter-streaming-chat*
*Context gathered: 2026-03-26*
