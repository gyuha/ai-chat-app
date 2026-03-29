---
phase: 03-streaming-chat-experience
plan: 02
subsystem: ui
tags: [react, tanstack-query, zustand, streaming, abort]
requires:
  - phase: 03-streaming-chat-experience
    provides: normalized SSE transport and parser
provides:
  - optimistic user + assistant draft lifecycle
  - composer stop control and abort flow
  - query-backed reconciliation after stream completion
affects: [phase-03, phase-04, ui, streaming]
tech-stack:
  added: []
  patterns: [query-persisted-vs-zustand-inflight, assistant-draft-overlay, route-owned-stream-session]
key-files:
  created: [apps/web/src/features/chats/stream-state.ts, apps/web/src/features/chats/stream-state.test.ts]
  modified: [apps/web/src/routes/chat/$chatId.tsx, apps/web/src/store/ui/chat-shell-store.ts, apps/web/src/features/composer/prompt-composer.tsx, apps/web/src/features/chats/hooks.ts]
key-decisions:
  - "persisted chat detail은 Query가, in-flight draft와 abort controller는 Zustand가 가진다."
  - "Stop generating은 composer primary action slot에서 send를 대체한다."
patterns-established:
  - "displayed messages는 persisted messages 위에 optimistic/draft overlay를 얹어 계산한다."
  - "abort 후에는 refetch로 partial persisted state와 UI를 다시 합친다."
requirements-completed: [MSG-03, MSG-05]
duration: 35min
completed: 2026-03-30
---

# Phase 3 Plan 02 Summary

**chat route를 실제 optimistic streaming surface로 바꾸고 stop 흐름을 붙였다**

## Accomplishments

- prompt 전송 시 user optimistic message와 assistant draft를 즉시 그리도록 route를 재구성했다.
- stream delta를 assistant draft에 누적하고, 완료 시 Query cache를 server truth로 동기화했다.
- composer가 generation 중 `Stop generating`을 노출하고 abort 후 partial 응답을 유지하도록 만들었다.

## Files Created or Modified

- `apps/web/src/routes/chat/$chatId.tsx` - stream lifecycle orchestration
- `apps/web/src/store/ui/chat-shell-store.ts` - in-flight session state
- `apps/web/src/features/composer/prompt-composer.tsx` - stop action 지원
- `apps/web/src/features/chats/hooks.ts` - cache sync helper

## Issues Encountered

- route param 기반 component에서 hook 순서와 stream side effect가 엉키지 않도록 `useEffectEvent`와 pure merge helper로 분리했다.

## Next Phase Readiness

- regenerate와 markdown renderer는 현재 draft overlay 위에 바로 올릴 수 있다.
