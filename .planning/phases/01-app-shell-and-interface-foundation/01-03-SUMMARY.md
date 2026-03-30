---
phase: 01-app-shell-and-interface-foundation
plan: 03
subsystem: ui
tags: [tanstack-router, zustand, theme, file-based-routing, vite]
requires:
  - phase: 01-02
    provides: shadcn primitives, globals, button/sheet/sidebar/toaster baseline
provides:
  - TanStack Router file-based route skeleton for `/`, `/chat/$conversationId`, `/settings`
  - custom dark-first theme provider
  - Zustand UI store for theme and mobile sidebar state
affects: [ui, shell, settings, conversations]
tech-stack:
  added: [@tanstack/react-router, @tanstack/router-plugin, zustand]
  patterns: [file-based-route-tree, custom-theme-provider, zustand-ui-shell-state]
key-files:
  created: [src/router.tsx, src/routeTree.gen.ts, src/routes/__root.tsx, src/routes/index.tsx, src/routes/chat.$conversationId.tsx, src/routes/settings.tsx, src/providers/theme-provider.tsx, src/stores/ui-store.ts]
  modified: [biome.json, package.json, pnpm-lock.yaml, src/App.tsx, vite.config.ts]
key-decisions:
  - "TanStack Router는 file-based routing + generated route tree 기준으로 고정했다."
  - "테마는 next-themes가 아니라 custom provider + Zustand store 조합으로 유지한다."
patterns-established:
  - "root route는 provider와 shell chrome의 공통 진입점이 된다."
  - "theme preference와 mobile sidebar state는 UI store에서 공통 관리한다."
requirements-completed: [UI-01, UI-02, UI-03, UI-04]
duration: 4 min
completed: 2026-03-30
---

# Phase 1 Plan 03: router/theme 기반 Summary

**TanStack Router file-based routing과 custom theme provider, Zustand UI store 기반**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-30T14:29:20Z
- **Completed:** 2026-03-30T14:33:26Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- `/`, `/chat/$conversationId`, `/settings` 세 경로를 가진 file-based router skeleton을 만들었다.
- generated `routeTree.gen.ts`와 Vite plugin을 연결해 route 파일 구조가 build에 반영되도록 했다.
- custom dark-first theme provider와 Zustand UI store를 추가해 theme/mobile sidebar 공통 상태 기반을 마련했다.

## Task Commits

Each task was committed atomically:

1. **Task 1: TanStack Router file-based routing과 route skeleton을 추가한다** - `6f57a73` (feat)
2. **Task 2: dark 기본 theme provider와 공유 UI store를 app root에 연결한다** - `25643b8` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `vite.config.ts` - TanStack Router Vite plugin을 연결한다.
- `src/router.tsx` - generated route tree 기반 router 인스턴스를 만든다.
- `src/routeTree.gen.ts` - file-based routes에서 생성된 typed route tree다.
- `src/routes/__root.tsx` - provider, tooltip, toaster, outlet를 묶는 root route다.
- `src/routes/index.tsx` - 홈 route placeholder를 제공한다.
- `src/routes/chat.$conversationId.tsx` - 대화 route placeholder를 제공한다.
- `src/routes/settings.tsx` - 설정 route placeholder를 제공한다.
- `src/providers/theme-provider.tsx` - dark 기본값, system 감지, localStorage 동기화를 담당한다.
- `src/stores/ui-store.ts` - theme preference/resolved theme/mobile sidebar 상태를 저장한다.
- `src/App.tsx` - RouterProvider 진입점으로 교체됐다.

## Decisions Made

- file-based routing을 유지하고 generated route tree는 Biome 대상에서 제외했다.
- theme는 custom provider + Zustand 조합으로 유지해 shell과 settings가 동일한 상태 원본을 공유하게 했다.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] router dependency 병렬 설치 충돌 복구**
- **Found during:** Task 1 (TanStack Router file-based routing과 route skeleton을 추가한다)
- **Issue:** 병렬 `pnpm add` 실행으로 `package.json`에 `@tanstack/react-router`와 `zustand`가 한 번 사라졌다.
- **Fix:** 의존성을 순차적으로 다시 추가하고 lockfile을 재생성했다.
- **Files modified:** `package.json`, `pnpm-lock.yaml`
- **Verification:** `pnpm build`
- **Committed in:** `6f57a73`

**2. [Rule 3 - Blocking] build 순서를 route tree 생성 기준으로 조정**
- **Found during:** Task 1 (TanStack Router file-based routing과 route skeleton을 추가한다)
- **Issue:** `tsc -b`가 generated route tree보다 먼저 실행되면 `src/routeTree.gen.ts` 부재로 build가 깨질 수 있었다.
- **Fix:** build script를 `vite build && tsc -b` 순서로 바꿔 generated file 이후 타입 검사가 돌게 했다.
- **Files modified:** `package.json`
- **Verification:** `pnpm build`
- **Committed in:** `6f57a73`

**3. [Rule 3 - Blocking] generated route tree를 lint 대상에서 제외**
- **Found during:** Task 1 (TanStack Router file-based routing과 route skeleton을 추가한다)
- **Issue:** generated `src/routeTree.gen.ts`가 explicit `any`와 formatting 차이로 Biome error를 발생시켰다.
- **Fix:** `biome.json`에서 generated route tree를 제외해 generated file ownership을 plugin에 맡겼다.
- **Files modified:** `biome.json`
- **Verification:** `pnpm biome check .`
- **Committed in:** `6f57a73`

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** 모두 router generation/tooling 안정화를 위한 수정이었고, route 구조와 theme/provider 범위는 그대로 유지됐다.

## Issues Encountered

- `src/components/ui/sidebar.tsx`의 cookie persistence warning은 아직 남아 있다. 현재는 generated primitive 경고 수준으로 두고, Plan 04에서 실제 UI store와 shell wiring을 넣을 때 우리 상태 계층 중심으로 재평가한다.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- root route와 app provider가 준비돼 shell chrome을 실제로 얹을 수 있다.
- theme preference와 mobile sidebar state는 shell/header 구현에서 바로 재사용 가능하다.

---
*Phase: 01-app-shell-and-interface-foundation*
*Completed: 2026-03-30*
