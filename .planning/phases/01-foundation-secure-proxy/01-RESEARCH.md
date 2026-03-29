# Phase 1: Foundation & Secure Proxy - Research

**Researched:** 2026-03-29
**Domain:** pnpm workspace 기반 React/NestJS greenfield foundation + OpenRouter server proxy
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- `pnpm workspace` 기반 모노레포로 시작하고, 최상위에 `apps/web`, `apps/server`, `packages/contracts`, `packages/config`를 둔다.
- 공통 타입은 `packages/contracts` 하나로 시작하고, 서버 DTO class는 백엔드 내부에 유지한다.
- `turbo`는 Phase 1에 넣지 않는다. 루트 스크립트는 `pnpm dev/build/lint/typecheck/test` 체계로 먼저 고정한다.
- NestJS는 `health`, `models`, `chats`, `streaming` 모듈 경계로 시작한다.
- 모델 allowlist는 서버 env(`OPENROUTER_MODEL_ALLOWLIST`)에서 관리하고, web은 `/api/v1/models` 결과만 소비한다.
- OpenRouter 호출 책임은 `infrastructure/openrouter` 하위 client로 고립하고, controller/service는 내부 정규화된 타입만 다룬다.
- 채팅 스트리밍은 `POST /api/v1/chats/:chatId/messages/stream`와 `POST /api/v1/chats/:chatId/regenerate/stream`로 표준화한다.
- 응답 포맷은 `text/event-stream` 기반 이벤트 스트림으로 통일하고, 최소 이벤트는 `message:start`, `message:delta`, `message:done`, `error`, `heartbeat`를 포함한다.
- 브라우저 중단은 `AbortController`를 사용하고, 서버는 upstream OpenRouter fetch abort를 전달해야 한다.
- 저장소 계층은 `ChatRepository` 인터페이스를 먼저 정의하고 `memory`와 `file` adapter를 동시에 스캐폴드한다.
- file adapter는 로컬 개발용 기본값으로 두되, PostgreSQL adapter를 나중에 꽂을 수 있도록 repository contract를 persistence-agnostic하게 유지한다.
- 제목 자동 생성 로직 자체는 Phase 4로 미루지만, 제목 필드와 저장 구조는 Phase 1부터 지원 가능한 형태로 설계한다.
- Phase 1의 web 범위는 "실제 채팅 UI"가 아니라 `Vite + React + TanStack Router + Query` 기본 앱과 내부 API smoke path 연결까지다.
- `ui-ux-pro-max` 권고를 따라 shadcn `SidebarProvider`와 dark-mode token 구조를 초기에 깔아 두되, 실제 sidebar 경험 완성은 Phase 2에서 다룬다.
- 접근성 기반 규칙은 Phase 1부터 깨지지 않게 잡는다. 즉, focus-visible 스타일과 모바일 overflow 방지 토큰은 초기 theme layer에 포함한다.

### the agent's Discretion
- 정확한 패키지 버전은 현재 안정 버전 범위에서 planner/researcher가 확정한다.
- health endpoint payload의 세부 필드와 내부 에러 코드 naming은 planner가 구현 편의에 맞게 정한다.
- contracts package 내부 파일 분할 방식(`chat.ts`, `models.ts`, `stream.ts`)은 구현 시점에 가장 단순한 구조를 선택한다.

### Deferred Ideas (OUT OF SCOPE)
- 없음

</user_constraints>

<research_summary>
## Summary

이 phase에서 중요한 것은 "최소한의 코드로 이후 phase가 흔들리지 않는 기반을 고정하는 것"이다. 따라서 프론트엔드도 완성형 shell을 만드는 대신, provider/router/theme/API smoke path 수준까지만 만들고, 핵심 복잡도는 server proxy, env validation, shared contracts, repository seam에 집중하는 것이 표준적이고 안전하다.

표준 접근은 `pnpm workspace`에 `apps/web`, `apps/server`, `packages/contracts`를 두고, NestJS가 OpenRouter upstream을 감싸는 얇은 인프라 계층을 가지는 방식이다. allowlist는 환경변수에서 읽고, 클라이언트는 `/api/v1/models`만 본다. stream contract는 Phase 1에서 이벤트 이름까지 고정해야 이후 React query patching과 stop/regenerate 동작이 단순해진다.

