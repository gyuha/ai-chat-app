# Phase 3: Streaming Chat Experience - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 03-Streaming Chat Experience
**Areas discussed:** 스트림 transport, 메시지 lifecycle, stop/regenerate UX, markdown/code rendering, 상태 경계

---

## Stream transport

| Option | Description | Selected |
|--------|-------------|----------|
| `POST + text/event-stream + fetch parser` | 기존 API 설계와 현재 SSE skeleton을 그대로 확장할 수 있다 | ✓ |
| `GET + EventSource` | regenerate/message body 전달이 awkward하고 POST 제약과 맞지 않는다 | |
| WebSocket | 현재 phase 범위 대비 과하다 | |

**User's choice:** `[auto] POST SSE + fetch parser`
**Notes:** 서버는 raw upstream chunk를 그대로 넘기지 않고 내부 표준 이벤트로 정규화한다.

---

## Message lifecycle

| Option | Description | Selected |
|--------|-------------|----------|
| optimistic user append + assistant placeholder | 즉각 반응성과 stream feedback을 함께 준다 | ✓ |
| submit 후 spinner만 표시 | 채팅 제품 체감이 떨어지고 긴 대기처럼 느껴진다 | |
| stream 완료 후 한 번에 assistant 표시 | 요구사항과 정면 충돌 | |

**User's choice:** `[auto] optimistic user + assistant placeholder`
**Notes:** 첫 토큰 전에는 skeleton/status row를 보여주고, 사용자가 하단 근처일 때만 auto-scroll을 유지한다.

---

## Stop / regenerate controls

| Option | Description | Selected |
|--------|-------------|----------|
| composer action slot에서 send/stop 전환 | 시선 이동이 적고 chat 제품 관성에 맞다 | ✓ |
| 별도 floating stop 버튼 | 시각적 노이즈가 커진다 | |
| regenerate를 모든 assistant turn에 제공 | 현재 phase 범위를 넘고 상태 관리가 커진다 | |

**User's choice:** `[auto] composer slot stop + 마지막 turn regenerate`
**Notes:** abort 후 partial text는 유지하고 상태만 stopped로 남긴다.

---

## Markdown / code rendering

| Option | Description | Selected |
|--------|-------------|----------|
| `react-markdown + remark-gfm` + custom code block | 구현 현실성과 읽기 품질의 균형이 좋다 | ✓ |
| raw HTML render | 보안/스타일 제어가 나쁘다 | |
| plain text 유지 | Phase 3 요구사항을 충족하지 못한다 | |

**User's choice:** `[auto] markdown renderer + custom code block copy`
**Notes:** shadcn block은 그대로 쓰지 않고 chat reading surface에 맞춰 수정한다.

---

## State ownership

| Option | Description | Selected |
|--------|-------------|----------|
| Query는 persisted data, Zustand는 stream session UI | 기존 프로젝트 원칙과 정확히 맞는다 | ✓ |
| stream draft까지 전부 Query cache에 저장 | UI 세션 상태와 서버 상태가 섞인다 | |
| local store 단독 운영 | 완료 후 server truth와 어긋나기 쉽다 | |

**User's choice:** `[auto] Query persisted / Zustand transient stream`
**Notes:** route param은 계속 active conversation의 단일 기준으로 유지한다.

---

## the agent's Discretion

- delta batching granularity
- placeholder microcopy
- code copy success feedback 표현 방식

## Deferred Ideas

- per-turn regenerate menu
- title event surface
- advanced overflow polish
