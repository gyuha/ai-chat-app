# PRD: OpenRouter Free Chat Web App

## 1. 프로젝트 이해 요약

이 제품은 OpenRouter 무료 모델을 안전하게 사용할 수 있는 웹 기반 conversational workspace다. 사용자는 좌측 사이드바에서 대화를 관리하고, 메인 영역에서 스트리밍 응답을 읽고, 하단 composer에서 멀티라인 입력과 stop/regenerate를 수행한다. 핵심은 "무료 모델이어도 답답하지 않고, 코드/마크다운/긴 응답이 자연스럽게 읽히는 채팅 UX"다.

## 2. 추가 질문

현재 단계에서 필수 질문은 없다. 아래 기본값으로 진행한다.

- 익명 사용 기반 MVP
- 파일 또는 인메모리 저장소 기반 대화 관리
- 다크 모드 우선, 라이트 모드는 후속 확장
- 모델 리스트는 서버 allowlist로 관리

## 3. UI UX Pro Max 초기 제안

### Product Type

- `AI conversational productivity workspace`
- 대화형 도구와 경량 dashboard shell의 중간 지점

### UI Style

- `Dark Mode (OLED)`를 기본 스타일로 채택
- 과도한 네온/글래스 효과는 피하고, 낮은 발광의 또렷한 대비와 얇은 강조색만 사용
- 감성 방향: "개발자 도구처럼 정밀하지만 일반 사용자도 어렵지 않은 채팅 화면"

### Color Palette

| 역할 | 값 | 용도 |
|------|----|------|
| Background | `#020617` | 앱 전체 바탕 |
| Surface-1 | `#0F172A` | 사이드바, composer 배경 |
| Surface-2 | `#1E293B` | 카드, 메시지 보조 배경 |
| Accent | `#22C55E` | 전송, 활성 상태, 성공 피드백 |
| Text | `#F8FAFC` | 기본 본문 |
| Muted | `#94A3B8` | 보조 텍스트 |
| Danger | `#F87171` | 삭제, 실패, 중단 상태 |

### Typography Pairing

- 기본 채택: `Fira Sans` + `Fira Code`
- 대안 후보: `IBM Plex Sans` + `JetBrains Mono`
- 적용 원칙:
  - UI/본문: `Fira Sans`
  - 코드/모델 배지/토큰 상태: `Fira Code`
  - 긴 문단은 16px/1.65 line-height
  - 코드 블록은 13px~14px, line-height 1.6

### UX Guidelines

- 응답은 반드시 스트리밍으로 보여준다. 긴 스피너 대기는 금지
- 빈 상태는 설명 + 빠른 시작 액션 + 예시 프롬프트를 제공한다
- 모든 아이콘 버튼은 `aria-label`을 가진다
- focus outline 제거 금지. `focus-visible` 대체 링 필수
- 모바일에서 가로 스크롤이 생기지 않도록 메시지/표/코드 블록 폭 제어
- 비동기 상태는 `aria-live="polite"`로 요약 문구를 제공한다

### Component Priority

- High: Sidebar, Composer, Message List, Message Bubble, Model Selector, Streaming Status
- Medium: Settings Dialog, Empty State, Error Banner, Delete Confirm
- Low: Keyboard shortcut hints, onboarding tips, model badges의 추가 설명

## 4. 제품 요구사항

### 핵심 사용자 시나리오

1. 사용자는 첫 방문 시 완성도 있는 빈 상태 화면을 본다.
2. 사용자는 새 채팅을 시작하고 모델을 선택한 뒤 프롬프트를 전송한다.
3. 사용자는 assistant 응답이 스트리밍되는 동안 내용을 읽고 필요하면 중단한다.
4. 사용자는 응답이 끝난 뒤 regenerate, 코드 복사, 대화 삭제를 수행한다.
5. 사용자는 모바일에서도 동일한 대화 흐름을 무리 없이 사용할 수 있다.

### 완료 조건

- 키가 브라우저에 노출되지 않는다.
- 무료 모델 allowlist 변경이 서버 설정만으로 가능하다.
- 메시지 목록, 새 채팅, 삭제, 제목 자동 생성이 동작한다.
- markdown, 목록, 표, 코드 블록이 자연스럽게 렌더링된다.
- stop/regenerate가 모두 동작하고 실패 상태 피드백이 명확하다.

## 5. 정보 구조

### 전역 구조

- 좌측 사이드바
  - 앱 로고/브랜드
  - 새 채팅 버튼
  - 대화 목록
  - 설정 진입
- 메인 영역
  - 상단: 현재 모델, 연결/상태 표시, 보조 액션
  - 본문: 메시지 리스트
  - 하단: 입력 composer