**Primary recommendation:** Phase 1은 "workspace + contracts + env-safe NestJS proxy + repository seam + web smoke path"까지만 구현하고, 실제 conversational shell 완성은 다음 phase로 넘긴다.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react` | `19.2.4` | web UI runtime | 최신 React 기준의 concurrent/default batching과 생태계 호환성이 좋다 |
| `vite` | `8.0.3` | web dev server/build | SPA 초기 구축 속도가 빠르고 TanStack Router와 궁합이 좋다 |
| `@tanstack/react-router` | `1.168.8` | route management | 파일/코드 기반 라우트 모두 지원하고 data-router 성격이 명확하다 |
| `@tanstack/react-query` | `5.95.2` | server-state management | chats/models fetch와 stream 후 cache patch에 적합하다 |
| `zustand` | `5.0.12` | UI state | composer draft, sidebar open 상태 같은 로컬 UI 상태 분리에 적합하다 |
| `@nestjs/core` | `11.1.17` | backend application runtime | 모듈 경계, DTO validation, provider 구조를 깔끔하게 만든다 |
| `@biomejs/biome` | `2.4.9` | formatting/lint | monorepo 초기 포맷터/린터 통일에 유리하다 |
| `pnpm` | `10.33.0` | workspace package manager | 멀티패키지 저장소에서 빠르고 디스크 효율이 좋다 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `typescript` | `6.0.2` | static typing | root/web/server/contracts 공통 타입 안전성 |
| `tailwindcss` | `4.2.2` | styling tokens/utilities | shadcn/ui와 theme token 연결 시 사용 |
| `@radix-ui/react-dialog` | `1.1.15` | shadcn 기반 primitives | 후속 phase 설정/삭제 dialog에서 사용 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `Vite + React` | Next.js | SSR 이점은 있으나 현재 phase와 MVP 구조에는 과하다 |
| `packages/contracts` | 서버 패키지에서 타입 직접 export | 빠르지만 프론트/백엔드 경계를 흐린다 |
| `POST + SSE` | WebSocket | stop/regenerate 중심 MVP에는 과도하고 운영 복잡도가 높다 |

**Installation:**
```bash
pnpm add -w typescript @biomejs/biome
pnpm add -F web react react-dom @tanstack/react-router @tanstack/react-query zustand
pnpm add -F server @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config class-validator class-transformer
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
apps/
├── web/                  # Vite React app
└── server/               # NestJS API
packages/
├── contracts/            # Shared API/domain types
└── config/               # Shared TS/Biome presets (optional in Phase 1)
```

### Pattern 1: Server-only OpenRouter Boundary
**What:** OpenRouter 관련 HTTP 세부사항은 `infrastructure/openrouter`에 몰고, service는 내부 입력/출력 타입만 사용한다.
**When to use:** 외부 API 키 보호와 예외 매핑이 필요한 모든 호출.
**Example:**
```ts
export interface StreamChunkHandler {
  onStart(meta: StreamMeta): void;
  onDelta(delta: string): void;
  onDone(finalText: string): void;
  onError(error: Error): void;
}
```

### Pattern 2: Repository Interface Before Storage Choice
**What:** 서비스가 storage adapter를 직접 알지 않고 `ChatRepository` 인터페이스만 안다.
**When to use:** memory/file/PostgreSQL 전환 가능성을 열어 둘 때.
**Example:**
```ts
export interface ChatRepository {
  list(): Promise<ChatSummary[]>;
  create(input: CreateChatInput): Promise<ChatDetail>;
  appendMessage(chatId: string, message: ChatMessage): Promise<void>;
  updateTitle(chatId: string, title: string): Promise<void>;
}
```

### Anti-Patterns to Avoid
- **프론트에서 OpenRouter 직접 호출:** key 노출과 model policy 우회가 발생한다.
- **server DTO를 contracts로 재사용:** validation decorator와 transport type을 섞게 된다.
- **Phase 1에서 실제 chat shell 완성:** foundation 목표를 흐리고 planning을 산만하게 만든다.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| sidebar foundation | custom fixed sidebar | shadcn sidebar + `SidebarProvider` | 이후 phase에서 state, mobile sheet, variant 확장이 쉽다 |
| env parsing | 수동 `process.env` 분기 | Nest config + schema validation | allowlist, key, storage mode 누락을 초기에 잡는다 |
| stream transport format | ad-hoc chunk text | named SSE events | client patching과 디버깅이 단순해진다 |

**Key insight:** Phase 1은 "나중에 버릴 가능성이 높은 임시 구현"이 아니라, 이후 phase가 신뢰하는 foundation을 만드는 단계다. 가장 흔한 실수는 얇게 보이려고 구조까지 임시로 만드는 것이다.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Root scripts without deterministic filtering
**What goes wrong:** `pnpm dev`가 web/server를 일관되게 올리지 못하거나 watch 프로세스가 흩어진다.
**Why it happens:** workspace root 스크립트 설계를 뒤로 미룬다.
**How to avoid:** root `package.json`에서 `dev:web`, `dev:server`, `dev`를 먼저 고정한다.
**Warning signs:** 개발자가 각 앱 디렉터리로 이동해서 따로 실행해야 한다.

### Pitfall 2: Allowlist semantics decided too late
**What goes wrong:** model selector와 backend proxy가 서로 다른 model id 체계를 가진다.
**Why it happens:** `/models` 응답 shape를 초기에 정의하지 않는다.
**How to avoid:** `ModelOption` contracts 타입과 env allowlist 파서 규칙을 Phase 1에 결정한다.
**Warning signs:** 프론트에서 raw upstream model strings를 직접 다루기 시작한다.

### Pitfall 3: Stream contract lacks terminal/error events
**What goes wrong:** stop/regenerate와 partial render에서 state 꼬임이 생긴다.
**Why it happens:** `delta`만 있고 `start/done/error`가 없는 느슨한 프로토콜을 쓴다.
**How to avoid:** 최소 이벤트 세트를 Phase 1에서 고정한다.
**Warning signs:** 클라이언트가 종료 여부를 문자열 끝이나 연결 종료로 추론한다.
</common_pitfalls>

<code_examples>
## Code Examples

### Workspace filtering
```json
{
  "scripts": {
    "dev": "pnpm -r --parallel --filter web --filter server dev",
    "dev:web": "pnpm --filter web dev",
    "dev:server": "pnpm --filter server dev"
  }
}
```

### Model allowlist parsing
```ts
const allowlist = process.env.OPENROUTER_MODEL_ALLOWLIST
  ?.split(',')
  .map((item) => item.trim())
  .filter(Boolean) ?? [];
