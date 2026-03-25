# Phase 1: Foundation & Auth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 1-Foundation & Auth
**Areas discussed:** Session strategy, workspace structure, auth UX scope, session expiry handling

---

## Session Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| JWT | 토큰 기반 인증으로 새로고침 유지와 API 경계를 설계 | ✓ |
| Cookie session | 서버 세션 중심 인증 | |

**User's choice:** JWT
**Notes:** 인증 상태 유지는 JWT 기반으로 진행한다.

---

## Workspace Structure

| Option | Description | Selected |
|--------|-------------|----------|
| backend + frontend | 백엔드와 프론트엔드를 분리한 2-app 구조 | ✓ |
| apps/web + apps/server 등 다른 workspace naming | 다른 naming 또는 구조 선택 | |

**User's choice:** backend + frontend
**Notes:** 사용자는 분리 구조를 명시적으로 원했고, planner는 이를 기준으로 Phase 1 구조를 잡아야 한다.

---

## Auth UX Scope

| Option | Description | Selected |
|--------|-------------|----------|
| 가입/로그인/로그아웃만 | 최소 인증 흐름만 포함 | ✓ |
| 비밀번호 재설정 포함 | 초기 인증 범위를 더 확장 | |

**User's choice:** 가입/로그인/로그아웃 만
**Notes:** 비밀번호 재설정은 이번 phase 범위에서 제외한다.

---

## Session Expiry Handling

| Option | Description | Selected |
|--------|-------------|----------|
| 즉시 로그인 화면으로 이동 | 만료 시 바로 재인증 유도 | ✓ |
| 안내 후 재로그인 유도 | 메시지/모달을 먼저 표시 | |

**User's choice:** 만료시 즉시 로그인 화면으로
**Notes:** 단순하고 명확한 흐름을 선호한다.

---

## the agent's Discretion

- JWT 저장 매체 세부 선택
- refresh token 도입 여부
- 인증 화면 UI 세부 구성

## Deferred Ideas

- 비밀번호 재설정
- 소셜 로그인 / OAuth

