# Phase 3: Streaming Chat Experience - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

이 phase는 이미 만들어진 conversational shell 위에 실제 스트리밍 대화 경험을 올리는 단계다. 서버의 `POST + text/event-stream` 엔드포인트를 실제 OpenRouter 프록시 흐름으로 연결하고, 클라이언트는 user turn 제출부터 assistant delta 렌더링, stop, regenerate, markdown/code rendering까지 자연스럽게 처리해야 한다. 설정 UI, 제목 자동 생성, 대화 삭제, 고급 오류 surface는 다음 phase로 넘긴다.

</domain>

<decisions>
## Implementation Decisions

### Streaming contract and transport
- **D-01:** transport는 계속 `POST /api/v1/chats/:chatId/messages/stream` 및 `POST /api/v1/chats/:chatId/regenerate/stream` + `text/event-stream` 조합을 유지한다. WebSocket이나 browser direct upstream 호출은 도입하지 않는다.
- **D-02:** 서버는 OpenRouter raw chunk를 그대로 전달하지 않고, 내부 표준 이벤트(`meta`, `message:start`, `message:delta`, `message:done`, `error`, `heartbeat`)로 정규화해서 보낸다.
- **D-03:** 클라이언트는 `fetch` 기반 SSE parser를 사용해 `ReadableStream`을 직접 읽는다. EventSource는 `POST`를 지원하지 않으므로 사용하지 않는다.

### Message lifecycle and optimistic behavior
- **D-04:** 사용자가 전송하면 user message는 즉시 local optimistic message로 보이고, assistant placeholder도 바로 추가된다. 첫 토큰 전에는 skeleton 한 줄 또는 muted status row로 "응답 생성 중" 상태를 보여준다.
- **D-05:** assistant stream은 token-by-token으로 기존 placeholder를 갱신한다. 스트리밍이 끝나면 query cache와 UI 상태를 정리해 persisted chat detail이 단일 기준이 되도록 합친다.
- **D-06:** auto-scroll은 사용자가 하단에서 `120px` 이내일 때만 유지한다. 사용자가 위로 스크롤한 상태에서는 새 delta가 와도 강제로 점프하지 않는다.

### Stop and regenerate controls
- **D-07:** generation 중에는 composer의 primary action slot이 `Send`에서 `Stop generating`으로 전환된다. 별도 floating stop button은 만들지 않는다.
- **D-08:** stop은 현재 활성 stream 하나만 중단한다. abort 후 이미 수신된 assistant 텍스트는 partial 응답으로 유지하고, 상태만 `stopped`로 바꾼다.
- **D-09:** regenerate는 마지막 assistant 응답 1개만 대상으로 한다. 직전 user turn을 재사용하며, 과거 중간 turn 선택 regenerate UI는 Phase 4 이후로 미룬다.

### Markdown and code reading rules
- **D-10:** assistant content는 `react-markdown + remark-gfm` 기준으로 렌더링한다. 목록, 인라인 코드, fenced code, 표, blockquote까지 Phase 3 범위에 포함한다.
- **D-11:** 코드 블록은 언어 라벨과 copy action을 header row에 둔다. copy는 블록 단위로만 제공하고, inline code copy는 추가하지 않는다.
- **D-12:** markdown surface는 dark theme에서 본문 가독성을 우선한다. bubble 안에 모든 스타일을 우겨넣지 말고, assistant block 자체를 "읽는 문서"처럼 취급한다.

### State boundary and cache ownership
- **D-13:** TanStack Query는 persisted chat detail/list를 기준으로 유지하고, stream 중간 patch와 완료 후 invalidation/commit을 담당한다.
- **D-14:** Zustand는 active stream metadata만 가진다. 예: `AbortController`, 현재 generating chat id, local optimistic user message, pending assistant draft, auto-scroll intent.
- **D-15:** route param(`chatId`)은 계속 active conversation의 단일 기준이다. streaming session도 route를 벗어나면 정리되거나 안전하게 중단돼야 한다.

### Accessibility and feedback
- **D-16:** `aria-live="polite"` 영역은 `응답 생성 중`, `응답 중단됨`, `재생성 완료`, `복사됨` 같은 짧은 문장만 요약한다. delta 전체를 screen reader에 계속 읽히게 하지 않는다.
- **D-17:** stream 관련 motion은 과장하지 않는다. cursor blink나 typing animation은 최소화하고, `prefers-reduced-motion`에서는 skeleton pulse도 줄인다.
- **D-18:** 모바일에서도 composer, stop 버튼, code block copy가 한 손 사용 기준으로 눌리도록 터치 타겟을 유지한다. markdown/code/table은 내부 스크롤만 허용하고 페이지 가로 스크롤은 금지한다.

