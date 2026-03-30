---
phase: 1
slug: app-shell-and-interface-foundation
status: approved
shadcn_initialized: false
preset: none
created: 2026-03-30
reviewed_at: 2026-03-30
---

# Phase 1 — UI Design Contract

> 앱 셸과 인터페이스 기반 phase를 위한 시각/상호작용 계약서다. 이후 planner와 executor는 이 문서를 Phase 1의 UI 기준선으로 사용한다.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | 아직 초기화되지 않음 — Phase 1 구현 중 `components.json` 생성 예정 |
| Component library | radix |
| Icon library | lucide-react |
| Font | Inter |

---

## Visual Hierarchy

- **주요 화면 포컬 포인트**
  - API 키 미등록 상태: 중앙 API 키 입력 카드
  - API 키 등록 후 대화 없음 상태: 메인 빈 상태의 제목과 `새 대화 시작` CTA
  - 일반 사용 상태: 현재 대화 제목과 하단 메시지 입력창
- **사이드바 우선순위**
  - 1순위: `새 대화 시작`
  - 2순위: 활성 대화 항목
  - 3순위: 설정 진입 링크
- **모바일 우선순위**
  - 채팅 영역을 기본 화면으로 유지하고, 대화 목록은 좌측 `Sheet`에서 보조적으로 연다.
  - 모바일 헤더 우측 `새 대화 시작` 액션은 햄버거 버튼보다 시각적 우선순위가 높지 않게 배치한다.
- **아이콘 전용 액션 접근성**
  - 햄버거 버튼: `aria-label="대화 목록 열기"`
  - 테마 전환 버튼: `aria-label="테마 전환"`
  - 새 대화 아이콘 버튼: `aria-label="새 대화 시작"`

---

## Design System Surfaces

- 기본 인상은 ChatGPT 근접형의 중립적, 거의 평면적인 다크 UI로 유지한다.
- 패널 분리는 배경 톤 차이와 얇은 border로 처리하고, box-shadow는 최소화한다.
- 사이드바, 헤더, 입력창은 서로 다른 surface tone으로 분리하되 카드처럼 튀지 않게 유지한다.
- horizontal scroll은 금지한다. 모든 화면은 `320`, `375`, `414`, `768`, `1024`, `1440` 기준에서 viewport 안에 들어와야 한다.

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | 아이콘과 텍스트 사이의 최소 간격, focus ring inset 여유 |
| sm | 8px | 버튼 내부 간격, 인라인 컨트롤 간격 |
| md | 16px | 기본 요소 간격, 입력창 내부 padding |
| lg | 24px | 카드/패널 내부 여백, 헤더 하단 여백 |
| xl | 32px | 메인 빈 상태 블록 간격, 데스크톱 레이아웃 gap |
| 2xl | 48px | 주요 화면 구획 사이 간격 |
| 3xl | 64px | 페이지 레벨 상하 여백, 넓은 데스크톱 breathing room |

Exceptions: 모바일 아이콘 터치 타깃은 44px 이상 허용. 이 경우 시각 간격은 8px 스케일을 유지하고 hit area만 확장한다.

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.5 |
| Label | 14px | 500 | 1.4 |
| Heading | 20px | 600 | 1.2 |
| Display | 28px | 600 | 1.15 |

타입 규칙:
- 본문은 16px 중심으로 유지한다.
- 사이드바 항목, 보조 레이블, 입력 라벨은 14px을 사용한다.
- 헤더 제목과 카드 제목은 20px까지만 사용한다.
- 빈 상태 메인 헤드라인만 28px display를 사용한다.
- 추가 font size와 추가 font weight는 Phase 1에서 허용하지 않는다.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #0F1115 | 앱 배경, 메인 채팅 캔버스, 루트 레이아웃 |
| Secondary (30%) | #171B22 | 사이드바, 헤더 표면, 입력창 표면, empty-state 카드 배경 |
| Accent (10%) | #10A37F | `새 대화 시작`, 활성 대화 항목 표시, focus ring, 주요 CTA |
| Destructive | #DC2626 | 대화 삭제, 파괴적 확인 버튼 전용 |

Accent reserved for: `새 대화 시작` 버튼, 활성 대화 항목 표시, primary action, keyboard focus ring

추가 색 규칙:
- 본문 텍스트는 `#E5E7EB`, 보조 텍스트는 `#9CA3AF`, divider/border는 `#2A2F38` 기준으로 설계한다.
- accent는 링크 전체나 모든 interactive element에 확장 사용하지 않는다.
- destructive color는 삭제 확인과 오류성 파괴 액션에만 사용한다.

---

## Layout Contract

- **데스크톱**
  - 좌측 사이드바 고정 폭: 280px 안팎
  - 우측 메인 영역은 채팅 메시지와 입력 흐름에 집중한다.
  - 헤더는 표준형으로 유지하고, 대화 제목과 핵심 제어만 보여준다.
- **모바일**
  - 기본 진입은 채팅 영역이다.
  - 사이드바는 좌측 `Sheet` 오버레이로 열고, 기본 상태는 닫힘이다.
  - 모바일 헤더 우측에 `새 대화 시작` 액션을 추가한다.
- **입력창**
  - 기본 2행에서 시작해 최대 4행까지 자동 확장한다.
  - 입력창은 항상 화면 하단 action anchor로 유지한다.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | 새 대화 시작 |
| Empty state heading | 첫 대화를 시작해 보세요 |
| Empty state body | 좌측 목록에서 새 대화를 열고 모델을 선택하면 바로 대화를 시작할 수 있습니다. |
| Error state | API 키를 확인해 주세요. 설정에서 OpenRouter API 키를 다시 입력한 뒤 다시 시도하세요. |
| Destructive confirmation | 대화 삭제: 이 대화를 삭제하면 메시지를 되돌릴 수 없습니다. 삭제할까요? |

추가 카피 규칙:
- API 키 미등록 상태의 메인 카드 제목은 `OpenRouter API 키를 입력해 주세요`를 사용한다.
- API 키 검증 실패 보조 문구는 `입력한 키로 모델 목록을 불러오지 못했습니다. 키를 확인한 뒤 다시 시도해 주세요.`를 사용한다.
- 모바일/데스크톱 공통으로 버튼 카피는 한글 동사+명사 구조를 유지한다.

---

## Interaction Contract

- API 키 미등록 상태에서는 중앙 카드가 첫 시선과 첫 행동을 가져간다.
- 대화가 없는 상태에서는 장식보다 행동 유도에 집중하고, 예시 프롬프트는 노출하지 않는다.
- 오류는 카드 내부 인라인 메시지와 상단 토스트를 함께 사용해 보여준다.
- hover transition은 150-200ms 범위로 제한하고, 과한 scale transform은 사용하지 않는다.
- `prefers-reduced-motion` 환경에서는 transition과 emphasis motion을 줄인다.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | Sidebar, Sheet, Button, Input, Textarea, DropdownMenu, Tooltip, Skeleton, Sonner/Toaster | not required |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-03-30
