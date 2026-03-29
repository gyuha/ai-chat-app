---
phase: 01-foundation-secure-proxy
plan: 02
subsystem: api
tags: [nestjs, zod, config, health, models]
requires:
  - phase: 01-foundation-secure-proxy
    provides: monorepo foundation and shared contracts
provides:
  - validated NestJS bootstrap
  - /api/v1/health endpoint
  - /api/v1/models endpoint from allowlist
affects: [phase-03, phase-04, api, settings]
tech-stack:
  added: [nestjs, zod]
  patterns: [global-core-module, validated-env-config, contract-driven-endpoints]
key-files:
  created: [apps/server/src/config/env.schema.ts, apps/server/src/modules/health/health.controller.ts, apps/server/src/modules/models/models.service.ts, apps/server/src/shared/core.module.ts]
  modified: [apps/server/src/main.ts, apps/server/src/app.module.ts, packages/contracts/src/index.ts]
key-decisions:
  - "APP_CONFIG와 저장소/클라이언트 경계는 CoreModule에서 글로벌로 제공한다."
  - "모델 목록은 OpenRouter 호출 없이 allowlist만으로 응답한다."
patterns-established:
  - "컨트롤러는 raw env를 직접 읽지 않는다."
  - "Nest DI가 필요한 클래스는 런타임 import를 유지한다."
requirements-completed: [PLAT-02, PLAT-03]
duration: 25min
completed: 2026-03-29
---

# Phase 1 Plan 02 Summary

**검증된 환경설정과 `/api/v1` 기준선 위에 health/models API를 올렸다**

## Accomplishments

- Zod 기반 env schema와 파싱 계층을 추가해 서버가 잘못된 설정으로 조용히 부팅되지 않게 했다.
- `/api/v1/health`와 `/api/v1/models`를 shared contract 기반으로 노출했다.
- `CoreModule`로 설정 토큰과 인프라 경계를 묶어 이후 streaming/chat 기능이 같은 주입 경로를 재사용하게 했다.

## Files Created or Modified

- `apps/server/src/main.ts` - CORS와 `/api/v1` global prefix 설정
- `apps/server/src/config/env.schema.ts` - 필수 env 검증
- `apps/server/src/config/app.config.ts` - allowlist 파싱과 typed config 생성
- `apps/server/src/modules/health/*` - 서버 상태 응답
- `apps/server/src/modules/models/*` - allowlist 기반 모델 응답
- `apps/server/src/shared/core.module.ts` - 글로벌 설정/저장소/클라이언트 제공

## Decisions Made

- `OPENROUTER_MODEL_ALLOWLIST`는 문자열 env에서 파싱하되, 컨트롤러에는 정제된 `ModelOption[]`만 전달한다.
- Nest DI 메타데이터가 필요한 서비스는 `import type` 자동 수정을 적용하지 않는다.

## Issues Encountered

- `APP_CONFIG`가 루트 모듈에만 있어 feature module에서 주입되지 않는 문제를 `CoreModule`로 해결했다.
- `useImportType` 자동 수정이 `ModelsController` 주입 메타데이터를 깨뜨려, 명시적 `@Inject(ModelsService)`로 고정했다.

## Next Phase Readiness

- 프론트엔드는 안정적인 health/models 엔드포인트를 바로 사용할 수 있다.
- 모델 설정 UI는 `/api/v1/models`를 기준으로 Phase 4에서 확장 가능하다.
