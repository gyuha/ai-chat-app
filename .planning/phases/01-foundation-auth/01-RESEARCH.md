# Phase 1: Foundation & Auth - Research

**Researched:** 2026-03-25
**Domain:** pnpm workspace bootstrapping, NestJS email/password auth, React SPA session restoration
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### Authentication Strategy
- **D-01:** 인증 방식은 이메일/비밀번호 기반 회원가입, 로그인, 로그아웃만 포함한다.
- **D-02:** 인증 상태 유지는 JWT 기반으로 설계한다.
- **D-03:** 비밀번호 재설정, 소셜 로그인, OAuth는 Phase 1 범위에서 제외한다.

### Session Behavior
- **D-04:** 세션이 만료되면 사용자를 즉시 로그인 화면으로 보낸다.
- **D-05:** 새로고침 후에도 JWT 기반 인증 상태 복원이 가능해야 한다.

### Workspace Structure
- **D-06:** 프로젝트 구조는 frontend와 backend를 분리한 2-app 구조로 시작한다.
- **D-07:** planner와 executor는 Phase 1에서 `backend` 와 `frontend` 라는 최상위 앱 경계를 우선 유지하는 방향으로 구조를 설계한다.

### Claude's Discretion
- JWT 저장 매체와 refresh token 도입 여부는 보안/구현 균형을 기준으로 planner가 세부 설계를 제안할 수 있다.
- UI 세부 레이아웃, 필드 문구, validation 메시지의 톤은 표준적이고 명확한 방향으로 the agent가 정할 수 있다.

### Deferred Ideas (OUT OF SCOPE)
- 비밀번호 재설정 — future phase 후보
- 소셜 로그인 / OAuth — future phase 후보
- 채팅 스트리밍 구현 — Phase 3 범위
- 대화 목록 및 히스토리 저장 — Phase 2 및 Phase 4 범위
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | 사용자가 이메일과 비밀번호로 가입할 수 있다 | Nest auth module, Prisma SQLite user model, password hashing, DTO validation |
| AUTH-02 | 사용자가 이메일과 비밀번호로 로그인할 수 있다 | Passport local strategy with `email` field, JWT issuance, logout/session endpoints |
| AUTH-03 | 사용자가 브라우저를 새로고침해도 로그인 세션이 유지된다 | httpOnly refresh cookie + bootstrap `/auth/session` check + frontend auth query |
| CHAT-04 | OpenRouter API 키와 모델 ID는 서버 환경 변수로만 관리되고 클라이언트에 노출되지 않는다 | backend-only env loading, Vite env boundary, no OpenRouter key/model in frontend |
</phase_requirements>

## Summary

Phase 1 should be planned as a strict two-app pnpm workspace: `frontend/` for the React SPA and `backend/` for the NestJS API. Keep the boundary hard. Authentication, SQLite access, JWT signing, and OpenRouter configuration live only in `backend`. The frontend should only know its own public API base URL and authenticated user/session state.

The safest Phase 1 session model is not “JWT in localStorage”. Use JWTs, but transport them as a short-lived access token plus a longer-lived refresh token carried in `httpOnly`, `SameSite=Lax` cookies. On app boot, the frontend should call a lightweight session endpoint to restore auth state; on 401/expired session, immediately clear client auth state and redirect to `/login`, matching the locked behavior in CONTEXT.md.

For persistence and migrations, prefer Prisma with SQLite for this phase. It has current official SQLite documentation, a NestJS recipe, and a straightforward path for a single `User` table now and `Conversation`/`Message` later. Plan 01-01 should establish the workspace, environment loading, and shared scripts; 01-02 should deliver the Nest auth/user foundation; 01-03 should wire React auth screens, protected routes, and session restoration.

**Primary recommendation:** Plan Phase 1 around `pnpm workspace + NestJS auth API + Prisma/SQLite + cookie-transported JWT session restoration + TanStack Router protected routes`.

## Project Constraints (from CLAUDE.md)

