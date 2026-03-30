---
phase: 01-app-shell-and-interface-foundation
plan: 02
subsystem: ui
tags: [shadcn, radix, sonner, sidebar, tailwindcss]
requires:
  - phase: 01-01
    provides: Vite/Tailwind/Biome baseline and global style entrypoint
provides:
  - shadcn/ui Vite initialization baseline
  - shell 구현에 필요한 input, textarea, dropdown, sheet, sidebar, sonner primitives
  - mobile breakpoint hook과 `cn` utility
affects: [ui, shell, theme, routing]
tech-stack:
  added: [shadcn, radix-ui, class-variance-authority, clsx, tailwind-merge, lucide-react, sonner, tw-animate-css]
  patterns: [official-shadcn-primitives, tailwind-v4-shadcn-css-variables, inter-first-theme-overrides]
key-files:
  created: [components.json, src/components/ui/dropdown-menu.tsx, src/components/ui/input.tsx, src/components/ui/sheet.tsx, src/components/ui/sidebar.tsx, src/components/ui/sonner.tsx, src/components/ui/textarea.tsx, src/components/ui/tooltip.tsx, src/hooks/use-mobile.ts]
  modified: [biome.json, package.json, pnpm-lock.yaml, src/components/ui/button.tsx, src/lib/utils.ts, src/styles/globals.css]
key-decisions:
  - "shadcn generated defaults 중 Geist/next-themes 의존성은 유지하지 않고 Inter 중심 토큰과 custom theme plan에 맞게 정리했다."
  - "Biome는 Tailwind v4 directives를 파싱하도록 조정해 generated CSS와 충돌하지 않게 했다."
patterns-established:
  - "새 UI primitive는 가능하면 official shadcn registry output을 유지한 채 최소 수정만 가한다."
  - "toaster와 theme 연동은 runtime dependency보다 app-level provider에 맞춰 얇게 유지한다."
requirements-completed: [UI-01, UI-02, UI-03, UI-04]
duration: 5 min
completed: 2026-03-30
---

# Phase 1 Plan 02: shadcn 기반 Summary

**shadcn/ui Vite 초기화와 shell용 sidebar, sheet, form, toaster primitives 확보**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-30T14:24:30Z
- **Completed:** 2026-03-30T14:29:15Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments

- shadcn/ui를 현재 Vite/Tailwind v4 baseline에 맞게 초기화했다.
- sidebar, sheet, dropdown-menu, input, textarea, sonner 등 shell 구현 핵심 primitives를 추가했다.
- generated defaults 중 UI-SPEC과 충돌하는 font/theme 의존성은 Inter 중심으로 바로 정리했다.

## Task Commits

Each task was committed atomically:

1. **Task 1: shadcn Vite 설정과 alias 기반 공용 util을 초기화한다** - `49a8231` (chore)
2. **Task 2: shell과 상태 화면에 필요한 official shadcn primitives를 추가한다** - `c892b0c` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `components.json` - shadcn alias, base color, css path를 정의한다.
- `src/lib/utils.ts` - `cn` utility를 제공한다.
- `src/components/ui/button.tsx` - cva 기반 button primitive를 제공한다.
- `src/components/ui/input.tsx` - input primitive를 제공한다.
- `src/components/ui/textarea.tsx` - auto-style textarea primitive를 제공한다.
- `src/components/ui/dropdown-menu.tsx` - model selector와 action menu 기반이 된다.
- `src/components/ui/sheet.tsx` - 모바일 sidebar overlay 기반이 된다.
- `src/components/ui/sidebar.tsx` - official sidebar/provider 패턴을 제공한다.
- `src/components/ui/sonner.tsx` - toast primitive를 제공한다.
- `src/hooks/use-mobile.ts` - sidebar mobile breakpoint helper를 제공한다.

## Decisions Made

- shadcn generated defaults 중 Geist import와 `next-themes` coupling은 제거하고, Inter 중심 토큰과 추후 custom theme provider 구조에 맞게 toaster를 단순화했다.
- Biome에 Tailwind v4 directive parsing을 켜서 generated globals.css와 formatter/linter가 충돌하지 않게 했다.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] root tsconfig alias를 shadcn CLI 기준으로 노출**
- **Found during:** Task 1 (shadcn Vite 설정과 alias 기반 공용 util을 초기화한다)
- **Issue:** `shadcn init`가 root `tsconfig.json`에서 import alias를 직접 확인해 초기화를 막았다.
- **Fix:** root `tsconfig.json`에도 `@/*` alias를 명시해 CLI 검사를 통과시켰다.
- **Files modified:** `tsconfig.json`
- **Verification:** `pnpm dlx shadcn@latest init -t vite -b radix -p nova -y` 성공
- **Committed in:** `49a8231`

**2. [Rule 3 - Blocking] generated theme defaults를 custom theme plan에 맞게 정리**
- **Found during:** Task 2 (shell과 상태 화면에 필요한 official shadcn primitives를 추가한다)
- **Issue:** generated `sonner`와 globals default가 `next-themes` 및 Geist font를 전제로 만들어져 Plan 03의 custom theme provider 방향과 충돌했다.
- **Fix:** `sonner`를 dark-safe primitive로 단순화하고 Geist import를 제거해 Inter 중심 토큰으로 되돌렸다.
- **Files modified:** `package.json`, `pnpm-lock.yaml`, `src/components/ui/sonner.tsx`, `src/styles/globals.css`
- **Verification:** `pnpm build`, `pnpm biome check .`
- **Committed in:** `49a8231`, `c892b0c`

**3. [Rule 3 - Blocking] Biome에 Tailwind v4 parser 옵션 추가**
- **Found during:** Task 2 (shell과 상태 화면에 필요한 official shadcn primitives를 추가한다)
- **Issue:** `@custom-variant`, `@theme`, `@apply` 구문 때문에 Biome가 globals.css를 파싱하지 못했다.
- **Fix:** `biome.json`에 `css.parser.tailwindDirectives`를 켜고 generated files를 auto-fix했다.
- **Files modified:** `biome.json`
- **Verification:** `pnpm biome check .`
- **Committed in:** `49a8231`

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** 모두 generated baseline을 현재 프로젝트 결정과 맞추는 보정이었고, shell 구현 범위 밖으로 확장되지는 않았다.

## Issues Encountered

- `src/components/ui/sidebar.tsx`의 cookie persistence는 Biome warning을 남기지만 build/lint를 막지 않았다. 현재는 official shadcn baseline을 유지하고, 실제 sidebar 상태 store를 도입하는 Plan 04에서 ownership을 우리 쪽 상태 계층으로 옮길 예정이다.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- router, provider, route skeleton을 추가할 준비가 됐다.
- shell 구현은 `SidebarProvider`, `Sheet`, `Toaster`, `DropdownMenu`를 바로 사용할 수 있다.

---
*Phase: 01-app-shell-and-interface-foundation*
*Completed: 2026-03-30*
