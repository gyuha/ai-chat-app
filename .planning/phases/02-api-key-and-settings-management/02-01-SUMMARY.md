---
phase: 02-api-key-and-settings-management
plan: 01
subsystem: database
tags: [dexie, react-query, indexeddb, testing, settings]
requires:
  - phase: 01-05
    provides: 온보딩 카드, 설정 패널 구조, route surfaces
provides:
  - Dexie 기반 `openrouter-chat-db` settings 저장소
  - 앱 전역 QueryClient provider
  - fake IndexedDB 기반 테스트 bootstrap
affects: [settings, onboarding, models, testing]
tech-stack:
  added: [dexie, @tanstack/react-query, fake-indexeddb]
  patterns: [dexie-settings-store, singleton-query-client, indexeddb-test-reset]
key-files:
  created: [src/lib/app-db.ts, src/providers/app-query-provider.tsx]
  modified: [package.json, pnpm-lock.yaml, src/App.tsx, src/test/setup.ts]
key-decisions:
  - "settings persistence의 단일 source of truth는 Dexie `settings` store로 고정한다."
  - "QueryClient는 singleton으로 두고 테스트마다 cache를 clear한다."
patterns-established:
  - "route/provider 레이어는 AppQueryProvider를 통해 TanStack Query를 공유한다."
  - "Vitest 환경은 fake IndexedDB와 DB reset helper로 실제 Dexie 코드를 검증한다."
requirements-completed: [DATA-02, SETT-02]
duration: 1 min
completed: 2026-03-31
---

# Phase 2 Plan 01: persistence foundation Summary

**Dexie settings 저장소와 singleton Query provider로 Phase 2의 로컬 persistence 기반을 고정**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-30T16:12:30Z
- **Completed:** 2026-03-30T16:13:16Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- `openrouter-chat-db` 이름의 Dexie database와 typed settings key 집합을 추가했다.
- 앱 엔트리에 singleton QueryClient provider를 연결해 이후 settings/models hook이 같은 cache를 재사용할 수 있게 했다.
- 테스트 환경에 `fake-indexeddb/auto`와 DB/query reset을 넣어 Dexie 기반 테스트 준비를 마쳤다.

## Task Commits

Each task was committed atomically:

1. **Task 1: Dexie settings 저장소와 의존성을 추가한다** - `33a60e8` (chore)
2. **Task 2: Query provider와 test bootstrap을 앱 엔트리에 연결한다** - `b77061e` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `package.json` - Dexie, TanStack Query, fake-indexeddb 의존성을 추가했다.
- `pnpm-lock.yaml` - 새 persistence/query/test 의존성 lock 정보를 갱신했다.
- `src/lib/app-db.ts` - `settings` store와 typed settings helper를 제공한다.
- `src/providers/app-query-provider.tsx` - singleton QueryClient와 reset helper를 제공한다.
- `src/App.tsx` - RouterProvider를 AppQueryProvider로 감싼다.
- `src/test/setup.ts` - fake IndexedDB 초기화와 DB/query cache reset을 테스트 lifecycle에 연결한다.

## Decisions Made

- `openRouterApiKey`, `defaultModelId`, `defaultSystemPrompt` 세 key를 settings store의 최소 기준으로 고정했다.
- Query defaults는 `retry: false`, `refetchOnWindowFocus: false`로 두어 OpenRouter 검증/설정 흐름에서 불필요한 재호출을 피하게 했다.

## Deviations from Plan

None.

## Issues Encountered

- `pnpm add` 중 ignored build scripts 경고가 출력됐지만 기존 workspace 정책 범위였고, build 결과에는 영향을 주지 않았다.

## User Setup Required

None.

## Next Phase Readiness

- 02-02에서 OpenRouter models client와 settings service를 바로 Dexie/Query 기반 위에 올릴 수 있다.
- 이후 route 테스트는 fake IndexedDB bootstrap을 그대로 재사용하면 된다.

---
*Phase: 02-api-key-and-settings-management*
*Completed: 2026-03-31*
