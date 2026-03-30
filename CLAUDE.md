# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenRouter Chat — ChatGPT 스타일의 웹 AI 채팅 앱. OpenRouter 무료 모델 API를 직접 호출하며, 모든 데이터는 IndexedDB(Dexie.js)에 저장. 백엔드 서버 없는 프론트엔드 전용 프로젝트.

## Tech Stack

- React 19 + Vite + TypeScript (strict)
- pnpm (package manager)
- Biome (lint + format, ESLint/Prettier 대체)
- shadcn/ui + Tailwind CSS v4
- Zustand (클라이언트 전역 상태)
- TanStack Query v5 (서버 상태/캐싱)
- TanStack Router (파일 기반 라우팅)
- Dexie.js v4 (IndexedDB ORM)
- react-markdown + remark-gfm + rehype-highlight

## Commands

```bash
pnpm dev          # Vite 개발 서버 (port 5173)
pnpm build        # 타입체크 + 빌드
pnpm lint         # Biome 체크
pnpm format       # Biome 포맷 적용
pnpm test         # Vitest 실행
```

## Architecture

### 라우트 구조 (TanStack Router)
- `/` — 메인 (새 대화 또는 빈 상태)
- `/chat/$conversationId` — 특정 대화
- `/settings` — API 키, 기본 모델, 시스템 프롬프트, 테마 설정

### UI 레이아웃 (ChatGPT 유사)
- 좌측 사이드바 (280px, 접기 가능): 새 대화 버튼 + 대화 목록 + 설정 링크
- 우측 채팅 영역: 헤더(제목+모델 선택) + 메시지 목록 + 입력 영역
- 반응형: 데스크톱(>1024px) 사이드바 고정, 모바일(<1024px) Sheet/Drawer 토글
- 다크모드 기본 활성

### 데이터 저장 (IndexedDB via Dexie.js)
- DB명: `openrouter-chat-db`
- `settings`: key(PK), value
- `conversations`: id(PK uuid), title, modelId, systemPrompt, createdAt, updatedAt
- `messages`: id(PK uuid), conversationId(indexed), role, content, createdAt

### OpenRouter API
- Base URL: `https://openrouter.ai/api/v1`
- 인증: `Authorization: Bearer <API_KEY>`
- 무료 모델 필터: `pricing.prompt === "0" && pricing.completion === "0"`
- 채팅: `POST /chat/completions` with `stream: true` (SSE)

## Conventions

- 한국어 UI (버튼, 라벨, 안내 문구)
- 코드 식별자는 영어, 문서는 한국어
- PascalCase: 컴포넌트/클래스, camelCase: 변수/함수, kebab-case: 폴더/파일명
- 기본 에디터: Cursor

## Skill Usage Guidelines

- **GSD(get-shit-done)** 및 **ui-ux-pro-max** 스킬 사용 시, 안내 메시지와 생성 문서는 **한국어**로 작성
- GSD에서 **UI 관련 작업**을 수행할 때, **ui-ux-pro-max 스킬을 함께 사용**하여 UI/UX 품질 향상

<!-- GSD:project-start source:PROJECT.md -->
## Project

**OpenRouter Chat**

OpenRouter 무료 모델을 활용한 ChatGPT 스타일의 웹 AI 채팅 애플리케이션. 사용자가 자신의 OpenRouter API 키를 등록하면 무료 LLM 모델들과 대화할 수 있으며, 백엔드 서버 없이 브라우저에서 직접 API를 호출하고 모든 데이터는 IndexedDB에 저장된다. 로컬 개발 환경에서 사용 목적.

**Core Value:** 사용자가 무료 AI 모델과 실시간 스트리밍 채팅을 할 수 있는 것. 이것만 작동하면 된다.

### Constraints

