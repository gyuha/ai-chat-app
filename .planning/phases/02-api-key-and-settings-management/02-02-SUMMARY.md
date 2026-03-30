---
phase: 02-api-key-and-settings-management
plan: 02
subsystem: api
tags: [openrouter, settings, react-query, dexie, validation]
requires:
  - phase: 02-01
    provides: Dexie settings store, QueryClient provider, fake IndexedDB bootstrap
provides:
  - OpenRouter `/models` validation client와 free-model filter
  - settings read/write service와 invalid default model cleanup
  - onboarding/settings가 공유하는 validation, settings, free-model hooks
affects: [onboarding, settings, models, testing]
tech-stack:
  added: []
  patterns: [openrouter-models-client, two-state-validation-errors, dexie-query-sync]
key-files:
  created: [src/lib/openrouter-client.ts, src/hooks/use-api-key-validation.ts]
  modified: [src/lib/settings-service.ts, src/hooks/use-settings-query.ts, src/hooks/use-free-models-query.ts]
key-decisions:
  - "OpenRouter 검증은 `/models` 단일 endpoint와 두 가지 오류 범주만 사용한다."
  - "defaultModelId cleanup은 service에서 수행하고 query cache도 같은 흐름에서 갱신한다."
patterns-established:
  - "UI는 validation/save/delete semantics를 hooks layer를 통해서만 사용한다."
  - "브라우저 직접 호출 시 `HTTP-Referer`와 `X-OpenRouter-Title`을 고정 헤더로 보낸다."
requirements-completed: [SETT-03, SETT-04, DATA-02]
duration: 6 min
completed: 2026-03-31
---

# Phase 2 Plan 02: service layer Summary

**OpenRouter 모델 검증, 무료 모델 필터링, settings persistence 규칙을 UI 밖의 service/hook 계층으로 고정**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-31T00:55:00Z
- **Completed:** 2026-03-31T01:01:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- OpenRouter `/models` 호출, 무료 모델 필터링, two-state validation error mapping을 재사용 가능한 client로 분리했다.
- API 키 저장/교체/삭제, 기본 모델/시스템 프롬프트 저장, invalid default model cleanup을 settings service에 모았다.
- onboarding과 settings 화면이 같은 query/service 계층을 공유할 수 있도록 validation, settings, free-model hooks를 만들었다.

## Task Commits

Each task was committed atomically:

1. **Task 1: OpenRouter models client와 API 키 검증 mutation을 만든다** - `e32bec1` (feat)
2. **Task 2: settings read/write service와 free models query를 만든다** - `426f2b1` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `src/lib/openrouter-client.ts` - `/models` 호출, free filter, validation error normalization을 담당한다.
- `src/hooks/use-api-key-validation.ts` - success/invalid_credentials/transient 세 결과를 mutation state로 반환한다.
- `src/lib/settings-service.ts` - settings persistence helpers와 invalid default model cleanup을 제공한다.
- `src/hooks/use-settings-query.ts` - settings snapshot과 save/delete actions를 query layer로 노출한다.
- `src/hooks/use-free-models-query.ts` - saved API key 기반 무료 모델 query와 cleanup cache sync를 담당한다.

## Decisions Made

- empty `data[]`도 invalid credentials로 간주해 잘못된 key와 구조적 실패를 같은 사용자 메시지로 묶었다.
- free models query는 `staleTime: 600000`을 사용해 설정 화면에서 모델 목록 재호출을 줄였다.

## Deviations from Plan

None.

## Issues Encountered

- 초기 helper 초안에 남아 있던 `updateSettings`는 실제 호출 경로와 맞지 않아 제거하고 더 명시적인 action helper들로 정리했다.

## User Setup Required

None.

## Next Phase Readiness

- 02-03과 02-04는 같은 validation/save/delete policy를 hooks layer 위에서 그대로 재사용할 수 있다.
- Phase 3의 모델 선택 UI도 free models query를 바로 이어받을 수 있다.

---
*Phase: 02-api-key-and-settings-management*
*Completed: 2026-03-31*