- OpenRouter API 키는 서버 환경 변수로만 관리하고 클라이언트 번들에 포함하면 안 된다.
- 무료 모델 1종을 서버에서 고정한다. 사용자별 모델 선택 UI는 만들지 않는다.
- 데이터 저장소는 SQLite를 사용한다.
- 인증은 이메일/비밀번호 로그인만 제공한다.
- v1 완료 기준은 로그인 후 채팅 성공과 히스토리 조회 가능 여부이며, MVP 범위를 엄격히 유지한다.
- 파일 변경 전에는 GSD 워크플로를 통해 planning 산출물과 실행 컨텍스트를 동기화해야 한다.
- repo는 현재 greenfield 상태이므로 기존 앱 코드를 전제로 한 설계를 하면 안 된다.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| pnpm | 10.33.0 | root workspace/package management | official workspace support is built in and matches the locked two-app boundary |
| NestJS | 11.1.17 | backend API/auth foundation | official Passport, Config, Validation, and Testing guidance is current and cohesive |
| Prisma | 7.5.0 | SQLite schema, migrations, typed DB access | official current SQLite path is documented and avoids hand-written SQL drift |
| React | 19.2.4 | frontend SPA | current stable React baseline for Vite and TanStack ecosystem |
| Vite | 8.0.2 | frontend dev/build tool | fastest standard SPA bootstrap and strict env exposure rules |
| TanStack Router | 1.168.3 | route protection and auth redirects | official authenticated-routes pattern matches Phase 1 needs |
| TanStack Query | 5.95.2 | auth bootstrap/session fetch state | standard server-state cache for login/session/user fetches |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @nestjs/config | 4.0.3 | backend env loading/validation | load `JWT_*`, `DATABASE_URL`, `OPENROUTER_*`, CORS origin at boot |
| @nestjs/jwt | 11.0.2 | JWT signing/verifying | access/refresh token issuance in auth service |
| @nestjs/passport | 11.0.5 | local/jwt strategies | login validation and protected route guards |
| passport-jwt | 4.0.1 | JWT strategy transport | access token validation from cookie extractor |
| bcrypt | 6.0.0 | password hashing | Nest officially recommends bcrypt or argon2; bcrypt is simpler and well-documented |
| cookie-parser | 1.4.7 | signed/unsigned cookie parsing | needed if JWTs ride cookies in Express |
| class-validator | 0.15.1 | DTO validation | signup/login body validation |
| joi | 18.1.1 | env schema validation | fail fast on missing/invalid server secrets |
| Vitest | 4.1.1 | frontend tests | natural fit with Vite React app |
| Jest | 30.3.0 | backend tests | Nest’s documented testing path still uses Jest + `@nestjs/testing` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prisma | Drizzle ORM | lighter runtime, but Prisma has clearer current SQLite onboarding and stronger Nest recipe coverage |
| cookie-based JWT transport | localStorage access token | simpler to wire, but weaker against XSS and forces client-visible token storage |
| file-based TanStack Router | code-based TanStack Router | code-based works, but TanStack explicitly recommends file-based routing for most apps |

**Installation:**
```bash
pnpm add -D typescript @biomejs/biome
pnpm --dir backend add @nestjs/common @nestjs/core @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer cookie-parser joi prisma @prisma/client @prisma/adapter-better-sqlite3
pnpm --dir frontend add react react-dom @tanstack/react-router @tanstack/react-query zustand
pnpm --dir frontend add -D vite @vitejs/plugin-react @tanstack/router-plugin vitest jsdom @testing-library/react @testing-library/jest-dom vite-tsconfig-paths
pnpm --dir backend add -D @nestjs/testing jest ts-jest supertest @types/jest @types/bcrypt @types/cookie-parser
```

**Version verification:** verified with `npm view <package> version` and `npm view <package> time.modified` on 2026-03-25.

| Package | Verified Version | Publish/Modified Date |
|---------|------------------|-----------------------|
| pnpm | 10.33.0 | 2026-03-24 |
| @nestjs/core | 11.1.17 | 2026-03-16 |
| @nestjs/jwt | 11.0.2 | 2025-12-05 |
| prisma | 7.5.0 | 2026-03-25 |
| @prisma/client | 7.5.0 | 2026-03-25 |
| react | 19.2.4 | 2026-03-24 |
| vite | 8.0.2 | 2026-03-23 |
| @tanstack/react-router | 1.168.3 | 2026-03-23 |
| @tanstack/react-query | 5.95.2 | 2026-03-23 |
| vitest | 4.1.1 | 2026-03-23 |

## Architecture Patterns

