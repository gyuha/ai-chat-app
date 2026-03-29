---
phase: 02-conversational-shell-ui
plan: 03
subsystem: api
tags: [nestjs, chats, query, navigation, sidebar]
requires:
  - phase: 02-conversational-shell-ui
    provides: shell scaffold and composer surfaces
provides:
  - minimal chats REST API
  - query-backed sidebar and chat detail route
  - new chat creation and latest-chat redirect flow
affects: [phase-03, phase-04, api, ui]
tech-stack:
  added: [nestjs chats module, tanstack-query chat hooks]
  patterns: [route-is-source-of-truth, recent-first-chat-list, create-and-navigate]
key-files:
  created: [apps/server/src/modules/chats/chats.controller.ts, apps/server/src/modules/chats/chats.service.ts, apps/server/src/modules/chats/chats.module.ts, apps/web/src/features/chats/hooks.ts]
  modified: [apps/server/src/app.module.ts, apps/server/src/infrastructure/storage/file-chat.repository.ts, apps/server/src/infrastructure/storage/memory-chat.repository.ts, apps/web/src/lib/api/index.ts, apps/web/src/routes/index.tsx]
key-decisions:
  - "Phase 2에서도 chats list/create/detail API를 함께 추가해 mock-only shell을 피했다."
  - "active chat은 route param을 단일 기준으로 유지한다."
patterns-established:
  - "sidebar 데이터는 Query cache에서 읽고, create 성공 시 list/detail cache를 함께 갱신한다."
  - "저장소 updatedAt은 단조 증가로 유지해 최근순 정렬을 안정화한다."
requirements-completed: [SHELL-02, CHAT-01]
duration: 30min
completed: 2026-03-29
---

# Phase 2 Plan 03 Summary

**sidebar와 chat route를 실제 chat record, recent-first navigation, new chat mutation에 연결했다**

## Accomplishments

- `GET /api/v1/chats`, `POST /api/v1/chats`, `GET /api/v1/chats/:chatId`를 추가했다.
- sidebar가 실제 chats query를 사용하고, 새 chat 생성 직후 해당 route로 이동하도록 연결했다.
- `/`가 chats 존재 시 최신 chat으로 redirect하고, 없을 때만 onboarding empty state를 보여주게 만들었다.

## Files Created or Modified

- `apps/server/src/modules/chats/*` - minimal chats API
- `apps/server/src/infrastructure/storage/*.ts` - 안정적인 recent-first ordering 보강
- `apps/web/src/features/chats/hooks.ts` - models/chats/detail/create query/mutation
- `apps/web/src/lib/api/index.ts` - chats API helper
- `apps/web/src/routes/index.tsx` - latest chat redirect logic

## Issues Encountered

- 같은 밀리초에 `updatedAt`이 겹쳐 recent-first 테스트가 흔들려 저장소 timestamp를 단조 증가 방식으로 보정했다.

## Next Phase Readiness

- shell은 이미 real data 위에서 동작하므로, Phase 3는 streaming과 message lifecycle 구현에 집중할 수 있다.
