# Phase 3: Streaming Chat Experience - Research

**Researched:** 2026-03-29
**Domain:** POST SSE streaming, optimistic chat lifecycle, markdown/code rendering in a route-driven chat shell
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- stream transport는 `POST + text/event-stream + fetch parser`로 간다
- 서버는 OpenRouter raw chunk 대신 내부 표준 stream event를 보낸다
- user message는 optimistic append, assistant는 placeholder 후 delta update로 보인다
- auto-scroll은 하단 `120px` 이내일 때만 유지한다
- generation 중 primary action은 `Stop generating`으로 전환한다
- abort 후 partial assistant text는 유지하고 상태만 stopped로 남긴다
- regenerate는 마지막 assistant turn만 대상으로 한다
- assistant markdown은 `react-markdown + remark-gfm` 기준으로 렌더링한다
- code block은 header row에 copy action을 둔다
- Query는 persisted chat state, Zustand는 transient stream session state만 담당한다
- route param은 active conversation의 단일 기준으로 유지된다

### the agent's Discretion
- delta batching 빈도
- placeholder/status microcopy
- copy success feedback 표현 방식

### Deferred Ideas (OUT OF SCOPE)
- title event UI
- 과거 turn regenerate
- 추가 overflow/a11y polish

</user_constraints>

<research_summary>
## Summary

Phase 3의 핵심은 "실제로 빠르게 느껴지는 대화 경험"을 만드는 것이다. 현재 코드베이스는 shell, route, chat CRUD, composer까지 준비돼 있으므로 이번 phase에서 가장 중요한 것은 transport 자체보다 message lifecycle을 일관되게 묶는 것이다. 서버가 표준화된 SSE 이벤트를 보내고, 클라이언트가 optimistic user turn, assistant draft, stop/regenerate, completion commit을 하나의 흐름으로 묶어야 다음 phase의 settings/title/delete가 흔들리지 않는다.

가장 흔한 실패는 세 가지다. 첫째, optimistic UI와 persisted query data가 이중으로 남아 중복 메시지가 보이는 것. 둘째, abort가 UI만 멈추고 서버/stream reader는 계속 살아있는 것. 셋째, markdown/code rendering을 message bubble 수준에서만 처리해 긴 응답 읽기 폭과 scroll behavior가 깨지는 것이다.

**Primary recommendation:** `server-normalized SSE events + fetch stream parser + optimistic placeholder lifecycle + query commit on done + custom markdown/code surface` 조합으로 구현한다.
</research_summary>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Normalized server stream contract
**What:** 서버가 upstream provider 포맷을 숨기고 내부 이벤트 표준으로 변환한다.
**When to use:** OpenRouter chunking 포맷, 에러, finish reason이 프론트까지 새지 않게 하고 싶을 때.
**Why:** provider 교체나 fallback 추가 시 web parser를 다시 쓰지 않아도 된다.

### Pattern 2: Two-layer message state
**What:** persisted messages는 Query cache, in-flight assistant draft와 abort controller는 Zustand에 둔다.
**When to use:** route-driven SPA에서 아직 저장되지 않은 assistant delta를 보여줘야 할 때.
**Why:** 낙관적 렌더링과 완료 후 server truth 합류를 분리할 수 있다.

### Pattern 3: Composer-owned generation control
**What:** active generation 동안 composer action slot이 send에서 stop으로 전환된다.
**When to use:** 사용자가 항상 입력창 근처에서 submit/abort를 제어하도록 할 때.
**Why:** 별도 위치의 stop affordance보다 인지 비용이 낮다.

### Pattern 4: Document-style assistant rendering
**What:** assistant 응답을 작은 bubble 집합이 아니라 읽는 문서 표면처럼 다룬다.
**When to use:** markdown, code block, 표, 목록이 길어지는 AI chat 화면.
**Why:** bubble-first 설계는 긴 응답에서 line length, spacing, overflow가 쉽게 무너진다.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| POST stream parser | ad-hoc `split('\\n\\n')` only parser | event-name/data 프레이밍을 다루는 dedicated parser util | chunk boundary가 임의로 끊길 수 있다 |
| active generation state | component-local booleans 여러 개 | chatId keyed stream session store | route change/abort/regen 일관성이 좋아진다 |
| markdown/code UI | generic prose plugin defaults 그대로 사용 | chat-specific renderer and code block header | dark theme와 copy affordance를 제어하기 쉽다 |
| stop handling | UI button만 끄기 | `AbortController` + reader cleanup + server abort propagation | partial stream 누수와 race를 막는다 |

**Key insight:** Phase 3는 "스트림이 나온다"가 끝이 아니다. optimistic 렌더링, stop, done, retry/regenerate를 모두 한 상태 머신처럼 다뤄야 한다.
</dont_hand_roll>

<ui_ux_findings>
## UI UX Pro Max Findings Applied

