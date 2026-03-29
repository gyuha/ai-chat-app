# 기술 스택

**프로젝트:** OpenRouter 무료 채팅 웹 앱
**조사일:** 2026-03-29
**전체 확신 수준:** HIGH

## 추천 스택

### 백엔드 코어 프레임워크

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **NestJS** | 11.0.2 | 백엔드 프레임워크 | 타입스크립트 네이티브, 의존성 주입, 모듈식 아키텍처, 확장성 있는 엔터프라이즈급 구조 |
| **TypeScript** | 6.0.2 | 타입 안전성 | 런타임 오류 방지, 리팩터링 용이성, IDE 지원 |
| **@nestjs/platform-express** | 11.0.5 | HTTP 서버 | NestJS 기본 어댑터, 안정적이고 문서화 잘됨 |
| **@nestjs/common** | 11.0.2 | 코어 데코레이터/유틸리티 | Controller, Injectable, Guards 등 표준 NestJS 패턴 |
| **@nestjs/core** | 11.0.2 | NestJS 코어 엔진 | 프레임워크 핵심 기능 |
| **@nestjs/config** | 4.0.3 | 환경변수 관리 | .env 기반 구성, 유효성 검증, 타입 안전성 |
| **ReflectMetadata** | 0.2.2 | 데코레이터 메타데이터 | NestJS 데코레이터 작동에 필수 (polyfill) |

### 인증 및 보안

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **@nestjs/passport** | 11.0.5 | 인증 프레임워크 | 전략 패턴 기반 인증, NestJS와 완벽한 통합 |
| **@nestjs/jwt** | 11.0.2 | JWT 모듈 | JWT 토큰 생성/검증, Passport와 통합 |
| **Passport** | 0.7.0 | 인증 미들웨어 | 전략 기반 인증의 사실상 표준 |
| **passport-jwt** | 4.0.1 | JWT 전략 | JWT 기반 인증 전략 구현 |
| **passport-local** | 1.0.0 | 로컬 전략 | 이메일/비밀번호 기반 인증 |
| **bcrypt** | 5.1.1 | 비밀번호 해싱 | 안전한 단방향 해싱, 솔트 자동 관리 |
| **class-validator** | 0.15.1 | DTO 유효성 검증 | 데코레이터 기반 유효성 검증, 자동 오류 메시지 |
| **class-transformer** | 0.5.1 | 객체 변환 | DTO 변환, 플레인 객체를 클래스 인스턴스로 |

### 데이터베이스 및 ORM

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **Prisma** | 6.0.2 | ORM | 타입스크립트 네이티브, 마이그레이션 관리, 자동 생성된 타입 |
| **@prisma/client** | 6.0.2 | Prisma 클라이언트 | 타입 안전한 데이터베이스 쿼리 |
| **SQLite3** | 5.1.7 | 개발용 데이터베이스 | 경량, 파일 기반, 설정 불필요, 나중에 PostgreSQL로 마이그레이션 용이 |

### HTTP 클라이언트 및 OpenRouter 통합

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **axios** | 1.7.9 | HTTP 클라이언트 | Promise 기반, 인터셉터, 타임아웃 설정 용이 |
| **openai** | 4.77.3 | OpenRouter API 클라이언트 | OpenRouter가 OpenAI API 호환, 스트리밍 지원 완벽 |

### 유틸리티

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **date-fns** | 4.1.0 | 날짜/시간 조작 | 모듈식, 불변, 트리 쉐이킹 가능 |
| **nanoid** | 5.0.9 | 고유 ID 생성 | 짧고 안전한 UUID 대안, 충돌 가능성 극히 낮음 |

### 프론트엔드 코어 프레임워크

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **React** | 19.2.4 | UI 라이브러리 | 컴포넌트 기반, 생태계 최대, 훅 기반 개발 |
| **React DOM** | 19.2.4 | DOM 렌더링 | 브라우저 DOM과 React 연결 |
| **TypeScript** | 6.0.2 | 타입 안전성 | 백엔드와 동일한 버전, 타입 공유 용이 |
| **Vite** | 6.0.3 | 빌드 도구 | 빠른 HMR, 네이티브 ESM, 최적화된 프로덕션 빌드 |
| **@vitejs/plugin-react** | 4.3.4 | React용 Vite 플러그인 | React JSX 변환, HMR 지원 |

### 상태 관리

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **@tanstack/react-query** | 5.62.11 | 서버 상태 관리 | 캐싱, 자동 리페칭, 낙관적 업데이트, 로딩/에러 상태 자동 관리 |
| **zustand** | 5.0.2 | 클라이언트 상태 | Redux보다 간단, 보일러플레이트 적음, 타입 안전성 |

