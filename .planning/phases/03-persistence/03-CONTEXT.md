# Phase 3: Persistence - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

localStorage를 통한 데이터 영속성. 브라우저 새로고침 후에도 채팅 데이터가 유지되어야 함. Phase 2의 streaming, input, auto-scroll 기능 위에 persistence 레이어를 추가.

</domain>

<decisions>
## Implementation Decisions

### Storage scope
- **D-01:** 현재 유지 — `apiKey`, `selectedModel`, `conversations`만 localStorage에 저장
- 새로고침 시 streaming/error 상태는 초기화됨 (별도 저장 안 함)

### Error handling UX
- **D-02:** 토스트 알림 — localStorage 실패 시 사용자에게 toast/notification으로 알림
- 비방해적 방식, console에만 기록하지 않음

### Storage limits
- **D-03:** 사용자께 알림만 — 용량 초과 시 자동 삭제 없이 용량 초과 알림만 제공
- 사용자가 직접 대화를 삭제하여 공간 확보

### Claude's Discretion
- Toast 컴포넌트 구현 방식 (기존 UI 라이브러리 사용 or 커스텀)
- Toast 표시 시간 및 스타일
- localStorage quota 감지 방법 (try-catch vs 사용량 체크)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing implementation
- `src/hooks/useLocalStorage.ts` — Existing localStorage hook with QuotaExceededError handling
- `src/context/ChatContext.tsx` — Existing persistence via useEffect, LOAD_STATE action
- `src/types/chat.ts` — ChatState interface

### Requirements
- `REQUIREMENTS.md` §Storage — STORE-01, STORE-02, STORE-03

[No external specs — requirements fully captured in decisions above]

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- `src/hooks/useLocalStorage.ts` — QuotaExceededError handling already exists, can reuse/extend
- `src/context/ChatContext.tsx` — Persistence via useEffect already implemented, needs toast integration

### Established Patterns
- Context + useReducer pattern for state management (Phase 1 established)
- Toast notifications not yet implemented — need to create or integrate UI library

### Integration Points
- ChatProvider already has persistence — need to add error boundary with toast
- useLocalStorage throws on quota exceeded — need to catch and show toast instead of throwing
- Error state (STORE-03) needs UI component (Toast) to inform user

</codebase_context>

<specifics>
## Specific Ideas

[No specific references — using standard approaches]

</specifics>

<deferred>
## Deferred Ideas

[None — discussion stayed within phase scope]

</deferred>

---

*Phase: 03-persistence*
*Context gathered: 2026-04-02*
