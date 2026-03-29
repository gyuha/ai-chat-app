# Phase 2: Conversational Shell UI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 02-Conversational Shell UI
**Areas discussed:** shell 정보 구조, route/chat 진입 흐름, empty state, composer 상호작용, data 연결 경계

---

## Shell 정보 구조

| Option | Description | Selected |
|--------|-------------|----------|
| desktop 고정 sidebar + mobile sheet | ChatGPT 계열 정보 구조를 가장 안정적으로 재해석 | ✓ |
| desktop collapse 우선 | 기능은 많지만 초기 shell 복잡도가 높아진다 | |
| top-nav 중심 1열 구조 | phase 요구사항의 sidebar 중심 IA와 맞지 않는다 | |

**User's choice:** `[auto] desktop 고정 sidebar + mobile sheet`
**Notes:** `ui-ux-pro-max`의 sidebar/provider/trigger 패턴을 그대로 활용하는 쪽이 Phase 2 목적과 가장 잘 맞는다.

---

## Route / chat 진입 흐름

| Option | Description | Selected |
|--------|-------------|----------|
| `/`는 최근 chat redirect 또는 onboarding empty state | 첫 진입과 재방문 흐름을 모두 자연스럽게 처리 | ✓ |
| `/` 진입 시 항상 새 chat 자동 생성 | 빠르지만 중복 chat 생성과 의도치 않은 write가 생긴다 | |
| `/`를 항상 고정 landing으로 사용 | chat product처럼 느껴지지 않고 active chat 복귀가 느리다 | |

**User's choice:** `[auto] redirect or onboarding root`
**Notes:** `새 채팅` 버튼이 명시적 create action을 갖고, route param이 active chat의 단일 기준이 된다.

---

## Empty state

| Option | Description | Selected |
|--------|-------------|----------|
| action + examples + model hint 조합 | blank state를 완성도 있게 보이게 하고 시작 비용을 낮춘다 | ✓ |
| 짧은 카피 1줄 + 버튼 1개 | 구현은 빠르지만 제품 완성도가 낮다 | |
| marketing hero 스타일 | app shell phase와 어울리지 않고 정보 밀도가 어긋난다 | |

**User's choice:** `[auto] action + examples + model hint`
**Notes:** `ui-ux-pro-max` empty state guidance를 채택. onboarding root와 empty conversation은 톤을 공유하되 역할을 분리한다.

---

## Composer 상호작용

| Option | Description | Selected |
|--------|-------------|----------|
| multiline textarea + Enter 전송 + Shift+Enter 줄바꿈 | 가장 익숙하고 chat 도메인과 맞다 | ✓ |
| 단일 input + 버튼 전송 | 긴 프롬프트와 멀티라인 요구를 충족하지 못한다 | |
| Ctrl/Cmd+Enter 전송 | power-user 친화적이지만 기본 기대와 다르다 | |

**User's choice:** `[auto] Enter send / Shift+Enter newline`
**Notes:** 최대 6줄 auto-resize, 이후 내부 스크롤. Stop 버튼 자리는 남기되 실제 기능은 Phase 3로 넘긴다.

---

## Data 연결 경계

| Option | Description | Selected |
|--------|-------------|----------|
| 최소 chats REST API를 같이 추가 | sidebar/list/detail/new chat 흐름을 실제 데이터로 연결할 수 있다 | ✓ |
| web에서 mock 상태만 사용 | 일시적으로는 빠르지만 route/query 구조를 다시 갈아엎게 된다 | |
| Phase 4까지 list/detail API 미루기 | 현재 phase 요구사항을 만족할 수 없다 | |

**User's choice:** `[auto] 최소 chats REST API 추가`
**Notes:** OpenRouter나 streaming은 건드리지 않고, `list/create/detail`까지만 연결한다.

---

## the agent's Discretion

- example prompt 클릭 시 draft fill 또는 즉시 전송 방식
- icon set의 구체 선택
- list item secondary metadata 표현

## Deferred Ideas

- desktop sidebar collapse polish
- streaming controls
- markdown renderer
- settings dialog
