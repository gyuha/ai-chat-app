# Phase 1: Foundation - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

API 키 관리, 모델 선택, 핵심 채팅 기능 (스트리밍 포함)을 완성하여 사용자가 AI와 Markdown 스트리밍 채팅을可以进行할 수 있게 한다. IndexedDB 저장, 레이아웃, 대화 관리는 이후 페이즈에서 진행한다.

</domain>

<decisions>
## Implementation Decisions

### API Key Storage (이미 PROJECT.md에 정의됨)
- IndexedDB의 settings 테이블에 저장 (Dexie.js 사용)
- 키 유효성 검증: GET /api/v1/models 호출로 확인

### API Key Input Flow
- **D-01:** 최초 진입 시 API 키가 없으면 전체 화면 가이드 + 입력 표시 (전체 화면 모달 아님, 메인 영역 활용)
- **D-02:** 설정 페이지(/settings)에서 변경/삭제 가능

### Model Selection
- **D-03:** 드롭다운 방식으로 모델 선택 (UI-02와 일관성 유지)
- **D-04:** 무료 모델 필터링: pricing.prompt === "0" && pricing.completion === "0"
- **D-05:** TanStack Query로 모델 목록 캐싱 (staleTime: 10분)

### Streaming Chat UX
- **D-06:** 토큰 단위 실시간 렌더링 (실시간성 향상)
- **D-07:** Markdown 렌더링은 스트리밍 완료 후 또는 코드블록 시작 시점에만 적용 (성능 최적화)
- **D-08:** Stop 버튼으로 AbortController 사용, 스트리밍 중단

### Error Handling
- **D-09:** API 에러 시 토스트 알림 (shadcn/ui toast 사용)
- **D-10:** Rate limit 초과 시 사용자에게 안내 메시지 표시

### System Prompt
- **D-11:** 글로벌 시스템 프롬프트는 settings에 저장 (대화별은 Phase 3에서)

### Claude's Discretion
- Exact Markdown rendering approach during streaming (debounce策略)
- Exact loading indicator design
- Exact API error message formatting

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `.planning/PROJECT.md` — 프로젝트 개요, Core Value, Constraints
- `.planning/REQUIREMENTS.md` — Phase 1 관련 requirements (AUTH-01~03, MODL-01~04, CHAT-01~06)
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria
- `.planning/research/STACK.md` — 기술 스택, 버전 정보
- `.planning/research/PITFALLS.md` — Streaming 및 IndexedDB pitfalls

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 없음 (새 프로젝트, Phase 1이 최초 코드 작성)

### Established Patterns
- 없음 (새 프로젝트)

### Integration Points
- IndexedDB: Dexie.js 사용 (settings, conversations, messages 테이블)
- API: OpenRouter API (OpenAI 호환, 내장 fetch 사용)
- 상태: Zustand (chat store), TanStack Query (models cache)

</code_context>

<specifics>
## Specific Ideas

- ChatGPT와 유사한 UX/UI (사용자가 직접 명시)
- 한국어 UI 모든 버튼, 레이블, 안내 문구 (PROJECT.md 명시)
- 다크모드 기본 활성 (PROJECT.md 명시)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 1 scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-30*
