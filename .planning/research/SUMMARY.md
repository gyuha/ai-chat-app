# 프로젝트 연구 요약

**프로젝트:** OpenRouter Free Chat Web App
**도메인:** AI 채팅 웹 애플리케이션
**조사일:** 2026-03-29
**신뢰도:** MEDIUM

## 실행 요약

이 프로젝트는 OpenRouter의 무료 API를 활용하여 ChatGPT와 유사한 스트리밍 채팅 경험을 제공하는 웹 애플리케이션입니다. 전문가들은 NestJS 백엔드 프록시로 API 키를 보호하고, SSE(Server-Sent Events) 기반 스트리밍으로 토큰 단위 응답을 전달하며, Prisma + SQLite로 데이터를 관리하는 모노레po 아키텍처를 권장합니다. 프론트엔드는 React 19 + TanStack Router로 파일 기반 라우팅을, TanStack Query로 서버 상태를, Zustand로 UI 상태를 분리 관리하는 것이 표준입니다.

연구에 따르면 MVP는 인증(이메일/비밀번호), 스트리밍 응답, 대화 관리, 마크다운 렌더링, 다크 모드, 반응형 레이아웃이 필수적이며, 모델 전환, 시스템 프롬프트, 응답 재생성은 v1.x에 추가하는 것이 적절합니다. 핵심 위험 요소는 스트리밍 연결 누수, JWT 토큰 만료 처리, OpenRouter Rate Limiting 예외 처리이며, 이는 각각 AbortController로 리소스 정리, refresh 토큰 자동 갱신, 429 에러 파싱으로 예방해야 합니다.

pnpm workspace 모노레po에서 의존성 충돌을 방지하기 위해 루트 package.json에 공통 의존성을 선언하고, 프론트엔드에서 OpenRouter API를 직접 호출하는 보안 실수를 절대 피해야 합니다. SQLite는 100명 미만 사용자까지 허용되지만, 프로덕션에서는 PostgreSQL 마이그레이션을 계획해야 합니다. 모든 연구 결과는 공식 문서와 입증된 아키텍처 패턴을 기반으로 하며, 웹 검색 도구의 rate limit으로 인해 일부 최신 2026년 트렌드는 추가 검증이 필요합니다.

## 핵심 발견

### 추천 기술 스택

**백엔드 핵심:** NestJS 11.0.2 (엔터프라이즈급 구조), Prisma 6.0.2 (타입 안전한 ORM), SQLite3 (개발용 경량 DB), Passport/JWT (인증), axios (HTTP 클라이언트), openai 4.77.3 (OpenRouter API 호환)

**프론트엔드 핵심:** React 19.2.4 (컴포넌트 기반 UI), Vite 6.0.3 (빠른 빌드), TanStack Router 1.168.8 (파일 기반 라우팅), TanStack Query 5.62.11 (서버 상태 관리), Zustand 5.0.2 (클라이언트 상태), shadcn/ui (컴포넌트 라이브러리), Tailwind CSS 4.2.2 (유틸리티 CSS), react-markdown 9.0.1 (마크다운 렌더링)

**개발 도구:** Biome 1.9.4 (린터/포맷터), Vitest 2.1.8 (단위 테스트)

### 예상 기능

**필수 기능 (테이블스테이크):**
- 스트리밍 응답 (토큰 단위) — ChatGPT/Claude 표준, 완성된 응답 대기는 불편
- 대화 목록 (사이드바) — 이전 대화 접근은 기본 기능
- 마크다운 렌더링 — 코드/포맷팅 없는 텍스트만 표시하면 부족함
- 다크 모드 — 채팅 앱 표준 (눈의 피로 감소)
- Stop generating — 긴 응답 중단 필요
- 반응형 레이아웃 — 모바일 사용 필수
- 에러 표시 및 재시도 — API 실패는 빈번함

**추가 기능 (경쟁력):
- 모델 전환 (Model Switching) — OpenRouter 다양한 모델 탐색
- 시스템 프롬프트 설정 — 모델 동작 커스터마이즈
- 대화 제목 자동 생성 — 목록 가독성 향상
- 응답 재생성 (Regenerate) — 같은 질문으로 다른 답변
- 코드 블록 복사 버튼 — 사용자 편의성

**v2+ 연기:**
- 파일 업로드/이미지 분석 — v1 범위 초과, OpenRouter 무료 모델 한계
- 음성 입력/출력 — 브라우저 호환성, API 비용
- 소셜 로그인 (OAuth) — v1 범위, 제공자 관리 복잡도
- 결제/구독 시스템 — 무료 모델 v1 목적과 상충

### 아키텍처 접근법

