---
phase: 03-streaming-chat-experience
plan: 03
subsystem: ui
tags: [markdown, code-copy, regenerate, react-markdown, gfm]
requires:
  - phase: 03-streaming-chat-experience
    provides: transport layer and streaming lifecycle
provides:
  - assistant markdown renderer
  - custom code block copy UX
  - latest assistant regenerate flow
affects: [phase-04, phase-05, ui, rendering]
tech-stack:
  added: [react-markdown, remark-gfm]
  patterns: [assistant-document-surface, copy-utility, replace-last-assistant]
key-files:
  created: [apps/web/src/components/chat/message-content.tsx, apps/web/src/components/chat/message-content.test.tsx, apps/web/src/lib/clipboard.ts]
  modified: [apps/web/src/components/chat/message-bubble.tsx, apps/web/src/components/chat/message-list.tsx, apps/web/src/components/chat/chat-header.tsx, apps/web/src/styles/index.css]
key-decisions:
  - "assistant 응답은 bubble 안 plain text가 아니라 읽는 문서 표면처럼 렌더링한다."
  - "regenerate는 최신 assistant turn만 교체한다."
patterns-established:
  - "code block copy는 renderer utility를 통해 테스트 가능하게 분리한다."
  - "message bubble은 status chip과 regenerate affordance를 함께 가진다."
requirements-completed: [MSG-04, REND-01, REND-02]
duration: 30min
completed: 2026-03-30
---

# Phase 3 Plan 03 Summary

**assistant markdown, 코드 복사, 최신 응답 regenerate까지 채팅 읽기 경험을 완성했다**

## Accomplishments

- `react-markdown + remark-gfm` 기반 assistant renderer를 추가해 heading, list, table, code block을 dark theme에 맞게 렌더링했다.
- code block header에 copy action과 성공 피드백을 붙였다.
- 최신 assistant turn만 재생성하는 regenerate 흐름을 message list와 route에 연결했다.

## Files Created or Modified

- `apps/web/src/components/chat/message-content.tsx` - markdown/code renderer
- `apps/web/src/lib/clipboard.ts` - copy utility
- `apps/web/src/components/chat/message-bubble.tsx` - status chip과 regenerate affordance
- `apps/web/src/styles/index.css` - markdown surface와 overflow 보강

## Issues Encountered

- jsdom clipboard mock 신뢰도가 낮아 copy 로직을 utility로 분리하고 테스트는 utility 호출을 검증하게 바꿨다.

## Next Phase Readiness

- settings/title/delete phase는 이제 읽기/streaming 기본기를 다시 건드리지 않고 관리 기능에 집중할 수 있다.