### Recommended Project Structure
```text
/
├── pnpm-workspace.yaml
├── package.json              # root scripts only
├── biome.json
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── app/              # router, providers, bootstrap
│   │   ├── features/auth/    # login/signup/session hooks
│   │   ├── routes/           # file-based TanStack routes
│   │   ├── lib/api/          # fetch client with credentials
│   │   └── components/ui/
│   └── tests/
└── backend/
    ├── package.json
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    ├── src/
    │   ├── app.module.ts
    │   ├── common/           # guards, decorators, config
    │   ├── auth/             # controller, service, strategies
    │   ├── users/            # user repository/service
    │   └── prisma/           # prisma service/module
    └── test/
```

### Pattern 1: Backend-only secret boundary
**What:** `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL` exist only in backend env/config.
**When to use:** immediately in Plan 01-01; this is a phase invariant, not a later hardening task.
**Example:**
```ts
// Source: https://docs.nestjs.com/techniques/configuration
// Source: https://vite.dev/guide/env-and-mode
// Backend only: validate secrets at boot, never prefix them with VITE_
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    DATABASE_URL: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    OPENROUTER_API_KEY: Joi.string().required(),
    OPENROUTER_MODEL: Joi.string().required(),
    FRONTEND_ORIGIN: Joi.string().uri().required(),
  }),
})
```

### Pattern 2: Email-first local strategy
**What:** Use Nest Passport local strategy, but explicitly switch `usernameField` to `email`.
**When to use:** login endpoint in Plan 01-02.
**Example:**
```ts
// Source: https://docs.nestjs.com/recipes/passport
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(email: string, password: string) {
    return this.authService.validateUser(email, password)
  }
}
```

### Pattern 3: Cookie-transported JWT session restoration
**What:** Issue access + refresh JWTs, store them in `httpOnly` cookies, and expose `GET /auth/session` and `POST /auth/refresh` for frontend bootstrap.
**When to use:** Phase 1 if planner wants safe refresh-after-reload without putting JWTs into browser storage.
**Example:**
```ts
// Source: Nest auth/passport docs for JWT strategy shape:
// https://docs.nestjs.com/recipes/passport
const cookieExtractor = (req?: Request) => req?.cookies?.access_token ?? null

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    })
  }

  async validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email }
  }
}
```

### Pattern 4: Frontend auth bootstrap via query + protected routes
**What:** Resolve current user once at app boot, pass auth state into TanStack Router context, and redirect in `beforeLoad`.
**When to use:** Plan 01-03.
**Example:**
```tsx
// Source: https://tanstack.com/router/latest/docs/guide/authenticated-routes
const sessionQuery = queryOptions({
  queryKey: ['auth', 'session'],
  queryFn: () => api.get('/auth/session'),
  retry: false,
})

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
})
```

### Anti-Patterns to Avoid
- **JWT in `localStorage`:** conflicts with the safest interpretation of the user’s JWT requirement and increases XSS exposure.
- **Single shared `.env` consumed by both apps:** makes secret leakage into Vite much easier.
- **Nest default `username` field left unchanged:** breaks email/password login even if the UI is correct.
- **No bootstrap session endpoint:** forces fragile client token parsing and makes reload restore logic ad hoc.
- **Direct OpenRouter call from frontend:** explicitly violates CHAT-04 and project constraints.
- **Nest monorepo mode inside `backend/`:** adds an unnecessary second workspace model and conflicts with the locked top-level `frontend`/`backend` separation.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password hashing | custom crypto wrapper | `bcrypt` | salt/cost tuning and compare semantics are easy to get wrong |
| JWT signing/parsing | manual `jsonwebtoken` plumbing everywhere | `@nestjs/jwt` + Passport strategies | centralizes expiry, claims, and guards |
| Request validation | handwritten `if (!email)` blocks | DTOs + `class-validator` + global `ValidationPipe` | consistent 400 responses and field validation |
| Env validation | lazy `process.env.FOO` access | `@nestjs/config` + Joi schema | fail fast before server starts |
| SQLite migrations | raw SQL files by hand | Prisma migrate | planner needs repeatable schema evolution for later phases |
| Route auth gating | component-level `if (!user)` checks everywhere | TanStack Router `beforeLoad` on layout/protected routes | keeps redirect logic centralized |
| Session restore cache | bespoke global promise singleton | TanStack Query session query | retry/cache/invalidations already solved |

**Key insight:** auth looks simple, but almost every “quick custom version” creates hidden state bugs or security regressions. Use documented framework primitives and keep custom code limited to domain rules.

## Common Pitfalls

