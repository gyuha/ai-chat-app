---
phase: 02
slug: conversation-persistence
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

> 한국어 우선 안내: 이 템플릿은 `VALIDATION` 자산을 한국어 기준으로 먼저 읽을 수 있게 정리합니다. 아래 영문 원문은 upstream 동기화와 세부 의미 보존을 위해 함께 유지합니다.


# Phase 02 — 검증 전략 (Validation Strategy)

> 실행 중 피드백 샘플링을 위한 phase별 validation 계약입니다.

---

## Test Infrastructure (테스트 인프라)

| Property | Value |
|----------|-------|
| **Framework** | jest 30.x + vitest 4.x |
| **Config file** | `backend/jest.config.ts`, `backend/test/jest-e2e.json`, `frontend/vitest.config.ts` |
| **Quick run command** | `pnpm --filter backend test -- conversation && pnpm --filter frontend test -- conversation` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate (샘플링 빈도)

- **After every task commit:** Run `pnpm --filter backend test -- conversation && pnpm --filter frontend test -- conversation`
- **After every plan wave:** Run `pnpm test`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map (작업별 검증 맵)

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | CONV-01 | unit/e2e | `pnpm --filter backend test -- conversation` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | CONV-02 | unit/e2e | `pnpm --filter backend test -- conversation` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | CONV-04 | unit/e2e | `pnpm --filter backend test -- conversation` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | CONV-01 | component/integration | `pnpm --filter frontend test -- conversation` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | CONV-02 | component/integration | `pnpm --filter frontend test -- conversation` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 2 | CONV-04 | integration | `pnpm --filter frontend test -- conversation` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements (Wave 0 요구사항)

- [ ] `backend/src/conversations/*.spec.ts` — conversation service/controller ownership tests for CONV-01, CONV-02, CONV-04
- [ ] `backend/test/conversations.e2e-spec.ts` — authenticated create/list/isolation API tests
- [ ] `frontend/tests/conversation-home.test.tsx` — first-entry auto-create and title-only list rendering checks
- [ ] `frontend/src/features/conversations/*.test.ts` — query/mutation bootstrap behavior where logic is extracted

---

## Manual-Only Verifications (수동 검증 전용 항목)

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| first authenticated visit feels immediate and does not visually flicker through multiple empty states | CONV-01 | automated tests can prove calls/render states but not perceived smoothness | log in with a fresh user, land on `/`, confirm exactly one `새 대화` appears and the UI settles without duplicate entries |

---

## Validation Sign-Off (검증 승인)

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
