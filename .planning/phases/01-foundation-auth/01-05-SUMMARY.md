---
phase: 01-foundation-auth
plan: "05"
subsystem: auth
tags: [nestjs, jwt, passport, prisma, sqlite, testing, cookies]
requires:
  - phase: 01-04
    provides: SQLite User persistence, Prisma module, UsersService contracts
provides:
  - Cookie-backed JWT auth endpoints for signup, login, logout, refresh, and session restore
  - Passport local/jwt strategies with safe auth response shaping
  - Backend auth unit and e2e coverage enforcing secret-safe payloads
affects: [frontend-auth, protected-routes, chat-api, session-bootstrap]
tech-stack:
  added: [passport-local, @prisma/adapter-better-sqlite3]
  patterns: [httpOnly access/refresh cookies, Prisma 7 adapter-backed SQLite runtime, pretest Prisma client generation]
key-files:
  created: [backend/jest.config.ts, backend/src/auth/auth.controller.ts, backend/src/auth/auth.service.ts, backend/test/auth.e2e-spec.ts]
  modified: [backend/package.json, backend/src/auth/auth.module.ts, backend/src/prisma/prisma.service.ts, backend/src/auth/auth.service.spec.ts]
key-decisions:
  - "Auth responses return only { user } or { ok: true }; JWT strings, password hashes, and OpenRouter values stay out of JSON."
  - "JWT session state uses httpOnly access_token and refresh_token cookies with SameSite=Lax and production-only secure."
  - "Prisma 7 SQLite runtime uses prisma.config.ts plus PrismaBetterSqlite3 adapter instead of datasource url in schema.prisma."
patterns-established:
  - "Backend auth controllers set cookies via passthrough Response and delegate token creation/clearing to AuthService."
  - "Backend verification always runs prisma generate before unit, e2e, and build commands to keep Prisma client state reproducible."
requirements-completed: [AUTH-01, AUTH-02, AUTH-03, CHAT-04]
duration: 7m 31s
completed: 2026-03-26
---

# Phase 01 Plan 05: Backend Auth Contract Summary

**Cookie-backed NestJS JWT auth with SQLite user lookup, Passport strategies, and backend tests that prove signup, session restore, refresh, and secret-safe responses**

## Performance

- **Duration:** 7m 31s
- **Started:** 2026-03-26T00:53:11+09:00
- **Completed:** 2026-03-26T01:00:51+09:00
- **Tasks:** 2
- **Files modified:** 19

## Accomplishments

- Implemented `POST /auth/signup`, `POST /auth/login`, `GET /auth/session`, `POST /auth/logout`, and `POST /auth/refresh` with DTO validation, password hashing, and cookie-based JWT sessions.
- Added Passport local and JWT strategies, auth guards, and a current-user decorator so protected backend routes restore session state from `access_token` cookies.
- Replaced Wave 0 auth test stubs with real unit and e2e coverage for duplicate signup rejection, cookie issuance, refresh, logout clearing, and server-secret boundary checks.

## Task Commits

1. **Task 1: Implement auth service, DTOs, guards, and controllers against the SQLite user store** - `b070ca3` (test), `86f292f` (feat)
2. **Task 2: Replace the Wave 0 stubs with backend auth contract tests** - `fedc228` (test)

## Files Created/Modified

- `backend/jest.config.ts` - backend unit test execution for TypeScript specs
- `backend/package.json` - Prisma generate hooks and auth runtime dependencies
- `backend/src/auth/auth.controller.ts` - auth HTTP endpoints and cookie application
- `backend/src/auth/auth.service.ts` - signup, credential validation, JWT issuance, refresh, and logout helpers
- `backend/src/auth/auth.service.spec.ts` - unit coverage for hashing, safe payloads, and refresh behavior
- `backend/src/auth/auth.module.ts` - JWT/passport wiring for auth providers and controller
- `backend/src/prisma/prisma.service.ts` - Prisma 7 SQLite adapter-backed client
- `backend/test/auth.e2e-spec.ts` - auth HTTP contract coverage with real Nest app bootstrapping

## Decisions Made

- Used Passport `local` with `usernameField: 'email'` so login behavior matches the plan’s HTTP contract without exposing token strings in JSON.
- Kept access and refresh tokens exclusively in `httpOnly` cookies to preserve frontend refresh restore while avoiding browser-readable JWT state.
- Standardized backend test/build scripts around `prisma generate` because Prisma 7 client generation was not guaranteed during install in this environment.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added backend Jest TypeScript config**
- **Found during:** Task 1 (RED phase)
- **Issue:** `pnpm --filter backend test -- auth.service.spec.ts` could not parse TypeScript specs because no Jest transform config was active.
- **Fix:** Added `backend/jest.config.ts` and pointed backend `test` script at it.
- **Files modified:** `backend/jest.config.ts`, `backend/package.json`
- **Verification:** `pnpm --filter backend test -- auth.service.spec.ts`
- **Committed in:** `b070ca3`

**2. [Rule 3 - Blocking] Corrected Prisma 7 SQLite runtime wiring**
- **Found during:** Task 2
- **Issue:** Prisma 7 rejected `url` in `schema.prisma`, and the Nest runtime could not open SQLite without an adapter-backed client.
- **Fix:** Removed schema datasource URL usage, added `@prisma/adapter-better-sqlite3`, instantiated `PrismaBetterSqlite3` in `PrismaService`, and generated the Prisma client before test/build commands.
- **Files modified:** `backend/package.json`, `backend/prisma/schema.prisma`, `backend/src/prisma/prisma.service.ts`, `pnpm-lock.yaml`
- **Verification:** `pnpm --filter backend test:e2e -- auth.e2e-spec.ts`, `pnpm --filter backend build`
- **Committed in:** `fedc228`

**3. [Rule 3 - Blocking] Rebuilt native SQLite bindings for the current Node runtime**
- **Found during:** Task 2
- **Issue:** `better-sqlite3` native bindings were absent or compiled for the wrong Node ABI after install scripts were skipped.
- **Fix:** Rebuilt `better-sqlite3` locally against Node 24.13.0 before rerunning e2e verification.
- **Files modified:** none (environment repair only)
- **Verification:** `pnpm --filter backend test:e2e -- auth.e2e-spec.ts`
- **Committed in:** none (workspace/runtime fix)

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** All deviations were required to make the planned backend auth flow executable under Prisma 7 and the current local toolchain. No product-scope expansion.

## Issues Encountered

- `.planning/STATE.md` had already advanced to Plan 6 before this plan’s execution, so plan progress needed to be corrected from disk state rather than by trusting the existing pointer alone.

## User Setup Required

없음 - 외부 서비스 수동 설정이 필요하지 않음.

## Next Phase Readiness

- Frontend auth screens and protected routes can now rely on stable `/auth/*` contracts and 401-on-expiry behavior.
- Before chat work proceeds, the backend runtime should continue using the Prisma 7 adapter path so SQLite access remains consistent across local environments.

## Self-Check: PASSED

- Verified summary and key auth files exist on disk.
- Verified task commits `b070ca3`, `86f292f`, and `fedc228` exist in git history.
