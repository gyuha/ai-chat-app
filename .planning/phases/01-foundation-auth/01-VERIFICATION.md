---
phase: 01-foundation-auth
verified: 2026-03-25T16:06:10Z
status: gaps_found
score: 6/8 must-haves verified
gaps:
  - truth: "Successful signup transitions directly into app bootstrap with no interstitial."
    status: failed
    reason: "Frontend signup marks local auth state and navigates to `/`, but backend signup does not issue session cookies. The protected route immediately re-checks `/auth/session`, so a real signup flow falls back to `/login` on the next bootstrap."
    artifacts:
      - path: "backend/src/auth/auth.controller.ts"
        issue: "POST /auth/signup returns only `{ user }` and never applies access/refresh cookies."
      - path: "backend/src/auth/auth.service.ts"
        issue: "signup() creates the user record but never creates a session."
      - path: "frontend/src/components/auth/signup-form.tsx"
        issue: "onSuccess assumes signup establishes an authenticated session and navigates directly to `/`."
      - path: "frontend/src/routes/index.tsx"
        issue: "Protected route always revalidates server session and redirects to `/login` when `/auth/session` returns null/401."
    missing:
      - "Issue session cookies during signup, or redirect signup success through an explicit login/session-establishment path."
      - "Add frontend or integration coverage for successful signup -> protected route bootstrap."
  - truth: "The repo exposes stable runnable verification surfaces for the phase execution baseline."
    status: failed
    reason: "Build and tests pass, but the advertised frontend typecheck surface fails, and the example frontend API base URL does not match the backend example port."
    artifacts:
      - path: "frontend/src/app/router.tsx"
        issue: "TanStack Router types require `strictNullChecks`, but the frontend tsconfig does not enable it, so `pnpm --filter frontend typecheck` fails."
      - path: "frontend/tsconfig.app.json"
        issue: "Compiler options omit `strictNullChecks`, leaving the package's typecheck script red."
      - path: "frontend/.env.example"
        issue: "Default API base URL points at `http://localhost:3000`."
      - path: "backend/.env.example"
        issue: "Default backend port is `3001`, so the shipped example env files do not describe one working local topology."
    missing:
      - "Make the frontend typecheck command pass, likely by enabling `strictNullChecks` or otherwise aligning router typing requirements."
      - "Align frontend/backend example env ports, or document an intentional proxy/topology in shipped config."
---

# Phase 01: Foundation & Auth Verification Report

**Phase Goal:** 프론트엔드와 백엔드의 실행 기반을 만들고, 이메일/비밀번호 인증과 서버 비밀값 경계를 확립한다
**Verified:** 2026-03-25T16:06:10Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Auth-specific automated checks and the two-package workspace exist. | ✓ VERIFIED | Root scripts and exactly `backend`/`frontend` workspace packages exist in `package.json` and `pnpm-workspace.yaml`; backend/frontend auth tests run green. |
| 2 | The backend boots as an isolated service with validated backend-only env keys. | ✓ VERIFIED | `ConfigModule.forRoot(... validationSchema)` wires the env schema and `main.ts` enables cookie parsing, validation, and credentialed CORS. |
| 3 | The frontend boots as a standalone SPA shell with public-only config and auth UI surfaces. | ✓ VERIFIED | `main.tsx` mounts providers, `styles.css` carries the auth shell/tokens, and frontend secret-name grep is clean. |
| 4 | SQLite user persistence and Nest module wiring exist for auth. | ✓ VERIFIED | Prisma `User` model, migration, `UsersService`, `PrismaService`, and `AuthModule` registration are present and backend build passes. |
| 5 | A user can sign up and log in with email/password. | ✓ VERIFIED | Backend auth e2e covers signup/login, and dedicated `/login` and `/signup` routes/forms are wired to `/auth/login` and `/auth/signup`. |
| 6 | Login session state is cookie-backed, survives refresh, and invalid sessions redirect to `/login`. | ✓ VERIFIED | Backend issues/refreshes/clears httpOnly cookies; frontend session bootstrap and routing tests cover restore and 401 redirect. |
| 7 | Successful signup transitions directly into authenticated app bootstrap. | ✗ FAILED | Frontend redirects to `/` after signup, but backend signup never sets cookies; the protected route re-checks `/auth/session` and can redirect back to `/login`. |
| 8 | The phase exposes stable runnable verification surfaces for build, test, and typecheck. | ✗ FAILED | `frontend build` and tests pass, but `pnpm --filter frontend typecheck` fails and the example frontend/backend ports are inconsistent. |

