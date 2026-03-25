# Stack Research (스택 리서치)

**Domain:** Multi-user OpenRouter-based web chat application
**Researched:** 2026-03-25
**Confidence:** HIGH

## Recommended Stack (권장 스택)

### Core Technologies (핵심 기술)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| NestJS | 11.1.17 | 인증, 채팅 프록시, 데이터 접근을 담당하는 백엔드 프레임워크 | 모듈 구조와 DI, 검증 파이프, 테스트 지원이 명확해 인증/도메인 분리에 유리하다 |
| React | 19.2.4 | 사용자용 SPA UI | 최신 React 기능과 생태계 호환성이 좋고 TanStack Router/Query 조합과 안정적으로 맞는다 |
| SQLite | 3.x | 사용자, 세션, 대화, 메시지 영속화 | MVP에서 운영 복잡도가 낮고 단일 서버 배포에 적합하다 |
| TypeScript | 5.x | 프론트/백엔드 공통 타입 안정성 | DTO, API 계약, 상태 모델을 명확히 유지하기 쉽다 |

### Supporting Libraries (보조 라이브러리)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tanstack/react-query | 5.95.2 | 서버 상태 fetch/cache/mutation | 로그인 상태, 대화 목록, 메시지 조회, optimistic update에 사용 |
| @tanstack/react-router | 1.168.3 | 타입 안전 라우팅 | 로그인/앱 보호 라우트와 loader 기반 데이터 연결에 사용 |
| zustand | 5.0.12 | 짧은 수명 UI 상태 관리 | 현재 선택된 대화, 입력 상태, 스트리밍 UI 상태 보관에 적합 |
| shadcn/ui | latest generator output | 접근성 있는 기본 UI 조합 | 대화 레이아웃, 폼, 리스트, 토스트, 다이얼로그를 빠르게 구성할 때 사용 |
| @biomejs/biome | 2.4.9 | 포맷팅과 lint | monorepo 성격의 프론트/백엔드 일관 규칙 관리에 적합 |

### Development Tools (개발 도구)

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | 패키지 매니저 및 워크스페이스 구성 | 프론트/백엔드 분리를 유지하면서 의존성 속도와 디스크 효율이 좋다 |
| Prisma 또는 Drizzle ORM | SQLite 스키마와 타입 안전 DB 접근 | NestJS 서비스 계층에서 채팅/사용자 모델 관리에 유리하다 |
| Vite | React 앱 번들/개발 서버 | TanStack Router와 함께 빠른 프론트엔드 개발 환경 구성에 적합하다 |

## Installation (설치)

```bash
# Core
pnpm add @nestjs/common @nestjs/core @nestjs/platform-express react react-dom typescript

# Supporting
pnpm add @tanstack/react-query @tanstack/react-router zustand

# Dev dependencies
pnpm add -D @biomejs/biome
```

## Alternatives Considered (검토한 대안)

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| NestJS | Fastify-only custom server | 매우 작은 API 서버이고 Nest 모듈 구조가 과하다고 판단될 때 |
| SQLite | PostgreSQL | 동시성 요구가 높아지고 다중 인스턴스 운영이 필요해질 때 |
| Zustand + TanStack Query | Redux Toolkit | 전역 도메인 상태가 크게 늘고 엄격한 이벤트 추적이 더 중요해질 때 |
| shadcn/ui | Headless UI 직접 조합 | 디자인 시스템을 완전히 커스텀하고 싶을 때 |

## What NOT to Use (사용하지 말 것)

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| 브라우저에서 OpenRouter 직접 호출 | API 키가 노출되고 rate limit 및 abuse 통제가 어렵다 | NestJS 서버 프록시 |
| 사용자별 모델 선택 UI를 v1에 포함 | 무료 모델 정책과 히스토리/테스트 복잡도가 급증한다 | 서버 `.env` 고정 모델 |
| 장기 보관이 필요한 상태를 Zustand에만 저장 | 새로고침 후 히스토리와 복구가 깨진다 | DB 영속화 + React Query 캐시 |

## Stack Patterns by Variant (조건별 스택 패턴)

**If MVP remains single-node:**
- Use SQLite + single NestJS API server
- Because deployment and backup are simple

**If traffic grows beyond a single instance:**
- Move chat/user storage to PostgreSQL and object storage backed logs
- Because SQLite write contention and local-file deployment become bottlenecks

## Version Compatibility (버전 호환성)

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| react@19.2.4 | @tanstack/react-query@5.95.2 | 최신 React 환경에서 일반적인 조합으로 사용 가능 |
| react@19.2.4 | @tanstack/react-router@1.168.3 | 파일/코드 라우팅 모두 지원 가능 |
| @nestjs/core@11.1.17 | typescript@5.x | 현재 Nest 11 문서 기준 권장 조합 |

## Sources (출처)

- https://openrouter.ai/docs/quickstart — OpenRouter API 호출 패턴과 서버사이드 사용 전제 확인
- https://docs.nestjs.com/ — NestJS 구조와 모듈 기반 백엔드 패턴 확인
- https://react.dev/ — React 19 최신 기능 및 공식 가이드 확인
- https://tanstack.com/query/latest — TanStack Query 최신 문서 확인
- https://tanstack.com/router/latest — TanStack Router 최신 문서 확인
- https://zustand.docs.pmnd.rs/ — Zustand 사용 패턴 확인
- https://biomejs.dev/ — Biome 도구 체계 확인
- `pnpm view` on 2026-03-25 — 버전 확인 (`@nestjs/core`, `react`, `@tanstack/react-query`, `@tanstack/react-router`, `zustand`, `@biomejs/biome`)

---
*Stack research for: Multi-user OpenRouter-based web chat application*
*Researched: 2026-03-25*
