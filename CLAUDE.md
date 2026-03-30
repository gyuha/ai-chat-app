# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

OpenRouter 무료 API를利用한 웹 채팅 어플리케이션. ChatGPT와 유사한 UI를 목표로 함.

### 기술 스택
- **프레임워크**: React
- **패키지 관리**: pnpm
- **린팅/포맷팅**: Biome
- **타입 시스템**: TypeScript
- **UI 컴포넌트**: shadcn/ui
- **상태 관리**: Zustand
- **데이터 페칭**: TanStack Query
- **라우팅**: TanStack Router
- **로컬 스토리지**: IndexedDB

## 공통 명령어

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint

# 포맷팅
pnpm format

# 타입 체크
pnpm typecheck
```

## 아키텍처 참고사항

- 프론트엔드 only 프로젝트 (백엔드 없음)
- OpenRouter API를 통한 채팅 통신
- IndexedDB에 대화 데이터 영속성 저장

## GSD(gsd) 및 UI-UX-PRO-MAX(ui-ux-pro-max) 스킬 사용 지침

### 스킬 사용 시 안내 메시지 및 문서 언어

gsd 스킬과 ui-ux-pro-max 스킬을 사용할 때, 생성되는 안내 메시지와 문서는 **반드시 한글(한국어)**로 작성해야 함.

- AI용 타이틀/기본값 제외
- 설명, 안내, 프롬프트 등은 모두 한글로 작성

### UI 관련 작업 시 스킬 연계

gsd에서 UI 관련된 작업을 수행할 때에는 **ui-ux-pro-max 스킬을 반드시 함께 사용**해야 함.

- UI 컴포넌트 생성/수정 시 gsd와 ui-ux-pro-max를 연계하여 작업
- 레이아웃, 스타일, 디자인 관련 작업 시 두 스킬을 동시에 활용

<!-- GSD:project-start source:PROJECT.md -->
## Project

**OpenRouter Chat**

OpenRouter 무료 모델을 활용한 ChatGPT 스타일의 웹 AI 채팅 애플리케이션. 사용자가 자신의 OpenRouter API 키를 등록하면 무료 LLM들과 대화할 수 있으며, 백엔드 서버 없이 브라우저에서 직접 API를 호출한다. 모든 데이터(대화, 설정)는 IndexedDB에 저장된다.

**Core Value:** 사용자가 복잡한 설정 없이 OpenRouter의 무료 AI 모델과 쉽게 대화할 수 있는 것

### Constraints

- **프레임워크**: React 19 + Vite (확정)
- **패키지 관리**: pnpm (확정)
- **UI 라이브러리**: shadcn/ui + Tailwind CSS v4 (확정)
- **상태 관리**: Zustand (확정)
- **서버 상태**: TanStack Query v5 (확정)
- **라우팅**: TanStack Router (파일 기반 라우팅, 확정)
- **IndexedDB**: Dexie.js v4 (확정)
- **마크다운**: react-markdown + remark-gfm + rehype-highlight (확정)
- **HTTP**: 내장 fetch API (OpenRouter OpenAI 호환)
- **빌드**: 정적 파일 (Vercel, Netlify 등 배포 가능)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.2.4 | UI Framework | React 19.2 is current latest. Server Components support, use() hook, improved concurrent features. PROJECT.md specifies React 19 which is correct. |
| Vite | 8.0.3 | Build Tool | Vite 8.x is current stable. Fast HMR, ESM-native dev server, optimal DX. |
| TypeScript | 6.0.2 | Type System | TypeScript 6.0 offers best-in-class type checking, strict mode support for quality code. |
### Package Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| pnpm | (latest) | Package Manager | Fast, disk-efficient, strict node_modules. Confirmed in PROJECT.md. |
### UI Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.2.2 | Utility CSS | Tailwind v4 is stable with improved performance, CSS-first configuration. Confirmed in PROJECT.md. |
| shadcn/ui | 0.9.5 | Component Library | Accessible Radix-based components, copy-paste ownership, customizable. ChatGPT-style UI 구현에 적합. |
### Linting/Formatting
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Biome | 2.4.9 | Lint + Format | Biome 2.x offers fast linting and formatting in one tool, replacing ESLint + Prettier. Better performance than separate tools. |
### State Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Zustand | 5.0.12 | Client State | Minimal boilerplate, React 19 compatible, excellent DX. Confirmed in PROJECT.md. |
### Server State
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| TanStack Query | 5.95.2 | Server State | Best-in-class data fetching, caching, background refetching. Handles API responses elegantly. Confirmed in PROJECT.md. |
### Routing
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| TanStack Router | 1.168.8 | Routing | Type-safe routing, file-based routing option, first-class React 19 support. Confirmed in PROJECT.md. |
### Local Storage
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Dexie.js | 4.4.1 | IndexedDB ORM | Simplest IndexedDB abstraction, excellent TypeScript support, reactive queries. Confirmed in PROJECT.md. |
### Markdown Rendering
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| react-markdown | 10.1.0 | Markdown parsing | Current stable, React 19 compatible, plugin ecosystem. |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown | Tables, strikethrough, task lists support. |
| rehype-highlight | 7.0.2 | Syntax highlighting | Code block highlighting within markdown. |
### HTTP Client
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Built-in fetch | (native) | HTTP Client | OpenRouter has OpenAI-compatible API. Native fetch is sufficient, no axios needed. |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| State (global) | Zustand | Redux Toolkit | Zustand has less boilerplate, better performance for this scale. Redux is overkill. |
| State (server) | TanStack Query | SWR | TanStack Query has more mature caching, better devtools, larger ecosystem. |
| IndexedDB | Dexie.js | idb / raw IDB | Dexie has best TypeScript types and simplest API. idb is lower-level. |
| Build Tool | Vite | Next.js / Remix | This is a SPA, no SSR needed. Vite is lighter and faster for pure frontend. |
| CSS Framework | Tailwind v4 | CSS Modules | Tailwind enables rapid ChatGPT-style UI development. |
## Stack Verification
## Confidence Assessment
| Category | Confidence | Reason |
|----------|------------|--------|
| Core Stack | HIGH | All versions verified via npm registry. Technologies are mainstream and stable. |
| UI Stack | HIGH | Tailwind v4 is stable, shadcn/ui is mature (0.9.5). |
| State Management | HIGH | Zustand 5.x and TanStack Query 5.x are production stable. |
| Routing | MEDIUM | TanStack Router is newer but actively maintained (1.168.8). |
| IndexedDB | HIGH | Dexie 4.x is well-established. |
## Notes
## Sources
- npm registry (verified 2026-03-30)
- React 19 documentation
- Vite 8 changelog
- TanStack Query documentation
- Dexie.js documentation
- shadcn/ui official site
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
