# Phase 3: OpenRouter Streaming Chat - Research

**Researched:** 2026-03-26
**Domain:** OpenRouter chat completion streaming through NestJS to a React conversation shell
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### Composer Submission Behavior
- **D-01:** 메시지 입력창은 `Enter` 로 전송하고 `Shift+Enter` 로 줄바꿈한다.
- **D-02:** 전송 버튼은 보조 수단으로 유지할 수 있지만, 기본 상호작용은 키보드 전송 기준으로 설계한다.

### Input State During Streaming
- **D-03:** assistant 응답이 스트리밍 중이어도 입력창은 계속 활성 상태로 둔다.
- **D-04:** 스트리밍 중에는 추가 전송만 막고, 사용자가 다음 메시지를 미리 입력하는 것은 허용한다.

### the agent's Discretion
- 스트리밍 중 assistant 말풍선의 시각 표현, 커서/로더 스타일, 전송 버튼의 disabled 표현은 기존 최소형 UI 패턴에 맞춰 the agent가 정할 수 있다.
- OpenRouter 스트리밍을 어떤 전송 프로토콜로 브라우저에 중계할지(SSE, chunked fetch 등)는 현재 NestJS/React 구조에 가장 자연스러운 방식으로 the agent가 정할 수 있다.
- user 메시지와 assistant 메시지의 저장 타이밍 세부 구현은 Phase 목표(CHAT-01/02/03)를 만족하는 선에서 the agent가 설계할 수 있다.
- 스트리밍 오류 시 카피 문구와 미세한 복구 UI는 표준적이고 명확한 방향으로 the agent가 정할 수 있다.

### Deferred Ideas (OUT OF SCOPE)
- 모델 선택 UI — 서버 고정 무료 모델 정책 때문에 이번 phase 범위 밖
- 대화 히스토리 복원 UX 정교화 — Phase 4 범위
- 파일 첨부, 멀티모달 입력, 프롬프트 프리셋 — v1 범위 밖
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CHAT-01 | 로그인한 사용자가 메시지를 보내면 서버가 OpenRouter 무료 모델에 요청을 전달할 수 있다 | Authenticated NestJS chat endpoint, backend-only `OPENROUTER_API_KEY`/`OPENROUTER_MODEL`, request shaping via OpenRouter chat completions API |
| CHAT-02 | 사용자가 assistant 응답을 스트리밍 형태로 볼 수 있다 | OpenRouter `stream: true`, backend chunk relay, frontend `fetch()` stream reader or SSE-compatible parsing path |
| CHAT-03 | 스트리밍이 완료되면 assistant 응답이 해당 대화 히스토리에 저장된다 | Persist user message before proxy call, accumulate assistant chunks server-side, save final assistant message after successful completion, invalidate/refetch conversation detail |
</phase_requirements>

## Summary

Phase 3 should extend the Phase 2 architecture, not replace it. The backend already has the right trust boundary and persistence model: authenticated routes, `@CurrentUser()` extraction, `Conversation`/`Message` schema, and ownership-safe conversation queries. The frontend already has a protected conversation shell and credentialed API client. The missing piece is a streaming chat path that keeps OpenRouter secrets server-side while giving the React route live tokens and ending in a persisted assistant message.

The strongest plan shape is: add a dedicated backend chat endpoint under the conversations domain, proxy to OpenRouter `POST /api/v1/chat/completions` with `stream: true`, parse SSE on the server, forward only assistant deltas to the browser, and persist the final assistant message after the stream terminates successfully. On the frontend, do not try to force streaming through React Query's normal query lifecycle. Use a mutation to start the request, consume the `ReadableStream` directly for incremental UI updates, and then invalidate/refetch the selected conversation once the assistant message is saved.

The highest-risk mistakes are transport mismatch and persistence timing. OpenRouter streams as SSE. Mid-stream provider failures arrive as SSE events with `finish_reason: "error"` while the HTTP status remains `200`, so the proxy must inspect chunks, not only response status. Persisting assistant output on every token is unnecessary write amplification for SQLite and complicates failure recovery. Persist user message up front, accumulate assistant content in memory during the stream, then write one assistant message at the end if the stream finishes successfully.

