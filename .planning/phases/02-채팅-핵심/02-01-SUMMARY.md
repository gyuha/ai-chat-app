---
phase: 02-채팅-핵심
plan: 01
subsystem: api, database, ui
tags: [openrouter, sse, streaming, fetch, readablestream, abortcontroller, tanstack-query, dexie, sonner, toast, vitest]

# Dependency graph
requires:
  - phase: 01-데이터-상태-기반
    provides: Dexie.js DB 스키마, useSetting 훅, SidebarLayout, TanStack Query 설정
provides:
  - OpenRouter API 서비스 (streamChatCompletion, fetchFreeModels)
  - SSE 스트리밍 상태 관리 훅 (useChatStream)
  - 메시지 CRUD 훅 (useMessages, useAddMessage)
  - 무료 모델 목록 조회 훅 (useFreeModels)
  - API 오류 처리 유틸리티 (handleApiError)
  - Toaster 컴포넌트 (shadcn/ui + sonner)
affects: [02-02-PLAN, Phase 3 대화 관리]

# Tech tracking
tech-stack:
  added: [react-markdown, remark-gfm, rehype-highlight, highlight.js, sonner, jsdom, @testing-library/react]
  patterns: [fetch + ReadableStream SSE, AbortController 스트림 제어, TanStack Query 캐싱, shadcn/ui Toaster 래핑]

key-files:
  created:
    - src/services/openrouter-api.ts
    - src/lib/error-handler.ts
    - src/hooks/use-messages.ts
    - src/hooks/use-free-models.ts
    - src/hooks/use-chat-stream.ts
    - src/components/ui/sonner.tsx
    - src/__tests__/openrouter-api.test.ts
    - src/__tests__/error-handler.test.ts
    - src/__tests__/use-chat-stream.test.ts
  modified:
    - src/routes/__root.tsx
    - vite.config.ts
    - package.json

key-decisions:
  - "vitest/config에서 defineConfig 가져오기로 tsc -b + vitest test 환경 충돌 해결"
  - "SSE 파싱에 외부 라이브러리 없이 fetch + ReadableStream 직접 구현 (AbortController 호환성)"
  - "useChatStream에서 useState로 스트리밍 상태 관리 (Zustand 대신, 채팅 페이지 내 로컬 상태)"

patterns-established:
  - "SSE 스트리밍: fetch POST + ReadableStream + buffer 기반 라인 파싱 패턴"
  - "스트리밍 훅: AbortController ref + useCallback sendMessage + stopStreaming 패턴"
  - "오류 처리: HTTP 상태 코드별 한국어 토스트 분기 (429/401/기타)"
  - "무료 모델 캐싱: TanStack Query staleTime 30분 + gcTime 1시간"

requirements-completed: [CHAT-01, CHAT-02, MODL-01, MODL-02, MODL-03]

# Metrics
duration: 10min
completed: 2026-03-30
---

# Phase 2 Plan 01: API & 데이터 레이어 Summary

**OpenRouter API SSE 스트리밍 서비스 + AbortController 중단 제어 + 메시지/모델 훅 + 한국어 오류 토스트 처리**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-30T18:53:53Z
- **Completed:** 2026-03-30T19:04:46Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- OpenRouter API SSE 스트리밍: fetch POST + ReadableStream으로 토큰 단위 실시간 수신, 버퍼 기반 라인 파싱
- AbortController 기반 스트림 중단: 사용자 의도적 중단(AbortError)은 에러로 처리하지 않음
- 무료 모델 목록: pricing "0" 필터링, 이름순 정렬, TanStack Query 30분 캐시
- API 오류 분기 처리: 429 Rate Limit, 401 인증 실패, 일반 오류 한국어 토스트
- 메시지 CRUD: Dexie.js 기반 useMessages/useAddMessage 훅
- Toaster: shadcn/ui + sonner 다크모드 호환, __root.tsx 전역 마운트

## Task Commits

Each task was committed atomically (TDD: RED -> GREEN):