```

### Stream event contract
```text
event: message:start
data: {"messageId":"m_123","role":"assistant"}

event: message:delta
data: {"messageId":"m_123","delta":"Hello"}

event: message:done
data: {"messageId":"m_123"}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CRA 기반 React 시작 | Vite 기반 React 시작 | 2023+ | 초기 구성과 dev speed가 단순해졌다 |
| local UI/server state 혼합 | Query + local state store 분리 | React app 표준화 흐름 | streaming chat에서 상태 꼬임을 줄인다 |
| light-first shell | dark token + `.dark` 지원을 초기에 포함 | shadcn/tailwind dark-mode 패턴 고착 | 후속 phase에서 theme 재작업을 줄인다 |

**New tools/patterns to consider:**
- React 19 기본 batching 가정 — stream patching 시 불필요한 `flushSync`를 피한다
- Tailwind 4 token-first 설정 — dark theme 변수 계층을 초기 foundation에 넣기 좋다

**Deprecated/outdated:**
- CRA/legacy webpack scaffold — 현재 Phase 1 목적에는 느리고 과거 패턴이다
- 프론트 직접 provider API 호출 — 현재 보안 요구와 맞지 않는다
</sota_updates>

<open_questions>
## Open Questions

1. **OpenRouter streaming payload 세부 shape를 얼마나 추상화할지**
   - What we know: planner 전에 event names는 고정해야 한다
   - What's unclear: upstream chunk를 1:1 중계할지, 내부 표준 이벤트로 정규화할지의 세부 매핑
   - Recommendation: 내부 표준 이벤트로 정규화하고, raw upstream format은 인프라 계층에만 남긴다

2. **Phase 1 테스트 범위**
   - What we know: foundation phase라 검증 인프라와 최소 smoke test가 중요하다
   - What's unclear: web/server 각각 별도 test runner를 둘지, 루트 `pnpm test`만 우선 맞출지
   - Recommendation: Vitest 기반 smoke test를 우선 두고, server는 Nest testing package 기반 헬스/모델 API 테스트만 최소 도입한다
</open_questions>

## Validation Architecture

- Quick loop: `pnpm lint && pnpm typecheck`
- Full loop: `pnpm lint && pnpm typecheck && pnpm test`
- Wave 0에서 test infra가 없으면 먼저 Vitest 기반 smoke test 경로를 생성한다
- Phase 1 검증 포인트는 UI 완성도가 아니라:
  - workspace scripts 동작
  - env schema 실패 시 fast-fail
  - `/api/v1/health` 성공
  - `/api/v1/models`가 allowlist 기준으로 응답

<sources>
## Sources

### Primary (HIGH confidence)
- npm registry metadata — `react`, `vite`, `@tanstack/react-router`, `@tanstack/react-query`, `zustand`, `@nestjs/core`, `@biomejs/biome`, `pnpm`, `tailwindcss`, `typescript` 현재 배포 버전 확인
- `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/PRD.md`, `.planning/TECH-DESIGN.md`, `.planning/phases/01-foundation-secure-proxy/01-CONTEXT.md`

### Secondary (MEDIUM confidence)
- `ui-ux-pro-max` stack/ux guidance — shadcn sidebar, dark mode, focus-visible, overflow 방지 패턴
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: pnpm workspace, Vite React, NestJS
- Ecosystem: TanStack Router/Query, Zustand, Biome, Tailwind/shadcn
- Patterns: proxy boundary, contracts package, repository seam, SSE event contract
- Pitfalls: key exposure, late allowlist design, weak stream protocol

**Confidence breakdown:**
- Standard stack: HIGH - 현재 패키지 메타데이터와 문서 방향이 일치한다
- Architecture: HIGH - 프로젝트 문서의 locked decision이 명확하다
- Pitfalls: HIGH - 이 도메인의 구조적 위험이 잘 알려져 있다
- Code examples: MEDIUM - 구현 골격 예시이며 세부 코드는 planning에서 확정한다

**Research date:** 2026-03-29
**Valid until:** 2026-04-28
</metadata>

---
*Phase: 01-foundation-secure-proxy*
*Research completed: 2026-03-29*
*Ready for planning: yes*
