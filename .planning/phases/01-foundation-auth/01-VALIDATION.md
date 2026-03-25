---
phase: 01
slug: foundation-auth
status: draft
nyquist_compliant: true
wave_0_complete: true
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
| **Config file** | `backend/test/jest-e2e.json`, `frontend/vitest.config.ts` |
| **Quick run command** | `pnpm --filter backend test -- auth.e2e-spec.ts` and `pnpm --filter frontend test -- src/features/auth/session.test.tsx` |
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
| 01-01-01 | 01 | 0 | AUTH-01 | workspace/bootstrap smoke | `test -f package.json && test -f pnpm-workspace.yaml && test -f backend/package.json && test -f frontend/package.json` | ✅ W0 | ⬜ pending |
| 01-01-02 | 01 | 0 | AUTH-03 | wave-0 asset smoke | `test -f backend/test/auth.e2e-spec.ts && test -f backend/src/auth/auth.service.spec.ts && test -f frontend/vitest.config.ts && test -f frontend/src/features/auth/session.test.tsx` | ✅ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | CHAT-04 | backend build + env grep | `pnpm --filter backend build && rg -n "OPENROUTER_(API_KEY|MODEL)|JWT_(ACCESS|REFRESH)_SECRET" backend/src backend/.env.example` | ✅ plan | ⬜ pending |
| 01-03-02 | 03 | 1 | CHAT-04 | frontend build + secret-boundary grep | `pnpm --filter frontend build && ! rg -n "OPENROUTER_(API_KEY|MODEL)|JWT_(ACCESS|REFRESH)_SECRET" frontend --glob '!**/*.md'` | ✅ plan | ⬜ pending |
| 01-05-01 | 05 | 3 | AUTH-01 | backend service contract | `pnpm --filter backend test -- auth.service.spec.ts` | ✅ W0 | ⬜ pending |
| 01-05-02 | 05 | 3 | AUTH-02 | backend e2e login/signup | `pnpm --filter backend test -- auth.e2e-spec.ts` | ✅ W0 | ⬜ pending |
| 01-06-01 | 06 | 2 | AUTH-03 | frontend session bootstrap | `pnpm --filter frontend test -- src/features/auth/session.test.tsx` | ✅ W0 | ⬜ pending |
| 01-07-02 | 07 | 3 | AUTH-03 | frontend auth routing/forms | `pnpm --filter frontend test -- frontend/tests/auth-routing.test.tsx frontend/tests/auth-forms.test.tsx` | ✅ plan | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements (Wave 0 요구사항)

- [x] `backend/test/auth.e2e-spec.ts` — stubs for AUTH-01, AUTH-02, AUTH-03
- [x] `backend/src/auth/auth.service.spec.ts` — shared service-level auth verification
- [x] `frontend/src/features/auth/session.test.tsx` — bootstrap and redirect behavior
- [x] `frontend/vitest.config.ts` or `vite.config.ts` test section — frontend test framework wiring
- [x] `backend/test/jest-e2e.json` or equivalent Jest config — backend e2e wiring
- [x] workspace/root `test` scripts in `package.json` files — stable commands for planner/executor

---

## Manual-Only Verifications (수동 검증 전용 항목)

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 로그인 성공 후 앱 부트스트랩으로 자연스럽게 전환 | AUTH-02 | 실제 라우트 전환과 pending UX 확인이 필요 | 회원가입 또는 로그인 후 로딩 상태를 확인하고 보호 영역 진입 여부를 수동 확인 |
| 세션 만료 시 즉시 `/login` 으로 이동 | AUTH-03 | 브라우저 쿠키 만료/401 흐름은 통합 시나리오 확인이 필요 | 세션 쿠키를 제거하거나 만료시킨 뒤 보호 라우트 접근 시 `/login` 리다이렉트 여부 확인 |

---

## Validation Sign-Off (검증 승인)

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
