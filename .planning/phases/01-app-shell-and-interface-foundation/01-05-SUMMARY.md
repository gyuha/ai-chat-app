---
phase: 01-app-shell-and-interface-foundation
plan: 05
subsystem: ui
tags: [onboarding, empty-state, settings, composer, korean-ui]
requires:
  - phase: 01-04
    provides: shell chrome, responsive navigation, theme state
provides:
  - API 키 미등록 상태의 중앙 온보딩 카드
  - 빈 대화 메시지 영역과 2~4행 composer shell
  - 한국어 설정 placeholder 패널
affects: [ui, onboarding, chat, settings]
tech-stack:
  added: []
  patterns: [state-surface-routes, shell-contained-chat-screen, korean-copy-first]
key-files:
  created: [src/components/chat/api-key-onboarding-card.tsx, src/components/chat/chat-empty-state.tsx, src/components/chat/message-pane-placeholder.tsx, src/components/chat/chat-composer.tsx, src/components/settings/settings-panel-placeholder.tsx]
  modified: [src/routes/index.tsx, src/routes/chat.$conversationId.tsx, src/routes/settings.tsx]
key-decisions:
  - "빈 상태는 예시 프롬프트 없이 행동 유도와 설정 진입만 제공한다."
  - "설정 화면은 실제 Dexie/OpenRouter 로직 대신 다음 phase를 위한 패널 구조만 제공한다."
patterns-established:
  - "route leaf는 shell 내부에서 상태 surface만 교체한다."
  - "한국어 카피는 버튼, 설명, placeholder까지 일관되게 유지한다."
requirements-completed: [UI-01, UI-02, UI-03, UI-04]
duration: 6 min
completed: 2026-03-30
---

# Phase 1 Plan 05: state surfaces Summary

**온보딩, 빈 상태, 설정 placeholder를 shell 안에 연결**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-30T14:47:00Z
- **Completed:** 2026-03-30T14:53:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- `/` 경로에 API 키 미등록 상태의 중앙 온보딩 카드를 배치했다.
- `/chat/$conversationId` 경로에 빈 상태 메시지 영역과 자동 확장 composer shell을 연결했다.
- `/settings` 경로에 API 키, 기본 모델, 시스템 프롬프트, 테마 패널을 한국어 placeholder로 구성했다.

## Task Commits

Each task was committed atomically:

1. **Task 1: 한국어 온보딩 카드, 빈 상태, composer shell 컴포넌트를 만든다** - `2d76565` (feat)
2. **Task 2: route leaves를 실제 상태 화면과 settings placeholder에 연결한다** - `206c56d` (feat)

**Plan metadata:** pending

## Files Created/Modified

- `src/components/chat/api-key-onboarding-card.tsx` - API 키 입력 카드와 인라인 상태 메시지 슬롯을 제공한다.
- `src/components/chat/chat-empty-state.tsx` - 예시 프롬프트 없이 행동 유도 중심의 빈 상태를 제공한다.
- `src/components/chat/message-pane-placeholder.tsx` - 현재 대화 요약과 skeleton, 빈 상태를 결합한 메시지 패널을 제공한다.
- `src/components/chat/chat-composer.tsx` - 2행 시작, 최대 4행 높이의 composer shell을 제공한다.
- `src/components/settings/settings-panel-placeholder.tsx` - 설정의 네 가지 핵심 영역을 panel 구조로 정리한다.
- `src/routes/index.tsx` - 온보딩 카드를 루트 화면에 연결한다.
- `src/routes/chat.$conversationId.tsx` - message pane과 composer를 채팅 route에 연결한다.
- `src/routes/settings.tsx` - 설정 placeholder panel을 settings route에 연결한다.

## Decisions Made

- 빈 대화 화면은 예시 프롬프트 없이 `새 대화 시작`과 `설정 보기` 두 행동만 남겨 밀도를 낮췄다.
- settings route의 theme 패널은 실제 store와 연결해 placeholder 단계에서도 토글 감각을 미리 확인할 수 있게 했다.

## Deviations from Plan

None.

## Issues Encountered

- `src/components/ui/sidebar.tsx`의 `document.cookie` warning은 여전히 남아 있지만, Phase 1 범위에서는 generated primitive 경고 수준으로 유지했다.

## User Setup Required

None.

## Next Phase Readiness

- Phase 2에서 API 키 검증, 저장, 기본 모델 설정 로직을 현재 UI 구조 위에 바로 얹을 수 있다.
- route별 상태 surface가 이미 나뉘어 있어 Dexie/OpenRouter 연결 시 교체 범위가 작다.

---
*Phase: 01-app-shell-and-interface-foundation*
*Completed: 2026-03-30*
