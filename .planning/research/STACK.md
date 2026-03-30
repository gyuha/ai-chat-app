# Stack Research

**Domain:** 프론트엔드 전용 AI chat web app (OpenRouter 기반)
**Researched:** 2026-03-31
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| TypeScript | 5.x | 애플리케이션 전반의 타입 안정성 | OpenRouter 응답, Dexie schema, stream 상태를 엄격하게 다루기 위해 필요 |
| React | 19.x | UI 렌더링과 상호작용 | 채팅 UI, 상태 전이, 스트리밍 렌더링에 적합한 표준 선택 |
| Vite | 6.x/7.x 계열 | 개발 서버와 정적 빌드 | 브라우저 전용 앱에서 빠른 개발 속도와 정적 배포 적합성이 높음 |
| TanStack Router | 1.x | 라우팅 | 대화 상세 라우트(`/chat/$conversationId`)와 설정 화면 분리에 적합 |
| TanStack Query | 5.x | 원격 데이터 조회/캐시 | 모델 목록, API key 검증, staleTime 기반 캐시 제어에 적합 |
| Zustand | 5.x | 클라이언트 전역 상태 | UI 토글, 현재 대화 상태, 스트리밍 제어 같은 로컬 상태를 가볍게 다루기 좋음 |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Dexie.js | 4.x | IndexedDB 래퍼/ORM | settings, conversations, messages 테이블 관리 시 필수 |
| shadcn/ui | latest | 접근성 있는 UI primitives 조합 | Dialog, Sheet, Select, Toast, Button, Input 같은 공통 UI 구성 시 |
| Tailwind CSS | 4.x | 디자인 토큰/유틸리티 스타일링 | ChatGPT 유사 2-pane 레이아웃, 반응형, 다크모드 구현 시 |
| react-markdown | 9.x | assistant 응답 Markdown 렌더링 | 코드 블록/리스트/링크를 안전하게 표시할 때 |
| remark-gfm | latest | GFM 지원 | 테이블, 체크리스트, 취소선 등 일반적인 LLM 응답 포맷 지원 |
| rehype-highlight | latest | 코드 하이라이팅 | assistant 코드 응답의 가독성 확보 시 |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | 의존성 관리 | workspace 확장 가능성이 있어도 단일 프론트엔드 프로젝트에 무난함 |
| Biome | lint + format | ESLint/Prettier 이중 관리 대신 단일 툴 체계 유지 |
| browser `fetch` | OpenRouter 호출 | 별도 SDK 없이 OpenAI 호환 API를 직접 다루는 편이 제약이 적음 |

## Installation

```bash
# Core scaffold
pnpm create vite@latest openrouter-chat --template react-ts

# Runtime
pnpm add @tanstack/react-query @tanstack/react-router zustand dexie react-markdown remark-gfm rehype-highlight

# UI / styling
pnpm add class-variance-authority clsx tailwind-merge lucide-react next-themes

# Dev dependencies
pnpm add -D tailwindcss @tailwindcss/vite biome
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| TanStack Query | SWR | 원격 데이터 종류가 단순하고 query invalidation 요구가 낮을 때 |
| Zustand | Redux Toolkit | 복잡한 미들웨어/시간여행 디버깅/대규모 팀 규약이 필요할 때 |
| browser `fetch` | OpenAI SDK | 서버 측 proxy가 있고 OpenAI 호환 SDK의 편의성이 더 중요한 경우 |
| Dexie.js | localStorage | 대화/메시지 데이터가 매우 작고 구조화 조회가 거의 필요 없을 때만 |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| localStorage-only persistence | 메시지량이 늘면 조회/정렬/인덱싱이 급격히 불편해짐 | Dexie.js + IndexedDB |
| Backend-first auth/session 설계 | 본 프로젝트는 서버 없는 브라우저 앱이라 구조적으로 맞지 않음 | 로컬 settings + OpenRouter API key 검증 흐름 |
| React Query 없이 수동 fetch 남발 | 모델 캐시와 재검증 로직이 흩어져 유지보수가 어려워짐 | TanStack Query |
| 무거운 UI 프레임워크 혼합 | shadcn/ui + Tailwind 체계를 흐리고 스타일 충돌을 키움 | 단일 UI system 유지 |

## Stack Patterns by Variant

**If 스트리밍 구현이 핵심 이슈일 때:**
- Use `fetch` + `ReadableStream` + `TextDecoder`
- Because OpenRouter의 SSE 응답을 가장 직접적으로 제어할 수 있음

**If assistant Markdown 응답이 길고 코드 블록이 많을 때:**
- Use `react-markdown` + `remark-gfm` + `rehype-highlight`
- Because 렌더링 품질과 코드 가독성이 즉시 올라감

**If 모바일 사용성이 중요할 때:**
- Use shadcn/ui `Sheet` 기반 사이드바 토글
- Because 데스크톱의 고정 sidebar와 모바일의 drawer 패턴을 일관되게 가져갈 수 있음

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| React 19 | Vite react-ts template | 최신 Vite 템플릿 기준 초기 구성이 용이함 |
| TanStack Query 5.x | React 19 | query cache/staleTime 패턴에 무리 없음 |
| Dexie 4.x | browser IndexedDB | 브라우저 전용 persistence에 적합 |
| Tailwind CSS 4.x | shadcn/ui 패턴 | token 기반 스타일 체계를 맞추기 쉬움 |

## Sources

- `PROMPT.md` — 프로젝트 고정 스택과 제약 확인
- https://openrouter.ai/docs/api/api-reference/models/get-models.mdx — 모델 목록 엔드포인트 확인
- https://openrouter.ai/docs/guides/routing/routers/free-models-router — `openrouter/free` 및 free 라우팅 방식 확인
- https://openrouter.ai/docs/api/reference/streaming — SSE 스트리밍/AbortController 패턴 확인
- https://openrouter.ai/docs/api/reference/overview — 인증/기본 API 사용 방식 확인

---
*Stack research for: frontend-only OpenRouter chat app*
*Researched: 2026-03-31*
