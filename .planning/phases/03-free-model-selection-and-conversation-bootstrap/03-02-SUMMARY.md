---
phase: 03-free-model-selection-and-conversation-bootstrap
plan: 02
subsystem: navigation
tags: [sidebar, new-chat, routing, bootstrap]
requires:
  - phase: 03-01
    provides: conversation persistence, draft singleton, query actions
provides:
  - 새 대화 bootstrap action
  - 실제 conversation sidebar 목록
  - 빈 상태 CTA와 sidebar/new-chat 버튼의 공통 흐름
affects: [home, sidebar, navigation]
tech-stack:
  added: []
  patterns: [shared-start-conversation-hook, real-sidebar-list]
key-files:
  created: [src/hooks/use-start-conversation.ts]
  modified: [src/components/layout/new-chat-button.tsx, src/components/chat/chat-empty-state.tsx, src/components/layout/conversation-list.tsx, src/components/layout/conversation-list-item.tsx]
key-decisions:
  - "사이드바, 헤더, 빈 상태의 새 대화 액션은 모두 같은 bootstrap hook을 사용한다."
  - "sidebar는 mock 배열 대신 Dexie conversation metadata를 최신순으로 렌더링한다."
patterns-established:
  - "새 대화 시작은 항상 `/chat/$conversationId`로 이동한다."
  - "draft conversation은 목록에서 `draft · 모델 선택 필요`로 시각 구분한다."
requirements-completed: [CONV-01]
duration: inline session
completed: 2026-03-31
---

# Phase 3 Plan 02: bootstrap Summary

**새 대화 진입점과 sidebar 목록을 실제 대화 데이터에 연결**

## Accomplishments

- `useStartConversation` 훅으로 새 대화 생성/재사용 + route 이동 흐름을 공통화했다.
- home empty state와 sidebar 버튼이 모두 같은 draft bootstrap 정책을 사용하게 했다.
- sidebar 목록을 Dexie conversation metadata 기반 최신순 렌더링으로 교체했다.

## Task Commits

1. **Task 1-2 묶음:** `f9deaee` — `feat(03-02): connect conversation bootstrap`

## Files Created/Modified

- `src/hooks/use-start-conversation.ts` - 새 대화 생성 후 route 이동을 담당한다.
- `src/components/layout/new-chat-button.tsx` - 더 이상 `/` 링크가 아니라 실제 draft 생성 액션을 호출한다.
- `src/components/chat/chat-empty-state.tsx` - 빈 상태 CTA도 동일한 bootstrap action을 재사용한다.
- `src/components/layout/conversation-list.tsx` - real conversation query와 draft label을 사용한다.
- `src/components/layout/conversation-list-item.tsx` - draft 상태 보더 표현을 추가했다.

## Decisions Made

- 새 대화 생성 버튼은 pending 동안 비활성화한다.
- sidebar empty copy는 한국어로 간단하게 유지한다.

## Deviations from Plan

None.

## Next Phase Readiness

- 03-03은 active conversation id를 header selector에 연결할 수 있다.
- 03-04는 이미 만들어진 draft conversation을 body/composer에서 상태별로 표현할 수 있다.

---
*Phase: 03-free-model-selection-and-conversation-bootstrap*
*Completed: 2026-03-31*