1. **Task 1: 패키지 설치 + API 서비스 + 오류 처리 + 훅 + Toaster 설정** - `9446cf5` (test), `44b02b6` (feat)
2. **Task 2: useChatStream 스트리밍 훅 구현** - `59e2a3c` (test), `bdf3147` (feat)

## Files Created/Modified
- `src/services/openrouter-api.ts` - OpenRouter API 호출 (streamChatCompletion, fetchFreeModels)
- `src/lib/error-handler.ts` - API 오류 분류 및 한국어 토스트 (handleApiError)
- `src/hooks/use-messages.ts` - 메시지 CRUD 훅 (useMessages, useAddMessage)
- `src/hooks/use-free-models.ts` - 무료 모델 목록 조회 훅 (useFreeModels)
- `src/hooks/use-chat-stream.ts` - SSE 스트리밍 상태 관리 훅 (useChatStream)
- `src/components/ui/sonner.tsx` - shadcn/ui Toaster 컴포넌트
- `src/routes/__root.tsx` - Toaster 전역 마운트 추가
- `src/__tests__/openrouter-api.test.ts` - fetchFreeModels 필터링/정렬/오류 테스트 (4개)
- `src/__tests__/error-handler.test.ts` - handleApiError 분기 테스트 (4개)
- `src/__tests__/use-chat-stream.test.ts` - useChatStream 상태/중단/에러 테스트 (5개)
- `vite.config.ts` - Vitest jsdom 환경 설정, vitest/config defineConfig 전환
- `package.json` - react-markdown, remark-gfm, rehype-highlight, highlight.js, sonner, jsdom, @testing-library/react 추가

## Decisions Made
- vitest/config에서 defineConfig 가져오기: tsc -b와 vitest test 설정 충돌 해결 (vite의 defineConfig에 test 속성 인식 불가)
- SSE 파싱 직접 구현: @microsoft/fetch-event-source 등 라이브러리 없이 fetch + ReadableStream으로 충분 (AbortController 호환성, POST 지원)
- useChatStream 상태 관리: Zustand 대신 useState 사용 (스트리밍 상태가 채팅 페이지 내 로컬 범위)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] @testing-library/react + jsdom 패키지 설치**
- **Found during:** Task 2 (useChatStream 테스트 작성)
- **Issue:** renderHook 사용을 위한 @testing-library/react 및 DOM 환경(jsdom)이 설치되지 않음
- **Fix:** pnpm add -D @testing-library/react jsdom 설치, vite.config.ts에 jsdom 환경 설정 추가
- **Files modified:** package.json, vite.config.ts
- **Verification:** 테스트 13개 통과, 빌드 성공
- **Committed in:** 59e2a3c (Task 2 RED commit)

**2. [Rule 1 - Bug] vitest defineConfig 타입 충돌 수정**
- **Found during:** Task 2 (pnpm build 실행 시)
- **Issue:** vite의 defineConfig에 test 속성 추가 시 tsc -b에서 TS2769 에러 발생
- **Fix:** `import { defineConfig } from "vitest/config"`로 변경하여 Vitest 확장 타입 사용
- **Files modified:** vite.config.ts
- **Verification:** tsc -b + vite build 성공
- **Committed in:** bdf3147 (Task 2 GREEN commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** 테스트 인프라 설정에 필요한 변경. 기능 구현에는 영향 없음.

## Issues Encountered
- 없음 - 모든 기능이 계획대로 구현됨

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 02-02(채팅 UI & 통합)에서 이 플랜의 모든 훅과 서비스를 소비하여 UI 컴포넌트 구현 가능
- useChatStream: sendMessage로 스트리밍 시작, stopStreaming으로 중단
- useFreeModels: 모델 선택 UI에서 사용
- handleApiError: 오류 발생 시 UI 컴포넌트에서 호출
- Toaster: 이미 __root.tsx에 마운트되어 모든 라우트에서 toast 사용 가능

---
*Phase: 02-채팅-핵심*
*Completed: 2026-03-30*

## Self-Check: PASSED

All 10 created files verified present. All 4 task commits verified in git history.
