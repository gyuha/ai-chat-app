---
phase: 02-conversation-persistence
plan: "01"
subsystem: conversations-backend
tags: [nestjs, prisma, sqlite, conversations, ownership, e2e]
requires:
  - phase: 01-05
    provides: Cookie-backed auth guards, current-user extraction, backend e2e auth bootstrap
  - phase: 01-06
    provides: Protected app entry that will consume conversation APIs
provides:
  - Prisma Conversation and Message persistence models for later chat/history phases
  - Authenticated conversations module with create, list, and ownership-safe detail APIs
  - Backend e2e coverage for conversation creation, list scoping, and foreign-ID rejection
affects: [frontend-conversations, streaming-chat, history-restore]
tech-stack:
  added: []
  patterns: [userId-scoped Prisma queries, bootstrap-safe transaction path, title-only DTOs]
key-files:
  created: [backend/src/conversations/conversations.module.ts, backend/src/conversations/conversations.controller.ts, backend/src/conversations/conversations.service.ts, backend/src/conversations/dto/create-conversation.dto.ts, backend/src/conversations/dto/conversation-summary.dto.ts, backend/test/conversations.e2e-spec.ts]
  modified: [backend/prisma/schema.prisma, backend/src/app.module.ts, backend/prisma/migrations/20260326111526_add_conversation_models/migration.sql, backend/prisma/migrations/migration_lock.toml]
key-decisions:
  - "Conversation and Message are added in Phase 2 so Phase 3 streaming and Phase 4 history restore can reuse one persistence model."
  - "All conversation read/write paths accept userId explicitly and scope Prisma queries with it."
  - "Foreign conversation lookups return NotFoundException so ownership mismatches do not leak resource existence."
patterns-established:
  - "Conversation bootstrap uses a Prisma transaction that returns the newest owned conversation before creating a fresh `새 대화`."
  - "Conversation list/detail responses stay title-only in Phase 2 and avoid message payload expansion."
requirements-completed: [CONV-01, CONV-04]
duration: 0m
completed: 2026-03-26
---

# Phase 02 Plan 01: Conversation Backend Contract Summary

**Prisma conversation/message persistence, authenticated NestJS conversation APIs, and backend e2e tests that prove create/list/ownership behavior**

## Performance

- **Duration:** 0m
- **Completed:** 2026-03-26
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Extended the Prisma schema with `Conversation`, `Message`, and `MessageRole` so later streaming and history phases can build on stable persistence primitives.
- Added `ConversationsModule` with authenticated `POST /conversations`, `GET /conversations`, and `GET /conversations/:id` endpoints using `@CurrentUser()` and `JwtAuthGuard`.
- Implemented ownership-safe Prisma queries plus a bootstrap-aware `createConversation(userId, mode)` path that preserves the exact default title `새 대화`.
- Replaced the Wave 0 backend placeholder with e2e coverage for conversation creation, owned-title listing, and cross-user `404` behavior.

## Task Commits

1. **Task 1: Add conversation/message persistence contracts and backend e2e scaffolding** - `d9190e2` (test)
2. **Task 2: Implement the authenticated conversations module and ownership-scoped API** - `ed5a381` (feat), `3dcb5f4` (refactor)

## Files Created/Modified

- `backend/prisma/schema.prisma` - Conversation and Message models plus relation indexes
- `backend/prisma/migrations/20260326111526_add_conversation_models/migration.sql` - SQLite migration for conversation/message tables
- `backend/src/app.module.ts` - Conversations module registration
- `backend/src/conversations/conversations.controller.ts` - authenticated create/list/detail endpoints
- `backend/src/conversations/conversations.service.ts` - bootstrap-safe create flow and ownership-scoped reads
- `backend/src/conversations/dto/create-conversation.dto.ts` - validated `mode` input contract
- `backend/src/conversations/dto/conversation-summary.dto.ts` - title-only response shape
- `backend/test/conversations.e2e-spec.ts` - owned create/list/detail backend contract coverage

## Decisions Made

- Added `Message` now even though Phase 2 UI does not render history, so later phases do not need to rework schema shape.
- Kept conversation DTOs minimal with only `id` and `title` to honor the Phase 2 title-only list decision.
- Used `findFirst({ where: { id, userId } })` plus `NotFoundException` for detail access so ownership enforcement lives in the service layer.

## Deviations from Plan

없음 - backend contract, schema shape, ownership checks, and e2e coverage all landed within the planned scope.

## Issues Encountered

- The executor completion signal did not finish the documentation wrap-up, but the code commits and backend e2e verification completed successfully.

## User Setup Required

없음 - 기존 backend test/bootstrap 흐름만으로 재현 가능합니다.

## Next Phase Readiness

- Frontend can now call `/conversations` and `/conversations/:id` through the existing credentialed API client.
- Phase 2 Wave 2 can safely implement empty-list bootstrap and title-only rendering against the stable backend contract.
- Phase 3 can later persist assistant/user messages into the already-created `Message` table.

## Self-Check: PASSED

- Verified `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts` exits 0.
- Verified task commits `d9190e2`, `ed5a381`, and `3dcb5f4` exist in git history.
- Verified conversation module and Prisma models exist on disk.
