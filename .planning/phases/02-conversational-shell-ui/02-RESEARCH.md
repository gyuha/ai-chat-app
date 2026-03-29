# Phase 2: Conversational Shell UI - Research

**Researched:** 2026-03-29
**Domain:** route-driven conversational shell, onboarding/empty chat UX, sidebar-first app navigation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- desktop 고정 sidebar + mobile sheet 2단 shell로 간다
- `/`는 최근 chat redirect 또는 onboarding empty state로 동작한다
- `새 채팅`은 create mutation 후 `/chat/$chatId`로 이동한다
- active chat 기준은 route param 하나로 통일한다
- empty state는 설명 + CTA + 예시 프롬프트 + 모델/보안 힌트를 함께 보여준다
- composer는 multiline textarea, `Enter` 전송, `Shift+Enter` 줄바꿈으로 고정한다
- 역할 표현은 `user` 우측 bubble, `assistant` 좌측 block, `system` muted card로 구분한다
- Phase 2는 최소 chats REST API를 함께 추가한다
- TanStack Query는 서버 상태만, Zustand는 UI 상태만 다룬다
- 브라우저는 계속 `/api/v1/*`만 호출한다
- focus-visible, keyboard order, mobile sheet focus restore, `aria-live` 영역을 foundation에서부터 유지한다

### the agent's Discretion
- empty state microcopy와 아이콘
- example prompt interaction detail
- list item secondary metadata

### Deferred Ideas (OUT OF SCOPE)
- streaming, stop/regenerate
- markdown/code renderer
- settings surface

</user_constraints>

<research_summary>
## Summary

Phase 2의 핵심은 "채팅이 실제 제품처럼 느껴지는 shell을 만들되, 아직 Phase 3의 스트리밍 복잡도는 들이지 않는 것"이다. 따라서 UI 구조와 route semantics를 먼저 고정하고, list/create/detail 수준의 최소 chat API를 연결해 가짜 shell이 아니라 실제 데이터가 흐르는 shell을 만드는 접근이 가장 안전하다.

가장 흔한 실패는 root route에서 chat를 자동 생성해 중복 record가 쌓이거나, active chat을 route와 local state 둘 다에 저장해 sidebar highlight가 어긋나는 것이다. 이 phase는 route를 source of truth로 두고, mutation은 명시적 사용자 액션(`새 채팅`, sidebar click)에서만 발생하게 해야 한다.

**Primary recommendation:** `route-driven shell + query-backed chats list/detail + zustand UI state + shadcn sidebar/sheet primitives` 조합으로 Phase 2를 마무리한다.
</research_summary>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Route-driven active chat
**What:** 현재 보고 있는 chat은 항상 `/chat/$chatId` route param이 결정한다.
**When to use:** sidebar selection, header title 표시, composer draft lookup, chat detail query key 구성.
**Why:** active item 시각 상태와 navigation state가 분리되지 않는다.

### Pattern 2: Dual empty states with shared tone
**What:** `/` onboarding empty state와 `/chat/$chatId` empty conversation state를 나누되, typography/palette/prompt card language는 공유한다.
**When to use:** 첫 진입과 새 채팅 직후 empty conversation의 목적이 다를 때.
**Why:** 앱 진입과 실제 대화 시작이 섞이면 UX가 흐려진다.

### Pattern 3: Query for data, Zustand for shell affordances
**What:** chats list/detail/create는 TanStack Query, sidebar open/mobile sheet open/composer draft는 Zustand.
**When to use:** route-driven SPA에서 optimistic shell을 만들 때.
**Why:** server state와 ephemeral UI state를 섞으면 invalidation과 restore 로직이 복잡해진다.

### Pattern 4: Minimal REST before streaming
**What:** `GET /chats`, `POST /chats`, `GET /chats/:chatId`를 먼저 만들고 streaming endpoint는 그대로 다음 phase로 둔다.
**When to use:** UI shell이 실제 데이터를 필요로 하지만 Phase scope가 아직 streaming이 아닐 때.
**Why:** mock-only shell보다 후속 phase 연결 비용이 낮다.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| sidebar/mobile nav | bespoke drawer logic | shadcn/sidebar + sheet/trigger 패턴 | keyboard/focus/mobile 대응이 안정적이다 |
| active chat selection | local selectedId state | route param 기반 판별 | refresh/back-forward와 일관성이 생긴다 |
| empty state cards | decorative card만 있는 hero | clickable prompt action cards | 시작 행동이 분명해야 한다 |
| chat data bootstrap | UI-only mock array | 실제 chats list/create/detail API | Phase 3와 4 연결 시 재작업을 줄인다 |

