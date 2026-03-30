---
phase: 01-app-shell-and-interface-foundation
plan: 01
subsystem: ui
tags: [react, vite, tailwindcss, biome, typescript]
requires: []
provides:
  - React 19 + Vite + TypeScript strict 앱 부트스트랩
  - Tailwind CSS v4 글로벌 스타일과 다크 기본 엔트리 화면
  - Biome 기반 앱 범위 lint/format baseline
affects: [ui, routing, shadcn, theme]
tech-stack:
  added: [react, react-dom, vite, typescript, tailwindcss, @tailwindcss/vite, @biomejs/biome, @types/node]
  patterns: [strict-ts-vite-baseline, dark-first-global-css, alias-aware-vite-config]
key-files:
  created: [.gitignore, biome.json, package.json, index.html, src/main.tsx, src/App.tsx, src/styles/globals.css, tsconfig.app.json, tsconfig.json, tsconfig.node.json, vite.config.ts]
  modified: [pnpm-lock.yaml]
key-decisions:
  - "Biome 검사 범위는 앱 소스와 루트 설정 파일로 제한해 vendored GSD 문서와 분리했다."
  - "TypeScript 6 deprecation과 Vite ESM 경로 처리를 baseline 단계에서 바로 흡수했다."
patterns-established:
  - "앱 런타임 코드는 src 아래에 두고 루트 설정은 Vite alias `@/`를 기준으로 맞춘다."
  - "다크 기본 토큰은 globals.css의 CSS custom properties로 시작하고 이후 shell 단계에서 확장한다."
requirements-completed: [UI-01, UI-02, UI-04]
duration: 8 min
completed: 2026-03-30
---

# Phase 1 Plan 01: 앱 부트스트랩 Summary

**React 19 + Vite + Tailwind CSS v4 기반의 다크 기본 한국어 앱 엔트리와 strict toolchain baseline**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-30T14:16:00Z
- **Completed:** 2026-03-30T14:24:26Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- React 19, Vite 8, TypeScript 6, Tailwind CSS v4, Biome 기반 앱 골격을 수동으로 구성했다.
- 한국어 메타데이터와 다크 기본 배경을 가진 최소 엔트리 화면을 추가했다.
- 앱 소스만 대상으로 하는 Biome baseline과 alias-aware Vite/TypeScript 설정을 고정했다.

## Task Commits

Each task was committed atomically:

1. **Task 1: 수동 Vite 앱 골격과 toolchain 설정 파일을 만든다** - `771565e` (chore)
2. **Task 2: 최소 앱 엔트리와 다크 기본 글로벌 스타일을 만든다** - `59f102e` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `.gitignore` - `node_modules`와 `dist`를 저장소에서 제외한다.
- `package.json` - React/Vite/Tailwind/Biome 스크립트와 의존성을 정의한다.
- `biome.json` - 앱 범위 전용 formatter/linter 기준을 정의한다.
- `tsconfig.app.json` - strict app TS 설정과 `@/*` alias를 정의한다.
- `tsconfig.node.json` - Vite 설정용 Node 타입과 alias를 정의한다.
- `vite.config.ts` - React, Tailwind Vite plugin, `@` alias를 연결한다.
- `index.html` - `lang="ko"`와 루트 mount, 문서 title을 제공한다.
- `src/main.tsx` - React root를 생성하고 글로벌 스타일을 연결한다.
- `src/App.tsx` - 다크 기본 placeholder shell 카드를 렌더링한다.
- `src/styles/globals.css` - Tailwind CSS v4 import와 글로벌 color token을 정의한다.

## Decisions Made

- Biome 검사 범위는 앱 소스와 루트 설정 파일로 제한해 vendored GSD 문서와 분리했다.
- TypeScript 6의 `baseUrl` deprecation 경고는 `ignoreDeprecations`로 즉시 정리하고, Vite config는 ESM 기준 `fileURLToPath` 패턴을 사용했다.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] 프로젝트 .gitignore를 baseline에 추가**
- **Found during:** Task 1 (수동 Vite 앱 골격과 toolchain 설정 파일을 만든다)
- **Issue:** 저장소에 `.gitignore`가 없어 `node_modules`와 `dist`가 untracked noise로 남았다.
- **Fix:** 최소 `.gitignore`를 추가해 runtime/build 산출물을 제외했다.
- **Files modified:** `.gitignore`
- **Verification:** `git status --short`에서 `node_modules/`가 더 이상 노출되지 않았다.
- **Committed in:** `771565e`

**2. [Rule 3 - Blocking] Biome 검사 범위를 앱 코드로 제한**
- **Found during:** Task 1 (수동 Vite 앱 골격과 toolchain 설정 파일을 만든다)
- **Issue:** `pnpm biome check .`가 프로젝트 앱 코드와 무관한 vendored `.codex` 파일까지 검사해 baseline을 막았다.
- **Fix:** `biome.json`에 앱 소스와 루트 설정 파일만 포함하도록 `files.includes`를 추가했다.
- **Files modified:** `biome.json`
- **Verification:** `pnpm biome check .` 통과
- **Committed in:** `771565e`

**3. [Rule 3 - Blocking] TypeScript 6/Vite ESM baseline 보정**
- **Found during:** Task 1 (수동 Vite 앱 골격과 toolchain 설정 파일을 만든다)
- **Issue:** `pnpm build`에서 TS 6 deprecation 경고와 `__dirname`/Node 타입 누락으로 빌드가 실패했다.
- **Fix:** `@types/node`를 추가하고 `tsconfig.node.json`에 Node types를 설정했으며, `vite.config.ts`를 `fileURLToPath` 기반 ESM 경로 해석으로 교체했다.
- **Files modified:** `package.json`, `pnpm-lock.yaml`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
- **Verification:** `pnpm build` 통과
- **Committed in:** `771565e`, `59f102e`

---

**Total deviations:** 3 auto-fixed (1 missing critical, 2 blocking)
**Impact on plan:** 모두 baseline 성립에 필요한 보정이었고 기능 범위 확장은 없었다.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 앱은 설치, lint, build가 가능한 baseline으로 올라왔다.
- 다음 plan에서 `shadcn/ui` 초기화와 shell primitives 추가를 바로 진행할 수 있다.

---
*Phase: 01-app-shell-and-interface-foundation*
*Completed: 2026-03-30*
