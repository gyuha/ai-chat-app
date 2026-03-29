# Phase 1: Foundation & Secure Proxy - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 01-Foundation & Secure Proxy
**Areas discussed:** 워크스페이스 구조, 백엔드 API 경계, 스트리밍 계약, 저장소 seam, 최소 프론트 foundation

---

## 워크스페이스 구조

| Option | Description | Selected |
|--------|-------------|----------|
| `pnpm workspace` 모노레포 | `apps/web`, `apps/server`, `packages/contracts`, `packages/config`로 분리 | ✓ |
| 프론트/백엔드 별도 repo | 초기 분리가 빠르지만 공통 타입/명령 관리 비용 증가 | |
| 단일 app 디렉터리 | 시작은 쉽지만 확장성과 경계 관리가 약함 | |

**User's choice:** `[auto] pnpm workspace 모노레포`
**Notes:** 추천 기본값. 공통 타입과 동시 개발 속도에 가장 유리하다.

---

## 백엔드 API 경계

| Option | Description | Selected |
|--------|-------------|----------|
| `health/models/chats/streaming` 모듈 분리 | 보안 프록시와 이후 채팅 기능 확장에 가장 자연스럽다 | ✓ |
| `proxy` 단일 모듈 | 초기 구현은 빠르지만 후속 phase에서 분해 비용이 생긴다 | |
| web-first mock 후 서버 추가 | 현재 phase의 보안 목표와 맞지 않는다 | |

**User's choice:** `[auto] health/models/chats/streaming 모듈 분리`
**Notes:** 추천 기본값. Phase 2, 3, 4에서 재구성이 덜 필요하다.

---

## 스트리밍 계약

| Option | Description | Selected |
|--------|-------------|----------|
| POST + `text/event-stream` | message body 유지와 streaming UX를 함께 만족 | ✓ |
| GET SSE | query-string 한계와 regenerate/input payload 확장성이 약함 | |
| chunked JSON fetch | 구현 가능하지만 이벤트 의미가 덜 명확하다 | |

**User's choice:** `[auto] POST + text/event-stream`
**Notes:** 추천 기본값. abort, regenerate, future metadata 이벤트 추가에 유리하다.

---

## 저장소 seam

| Option | Description | Selected |
|--------|-------------|----------|
| `memory` + `file` adapter 동시 스캐폴드 | 로컬 개발성과 이후 DB 전환을 모두 잡는다 | ✓ |
| memory only | 빠르지만 Phase 4 이후 구조 재작업 위험이 크다 | |
| file only | 단순하지만 테스트와 future DB seam 설명력이 약하다 | |

**User's choice:** `[auto] memory + file adapter`
**Notes:** 추천 기본값. repository interface를 Phase 1에서 고정하기 좋다.

---

## 최소 프론트 foundation

| Option | Description | Selected |
|--------|-------------|----------|
| app shell smoke path만 구현 | provider/router/theme/API smoke path까지만 포함 | ✓ |
| 실제 sidebar/chat shell까지 구현 | 사용자 가치가 있으나 이 phase의 핵심 목표를 흐린다 | |
| web은 나중에 시작 | 백엔드 smoke test만 가능하고 integration 감각이 떨어진다 | |

**User's choice:** `[auto] app shell smoke path만 구현`
**Notes:** `ui-ux-pro-max` 기준으로 shadcn `SidebarProvider`, dark mode token, focus-visible 규칙만 foundation에 포함하고 실제 shell 완성은 Phase 2로 미룬다.

---

## the agent's Discretion

- 정확한 패키지 버전 pinning
- contracts package 파일 분할
- health payload 세부 필드

## Deferred Ideas

None.
