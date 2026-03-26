---
phase: 02-conversation-persistence
plan: "02"
subsystem: conversations-frontend
tags: [react, tanstack-query, tanstack-router, conversations, bootstrap, vitest]
requires:
  - phase: 02-01
    provides: Conversations backend contract, title-only DTOs, bootstrap-safe create endpoint
provides:
  - Frontend conversation API/query helpers on top of the shared credentialed client
  - Protected `/` route that auto-creates the first conversation and renders a minimal title-only list
  - Frontend routing coverage for existing conversations, empty bootstrap, and no-manual-CTA behavior
affects: [conversation-entry, conversation-list, phase-3-chat-shell]
tech-stack:
  added: []
  patterns: [query-driven bootstrap, route-local selected conversation state, title-only list rendering]
key-files:
  created: [frontend/src/features/conversations/api.ts, frontend/src/features/conversations/query.ts, frontend/src/features/conversations/types.ts, frontend/tests/conversation-routing.test.tsx]
  modified: [frontend/src/routes/index.tsx]
key-decisions:
  - "Frontend reuses the shared `apiRequest` helper and keeps conversation server state in TanStack Query."
  - "The first conversation is created only after a successful empty-list response and only once per route mount."
  - "The protected route stays minimal in Phase 2: title-only buttons, selected conversation label, and no welcome or manual-create copy."
patterns-established:
  - "Conversation list data lives under the stable `['conversations']` query key with a detail key derived from the same root."
  - "Bootstrap behavior seeds both list and detail query caches immediately after create success."
requirements-completed: [CONV-01, CONV-02]
duration: 0m
completed: 2026-03-26
---

# Phase 02 Plan 02: Conversation Frontend Summary

**Conversation API/query helpers, protected `/` bootstrap behavior, and frontend tests that prove title-only list rendering**

## Performance

- **Duration:** 0m
- **Completed:** 2026-03-26
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added a small `frontend/src/features/conversations` slice with list/create/detail API helpers, query keys, and title-only types.
- Replaced the protected home placeholder with a conversation shell that fetches owned conversations, auto-creates one with `{ mode: "bootstrap" }` on empty results, and immediately selects the created or first conversation.
- Kept the Phase 2 UI intentionally minimal: title-only list entries, no timestamps, no preview text, no welcome copy, and no manual create CTA.
- Added frontend routing tests that verify existing-list rendering, one-time empty bootstrap, and absence of a manual creation button before bootstrap completes.

## Task Commits

1. **Task 1: Add conversation feature contracts and query helpers on top of the shared API client** - `c519823` (feat), `4eb30ed` (feat)
2. **Task 2: Replace the protected home placeholder with auto-bootstrap conversation list behavior** - `54c9920` (test), `f013d1f` (feat)

## Files Created/Modified

- `frontend/src/features/conversations/api.ts` - credentialed conversation request helpers
- `frontend/src/features/conversations/query.ts` - stable query keys and bootstrap mutation helper
- `frontend/src/features/conversations/types.ts` - title-only frontend contract types
- `frontend/src/routes/index.tsx` - protected conversation entry and bootstrap behavior
- `frontend/tests/conversation-routing.test.tsx` - routing/bootstrap/title-only coverage

## Decisions Made

- Used route-local selected conversation state instead of a longer-lived global store because Phase 2 only needs one protected entry shell.
- Triggered bootstrap creation inside the protected route after an empty list query so `GET /conversations` remains read-only and ownership-safe.
- Seeded query cache immediately after bootstrap create success so the route can render `새 대화` without waiting for another list round-trip.

## Deviations from Plan

없음 - frontend kept the exact Phase 2 scope and did not pull in timestamps, previews, or history UI.

## Issues Encountered

- The executor completion signal did not finish the documentation wrap-up, but the frontend commits and verification commands completed successfully.

## User Setup Required

없음 - existing frontend test/typecheck commands are sufficient.

## Next Phase Readiness

- Phase 3 can now attach a chat panel and streaming behavior to the selected conversation shell on `/`.
- Phase 4 can extend this route to load and render saved message history for the selected conversation.

## Self-Check: PASSED

- Verified `pnpm --dir frontend test -- conversation-routing.test.tsx` exits 0.
- Verified `pnpm --dir frontend typecheck` exits 0.
- Verified commits `c519823`, `4eb30ed`, `54c9920`, and `f013d1f` exist in git history.
