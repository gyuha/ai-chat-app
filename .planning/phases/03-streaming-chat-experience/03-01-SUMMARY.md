---
phase: 03-streaming-chat-experience
plan: 01
subsystem: api
tags: [nestjs, openrouter, sse, parser, contracts]
requires:
  - phase: 01-foundation-secure-proxy
    provides: secure proxy boundary and contracts package
  - phase: 02-conversational-shell-ui
    provides: route-driven chat detail flow
provides:
  - normalized server stream contract
  - OpenRouter SSE parsing and provider abstraction
  - reusable POST SSE parser on the web
affects: [phase-03, phase-04, api, ui, streaming]
tech-stack:
  added: [react-markdown, remark-gfm]
  patterns: [normalized-stream-events, post-sse-parser, server-owned-provider-mapping]
key-files:
  created: [apps/server/src/modules/streaming/streaming.service.ts, apps/server/src/modules/streaming/dto/create-message.dto.ts, apps/web/src/lib/stream/sse.ts]
  modified: [apps/server/src/infrastructure/openrouter/openrouter.client.ts, apps/server/src/modules/streaming/streaming.controller.ts, apps/web/src/lib/api/index.ts, packages/contracts/src/index.ts]
key-decisions:
  - "OpenRouter raw SSE는 서버에서 정규화하고 브라우저는 내부 stream event만 읽는다."
  - "POST 기반 stream은 fetch + ReadableStream parser로 소비한다."
patterns-established:
  - "stream transport는 provider 포맷과 UI lifecycle을 분리한다."
  - "contracts 패키지가 stream event schema를 web/server 공통 기준으로 가진다."
requirements-completed: [MSG-02]
duration: 30min
completed: 2026-03-30
---

# Phase 3 Plan 01 Summary

**OpenRouter 스트림을 내부 SSE 계약으로 정규화하고 web에 POST parser를 연결했다**

## Accomplishments

- server에 실제 `StreamingService`를 추가해 message/regenerate stream을 normalized event로 방출하게 했다.
- OpenRouter client가 upstream SSE를 읽고 delta chunk만 추출하도록 바꿨다.
- web에 POST SSE parser와 stream API helper를 추가해 UI가 transport를 직접 다룰 수 있게 했다.

## Files Created or Modified

- `apps/server/src/modules/streaming/streaming.service.ts` - stream lifecycle와 persistence orchestration
- `apps/server/src/infrastructure/openrouter/openrouter.client.ts` - upstream SSE parser와 delta extraction
- `apps/web/src/lib/stream/sse.ts` - chunk-safe SSE parser
- `apps/web/src/lib/api/index.ts` - stream endpoint helper
- `packages/contracts/src/index.ts` - stream event contract 확장

## Issues Encountered

- `findLast` 계열 메서드가 현재 TS target과 맞지 않아 수동 reverse/loop helper로 정리했다.

## Next Phase Readiness

- route는 normalized stream event만 받으면 되므로 UI lifecycle 구현이 transport 세부사항에 묶이지 않는다.
