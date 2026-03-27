# Design System — AI Chat App

## Product Context
- **What this is:** OpenRouter API 기반 AI 채팅 애플리케이션으로, ChatGPT와 유사한 UI를 제공합니다.
- **Who it's for:** 풀스택 개발 학습자, AI 채팅 경험을 원하는 사용자
- **Space/industry:** AI/LLM 채팅 인터페이스
- **Project type:** Web app (React + Vite)

## Aesthetic Direction
- **Direction:** Brutally Minimal — 타이포그래피와 여백공간만 사용합니다. 장식 없음. 모던니즘.
- **Decoration level:** minimal (타이포그래피가 모든 작업을 수행)
- **Mood:** 청록하고 깔끔한 느낌. ChatGPT 스타일의 단순함과 기능 중심 접근.
- **Reference sites:** ChatGPT (chatgpt.com), Claude (claude.ai)

## Typography
- **Display/Hero:** Satoshi — 명확하고 현대적인 헤딩을 위해 선택. 400, 500, 600, 700 weights.
- **Body:** Instrument Sans — 가독성과 현대적인 느낌. 400, 500, 600 weights.
- **UI/Labels:** Instrument Sans (동일) — 일관성 유지
- **Data/Tables:** N/A (채팅 앱에는 해당 없음)
- **Code:** JetBrains Mono — 코드 블록과 기술 텍스트용. 400, 500 weights.
- **Loading:** Google Fonts CDN
- **Scale:**
  - xs: 12px
  - sm: 14px
  - base: 16px
  - lg: 18px
  - xl: 20px
  - 2xl: 24px
  - 3xl: 30px
  - 4xl: 36px
  - Display: 48px

## Color
- **Approach:** restrained (1개 악센트 + 뉴트럴, 색상은 드물고 의미 있음)
- **Primary:** #1a1a1a — 검정. 텍스트, 악센트, 주요 UI 요소.
- **Secondary:** #6b6b6b — 중간 회색. 보조 텍스트.
- **Tertiary:** #9b9b9b — 연한 회색. 플레이스홀더 텍스트.
- **Neutrals:**
  - bg-primary: #ffffff (흰색 — 주요 배경)
  - bg-secondary: #f9f9f9 (밝은 회색 — 2차 배경)
  - bg-tertiary: #f0f0f0 (회색 — 3차 배경, 호버)
  - border-subtle: #e5e5e5 (미세 테두리)
  - border-default: #d4d4d4 (기본 테두리)
- **Semantic:**
  - success: #059669, success-bg: #ecfdf5
  - warning: #d97706, warning-bg: #fffbeb
  - error: #dc2626, error-bg: #fef2f2
  - info: #0284c7, info-bg: #f0f9ff
- **Dark mode:** 표면 색상 재설계, 채도 10-20% 감소
  - bg-primary: #1a1a1a
  - bg-secondary: #262626
  - bg-tertiary: #333333
  - text-primary: #fafafa
  - text-secondary: #a3a3a3
  - text-tertiary: #737373

## Spacing
- **Base unit:** 4px
- **Density:** comfortable (읽기 쉬운 채팅 경험)
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)

## Layout
- **Approach:** grid-disciplined (엄격한 열, 예측 가능한 정렬)
- **Grid:**
  - Desktop: 12열
  - Tablet: 8열
  - Mobile: 4열
- **Max content width:** 1200px
- **Border radius:**
  - sm: 4px (작은 요소)
  - md: 8px (기본 버튼, 입력)
  - lg: 12px (카드)
  - full: 9999px (원형)

## Motion
- **Approach:** minimal-functional (이해를 돕는 전환만)
- **Easing:**
  - enter: ease-out
  - exit: ease-in
  - move: ease-in-out
- **Duration:**
  - micro: 50-100ms (호버, 포커스)
  - short: 150-250ms (토글, 전환)
  - medium: 250-400ms (모달, 페이지)
  - long: 400-700ms (복잡한 애니메이션)

## Design Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-28 | 초기 디자인 시스템 생성 | /design-consultation에 의해 AI 채팅 앱을 위해 생성됨 |
| 2026-03-28 | 보라색/인디고 제외 | AI slop 방지, 일반적이지 않은 미니멀 스타일 |
| 2026-03-28 | 작은 border-radius (4-8px) | shadcn 기본값보다 기능적이고 날카로운 느낌 |
| 2026-03-28 | 대비색 회색 사이드바 | 레이아웃 계층 강화, 시각적 구조 제공 |
| 2026-03-28 | 따뜻한 빈 상태 디자인 | 일러스트레이션/아이콘 + 안내 텍스트 + CTA |
| 2026-03-28 | 복구 가능한 에러 상태 | 에러 메시지 + "다시 시도" 버튼 + 고객지원 연결 |
