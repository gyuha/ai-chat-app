# Phase 1: App Foundation & Shell - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

React/Vite 앱의 초기 골격, 공통 shell, 다크모드 기본값, 한국어 UI 기본 상태, 그리고 첫 진입/빈 상태를 준비한다. 이 phase는 제품의 기본 화면 패턴을 정하는 단계이며, 실제 OpenRouter key 검증·모델 조회·스트리밍 채팅 로직은 다음 phase에서 다룬다.

</domain>

<decisions>
## Implementation Decisions

### Shell Structure
- **D-01:** 데스크톱 기준 ChatGPT에 가까운 2-pane shell을 기본으로 사용한다.
- **D-02:** 좌측 sidebar는 약 280px 수준의 안정적인 탐색 영역으로 두고, 우측은 넓은 메인 pane으로 유지한다.

### First-Run States
- **D-03:** API key가 없거나 아직 대화가 없더라도 shell 자체는 유지한다.
- **D-04:** 첫 진입 안내는 별도 onboarding route나 모달이 아니라 메인 패널 내부의 welcome/guide 카드 형태로 제공한다.

### Visual Tone
- **D-05:** 전체 톤은 중립적인 dark-first 기반으로 유지한다.
- **D-06:** 브랜드 표현은 강한 시각 실험보다 restrained cyan accent로만 얹는다.

### Navigation
- **D-07:** 설정 진입점은 sidebar 하단과 header 우측에 모두 둔다.

### the agent's Discretion
- 정확한 spacing scale, header height, typography token 세부값
- empty state 일러스트 사용 여부와 수준
- icon set 선택과 interaction micro-feedback

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Definition
- `.planning/PROJECT.md` — 제품의 core value, frontend-only 제약, 한국어 UI/문서 규칙, 고정된 주요 결정
- `PROMPT.md` — 원래 제품 브리프, 기술 스택, UI/UX 방향, GSD 및 `ui-ux-pro-max` 한국어 규칙

### Phase and Requirements
- `.planning/ROADMAP.md` §Phase 1: App Foundation & Shell — phase goal, success criteria, 후속 phase와의 관계
- `.planning/REQUIREMENTS.md` — Phase 1 관련 요구사항(`UX-01`, `UX-02`, `UX-05`, `DATA-01`)과 전체 traceability

### Operating Guidance
- `.planning/STATE.md` — 현재 진행 위치와 blocker/concern
- `AGENTS.md` — repo-level 작업 규칙, GSD workflow entry points, UI 관련 스킬 사용 지침

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 아직 실제 앱 source code는 없다 — 이 phase가 이후 UI 패턴의 최초 기준이 된다.
- `.planning/research/ARCHITECTURE.md` — shell, route, feature 경계의 초안 역할을 한다.
- `.planning/research/SUMMARY.md` — phase 순서와 foundation 우선 전략의 근거를 제공한다.

### Established Patterns
- 프론트엔드 전용 구조를 유지한다.
- ChatGPT 유사 2-pane layout은 프로젝트 전역 기본 패턴이다.
- 한국어 UI와 dark-first 기본값은 이미 project-level로 고정되어 있다.

### Integration Points
- Phase 1 shell은 이후 Phase 2의 settings flow와 Phase 3의 conversation/sidebar 구조를 수용해야 한다.
- theme와 settings persistence 기초는 이후 settings page에서 확장 가능해야 한다.
- first-run empty state는 이후 API key validation flow가 자연스럽게 들어갈 수 있는 구조여야 한다.

</code_context>

<specifics>
## Specific Ideas

- shell은 “거의 ChatGPT처럼 익숙하지만, 완전 복제는 아니고 cyan 포인트로만 제품 정체성을 드러내는 방향”
- 첫 화면은 앱 구조를 숨기지 않고, 메인 패널 안에서 사용자를 안내하는 방향
- 설정은 “찾으려면 항상 보이는 곳(sidebar bottom)”과 “빠르게 눌러볼 수 있는 곳(header right)”을 둘 다 제공

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-app-foundation-shell*
*Context gathered: 2026-03-31*
