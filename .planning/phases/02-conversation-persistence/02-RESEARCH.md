# Phase 2: Conversation Persistence - Research

**Researched:** 2026-03-26
**Domain:** authenticated conversation persistence with Prisma SQLite, NestJS ownership enforcement, TanStack Router/Query list bootstrap
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### Conversation Creation Flow
- **D-01:** 로그인 사용자가 `/`에 진입했을 때 대화가 하나도 없으면 첫 대화를 자동 생성한다.
- **D-02:** 사용자가 빈 상태에서 별도 버튼을 눌러야만 대화가 만들어지는 흐름은 사용하지 않는다.

### Conversation List Density
- **D-03:** Phase 2의 대화 목록은 최소형으로 유지하고, 각 항목에는 제목만 노출한다.
- **D-04:** 생성 시각, 수정 시각, 최근 메시지 미리보기는 이 phase 범위에서 제외한다.

### Default Naming
- **D-05:** 새로 생성된 대화의 기본 제목은 고정 문자열 `새 대화`를 사용한다.
- **D-06:** 시각 기반 제목 생성이나 첫 메시지 기반 제목 갱신은 후속 phase에서 다시 판단한다.

### Initial Screen Behavior
- **D-07:** 첫 대화가 자동 생성되면 해당 대화를 즉시 선택된 상태로 보여준다.
- **D-08:** 초기 화면에는 별도 웰컴 카피나 사용 팁 없이 바로 대화 진입 상태를 보여준다.

### Claude's Discretion
- conversation/message 테이블의 세부 컬럼 구성, 인덱스, 정렬 기준은 Prisma와 이후 phase 요구를 고려해 the agent가 설계할 수 있다.
- 목록 레이아웃의 구체적 spacing, active state 스타일, loading skeleton은 기존 auth/app shell 패턴과 어울리도록 the agent가 정할 수 있다.
- 자동 생성 트리거를 loader 단계에서 처리할지, 초기 API 호출 이후 mutation으로 처리할지는 기존 라우터와 query 패턴에 맞춰 the agent가 정할 수 있다.

### Deferred Ideas (OUT OF SCOPE)
- 최근 메시지 미리보기, 수정 시각, richer metadata 노출 — later UX phase candidate
- 첫 메시지 기반 자동 제목 생성 — 후속 phase 후보
- 특정 대화의 메시지 히스토리 복원 UI — Phase 4 범위
- assistant 응답 저장과 스트리밍 채팅 결합 — Phase 3 범위
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONV-01 | 로그인한 사용자가 새 대화를 생성할 수 있다 | Prisma `Conversation` model, authenticated `POST /conversations`, idempotent first-conversation bootstrap, frontend create mutation |
| CONV-02 | 로그인한 사용자가 자신의 대화 목록을 볼 수 있다 | ownership-scoped Prisma queries, authenticated `GET /conversations`, title-only DTO, TanStack Query list fetch + selected state |
| CONV-04 | 한 사용자는 다른 사용자의 대화와 메시지에 접근할 수 없다 | `userId`-scoped repository methods, `JwtAuthGuard` + `@CurrentUser()`, ownership mismatch treated as not found, backend security tests |
</phase_requirements>

## Summary

Phase 2 should stay inside the Phase 1 architecture instead of inventing a new persistence path. The backend already has the correct auth boundary: `JwtAuthGuard` attaches the authenticated user to the request, `@CurrentUser()` extracts it, Prisma is globally available, and the frontend already boots protected routes through TanStack Router plus TanStack Query. The conversation phase should extend those exact patterns with a dedicated `conversations` module and a small `frontend/src/features/conversations` slice.

For storage, use Prisma models for `Conversation` and `Message` now even though message history rendering is deferred to Phase 4 and assistant persistence lands in Phase 3. That keeps Phase 3/4 from rewriting the schema immediately after Phase 2. Use required one-to-many relations `User -> Conversation -> Message`, explicit foreign keys, and explicit referential actions. Query ownership by filtering on both `id` and `userId`; do not rely on a later authorization layer to fix broad queries.

