---
phase: 02
slug: conversational-shell-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `vitest` + React Testing Library + server smoke tests |
| **Config file** | `vitest.config.ts` or per-app equivalent to be added in Wave 0 if needed |
| **Quick run command** | `pnpm lint && pnpm typecheck` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm test && pnpm build` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** `pnpm lint && pnpm typecheck`
- **After every plan wave:** `pnpm lint && pnpm typecheck && pnpm test`
- **Before phase completion:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- **Max feedback latency:** 45 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 02-01 | 1 | SHELL-01 | route/layout smoke | `pnpm lint && pnpm typecheck` | ⬜ planned | ⬜ pending |
| 02-02-01 | 02-02 | 2 | MSG-01 | component interaction | `pnpm test` | ⬜ planned | ⬜ pending |
| 02-03-01 | 02-03 | 3 | SHELL-02 / CHAT-01 | integration smoke | `pnpm test && pnpm build` | ⬜ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] web route/component 테스트를 위한 React Testing Library 환경
- [ ] chat list/create/detail API smoke test 또는 동등 server test
- [ ] route redirect / new chat flow를 검증할 최소 테스트 시나리오
- [ ] keyboard interaction 검증용 composer 테스트

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| sidebar의 데스크톱/모바일 동작 | SHELL-01, A11Y-03 | viewport와 focus 이동 확인 필요 | 375px/1024px에서 sidebar open/close와 active nav 확인 |
| onboarding empty state 완성도 | FB-01 | 시각/카피 품질 확인 필요 | `/` 진입 시 examples, CTA, model hint가 모두 보이는지 확인 |
| empty conversation screen 진입 | CHAT-01 | route + mutation 연결 확인 필요 | 새 채팅 생성 후 `/chat/$chatId`에서 empty conversation state 표시 확인 |
| composer UX | MSG-01 | key handling과 auto-resize 확인 필요 | `Enter` 전송, `Shift+Enter` 줄바꿈, max-height 이후 내부 scroll 확인 |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or explicit manual check
- [ ] Route-driven active chat behavior is tested
- [ ] No duplicate chat creation from `/` visits
- [ ] Mobile sheet focus restore verified
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
