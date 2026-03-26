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
| **Framework** | Jest e2e for backend + Vitest for frontend |
| **Config file** | `backend/test/jest-e2e.json`, `backend/jest.config.ts`, `frontend/vitest.config.ts` |
| **Quick run command** | `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts && pnpm --dir frontend test -- conversation-routing.test.tsx` |
| **Full suite command** | `pnpm --dir backend test:e2e && pnpm --dir backend test && pnpm --dir frontend test && pnpm --dir frontend typecheck` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate (샘플링 빈도)

- **After every task commit:** Run `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts` or `pnpm --dir frontend test -- conversation-routing.test.tsx`
- **After every plan wave:** Run `pnpm --dir backend test:e2e && pnpm --dir frontend test`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map (작업별 검증 맵)

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | CONV-01 | backend e2e | `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | CONV-04 | backend e2e | `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | CONV-02 | frontend integration | `pnpm --dir frontend test -- conversation-routing.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | CONV-01 | backend e2e + frontend integration | `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts && pnpm --dir frontend test -- conversation-routing.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements (Wave 0 요구사항)

- [ ] `backend/test/conversations.e2e-spec.ts` — stubs for CONV-01, CONV-02, CONV-04
- [ ] `frontend/tests/conversation-routing.test.tsx` — shared frontend coverage for empty-list bootstrap and title-only rendering
- [ ] Shared backend test DB bootstrap for `Conversation` and `Message` tables — current auth e2e setup creates only `User`
- [ ] Conversation API fixture helpers for two-user ownership tests — current frontend/backend tests only model auth flows

---

## Manual-Only Verifications (수동 검증 전용 항목)

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Empty-state first visit immediately shows the auto-created `새 대화` as selected in the protected shell | CONV-01 | Requires observing route bootstrap, query timing, and selected-state UX together | Log in with a fresh account, land on `/`, verify there is no CTA gate, and confirm one `새 대화` item is selected automatically |

---

## Validation Sign-Off (검증 승인)

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 45s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
