---
phase: 01-foundation-auth
plan: "03"
subsystem: ui
tags: [react, vite, vitest, tanstack-query, tanstack-router, auth, css-tokens]
requires:
  - phase: 01-01
    provides: workspace shell and frontend package path
provides:
  - buildable frontend Vite/React package shell
  - auth visual token contract in CSS
  - frontend env boundary limited to VITE_API_BASE_URL
affects: [01-06, 01-07, auth-ui, session-bootstrap]
tech-stack:
  added: [react, react-dom, vite, vitest, @tanstack/react-query, @tanstack/react-router]
  patterns: [standalone frontend app shell, Vite native tsconfig path resolution, frontend-only public env contract]
key-files:
  created: [frontend/index.html, frontend/tsconfig.app.json, frontend/tsconfig.node.json, frontend/src/main.tsx, frontend/src/styles.css, frontend/components.json, frontend/.env.example]
  modified: [frontend/package.json, frontend/vite.config.ts, pnpm-lock.yaml]
key-decisions:
  - "Frontend build script uses plain `vite build` and separate `typecheck` to avoid generated config artifacts in the worktree."
  - "The frontend keeps a hard public env boundary with only `VITE_API_BASE_URL` exposed."
patterns-established:
  - "Auth shell styling is driven by root CSS tokens from the approved UI spec."
  - "Frontend config uses Vite 8 native tsconfig path support instead of an extra resolver plugin."
requirements-completed: [CHAT-04]
duration: 2 min
completed: 2026-03-26
---

# Phase 01 Plan 03: Frontend Shell Summary

**Standalone React/Vite auth shell with approved visual tokens and a frontend-only API base URL contract**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-25T15:36:37Z
- **Completed:** 2026-03-25T15:38:45Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- Replaced the placeholder frontend package with a buildable Vite 8 + React 19 shell ready for later auth routing work.
- Added the app entrypoint, auth-card placeholder UI, and approved spacing/color/control tokens in `frontend/src/styles.css`.
- Locked frontend public configuration to `VITE_API_BASE_URL` and kept OpenRouter/JWT secret identifiers out of frontend files.

## Task Commits

1. **Task 1: Upgrade the frontend package shell into a buildable Vite React app package** - `9a0df43` (feat)
2. **Task 2: Create the frontend shell entry and auth design token contract** - `5fdc9b0` (feat)

## Files Created/Modified
- `frontend/package.json` - frontend dependency graph and stable dev/build/test/typecheck scripts
- `frontend/vite.config.ts` - React/Vitest config with native tsconfig path resolution
- `frontend/tsconfig.json` - project reference entrypoint for app and config typing
- `frontend/tsconfig.app.json` - browser-targeted TypeScript settings with `@/*` aliases
- `frontend/tsconfig.node.json` - config-file typechecking for Vite/Vitest
- `frontend/index.html` - SPA root document for the standalone frontend
- `frontend/src/vite-env.d.ts` - Vite client types for the frontend app
- `frontend/src/main.tsx` - minimal auth shell entrypoint and placeholder card
- `frontend/src/styles.css` - approved auth token contract and baseline shell styling
- `frontend/components.json` - shadcn preset contract using `b1xS4xAK3M`
- `frontend/.env.example` - frontend env template exposing only `VITE_API_BASE_URL`
- `pnpm-lock.yaml` - workspace lockfile updates for frontend dependencies

## Decisions Made
- Separated `typecheck` from `build` so frontend builds do not leave generated config artifacts in the repo.
- Used Vite 8 native path resolution instead of `vite-tsconfig-paths` after Vite reported the plugin as unnecessary.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added missing frontend Node type dependency**
- **Found during:** Task 1 (frontend package shell verification)
- **Issue:** `frontend` typecheck failed because `tsconfig.node.json` referenced the `node` type library without `@types/node`.
- **Fix:** Added `@types/node` to `frontend` devDependencies and refreshed the lockfile.
- **Files modified:** `frontend/package.json`, `pnpm-lock.yaml`
- **Verification:** `pnpm --filter frontend run typecheck`
- **Committed in:** `5fdc9b0`

**2. [Rule 1 - Bug] Switched Vite config typing to Vitest config export**
- **Found during:** Task 1 (frontend package shell verification)
- **Issue:** `vite.config.ts` rejected the `test` field under plain Vite config typing.
- **Fix:** Changed the config helper import to `defineConfig` from `vitest/config`.
- **Files modified:** `frontend/vite.config.ts`
- **Verification:** `pnpm --filter frontend run typecheck`
- **Committed in:** `5fdc9b0`

**3. [Rule 1 - Bug] Updated frontend build/config flow to avoid generated artifacts and Vite 8 peer mismatch**
- **Found during:** Task 2 (frontend build verification)
- **Issue:** `tsc -b && vite build` generated `frontend/vite.config.js` artifacts, and `@vitejs/plugin-react@5.1.0` warned about an unsupported Vite peer range.
- **Fix:** Changed the build script to `vite build`, removed the extra tsconfig-paths plugin, and upgraded `@vitejs/plugin-react` to `6.0.1`.
- **Files modified:** `frontend/package.json`, `frontend/vite.config.ts`, `pnpm-lock.yaml`
- **Verification:** `pnpm --filter frontend build` and `pnpm --filter frontend run typecheck`
- **Committed in:** `5fdc9b0`

---

**Total deviations:** 3 auto-fixed (1 blocking, 2 bug)
**Impact on plan:** All fixes were directly required to keep the frontend shell buildable and clean under the current Vite 8 toolchain. No scope creep.

## Issues Encountered
없음 - 계획 범위 안에서 모두 해결됨.

## User Setup Required
없음 - 외부 서비스 수동 설정이 필요하지 않음.

## Next Phase Readiness
- `frontend/` is ready for auth session bootstrap and route protection work in Plans 01-06 and 01-07.
- The visual token contract is in place, so later auth forms can extend the same CSS variables without reopening the UI spec.

## Self-Check: PASSED
- FOUND: `.planning/phases/01-foundation-auth/01-03-SUMMARY.md`
- FOUND: `9a0df43`
- FOUND: `5fdc9b0`
