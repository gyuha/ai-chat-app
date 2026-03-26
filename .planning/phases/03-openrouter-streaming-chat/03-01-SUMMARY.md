---
phase: 03-openrouter-streaming-chat
plan: "01"
subsystem: api
tags: [nestjs, prisma, openrouter, sse, e2e]
requires:
  - phase: 02-conversation-persistence
    provides: ownership-scoped conversations and persisted message history
provides:
  - authenticated conversation detail contract with chronological messages
  - backend OpenRouter streaming proxy wired to the fixed model env vars
  - single-write final assistant persistence after successful stream completion
affects: [03-openrouter-streaming-chat, backend, conversations, frontend-streaming]
tech-stack:
  added: []
  patterns: [ownership-scoped conversation detail reads, SSE relay with final-write assistant persistence]
key-files:
  created:
    - backend/src/conversations/openrouter-chat.service.ts
    - backend/src/conversations/dto/send-message.dto.ts
    - backend/src/conversations/dto/conversation-message.dto.ts
    - backend/src/conversations/dto/conversation-detail.dto.ts
    - backend/test/conversations-chat.e2e-spec.ts
  modified:
    - backend/src/conversations/conversations.controller.ts
    - backend/src/conversations/conversations.service.ts
    - backend/src/conversations/conversations.module.ts
key-decisions:
  - "OpenRouter 호출은 conversations 전용 service로 분리해 controller는 인증된 route orchestration만 담당한다."
  - "사용자 메시지는 upstream 호출 전에 저장하고 assistant 메시지는 stream 성공 종료 후 한 번만 저장한다."
patterns-established:
  - "Conversation detail reads return title plus messages ordered by createdAt asc."
  - "Streaming chat endpoints parse SSE frames, ignore provider comment frames, and persist a single accumulated assistant reply."
requirements-completed: [CHAT-01, CHAT-03]
duration: 2 min
completed: 2026-03-26
---

# Phase 3 Plan 01: OpenRouter streaming backend Summary

**Authenticated OpenRouter chat streaming with ownership-safe conversation detail reads and single-write final assistant persistence**

## Performance (수행 결과)

- **Duration:** 2 min
- **Started:** 2026-03-26T11:57:30Z
- **Completed:** 2026-03-26T11:59:43Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments (주요 성과)
- `POST /conversations/:id/chat` 계약을 e2e 테스트로 고정하고 foreign access `404` 동작을 검증했다.
- active conversation detail 응답을 `title + chronological messages` 형태로 확장했다.
- OpenRouter SSE relay를 전용 service로 분리하고 successful completion 시 assistant 메시지를 정확히 한 번만 저장하도록 구현했다.

## Task Commits (작업 커밋)

1. **Task 1: Add backend chat contract tests and active-conversation detail shape** - `e03c77b` (test), `d7b8eb8` (feat)
2. **Task 2: Implement the OpenRouter streaming proxy and final assistant persistence** - `788069a` (feat)

**Plan metadata:** pending final docs commit

## Files Created/Modified (생성/수정 파일)
- `backend/test/conversations-chat.e2e-spec.ts` - streaming chat contract, persistence, and ownership e2e coverage
- `backend/src/conversations/dto/send-message.dto.ts` - authenticated chat send request shape
- `backend/src/conversations/dto/conversation-message.dto.ts` - persisted message response contract
- `backend/src/conversations/dto/conversation-detail.dto.ts` - active conversation detail response contract
- `backend/src/conversations/conversations.controller.ts` - detail route and authenticated chat endpoint wiring
- `backend/src/conversations/conversations.service.ts` - ownership-safe detail/history reads and message persistence helpers
- `backend/src/conversations/openrouter-chat.service.ts` - OpenRouter proxy call, SSE parsing, delta relay, and final assistant write
- `backend/src/conversations/conversations.module.ts` - streaming proxy provider registration

## Decisions Made (결정 사항)
- OpenRouter env access는 controller가 아니라 backend-only service에만 두어 provider credential 노출 경로를 줄였다.
- upstream comment frame은 relay하지 않고 assistant text delta만 client로 흘려 frontend contract를 단순화했다.

## Deviations from Plan (계획 대비 변경 사항)

없음 - 계획대로 실행.

## Issues Encountered (이슈)

없음

## User Setup Required (사용자 설정 필요 여부)

없음 - 외부 서비스 수동 설정이 필요하지 않음.

## Next Phase Readiness (다음 phase 준비 상태)

Phase 3 frontend plan은 이제 authenticated chat endpoint와 canonical conversation detail contract를 바로 소비할 수 있다.
남은 concern은 실제 OpenRouter production 응답 변형에 대비한 frontend-side streaming/error presentation뿐이다.

## Self-Check

PASSED

- Found summary file: `.planning/phases/03-openrouter-streaming-chat/03-01-SUMMARY.md`
- Found task commits: `e03c77b`, `d7b8eb8`, `788069a`
- Stub scan across owned backend files returned no matches
