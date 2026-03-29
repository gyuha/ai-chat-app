---
phase: 01-foundation-secure-proxy
plan: 03
subsystem: api
tags: [openrouter, streaming, repository, react, tanstack-query]
requires:
  - phase: 01-foundation-secure-proxy
    provides: validated NestJS bootstrap and allowlist API
provides:
  - server-only OpenRouter client seam
  - memory/file chat repository adapters
  - streaming skeleton endpoints
  - dark smoke web shell using internal APIs only
affects: [phase-02, phase-03, phase-06, ui, streaming]
tech-stack:
  added: [react, tanstack-query, tanstack-router, zustand]
  patterns: [server-only-provider-boundary, local-api-helpers, thin-smoke-shell]
key-files:
  created: [apps/server/src/infrastructure/openrouter/openrouter.client.ts, apps/server/src/infrastructure/storage/memory-chat.repository.ts, apps/server/src/infrastructure/storage/file-chat.repository.ts, apps/server/src/modules/streaming/streaming.controller.ts, apps/web/src/routes/index.tsx]
  modified: [apps/web/src/app/providers/index.tsx, apps/web/src/app/router.tsx, apps/web/src/lib/api/index.ts]
key-decisions:
  - "브라우저는 `/api/v1/*`만 호출하고 OpenRouter upstream URL을 직접 알지 못한다."
  - "Phase 1 web UI는 제품형 shell이 아니라 내부 API smoke path에 집중한다."
patterns-established:
  - "서버 측 외부 API 호출은 OpenRouterClient seam 뒤에 둔다."
  - "저장소는 interface + memory/file adapter 구조로 유지한다."
requirements-completed: [SET-04, PLAT-01]
duration: 30min
completed: 2026-03-29
---

# Phase 1 Plan 03 Summary

**OpenRouter 프록시 경계, 저장소 seam, 스트리밍 skeleton, 내부 API 전용 web smoke shell을 연결했다**

## Accomplishments

- `OpenRouterClient` 추상화로 서버 전용 upstream 경계를 만들었다.
- `ChatRepository` 인터페이스와 memory/file adapter를 추가해 추후 영속화 교체 지점을 고정했다.
- `messages/stream`, `regenerate/stream` skeleton 엔드포인트와 다크 smoke UI를 연결했다.

## Files Created or Modified

- `apps/server/src/infrastructure/openrouter/openrouter.client.ts` - OpenRouter 헤더/기본 URL seam
- `apps/server/src/modules/chats/chats.repository.ts` - 저장소 인터페이스
- `apps/server/src/infrastructure/storage/*.ts` - memory/file adapter
- `apps/server/src/modules/streaming/*` - SSE skeleton 응답
- `apps/web/src/lib/api/index.ts` - 내부 API 헬퍼
- `apps/web/src/routes/index.tsx` - health/models smoke shell
- `apps/web/src/components/ui/sidebar.tsx` - dark shell sidebar foundation

## Decisions Made

- UI는 `ui-ux-pro-max` 기준으로 dark conversational foundation, visible focus, sidebar-first information architecture를 유지한다.
- smoke shell은 완성형 채팅 UI를 흉내내지 않고, 내부 API 경계 증명에 필요한 최소 정보만 노출한다.

## Issues Encountered

- 최초 런타임 스모크에서 `/api/v1/models`가 500을 반환해 Nest DI 경계를 재정리했다.
- dev 서버 검증 중 `messages/stream` skeleton을 실제 SSE 응답으로 확인해 다음 phase의 stream parser 작업 기준선을 확보했다.

## Next Phase Readiness

- Phase 2는 현재 sidebar/provider/router 기반 위에서 실제 conversational shell을 확장하면 된다.
- Phase 3는 이미 존재하는 streaming route 계약에 맞춰 클라이언트 parser와 message lifecycle만 추가하면 된다.
