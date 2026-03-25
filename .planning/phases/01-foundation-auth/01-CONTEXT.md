# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

이 phase는 프론트엔드와 백엔드의 실행 기반을 만들고, 이메일/비밀번호 인증과 서버 비밀값 경계를 확립한다. 구체적으로는 pnpm 기반 frontend/backend 구조, NestJS 인증 모듈과 사용자 저장 구조, React 인증 화면과 세션 복원 흐름까지를 포함한다. 비밀번호 재설정, 소셜 로그인, 채팅 기능 자체는 이 phase 범위에 포함되지 않는다.

</domain>

<decisions>
## Implementation Decisions

### Authentication Strategy
- **D-01:** 인증 방식은 이메일/비밀번호 기반 회원가입, 로그인, 로그아웃만 포함한다.
- **D-02:** 인증 상태 유지는 JWT 기반으로 설계한다.
- **D-03:** 비밀번호 재설정, 소셜 로그인, OAuth는 Phase 1 범위에서 제외한다.

### Session Behavior
- **D-04:** 세션이 만료되면 사용자를 즉시 로그인 화면으로 보낸다.
- **D-05:** 새로고침 후에도 JWT 기반 인증 상태 복원이 가능해야 한다.

### Workspace Structure
- **D-06:** 프로젝트 구조는 frontend와 backend를 분리한 2-app 구조로 시작한다.
- **D-07:** planner와 executor는 Phase 1에서 `backend` 와 `frontend` 라는 최상위 앱 경계를 우선 유지하는 방향으로 구조를 설계한다.

### the agent's Discretion (the agent 재량)
- JWT 저장 매체와 refresh token 도입 여부는 보안/구현 균형을 기준으로 planner가 세부 설계를 제안할 수 있다.
- UI 세부 레이아웃, 필드 문구, validation 메시지의 톤은 표준적이고 명확한 방향으로 the agent가 정할 수 있다.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope
- `.planning/PROJECT.md` — 프로젝트 핵심 가치, Phase 1 비기능 제약, 인증/보안 전제
- `.planning/REQUIREMENTS.md` — AUTH-01, AUTH-02, AUTH-03, CHAT-04의 정확한 요구사항 정의
- `.planning/ROADMAP.md` — Phase 1 목표, 성공 기준, plan 초안

### Current State
- `.planning/STATE.md` — 현재 phase 위치와 최신 블로커 메모

### Source Prompt
- `PROMPT.md` — 최초 사용자 요청과 기술 스택 요구사항

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 현재 재사용 가능한 앱 코드 없음: greenfield 상태이므로 Phase 1에서 기준 구조 자체를 만든다

### Established Patterns
- 문서 기준 패턴은 NestJS backend + React frontend 분리 구조다
- 서버 `.env` 에 OpenRouter 키/모델을 고정한다는 운영 패턴이 이미 결정돼 있다
- 인증은 이메일/비밀번호, 저장소는 SQLite라는 제품 전제가 고정돼 있다

### Integration Points
- `backend`: 인증 모듈, 사용자 저장 구조, 환경 변수 로딩, 향후 OpenRouter 프록시 진입점
- `frontend`: 로그인/가입/로그아웃 화면, 인증 상태 복원, 향후 보호 라우트와 채팅 UI 진입점
- 공통: API 계약과 인증 실패 처리 방식은 이후 모든 phase의 기반이 된다

</code_context>

<specifics>
## Specific Ideas

- 사용자는 JWT 방식을 명시적으로 원한다
- 인증 UX 범위는 회원가입/로그인/로그아웃까지만 허용한다
- 세션 만료 시 안내보다 즉시 로그인 화면으로 이동하는 단순한 흐름을 선호한다
- 프로젝트 구조에 대해 사용자는 `backend + frontend` 분리를 명시적으로 원한다

</specifics>

<deferred>
## Deferred Ideas

- 비밀번호 재설정 — future phase 후보
- 소셜 로그인 / OAuth — future phase 후보
- 채팅 스트리밍 구현 — Phase 3 범위
- 대화 목록 및 히스토리 저장 — Phase 2 및 Phase 4 범위

</deferred>

---

*Phase: 01-foundation-auth*
*Context gathered: 2026-03-26*
