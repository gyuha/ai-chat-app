---
phase: 03
slug: streaming-chat-experience
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `vitest` + React Testing Library + Nest service/controller tests |
| **Config file** | existing web/server Vitest setup + any stream parser test config needed |
| **Quick run command** | `pnpm lint && pnpm typecheck` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm test && pnpm build` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** `pnpm lint && pnpm typecheck`
- **After every plan wave:** `pnpm lint && pnpm typecheck && pnpm test`
- **Before phase completion:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 03-01 | 1 | MSG-02 | server/parser unit + contract smoke | `pnpm test -- --runInBand` | ⬜ planned | ⬜ pending |
| 03-02-01 | 03-02 | 2 | MSG-03, MSG-05 | component interaction | `pnpm test` | ⬜ planned | ⬜ pending |
| 03-03-01 | 03-03 | 3 | MSG-04, REND-01, REND-02 | renderer/integration smoke | `pnpm test && pnpm build` | ⬜ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] stream event parser unit tests
- [ ] server streaming service/controller contract test
- [ ] stop/abort UI interaction test
- [ ] markdown/code block rendering and copy action test

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| token-by-token assistant rendering 체감 | MSG-02 | 실제 지연/시각 피드백 확인 필요 | prompt 전송 후 placeholder, 첫 토큰, delta 누적이 자연스러운지 확인 |
| stop generating 후 partial 유지 | MSG-03, MSG-05 | stream race와 UX 확인 필요 | 응답 중 stop 클릭 후 텍스트 유지, 상태 변경, 재전송 가능 여부 확인 |
| regenerate 흐름 | MSG-04 | 마지막 turn 치환 UX 확인 필요 | 응답 완료 후 regenerate 실행 시 마지막 assistant 응답만 다시 생성되는지 확인 |
| markdown/code/table 반응형 | REND-01, REND-02 | 모바일 overflow와 dark readability 확인 필요 | 375px/768px/1024px에서 heading, list, table, code copy UI 확인 |
| screen reader status summary | A11Y-04 foundation | 비동기 카피 품질 확인 필요 | `aria-live`에 장문 delta가 아닌 짧은 상태 요약만 들어가는지 확인 |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or explicit manual check
- [ ] Stream parser handles chunk-split event frames
- [ ] Abort cleans up fetch reader and UI state
- [ ] No duplicate optimistic/persisted messages remain after completion
- [ ] Markdown/code surface does not create page-level horizontal scroll
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