### Pitfall 1: Email login fails because Passport still expects `username`
**What goes wrong:** frontend posts `{ email, password }`, but Nest local strategy reads `username`.
**Why it happens:** Nest Passport examples default to `username`.
**How to avoid:** set `usernameField: 'email'` in `LocalStrategy`.
**Warning signs:** login always returns 401 even though password hash compare is correct.

### Pitfall 2: Secrets leak into the frontend build
**What goes wrong:** OpenRouter key/model or JWT secret appears in frontend source/env.
**Why it happens:** Vite only exposes `VITE_` vars, but teams often copy one `.env` into both apps or import server config into client code.
**How to avoid:** keep separate env files and never define OpenRouter or JWT secrets with a `VITE_` prefix.
**Warning signs:** `rg 'OPENROUTER|JWT_.*SECRET' frontend` returns matches, or frontend env schema contains those keys.

### Pitfall 3: Reload restoration works locally, then breaks in browser auth flows
**What goes wrong:** user appears logged in until refresh, or only one tab works.
**Why it happens:** auth state is stored only in memory or only in local state without a server-restorable session path.
**How to avoid:** define `/auth/session` and refresh flow before wiring UI.
**Warning signs:** app boot depends on `localStorage`, or route guard runs before session query settles.

### Pitfall 4: Expired sessions leave the app in a half-authenticated state
**What goes wrong:** API calls start failing with 401, but user stays on protected screens.
**Why it happens:** no centralized unauthorized handler.
**How to avoid:** on refresh/session failure, clear auth query/store and redirect immediately to `/login`.
**Warning signs:** repeated 401s in network logs, stale user name still rendered in header.

### Pitfall 5: Backend boots with invalid env and fails later at runtime
**What goes wrong:** first OpenRouter or JWT code path crashes after deployment instead of at startup.
**Why it happens:** config is not validated eagerly.
**How to avoid:** validate env in `ConfigModule.forRoot`.
**Warning signs:** `process.env` reads are scattered across services.

## Code Examples

Verified patterns from official sources:

### pnpm workspace root
```yaml
# Source: https://pnpm.io/workspaces
packages:
  - frontend
  - backend
```

### Global validation pipe
```ts
// Source: https://docs.nestjs.com/techniques/validation
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
```

### Prisma SQLite datasource
```prisma
// Source: https://www.prisma.io/docs/prisma-orm/add-to-existing-project/sqlite
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### OpenRouter server-side call shape
```ts
// Source: https://openrouter.ai/docs/quickstart
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: process.env.OPENROUTER_MODEL,
    messages,
  }),
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Router + ad hoc auth guards | TanStack Router authenticated route context | current docs as of 2026-03 | stronger typed route context and centralized redirects |
| raw SQLite queries or TypeORM-by-default guidance | Prisma 7 SQLite with adapter/client generation | current Prisma docs 2026-03 | cleaner migration path and explicit generated client structure |
| storing SPA auth tokens in localStorage | httpOnly cookie transport with bootstrap session query | ecosystem best practice, not one-library-specific | better secret handling and cleaner reload restore |

**Deprecated/outdated:**
- Plain-text password examples in Nest auth tutorials: demo-only, not acceptable for this phase.
- Frontend-direct OpenRouter calls: explicitly out of scope and violates current project security rules.

## Open Questions

1. **Access/refresh token lifetimes**
   - What we know: JWT is locked; refresh token introduction is still planner discretion.
   - What's unclear: exact expiry windows and whether logout should revoke refresh tokens in DB or rely on cookie clearing only.
   - Recommendation: Phase 1 plan should choose explicit values up front, e.g. access 15m + refresh 7d, and keep revocation strategy simple unless a DB-backed refresh session table is added.

2. **Prisma schema scope**
   - What we know: Phase 1 only needs auth/user storage, but later phases need conversations/messages.
   - What's unclear: whether to create only `User` now or stub future models.
   - Recommendation: create only `User` in Phase 1; avoid speculative conversation tables.

3. **Frontend state split**
   - What we know: React Query is standard for server state and Zustand is available in project stack.
   - What's unclear: whether any auth UI state truly needs Zustand in Phase 1.
   - Recommendation: keep auth state in Query/router context first; defer Zustand until a genuine local UI state need appears.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | frontend/backend runtime and tooling | ✓ | v24.13.0 | — |
