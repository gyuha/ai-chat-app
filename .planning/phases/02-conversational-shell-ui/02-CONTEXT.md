# Phase 2: Conversational Shell UI - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

이 phase는 채팅 제품처럼 보이고 사용할 수 있는 기본 conversational shell을 완성하는 단계다. 좌측 사이드바, 빈 대화 상태, route-driven chat 화면, composer, 역할이 구분되는 기본 메시지 레이아웃까지 포함한다. 스트리밍, stop/regenerate, markdown/code rendering, 설정 UI 완성은 다음 phase들로 넘긴다.

</domain>

<decisions>
## Implementation Decisions

### Shell information architecture
- **D-01:** 데스크톱은 좌측 고정 sidebar + 우측 메인 chat pane 2단 구조로 간다. sidebar 기본 폭은 `280px`이고 Phase 2에서는 desktop collapse 토글보다 안정적인 기본 구조를 우선한다.
- **D-02:** 모바일에서는 sidebar를 항상 sheet로 전환하고, 상단 왼쪽의 trigger 버튼으로 연다. `ui-ux-pro-max` 권고대로 sidebar 상태는 layout-level `SidebarProvider`에서 관리한다.
- **D-03:** 메인 chat pane은 `header + scrollable message region + bottom composer` 구조를 유지한다. 실제 읽기 폭은 `72ch` 이하, 전체 content max width는 `840px`를 넘기지 않는다.

### Route and chat entry flow
- **D-04:** `/`는 "workspace entry" route로 유지한다. 대화가 있으면 최근 대화로 redirect하고, 없으면 onboarding empty state를 보여준다.
- **D-05:** `새 채팅` 액션은 최소 chat record를 생성한 뒤 `/chat/$chatId`로 이동한다. 새로 생성된 chat은 즉시 비어 있는 conversation screen을 보여줘야 한다.
- **D-06:** active chat 판별은 route param(`chatId`)을 단일 기준으로 삼고, sidebar 선택 상태는 별도 중복 상태로 저장하지 않는다.

### Empty state and first-use experience
- **D-07:** empty state는 "아무 것도 없는 화면"이 아니라 제품 소개 1문장, 예시 프롬프트 3개, 새 채팅 시작 CTA, 현재 모델/보안 안내를 함께 보여준다.
- **D-08:** `/`의 onboarding empty state와 `/chat/$chatId`의 empty conversation state는 톤은 같게 유지하되 역할을 나눈다. 전자는 제품 진입, 후자는 실제 대화 시작 맥락에 집중한다.
- **D-09:** 예시 프롬프트는 decorative card가 아니라 클릭 가능한 quick action으로 만든다. 클릭 시 해당 프롬프트가 composer에 채워지거나 즉시 전송 가능한 구조를 planner가 선택한다.

### Composer interaction
- **D-10:** composer는 multiline textarea를 사용한다. `Enter`는 전송, `Shift+Enter`는 줄바꿈으로 고정한다.
- **D-11:** textarea는 모바일/데스크톱 모두 최소 2줄 시각 높이를 유지하고, 최대 6줄까지만 자동 확장한다. 그 이후는 내부 스크롤로 처리한다.
- **D-12:** Phase 2에서는 전송 버튼만 제공하고 `Stop generating` 버튼은 포함하지 않는다. 다만 button slot과 상태 문구 위치는 Phase 3 확장을 고려해 미리 잡아 둔다.

### Message presentation rules
- **D-13:** 역할 표현은 지금부터 분명히 고정한다. `user`는 우측 강조 bubble, `assistant`는 좌측 가독성 중심 block, `system`은 muted inset card로 표시한다.
- **D-14:** 아직 markdown renderer는 없지만, 긴 plain text가 어색하지 않도록 line-height, paragraph spacing, bubble padding, max width 규칙을 먼저 적용한다.
- **D-15:** empty chat에서도 향후 assistant 응답이 들어올 위치와 scroll rhythm이 드러나도록 message column spacing을 실제 채팅 화면 기준으로 설계한다.

### Data and integration boundary
- **D-16:** Phase 2는 UI phase이지만, 실제 sidebar/chat route를 동작시키기 위해 최소 chats REST API(`list/create/detail`)를 함께 추가한다.
- **D-17:** TanStack Query는 `models`, `chats list`, `chat detail`, `create chat` mutation만 담당한다. composer draft, mobile sheet open, sidebar UI 상태는 Zustand가 담당한다.
- **D-18:** 브라우저는 계속 `/api/v1/*`만 호출한다. OpenRouter upstream, stream parsing, regenerate는 Phase 3 이전까지 web 계층에 드러나지 않는다.

### Accessibility baseline
- **D-19:** 모든 주요 액션은 키보드로 접근 가능해야 하고, `focus-visible` ring을 제거하지 않는다.
- **D-20:** 모바일 sidebar sheet, dialog 성격의 overlay는 열릴 때 첫 interactive control로 focus를 이동하고, 닫을 때 trigger로 focus를 돌려준다.
- **D-21:** dynamic status 요약 영역(`aria-live="polite"`)은 Phase 2부터 배치하되, 실제 streaming 문구는 Phase 3에서 확장한다.

