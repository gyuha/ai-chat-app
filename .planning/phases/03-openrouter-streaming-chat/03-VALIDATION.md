---
phase: 03
slug: openrouter-streaming-chat
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

> 한국어 우선 안내: 이 템플릿은 `VALIDATION` 자산을 한국어 기준으로 먼저 읽을 수 있게 정리합니다. 아래 영문 원문은 upstream 동기화와 세부 의미 보존을 위해 함께 유지합니다.


# Phase 03 — 검증 전략 (Validation Strategy)

> 실행 중 피드백 샘플링을 위한 phase별 validation 계약입니다.

---

## Test Infrastructure (테스트 인프라)

| Property | Value |
|----------|-------|
| **Framework** | Jest e2e for backend + Vitest for frontend |
| **Config file** | `backend/test/jest-e2e.json`, `backend/jest.config.ts`, `frontend/vitest.config.ts` |
| **Quick run command** | `pnpm --dir backend test:e2e -- --runInBand conversations-chat.e2e-spec.ts && pnpm --dir frontend test -- chat-streaming.test.tsx` |
| **Full suite command** | `pnpm --dir backend test:e2e && pnpm --dir backend test && pnpm --dir frontend test && pnpm --dir frontend typecheck` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate (샘플링 빈도)

- **After every task commit:** Run `pnpm --dir backend test:e2e -- --runInBand conversations-chat.e2e-spec.ts` or `pnpm --dir frontend test -- chat-streaming.test.tsx`
- **After every plan wave:** Run `pnpm --dir backend test:e2e && pnpm --dir frontend test`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map (작업별 검증 맵)

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | CHAT-01 | backend e2e | `pnpm --dir backend test:e2e -- --runInBand conversations-chat.e2e-spec.ts` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | CHAT-03 | backend e2e/integration | `pnpm --dir backend test:e2e -- --runInBand conversations-chat.e2e-spec.ts` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | CHAT-02 | frontend integration | `pnpm --dir frontend test -- chat-streaming.test.tsx` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | CHAT-02, CHAT-03 | frontend integration + typecheck | `pnpm --dir frontend test -- chat-streaming.test.tsx && pnpm --dir frontend typecheck` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements (Wave 0 요구사항)

- [ ] `backend/test/conversations-chat.e2e-spec.ts` — stubs for CHAT-01 and CHAT-03 with mocked OpenRouter SSE chunks
- [ ] `frontend/tests/chat-streaming.test.tsx` — incremental rendering, disabled send during stream, and post-completion refresh coverage
- [ ] Upstream mock helper for OpenRouter SSE payloads and mid-stream error payloads
- [ ] Conversation detail/messages fixture once message reads are exposed to the chat panel

---

## Manual-Only Verifications (수동 검증 전용 항목)

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 실제 브라우저에서 assistant 응답이 자연스럽게 점진적으로 늘어나고, 스트리밍 중 입력창은 유지되지만 추가 전송은 막힌다 | CHAT-02 | 체감 품질과 상호작용 타이밍은 수동 확인이 더 정확함 | 로그인 후 대화를 선택하고 메시지를 보내서 응답이 토큰 단위로 늘어나는지, 입력은 가능하지만 재전송은 막히는지 확인 |

---

## Validation Sign-Off (검증 승인)

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