### the agent's Discretion
- **D-19:** delta chunk를 문자 단위로 바로 그릴지, 짧은 frame batching을 둘지는 render cost를 보며 implementer가 결정한다.
- **D-20:** assistant placeholder의 구체 카피(`Thinking...`, `응답 생성 중` 등)와 icon choice는 현재 visual language에 맞춰 조정한다.
- **D-21:** code block copy 성공 피드백을 tooltip으로 둘지 inline text로 둘지는 shadcn 조합과 복잡도를 보고 선택한다.

</decisions>

<specifics>
## Specific Ideas

- `[auto] transport` → `fetch + ReadableStream` 기반 POST SSE parser
- `[auto] message flow` → user optimistic append + assistant placeholder 즉시 생성
- `[auto][ui-ux-pro-max]` → 긴 spinner 대기 금지, 첫 토큰 전에도 상태 피드백 제공
- `[auto][ui-ux-pro-max]` → 사용자가 하단 근처에 있을 때만 auto-scroll 유지
- `[auto][ui-ux-pro-max]` → stop은 composer action slot에서 send를 대체
- `[auto][ui-ux-pro-max]` → markdown/code는 shadcn block을 그대로 쓰지 않고 chat reading surface에 맞게 커스터마이즈
- `Fira Sans + Fira Code`, dark OLED palette, sidebar/mobile trigger 패턴은 Phase 2 결정을 그대로 유지한다

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product scope and phase contract
- `.planning/PROJECT.md` — 제품 목표, 보안/확장성 제약, MVP 원칙
- `.planning/REQUIREMENTS.md` — `MSG-02`, `MSG-03`, `MSG-04`, `MSG-05`, `REND-01`, `REND-02` 정의
- `.planning/ROADMAP.md` — Phase 3 목표, 성공 기준, 3-plan 분해

### UX and architecture
- `.planning/PRD.md` — `UX/UI 설계 원칙`의 스트리밍, 메시지, 반응형, 접근성 규칙
- `.planning/TECH-DESIGN.md` — 스트림 이벤트 표준, 상태관리 역할 분리, API 설계 초안
- `.planning/phases/02-conversational-shell-ui/02-CONTEXT.md` — shell 구조, route ownership, message presentation baseline
- `.planning/phases/02-conversational-shell-ui/02-03-SUMMARY.md` — 현재 shell/data readiness와 local preview 한계

### Existing code anchors
- `apps/server/src/modules/streaming/streaming.controller.ts` — SSE skeleton과 현재 event naming
- `apps/server/src/modules/chats/chats.service.ts` — persisted chat/message update 진입점
- `apps/web/src/routes/chat/$chatId.tsx` — 현재 local preview 기반 chat route
- `apps/web/src/store/ui/chat-shell-store.ts` — draft/local message UI 상태
- `apps/web/src/lib/api/index.ts` — internal API helper와 fetch wrapper 규칙
- `packages/contracts/src/index.ts` — `ChatMessage`, `ChatDetail`, `StreamEvent` contract anchor

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/server/src/modules/streaming/streaming.controller.ts` — SSE header 설정과 event write helper가 이미 있다
- `apps/server/src/modules/chats/chats.service.ts` — chat detail과 message persistence를 담당하는 서비스 경계가 이미 있다
- `apps/web/src/components/chat/message-list.tsx` / `message-bubble.tsx` — 역할별 기본 레이아웃이 있어 renderer만 확장하면 된다
- `apps/web/src/features/composer/prompt-composer.tsx` — send/keyboard 규칙과 action slot이 이미 잡혀 있다

### Established Patterns
- 브라우저는 `/api/v1/*`만 호출하고, OpenRouter는 server-only boundary로 유지된다
- active chat은 route param 하나로만 판별한다
- Query는 서버 상태, Zustand는 UI 상태라는 원칙이 이미 코드와 문서에 반영돼 있다

### Integration Points
- server streaming plan은 `streaming` module과 `chats` persistence/service 경계를 함께 손봐야 한다
- web streaming plan은 `lib/api`, `lib/stream`, `features/chats`, `routes/chat/$chatId.tsx`, `store/ui`를 동시에 만질 가능성이 높다
- markdown/code rendering은 `components/chat`과 `lib/markdown` 방향으로 분리하는 것이 자연스럽다

</code_context>

<deferred>
## Deferred Ideas

- assistant별 세부 token latency telemetry UI
- turn별 context menu와 과거 메시지 regenerate
- 제목 자동 생성 이벤트(`title`)의 실제 표시 UX
- 표/긴 코드/긴 목록의 추가 layout polish와 virtualization 수준 개선

</deferred>

---
*Phase: 03-streaming-chat-experience*
*Context gathered: 2026-03-29*
