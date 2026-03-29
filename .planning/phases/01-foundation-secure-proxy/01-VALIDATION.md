---
phase: 01
slug: foundation-secure-proxy
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `vitest` + `@nestjs/testing` |
| **Config file** | `none — Wave 0 installs` |
| **Quick run command** | `pnpm lint && pnpm typecheck` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm lint && pnpm typecheck`
- **After every plan wave:** Run `pnpm lint && pnpm typecheck && pnpm test`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01-01 | 0 | PLAT-01 | lint/typecheck | `pnpm lint && pnpm typecheck` | ❌ W0 | ⬜ pending |
| 01-02-01 | 01-02 | 1 | PLAT-02 | api smoke | `pnpm test -- --runInBand` | ❌ W0 | ⬜ pending |
| 01-03-01 | 01-03 | 1 | SET-04 | integration smoke | `pnpm test -- --runInBand` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `apps/web/src/**/*.test.*` 또는 동등 smoke test 파일 — web smoke path 확인
- [ ] `apps/server/src/**/*.spec.ts` 또는 동등 test 파일 — health/models smoke test
- [ ] `vitest.config.*` 또는 각 앱 test 설정 — test infra 준비
- [ ] `pnpm test` root script — 전체 test 진입점 통일

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| web이 내부 `/api/v1/models`만 소비하는지 확인 | PLAT-01 | 네트워크 호출 확인이 필요 | dev 실행 후 브라우저 네트워크 탭에서 OpenRouter 직접 호출이 없는지 확인 |
| dark token과 focus-visible 기본 적용 확인 | PLAT-01 | 시각적 규칙 확인 필요 | web smoke shell 실행 후 포커스 이동과 dark class 적용 확인 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