The highest-risk planning choice is the first-conversation auto-create behavior. A naive client-side `if list empty then create` effect can produce duplicate blank conversations under retry or multi-tab startup. The safer plan is: `GET /conversations` stays read-only, `POST /conversations` handles creation, and the frontend calls a create mutation only after an empty list result, while the backend makes the bootstrap path idempotent with a short Prisma transaction and a second ownership-scoped existence check.

**Primary recommendation:** Plan Phase 2 around `Prisma Conversation/Message models + NestJS conversations module + ownership-scoped queries + TanStack Query list/create flow with idempotent first-conversation bootstrap`.

## Project Constraints (from CLAUDE.md)

- OpenRouter API 키는 서버 환경 변수로만 관리하고 클라이언트 번들에 포함하면 안 된다.
- 무료 모델 1종을 서버에서 고정한다. 사용자별 모델 선택 UI는 만들지 않는다.
- 데이터 저장소는 SQLite를 사용한다.
- 인증은 이메일/비밀번호 로그인만 제공한다.
- v1 완료 기준은 로그인 후 채팅 성공과 히스토리 조회 가능 여부이며, MVP 범위를 엄격히 유지한다.
- 파일 변경 전에는 GSD 워크플로를 통해 planning 산출물과 실행 컨텍스트를 동기화해야 한다.
- 현재 코드베이스의 기존 패턴을 우선 따라야 한다.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Prisma ORM | 7.5.0 | conversation/message schema, migrations, typed persistence | already installed, current on npm, and matches the repo's SQLite adapter-backed runtime |
| @prisma/adapter-better-sqlite3 | 7.5.0 | SQLite runtime adapter | already wired in `PrismaService`; Phase 2 should not replace the DB access layer |
| NestJS | 11.1.17 | authenticated API module/controller/service structure | already established in Phase 1 with guards, config, DTO pipes, and tests |
| TanStack React Query | 5.95.2 | conversation list fetch, create mutation, invalidation | already used for auth bootstrap and is the standard cache boundary for server state |
| TanStack React Router | 1.168.3 in repo (`1.168.4` latest) | protected home route and initial conversation selection bootstrap | already controls `/` access and supports `beforeLoad` auth gating |
| React | 19.2.4 | conversation list UI and selected state rendering | existing frontend runtime; no Phase 2 reason to add another UI state framework |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Jest | 30.2.0 in repo (`30.3.0` latest) | backend e2e tests for ownership and API contracts | use for authenticated `/conversations` contract tests under `backend/test/` |
| Vitest | 4.1.1 | frontend route/list bootstrap tests | use for empty-list auto-create and title-only rendering tests |
| class-validator | 0.14.2 | request DTO validation | keep request bodies minimal, especially if `POST /conversations` accepts an optional bootstrap flag |
| cookie-parser | 1.4.7 | cookie-based auth transport | already required by the JWT cookie flow; conversations should reuse it unchanged |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prisma models + Prisma Migrate | hand-written SQL tables/repositories | faster for one table, but Phase 3/4 schema evolution and typed ownership queries become harder immediately |
| Query invalidation after create | local manual array mutation | works for tiny UIs, but diverges from the repo's existing server-state pattern and is easier to desync |
| Dedicated conversation feature module | adding methods into `UsersService` or `AuthService` | slightly fewer files, but weakens domain boundaries and will become harder to extend for messages |
| Title-only conversation DTO | returning messages in list payloads | convenient short-term, but violates the user decision for a minimal list and increases leakage risk |

**Installation:**
```bash
# No new packages are required for Phase 2.
pnpm --dir backend prisma migrate dev --name add_conversation_models
pnpm --dir backend prisma generate
```

**Version verification:** verified with `npm view <package> version time.modified` on 2026-03-26.