**Primary recommendation:** Plan Phase 3 around an authenticated NestJS POST chat proxy that relays OpenRouter SSE chunks to the browser, with frontend `fetch` stream consumption and final assistant-message persistence after successful completion.

## Project Constraints (from AGENTS.md)

- OpenRouter API 키는 서버 환경 변수로만 관리하고 클라이언트 번들에 포함하면 안 된다.
- 무료 모델 1종을 서버에서 고정한다. 사용자별 모델 선택 UI는 만들지 않는다.
- 데이터 저장소는 SQLite를 사용한다.
- 인증은 이메일/비밀번호 로그인만 제공한다.
- v1 완료 기준은 로그인 후 채팅 성공과 히스토리 조회 가능 여부다.
- 파일 편집 전에는 GSD workflow 산출물과 실행 컨텍스트를 동기화해야 한다.
- 현재 코드베이스의 기존 패턴을 우선 따른다.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| OpenRouter Chat Completions API | current docs on 2026-03-26 | upstream model inference and streaming | already aligned with the product requirement and supports `stream: true` SSE on one stable endpoint |
| NestJS | 11.1.17 | authenticated backend proxy/controller/service layer | already established in repo, matches existing auth + conversations module structure |
| Prisma + SQLite | 7.5.0 / 3.x | final message persistence and ownership-safe data access | already in use, `Conversation` and `Message` tables exist from Phase 2 |
| React | 19.2.4 | chat composer and streaming message UI | current app runtime and existing protected conversation shell |
| @tanstack/react-query | 5.95.2 | mutation kickoff and cache invalidation after completion | already used for session bootstrap and conversation list state |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| rxjs | 7.8.2 | optional NestJS `@Sse()` observable response path | use only if you intentionally expose a GET SSE route; not required if POST streaming is done with raw response |
| eventsource-parser | latest recommended in OpenRouter docs | robust SSE chunk parsing | use on the backend if native line-splitting becomes brittle; recommended over hand-rolled ad hoc parsing |
| Jest | 30.2.0 in repo | backend e2e/integration coverage for proxy and persistence | use for authenticated chat contract tests under `backend/test/` |
| Vitest | 4.1.1 | frontend streaming/composer route coverage | use for conversation shell streaming behavior and disabled-send checks |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Backend POST proxy with raw streamed response | NestJS `@Sse()` GET endpoint | `@Sse()` is official, but the current app already uses authenticated POST JSON flows and chat send semantics fit POST better |
| Frontend `fetch()` + `ReadableStream` consumption | browser `EventSource` | `EventSource` only supports GET and custom auth/cookie/error handling is less aligned with the current route shell |
| Final assistant save after stream completion | per-token DB writes | per-token writes add SQLite churn and harder rollback/error semantics for little MVP benefit |
| Manual `fetch` stream lifecycle + query invalidation | React Query query for streaming body | React Query is good for request orchestration and cache updates, but not as the primary token-by-token transport state machine |

**Installation:**
```bash
pnpm --dir backend add eventsource-parser
```

If you choose a simple newline parser over `eventsource-parser`, no new package is required. Research does not show a mandatory dependency here; it is a recommendation to avoid SSE edge cases.

**Version verification:** verified with `npm view` on 2026-03-26.

| Package | Verified Version | Publish/Modified Date |
|---------|------------------|-----------------------|
| @nestjs/core | 11.1.17 | 2026-03-16 |
| @tanstack/react-query | 5.95.2 | 2026-03-23 |
| @tanstack/react-router | 1.168.4 | 2026-03-25 |
| react | 19.2.4 | 2026-03-25 |
| prisma | 7.5.0 | 2026-03-26 |
| @prisma/client | 7.5.0 | 2026-03-26 |
| rxjs | 7.8.2 | 2025-02-22 |

## Architecture Patterns

### Recommended Project Structure
```text
backend/
├── src/
│   ├── conversations/
│   │   ├── dto/
│   │   ├── conversations.controller.ts
│   │   ├── conversations.service.ts
│   │   └── openrouter-chat.service.ts
│   └── config/
└── test/
    └── conversations-chat.e2e-spec.ts

frontend/
├── src/
│   ├── features/
│   │   └── chat/
│   │       ├── api.ts
│   │       ├── stream.ts
│   │       └── types.ts
│   ├── routes/
│   │   └── index.tsx
│   └── components/
│       └── chat/
└── tests/
    └── chat-streaming.test.tsx
```

