---
phase: 01-foundation-auth
plan: 07
subsystem: auth-ui
tags: [react, tanstack-router, tanstack-query, vitest, auth-ui, session]
requires:
  - phase: 01-06
    provides: "Shared auth session bootstrap, protected index routing, and credentialed frontend auth client"
provides:
  - "Dedicated /login and /signup auth screens with approved email/password-only affordances"
  - "Inline email/password validation plus pending-state CTA feedback for auth mutations"
  - "Frontend auth routing and form tests covering redirect, session restore, invalid credentials, and session expiry"
affects: [frontend-auth, protected-routing, auth-tests]
tech-stack:
  added: []
  patterns:
    [
      "centered auth card with explicit login/signup mode switch",
      "field-level validation on blur and submit with one inline error per field",
      "memory-history TanStack Router tests through a reusable app router factory",
    ]
key-files:
  created:
    - frontend/src/components/auth/auth-card.tsx
    - frontend/src/components/auth/login-form.tsx
    - frontend/src/components/auth/signup-form.tsx
    - frontend/src/components/auth/session-loader.tsx
    - frontend/src/components/ui/button.tsx
    - frontend/src/components/ui/input.tsx
    - frontend/src/components/ui/spinner.tsx
    - frontend/tests/auth-routing.test.tsx
    - frontend/tests/auth-forms.test.tsx
  modified:
    - frontend/src/routes/login.tsx
    - frontend/src/routes/signup.tsx
    - frontend/src/routes/__root.tsx
    - frontend/src/routes/index.tsx
    - frontend/src/styles.css
    - frontend/src/app/router.tsx
    - frontend/vitest.config.ts
key-decisions:
  - "Login and signup remain the only public auth entry points, rendered through one shared centered-card shell."
  - "Successful login or signup immediately sets authenticated client state and navigates into the protected app route."
  - "Frontend routing tests use a reusable createAppRouter factory so redirect and expiry behavior can be exercised without browser-history globals."
patterns-established:
  - "Auth UI pattern: shared auth shell + route-specific form component + compact pending spinner state"
  - "Protected-session pattern: root bootstrap query plus route-level Navigate fallback when auth becomes anonymous"
requirements-completed: [AUTH-01, AUTH-02, AUTH-03]
duration: 2 min
completed: 2026-03-25
---

# Phase 01 Plan 07: Frontend Auth Screens Summary

**Approved `/login` and `/signup` auth surfaces plus frontend routing/form coverage now complete the visible side of cookie-backed auth.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-25T15:50:40Z
- **Completed:** 2026-03-25T15:53:15Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments

- Replaced placeholder auth routes with centered login and signup screens using the approved copy, two-mode switch, inline validation, and accent-colored pending spinner state.
- Added reusable auth UI primitives and a compact session loader so protected bootstrap no longer depends on placeholder layout content.
- Added frontend auth coverage for unauthenticated redirect to `/login`, mocked session restore, invalid credential messaging, and session-expiry redirect behavior.
- Exposed a reusable `createAppRouter` helper so auth routing tests can run against the real route tree with memory history instead of browser globals.

## Task Commits

1. **Task 1: Implement login and signup screens that match the approved auth contract** - `988a60e` (feat)
2. **Task 2 RED: Replace the frontend auth test placeholders with failing routing/form coverage** - `00b3633` (test)
3. **Task 2 GREEN: Wire the app router and tests to pass the planned auth behaviors** - `84d6fd2` (feat)

## Files Created/Modified