### 라우팅 구조

- `/`
  - 최근 대화가 있으면 마지막 대화 또는 빈 상태로 리다이렉트
- `/chat/$chatId`
  - 대화 상세
- `/settings`
  - 모바일/직접 진입용 설정 화면 또는 dialog fallback

## 6. UX/UI 설계 원칙

### 레이아웃 규칙

- 데스크톱 기준 사이드바 폭: `280px`, collapsed 시 `72px`
- 메인 메시지 컬럼 최대 폭: `840px`
- 실제 텍스트 가독 폭: `72ch` 이하 유지
- composer는 하단 고정, 좌우 16px 모바일 / 24px 데스크톱 패딩

### 메시지 규칙

- user: 우측 정렬, 배경 강조, 최대 폭 `80%`
- assistant: 좌측 정렬, 배경 최소화, 본문 가독성 우선
- system: 얇은 경계선 카드 또는 muted block으로 명확히 구분
- 메시지 간 세로 간격: 16px 모바일 / 20px 데스크톱
- 메시지 내부 패딩: 12px 모바일 / 14px 데스크톱

### 스트리밍 규칙

- 첫 토큰 도착 전까지는 skeleton 한 줄 + "응답 생성 중" 상태 표시
- 토큰 수신 중에는 하단으로 자동 추적하되, 사용자가 위로 스크롤했으면 강제 점프 금지
- 사용자가 마지막 120px 이내에 있을 때만 자동 스크롤 유지

### 빈 상태 규칙

- 한 줄 설명만 두지 않는다
- 앱 목적 설명, 예시 프롬프트 3개, 새 채팅 액션, 현재 모델 안내를 함께 제공한다

### 반응형 규칙

- 모바일에서는 사이드바를 sheet로 전환
- composer 버튼 영역은 터치 타겟 44px 이상 유지
- 표/코드 블록은 내부 스크롤 허용, 페이지 가로 스크롤 금지

### 접근성 규칙

- 모든 아이콘 버튼에 `aria-label`
- 메시지 상태 요약 영역에 `aria-live="polite"`
- 키보드로 새 채팅, 사이드바 탐색, 설정 열기, 전송/중단 가능
- 대비는 본문 4.5:1 이상, focus ring은 배경에서 충분히 분리

## 7. 화면 목록 및 책임

### App Shell / 기본 화면

- 책임: 전역 레이아웃, 라우팅, 사이드바 상태, 테마, 공통 오류 처리

### Empty Chat Screen

- 책임: 제품 소개, 예시 프롬프트, 새 대화 시작 유도, 현재 모델 노출

### Chat Screen

- 책임: 메시지 목록 렌더링, 스트리밍, regenerate, stop, 코드 복사, 제목 갱신

### Settings Surface

- 책임: 시스템 프롬프트, 모델 선택, 모델 설명, 앱 기본 동작 옵션

### Delete Confirm Surface

- 책임: 대화 삭제 확인, 복구 불가 안내

### Error/Offline Surface

- 책임: 서버 오류, rate limit, 모델 차단, 네트워크 실패를 사용자 문장으로 변환

## 8. 컴포넌트 구조

### Shell 계층

- `AppSidebar`
- `ChatHeader`
- `ChatLayout`
- `MobileSidebarSheet`

### Chat 계층

- `MessageList`
- `MessageGroup`
- `MessageBubble`
- `MessageContent`
- `MessageActions`
- `StreamingIndicator`
- `ScrollAnchor`

### Composer 계층

- `PromptComposer`
- `ComposerTextarea`
- `SendButton`
- `StopButton`
- `ModelBadge`
- `ComposerFooterHint`

### Settings 계층

- `ChatSettingsDialog`
- `ModelSelect`
- `SystemPromptTextarea`
- `TemperatureNotice` 또는 `CapabilityNotice`

### 상태 계층

- `ChatEmptyState`
- `InlineErrorBanner`
- `LoadingConversationSkeleton`
- `DeleteChatDialog`

## 9. shadcn/ui 후보

### App Shell

- `sidebar`
- `button`
- `scroll-area`
- `separator`
- `tooltip`
- `sheet`

### Composer

- `textarea`
- `button`
- `badge`
- `tooltip`
- `popover`

### Settings

- `dialog`
- `select`
- `label`
- `textarea`
- `tabs`
- `switch`

### Destructive / Feedback

- `alert-dialog`
- `toast`
- `skeleton`
- `dropdown-menu`

## 10. 비목표

- 프롬프트 히스토리 동기화
- 멀티모달 업로드
- 조직/팀 기능
- 다중 탭 실시간 동기화