### the agent's Discretion
- **D-22:** Lucide icon 선택, exact spacing token 이름, empty state microcopy의 최종 문구는 planner/implementer 재량으로 둔다.
- **D-23:** example prompt 클릭 시 "composer만 채움"과 "즉시 전송" 중 어느 방식을 먼저 택할지는 구현 복잡도와 UX 일관성을 보고 planner가 결정한다.
- **D-24:** chat list item의 secondary metadata를 timestamp로 둘지 model badge로 둘지는 Phase 2 안에서 더 단순한 쪽을 고른다.

</decisions>

<specifics>
## Specific Ideas

- `[auto] Route 기본값` → `/`는 최근 chat redirect 또는 onboarding empty state
- `[auto] New chat flow` → create mutation 직후 `/chat/$chatId` 이동
- `[auto][ui-ux-pro-max]` → mobile sidebar는 custom drawer가 아니라 sheet/trigger 패턴을 따른다
- `[auto][ui-ux-pro-max]` → 빈 상태는 blank screen 금지, action + guidance + examples 조합으로 구성한다
- `[auto][ui-ux-pro-max]` → focus ring, keyboard order, aria-live 영역을 foundation 단계에서 배치한다
- 기존 PRD의 dark OLED palette와 `Fira Sans + Fira Code` 조합을 계속 유지한다

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product scope and requirements
- `.planning/PROJECT.md` — 제품 목표, 다크 conversational workspace 방향, 보안/확장성 제약
- `.planning/REQUIREMENTS.md` — `SHELL-01`, `SHELL-02`, `SHELL-03`, `CHAT-01`, `MSG-01`, `REND-04`, `FB-01` 정의
- `.planning/ROADMAP.md` — Phase 2 목표, 성공 기준, plan 분해 기준

### UX and UI contract
- `.planning/PRD.md` — `UI UX Pro Max 초기 제안`, `정보 구조`, `UX/UI 설계 원칙`, `화면 목록 및 책임`, `shadcn/ui 후보`
- `.planning/TECH-DESIGN.md` — `프론트엔드 구조`, `라우팅 구조`, `상태관리 설계`, `API 설계`

### Prior phase outputs
- `.planning/phases/01-foundation-secure-proxy/01-CONTEXT.md` — server-only boundary, sidebar provider foundation, smoke path 범위
- `.planning/phases/01-foundation-secure-proxy/01-03-SUMMARY.md` — 현재 web shell의 한계와 Phase 2 readiness

### Existing code anchors
- `apps/web/src/app/providers/index.tsx` — 현재 query/sidebar provider wiring
- `apps/web/src/components/ui/sidebar.tsx` — sidebar foundation
- `apps/web/src/routes/__root.tsx` — root route 구조
- `apps/web/src/routes/index.tsx` — current smoke screen
- `apps/web/src/lib/api/index.ts` — internal API helper pattern

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/web/src/components/ui/sidebar.tsx` — layout-level sidebar state와 desktop aside foundation이 이미 있다
- `apps/web/src/app/providers/index.tsx` — `QueryClientProvider`와 `SidebarProvider`가 이미 연결돼 있다
- `apps/web/src/lib/api/index.ts` — fetch wrapper와 internal API base 규칙이 있다
- `packages/contracts/src/index.ts` — `ChatSummary`, `ChatDetail`, `ChatMessage`, `ChatSettings`, `ModelOption` 타입을 확장 없이 바로 쓸 수 있다

### Established Patterns
- web은 TanStack Query 기반 server-state consumption을 이미 쓰고 있다
- route는 TanStack Router 코드 기반 구성으로 유지한다
- server는 `CoreModule` 기반 DI와 server-only OpenRouter boundary를 고정했다

### Integration Points
- Phase 2 web은 `routes`, `features`, `components/shell`, `components/chat`, `store/ui` 방향으로 확장하는 것이 자연스럽다
- Phase 2 plan 03은 sidebar와 route를 실제 데이터에 연결하기 위해 `apps/server/src/modules/chats/*` 최소 CRUD를 추가해야 한다
- message UI는 아직 renderer 복잡도가 낮으므로 plain text first로 두고, markdown/code는 Phase 3 renderer로 넘긴다

</code_context>

<deferred>
## Deferred Ideas

- desktop sidebar collapse 토글의 완성형 UX — 필요하면 Phase 5 polish에서 다룬다
- stop/regenerate 버튼과 streaming status detail — Phase 3
- markdown/code/table renderer 완성 — Phase 3, 5
- settings dialog와 model/system prompt 편집 — Phase 4

</deferred>

---
*Phase: 02-conversational-shell-ui*
*Context gathered: 2026-03-29*
