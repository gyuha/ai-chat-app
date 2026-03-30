---
phase: 01
slug: app-shell-and-interface-foundation
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-30
---

# Phase 01 — Validation Strategy

> Phase 1 완료 후 Nyquist validation gap을 역추적해 테스트 인프라와 자동 검증을 보강한 결과다.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + Testing Library |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && pnpm build` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test && pnpm build`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | UI-01, UI-02, UI-04 | integration | `pnpm test` | ✅ | ✅ green |
| 01-01-02 | 01 | 1 | UI-02, UI-04 | integration | `pnpm test` | ✅ | ✅ green |
| 01-02-01 | 02 | 2 | UI-01, UI-03, UI-04 | integration | `pnpm test` | ✅ | ✅ green |
| 01-02-02 | 02 | 2 | UI-01, UI-03, UI-04 | integration | `pnpm test` | ✅ | ✅ green |
| 01-03-01 | 03 | 3 | UI-01, UI-02 | integration | `pnpm test` | ✅ | ✅ green |
| 01-03-02 | 03 | 3 | UI-03, UI-04 | unit/integration | `pnpm test` | ✅ | ✅ green |
| 01-04-01 | 04 | 4 | UI-01, UI-03, UI-04 | integration | `pnpm test` | ✅ | ✅ green |
| 01-04-02 | 04 | 4 | UI-01, UI-03, UI-04 | integration | `pnpm test` | ✅ | ✅ green |
| 01-05-01 | 05 | 5 | UI-02, UI-04 | component | `pnpm test` | ✅ | ✅ green |
| 01-05-02 | 05 | 5 | UI-01, UI-02, UI-03 | integration | `pnpm test` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `vitest.config.ts` — jsdom + alias 기반 테스트 런너 구성
- [x] `src/test/setup.ts` — matchMedia, scroll API, jest-dom setup
- [x] `src/test/test-utils.ts` — viewport/theme/store reset helper
- [x] `src/components/layout/app-shell.test.tsx` — shell/mobile sidebar interaction 검증
- [x] `src/components/chat/phase-one-surfaces.test.tsx` — 한국어 state surface 및 settings theme action 검증
- [x] `src/providers/theme-provider.test.tsx` — dark default + system-aware theme 검증
- [x] `package.json` — `pnpm test` 실행 스크립트와 test dependencies 추가

---

## Manual-Only Verifications

All phase behaviors have automated verification.

---

## Validation Audit 2026-03-30

| Metric | Count |
|--------|-------|
| Gaps found | 4 |
| Resolved | 4 |
| Escalated | 0 |

### Gap Notes

- 초기 상태에는 test framework, config, test files가 전혀 없어서 UI-01~UI-04가 모두 `MISSING`이었다.
- validation 과정에서 `AppShell`이 `SidebarProvider` 없이 `Sidebar`를 렌더링하는 런타임 버그가 발견되어 수정했다.
- 모바일 `Sheet`에 `Description`이 없어 발생하던 접근성 경고도 함께 보강했다.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-30