| Package | Verified Version | Publish/Modified Date |
|---------|------------------|-----------------------|
| prisma | 7.5.0 | 2026-03-26 |
| @prisma/client | 7.5.0 | 2026-03-26 |
| @nestjs/core | 11.1.17 | 2026-03-16 |
| @tanstack/react-query | 5.95.2 | 2026-03-23 |
| @tanstack/react-router | 1.168.4 | 2026-03-25 |
| react | 19.2.4 | 2026-03-25 |
| vite | 8.0.3 | 2026-03-26 |
| vitest | 4.1.1 | 2026-03-23 |
| jest | 30.3.0 | 2026-03-10 |

## Architecture Patterns

### Recommended Project Structure
```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── auth/
│   ├── conversations/
│   │   ├── dto/
│   │   ├── conversations.controller.ts
│   │   ├── conversations.module.ts
│   │   └── conversations.service.ts
│   ├── prisma/
│   └── users/
└── test/
    └── conversations.e2e-spec.ts

frontend/
├── src/
│   ├── features/
│   │   └── conversations/
│   │       ├── api.ts
│   │       ├── queries.ts
│   │       └── types.ts
│   ├── routes/
│   │   ├── __root.tsx
│   │   └── index.tsx
│   └── components/
│       └── conversations/
└── tests/
    └── conversation-routing.test.tsx
```

### Pattern 1: Ownership-scoped persistence methods
**What:** Every conversation read/write method receives `userId` explicitly and scopes the Prisma query with it.
**When to use:** all conversation service methods, including helper methods that may be reused in Phase 3/4.
**Example:**
```ts
// Source: https://docs.nestjs.com/recipes/passport
// Source: https://docs.nestjs.com/custom-decorators
// Source: backend/src/auth/strategies/jwt.strategy.ts
// Source: backend/src/auth/decorators/current-user.decorator.ts
@UseGuards(JwtAuthGuard)
@Get('conversations')
listConversations(@CurrentUser() user: SessionUser) {
  return this.conversationsService.listForUser(user.id)
}

// Keep user scoping inside the data access call, not only in the controller.
listForUser(userId: string) {
  return this.prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}
```

### Pattern 2: Required one-to-many schema with explicit referential actions
**What:** Model `User -> Conversation -> Message` as required one-to-many relations with explicit foreign keys and timestamps.
**When to use:** Plan 02-01 schema/migration work.
**Example:**
```prisma
// Source: https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations
// Source: https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  passwordHash  String
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  conversations Conversation[]
}

model Conversation {
  id        String    @id @default(cuid())
  title     String
  userId    String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  messages  Message[]

  @@index([userId, updatedAt])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  role           MessageRole
  content        String
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  @@index([conversationId, createdAt])
}

enum MessageRole {
  user
  assistant
}
```

### Pattern 3: Idempotent first-conversation bootstrap
**What:** Keep `GET /conversations` read-only. If the list is empty, trigger `POST /conversations` once and let the backend handle bootstrap creation idempotently.
**When to use:** first authenticated visit to `/`.
**Example:**
```ts
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/transactions
async createConversation(userId: string, mode: 'default' | 'bootstrap' = 'default') {
  if (mode === 'default') {
    return this.prisma.conversation.create({
      data: { userId, title: '새 대화' },
    })
  }

  return this.prisma.$transaction(async (tx) => {
    const existing = await tx.conversation.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })

    if (existing) {
      return existing
    }

    return tx.conversation.create({
      data: { userId, title: '새 대화' },
    })
  })
}
```

### Pattern 4: Query invalidation after create
**What:** Use a dedicated list query key and invalidate it after successful creation instead of manually maintaining a second source of truth.
**When to use:** manual create later and bootstrap create now.
**Example:**
```tsx
// Source: https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
const queryClient = useQueryClient()

const createConversation = useMutation({
  mutationFn: createConversationApi,
  onSuccess: async (conversation) => {
    await queryClient.invalidateQueries({ queryKey: ['conversations'] })
    setSelectedConversationId(conversation.id)
  },
})
```