**Score:** 6/8 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `package.json` | Root workspace orchestration scripts | ✓ VERIFIED | `build`, `lint`, `typecheck`, `test` exist, but downstream `frontend typecheck` currently fails. |
| `pnpm-workspace.yaml` | Only `backend` and `frontend` app packages | ✓ VERIFIED | Includes exactly `backend` and `frontend`. |
| `backend/src/config/env.schema.ts` | Backend-only validated env contract | ✓ VERIFIED | Requires DB, JWT, OpenRouter, origin, and port keys. |
| `backend/src/main.ts` | Nest bootstrap with cookie parsing, validation, CORS | ✓ VERIFIED | Uses `cookieParser`, `ValidationPipe`, and credentialed CORS. |
| `backend/prisma/schema.prisma` | SQLite auth persistence model | ✓ VERIFIED | `User` model exists with unique email and password hash. |
| `backend/src/auth/auth.controller.ts` | Signup/login/logout/refresh/session endpoints | ⚠️ HOLLOW | Login/refresh/logout/session are wired; signup does not establish a session, leaving the frontend signup bootstrap hollow. |
| `backend/src/auth/auth.service.ts` | Password hashing and session behavior | ⚠️ HOLLOW | Hashing, JWT issuance, refresh, and logout work; `signup()` stops before session creation. |
| `frontend/src/lib/api/client.ts` | Credentialed frontend API client | ✓ VERIFIED | Always uses `credentials: 'include'` and `VITE_API_BASE_URL`. |
| `frontend/src/features/auth/session.ts` | Single session restore path | ✓ VERIFIED | 401 clears auth state, success hydrates auth state. |
| `frontend/src/routes/login.tsx` | Dedicated login screen | ✓ VERIFIED | Dedicated route renders the login form and redirects authenticated users. |
| `frontend/src/routes/signup.tsx` | Dedicated signup screen | ✓ VERIFIED | Dedicated route renders signup UI, but its success path assumes a session that backend signup does not create. |
| `frontend/src/app/router.tsx` | Typed router surface | ⚠️ ORPHANED | Runtime router works for build/tests, but its package typecheck surface is red due to TS config mismatch. |
| `frontend/.env.example` | Public API base URL contract | ⚠️ PARTIAL | Public-only env boundary is correct, but the default value disagrees with backend example port. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `pnpm-workspace.yaml` | `backend/package.json` | workspace package inclusion | ✓ WIRED | `backend` is listed as a workspace package. |
| `pnpm-workspace.yaml` | `frontend/package.json` | workspace package inclusion | ✓ WIRED | `frontend` is listed as a workspace package. |
| `backend/src/app.module.ts` | `backend/src/config/env.schema.ts` | ConfigModule validation schema | ✓ WIRED | `validationSchema` is passed to `ConfigModule.forRoot`. |
| `frontend/src/main.tsx` | `frontend/src/styles.css` | root stylesheet import | ✓ WIRED | `./styles.css` is imported at app entry. |
| `backend/src/users/users.service.ts` | `backend/prisma/schema.prisma` | Prisma user persistence | ✓ WIRED | `prisma.user.create/findUnique` matches the `User` model. |
| `backend/src/auth/strategies/local.strategy.ts` | `backend/src/auth/auth.service.ts` | email/password validation | ✓ WIRED | `usernameField: 'email'` and `validate()` delegate to `authService.validateUser`. |
| `backend/src/auth/strategies/jwt.strategy.ts` | `backend/src/auth/auth.constants.ts` | access cookie extraction | ✓ WIRED | Extracts `ACCESS_TOKEN_COOKIE` from cookies. |
| `frontend/src/lib/api/client.ts` | `frontend/src/features/auth/api.ts` | shared fetch wrapper | ✓ WIRED | Auth API helpers delegate to `apiRequest(...)`. |
| `frontend/src/features/auth/session.ts` | `frontend/src/routes/index.tsx` | redirect on unauthenticated session | ✓ WIRED | `ensureSession(...)` and `Navigate/redirect` route guard are both present. |
| `frontend/src/components/auth/login-form.tsx` | `frontend/src/features/auth/api.ts` | login mutation | ✓ WIRED | Login form calls `login(...)` then navigates to `/`. |
| `frontend/src/components/auth/signup-form.tsx` | `frontend/src/features/auth/api.ts` | signup mutation | ⚠️ PARTIAL | Signup form calls `signup(...)`, but the backend response path does not establish server session cookies. |
| `frontend/.env.example` | `backend/.env.example` | local app topology | ✗ NOT_WIRED | Example frontend API base URL (`3000`) and backend port (`3001`) do not match. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| --- | --- | --- | --- | --- |
| `backend/src/auth/auth.controller.ts` | `request.user`, `refreshToken` | `LocalStrategy` / cookie / `AuthService.refreshSession` | Yes | ✓ FLOWING |
| `backend/src/auth/auth.service.ts` | `user`, JWT cookies | `UsersService` + `JwtService` | Yes | ✓ FLOWING |
| `frontend/src/features/auth/session.ts` | `query.data` | `getSession()` -> `/auth/session` | Yes | ✓ FLOWING |
| `frontend/src/components/auth/login-form.tsx` | mutation response `response.user` | `login()` -> `/auth/login` | Yes | ✓ FLOWING |
| `frontend/src/components/auth/signup-form.tsx` | mutation response `response.user` | `signup()` -> `/auth/signup` | No session cookie | ⚠️ HOLLOW |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| Backend compiles | `pnpm --filter backend build` | Nest build passed | ✓ PASS |
| Backend auth unit coverage | `pnpm --filter backend test -- auth.service.spec.ts` | 5/5 tests passed | ✓ PASS |
| Backend auth e2e contract | `pnpm --filter backend test:e2e -- auth.e2e-spec.ts` | 2/2 tests passed | ✓ PASS |
| Frontend builds | `pnpm --filter frontend build` | Vite build passed | ✓ PASS |
| Frontend auth tests | `pnpm --filter frontend test -- src/features/auth/session.test.tsx frontend/tests/auth-routing.test.tsx frontend/tests/auth-forms.test.tsx` | 7/7 tests passed | ✓ PASS |
| Frontend typecheck surface | `pnpm --filter frontend typecheck` | `strictNullChecks must be enabled in tsconfig.json` from `src/app/router.tsx` | ✗ FAIL |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| `AUTH-01` | `01-01`, `01-04`, `01-05`, `01-07` | 사용자가 이메일과 비밀번호로 가입할 수 있다 | ✓ SATISFIED | Backend signup endpoint creates users and rejects duplicates; frontend signup route/form exists. |
| `AUTH-02` | `01-01`, `01-05`, `01-07` | 사용자가 이메일과 비밀번호로 로그인할 수 있다 | ✓ SATISFIED | Backend login endpoint issues cookies; frontend login form submits to `/auth/login`. |
| `AUTH-03` | `01-01`, `01-05`, `01-06`, `01-07` | 사용자가 브라우저를 새로고침해도 로그인 세션이 유지된다 | ✓ SATISFIED | Backend `/auth/session` and `/auth/refresh` work; frontend session bootstrap restores auth and redirects on 401. |
| `CHAT-04` | `01-01`, `01-02`, `01-03`, `01-05`, `01-06` | OpenRouter API 키와 모델 ID는 서버 환경 변수로만 관리되고 클라이언트에 노출되지 않는다 | ✓ SATISFIED | Secret-name grep is clean in frontend; backend env schema and backend-only env example carry OpenRouter/JWT keys. |

All requirement IDs declared in phase 01 plans are accounted for in `REQUIREMENTS.md`. No orphaned phase-01 requirement IDs were found.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| `frontend/package.json` | 9 | `console.log('frontend lint scaffold pending')` placeholder lint script | ⚠️ Warning | Lint surface is still a stub even though build/test surfaces exist. |

### Gaps Summary

Phase 01 is close, but not fully goal-complete against the codebase. The backend and frontend both build, auth tests are green, the SQLite/auth/session boundary exists, and the secret boundary is preserved. The listed requirements `AUTH-01`, `AUTH-02`, `AUTH-03`, and `CHAT-04` are all accounted for and have implementation evidence.

The remaining issues are in must-have completeness, not file existence. First, the signup UX is hollow: frontend signup assumes authenticated bootstrap, but backend signup never creates the cookie-backed session that the protected app entry requires. Second, the shipped execution surface is not fully stable: frontend `typecheck` fails, and the example frontend/backend env ports do not describe one working local topology. Until those are fixed, the phase goal should remain `gaps_found`.

---

_Verified: 2026-03-25T16:06:10Z_
_Verifier: Claude (gsd-verifier)_