**Key insight:** Phase 2는 "보이는 것만" 만드는 phase가 아니다. 이후 streaming과 settings가 올라갈 수 있도록 shell semantics를 먼저 고정하는 phase다.
</dont_hand_roll>

<ui_ux_findings>
## UI UX Pro Max Findings Applied

### Adopt
- visible focus ring 유지
- keyboard navigation 순서는 시각 순서와 일치
- empty state는 action과 guidance를 함께 제공
- sidebar는 provider + trigger 구조로 두고 mobile toggle을 별도 custom button 로직으로 흩뿌리지 않는다
- dynamic status용 `aria-live="polite"` 영역을 미리 둔다

### Reject or adapt
- 검색 결과의 landing/app-store 스타일 제안은 현재 app shell phase 목적과 맞지 않으므로 채택하지 않는다
- Inter typography 추천은 참고만 하고, 프로젝트의 기존 `Fira Sans + Fira Code` 방향을 유지한다
</ui_ux_findings>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Root route auto-creates duplicate chats
**What goes wrong:** 사용자가 `/`로 들어올 때마다 빈 chat이 계속 생긴다.
**How to avoid:** create는 명시적 `새 채팅` 액션에서만 수행한다. `/`는 redirect or onboarding만 담당한다.

### Pitfall 2: Sidebar active state diverges from route
**What goes wrong:** highlight는 A인데 실제 chat pane은 B를 보여준다.
**How to avoid:** `chatId` route param만 source of truth로 쓴다.

### Pitfall 3: Composer height causes layout jumping
**What goes wrong:** textarea 확장 시 message region이 갑자기 크게 밀린다.
**How to avoid:** composer 최소/최대 높이를 고정하고 scroll container와 분리한다.

### Pitfall 4: Mobile sidebar traps focus incorrectly
**What goes wrong:** sheet를 닫은 뒤 focus가 사라지거나 tab order가 꼬인다.
**How to avoid:** trigger ref와 focus restore를 규칙으로 잡고, shadcn/radix primitive를 그대로 활용한다.
</common_pitfalls>

<implementation_notes>
## Implementation Notes

### Recommended server additions in this phase
- `GET /api/v1/chats` — 최근 업데이트 순 목록
- `POST /api/v1/chats` — 기본 settings를 가진 새 chat 생성
- `GET /api/v1/chats/:chatId` — 메시지 포함 상세 반환

### Recommended web structure in this phase
```text
apps/web/src/
  routes/
    __root.tsx
    index.tsx
    chat/$chatId.tsx
  components/
    shell/
    chat/
    feedback/
  features/
    chats/
    composer/
  store/ui/
```

### State split
- Query:
  - `['models']`
  - `['chats']`
  - `['chat', chatId]`
- Zustand:
  - `sidebarOpen`
  - `mobileSidebarOpen`
  - `draftByChatId`
  - `composerFocusIntent` 정도의 얕은 UI 상태
</implementation_notes>

<open_questions>
## Open Questions

1. example prompt 클릭 시 draft fill과 즉시 전송 중 어느 쪽이 더 자연스러운가
   - Recommendation: Phase 2는 draft fill 우선. Phase 3 streaming 이후 즉시 전송 UX를 다시 검토한다.

2. empty conversation state에서 model badge를 어느 수준까지 노출할 것인가
   - Recommendation: 설정 UI가 아직 없으므로 read-only badge + 짧은 설명까지만 둔다.
</open_questions>

## Validation Architecture

- Quick loop: `pnpm lint && pnpm typecheck`
- Full loop: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- Manual checks:
  - keyboard only로 새 채팅 생성, sidebar 탐색, composer focus 이동 가능
  - 모바일 폭에서 sidebar가 sheet로 열리고 닫힌 뒤 focus가 trigger로 복귀
  - `/` 진입 시 chat이 없으면 onboarding, 있으면 latest chat redirect
  - 새 chat 생성 직후 empty conversation state가 즉시 보임

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/PRD.md`, `.planning/TECH-DESIGN.md`
- `.planning/phases/01-foundation-secure-proxy/01-CONTEXT.md`
- `.planning/phases/01-foundation-secure-proxy/01-03-SUMMARY.md`
- `apps/web/src/app/providers/index.tsx`
- `apps/web/src/components/ui/sidebar.tsx`
- `apps/web/src/routes/index.tsx`

### Secondary (MEDIUM confidence)
- `ui-ux-pro-max` UX guidance: focus states, keyboard navigation, empty states
- `ui-ux-pro-max` shadcn guidance: `SidebarProvider`, `SidebarTrigger`, sidebar navigation pattern
</sources>
