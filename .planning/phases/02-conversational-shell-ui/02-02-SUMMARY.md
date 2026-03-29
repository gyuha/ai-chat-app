---
phase: 02-conversational-shell-ui
plan: 02
subsystem: ui
tags: [composer, empty-state, zustand, message-layout]
requires:
  - phase: 02-conversational-shell-ui
    provides: route-driven shell scaffold
provides:
  - onboarding and empty-conversation states
  - multiline composer with keyboard rules
  - zustand shell state for drafts and local message previews
affects: [phase-02, phase-03, ui, streaming]
tech-stack:
  added: [zustand, testing-library]
  patterns: [draft-by-chat-id, local-user-message-preview, dual-empty-states]
key-files:
  created: [apps/web/src/features/composer/prompt-composer.tsx, apps/web/src/store/ui/chat-shell-store.ts, apps/web/src/components/chat/chat-empty-state.tsx, apps/web/src/components/feedback/onboarding-empty-state.tsx]
  modified: [apps/web/src/routes/chat/$chatId.tsx, apps/web/src/routes/index.tsx]
key-decisions:
  - "composer는 Enter 전송, Shift+Enter 줄바꿈으로 고정했다."
  - "empty onboarding과 empty conversation을 분리하되 같은 visual language를 사용한다."
patterns-established:
  - "draft와 local-only user messages는 Zustand UI 상태로 유지한다."
  - "역할별 message layout primitive를 streaming 이전에 먼저 고정한다."
requirements-completed: [CHAT-01, MSG-01, REND-04, FB-01]
duration: 25min
completed: 2026-03-29
---

# Phase 2 Plan 02 Summary

**빈 상태, composer, 역할별 메시지 레이아웃을 넣어 shell을 실제 대화 표면으로 바꿨다**

## Accomplishments

- onboarding root와 empty conversation surface를 분리해 첫 진입과 새 chat 시작 UX를 모두 정리했다.
- multiline composer와 keyboard submit 규칙을 구현하고 테스트로 고정했다.
- user/assistant/system 역할이 다른 형태로 보이도록 message primitive를 추가했다.

## Files Created or Modified

- `apps/web/src/features/composer/prompt-composer.tsx` - multiline composer
- `apps/web/src/store/ui/chat-shell-store.ts` - draft/pending prompt/local messages UI 상태
- `apps/web/src/components/chat/*` - chat header, empty state, message list/bubble
- `apps/web/src/components/feedback/onboarding-empty-state.tsx` - first-use surface

## Issues Encountered

- composer auto-resize는 hook dependency 경고가 생겨 input-event 기반 resize로 정리했다.

## Next Phase Readiness

- chat route는 이미 입력과 local preview를 처리하므로, Phase 3에서는 streaming lifecycle만 덧붙이면 된다.
