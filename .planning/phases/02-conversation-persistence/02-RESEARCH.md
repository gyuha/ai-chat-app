# Phase 2: Conversation Persistence - Research

**Date:** 2026-03-26
**Phase:** 02-conversation-persistence
**Question:** What do I need to know to plan this phase well?

## Scope Summary

Phase 2 covers three concrete outcomes:
- authenticated users can create a conversation
- authenticated users can list only their own conversations
- unauthorized cross-user access is blocked at the API/data layer

It does not need full message-history restore UX yet, but the storage model should leave room for Phase 3 message persistence and Phase 4 history restore.

## Current Codebase Baseline

### Backend baseline
- `backend/prisma/schema.prisma` currently defines only `User`, so conversation storage starts from a clean Prisma schema extension.
- `backend/src/auth/auth.controller.ts` already exposes cookie-backed session endpoints and uses `JwtAuthGuard` plus `@CurrentUser()` to inject authenticated user identity.
- `backend/src/auth/auth.service.ts` and `backend/src/users/users.service.ts` establish the existing service pattern: thin controller, service-owned business logic, Prisma access via dedicated services.

### Frontend baseline
- `frontend/src/routes/index.tsx` is the current authenticated landing page and is the natural place to attach initial conversation bootstrap plus the minimal list shell.
- `frontend/src/routes/__root.tsx` and `frontend/src/features/auth/session.ts` already guarantee session bootstrap before protected app rendering.
- `frontend/src/lib/api/client.ts` and `frontend/src/features/auth/api.ts` establish the frontend pattern: feature-local API helpers over one credentialed fetch wrapper.

## Planning Implications

### 1. Data model should be phase-minimal but Phase-3-safe

The roadmap plan names already separate schema work from UI/API wiring. The schema should therefore solve Phase 2 requirements without overbuilding chat behavior.

Recommended shape:
- `Conversation`
  - `id`
  - `userId`
  - `title`
  - `createdAt`
  - `updatedAt`
- `Message`
  - `id`
  - `conversationId`
  - `role`
  - `content`
  - `createdAt`

Why include `Message` now even though Phase 2 does not show history:
- roadmap plan `02-01` explicitly mentions `conversation/message` domain model
- Phase 3 will need persisted assistant/user messages immediately
- adding the relation now avoids a second schema churn one phase later

Why keep Phase 2 UI minimal anyway:
- CONTEXT locks list density to title-only
- message preview and history rendering are deferred
- no need for summary, excerpt, or title-generation logic yet

### 2. Ownership boundary should be enforced twice

To satisfy `CONV-04`, the plan should require both:
- API-level scoping by authenticated `user.id`
- Prisma queries that always constrain by `userId`

Practical implication:
- do not expose generic `findConversationById(id)` helpers that skip owner checks
- prefer repository/service methods shaped like `findConversationForUser(userId, conversationId)` and `listConversationsForUser(userId)`

This keeps accidental cross-user reads from slipping into later phases.

### 3. Auto-create first conversation belongs in the app entry flow

The user chose automatic first-conversation creation on initial authenticated entry. That means the frontend plan needs a deterministic bootstrap rule:
- fetch current user's conversation list
- if empty, issue create-conversation request
- once created, render that conversation as selected

This behavior can live either:
- in route loader/bootstrap orchestration, or
- in component-level query + mutation orchestration

Given the existing app structure, planning should preserve one source of truth for authenticated entry rather than scattering bootstrap logic across multiple components.

### 4. API surface can stay small

Phase 2 only needs a narrow backend contract:
- `POST /conversations` -> create a new conversation for current user with title `새 대화`
- `GET /conversations` -> list current user's conversations

Optional for this phase:
- returning the created conversation from POST so the frontend can immediately select it

Not required in this phase:
- conversation rename endpoint
- conversation detail endpoint
- message CRUD endpoint

### 5. Frontend state should avoid inventing a second auth-like global store

The codebase currently relies on TanStack Query plus a tiny auth state store. For conversations, the existing pattern suggests:
- query for conversation list
- mutation for conversation creation
- derive selected conversation in route/component state unless global coordination becomes necessary

The plan should resist introducing a large dedicated conversation store unless there is a concrete need. Phase 2 scope is too small to justify that complexity.

## Risks And Edge Cases

### Security risk
- If controller or service methods accept arbitrary conversation IDs without `userId` scoping, `CONV-04` fails.

### Bootstrap race risk
- auto-create can double-fire if the frontend creates on every empty fetch without guarding pending state or invalidation order.

### Phase-boundary risk
- if planners bundle message history rendering into Phase 2, the phase will bleed into Phase 4.

### Migration risk
- Prisma migration should avoid a schema that forces nullable ownership or optional title defaults inconsistent with the locked `새 대화` decision.

## Recommended Plan Split

### Plan 02-01
Focus on backend domain foundation:
- Prisma schema and migration for `Conversation` and `Message`
- backend module/service/controller skeleton for conversation create/list
- ownership-scoped Prisma methods
- backend tests for create/list/isolation behavior

### Plan 02-02
Focus on frontend integration:
- feature-local conversation API helpers
- query/mutation wiring for list + create
- replace current protected placeholder screen with minimal title-only list shell
- auto-create-first-conversation bootstrap
- frontend tests for empty-first-entry and title-only list behavior

This split matches the roadmap and keeps backend contract stabilization ahead of UI integration.

## Validation Architecture

Plans should require verification at three layers:

### Data layer
- Prisma schema contains `Conversation` and `Message` with explicit foreign keys and timestamps.

### API layer
- authenticated create/list endpoints succeed for owner
- list returns only owner conversations
- attempts to access another user's conversation through service/controller paths are rejected or return no data

### Frontend layer
- authenticated app entry fetches conversations
- empty list causes exactly one conversation creation flow
- rendered list remains title-only and uses `새 대화` as the initial title

## Concrete Checks For Planner

- backend tests should prove two different users do not see each other's conversations
- frontend tests should prove first authenticated visit with no conversations creates one conversation and selects it
- plan objectives should mention automatic first-conversation creation explicitly so the user decision is not dropped
- every plan must reference `CONV-01`, `CONV-02`, and `CONV-04` coverage where appropriate

## Research Conclusion

The safest planning approach is a two-plan phase:
- backend-first domain and ownership foundation
- frontend bootstrap and minimal list integration on top of that contract

The key design constraint is not UI richness but correctness of ownership scoping plus reliable auto-bootstrap for the first conversation.
