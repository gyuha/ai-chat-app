# Phase 1: Foundation - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

API 키 관리, 대화방 CRUD, 기본 레이아웃 완성. Phase 1에서 프로젝트 기반 구축, Phase 2에서 핵심 채팅 기능 구현.

</domain>

<decisions>
## Implementation Decisions

### Layout & Visual Design
- **D-01:** ChatGPT一模一样 레이아웃 — 사이드바 260px, 메인 영역 flex-1, 중앙 정렬 채팅 컨테이너 (max-width 768px)
- **D-02:** 색상 scheme — Light만 지원 (Dark 없음)

### API Key Input
- **D-03:** API 키 입력 UI — Modal overlay 방식 (중앙 팝업, 입력 완료 전 메인 UI 비활성화)
- **D-04:** API 키 유효하지 않을 때 — Modal 내 에러 메시지 표시

### Sidebar
- **D-05:** 사이드바 대화 목록 — 제목만 표시 (클릭으로 선택)
- **D-06:** 새 대화 버튼 — 사이드바 상단 고정
- **D-07:** 대화 삭제 — 대화 우측에 삭제 아이콘 (hover 시 표시)

### Claude's Discretion
- 구체적인 색상 값 (Tailwind 클래스)
- Typography 세밀한 설정
- 모달 애니메이션 효과
- 입력 폼 스타일 세밀한 설정

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md` — Phase 1 scope and success criteria
- `.planning/REQUIREMENTS.md` — Full requirement list (API-01~04, CHAT-01~05, MODEL-01~02)
- `.planning/PROJECT.md` — Core value and constraints

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 없음 (Greenfield 프로젝트 — 처음부터 구축)

### Established Patterns
- 없음 (신규 프로젝트)

### Integration Points
- 모든 컴포넌트는 ChatProvider (Context + Reducer)로 연결
- 레이아웃 구조: App > Sidebar + ChatArea

</code_context>

<specifics>
## Specific Ideas

- "ChatGPT一模一样" — ChatGPT 웹 앱과 동일한 레이아웃 구조
- "Light만" — 밝은 테마만 지원, Dark 모드 없음
- "Modal overlay" — API 키 입력을 모달로 처리

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-02*
