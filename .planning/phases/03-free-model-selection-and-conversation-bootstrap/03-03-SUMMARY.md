---
phase: 03-free-model-selection-and-conversation-bootstrap
plan: 03
subsystem: header
tags: [models, selector, header, shadcn]
requires:
  - phase: 03-01
    provides: active conversation query/actions
  - phase: 03-02
    provides: conversation route bootstrap
provides:
  - 현재 대화용 헤더 모델 selector
  - free-model-only 탐색 surface
  - active model persistence wiring
affects: [header, shell, chat]
tech-stack:
  added: []
  patterns: [header-select-surface, immediate-model-persistence]
key-files:
  created: [src/components/chat/conversation-model-selector.tsx]
  modified: [src/components/layout/app-header.tsx, src/components/layout/app-shell.tsx, src/routes/__root.tsx]
key-decisions:
  - "모델 선택의 주 진입점은 헤더의 shadcn `Select` surface로 둔다."
  - "모델 변경은 저장 버튼 없이 현재 conversation metadata에 즉시 반영한다."
patterns-established:
  - "root route는 active conversation query로 title을 계산한다."
  - "selector는 저장된 API key 기반 free models query만 사용한다."
requirements-completed: [MODL-01, MODL-03, DATA-03]
duration: inline session
completed: 2026-03-31
---

# Phase 3 Plan 03: header selector Summary

**헤더에서 현재 모델 확인과 무료 모델 탐색을 바로 수행할 수 있게 구성**

## Accomplishments

- `conversation-model-selector`를 추가해 현재 대화 모델을 header에서 확인하고 변경할 수 있게 했다.
- `무료 모델 기준` 정적 버튼을 실제 free-model selector로 교체했다.
- root route title도 active conversation metadata를 직접 읽어 계산하도록 바꿨다.

## Task Commits

1. **Task 1-2 묶음:** `3acd72e` — `feat(03-03): add active conversation model selector`

## Files Created/Modified

- `src/components/chat/conversation-model-selector.tsx` - free models 목록과 현재 모델을 묶는 selector component다.
- `src/components/layout/app-header.tsx` - header action 영역에 selector를 렌더링한다.
- `src/components/layout/app-shell.tsx` - activeConversationId를 header로 전달한다.
- `src/routes/__root.tsx` - active conversation title을 실제 데이터로 계산한다.

## Decisions Made

- absolute custom dropdown 대신 기존 shadcn `Select` primitive를 사용했다.
- active model label은 model name 우선, 없으면 model id fallback으로 보여준다.

## Deviations from Plan

None.

## Next Phase Readiness

- draft 상태 body CTA가 헤더 selector trigger를 그대로 재사용할 수 있다.
- Phase 4는 같은 selector/persistence 구조 위에서 실제 chat completion 요청을 붙일 수 있다.

---
*Phase: 03-free-model-selection-and-conversation-bootstrap*
*Completed: 2026-03-31*
