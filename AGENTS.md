## Project

- 프로젝트명: OpenRouter Chat
- 목적: OpenRouter 무료 모델을 활용한 ChatGPT 스타일 웹 AI 채팅 앱을 브라우저만으로 제공한다.
- 핵심 가치: 사용자가 자신의 API 키로 무료 모델과 안정적으로 대화하고 로컬에 기록을 안전하게 유지할 수 있어야 한다.

## Technology Stack

- React 19 + Vite + TypeScript + pnpm
- Biome
- shadcn/ui + Tailwind CSS v4
- Zustand + TanStack Query v5 + TanStack Router
- Dexie.js v4

## Architecture

- 브라우저에서 OpenRouter API를 직접 호출하는 프론트엔드 전용 구조를 유지한다.
- 대화, 설정, 선택 모델, 시스템 프롬프트는 IndexedDB에 저장한다.
- 좌측 사이드바 + 우측 채팅 영역의 ChatGPT 유사 레이아웃을 기본 UX 기준으로 삼는다.

## GSD Workflow Enforcement

- 파일을 변경하는 작업은 가능하면 GSD 워크플로우를 통해 시작한다.
- 작은 수정은 `$gsd-quick`, 디버깅은 `$gsd-debug`, phase 기반 작업은 `$gsd-discuss-phase`, `$gsd-ui-phase`, `$gsd-plan-phase`, `$gsd-execute-phase`를 우선 사용한다.
- 프론트엔드 phase에서는 UI contract가 필요하면 `$gsd-ui-phase`를 먼저 사용한다.

## Workspace Directives

- GSD 워크플로우를 사용할 때 사용자 안내 메시지, 질문, 요약, 생성 문서(PROJECT.md, REQUIREMENTS.md, ROADMAP.md, UI-SPEC.md, PLAN.md, SUMMARY.md 등)는 기본적으로 한국어로 작성한다.
- `ui-ux-pro-max` 스킬을 사용할 때 설명, 추천안, 디자인 근거, 생성 문서는 기본적으로 한국어로 작성한다.
- 코드, 명령어, 파일 경로, REQ-ID, phase 번호, 컴포넌트 이름, CSS 클래스, API/라이브러리 이름 같은 기술 식별자는 원문 표기를 유지한다.
- GSD에서 UI/UX, 화면 설계, 디자인 시스템, 컴포넌트 구성, UI 리뷰 관련 작업을 할 때는 `ui-ux-pro-max` 스킬을 함께 사용한다.
