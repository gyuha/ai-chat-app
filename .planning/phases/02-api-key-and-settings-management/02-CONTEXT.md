# Phase 2: API 키와 설정 관리 - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

이 phase는 사용자가 OpenRouter API 키를 등록, 검증, 교체, 삭제하고 기본 모델 및 글로벌 시스템 프롬프트를 로컬 설정으로 저장할 수 있게 만드는 단계다. 핵심은 settings/onboarding UI에 실제 저장/검증 로직을 연결하는 것이며, 무료 모델 조회 자체를 본격적으로 탐색하거나 대화별 모델 선택을 완성하는 일은 다음 phase로 넘긴다.

</domain>

<decisions>
## Implementation Decisions

### API 키 저장 정책
- **D-01:** API 키는 `GET /models` 검증이 성공한 뒤에만 IndexedDB에 저장한다.
- **D-02:** 검증 실패 시 입력 필드의 draft 값은 유지하고, 저장된 key는 변경하지 않는다.
- **D-03:** 이미 저장된 key가 있을 때는 새 key 검증이 성공한 경우에만 기존 key를 교체한다.
- **D-04:** API 키 삭제는 확인 다이얼로그 후 즉시 수행하고, 저장된 settings 상태를 바로 갱신한다.

### 키 검증 흐름
- **D-05:** 키 검증은 자동 debounce가 아니라 사용자의 `모델 목록 확인` 버튼 클릭으로만 시작한다.
- **D-06:** 검증 성공 시에는 인라인 성공 상태와 상단 토스트를 함께 보여준다.
- **D-07:** 검증 실패 메시지는 `유효하지 않은 키/권한 문제`와 `네트워크/일시 오류`의 2단계로 구분한다.
- **D-08:** 검증 중에는 입력 필드는 유지하고, 검증 버튼만 로딩 및 중복 클릭 방지 상태로 둔다.

### 기본 설정 적용 범위
- **D-09:** `기본 모델`은 기존 대화를 바꾸지 않고 새 대화의 초기값으로만 적용한다.
- **D-10:** `글로벌 시스템 프롬프트`도 기존 대화를 바꾸지 않고 새 대화의 기본값으로만 적용한다.
- **D-11:** 기본 모델과 글로벌 시스템 프롬프트는 항목별 즉시 저장한다.
- **D-12:** 저장된 기본 모델이 현재 무료 모델 목록과 맞지 않으면 무효 처리하고 기본값 없음 상태로 되돌린다.

### 성공 후 이동 흐름
- **D-13:** `/` 온보딩에서 API 키 검증/저장이 성공하면 같은 화면을 빈 상태 홈으로 즉시 전환한다.
- **D-14:** `/settings`에서 API 키 검증/저장이 성공하면 현재 화면에 머물고 성공 상태만 갱신한다.
- **D-15:** API 키 삭제 후 `/settings`에 있으면 그대로 머물고, `/`에 있으면 온보딩 상태로 즉시 복귀한다.

### the agent's Discretion
- settings 테이블의 키 이름과 저장 shape
- 인라인 성공 상태의 정확한 카피와 아이콘 표현
- 확인 다이얼로그 문구와 destructive 버튼 카피
- 기본 모델 무효 상태의 구체적 empty copy
- draft/saved key state를 store, route loader, local component state 중 어디에 둘지에 대한 구현 구조

</decisions>

<specifics>
## Specific Ideas

- API 키는 잘못된 값이 영속 저장되지 않는 쪽을 우선한다.
- 설정 변경 성공 후 화면을 강제로 이동시키기보다 현재 맥락에 머무르게 하는 흐름을 선호한다.
- 기본 모델과 글로벌 시스템 프롬프트는 “기존 대화 수정”이 아니라 “새 대화 초기값”이어야 한다.
- 오류 표현은 과도하게 세분화하지 말고 사용자가 바로 수정 행동을 취할 수 있을 정도로만 나눈다.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 제품 범위와 요구사항
- `.planning/PROJECT.md` — 프론트엔드 전용 OpenRouter 직접 호출, 로컬 저장, 한국어 UI 제약
- `.planning/ROADMAP.md` — Phase 2 목표, 성공 기준, 관련 requirement ID
- `.planning/REQUIREMENTS.md` — `SETT-01`~`SETT-04`, `DATA-02` 정의

### 이미 잠긴 UI/UX 기준
- `.planning/phases/01-app-shell-and-interface-foundation/01-CONTEXT.md` — 온보딩 카드 우선, 오류는 인라인 + 토스트, 모바일 흐름
- `.planning/phases/01-app-shell-and-interface-foundation/01-UI-SPEC.md` — copywriting contract, layout contract, interaction contract
- `AGENTS.md` — 한국어 문서 작성, UI 작업 시 `ui-ux-pro-max` 동시 사용 규칙

### 검증/리뷰 참고
- `.planning/phases/01-app-shell-and-interface-foundation/01-VALIDATION.md` — Phase 1에서 추가된 테스트 인프라와 sampling contract
- `.planning/phases/01-app-shell-and-interface-foundation/01-REVIEWS.md` — 다음 phase에서 error-state 및 validation depth를 더 명시해야 한다는 review 메모

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/chat/api-key-onboarding-card.tsx` — API 키 입력, 설명 문구, 인라인 status 슬롯이 이미 있다.
- `src/components/settings/settings-panel-placeholder.tsx` — API 키, 기본 모델, 시스템 프롬프트, 테마의 4개 패널 구조가 준비되어 있다.
- `src/components/ui/sonner.tsx` — 성공/오류/로딩 토스트 표현에 바로 쓸 수 있다.
- `src/providers/theme-provider.tsx` + `src/stores/ui-store.ts` — settings 저장 로직 중 기존 theme preference 저장 패턴을 참고할 수 있다.

### Established Patterns
- shell과 route leaf는 분리되어 있고, route leaf가 상태 surface를 교체하는 구조다.
- 로컬 설정 상태 일부(theme)는 localStorage + Zustand 조합으로 이미 저장/복원되고 있다.
- Phase 1에서는 인라인 상태와 토스트를 병행하는 UI 패턴이 잠겨 있다.

### Integration Points
- `/` route: 저장된 key 유무에 따라 온보딩 카드와 빈 상태 홈 전환이 필요하다.
- `/settings` route: placeholder 패널을 실제 settings 읽기/쓰기 흐름과 연결해야 한다.
- settings persistence: IndexedDB settings 테이블이 Phase 2의 주 저장소가 된다.
- OpenRouter validation: `GET /models` 호출 결과가 저장/교체/오류 상태의 단일 진입점이 된다.
- Phase 1 test infra: `vitest.config.ts`, `src/test/setup.ts`, `pnpm test`를 그대로 이어받아 settings/onboarding tests를 확장할 수 있다.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-api-key-and-settings-management*
*Context gathered: 2026-03-31*