### 라우팅

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **@tanstack/react-router** | 1.168.8 | 파일 기반 라우팅 | 타입 안전한 라우팅, 코드 스플리팅, 중첩 라우트, 로드/뮤테이션 함수 |

### UI 컴포넌트 및 스타일링

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **Tailwind CSS** | 4.2.2 | 유틸리티 우선 CSS | 빠른 개발, 일관된 디자인, 작은 번들 크기 |
| **shadcn/ui** | (최신) | 컴포넌트 라이브러리 | 복사-붙여넣기 기반, 완전한 커스터마이징, 접근성 우수 |
| **Radix UI** | (최신) | 비스타일 컴포넌트 | shadcn/ui 기반, 접근성 사실상 표준 |
| **class-variance-authority** | (최신) | 변형 관리 | shadcn/ui 필수, 컴포넌트 변형 타입 안전하게 |
| **clsx** | (최신) | 클래스 이름 조건부 병합 | 동적 클래스 이름 조작 |
| **tailwind-merge** | (최신) | Tailwind 클래스 병합 | 클래스 충돌 방지, 올바른 순서 보장 |

### 마크다운 렌더링

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **react-markdown** | 9.0.1 | 마크다운 → React | XSS 보안, 플러그인 생태계, 커스터마이징 |
| **remark-gfm** | 4.0.0 | GitHub Flavored Markdown | 표, 취소선, 자동링크 등 GitHub 확장 |
| **rehype-highlight** | 7.0.0 | 코드 하이라이팅 | 구문 강조, 다양한 언어 지원 |
| **remark-math** | 6.0.0 | 수학 표현 | KaTeX/LaTeX 수학 공식 지원 |

### HTTP 클라이언트 및 API 통합

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **axios** | 1.7.9 | HTTP 클라이언트 | 백엔드와 동일한 라이브러리, 인터셉터로 토큰 자동 주입 |
| **@tanstack/react-query** | 5.62.11 | API 상태 관리 | 캐싱, 재시도, 무효화, 낙관적 업데이트 |

### 개발 도구

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **Biome** | 1.9.4 | 린터/포매터 | ESLint/Prettier보다 100배 빠름, 통합 구성, Rust 기반 |
| **@biomejs/biome** | 1.9.4 | Biome CLI | 명령줄 도구 |
| **Vitest** | 2.1.8 | 단위 테스트 | Vite 네이티브, 빠른 HMR, Jest 호환 API |

### 타입 정의

| 기술 | 버전 | 용도 | 선정 이유 |
|------|------|------|-----------|
| **@types/node** | 22.10.5 | Node.js 타입 | 전역 Node.js 타입 |
| **@types/react** | 19.2.4 | React 타입 | React 타입 정의 |
| **@types/react-dom** | 19.2.4 | React DOM 타입 | ReactDOM 타입 정의 |
| **@types/passport-jwt** | 4.0.1 | Passport JWT 타입 | Passport JWT 타입 정의 |
| **@types/bcrypt** | 5.0.2 | bcrypt 타입 | bcrypt 타입 정의 |

## 대안 고려 및 제외 이유

| 카테고리 | 추천 | 대안 | 제외 이유 |
|----------|------|------|-----------|
| **상태 관리** | TanStack Query + Zustand | Redux Toolkit | Redux는 보일러플레이트가 많고 복잡. TanStack Query가 서버 상태를 더 잘 처리하며 Zustand가 클라이언트 상태에 더 간단함 |
| **라우팅** | TanStack Router | React Router v6 | TanStack Router가 타입 안전성이 우수하고 파일 기반 라우팅이 더 현대적 |
| **ORM** | Prisma | TypeORM, Drizzle | Prisma의 타입 안전성과 마이그레이션 도구가 최고급. Drizzle는 가볍지만 생태계가 Prisma만큼 성숙하지 않음 |
| **백엔드 프레임워크** | NestJS | Express, Fastify | NestJS가 구조화된 아키텍처를 제공하며 대규모 앱에 더 적합. Express는 너무 언박싱되어 있음 |
| **데이터베이스 (개발)** | SQLite | PostgreSQL, MongoDB | SQLite는 파일 기반이라 개발에 완벽. 나중에 PostgreSQL로 쉽게 마이그레이션 가능 |
| **린터/포매터** | Biome | ESLint + Prettier | Biome이 훨씬 빠르고 통합 구성이 더 간단. ESLint/Prettier는 별도 구성이 필요하고 느림 |
| **마크다운** | react-markdown | marked, markdown-it | react-markdown은 React 네이티브이며 XSS 보안이 내장됨. 다른 라이브러리들은 dangerouslySetInnerHTML 사용이 필요함 |
| **UI 라이브러리** | shadcn/ui | Material-UI, Chakra UI | shadcn/ui는 코드 소유권이 있어 완전한 커스터마이징 가능. 다른 라이브러리들은 블랙박스 컴포넌트에 의존 |
| **스트리밍** | Server-Sent Events (SSE) | WebSocket, Polling | SSE는 단방향 스트리밍에 더 간단하고 HTTP 호환. WebSocket은 양방향이 필요할 때만 사용. 폴링은 비효율적 |

