---
phase: 01
slug: foundation-auth
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

> 한국어 우선 안내: 이 템플릿은 `VALIDATION` 자산을 한국어 기준으로 먼저 읽을 수 있게 정리합니다. 아래 영문 원문은 upstream 동기화와 세부 의미 보존을 위해 함께 유지합니다.


# Phase 01 — 검증 전략 (Validation Strategy)

> 실행 중 피드백 샘플링을 위한 phase별 validation 계약입니다.

---

## Test Infrastructure (테스트 인프라)

| Property | Value |
|----------|-------|
| **Framework** | Backend: Jest 30.3.0 + `@nestjs/testing` 11.1.17; Frontend: Vitest 4.1.1 + Testing Library |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `pnpm --filter backend test -- auth` and `pnpm --filter frontend vitest run auth` |
| **Full suite command** | `pnpm -r test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate (샘플링 빈도)

- **After every task commit:** Run `pnpm --filter backend test -- auth` and `pnpm --filter frontend vitest run auth`
- **After every plan wave:** Run `pnpm -r test`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map (작업별 검증 맵)

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 0 | AUTH-01 | workspace/bootstrap smoke | `test -f package.json && test -f pnpm-workspace.yaml && test -f backend/package.json && test -f frontend/package.json` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 0 | CHAT-04 | static config grep | `pnpm -r exec rg -n "OPENROUTER_(API_KEY|MODEL)" frontend backend` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | AUTH-01 | backend e2e + service unit | `pnpm --filter backend test -- auth.e2e-spec.ts -t signup` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | AUTH-02 | backend e2e | `pnpm --filter backend test -- auth.e2e-spec.ts -t login` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | AUTH-03 | backend e2e | `pnpm --filter backend test -- auth.e2e-spec.ts -t session` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 1 | AUTH-03 | frontend integration | `pnpm --filter frontend vitest run src/features/auth` | ❌ W0 | ⬜ pending |
| 01-03-02 | 03 | 1 | CHAT-04 | frontend static grep | `pnpm --filter frontend exec rg -n "OPENROUTER_(API_KEY|MODEL)|JWT_(ACCESS|REFRESH)_SECRET" src .` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements (Wave 0 요구사항)

- [ ] `backend/test/auth.e2e-spec.ts` — stubs for AUTH-01, AUTH-02, AUTH-03
- [ ] `backend/src/auth/auth.service.spec.ts` — shared service-level auth verification
- [ ] `frontend/src/features/auth/session.test.tsx` — bootstrap and redirect behavior
- [ ] `frontend/vitest.config.ts` or `vite.config.ts` test section — frontend test framework wiring
- [ ] `backend/test/jest-e2e.json` or equivalent Jest config — backend e2e wiring
- [ ] workspace/root `test` scripts in `package.json` files — stable commands for planner/executor

---

## Manual-Only Verifications (수동 검증 전용 항목)

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 로그인 성공 후 앱 부트스트랩으로 자연스럽게 전환 | AUTH-02 | 실제 라우트 전환과 pending UX 확인이 필요 | 회원가입 또는 로그인 후 로딩 상태를 확인하고 보호 영역 진입 여부를 수동 확인 |
| 세션 만료 시 즉시 `/login` 으로 이동 | AUTH-03 | 브라우저 쿠키 만료/401 흐름은 통합 시나리오 확인이 필요 | 세션 쿠키를 제거하거나 만료시킨 뒤 보호 라우트 접근 시 `/login` 리다이렉트 여부 확인 |

---

## Validation Sign-Off (검증 승인)

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