### Adopt
- 긴 spinner 대기 대신 token-by-token streaming
- 300ms 이상 지연 시 skeleton/status feedback 제공
- 모바일 가로 스크롤 금지, 코드/표는 내부 scroll만 허용
- focus state 유지와 `prefers-reduced-motion` 존중
- mobile sidebar/trigger 패턴은 Phase 2에서 정한 shadcn 구조를 계속 사용

### Reject or adapt
- design-system 검색의 `App Store Style Landing` 패턴은 현재 phase 목적과 맞지 않아 폐기한다
- typing animation은 과하게 연출하지 않고 실제 token delta 렌더링만 사용한다
- shadcn blocks는 참고만 하고 chat 전용 레이아웃에 맞춰 직접 수정한다
</ui_ux_findings>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Optimistic and persisted messages duplicate
**What goes wrong:** done 이후 user/assistant turn이 local store와 query cache 양쪽에 남아 두 번 렌더링된다.
**How to avoid:** stream 완료 시 local in-flight state를 clear하고, server에서 반환된 chat detail 또는 query invalidation 결과만 남긴다.

### Pitfall 2: Abort leaves dangling readers
**What goes wrong:** stop 버튼은 눌렸는데 stream reader나 fetch 요청이 계속 살아 있어 이후 submit이 꼬인다.
**How to avoid:** `AbortController`, `reader.cancel()`, UI state cleanup를 같은 함수에서 처리한다.

### Pitfall 3: Auto-scroll fights user intent
**What goes wrong:** 사용자가 위 문단을 읽는 동안 새 delta마다 하단으로 강제 점프한다.
**How to avoid:** bottom threshold를 두고, near-bottom일 때만 anchor scroll을 유지한다.

### Pitfall 4: Markdown renderer breaks dark layout
**What goes wrong:** heading/list/table/code default style이 shell 톤과 맞지 않거나 mobile overflow를 만든다.
**How to avoid:** prose 기본값을 그대로 쓰지 말고 message surface 기준 spacing, font, overflow 규칙을 따로 준다.
</common_pitfalls>

<implementation_notes>
## Implementation Notes

### Recommended server additions in this phase
- `apps/server/src/modules/streaming/streaming.service.ts` 추가 또는 확장
- DTO validation: submit/regenerate request body 정리
- OpenRouter client가 provider stream을 internal `StreamEvent`로 변환
- abort signal을 provider request와 repository commit 흐름까지 전달

### Recommended web structure in this phase
```text
apps/web/src/
  lib/
    api/
    stream/
    markdown/
  features/
    chats/
    streaming/
  components/
    chat/
      message-content.tsx
      code-block.tsx
  store/ui/
```

### State split
- Query:
  - `['chat', chatId]` persisted detail patch/invalidation
  - `['chats']` latest metadata refresh
- Zustand:
  - `activeStreamByChatId`
  - `optimisticUserMessages`
  - `assistantDraftByChatId`
  - `shouldAutoScrollByChatId`
</implementation_notes>

<open_questions>
## Open Questions

1. stream 완료 직후 detail 전체를 refetch할지, delta 누적 결과를 캐시에 직접 commit할지
   - Recommendation: Phase 3는 direct patch + settled invalidate를 함께 써서 UX와 일관성을 같이 가져간다.

2. regenerate 중 기존 마지막 assistant 응답을 즉시 교체할지, 새 in-flight block으로 보일지
   - Recommendation: 기존 응답 아래에 새 assistant in-flight block을 생성하지 말고, 마지막 assistant 응답 자리를 대체하는 흐름이 더 자연스럽다.
</open_questions>

## Validation Architecture

- Quick loop: `pnpm lint && pnpm typecheck`
- Full loop: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- Manual checks:
  - submit 후 user turn 즉시 표시, assistant delta가 점진적으로 누적
  - generation 중 stop 동작, partial 응답 유지, 재전송 가능
  - regenerate가 마지막 assistant turn만 다시 생성
  - markdown heading/list/table/code block이 dark theme에서 읽기 좋게 보임
  - mobile width에서 code/table이 page overflow를 만들지 않음

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/PRD.md`, `.planning/TECH-DESIGN.md`
- `.planning/phases/02-conversational-shell-ui/02-CONTEXT.md`
- `.planning/phases/02-conversational-shell-ui/02-03-SUMMARY.md`
- `apps/server/src/modules/streaming/streaming.controller.ts`
- `apps/web/src/routes/chat/$chatId.tsx`
- `apps/web/src/store/ui/chat-shell-store.ts`
- `apps/web/src/lib/api/index.ts`

### Secondary (MEDIUM confidence)
- `ui-ux-pro-max --design-system`: AI-native UI style, heavy chrome 회피, fast feedback 강조
- `ui-ux-pro-max --domain ux`: streaming feedback, loading indicator, horizontal scroll, reduced motion 가이드
- `ui-ux-pro-max --stack shadcn`: `SidebarTrigger` 유지, blocks 직접 커스터마이즈 원칙
</sources>
