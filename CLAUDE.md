# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

OpenRouter의 무료 API를 이용한 웹 채팅 어플리케이션 (ChatGPT와 유사한 UI)

## Commonly Used Commands

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트 실행
npm test

# 특정 테스트 파일 실행
npm test -- [파일명]
```

## 스킬 사용 규칙

### 한국어 안내

- `gsd` 스킬을 사용할 때: 안내 메시지와 생성되는 문서는 **한글로 작성**
- `ui-ux-pro-max` 스킬을 사용할 때: 생성되는 UI 초안과 문서는 **한글로 작성**

### UI 작업 워크플로우

gsd로 UI 관련 작업을 할 때:

1. 먼저 `ui-ux-pro-max` 스킬로 UI 초안 생성 (한글로 초안 작성)
2. 생성된 초안을 `teach-impeccable` 스킬로 다듬기 (UI 품질, 일관성, 효율성 검토)

### 스킬 호출 방식

```bash
# UI 초안 생성 (ui-ux-pro-max)
Skill: ui-ux-pro-max

# UI 다듬기 (teach-impeccable)
Skill: teach-impeccable
```

## 아키텍처

- **프론트엔드**: React 기반 웹 앱
- **AI 연동**: OpenRouter API 활용
- **UI 스타일**: ChatGPT와 유사한 인터페이스

<!-- GSD:project-start source:PROJECT.md -->
## Project

**AI Chat App**

OpenRouter의 무료 API를利用한 웹 채팅 어플리케이션. 로그인 불필요, API 키 입력만으로 채팅 가능. ChatGPT와 유사한 UI를 제공하여 익숙한 채팅 경험을 제공.

**Core Value:** 브라우저에서 간단하게 사용할 수 있는 무료 AI 채팅 도구. 로그인 없이 즉시 사용 가능.

### Constraints

- **Tech**: React + Vite (단일 페이지 앱)
- **API**: OpenRouter API만 사용 (타 AI 프로바이더 미지원)
- **Storage**: localStorage만 사용 (IndexedDB 미사용)
- **Auth**: 자체 인증 시스템 없음 (API 키로 개별 사용자 식별)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.x | UI framework | Latest stable, concurrent features |
| Vite | 6.x | Build tool | Fast HMR, native ESM, standard for React |
| TypeScript | 5.x | Type safety | Catch errors at build time, better DX |
### Database / Persistence
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| localStorage | Native | Chat persistence | Already in spec, no extra dependency |
| @tanstack/react-query | 5.x | Server state | Caches API responses, manages loading/error states (optional for simple app) |
### Streaming / SSE Handling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Native Fetch API | ES2017+ | Streaming requests | ReadableStream support in all modern browsers, no library needed |
| eventsource | 3.x | SSE fallback | Only if OpenRouter uses Server-Sent Events (most AI APIs use chunked transfer) |
### Chat UI Components
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-markdown | 9.x | Render AI markdown responses | AI responses are markdown-formatted |
| remark-gfm | 4.x | GitHub Flavored Markdown | Tables, task lists in AI responses |
| react-syntax-highlighter | 15.x | Code block syntax highlighting | AI generates code |
| date-fns | 4.x | Timestamp formatting | Human-readable message times |
### Styling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.x | Utility-first CSS | Rapid UI development, consistent design system, ChatGPT-like dark mode easy |
| @tailwindcss/typography | 0.5.x | Prose styling | Beautiful markdown rendering out of box |
### State Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Context + useReducer | Built-in | Global state (chats, settings) | Simple app scope, no auth, localStorage sync |
| Zustand | 5.x | Alternative for local state | Simpler than Context, less boilerplate (optional) |
### Utilities
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| uuid | 11.x | Generate message/chat IDs | Unique identifiers for localStorage |
| clsx | 2.x | Conditional classNames | Cleaner JSX className logic |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| State | Context + useReducer | Redux Toolkit | Overkill for single-user, localStorage-only app |
| State | Context + useReducer | Jotai | Good alternative but adds dep for marginal gain |
| Streaming | Native Fetch | @ai-sdk/sdk | Adds framework lock-in, OpenRouter has simple REST API |
| UI Library | Custom + Tailwind | shadcn/ui | Good but adds complexity for custom chat UI |
| Markdown | react-markdown | marked | react-markdown has React integration, safer |
| Persistence | localStorage | IndexedDB | Spec says localStorage only, simpler |
## Installation
# Core
# Streaming (none needed - native fetch sufficient)
# If SSE needed:
# Chat UI
# Styling
# State (optional - may not need)
## Sources
- [React 19 Docs](https://react.dev) - Training data
- [Vite 6 Guide](https://vite.dev) - Training data
- [Tailwind CSS](https://tailwindcss.com) - Training data
- [MDN Fetch Streaming](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) - Official docs
## Confidence Assessment
| Area | Confidence | Reason |
|------|------------|--------|
| React/Vite/TypeScript | MEDIUM | Standard stack, stable releases |
| Streaming approach | MEDIUM | Native Fetch + ReadableStream is well-documented |
| Styling (Tailwind) | MEDIUM | Industry standard in 2025 |
| Markdown libraries | LOW | Training data, not verified with current docs |
| State management | MEDIUM | Context/useReducer is standard React pattern |
## Research Flags
- [ ] Verify react-markdown@9.x API (breaking changes from v8)
- [ ] Verify Tailwind CSS 4.x configuration (newer version, may have changes)
- [ ] Verify OpenRouter streaming response format (SSE vs chunked)
- [ ] Verify react-syntax-highlighter compatibility with React 19
## Deferrable Decisions
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