### Pattern 1: Authenticated POST chat proxy with backend-only OpenRouter secrets
**What:** Add a protected backend chat endpoint that accepts the selected conversation ID and user message, validates ownership, and sends the upstream request to OpenRouter using server env vars.
**When to use:** all chat-send operations in Phase 3.
**Example:**
```ts
// Source: OpenRouter chat completions API docs + existing NestJS controller patterns
@Post(':id/chat')
@UseGuards(JwtAuthGuard)
async chat(
  @CurrentUser() user: SessionUser,
  @Param('id') id: string,
  @Body() dto: SendMessageDto,
  @Res() res: Response,
) {
  await this.conversationsService.assertOwnedConversation(user.id, id);
  return this.openRouterChatService.streamConversation({
    res,
    userId: user.id,
    conversationId: id,
    content: dto.content,
  });
}
```

### Pattern 2: Save user message first, accumulate assistant stream in memory, persist once
**What:** Persist the user message before calling OpenRouter, stream assistant deltas to the client, then save one assistant message after successful completion.
**When to use:** baseline MVP persistence semantics for SQLite.
**Example:**
```ts
// Source: OpenRouter streaming docs (final chunk includes usage, mid-stream error uses finish_reason:error)
const userMessage = await prisma.message.create({
  data: {
    conversationId,
    role: 'user',
    content,
  },
});

let assistantContent = '';

for await (const chunk of upstreamStream) {
  if ('error' in chunk) {
    throw new Error(chunk.error.message);
  }

  const delta = chunk.choices?.[0]?.delta?.content ?? '';
  assistantContent += delta;
  writeDeltaToClient(delta);
}

if (assistantContent.length > 0) {
  await prisma.message.create({
    data: {
      conversationId,
      role: 'assistant',
      content: assistantContent,
    },
  });
}
```

### Pattern 3: Frontend stream reader outside normal query cache lifecycle
**What:** Start chat with a mutation or imperative handler, then consume `response.body.getReader()` and update local streaming UI state incrementally.
**When to use:** the active selected conversation shell in `frontend/src/routes/index.tsx`.
**Example:**
```ts
// Source: OpenRouter streaming docs + browser fetch stream pattern
const response = await fetch(`/api/conversations/${conversationId}/chat`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();
let partial = '';

while (reader) {
  const { value, done } = await reader.read();
  if (done) break;
  partial += decoder.decode(value, { stream: true });
  setStreamingAssistantText((prev) => prev + extractDelta(partial));
}
```

### Pattern 4: Post-completion cache invalidation back into canonical server state
**What:** After successful stream completion, invalidate the selected conversation detail and optionally list queries so the persisted assistant message becomes the canonical rendered state.
**When to use:** once streaming finishes or on recoverable failure cleanup.
**Example:**
```ts
// Source: TanStack Query invalidation guidance + existing app query usage
await queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] });
await queryClient.invalidateQueries({ queryKey: ['conversations'] });
```

### Anti-Patterns to Avoid
- **Direct browser calls to OpenRouter:** violates the project’s server-secret boundary.
- **Per-token database writes:** creates unnecessary SQLite churn and complicates failure cleanup.
- **Using `EventSource` for authenticated send requests:** mismatches current POST/cookie flow and limits body semantics.
- **Treating 200 OK as stream success:** OpenRouter can emit mid-stream error events while the HTTP status stays 200.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSE chunk parsing | ad hoc string splitting without SSE semantics | `eventsource-parser` or a spec-aware parser | OpenRouter may send SSE comments like `: OPENROUTER PROCESSING` and unified error events mid-stream |
| Chat state persistence | custom browser-only chat transcript store as source of truth | Prisma `Message` table + query invalidation | server persistence is already the canonical history boundary |
| Auth/ownership gating | manual user-id passing from frontend | `JwtAuthGuard` + `@CurrentUser()` + ownership-scoped service methods | existing backend security patterns already solve this correctly |
| Model routing logic | custom frontend model selection/fallback | backend env `OPENROUTER_MODEL` fixed per request | aligns with scope and security constraints |

