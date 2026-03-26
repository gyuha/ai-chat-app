# PRD: OpenRouter Free Chat App MVP

**Slug**: `openrouter-free-chat-app-mvp`
**Created**: 2026-03-26
**Source of truth**: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`
**Use with Ralph**: Run `/ralph "implement /Users/gyuha/workspace/ai-chat-app/.omx/plans/prd-openrouter-free-chat-app-mvp.md"`

## Problem Statement

Users need a simple, secure way to log into a shared chat product and talk to a free OpenRouter model without exposing the OpenRouter API key in the browser. The app also needs durable conversation history so a user can leave and return to earlier chats. The current codebase has the authentication foundation largely in place, but the conversation persistence, streaming chat flow, and final protected-app UX still need to be completed to reach the v1 promise.

## Goals

- Allow multiple users to sign up and sign in with email and password
- Keep OpenRouter API credentials and model configuration on the server only
- Let an authenticated user create and continue conversations with a fixed free OpenRouter model
- Persist conversations and messages in SQLite so history survives refresh and re-entry
- Deliver a usable MVP where login, chat, and history restore work end to end

## Non-Goals

- User-selectable models or user-supplied OpenRouter API keys
- Social login or OAuth
- File attachments, multimodal input, or image generation
- Admin dashboards, analytics, or advanced moderation controls
- Prompt preset management or conversation title editing for v1

## Current Status

- Completed or substantially implemented:
  - `AUTH-01` sign up
  - `AUTH-02` login
  - `AUTH-03` session persistence
  - `CHAT-04` backend-only secret boundary
- Remaining MVP requirements:
  - `AUTH-04`
  - `CONV-01` through `CONV-04`
  - `CHAT-01` through `CHAT-03`

## Users and Primary Flow

### Primary User

A regular end user who wants to create an account, log in, chat with a free AI model, and revisit past conversations later.

### Primary Flow

1. The user signs up or logs in with email and password.
2. The app restores the authenticated session after refresh.
3. The user enters the protected chat UI and creates a new conversation.
4. The user sends a prompt.
5. The backend forwards the request to the configured free OpenRouter model.
6. The UI shows the assistant response as a stream.
7. The completed assistant response is saved to the correct conversation.
8. The user reopens the conversation later and sees prior messages.

## Acceptance Criteria

### Authentication and Access

- A new user can sign up with email and password and receives an authenticated session.
- An existing user can log in with email and password and receives an authenticated session.
- Reloading the frontend preserves the session through the server-managed auth mechanism.
- An unauthenticated visitor trying to open the app area is redirected to a public auth route and cannot view chat data.

### Conversation Ownership and Persistence

- An authenticated user can create a new conversation record.
- The conversation list endpoint and UI return only conversations owned by the current authenticated user.
- Opening a conversation returns its saved messages in chronological order.
- Requests for another user's conversation or messages are rejected without leaking data.

### Chat Execution

- Sending a user message from the protected chat UI triggers a backend request to the fixed OpenRouter free model.
- The assistant response is rendered incrementally in the UI while the backend is receiving streamed data.
- When streaming completes successfully, the final assistant message is persisted in the same conversation.
- If OpenRouter returns an error or the network fails, the user sees a consistent error state and no partial data is saved as a completed assistant message.

### Security and Configuration

- The OpenRouter API key and model identifier exist only in backend environment configuration and are not referenced from frontend runtime code except through approved public API base URL settings.
- The frontend talks only to the local backend proxy for chat operations, never directly to OpenRouter.
- Auth cookies remain httpOnly and are not exposed to client JavaScript.

### MVP Verification

- Running the existing test suites and any newly added tests covers the completed MVP paths for auth, conversation access control, and chat flow.
- A manual verification pass can demonstrate this end-to-end scenario: sign up or log in, create a conversation, send a message, receive a streamed answer, refresh or revisit, and see the saved history.

## Technical Constraints

- Backend framework: NestJS with TypeScript
- Frontend: React SPA with TypeScript and Vite
- Routing/data stack: TanStack Router and TanStack Query
- Local UI state: Zustand only for short-lived UI concerns
- Database: SQLite
- Model policy: exactly one server-configured free OpenRouter model in v1
- Security rule: never expose the OpenRouter API key in the client bundle or browser network calls to OpenRouter
- Scope rule: v1 is complete only when login, secure chat, and history retrieval all work

## Implementation Phases

### Phase 1: Foundation and Auth

Objective: keep the existing auth foundation green and close any remaining access-control gaps needed by the protected app shell.

- Verify auth flows remain passing
- Ensure protected routing fully enforces `AUTH-04`
- Keep backend env validation and cookie-based session handling intact

### Phase 2: Conversation Persistence

Objective: add durable user-owned conversation and message storage.

- Define or finalize the Prisma schema for conversations and messages
- Add backend services and endpoints for conversation creation, listing, and detail lookup
- Enforce ownership checks on every conversation read path
- Connect the frontend list/detail views to the new APIs

### Phase 3: OpenRouter Streaming Chat

Objective: proxy chat requests through the backend and persist streamed results.

- Implement a backend OpenRouter client/proxy using the fixed free model
- Stream assistant output to the frontend
- Persist user and assistant messages to the conversation on success
- Handle provider and network failures with recoverable UX states

### Phase 4: App UX Completion

Objective: turn the individual pieces into a complete MVP workflow.

- Finalize protected chat layouts and empty/error states
- Restore conversation history when a user selects an existing conversation
- Validate auth expiry and reload behavior in the real route tree
- Add or update tests and a manual verification checklist for MVP sign-off

## Suggested Test Matrix

- Backend auth integration tests for signup, login, session refresh behavior, and unauthorized access
- Backend conversation tests for create/list/detail and cross-user access denial
- Backend chat proxy tests for request forwarding, streaming behavior, and persistence on completion
- Frontend route tests for protected redirects and restored authenticated entry
- Frontend integration tests for creating/selecting conversations and rendering streamed assistant output

## Risks

- OpenRouter free-model availability or model ID changes can block Phase 3 unless revalidated at implementation time
- SQLite write patterns may need careful sequencing during streamed message persistence
- Cross-user data leaks are the highest-severity product risk and must be covered by tests before MVP sign-off

## Definition of Done

This PRD is complete when all acceptance criteria above are true in the codebase, verified by tests or explicit manual checks, and the app demonstrates the full MVP flow without exposing the OpenRouter API key to the client.

## Next Step

Run `/ralph "implement /Users/gyuha/workspace/ai-chat-app/.omx/plans/prd-openrouter-free-chat-app-mvp.md"` and use this PRD as the completion contract.
