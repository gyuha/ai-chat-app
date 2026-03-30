---
phase: 02-채팅-핵심
plan: 02
subsystem: ui
tags: [react, react-markdown, remark-gfm, rehype-highlight, highlight.js, shadcn-ui, tailwind, tanstack-router, tanstack-query, testing-library, vitest]

# Dependency graph
requires:
  - phase: 01-데이터-상태-기반
    provides: IndexedDB 설정, 설정 훅, 대화 CRUD 훅, 사이드바 레이아웃
  - phase: 02-채팅-핵심/02-01
    provides: 스트리밍 서비스, useChatStream 훅, useMessages 훅, useFreeModels 훅, handleApiError, Toaster
provides:
  - MessageItem (마크다운 렌더링 + 코드 하이라이팅)
  - MessageList (오토스크롤 + 스트리밍 인디케이터)
  - StreamingIndicator (로딩 스피너)
  - MessageInput (Enter/Shift+Enter + Stop 버튼)
  - ModelSelectorPopover (무료 모델 선택)
  - ChatHeader (제목 + 모델 선택기)
  - ChatPage (전체 채팅 흐름 통합)
  - 라우트 통합 (/chat/$conversationId, /)
affects: [03-대화-관리-설정, 04-사용자-경험-개선]

# Tech tracking
tech-stack:
  added: ["@testing-library/jest-dom@6.9.1"]
  patterns: [useAutoScroll 커스텀 훅, ChatPage 오케스트레이터 패턴, 재시도 버튼 패턴]

key-files:
  created:
    - src/components/chat/MessageItem.tsx
    - src/components/chat/MessageList.tsx
    - src/components/chat/StreamingIndicator.tsx
    - src/components/chat/MessageInput.tsx
    - src/components/chat/ModelSelectorPopover.tsx
    - src/components/chat/ChatHeader.tsx
    - src/components/chat/ChatPage.tsx
    - src/test-setup.ts
    - src/__tests__/message-item.test.tsx
    - src/__tests__/message-list.test.tsx
    - src/__tests__/streaming-indicator.test.tsx
  modified:
    - src/routes/chat/$conversationId.tsx
    - src/routes/index.tsx
    - vite.config.ts
    - package.json

key-decisions:
  - "shadcn/ui Select 대신 Popover 사용 (Popover 컴포넌트 미설치, Select로 충분)"
  - "@testing-library/jest-dom 추가로 DOM 매처(toBeInTheDocument) 사용 가능하게 설정"
  - "test-setup.ts에 jest-dom/vitest 설정 추가"

patterns-established:
  - "useAutoScroll 훅: scrollHeight 기반 100px 임계값, shouldAutoScrollRef 플래그 패턴"
  - "ChatPage 오케스트레이터: 여러 훅 조합 + 로컬 상태 + 콜백으로 전체 채팅 흐름 관리"
  - "재시도 패턴: error 상태 + handleRetry 콜백으로 마지막 사용자 메시지 재전송"

requirements-completed: [CHAT-03, CHAT-06, CHAT-07, CHAT-08, MODL-04]

# Metrics
duration: 10min
completed: 2026-03-30
---

# Phase 2 Plan 02: 채팅 UI & 통합 Summary

**react-markdown + rehype-highlight 마크다운 렌더링, 오토스크롤, Enter/Shift+Enter 입력, 모델 선택, 재시도 버튼을 갖춘 완전한 채팅 UI 페이지**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-30T19:11:09Z
- **Completed:** 2026-03-30T19:21:58Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments
- MessageItem이 user/assistant 역할에 따라 다른 말풍선 스타일로 마크다운 렌더링 (코드블록 구문 강조 포함)
- MessageList에 useAutoScroll 커스텀 훅 구현 (100px 임계값, 사용자 수동 스크롤 시 자동 스크롤 중지)
- MessageInput에서 Enter 전송, Shift+Enter 줄바꿈, 스트리밍 중 Stop 버튼 전환
- ChatPage가 전체 채팅 흐름을 연결: 메시지 저장 -> 스트리밍 -> 마크다운 렌더링 -> 저장 + 재시도
- /chat/$conversationId 라우트가 ChatPage를 렌더링, / 인덱스가 API 키 안내 표시

## Task Commits

Each task was committed atomically:

1. **Task 1: 메시지 렌더링 컴포넌트 (TDD)** - `e1d2257` (test) + `0025184` (feat)
2. **Task 2: 입력/모델 선택/채팅 페이지 + 라우트 통합** - `9248b53` (feat)

