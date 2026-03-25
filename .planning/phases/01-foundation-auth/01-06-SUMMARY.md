---
phase: 01-foundation-auth
plan: 06
subsystem: auth
tags: [react, tanstack-query, tanstack-router, vite, session, auth]
requires:
  - phase: 01-03
    provides: "Standalone Vite frontend shell with public env boundary at VITE_API_BASE_URL"
provides:
  - "Credentialed frontend API client rooted at VITE_API_BASE_URL"
  - "Shared session bootstrap query with immediate 401 auth-state clearing"
  - "Protected index route redirecting unauthenticated users to /login"
  - "Placeholder login/signup routes for follow-up auth form work"
affects: [phase-01-07, auth-ui, protected-routing]
tech-stack:
  added: []
  patterns: ["shared fetch wrapper with credentials include", "root router + query client context", "session bootstrap backed by TanStack Query cache"]
key-files:
  created:
    - frontend/src/app/query-client.ts
    - frontend/src/lib/api/client.ts
    - frontend/src/features/auth/api.ts
    - frontend/src/features/auth/auth.store.ts
    - frontend/src/features/auth/session.ts
    - frontend/src/app/providers.tsx
    - frontend/src/app/router.tsx
    - frontend/src/routes/__root.tsx
    - frontend/src/routes/index.tsx
    - frontend/src/routes/login.tsx
    - frontend/src/routes/signup.tsx
  modified:
    - frontend/src/features/auth/session.test.tsx
    - frontend/src/main.tsx
    - frontend/vite.config.ts
    - frontend/vitest.config.ts
key-decisions:
  - "Frontend auth requests are funneled through one fetch wrapper that always sends cookies and never reads server-only secrets."
  - "The root router owns the shared session bootstrap while the protected index route enforces redirect-to-login behavior."
  - "Login and signup remain explicit placeholders in this plan so Plan 01-07 can focus only on auth form UI and behavior."
patterns-established:
  - "Session bootstrap pattern: getSession -> TanStack Query cache -> auth store synchronization -> protected route redirect"
  - "Routing pattern: root route mounts shared providers and child routes stay focused on page-level behavior"
requirements-completed: [AUTH-03, CHAT-04]
duration: 3 min
completed: 2026-03-25
---

# Phase 01 Plan 06: Frontend Auth Infrastructure Summary

**Cookie-backed frontend auth client, shared session bootstrap, and `/login`-guarded app entry wired through one TanStack Router root.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-25T15:42:03Z
- **Completed:** 2026-03-25T15:45:17Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments

- Added a shared frontend API client rooted at `VITE_API_BASE_URL` that always uses `credentials: 'include'`.
- Implemented auth helpers, a small auth store, and a single session bootstrap path with real tests covering bootstrap and `401` clearing.
- Wired the SPA through TanStack Router and Query providers, including a protected `/` route that redirects unauthenticated users to `/login`.
- Added placeholder `/login` and `/signup` routes so Plan `01-07` can focus on form behavior instead of router plumbing.

## Task Commits

1. **Task 1: Implement the frontend auth API layer and session bootstrap state** - `735dd16` (feat)
2. **Task 2: Wire protected routes and placeholder auth entry routes around the session bootstrap** - `03b106a` (feat)

## Files Created/Modified

- `frontend/src/app/query-client.ts` - shared TanStack Query client with `retry: false`.
- `frontend/src/lib/api/client.ts` - credentialed fetch wrapper rooted at `VITE_API_BASE_URL`.
- `frontend/src/features/auth/api.ts` - typed auth request helpers for signup, login, logout, session, and refresh.
- `frontend/src/features/auth/auth.store.ts` - minimal auth store with `loading/authenticated/anonymous` state.
- `frontend/src/features/auth/session.ts` - session query options, store synchronization, and unauthorized clearing.
- `frontend/src/features/auth/session.test.tsx` - real bootstrap tests replacing the previous placeholder contract test.
- `frontend/src/app/router.tsx` - router tree and shared query-client context.
- `frontend/src/app/providers.tsx` - root QueryClientProvider and RouterProvider wiring.
- `frontend/src/routes/__root.tsx` - root layout that mounts the shared session bootstrap.
- `frontend/src/routes/index.tsx` - protected app entry that redirects to `/login`.
- `frontend/src/routes/login.tsx` - placeholder login entry route for the next plan.
- `frontend/src/routes/signup.tsx` - placeholder signup entry route for the next plan.
- `frontend/src/main.tsx` - Vite entry updated to boot through the router providers.
- `frontend/vite.config.ts` - corrected Vite config alias wiring.
- `frontend/vitest.config.ts` - aligned Vitest alias resolution for `@/` imports.

## Decisions Made

- Used one shared fetch wrapper instead of ad hoc per-call `fetch` usage so cookie semantics and API base URL stay consistent.
- Kept auth state in a small local store synchronized from the session query so routes and future UI components can read a simple auth status contract.
- Deferred visual login/signup form implementation intentionally because this plan only owns routing and bootstrap infrastructure.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed frontend alias resolution for test/build config**
- **Found during:** Task 1
- **Issue:** `@/` imports in the new session test failed because the existing Vite/Vitest config did not resolve the frontend alias correctly.
- **Fix:** Switched `frontend/vite.config.ts` to Vite's config API and added explicit `@` aliases to both Vite and Vitest configs.
- **Files modified:** `frontend/vite.config.ts`, `frontend/vitest.config.ts`
- **Verification:** `pnpm --filter frontend test -- src/features/auth/session.test.tsx` and `pnpm --filter frontend build`
- **Committed in:** `735dd16`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was required to execute the planned session test and did not expand scope beyond frontend tooling correctness.

## Issues Encountered

- None after the alias-resolution fix. Session tests and production build both passed.

## Known Stubs

- `frontend/src/routes/login.tsx:8` - placeholder copy and CTA only; real login form is intentionally deferred to Plan `01-07`.
- `frontend/src/routes/signup.tsx:8` - placeholder copy and CTA only; real signup form is intentionally deferred to Plan `01-07`.

## User Setup Required

없음 - 외부 서비스 수동 설정이 필요하지 않음.

## Next Phase Readiness

- Plan `01-07` can attach real login/signup forms to stable route files without changing router bootstrap behavior.
- The protected route and shared session bootstrap are in place, so later auth UI work can focus on mutation flows and validation.

## Self-Check

PASSED

- Found summary file: `.planning/phases/01-foundation-auth/01-06-SUMMARY.md`
- Found task commits: `735dd16`, `03b106a`

---
*Phase: 01-foundation-auth*
*Completed: 2026-03-25*