## 설치

### 백엔드

```bash
cd backend

# 코어
npm install @nestjs/common@^11.0.0 @nestjs/core@^11.0.0 @nestjs/platform-express@^11.0.0 reflect-metadata@^0.2.0

# 구성
npm install @nestjs/config@^4.0.0

# 인증
npm install @nestjs/passport@^11.0.0 @nestjs/jwt@^11.0.0 passport@^0.7.0 passport-jwt@^4.0.1 passport-local@^1.0.0
npm install bcrypt@^5.1.0

# 유효성 검증
npm install class-validator@^0.15.0 class-transformer@^0.5.0

# 데이터베이스
npm install @prisma/client@^6.0.0

# OpenRouter/HTTP
npm install axios@^1.7.0 openai@^4.77.0

# 유틸리티
npm install date-fns@^4.1.0 nanoid@^5.0.0

# 개발 의존성
npm install -D prisma@^6.0.0
npm install -D @types/node@^22.0.0 @types/passport-jwt@^4.0.0 @types/bcrypt@^5.0.0 @types/passport-local@^1.0.0
```

### 프론트엔드

```bash
cd frontend

# 코어
npm install react@^19.0.0 react-dom@^19.0.0

# 빌드 도구
npm install -D vite@^6.0.0 @vitejs/plugin-react@^4.3.0

# 타입스크립트
npm install -D typescript@^6.0.0

# 라우팅
npm install @tanstack/react-router@^1.168.0

# 상태 관리
npm install @tanstack/react-query@^5.62.0 zustand@^5.0.0

# UI
npm install -D tailwindcss@^4.2.0
npm install class-variance-authority clsx tailwind-merge

# 마크다운
npm install react-markdown remark-gfm rehype-highlight remark-math

# HTTP
npm install axios@^1.7.0

# 개발 도구
npm install -D @biomejs/biome@^1.9.0
npm install -D @types/react@^19.0.0 @types/react-dom@^19.0.0
npm install -D vitest@^2.1.0
```

## 버전 호환성 참고 사항

- **React 19**: 최신 버전이지만 생태계 호환성 우수. shadcn/ui와 TanStack 라이브러리들이 React 19를 지원
- **TanStack Router v1**: 안정적이고 프로덕션 준비 완료. React 19와 완벽히 호환
- **Tailwind CSS v4**: 최신 주요 버전. shadcn/ui가 v4를 지원하며, 새로운 @import 기능 제공
- **Biome v1**: 안정적이고 ESLint/Prettier 완전 대체 가능
- **Prisma v6**: 최신 기능과 성능 향상. SQLite에서 PostgreSQL로의 마이그레이션 매끄러움

## 추가 권장 사항

### 프론트엔드
- **코드 복사**: `react-copy-to-clipboard` 또는 clipboard API 사용
- **아이콘**: `lucide-react` (shadcn/ui와 잘 통합됨)
- **폼 관리**: `react-hook-form` + `zod` (타입 안전한 폼 유효성 검증)
- **가상화**: 필요시 `@tanstack/react-virtual` (긴 대화 목록)

### 백엔드
- **API 문서화**: `@nestjs/swagger` (OpenAPI/Swagger 자동 생성)
- **Rate Limiting**: `@nestjs/throttler` (API 요청 속도 제한)
- **로깅**: `@nestjs/common` Logger 또는 외부 서비스 연동
- **CORS**: `@nestjs/platform-express` 내장 CORS 설정 사용

## 출처

- **npm 패키지 레지스트리**: 모든 버전 정보는 npm registry에서 직접 확인 (확신 수준: HIGH)
- **NestJS 공식 문서**: https://docs.nestjs.com (확신 수준: HIGH)
- **React 공식 문서**: https://react.dev (확신 수준: HIGH)
- **Prisma 공식 문서**: https://www.prisma.io/docs (확신 수준: HIGH)
- **TanStack 공식 문서**: https://tanstack.com (확신 수준: HIGH)
- **shadcn/ui 공식 문서**: https://ui.shadcn.com (확신 수준: HIGH)
- **Biome 공식 문서**: https://biomejs.dev (확신 수준: HIGH)
- **OpenRouter 공식 문서**: https://openrouter.ai/docs (확신 수준: HIGH)