## Files Created/Modified
- `src/components/chat/MessageItem.tsx` - user/assistant 말풍선 + ReactMarkdown 마크다운 렌더링
- `src/components/chat/MessageList.tsx` - 메시지 목록 + useAutoScroll 훅 + 스트리밍 인디케이터
- `src/components/chat/StreamingIndicator.tsx` - Loader2 스피너 + "생각 중..." 텍스트
- `src/components/chat/MessageInput.tsx` - textarea 입력 + Enter/Shift+Enter + Stop/Send 버튼
- `src/components/chat/ModelSelectorPopover.tsx` - shadcn/ui Select 기반 무료 모델 선택
- `src/components/chat/ChatHeader.tsx` - 대화 제목 + 모델 선택기 헤더
- `src/components/chat/ChatPage.tsx` - 전체 채팅 흐름 오케스트레이터
- `src/routes/chat/$conversationId.tsx` - ChatPage 라우트 연결
- `src/routes/index.tsx` - API 키 안내 / 새 대화 시작 안내
- `src/test-setup.ts` - @testing-library/jest-dom/vitest 설정
- `vite.config.ts` - test.setupFiles 추가
- `package.json` - @testing-library/jest-dom devDependency 추가
- `src/__tests__/message-item.test.tsx` - MessageItem 유닛 테스트 (7개)
- `src/__tests__/message-list.test.tsx` - MessageList 유닛 테스트 (5개)
- `src/__tests__/streaming-indicator.test.tsx` - StreamingIndicator 유닛 테스트 (4개)

## Decisions Made
- shadcn/ui Select 사용 (Popover 컴포넌트 미설치, 모델 목록 표시에 Select로 충분)
- @testing-library/jest-dom 추가로 DOM 매처 활성화, test-setup.ts에 전역 설정
- TDD RED 커밋 시 vi 미임포트 문제 수정 (vitest에서 vi 명시적 임포트)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] @testing-library/jest-dom 미설치로 toBeInTheDocument 매처 불가**
- **Found during:** Task 1 (TDD GREEN 단계)
- **Issue:** 테스트 파일에서 toBeInTheDocument() 사용 시 "Invalid Chai property" 에러
- **Fix:** `pnpm add -D @testing-library/jest-dom` 설치 + `src/test-setup.ts`에 `import "@testing-library/jest-dom/vitest"` 추가 + vite.config.ts에 setupFiles 설정
- **Files modified:** package.json, vite.config.ts, src/test-setup.ts
- **Verification:** pnpm test 29 passed, pnpm build 성공
- **Committed in:** 0025184 (Task 1 commit)

**2. [Rule 1 - Bug] 테스트 간 DOM 누적으로 getByText 다중 요소 에러**
- **Found during:** Task 1 (TDD GREEN 단계)
- **Issue:** screen.getByText("Hello")가 이전 테스트의 DOM 요소와 충돌하여 "multiple elements found" 에러
- **Fix:** container.querySelector("h1") + textContent 검증으로 변경
- **Files modified:** src/__tests__/message-item.test.tsx
- **Verification:** pnpm test 29 passed
- **Committed in:** 0025184 (Task 1 commit)

**3. [Rule 1 - Bug] TypeScript 빌드 에러 - 사용하지 않는 변수 lastUserMessage**
- **Found during:** Task 2 (빌드 검증)
- **Issue:** handleRetry 함수에서 불필요한 변수 선언
- **Fix:** 사용하지 않는 변수 제거
- **Files modified:** src/components/chat/ChatPage.tsx
- **Verification:** pnpm build 성공
- **Committed in:** 9248b53 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (1 blocking, 2 bug)
**Impact on plan:** 모든 수정이 올바른 동작과 테스트를 위해 필수. 스코프 변경 없음.

## Issues Encountered
- 없음 - 모든 이슈는 deviation rules로 자동 해결

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 채팅 UI 핵심 기능 완료: 메시지 입력, 스트리밍 렌더링, 모델 선택, 재시도
- Phase 3 준비: 대화 제목 자동 생성, 테마 전환, 반응형 개선, 입력 영역 자동 높이 조절
- Phase 4 준비: 점진적 마크다운 렌더링, 코드블록 복사 버튼, Regenerate, 단축키

---
*Phase: 02-채팅-핵심*
*Completed: 2026-03-30*

## Self-Check: PASSED
- All 10 created/modified files verified present
- All 3 commit hashes verified in git log
- SUMMARY file exists at expected path
