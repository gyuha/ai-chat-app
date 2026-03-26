# Phase 2: Conversation Persistence - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

이 phase는 인증된 사용자가 새 대화를 만들고, 자신의 대화 목록만 조회할 수 있도록 conversation 저장 구조와 목록 진입 UX를 만드는 범위다. 사용자별 권한 경계와 SQLite 기반 저장 모델을 포함하지만, 실제 메시지 스트리밍 전송과 assistant 응답 저장은 Phase 3, 특정 대화의 과거 메시지 복원은 Phase 4 범위다.

</domain>

<decisions>
## Implementation Decisions

### Conversation Creation Flow
- **D-01:** 로그인 사용자가 `/`에 진입했을 때 대화가 하나도 없으면 첫 대화를 자동 생성한다.
- **D-02:** 사용자가 빈 상태에서 별도 버튼을 눌러야만 대화가 만들어지는 흐름은 사용하지 않는다.

### Conversation List Density
- **D-03:** Phase 2의 대화 목록은 최소형으로 유지하고, 각 항목에는 제목만 노출한다.
- **D-04:** 생성 시각, 수정 시각, 최근 메시지 미리보기는 이 phase 범위에서 제외한다.

### Default Naming
- **D-05:** 새로 생성된 대화의 기본 제목은 고정 문자열 `새 대화`를 사용한다.
- **D-06:** 시각 기반 제목 생성이나 첫 메시지 기반 제목 갱신은 후속 phase에서 다시 판단한다.

### Initial Screen Behavior
- **D-07:** 첫 대화가 자동 생성되면 해당 대화를 즉시 선택된 상태로 보여준다.
- **D-08:** 초기 화면에는 별도 웰컴 카피나 사용 팁 없이 바로 대화 진입 상태를 보여준다.

### the agent's Discretion
- conversation/message 테이블의 세부 컬럼 구성, 인덱스, 정렬 기준은 Prisma와 이후 phase 요구를 고려해 the agent가 설계할 수 있다.
- 목록 레이아웃의 구체적 spacing, active state 스타일, loading skeleton은 기존 auth/app shell 패턴과 어울리도록 the agent가 정할 수 있다.
- 자동 생성 트리거를 loader 단계에서 처리할지, 초기 API 호출 이후 mutation으로 처리할지는 기존 라우터와 query 패턴에 맞춰 the agent가 정할 수 있다.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope
- `.planning/PROJECT.md` — 제품 핵심 가치, SQLite/인증/보안 전제, v1 범위 제약
- `.planning/REQUIREMENTS.md` — CONV-01, CONV-02, CONV-04와 phase 경계상 관련된 CONV-03 정의
- `.planning/ROADMAP.md` — Phase 2 목표, 성공 기준, 02-01/02-02 plan 초안

### Prior Decisions
- `.planning/STATE.md` — 누적 결정과 현재 milestone 상태, SQLite 및 auth/session 전제
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — 쿠키 기반 세션, frontend/backend 분리, 보호 라우트 진입 구조

### Current Implementation
- `backend/prisma/schema.prisma` — 현재 User만 있는 SQLite Prisma 스키마 시작점
- `frontend/src/routes/index.tsx` — 현재 인증 후 홈 진입점과 보호 라우트 처리
- `frontend/src/routes/__root.tsx` — 앱 루트 레이아웃과 세션 bootstrap 흐름
- `frontend/src/features/auth/api.ts` — credentialed API 호출 패턴
- `frontend/src/lib/api/client.ts` — 공통 fetch 래퍼와 에러 처리 규약

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/lib/api/client.ts`: `credentials: 'include'` 기반 공통 API 래퍼가 이미 있어 conversation API도 같은 방식으로 연결할 수 있다.
- `frontend/src/features/auth/session.ts`: 세션 확인과 인증 사용자 확보 흐름이 이미 루트에서 동작하므로 conversation 진입은 인증된 사용자 전제를 그대로 활용할 수 있다.
- `frontend/src/routes/index.tsx`: 현재 보호된 홈 화면이 있어 Phase 2에서 conversation 목록/선택 UI로 자연스럽게 대체하거나 확장할 수 있다.

### Established Patterns
- 인증 상태는 frontend에서 세션 bootstrap 후 보호 라우트로 제어한다.
- 백엔드는 NestJS + Prisma + SQLite 조합을 사용하고, 사용자 식별은 쿠키 기반 JWT 세션에서 얻는다.
- 프론트 API 호출은 feature 단위 함수로 감싸고 공통 fetch 클라이언트를 재사용한다.

### Integration Points
- `backend/prisma/schema.prisma`와 향후 Prisma service 계층에 conversation/message 모델을 추가해야 한다.
- backend auth session의 사용자 ID를 기준으로 conversation 생성/목록 조회 권한을 제한해야 한다.
- `frontend/src/routes/index.tsx`는 자동 생성된 첫 대화와 목록 UI를 보여주는 첫 통합 지점이 된다.
- 이후 Phase 3 스트리밍 채팅과 Phase 4 히스토리 복원은 이번 phase의 conversation 식별자와 저장 구조를 전제로 연결된다.

</code_context>

<specifics>
## Specific Ideas

- 대화가 전혀 없는 최초 진입에서도 별도 클릭 없이 바로 첫 대화가 생성되어야 한다.
- 목록은 최대한 단순하게 시작하고 제목만 보여주는 형태를 선호한다.
- 초기 생성 대화 제목은 `새 대화`로 고정한다.
- 첫 화면은 설명성 카피보다 바로 사용 가능한 상태를 우선한다.

</specifics>

<deferred>
## Deferred Ideas

- 최근 메시지 미리보기, 수정 시각, richer metadata 노출 — later UX phase candidate
- 첫 메시지 기반 자동 제목 생성 — 후속 phase 후보
- 특정 대화의 메시지 히스토리 복원 UI — Phase 4 범위
- assistant 응답 저장과 스트리밍 채팅 결합 — Phase 3 범위

</deferred>

---

*Phase: 02-conversation-persistence*
*Context gathered: 2026-03-26*
