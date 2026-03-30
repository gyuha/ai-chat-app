---
phase: 01-app-shell-and-interface-foundation
plan: 04
subsystem: ui
tags: [app-shell, sidebar, header, responsive, theme-toggle]
requires:
  - phase: 01-03
    provides: router root, theme provider, ui store baseline
provides:
  - ChatGPT 유사 앱 셸과 약 280px 데스크톱 사이드바
  - 모바일 좌측 Sheet 오버레이 내비게이션
  - 표준형 헤더, 테마 전환, 새 대화 액션, mock 대화 목록
affects: [ui, shell, navigation, theme]
tech-stack:
  added: []
  patterns: [responsive-app-shell, sidebar-sheet-dual-layout, root-shell-wiring]
key-files:
  created: [src/components/layout/app-shell.tsx, src/components/layout/app-sidebar.tsx, src/components/layout/app-header.tsx, src/components/layout/theme-toggle.tsx, src/components/layout/new-chat-button.tsx, src/components/layout/conversation-list.tsx, src/components/layout/conversation-list-item.tsx]
  modified: [src/routes/__root.tsx, src/stores/ui-store.ts, src/styles/globals.css]
key-decisions:
  - "데스크톱은 고정 sidebar, 모바일은 좌측 Sheet로 분리해 같은 정보 구조를 유지한다."
  - "accent는 새 대화 버튼, 활성 대화 항목, focus ring 수준으로만 제한한다."
patterns-established:
  - "root route는 current pathname을 title과 active navigation state로 변환한다."
  - "shell chrome은 route leaf와 분리된 layout component 계층으로 유지한다."
requirements-completed: [UI-01, UI-03, UI-04]
duration: 8 min
completed: 2026-03-30
---

# Phase 1 Plan 04: app shell Summary

**ChatGPT 유사 shell, responsive sidebar, standard header 기반**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-30T14:38:00Z
- **Completed:** 2026-03-30T14:46:00Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- 데스크톱 고정 sidebar와 모바일 좌측 Sheet를 함께 쓰는 shell chrome을 추가했다.
- 현재 route path를 기반으로 헤더 제목, 활성 대화, 설정 active state가 맞춰지도록 root route를 연결했다.
- theme toggle, 모바일 햄버거, 모바일 새 대화 액션을 한국어 접근성 문구와 함께 배치했다.

## Task Commits

Each task was committed atomically:

1. **Task 1: desktop/mobile 공용 shell chrome 컴포넌트를 만든다** - `3e7bdd8` (feat)
2. **Task 2: root route에 shell을 연결하고 responsive navigation interaction을 완성한다** - `96e1243` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `src/components/layout/app-shell.tsx` - sidebar, header, main column을 묶는 shell entry다.
- `src/components/layout/app-sidebar.tsx` - 데스크톱 sidebar와 모바일 Sheet를 같은 콘텐츠 계층으로 렌더링한다.
- `src/components/layout/app-header.tsx` - 제목, 모델 기준 버튼, theme toggle, 모바일 새 대화 액션을 렌더링한다.
- `src/components/layout/theme-toggle.tsx` - dark/light/system 전환 dropdown을 제공한다.
- `src/components/layout/conversation-list.tsx` - deterministic mock 대화 목록과 title lookup helper를 제공한다.
- `src/components/layout/conversation-list-item.tsx` - active state가 있는 대화 목록 항목을 렌더링한다.
- `src/routes/__root.tsx` - shell chrome과 route leaf를 연결하고 route 기반 title을 계산한다.
- `src/stores/ui-store.ts` - mobile sidebar selector와 theme preference cycle action을 확장했다.
- `src/styles/globals.css` - 거의 평면형 다크 surface와 제한된 accent 색 규칙으로 shadcn tokens를 재정의했다.

## Decisions Made

- 모바일 sidebar는 `SidebarProvider` 내부 상태 대신 Zustand store + `Sheet` control로 명시적으로 관리했다.
- route leaf보다 shell chrome을 상위에 두고, leaf는 이후 plan에서 상태 화면만 채우는 구조로 고정했다.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Non-blocking] shadcn 기본 토큰을 UI-SPEC에 맞게 재정의**
- **Found during:** Task 1 (desktop/mobile 공용 shell chrome 컴포넌트를 만든다)
- **Issue:** 기본 shadcn palette가 밝고 보랏빛 편향이 있어 ChatGPT 근접형 neutral dark tone과 충돌했다.
- **Fix:** `src/styles/globals.css`에서 background, panel, accent, sidebar tokens를 neutral dark 기준으로 다시 맞췄다.
- **Files modified:** `src/styles/globals.css`
- **Verification:** `pnpm build`
- **Committed in:** `3e7bdd8`

---

**Total deviations:** 1 auto-fixed (1 non-blocking)
**Impact on plan:** 레이아웃 구조는 그대로 유지했고, surface tone만 UI-SPEC 기준에 맞게 보정했다.

## Issues Encountered

- `src/components/ui/sidebar.tsx`의 `document.cookie` warning은 upstream shadcn primitive 내부 구현으로 계속 남아 있다. 현재 shell 구현에는 직접 영향이 없어서 warning 상태로 유지했다.

## User Setup Required

None.

## Next Phase Readiness

- `/`, `/chat/$conversationId`, `/settings`는 이제 같은 shell chrome 안에서 route별 상태 화면만 채우면 된다.
- theme/sidebar/navigation 구조가 고정돼 Plan 05에서 온보딩 카드와 composer를 바로 얹을 수 있다.

---
*Phase: 01-app-shell-and-interface-foundation*
*Completed: 2026-03-30*
