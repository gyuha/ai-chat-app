---
phase: 02-conversational-shell-ui
plan: 01
subsystem: ui
tags: [react, tanstack-router, shell, sidebar, theme]
requires:
  - phase: 01-foundation-secure-proxy
    provides: sidebar provider foundation and internal API smoke path
provides:
  - route-driven conversational shell scaffold
  - desktop sidebar and mobile sheet navigation shell
  - dark theme tokens and layout constraints for chat surfaces
affects: [phase-02, phase-03, ui]
tech-stack:
  added: [testing-library, jsdom]
  patterns: [shared-root-shell, mobile-sidebar-sheet, theme-token-layout]
key-files:
  created: [apps/web/src/components/shell/app-shell.tsx, apps/web/src/components/shell/app-sidebar.tsx, apps/web/src/components/ui/button.tsx, apps/web/src/routes/chat/$chatId.tsx]
  modified: [apps/web/src/routes/__root.tsx, apps/web/src/routes/index.tsx, apps/web/src/components/ui/sidebar.tsx, apps/web/src/styles/index.css]
key-decisions:
  - "desktop는 고정 sidebar, mobile은 sheet로 분리했다."
  - "root shell이 sidebar와 route outlet을 함께 감싼다."
patterns-established:
  - "모든 chat 화면은 AppShell 아래에서 렌더링된다."
  - "sidebar trigger와 mobile overlay는 SidebarProvider에서 제어한다."
requirements-completed: [SHELL-01, SHELL-03]
duration: 30min
completed: 2026-03-29
---

# Phase 2 Plan 01 Summary

**smoke 화면을 실제 conversational app shell과 `/chat/$chatId` route scaffold로 교체했다**

## Accomplishments

- root shell을 도입해 sidebar, mobile trigger, main pane 구조를 공통 레이아웃으로 고정했다.
- dark OLED 톤과 읽기 폭 규칙, focus ring, mobile-safe spacing을 스타일 계층에 반영했다.
- TanStack Router에 실제 chat route를 추가해 후속 데이터/streaming phase가 같은 틀을 재사용하게 했다.

## Files Created or Modified

- `apps/web/src/components/shell/app-shell.tsx` - 전체 app shell
- `apps/web/src/components/shell/app-sidebar.tsx` - sidebar navigation UI
- `apps/web/src/components/ui/sidebar.tsx` - mobile sheet/trigger 포함 sidebar foundation
- `apps/web/src/routes/chat/$chatId.tsx` - chat route scaffold
- `apps/web/src/styles/index.css` - theme tokens와 shell layout rules

## Issues Encountered

- 없음. Phase 1 provider/router foundation을 확장하는 방향으로 무리 없이 전환됐다.

## Next Phase Readiness

- empty conversation, composer, chat data 연결은 현재 shell 위에서 바로 구현 가능하다.