- `frontend/src/components/auth/auth-card.tsx` - shared auth shell with explicit 로그인/회원가입 mode links.
- `frontend/src/components/auth/login-form.tsx` - login mutation flow with blur/submit validation and approved invalid-credential error copy.
- `frontend/src/components/auth/signup-form.tsx` - signup mutation flow with duplicate-email and generic failure handling.
- `frontend/src/components/auth/session-loader.tsx` - compact centered loader for protected session bootstrap.
- `frontend/src/components/ui/button.tsx` - primary CTA wrapper for auth submit actions.
- `frontend/src/components/ui/input.tsx` - reusable auth input with error styling hook.
- `frontend/src/components/ui/spinner.tsx` - accent-colored spinner used by pending auth CTAs and session loader.
- `frontend/src/routes/login.tsx` - dedicated login route using the approved empty-state heading/body and direct authenticated redirect.
- `frontend/src/routes/signup.tsx` - dedicated signup route using the shared auth shell and authenticated redirect.
- `frontend/src/routes/__root.tsx` - root layout simplified to outlet + protected-route session loader.
- `frontend/src/routes/index.tsx` - protected route now navigates back to `/login` when auth state becomes anonymous after bootstrap.
- `frontend/src/styles.css` - auth layout, form, tab, loader, and CTA styling aligned to the approved UI contract.
- `frontend/src/app/router.tsx` - reusable router factory for app runtime and memory-history tests.
- `frontend/tests/auth-routing.test.tsx` - routing coverage for redirect, restore, and expiry flows.
- `frontend/tests/auth-forms.test.tsx` - login error handling and credentialed client helper coverage.
- `frontend/vitest.config.ts` - includes `frontend/tests/**` in Vitest discovery.

## Decisions Made

- Kept auth UX constrained to email/password only, with no password reset, social login, OAuth, or success interstitials, so the UI stays inside the approved contract.
- Used direct route-level redirects for already-authenticated users on `/login` and `/signup` to keep auth entry points explicit without duplicating bootstrap logic.
- Added a router factory instead of special-casing the singleton router in tests so future route-level auth flows can be tested with isolated histories.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Enabled Vitest discovery for the planned `frontend/tests/*` files**
- **Found during:** Task 2 RED
- **Issue:** The plan required new tests under `frontend/tests/`, but Vitest only discovered `src/**/*.test.*`, so the planned files would not execute.
- **Fix:** Extended `frontend/vitest.config.ts` include globs to cover `tests/**/*.test.ts?(x)`.
- **Files modified:** `frontend/vitest.config.ts`
- **Verification:** `pnpm --filter frontend test -- frontend/tests/auth-routing.test.tsx frontend/tests/auth-forms.test.tsx`
- **Committed in:** `00b3633`

**2. [Rule 3 - Blocking] Added a reusable router factory for real memory-history auth route tests**
- **Found during:** Task 2 GREEN
- **Issue:** The app only exposed a singleton runtime router, which prevented the new tests from exercising real route transitions in isolated memory-history instances.
- **Fix:** Added `createAppRouter` in `frontend/src/app/router.tsx` and updated auth tests to render the real app route tree with per-test query clients and histories.
- **Files modified:** `frontend/src/app/router.tsx`, `frontend/tests/auth-routing.test.tsx`, `frontend/tests/auth-forms.test.tsx`
- **Verification:** `pnpm --filter frontend test -- frontend/tests/auth-routing.test.tsx frontend/tests/auth-forms.test.tsx && pnpm --filter frontend build`
- **Committed in:** `84d6fd2`

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes were required to execute the planned test locations and verify the real auth routing behavior without widening product scope.

## Issues Encountered

- None after the router-testability fixes. Targeted auth tests and production build both passed.

## Known Stubs

None.

## User Setup Required

없음 - 외부 서비스 수동 설정이 필요하지 않음.

## Next Phase Readiness

- The frontend now has stable auth entry screens and automated coverage for the main login/session redirect flows.
- Phase 01 still has an incomplete backend auth plan (`01-05`), but this plan no longer depends on placeholder frontend auth UI.

## Self-Check

PASSED

- Found summary file: `.planning/phases/01-foundation-auth/01-07-SUMMARY.md`
- Found task commits: `988a60e`, `00b3633`, `84d6fd2`
