---
phase: 02-api-key-and-settings-management
plan: 04
subsystem: ui
tags: [settings, alert-dialog, select, system-prompt, theme]
requires:
  - phase: 02-02
    provides: settings service, free-model query, validation mutation
provides:
  - 실제 API 키 관리 settings panel
  - 기본 모델 Select와 시스템 프롬프트 즉시 저장 UI
  - API 키 삭제 confirmation dialog
affects: [settings, onboarding, models]
tech-stack:
  added: []
  patterns: [saved-key-helper-copy, destructive-confirmation-dialog, immediate-settings-save]
key-files:
  created: [src/components/ui/alert-dialog.tsx, src/components/ui/select.tsx]
  modified: [src/components/settings/settings-panel-placeholder.tsx, src/hooks/use-free-models-query.ts, src/lib/settings-service.ts, src/components/chat/phase-one-surfaces.test.tsx]
key-decisions:
  - "저장된 API 키는 다시 노출하지 않고 saved-state helper 문구로만 표시한다."
  - "invalid default model cleanup은 free models query가 끝나는 즉시 settings cache를 동기화한다."
patterns-established:
  - "settings panel은 key/status/model/prompt/theme를 각각 독립 panel로 유지한다."
  - "삭제는 `AlertDialog`로 확인하고 route 이동 없이 현재 화면 상태만 갱신한다."
requirements-completed: [SETT-02, SETT-04, DATA-02]
duration: 14 min
completed: 2026-03-31
---

# Phase 2 Plan 04: settings surfaces Summary

**`/settings`에서 API 키 교체·삭제와 기본 모델·시스템 프롬프트 저장을 모두 처리하는 실제 관리 화면**

## Performance

- **Duration:** 14 min
- **Started:** 2026-03-31T01:14:00Z
- **Completed:** 2026-03-31T01:28:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- 저장된 key 상태, 교체용 input, validation status, 삭제 dialog를 포함한 실제 API 키 관리 panel을 구현했다.
- saved key가 있을 때만 활성화되는 기본 모델 Select와 invalid default fallback 문구를 연결했다.
- 글로벌 시스템 프롬프트와 테마 panel을 실제 store/action에 연결해 즉시 저장 구조로 바꿨다.

## Task Commits

Each task was committed atomically:

1. **Task 1: API 키 관리 panel과 삭제 확인 다이얼로그를 구현한다** - `5936614` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `src/components/settings/settings-panel-placeholder.tsx` - key/model/system prompt/theme를 실제 data-aware settings panel로 바꿨다.
- `src/components/ui/alert-dialog.tsx` - shadcn-style destructive confirmation dialog wrapper를 추가했다.
- `src/components/ui/select.tsx` - 기본 모델 선택에 사용할 shadcn-style select wrapper를 추가했다.
- `src/hooks/use-free-models-query.ts` - invalid default model cleanup 후 settings cache를 같이 갱신한다.
- `src/lib/settings-service.ts` - explicit settings helper 구성을 유지하고 cleanup semantics를 명확히 했다.
- `src/components/chat/phase-one-surfaces.test.tsx` - settings panel이 query provider 아래에서 동작하도록 Phase 1 surface 테스트를 보정했다.

## Decisions Made

- 삭제 버튼은 현재 route를 유지하고 success status만 갱신해 사용자가 같은 화면에서 다음 설정을 계속 바꿀 수 있게 했다.
- 기본 모델 helper text는 key 없음, invalid default cleanup, 선택된 모델명을 한 자리에서만 보여주게 단순화했다.

## Deviations from Plan

None.

## Issues Encountered

- invalid default model을 지운 뒤 helper text가 바로 바뀌지 않아 free models query에서 settings cache 동기화 단계를 추가했다.

## User Setup Required

None.

## Next Phase Readiness

- settings UI가 실제 persistence와 연결됐으므로 Phase 3의 대화별 모델 선택과 global defaults 우선순위 구현으로 이어질 수 있다.
- key replacement/delete semantics가 route 이동 없이 고정됐다.

---
*Phase: 02-api-key-and-settings-management*
*Completed: 2026-03-31*
