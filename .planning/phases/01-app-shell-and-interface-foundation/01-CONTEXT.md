# Phase 1: 앱 셸과 인터페이스 기반 - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

이 phase는 OpenRouter Chat의 기본 앱 셸을 정의한다. 구체적으로는 ChatGPT 유사 레이아웃, 반응형 사이드바 구조, 헤더/입력창 밀도, 첫 진입 및 빈 상태, 다크모드 기본값, 모바일 탐색 흐름을 고정한다. 실제 모델 조회, API 키 검증 로직, 스트리밍 채팅 동작, 대화 히스토리 데이터 연결은 다음 phase에서 구현한다.

</domain>

<decisions>
## Implementation Decisions

### 셸 레이아웃 밀도
- **D-01:** 전체 앱 밀도는 밸런스형으로 설계한다.
- **D-02:** 데스크톱 사이드바 폭은 280px 안팎으로 둔다.
- **D-03:** 상단 헤더는 표준형으로 두고, 대화 제목과 핵심 제어만 노출한다.
- **D-04:** 메시지 입력창은 기본 2~4행 자동 확장형으로 설계한다.

### 첫 화면과 빈 상태
- **D-05:** API 키가 없을 때는 중앙 API 키 입력 카드를 가장 먼저 강조한다.
- **D-06:** API 키는 있지만 대화가 없을 때는 실용형 빈 상태를 사용하고, 모델 선택 안내와 새 대화 시작 행동에 집중한다.
- **D-07:** 빈 상태에는 예시 프롬프트를 넣지 않는다.
- **D-08:** API 키 오류나 검증 실패는 카드 내부 인라인 오류와 상단 토스트를 함께 사용해 보여준다.

### 모바일 사이드바 동작
- **D-09:** 모바일 사이드바는 좌측 `Sheet` 오버레이 방식으로 연다.
- **D-10:** 모바일 진입 시 사이드바는 기본 닫힘 상태로 둔다.
- **D-11:** 모바일에서 사이드바를 여는 추가 진입점은 두지 않고 햄버거 버튼만 사용한다.
- **D-12:** 모바일에서는 헤더 우측에도 새 대화 액션을 노출한다.

### 비주얼 톤과 강조색
- **D-13:** 전체 비주얼 톤은 ChatGPT 근접형의 중립적 인상으로 유지한다.
- **D-14:** 강조색은 `새 대화`, 주요 CTA, 활성 항목, 포커스 상태에만 제한적으로 사용한다.
- **D-15:** 메시지 영역과 주요 표면은 거의 평면형으로 두고 그림자는 최소화한다.
- **D-16:** 타이포그래피는 완전 중립형 인상으로 설계한다.

### the agent's Discretion
- 정확한 spacing token, padding, radius 값
- 제한적 강조색 규칙을 만족하는 실제 color token 선택
- 아이콘 세트, hover/focus transition 시간, 미세 애니메이션 수준
- 한국어 빈 상태/온보딩 문구의 세부 카피

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and constraints
- `.planning/PROJECT.md` — 제품 목표, 핵심 가치, 기술/UX 제약, 고정 결정
- `.planning/REQUIREMENTS.md` — Phase 1 관련 UI 요구사항(`UI-01`~`UI-04`)과 전체 범위
- `.planning/ROADMAP.md` — Phase 1 목표, 성공 기준, UI hint
- `AGENTS.md` — 한국어 문서 작성, UI 관련 작업 시 `ui-ux-pro-max` 동시 사용 규칙

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 현재 재사용 가능한 UI 컴포넌트나 hook은 없음 — 이번 phase에서 앱 셸 기준선을 처음 만든다.

### Established Patterns
- 기존 코드 패턴은 없음 — 이번 phase가 이후 phase의 layout, theme, sidebar 패턴 기준이 된다.
- stack 상 `shadcn/ui`를 사용하므로 사이드바와 overlay는 shadcn 패턴을 우선 검토한다.

### Integration Points
- 앱 루트 레이아웃: theme provider, sidebar provider, toaster 배치
- 메인 앱 셸: 좌측 사이드바, 상단 헤더, 중앙 메시지 영역, 하단 입력 영역
- 모바일 내비게이션: 헤더 햄버거와 새 대화 액션

</code_context>

<specifics>
## Specific Ideas

- 전체 인상은 ChatGPT와 유사하되 시각적으로 과장하지 않는다.
- 한국어 UI와 다크모드 기본값을 자연스럽게 녹여야 한다.
- 모바일에서 대화 흐름이 우선이며, 목록은 필요할 때만 `Sheet`로 연다.
- 빈 상태는 장식보다 행동 유도에 집중한다.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-app-shell-and-interface-foundation*
*Context gathered: 2026-03-30*