표준 계층형 아키텍처: React UI (프레젠테이션) → Zustand/TanStack Query (상태 관리) → Axios (API 클라이언트) → NestJS 모듈 (백엔드) → Prisma (ORM) → SQLite (DB) → OpenRouter API (외부). pnpm workspace로 프론트엔드/백엔드를 분리하되 공통 타입을 공유합니다.

**주요 컴포넌트:**
1. **NestJS Auth Module** — Passport/JWT 기반 인증, 사용자 관리, 토큰 발급/검증
2. **NestJS Chat Module** — OpenRouter 프록시, SSE 스트리밍, 대화/메시지 CRUD
3. **Prisma + SQLite** — User, Chat, Message 모델, 타입 안전한 쿼리, 마이그레이션 관리
4. **React + TanStack Router** — 파일 기반 라우팅, 코드 스플리팅, 중첩 라우트
5. **Zustand + TanStack Query** — 클라이언트 상태와 서버 상태 분리, 자동 캐싱/재검증
6. **SSE 기반 스트리밍** — NestJS Observable → EventSource → React 리렌더

### 주요 위험 요소

1. **스트리밍 연결 누수** — 클라이언트 연결 해제 시 AbortController로 HTTP 요청 취소, `try...finally`로 스트림 정리
2. **JWT 토큰 만료 후 스트리밍 중단** — Access 토큰 만료 5분 전 자동 갱신, 401 발생 시 refresh 토큰으로 재발급
3. **OpenRouter Rate Limiting 예외 누락** — HTTP 429와 Retry-After 헤더 처리, 사용자에게 명확한 메시지 전달
4. **스트리밍 응답 중단 시 메시지 불일치** — 메시지 상태 플래그(`streaming`, `completed`, `stopped`, `error`) 도입, 부분 응답 저장
5. **모노레포 의존성 호이스팅 충돌** — 루트 package.json에 공통 의존성 선언, `pnpm.overrides`로 버전 강제 통일

## 로드맵 시사점

연구 결과를 바탕으로 제안되는 단계 구조:

### Phase 0: 프로젝트 설정 및 인프라
**근거:** 모든 개발의 기반이 되며, 의존성 충돌과 같은 초기 위험을 방지
**전달물:** pnpm workspace 설정, 공통 의존성 정의, Biome 구성, Prisma 스키마, 마이그레이션
**다루는 기능:** PROJECT.md 요구사항 중 환경변수 기반 API 키 보안 관리
**피하는 위험:** 모노레포 의존성 호이스팅 충돌 (PITFALLS.md 위험 5)

### Phase 1: 인증 시스템
**근거:** 사용자별 대화 분리를 위한 필수 전제 조건이며, JWT 토큰 만료 처리를 조기에 구현
**전달물:** NestJS Auth Module, Passport/JWT 전략, 회원가입/로그인 API, 프론트엔드 인증 UI, TanStack Query 인증 쿼리
**사용 스택:** NestJS, Passport, JWT, bcrypt, class-validator, React, TanStack Query, Zustand
**구현 요소:** ARCHITECTURE.md의 NestJS Auth Module, 인증 흐름
**다루는 기능:** 이메일/비밀번호 회원가입 및 로그인, JWT 기반 세션 유지
**피하는 위험:** JWT 토큰 만료 후 스트리밍 중단 (PITFALLS.md 위험 4)

### Phase 2: 채팅 핵심 기능
**근거:** 핵심 사용자 경험인 스트리밍 응답과 대화 관리를 구현하며, 가장 복잡한 통합 로직 포함
**전달물:** NestJS Chat Module, OpenRouter 프록시, SSE 스트리밍, 대화/메시지 CRUD, Prisma 쿼리, 프론트엔드 채팅 UI, react-markdown 렌더링
**사용 스택:** NestJS, Prisma, axios, openai, React, TanStack Query, Zustand, EventSource, react-markdown, remark-gfm, rehype-highlight
**구현 요소:** ARCHITECTURE.md의 NestJS Chat Module, SSE 기반 스트리밍, 요청/스트리밍 흐름
**다루는 기능:** 토큰 단위 스트리밍 응답, 대화 생성/목록 조회/삭제, 마크다운 렌더링, Stop generating, 응답 재시도, 에러 표시 및 재시도
**피하는 위험:** 스트리밍 연결 누수 (PITFALLS.md 위험 1), 스트리밍 응답 중단 시 메시지 불일치 (위험 2), OpenRouter Rate Limiting 예외 누락 (위험 3)

