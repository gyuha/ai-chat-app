# Phase 2: 인증 시스템 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 02-auth-system
**Mode:** auto (--auto flag)
**Areas discussed:** Token strategy, Token storage, Auth API, Password policy, Auth UI flow, Module structure, Frontend auth state

---

## Token Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Access only (long-lived) | 단일 토큰, 간단하지만 보안 취약 | |
| Access + Refresh (dual) | 액세스 토큰(15분) + 리프레시 토큰(7일) | ✓ |
| Session-based | 서버 세션, CSRF 보호 필요 | |

**Auto-selected:** Access + Refresh (dual) — 업계 표준, 보안/UX 균형

## Token Storage

| Option | Description | Selected |
|--------|-------------|----------|
| localStorage | 간단하지만 XSS에 취약 | |
| httpOnly cookie (refresh) + memory (access) | XSS 방지, 보안 권장 | ✓ |
| httpOnly cookie (both) | CSRF 보호 필요 | |

**Auto-selected:** httpOnly cookie (refresh) + memory (access) — 보안 권장

## Auth UI Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Separate pages (/login, /register) | 깔끔한 분리, ChatGPT 패턴 | ✓ |
| Modal overlay | 인라인 경험 | |
| Single page with tabs | 간단하지만 확장성 제한 | |

**Auto-selected:** Separate pages — ChatGPT 패턴, 확장성

## Password Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Min 8 chars, no complexity rules | 현대적 UX (NIST 권장) | ✓ |
| Min 8 chars + complexity | 전통적 접근 | |
| Min 12 chars | 높은 보안 | |

**Auto-selected:** Min 8 chars, no complexity rules — NIST 기반 현대적 UX

## Auto-Resolved

All 4 gray areas auto-selected with recommended defaults (--auto mode).

---

*Phase: 02-auth-system*
*Discussion logged: 2026-03-29*
