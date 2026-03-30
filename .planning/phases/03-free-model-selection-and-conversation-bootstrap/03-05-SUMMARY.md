---
phase: 03-free-model-selection-and-conversation-bootstrap
plan: 05
subsystem: testing
tags: [vitest, integration, routing, indexeddb]
requires:
  - phase: 03-01
    provides: conversation persistence
  - phase: 03-04
    provides: draft gating and header selector surface
provides:
  - draft bootstrap integration tests
  - chat route model selection persistence tests
  - sidebar ordering/draft label tests
affects: [testing, routing, sidebar, chat]
tech-stack:
  added: []
  patterns: [fake-indexeddb-conversations, route-level-bootstrap-tests]
key-files:
  created: [src/routes/chat.$conversationId.test.tsx, src/components/layout/conversation-list.test.tsx]
  modified: [src/routes/index.test.tsx, src/test/test-utils.ts, src/components/layout/app-shell.test.tsx, src/components/chat/phase-one-surfaces.test.tsx]
key-decisions:
  - "Phase 3 핵심 정책은 route-level integration tests로 고정한다."
  - "component tests는 `useNavigate` mock과 provider wrapper를 추가해 Phase 1 회귀도 함께 막는다."
patterns-established:
  - "conversation fixtures는 test utils에서 만들어 Dexie에 직접 seed한다."
  - "header/body/model persistence는 실제 router + fake IndexedDB 조합으로 검증한다."
requirements-completed: [MODL-01, MODL-02, MODL-03, CONV-01, DATA-03]
duration: inline session
completed: 2026-03-31
---

# Phase 3 Plan 05: testing Summary

**conversation bootstrap과 모델 선택 정책을 자동 테스트로 고정**

## Accomplishments

- home empty state에서 새 대화 draft 생성 및 재사용 흐름을 route test로 검증했다.
- chat route에서 draft gating, active model 표시, header selector persistence를 검증했다.
- sidebar 실제 목록 정렬과 draft label, 기존 component test provider/mocking 회귀를 정리했다.

## Task Commits

1. **Task 1-2 묶음:** `a0c740f` — `test(03-05): cover conversation bootstrap flows`

## Files Created/Modified

- `src/routes/chat.$conversationId.test.tsx` - draft gating과 model persistence를 검증한다.
- `src/components/layout/conversation-list.test.tsx` - sidebar ordering과 draft label을 검증한다.
- `src/routes/index.test.tsx` - 새 대화 생성/재사용 흐름을 검증한다.
- `src/test/test-utils.ts` - conversation fixture/seed helper를 제공한다.

## Verification Commands

- `pnpm test`
- `pnpm build`
- `pnpm biome check .`

## Deviations from Plan

None.

## Next Phase Readiness

- Phase 4는 현재 bootstrap/model metadata 정책을 신뢰하고 chat streaming 구현에 집중할 수 있다.

---
*Phase: 03-free-model-selection-and-conversation-bootstrap*
*Completed: 2026-03-31*