### Phase 3: UX 향상 및 고급 기능
**근거:** 핵심 기능이 안정된 후 사용자 경험을 개선하고 경쟁력을 강화
**전달물:** 모델 전환 UI, 시스템 프롬프트 설정, 대화 제목 자동 생성, 코드 블록 복사 버튼, 빈 상태 UX
**다루는 기능:** OpenRouter 무료 모델 선택 및 교체, 시스템 프롬프트 및 모델 설정 UI, 대화 제목 자동 생성, 코드 블록 복사 버튼

### 단계 순서 근거

- **의존성 기반:** Prisma 스키마가 먼저 정의되어야 Auth/Chat 모듈에서 데이터 모델을 사용할 수 있음
- **아키텍처 패턴:** 하위 계층(데이터, 서비스)이 먼저 안정되어야 상위 계층(UI, 상태)을 안정적으로 구현 가능
- **위험 회피:** 스트리밍 연결 누수와 같은 위험은 Phase 1에서 인프라 수준에서 예방 조치를 취해야 Phase 2에서 구현 시 복잡도가 감소

### 연구 플래그

더 깊은 연구가 필요한 단계:
- **Phase 2 (채팅 핵심 기능):** OpenRouter API 스트리밍 응답 형식, 에러 코드, Rate Limiting 정책 확인 필요. SSE vs WebSocket tradeoffs 재검증 권장

표준 패턴으로 연구 단계 건너뛰기:
- **Phase 0 (프로젝트 설정):** pnpm workspace, Prisma, Biome는 문서화가 잘 되어 있음
- **Phase 1 (인증 시스템):** Passport/JWT는 NestJS에서 입증된 패턴, 공식 문서 충분
- **Phase 3 (UX 향상):** 모델 전환, 시스템 프롬프트는 표준 UI 패턴

## 신뢰도 평가

| 영역 | 신뢰도 | 비고 |
|------|---------|------|
| 기술 스택 | HIGH | npm 레지스트리와 공식 문서 직접 확인 (NestJS, React, Prisma, TanStack, shadcn/ui, Biome) |
| 기능 | MEDIUM | 웹 검색 도구 rate limit으로 최신 2026년 트렌드 확인 불가, ChatGPT/Claude 경쟁사 분석은 일반 지식 기반 |
| 아키텍처 | MEDIUM | 공식 문서와 입증된 패턴 기반이나, 웹 검색 제한으로 최신 2026년 트렌드 반영 불가 |
| 위험 요소 | MEDIUM | AI 채팅 애플리케이션 일반 패턴 기반이나, 구체적인 OpenRouter API 동작은 추가 검증 필요 |

**전체 신뢰도:** MEDIUM

### 해결해야 할 간격

- **OpenRouter API 스트리밍 형식:** 구현 시 실제 API 응답 구조 확인 필요 (chunked transfer, SSE 이벤트 형식)
- **OpenRouter Rate Limiting 정책:** 429 응답과 Retry-After 헤더 실제 동작 검증 필요
- **OpenRouter 토큰 사용량 메타데이터:** v2에서 토큰 시각화 구현 시 API 지원 여부 확인 필요
- **SSE vs WebSocket tradeoffs:** Phase 2 구현 전 실제 요구사항에 맞는 최종 결정 필요

## 출처

### 1차 (HIGH 신뢰도)
- npm 패키지 레지스트리 — 모든 버전 정보 직접 확인
- NestJS 공식 문서 (https://docs.nestjs.com) — SSE, 모듈 아키텍처
- React 공식 문서 (https://react.dev) — React 19
- Prisma 공식 문서 (https://www.prisma.io/docs) — ORM, 마이그레이션
- TanStack 공식 문서 (https://tanstack.com) — Query, Router
- shadcn/ui 공식 문서 (https://ui.shadcn.com) — 컴포넌트 라이브러리
- Biome 공식 문서 (https://biomejs.dev) — 린터/포매터
- OpenRouter 공식 문서 (https://openrouter.ai/docs) — API 기본 사항

### 2차 (MEDIUM 신뢰도)
- 프로젝트 문서 (.planning/PROJECT.md) — 요구사항, 제외 범위, 제약 조건
- AI 채팅 애플리케이션 일반 패턴 — 스트리밍 UX, 대화 관리, 인증
- NestJS 스트리밍 구현 일반적 실수 — 연결 누수, 메시지 불일치
- pnpm workspace 모노레포 관련 문제점 — 의존성 충돌, 호이스팅
- JWT 기반 인증 시스템 토큰 만료 처리 — refresh 토큰 패턴

### 3차 (LOW 신뢰도)
- 웹 검색 (rate limit으로 인해 제한적) — 2026년 최신 트렌드 확인 불가
- 경쟁사 분석 (ChatGPT, Claude) — 일반 지식 기반, 실시간 확인 불가

---
*연구 완료: 2026-03-29*
*로드맵 준비 완료: 예*