### Pattern 5: Keep auth gating in `beforeLoad`, not inside ad hoc component effects
**What:** Continue to use TanStack Router `beforeLoad` for auth protection and perform conversation bootstrap only after the route is already known to be authenticated.
**When to use:** `frontend/src/routes/index.tsx`.
**Example:**
```tsx
// Source: https://tanstack.com/router/latest/docs/guide/authenticated-routes
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: async ({ context }) => {
    const user = await ensureSession(context.queryClient)
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  component: ProtectedConversationHome,
})
```

### Anti-Patterns to Avoid
- **Broad Prisma reads followed by JS filtering:** `findMany()` without `userId` and filtering in memory is both unsafe and unnecessary.
- **Creating the first conversation inside `GET /conversations`:** it hides a write behind a read and makes retries harder to reason about.
- **Using Zustand or component state as the persistence source:** selected conversation UI state is fine; durable conversations/messages are not.
- **Returning full message arrays from list queries:** violates the locked title-only list decision and increases exposure surface.
- **Deferring ownership helpers to Phase 4:** CONV-04 is in Phase 2, so ownership checks must be foundational now.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authenticated user extraction | manual cookie parsing in every controller | `JwtAuthGuard` + `@CurrentUser()` | the repo already has the correct, tested auth boundary |
| Schema migration | hand-written table SQL as the main migration path | Prisma schema + Prisma Migrate | Phase 3/4 will evolve the schema; hand-managed SQL will drift |
| Conversation cache sync | separate local mirror logic | TanStack Query invalidation/refetch | the current app already uses React Query for server state |
| Ownership enforcement | controller-only `if` checks with unconstrained repository methods | user-scoped Prisma methods | repository-level scoping prevents accidental leaks from future reuse |
| Message persistence contract | ad hoc JSON blob column | explicit `Message` model | Phase 3 and Phase 4 both need typed, queryable message rows |

**Key insight:** The deceptive complexity in this phase is not “creating a table”; it is making ownership and bootstrap behavior impossible to get subtly wrong in later phases.

## Common Pitfalls

### Pitfall 1: Ownership checks only at the route layer
**What goes wrong:** a later service call or future controller reuses a broad `findUnique({ where: { id } })` helper and leaks another user's conversation.
**Why it happens:** Prisma `findUnique` encourages ID-only lookups, and current Phase 2 scope does not yet require a rich detail endpoint.
**How to avoid:** expose only user-scoped methods such as `findOwnedConversation(userId, conversationId)` and treat ownership misses as `NotFoundException`.
**Warning signs:** repository methods that accept only `conversationId`, or tests that never create two users.

### Pitfall 2: Duplicate blank conversations on first app load
**What goes wrong:** the empty-list bootstrap runs twice and creates multiple `새 대화` rows.
**Why it happens:** retry, double render, multi-tab startup, or a frontend-only `useEffect` without backend idempotency.
**How to avoid:** keep bootstrap creation in a mutation and make the backend bootstrap path idempotent with a short transaction.
**Warning signs:** more than one blank conversation after refresh or after opening two tabs at the same time.

### Pitfall 3: Test schema drift
**What goes wrong:** backend e2e tests still create only the `User` table manually, so conversation tests either fail or test a schema different from production.
**Why it happens:** current `auth.e2e-spec.ts` builds tables with raw SQL for Phase 1 only.
**How to avoid:** update the e2e bootstrap to create `Conversation` and `Message` tables from migration SQL or an equivalent authoritative setup path.
**Warning signs:** tests passing locally while migration-generated schema differs, or raw SQL duplicated across spec files.

### Pitfall 4: Over-fetching list payloads
**What goes wrong:** `GET /conversations` returns message content or unused metadata, increasing leak surface and frontend coupling.
**Why it happens:** it is tempting to `include: { messages: true }` for future convenience.
**How to avoid:** use a title-only DTO in Phase 2 and reserve history loading for Phase 4.
**Warning signs:** the list API response grows beyond `id/title/timestamps`, or frontend list rendering depends on message content.

