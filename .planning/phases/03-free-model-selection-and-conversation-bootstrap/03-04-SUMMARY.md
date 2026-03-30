---
phase: 03-free-model-selection-and-conversation-bootstrap
plan: 04
subsystem: chat-surface
tags: [draft, composer, chat-route, empty-state]
requires:
  - phase: 03-01
    provides: conversation metadata query/actions
  - phase: 03-02
    provides: real draft conversation routing
provides:
  - draft conversation 배너
  - composer disabled gating
  - 활성 모델 metadata-aware placeholder surface
affects: [chat-route, composer, empty-state]
tech-stack:
  added: []
  patterns: [draft-gating, header-cta-handoff]
key-files:
  created: []
  modified: [src/routes/chat.$conversationId.tsx, src/components/chat/message-pane-placeholder.tsx, src/components/chat/chat-composer.tsx]
key-decisions:
  - "modelId가 없는 draft는 본문 배너와 비활성 입력창으로 표현한다."
  - "본문 CTA는 새 selector를 복제하지 않고 헤더 selector trigger를 다시 사용한다."
patterns-established:
  - "chat route는 active conversation query로 body/composer props를 계산한다."
  - "모델이 있으면 placeholder card에 active model 유지 상태를 보여준다."
requirements-completed: [MODL-02, MODL-03]
duration: inline session
completed: 2026-03-31
---

# Phase 3 Plan 04: draft gating Summary

**draft conversation에서 모델 선택 전 입력을 막고, 다음 행동을 명확히 제시**

## Accomplishments

- chat route가 active conversation metadata를 직접 읽고 body/composer 상태를 나누게 했다.
- `modelId` 없는 draft에서는 모델 선택 배너와 CTA를 보여 주고 textarea/button을 비활성화했다.
- `modelId`가 있는 대화에서는 active model 유지 메시지와 기존 composer 구조를 그대로 유지했다.

## Task Commits

1. **Task 1-2 묶음:** `b6fbdd8` — `feat(03-04): gate draft conversations by model`

## Files Created/Modified

- `src/routes/chat.$conversationId.tsx` - active conversation query를 route body에 연결한다.
- `src/components/chat/message-pane-placeholder.tsx` - draft/active model 상태를 나누어 렌더링한다.
- `src/components/chat/chat-composer.tsx` - model 선택 여부에 따라 disabled/placeholder/helperText를 제어한다.

## Decisions Made

- draft CTA는 새 UI surface를 만들지 않고 header selector trigger를 열도록 했다.
- Phase 4 범위를 넘지 않도록 실제 message submit 로직은 추가하지 않았다.

## Deviations from Plan

None.

## Next Phase Readiness

- Phase 4는 composer disabled rule을 유지한 채 실제 send/stream/stop 로직을 붙일 수 있다.

---
*Phase: 03-free-model-selection-and-conversation-bootstrap*
*Completed: 2026-03-31*
