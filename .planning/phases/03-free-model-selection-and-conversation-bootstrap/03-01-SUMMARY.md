---
phase: 03-free-model-selection-and-conversation-bootstrap
plan: 01
subsystem: persistence
tags: [dexie, conversations, metadata, react-query]
requires:
  - phase: 02-01
    provides: Dexie settings store, QueryClient provider, fake IndexedDB bootstrap
  - phase: 02-04
    provides: defaultModelId/defaultSystemPrompt settings persistence
provides:
  - conversations Dexie schema와 metadata helpers
  - draft singleton 생성/재사용 service
  - conversation list/detail query actions
affects: [conversations, persistence, models, routing]
tech-stack:
  added: []
  patterns: [dexie-conversation-store, draft-singleton, query-cache-sync]
key-files:
  created: [src/lib/conversation-service.ts, src/hooks/use-conversations-query.ts]
  modified: [src/lib/app-db.ts]
key-decisions:
  - "conversation metadata는 settings와 같은 Dexie DB 안의 `conversations` store에 저장한다."
  - "modelId가 없는 draft conversation은 service 레벨에서 하나만 유지한다."
patterns-established:
  - "UI는 conversation read/write를 hooks layer로만 사용한다."
  - "새 대화 생성 시 default settings를 읽어 metadata를 초기화한다."
requirements-completed: [DATA-03]
duration: inline session
completed: 2026-03-31
---

# Phase 3 Plan 01: persistence Summary

**대화 메타데이터를 Dexie와 Query 계층에 고정**

## Accomplishments

- `openrouter-chat-db`에 `conversations` store를 추가하고 `updatedAt` 기준 정렬이 가능하게 했다.
- `createOrReuseDraftConversation`, `updateConversationModel`, `updateConversationMetadata`를 service 계층에 만들었다.
- UI가 Dexie를 직접 건드리지 않도록 conversation list/detail/action hook을 추가했다.

## Task Commits

1. **Task 1-2 묶음:** `6260d68` — `feat(03-01): add conversation persistence`

## Files Created/Modified

- `src/lib/app-db.ts` - conversations schema와 reset 범위를 확장했다.
- `src/lib/conversation-service.ts` - draft singleton, metadata patch, display title helper를 제공한다.
- `src/hooks/use-conversations-query.ts` - conversation list/detail/action query entrypoint를 제공한다.

## Decisions Made

- draft 재사용은 UI가 아니라 service에서 판단한다.
- 대화 제목 기본값은 `새 대화`로 유지하고, modelId/systemPrompt는 settings 초기값을 따른다.

## Deviations from Plan

None.

## Next Phase Readiness

- 03-02는 새 대화 버튼과 sidebar를 실제 persistence에 바로 연결할 수 있다.
- 03-03/03-04는 active conversation query를 기반으로 header/body 상태를 구성할 수 있다.

---
*Phase: 03-free-model-selection-and-conversation-bootstrap*
*Completed: 2026-03-31*