- **Tech Stack**: React 19 + Vite + TypeScript (strict), shadcn/ui + Tailwind CSS v4 — 사용자가 확정한 스택
- **State Management**: Zustand (클라이언트 전역), TanStack Query v5 (서버 상태/캐싱) — 역할 분리 명확
- **Routing**: TanStack Router (파일 기반) — 확정된 라우트 구조
- **Storage**: Dexie.js v4 (IndexedDB ORM) — 서버 없이 로컬 데이터 저장
- **Package Manager**: pnpm — 프로젝트 매니저
- **Linter/Formatter**: Biome — ESLint/Prettier 대체
- **Markdown**: react-markdown + remark-gfm + rehype-highlight — 코드 하이라이팅 포함
- **UI 언어**: 한국어 — 버튼, 라벨, 안내 문구 모두 한국어
- **Deployment**: 로컬 개발 환경만 — 정적 호스팅 배포 불필요
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## 추천 스택
### 핵심 기술
| 기술 | 버전 | 목적 | 추천 이유 |
|------|------|------|-----------|
| React | 19.0.0 | UI 라이브러리 | 새로운 use() 훅, 개선된 서버 컴포넌트 지원, useOptimistic으로 낙관적 업데이트 간소화 |
| Vite | 6.x | 빌드 도구 | 번들링 없는 즉시 개발 서버 시작, HMR 지원, TypeScript 즉시 사용 |
| TypeScript | 5.7.x | 타입 시스템 | strict 모드로 런타임 에러 사전 방지, React 19와 완벽한 호환성 |
| Tailwind CSS | v4 | 스타일링 | CSS 변수 기반的新 아키텍처, 제로 런타임, 엔진 내장으로 빌드 단계 간소화 |
### 지원 라이브러리
| 라이브러리 | 버전 | 목적 | 사용 시점 |
|-----------|------|------|-----------|
| shadcn/ui | latest | 컴포넌트 라이브러리 | Radix UI primitives 기반, 완전한 커스터마이징 가능, 복사-붙여넣기 방식으로 npm 의존성 없음 |
| Zustand | 5.0.0 | 클라이언트 상태 관리 | API 키, 테마, UI 상태 등 글로벌 클라이언트 상태용. Context API 불필요, 미니멀한 보일러플레이트 |
| TanStack Query | 5.59.0 | 서버 상태 관리 | OpenRouter API 호출, 자동 캐싱, 재시도, 요청 중복 제거 |
| TanStack Router | 1.55.0 | 파일 기반 라우팅 | 타입 안전한 라우트 매개변수, 중첩 라우트, 코드 스플리팅 |
| Dexie.js | 4.0.8 | IndexedDB ORM | 브라우저 내 영구 저장, 동기식 API로 비동기 IndexedDB 간소화 |
| react-markdown | 9.0.1 | 마크다운 렌더링 | XSS 보호, 플러그인 생태계 (remark-gfm, rehype-highlight) |
| remark-gfm | 4.0.0 | GitHub Flavored Markdown | 테이블, 취소선, 자동 링크 등 GFM 기능 |
| rehype-highlight | 7.0.0 | 코드 하이라이팅 | 190+ 언어 구문 강조, 자동 언어 감지 |
### 개발 도구
| 도구 | 목적 | 참고 사항 |
|------|------|-----------|
| pnpm | 패키지 매니저 | 디스크 공간 절약, stricter 의존성, monorepo 친화적 |
| Biome | Linter + Formatter | ESLint/Prettier 대체, 100x 더 빠른 린팅, ESLint 규칙 호환 |
| Vitest | 테스트 프레임워크 | Vite와 동일한 설정, Jest 호환 API,.watch 모드 |
## 설치
# 핵심 패키지
# 타입
# 빌드 도구
# 스타일링
# 상태 관리
# 데이터베이스
# 마크다운
# 개발 도구
## 대안으로 고려한 것
| 추천 | 대안 | 대안 사용 시기 |
|------|------|----------------|
| Zustand | Jotai | atom 기반 상태가 필요할 때. Zustand는 더 단순한 API |
| TanStack Query | SWR | 더 가벼운 클라이언트가 필요할 때. TanStack Query는 더 강력한 캐싱 |
| TanStack Router | React Router v7 | 이미 React Router를 사용 중일 때. TanStack Router는 더 강한 타입 안전성 |
| Dexie.js | 원시 IndexedDB | 용량이 매우 작을 때. Dexie.js는 더 나은 개발자 경험 |
| Biome | ESLint + Prettier | 기존 프로젝트 마이그레이션 시. Biome은 더 빠르고 통합 솔루션 |
## 사용하지 말아야 할 것
| 피해야 할 것 | 이유 | 대안 |
|-------------|------|------|
| Redux Toolkit | 과도한 보일러플레이트, 클라이언트 상태에만 필요 | Zustand |
| Apollo Client | GraphQL 중심, REST API에는 과함 | TanStack Query |
| MobX | 암시적 상태 관리, 디버깅 어려움 | Zustand + TanStack Query |
| localStorage | 동기식으로 메인 스레드 차단, 용량 제한 (5-10MB) | IndexedDB via Dexie.js |
| Styled Components | 런타임 오버헤드, 더 큰 번들 크기 | Tailwind CSS v4 |
| emotion | 런타임 오버헤드, CSS-in-JS 단점 | Tailwind CSS v4 |
| Babel | 느린 변환, Vite의 esbuild가 더 빠름 | Vite 내장 esbuild |
| Prettier + ESLint | 느린 실행, 별도 설정 필요 | Biome (통합 솔루션) |
| Next.js | 불필요한 백엔드 복잡도, 정적 사이트에 과함 | Vite (순수 클라이언트) |
| CRA (Create React App) | 유지 관리 중단됨, Vite가 더 현대적 | Vite |
## 변형별 스택 패턴
- Vite PWA 플러그인 사용 (vite-plugin-pwa)
- Workbox로 서비스 워커 생성
- Manifest 파일 추가
- Vite의 ssr 옵션 활성화
- @vitejs/plugin-react의 reactssr 옵션
- 정적 생성 또는 서버 측 렌더링 결정
- Zustand 제거, React Context API + useReducer 사용
- 작은 규모 앱에 적합
## 버전 호환성
| 패키지 A | 호환 가능 | 참고 사항 |
|-----------|----------|----------|
| React 19 | TypeScript 5.7+, Vite 6+ | React 19는 @types/react@19 필요 |
| Tailwind v4 | Vite 6+, PostCSS 없음 | v4는 독립 실행형, PostCSS 플러그인 불필요 |
| TanStack Query 5 | React 18+, 19 지원 | useMutation, useQuery API 동일 |
| TanStack Router 1 | React 18+, 19 지원 | 파일 기반 라우팅 선택 사항 |
| Dexie.js 4 | 모든 최신 브라우저 | IE11 지원 중단됨 |
| Biome 1.9 | Node.js 18+, 20+, 22+ | 네이티브 ESM |
## 구체적인 설정 방법
### Vite + React 19 + TypeScript
### Tailwind CSS v4
### TanStack Query + Zustand 상태 관리 분리
### Dexie.js IndexedDB 설정
### TanStack Router 파일 기반 라우팅
### Biome 설정
### react-markdown + 코드 하이라이팅
## 정보 출처
- React 19 공식 블로그 (https://react.dev/blog/2024-12-05-react-19) — HIGH confidence
- Vite 공식 문서 (https://vitejs.dev/guide/) — HIGH confidence
- Tailwind CSS v4 공식 블로그 (https://tailwindcss.com/blog/tailwindcss-v4-alpha) — MEDIUM confidence (alpha 버전)
- shadcn/ui 공식 문서 (https://ui.shadcn.com/docs/install) — HIGH confidence
- TanStack Query 공식 문서 (https://tanstack.com/query/latest) — HIGH confidence
- TanStack Router 공식 문서 (https://tanstack.com/router/latest) — HIGH confidence
- Dexie.js 공식 문서 (https://dexie.org/) — HIGH confidence
- Biome 공식 문서 (https://biomejs.dev/) — HIGH confidence
- react-markdown GitHub (https://github.com/remarkjs/react-markdown) — HIGH confidence
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