**Key insight:** the deceptive complexity in this phase is not "sending a prompt" but correctly handling streaming transport, mid-stream failure semantics, and persistence boundaries. Reuse standard transport and security patterns instead of inventing new chat-specific infrastructure.

## Common Pitfalls

### Pitfall 1: Mid-stream error treated as success
**What goes wrong:** the backend or frontend assumes `200 OK` means the stream succeeded.
**Why it happens:** OpenRouter sends some errors as SSE events after headers are already sent.
**How to avoid:** inspect each streamed chunk for top-level `error` and `finish_reason: "error"`.
**Warning signs:** partial assistant text appears, then the stream ends silently without a saved final assistant message.

### Pitfall 2: Duplicate or overlapping sends from the same composer
**What goes wrong:** users trigger multiple requests before the current stream finishes.
**Why it happens:** composer remains active by design, but send-disable logic is missing.
**How to avoid:** keep input enabled, but gate send action with a dedicated `isStreaming` flag.
**Warning signs:** duplicate user messages, multiple overlapping assistant streams, or mismatched selected conversation state.

### Pitfall 3: Ownership check only at conversation bootstrap, not chat send
**What goes wrong:** a user can hit the chat endpoint with another user's conversation ID.
**Why it happens:** planner assumes Phase 2 ownership safety automatically carries over.
**How to avoid:** validate ownership again in the chat send path before reading or writing messages.
**Warning signs:** chat endpoint accepts arbitrary conversation IDs or loads messages without `userId` scope.

### Pitfall 4: Persisting failed assistant output as a completed message
**What goes wrong:** partial assistant text from a broken stream is stored as if it were complete.
**Why it happens:** persistence is coupled directly to token arrival instead of stream completion.
**How to avoid:** accumulate deltas in memory and only insert the assistant message on successful stream termination.
**Warning signs:** saved assistant rows with abrupt cutoffs after provider errors.

## Code Examples

Verified patterns from official sources:

### OpenRouter streaming request
```ts
// Source: https://openrouter.ai/docs/api/reference/streaming
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: process.env.OPENROUTER_MODEL,
    messages,
    stream: true,
  }),
});
```

### NestJS SSE route shape
```ts
// Source: https://docs.nestjs.com/techniques/server-sent-events
@Sse('sse')
sse(): Observable<MessageEvent> {
  return interval(1000).pipe(map(() => ({ data: { hello: 'world' } })));
}
```

This is official, but for this project the recommendation remains raw POST streaming because the current chat send flow is request-body-driven and authenticated.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| wait for full assistant completion before updating UI | incremental token streaming with final canonical persistence | already standard across chat UIs by 2025-2026 | Phase 3 should show real-time progress while keeping DB writes coarse-grained |
| client-owned transient chat history | server-owned canonical history plus client streaming overlay | common across production chat apps by 2025-2026 | aligns with this app’s history requirements and secret boundary |
| generic fetch success/failure handling | explicit pre-stream HTTP error handling + mid-stream SSE error handling | documented in current OpenRouter streaming docs | planner must include both paths in verify criteria |

**Deprecated/outdated:**
- `max_tokens` as primary request limit field — OpenRouter marks it deprecated in favor of `max_completion_tokens`.
- Browser-direct provider calls — incompatible with this project’s security policy.

## Open Questions

1. **Backend relay transport choice**
   - What we know: NestJS supports `@Sse()`, and the browser can read streamed fetch responses directly.
   - What's unclear: whether the planner prefers raw response piping or a formal SSE route abstraction.
   - Recommendation: plan raw POST streaming first because it matches the authenticated send semantics and existing route shell.

2. **Conversation detail API timing**
   - What we know: Phase 2 created `GET /conversations/:id`, but it is still title-only.
   - What's unclear: whether Phase 3 should extend that route to include messages immediately or introduce a dedicated messages/chat detail contract.
   - Recommendation: extend or add one conversation-detail/messages read contract in Phase 3 only as needed for the active chat panel; keep full history restoration UX concerns deferred to Phase 4.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | backend/frontend runtime and tests | ✓ | 24.13.0 | — |