### Pitfall 5: Sorting on the wrong timestamp
**What goes wrong:** conversation order becomes unstable once Phase 3 starts appending messages.
**Why it happens:** planners optimize for current empty conversations and sort by `createdAt` only.
**How to avoid:** store both `createdAt` and `updatedAt` now, and order the list by `updatedAt desc`.
**Warning signs:** a conversation with a newer message stays buried in the list after Phase 3 work begins.

## Code Examples

Verified patterns from official sources and current repo structure:

### Authenticated Nest controller with request user extraction
```ts
// Source: https://docs.nestjs.com/recipes/passport
// Source: https://docs.nestjs.com/custom-decorators
@UseGuards(JwtAuthGuard)
@Post('conversations')
createConversation(
  @CurrentUser() user: SessionUser,
  @Body() dto: CreateConversationDto,
) {
  return this.conversationsService.createConversation(user.id, dto.mode)
}
```

### Ownership-safe lookup helper
```ts
async findOwnedConversationOrThrow(userId: string, conversationId: string) {
  const conversation = await this.prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
  })

  if (!conversation) {
    throw new NotFoundException('Conversation not found')
  }

  return conversation
}
```

### Frontend bootstrap flow for first authenticated load
```tsx
const conversationsQuery = useQuery({
  queryKey: ['conversations'],
  queryFn: getConversations,
})

useEffect(() => {
  if (!conversationsQuery.isSuccess) return
  if (conversationsQuery.data.length > 0) {
    setSelectedConversationId(conversationsQuery.data[0].id)
    return
  }
  void createConversation.mutateAsync({ mode: 'bootstrap' })
}, [conversationsQuery.isSuccess, conversationsQuery.data, createConversation])
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| local-only conversation IDs or `localStorage` chat shells | server-side conversation rows keyed by authenticated user | current mainstream app architecture; reinforced by TanStack Query and protected route patterns | enables secure multi-user history and removes cross-device inconsistency |
| ad hoc `useEffect(fetch...)` plus local arrays | query/mutation cache with explicit invalidation | React Query v5 current guidance | simpler refetch logic and less duplicated state |
| implicit reliance on default referential actions | explicit `onDelete`/`onUpdate` on relations | current Prisma v7 docs emphasize explicit relation behavior | avoids later surprises when deleting conversations/users or evolving schema |

**Deprecated/outdated:**
- Conversation state that exists only in frontend memory for authenticated apps.
- Broad `findUnique(id)` data access helpers reused across multi-tenant domains.
- List APIs that eagerly include nested messages “for convenience”.

## Open Questions

1. **Should Phase 2 introduce a route param or search param for the selected conversation now?**
   - What we know: the phase must show the first conversation as selected immediately, but full history restoration is deferred to Phase 4.
   - What's unclear: whether selection should already be URL-addressable or remain in local UI state for now.
   - Recommendation: keep selection in local UI state in Phase 2 unless the planner wants to absorb the extra URL-state/test complexity now.

2. **Should `POST /conversations` support an explicit bootstrap mode?**
   - What we know: Phase 2 needs auto-create-on-empty and will later need normal “new conversation” behavior.
   - What's unclear: whether planner prefers one endpoint with a mode flag or a second bootstrap-specific endpoint.
   - Recommendation: prefer one endpoint with an optional bootstrap mode; it keeps semantics explicit without adding another route.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | backend/frontend builds, Prisma CLI, tests | ✓ | v24.13.0 | — |
| pnpm | workspace scripts, backend/frontend commands | ✓ | 10.33.0 | npm could run some commands, but repo is already pnpm-based |
| npm registry access | version verification during planning/research | ✓ | npm 11.6.2 | — |
| Prisma CLI (local package) | migrations and client generation | ✓ | 7.5.0 | `pnpm --dir backend exec prisma ...` |
| SQLite runtime via Prisma adapter | backend persistence | ✓ | adapter 7.5.0 | no system `sqlite3` CLI needed |
| Vitest | frontend validation | ✓ | 4.1.1 | — |
| Jest | backend validation | ✓ | local CLI reports 30.1.3 | — |

**Missing dependencies with no fallback:**
- None.

**Missing dependencies with fallback:**
- None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest e2e for backend + Vitest for frontend |
| Config file | `backend/test/jest-e2e.json`, `backend/jest.config.ts`, `frontend/vitest.config.ts` |
| Quick run command | `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts && pnpm --dir frontend test -- conversation-routing.test.tsx` |
| Full suite command | `pnpm --dir backend test:e2e && pnpm --dir backend test && pnpm --dir frontend test && pnpm --dir frontend typecheck` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONV-01 | authenticated user can create a conversation; first visit auto-creates one when list is empty | backend e2e + frontend integration | `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts` and `pnpm --dir frontend test -- conversation-routing.test.tsx` | ❌ Wave 0 |
| CONV-02 | authenticated user sees only their own conversation titles in the list | backend e2e + frontend integration | `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts` and `pnpm --dir frontend test -- conversation-routing.test.tsx` | ❌ Wave 0 |
| CONV-04 | another user's conversation ID does not reveal data | backend e2e | `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm --dir backend test:e2e -- --runInBand conversations.e2e-spec.ts` or `pnpm --dir frontend test -- conversation-routing.test.tsx`
- **Per wave merge:** `pnpm --dir backend test:e2e && pnpm --dir frontend test`
- **Phase gate:** backend e2e + frontend tests + frontend typecheck green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `backend/test/conversations.e2e-spec.ts` — covers CONV-01, CONV-02, CONV-04
- [ ] `frontend/tests/conversation-routing.test.tsx` — covers empty-list bootstrap and title-only list rendering
- [ ] Shared backend test DB bootstrap for `Conversation` and `Message` tables — current auth e2e setup creates only `User`
- [ ] Conversation API fixture helpers for two-user ownership tests — current frontend/backend tests only model auth flows

## Sources

### Primary (HIGH confidence)
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations - required one-to-many relation structure
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions - explicit delete/update behavior defaults and SQLite support
- https://www.prisma.io/docs/orm/prisma-client/queries/transactions - idempotent bootstrap and short transaction guidance; SQLite serializable note
- https://www.prisma.io/docs/orm/prisma-client/queries/crud - `findMany`, filtering, ordering, and select/include patterns
- https://docs.nestjs.com/recipes/passport - request user attachment via auth strategies/guards
- https://docs.nestjs.com/custom-decorators - `createParamDecorator` pattern for `@CurrentUser()`
- https://tanstack.com/router/latest/docs/guide/authenticated-routes - `beforeLoad` auth gating and redirects
- https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations - mutation success invalidation pattern
- `npm view prisma version time.modified`, `npm view @prisma/client version time.modified`, `npm view @nestjs/core version time.modified`, `npm view @tanstack/react-query version time.modified`, `npm view @tanstack/react-router version time.modified`, `npm view react version time.modified`, `npm view vite version time.modified`, `npm view vitest version time.modified`, `npm view jest version time.modified` on 2026-03-26
- Current repo inspection: `backend/prisma/schema.prisma`, `backend/src/auth/*`, `frontend/src/routes/index.tsx`, `frontend/src/features/auth/*`, `backend/test/auth.e2e-spec.ts`, `frontend/tests/auth-routing.test.tsx`

### Secondary (MEDIUM confidence)
- None. Primary sources plus current codebase were sufficient.

### Tertiary (LOW confidence)
- Inference: ownership mismatches should return `404` rather than `403` to reduce resource enumeration signals. This is a security design recommendation, not an explicit project requirement.
- Inference: a bootstrap mode on `POST /conversations` is the cleanest endpoint shape for this phase. Validate during planning against preferred API style.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - current repo inspection plus npm registry verification and official docs match cleanly
- Architecture: MEDIUM - core patterns are well-supported, but the exact bootstrap endpoint shape is still a planning choice
- Pitfalls: HIGH - most risks are directly visible from current codebase structure and official docs

**Research date:** 2026-03-26
**Valid until:** 2026-04-25
