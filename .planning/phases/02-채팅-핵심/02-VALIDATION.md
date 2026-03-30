---
phase: 02
slug: 채팅-핵심
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-31
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts (exists) |
| **Quick run command** | `pnpm test --run` |
| **Full suite command** | `pnpm test --run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test --run`
- **After every plan wave:** Run `pnpm test --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | MODL-01 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | CHAT-01 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | CHAT-02 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | CHAT-03 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | CHAT-06 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 1 | CHAT-07, CHAT-08 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | MODL-02 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 2 | MODL-03, MODL-04 | unit | `pnpm test --run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for OpenRouter API client functions
- [ ] Test stubs for SSE stream parser
- [ ] Test stubs for model list fetch

*Existing Vitest infrastructure covers framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 실시간 스트리밍 UI 렌더링 | CHAT-01 | SSE 스트리밍은 실제 API 필요 | 브라우저에서 메시지 전송 후 토큰 단위 렌더링 확인 |
| 오토스크롤 동작 | CHAT-06 | 스크롤 위치 감지는 DOM 의존 | 스트리밍 중 스크롤 동작 직접 확인 |
| 모델 선택 UI | MODL-01 | 외부 API 응답 의존 | 무료 모델 목록 로드 후 선택 동작 확인 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