| pnpm | package scripts and workspace commands | ✓ | 10.33.0 | — |
| curl | manual OpenRouter smoke tests and local stream inspection | ✓ | 8.7.1 | use Node `fetch` script |
| OpenRouter API key in env | real provider integration | ? | — | mock provider responses in tests |
| `OPENROUTER_MODEL` env | real provider routing | ? | — | use `.env` example value during local setup only |

**Missing dependencies with no fallback:**
- None verified at the CLI-tool level. Real provider execution still requires valid `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` in backend env.

**Missing dependencies with fallback:**
- OpenRouter live access is not verified from this workspace; backend/unit/e2e tests should mock or stub upstream responses.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest e2e for backend + Vitest for frontend |
| Config file | `backend/test/jest-e2e.json`, `backend/jest.config.ts`, `frontend/vitest.config.ts` |
| Quick run command | `pnpm --dir backend test:e2e -- --runInBand conversations-chat.e2e-spec.ts && pnpm --dir frontend test -- chat-streaming.test.tsx` |
| Full suite command | `pnpm --dir backend test:e2e && pnpm --dir backend test && pnpm --dir frontend test && pnpm --dir frontend typecheck` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CHAT-01 | authenticated user send triggers backend request to fixed OpenRouter model | backend e2e/integration | `pnpm --dir backend test:e2e -- --runInBand conversations-chat.e2e-spec.ts` | ❌ Wave 0 |
| CHAT-02 | frontend renders assistant output incrementally during stream | frontend integration | `pnpm --dir frontend test -- chat-streaming.test.tsx` | ❌ Wave 0 |
| CHAT-03 | final assistant message is persisted after stream completion | backend e2e/integration + frontend integration | `pnpm --dir backend test:e2e -- --runInBand conversations-chat.e2e-spec.ts && pnpm --dir frontend test -- chat-streaming.test.tsx` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm --dir backend test:e2e -- --runInBand conversations-chat.e2e-spec.ts` or `pnpm --dir frontend test -- chat-streaming.test.tsx`
- **Per wave merge:** `pnpm --dir backend test:e2e && pnpm --dir frontend test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `backend/test/conversations-chat.e2e-spec.ts` — covers CHAT-01 and CHAT-03 with mocked/stubbed upstream stream chunks
- [ ] `frontend/tests/chat-streaming.test.tsx` — covers incremental rendering, disabled send during stream, and post-completion refresh
- [ ] Upstream mock helper for OpenRouter SSE payloads and mid-stream error payloads
- [ ] Conversation detail/messages contract test fixture once message reads are exposed to the chat panel

## Sources

### Primary (HIGH confidence)
- https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request — request/response shape, `stream`, `max_completion_tokens`, errors
- https://openrouter.ai/docs/api/reference/streaming — streaming semantics, SSE comments, cancellation, pre-stream vs mid-stream errors
- https://docs.nestjs.com/techniques/server-sent-events — official NestJS SSE route semantics and `MessageEvent` contract
- Current repo inspection: `backend/src/config/env.schema.ts`, `backend/src/conversations/conversations.service.ts`, `frontend/src/routes/index.tsx`, `frontend/src/lib/api/client.ts`, `backend/package.json`, `frontend/package.json`
- `npm view` on 2026-03-26 — package versions for `@nestjs/core`, `@tanstack/react-query`, `@tanstack/react-router`, `react`, `prisma`, `@prisma/client`, `rxjs`

### Secondary (MEDIUM confidence)
- None needed. Official docs plus current codebase were sufficient.

### Tertiary (LOW confidence)
- Inference: raw POST streaming is the better fit than `@Sse()` for this repo’s current authenticated send path. This is an architectural recommendation, not a documented requirement.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - current repo dependencies align with official OpenRouter and NestJS docs
- Architecture: HIGH - core transport, persistence, and UI patterns are strongly constrained by existing codebase shape
- Pitfalls: HIGH - primary risks are explicitly documented by OpenRouter streaming docs and visible in current Phase 2 architecture

**Research date:** 2026-03-26
**Valid until:** 2026-04-25