| pnpm | workspace/package management | ✓ | 10.28.2 installed locally | npm workspaces, but do not switch; project stack is pnpm |
| npm registry access | package/version verification and installs | ✓ | npm 11.6.2 | — |
| SQLite CLI | local DB inspection/debugging | ✓ | 3.51.0 | Prisma-only workflow if CLI not used |
| C/C++ toolchain (`gcc`, `make`) | native modules like `bcrypt`/`argon2` | ✓ | clang 17 / make 3.81 | use prebuilt binaries if available |
| Docker | optional local infra | ✗ | — | not needed for this phase |

**Missing dependencies with no fallback:**
- None for Phase 1 research/planning.

**Missing dependencies with fallback:**
- Docker is absent, but Phase 1 can proceed fully with local Node + SQLite.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Backend: Jest 30.3.0 + `@nestjs/testing` 11.1.17; Frontend: Vitest 4.1.1 + Testing Library 16.3.2 |
| Config file | none — see Wave 0 |
| Quick run command | `pnpm --filter backend test -- auth` and `pnpm --filter frontend vitest run auth` |
| Full suite command | `pnpm -r test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | signup creates a new user with hashed password | backend e2e + service unit | `pnpm --filter backend test -- auth.e2e-spec.ts -t signup` | ❌ Wave 0 |
| AUTH-02 | login accepts valid email/password and rejects invalid credentials | backend e2e | `pnpm --filter backend test -- auth.e2e-spec.ts -t login` | ❌ Wave 0 |
| AUTH-03 | refresh/session endpoint restores auth after browser reload | backend e2e + frontend integration | `pnpm --filter backend test -- auth.e2e-spec.ts -t session && pnpm --filter frontend vitest run src/features/auth` | ❌ Wave 0 |
| CHAT-04 | OpenRouter key/model stay server-only | static config test + grep gate | `pnpm -r exec rg -n "OPENROUTER_(API_KEY|MODEL)" frontend backend` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** relevant targeted backend/frontend auth tests
- **Per wave merge:** `pnpm -r test`
- **Phase gate:** full auth test suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `backend/test/auth.e2e-spec.ts` — covers AUTH-01, AUTH-02, AUTH-03
- [ ] `backend/src/auth/auth.service.spec.ts` — password hashing and token issuance logic
- [ ] `frontend/src/features/auth/session.test.tsx` — bootstrap + redirect behavior
- [ ] `frontend/vitest.config.ts` or `vite.config.ts` test section — frontend framework config
- [ ] `backend/test/jest-e2e.json` or equivalent Jest config — backend e2e wiring
- [ ] root `test` scripts in workspace `package.json` files — command stability for planner/executor

## Sources

### Primary (HIGH confidence)
- pnpm workspace docs: https://pnpm.io/workspaces — workspace root requirements and `workspace:` protocol
- NestJS Passport recipe: https://docs.nestjs.com/recipes/passport — local/jwt strategy patterns and `usernameField: 'email'`
- NestJS configuration docs: https://docs.nestjs.com/techniques/configuration — `ConfigModule.forRoot` and boot-time config
- NestJS validation docs: https://docs.nestjs.com/techniques/validation — global `ValidationPipe` pattern
- NestJS testing docs: https://docs.nestjs.com/fundamentals/testing — `Test.createTestingModule`, `createNestApplication`, Supertest pattern
- NestJS encryption/hashing docs: https://docs.nestjs.com/security/encryption-and-hashing — bcrypt/argon2 recommendation
- Vite env docs: https://vite.dev/guide/env-and-mode — client exposure boundary for env variables
- TanStack Router authenticated routes: https://tanstack.com/router/latest/docs/guide/authenticated-routes — auth context and redirect pattern
- Prisma SQLite guide: https://www.prisma.io/docs/prisma-orm/add-to-existing-project/sqlite — current SQLite datasource/client setup
- OpenRouter quickstart: https://openrouter.ai/docs/quickstart — server request shape with `Authorization` header and model id
- npm registry metadata checked 2026-03-25 with `npm view` for package versions/dates

### Secondary (MEDIUM confidence)
- CLAUDE.md embedded stack recommendations — aligned with project maintainer guidance but not authoritative over official docs

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - current versions verified from npm registry and core patterns backed by official docs
- Architecture: MEDIUM - recommended cookie transport/session restoration shape is partly synthesized from official primitives rather than documented as one exact end-to-end stack recipe
- Pitfalls: HIGH - directly tied to locked user constraints and known framework behavior

**Research date:** 2026-03-25
**Valid until:** 2026-04-01
