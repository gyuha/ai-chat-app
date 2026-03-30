# Phase 3: 무료 모델 선택과 대화 부트스트랩 - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

이 phase는 무료 모델 목록을 실제로 조회하고, 새 대화 생성 흐름과 대화별 모델 메타데이터를 연결하는 단계다. 구체적으로는 새 대화 draft lifecycle, 헤더 기반 모델 선택 UX, 무료 모델 탐색 surface, conversation record의 초기 메타데이터 저장 규칙을 고정한다. 실제 메시지 송수신, SSE 스트리밍, assistant markdown 렌더링, 토큰 단위 응답 업데이트는 다음 phase로 넘긴다.

</domain>

<decisions>
## Implementation Decisions

### 새 대화 생성 시점
- **D-01:** 사용자가 `새 대화 시작`을 누르면 conversation 레코드를 즉시 생성한다.
- **D-02:** 새 대화 생성 시 저장된 `defaultModelId`가 있으면 해당 값을 `modelId`에 바로 채운다.
- **D-03:** 저장된 `defaultModelId`가 없으면 `modelId` 없이 draft conversation을 생성한다.
- **D-04:** `modelId`가 없는 draft conversation에서는 입력창을 비활성화하고 모델 선택 유도 배너를 보여준다.
- **D-05:** 모델이 선택되지 않은 draft conversation은 하나만 허용하고, 이미 존재하면 새로 만들지 않고 그 draft로 다시 이동한다.

### 모델 선택 UX 위치
- **D-06:** 모델 선택의 주 진입점은 상단 헤더 드롭다운으로 둔다.
- **D-07:** `modelId`가 없는 draft conversation에서는 본문 배너에 설명과 `모델 선택` CTA를 함께 제공한다.
- **D-08:** `modelId`가 있는 conversation에서도 헤더에서 현재 conversation의 모델을 변경할 수 있게 한다.
- **D-09:** 헤더에서 모델을 변경하면 별도 확인 없이 현재 conversation 메타데이터에 즉시 저장한다.

### the agent's Discretion
- 헤더 드롭다운의 정확한 정보 밀도와 label formatting
- draft conversation 배너의 세부 copy와 CTA 문구
- 사이드바 목록에서 draft conversation을 어떻게 시각적으로 구분할지에 대한 미세 표현
- `modelId` 변경 직후 토스트/인라인 피드백을 추가할지 여부
- conversation 생성 시점의 `updatedAt`, placeholder title, optimistic persistence 처리 방식

</decisions>

<specifics>
## Specific Ideas

- 새 대화 흐름은 ChatGPT 유사 shell을 유지하되, 모델이 없으면 입력보다 선택을 먼저 요구하는 쪽을 우선한다.
- 기본 모델 설정은 새 대화 생성 속도를 높이는 보조 장치로 활용하고, 없을 때만 명시적 선택 유도를 강화한다.
- 모델 선택 surface는 헤더를 기준으로 일관되게 유지하고, 미완성 상태에서만 본문 CTA를 추가해 구조 중복을 최소화한다.
- 미완성 draft conversation이 사이드바에 누적되지 않게 하여 목록 품질을 지킨다.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 제품 범위와 요구사항
- `.planning/PROJECT.md` — 프론트엔드 전용 구조, 한국어 UI, IndexedDB 저장 원칙
- `.planning/ROADMAP.md` — Phase 3 목표, 성공 기준, dependency chain
- `.planning/REQUIREMENTS.md` — `MODL-01`~`MODL-03`, `CONV-01`, `DATA-03` 정의

### 이미 잠긴 상위 결정
- `.planning/phases/01-app-shell-and-interface-foundation/01-CONTEXT.md` — ChatGPT 유사 shell, 모바일 `Sheet`, 빈 상태/헤더 기준
- `.planning/phases/01-app-shell-and-interface-foundation/01-UI-SPEC.md` — layout, interaction, visual tone contract
- `.planning/phases/02-api-key-and-settings-management/02-CONTEXT.md` — `defaultModelId`와 글로벌 시스템 프롬프트의 적용 범위, settings 저장 정책
- `AGENTS.md` — 한국어 문서 작성, UI 관련 작업 시 `ui-ux-pro-max` 동시 사용 규칙

### 현재 코드 기준선
- `src/components/layout/app-header.tsx` — 현재 헤더 action 구조와 mobile `새 대화` 액션 위치
- `src/components/chat/chat-empty-state.tsx` — 새 대화/설정 CTA를 가진 홈 빈 상태
- `src/components/layout/conversation-list.tsx` — 현재 mock 기반 대화 목록 구조
- `src/hooks/use-free-models-query.ts` — 무료 모델 조회와 invalid default model 정리 흐름
- `src/lib/settings-service.ts` — settings persistence와 default model 저장 규칙

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/hooks/use-free-models-query.ts` — 저장된 API 키를 사용해 무료 모델만 조회하고 invalid default model을 정리하는 query가 이미 있다.
- `src/lib/openrouter-client.ts` — `pricing.prompt === "0"` && `pricing.completion === "0"` 기준의 free model filtering 로직이 준비되어 있다.
- `src/lib/settings-service.ts` + `src/hooks/use-settings-query.ts` — `defaultModelId`, `globalSystemPrompt`를 settings store에 저장/조회하는 기반이 있다.
- `src/components/layout/new-chat-button.tsx`, `src/components/layout/app-header.tsx`, `src/components/chat/chat-empty-state.tsx` — 새 대화 진입점이 이미 배치되어 있다.

### Established Patterns
- route leaf가 route별 상태 surface를 교체하고, shell은 공통으로 유지하는 구조다.
- settings 관련 즉시 저장 정책은 TanStack Query action wrapper + Dexie persistence 조합으로 이미 잠겨 있다.
- 한국어 인라인 상태와 토스트를 함께 쓰는 UX 패턴이 Phase 1/2에서 고정되었다.

### Integration Points
- `/` route: 저장된 API 키가 있으면 빈 상태 홈을 보이므로, 새 대화 생성과 첫 모델 선택의 주요 진입점이 된다.
- `/chat/$conversationId` route: draft/selected model 상태에 따라 배너, 헤더 드롭다운, placeholder message pane이 교체되어야 한다.
- sidebar conversation list: mock data를 실제 Dexie conversation 데이터와 연결해야 한다.
- conversation persistence: 새 대화 생성 시 `id`, `title`, `modelId`, `systemPrompt`, `createdAt`, `updatedAt`가 초기화되어야 한다.

</code_context>

<deferred>
## Deferred Ideas

- 무료 모델 목록 검색/정렬/세부 메타데이터 노출 범위
- 모델 선택 후 title 생성 규칙과 첫 메시지 작성 전후의 metadata 갱신 세부 조건
- 모델 변경 이후 기존 message history와의 관계 정의

</deferred>

---

*Phase: 03-free-model-selection-and-conversation-bootstrap*
*Context gathered: 2026-03-31*
