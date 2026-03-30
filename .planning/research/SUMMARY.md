# 프로젝트 리서치 요약

**프로젝트:** OpenRouter Chat (ChatGPT 스타일 AI 채팅 앱)
**도메인:** 프론트엔드 전용 AI 채팅 앱 (React + TypeScript)
**조사일:** 2026-03-30
**신뢰도:** MEDIUM

## 실행 요약

OpenRouter Chat은 백엔드 서버 없이 브라우저에서만 실행되는 AI 채팅 앱입니다. OpenRouter의 무료 모델 API를 직접 호출하며, 모든 데이터는 IndexedDB에 저장됩니다. ChatGPT 스타일의 UI/UX를 제공하며 실시간 SSE 스트리밍으로 토큰 단위 응답을 표시합니다.

전문가들은 이 유형의 앱을 **클라이언트 상태(Zustand)와 서버 상태(TanStack Query)의 명확한 분리**로 구축합니다. UI 상태는 Zustand로, 영구 데이터는 TanStack Query + IndexedDB 조합으로 관리하는 것이 핵심입니다. SSE 스트리밍 구현 시 리소스 누수 방지를 위해 AbortController와 cleanup 함수가 필수적이며, 대용량 마크다운 렌더링 시 메모이제이션과 길이 제한으로 프리징을 방지해야 합니다.

주요 위험 요소는 **SSE 리소스 누수, IndexedDB 트랜잭션 deadlock, 스키마 마이그레이션 무시**입니다. 이들을 방지하기 위해 Phase 1에서 올바른 패턴을 확정하고, 트랜잭션 내부에서 외부 API 호출을 금지하는 린트 규칙을 적용해야 합니다. OpenRouter 무료 모델의 Rate Limit(약 20req/min, 200req/day)을 고려하여 스로틀링과 429 에러 처리를 구현해야 합니다.

## 핵심 발견

### 추천 기술 스택

React 19 + Vite + TypeScript 조합을 기반으로 Tailwind CSS v4로 스타일링합니다. 상태 관리는 Zustand(클라이언트)와 TanStack Query(서버)로 분리하고, 파일 기반 라우팅은 TanStack Router로 처리합니다. IndexedDB ORM은 Dexie.js를 사용하며 마크다운 렌더링은 react-markdown + remark-gfm + rehype-highlight 조합으로 구현합니다.

**핵심 기술:**
- **React 19** — use() 훅, useOptimistic으로 낙관적 업데이트 간소화
- **Vite 6** — 번들링 없는 즉시 개발 서버 시작, HMR 지원
- **TypeScript 5.7** — strict 모드로 런타임 에러 사전 방지
- **Tailwind CSS v4** — CSS 변수 기반 새 아키텍처, 제로 런타임
- **Zustand 5** — 클라이언트 상태용 (API 키, 테마, UI 상태)
- **TanStack Query 5** — 서버 상태용 (OpenRouter API 호출, 캐싱)
- **TanStack Router 1** — 타입 안전한 파일 기반 라우팅
- **Dexie.js 4** — IndexedDB ORM으로 브라우저 내 영구 저장
- **react-markdown 9** — XSS 보호, 플러그인 생태계

### 예상 기능

**필수 기능 (Table Stakes):**
- 실시간 SSE 스트리밍 — ChatGPT 표준 경험, 토큰 단위 응답
- 마크다운 렌더링 — 코드블록, 리스트, 헤더 등 서식
- 점진적 마크다운 렌더링 — 스트리밍 중 부분 마크다운 표시
- 코드블록 구문 강조 + 복사 버튼 — 코드 가독성과 사용자 편의성
- 대화 목록 (사이드바) — 대화 전환, 이력 관리
- 새 대화 생성/삭제 — 세션 시작, 관리 용이성
- 대화 제목 자동 생성 — 대화 식별 (첫 메시지 기반 요약)
- 메시지 전송/수신 + Stop 버튼 — 채팅 핵심 기능, 스트리밍 중단
- 모델 선택 — OpenRouter 무료 모델 필터링
- 시스템 프롬프트 설정 — AI 동작 제어
- API 키 관리 — OpenRouter 인증
- 다크/라이트 테마 — 사용자 기대
- 반응형 레이아웃 — 모바일 지원 (1024px 브레이크포인트)
- 오토스크롤 — 스트리밍 추적
- 로딩 인디케이터 — 응답 대기 피드백
- 에러 처리 — 실패 시 안내, 재시도 버튼

**차별화 기능 (Differentiators):**
- 로컬 전용 저장 — 프라이버시, 오프라인 가능
- 무료 모델만 사용 — 비용 제로, 접근성
- 메시지 재전송(Regenerate) — 응답 다시 받기
- 키보드 단축키 — 파워 유저 지원
- 대화 검색 — 대화 빠른 찾기
- 토큰 사용량/응답 시간 표시 — 투명성

**연기 (v2+):**
- PWA/오프라인 지원 — 로컬 환경에서 항상 온라인 상태
- 대화 내보내기/가져오기 — v2에서 고려
- 유료 모델 지원 — 무료 모델만 사용 목적
- 이미지/파일 첨부(멀티모달) — 복잡도 높음
- 다국어 지원(i18n) — 한국어 UI만 필요
- 사용자 인증/로그인 — 로컬 전용, 백엔드 없음
- 클라우드 동기화 — 로컬 전용, 프라이버시
- 음성 입력/출력 — v2에서 기술적 가능성 검토

### 아키텍처 접근

4계층 아키텍처(Presentation → State Management → Business Logic → Data Layer)를 따르며, 레이어별 책임을 명확히 분리합니다.

**주요 컴포넌트:**
1. **Presentation Layer** — React Components + shadcn/ui로 UI 렌더링, 사용자 입력 처리
2. **State Management** — Zustand(클라이언트 상태) + TanStack Query(서버 상태)로 상태 분리
3. **Service Layer** — ChatService, ModelService, StorageService, StreamService로 비즈니스 로직 집중
4. **Data Layer** — Dexie.js로 IndexedDB CRUD 연산 처리

**핵심 패턴:**
- **SSE 스트리밍 with AbortController** — 실시간 스트리밍 및 중단
- **TanStack Query + Dexie.js 통합** — IndexedDB 데이터를 캐싱 레이어로 관리
- **TanStack Router 라우트 구조** — 파일 기반 라우팅 및 중첩 레이아웃
- **점진적 마크다운 렌더링** — 스트리밍 중 불완전한 마크다운 처리

### 주요 위험 요소

1. **SSE 스트리밍 리소스 누수** — AbortController로 중단된 연결이 정리되지 않아 메모리 누수 발생. useEffect cleanup 함수에서 controller.abort() 호출 필수.

2. **IndexedDB 트랜잭션 deadlock** — 트랜잭션 내에서 비동기 작업을 기다리면 트랜잭션이 자동 종료되어 TransactionInactiveError 발생. 트랜잭션 내부는 순수 DB 작업만 수행.

3. **Dexie.js 스키마 마이그레이션 무시** — 스키마 변경 시 버전 증가와 마이그레이션 로직 미작성으로 사용자 데이터베이스 호환성 문제 발생.

4. **대용량 마크다운 렌더링 프리징** — rehype-highlight가 메인 스레드를 차단하여 UI 멈춤. 메모이제이션 + 길이 제한으로 방지.

5. **OpenRouter 무료 모델 Rate Limit 누락** — 20req/min, 200req/day 제한을 고려하지 않아 429 에러 발생. 스로틀링과 에러 처리 필요.

6. **Zustand + TanStack Query 상태 중복** — 클라이언트 상태와 서버 상태 경계 불명확으로 불일치 발생. Zustand는 UI 상태만, TanStack Query는 영구 데이터만 관리.

7. **TanStack Router 파일 기반 라우팅 실수** — 경로 파라미터 파싱 실수로 404 또는 데이터 누락. loader 패턴 따르기.

## 로드맵 시사점

리서치를 바탕으로 제안되는 단계 구조:

### Phase 1: 기본 채팅 구현

**근거:** SSE 스트리밍과 마크다운 렌더링이 핵심 기능이며, 가장 높은 복잡도와 위험 요소를 가집니다. 이를 먼저 안정적으로 구현해야 후속 기능 추가가 가능합니다.

**전달물:**
- API 키 관리 (등록/변경/삭제)
- 새 대화 생성
- 메시지 전송/수신 (SSE 스트리밍)
- 기본 마크다운 렌더링
- 코드블록 구문 강조
- Stop 버튼
- 대화 목록 (사이드바)
- 대화 삭제
- 모델 선택 (무료 모델 필터링)
- 다크/라이트 테마
- 반응형 레이아웃 (모바일 사이드바)
- 오토스크롤
- 입력 영역 자동 높이
- Enter 전송, Shift+Enter 줄바꿈
- 로딩 인디케이터

**다루는 기능:** FEATURES.md의 Table Stakes 전체

**피해야 할 위험:** PITFALLS.md의 SSE 리소스 누수, 마크다운 프리징, Rate Limit 누락, Zustand+TanStack Query 중복, TanStack Router 실수

### Phase 2: 데이터 관리 고도화

**근거:** Phase 1에서 구현한 기본 기능을 안정화하고, 사용자 경험을 개선하는 부가 기능을 추가합니다. 대화 제목 자동 생성과 점진적 마크다운 렌더링은 복잡도가 높아 별도 단계로 분리합니다.

**전달물:**
- 대화 제목 자동 생성
- 점진적 마크다운 렌더링
- 코드블록 복사 버튼
- 기본 모델 설정
- 시스템 프롬프트 설정
- 에러 처리 (재시도 버튼)
- 메시지 재전송 (Regenerate)
- 메시지 복사
- 키보드 단축키

**사용하는 스택:** STACK.md의 Dexie.js 마이그레이션, TanStack Query 캐싱 전략

**구현하는 아키텍처:** ARCHITECTURE.md의 Service Layer 패턴, 점진적 마크다운 렌더링

### Phase 3: 사용자 경험 개선 (선택)

**근거:** 핵심 기능이 안정화된 후, 사용자 편의성을 높이는 부가 기능을 추가합니다. 필수는 아니지만 가치가 있는 기능들입니다.

**전달물:**
- 대화 검색
- 토큰 사용량 표시
- 응답 시간 표시
- 스트리밍 속도 제어
- 입력 힌트/플레이스홀더
- 빈 상태 안내

### 단계 순서 근거

- **의존성 순서:** 데이터 계층(Dexie.js) → 서비스 계층(ChatService) → 상태 관리(Zustand + TanStack Query) → UI 컴포넌트 → 라우팅
- **위험 요소 완화:** 가장 높은 위험(SSE 리소스 누수, 마크다운 프리징)을 Phase 1에서 먼저 해결
- **아키텍처 패턴:** 클라이언트/서버 상태 분리를 Phase 1에서 확정하여 후속 개발에서 혼란 방지
- **사용자 가치:** 가장 핵심적인 채팅 경험을 Phase 1에서 제공하여 빠른 피드백 가능

### 리서치 플래그

추가 연구가 필요한 단계:
- **Phase 1:** OpenRouter API 공식 문서 확인 (무료 모델 목록, Rate Limit 수치, SSE 스트리밍 응답 포맷)
- **Phase 1:** Dexie.js v4 IndexedDB 스키마 설계, 트랜잭션 패턴 검증
- **Phase 1:** react-markdown 점진적 렌더링 최적 라이브러리/패턴 조사
- **Phase 2:** Dexie.js 스키마 마이그레이션 모범 사례, upgrade 함수 작성법

표준 패턴으로 연구 단계 건너뛰기:
- **Phase 1 UI 컴포넌트:** shadcn/ui + Tailwind CSS v4는 잘 문서화된 패턴
- **Phase 1 상태 관리:** Zustand + TanStack Query 조합은 React 생태계 표준 패턴
- **Phase 1 라우팅:** TanStack Router 파일 기반 라우팅은 공식 문서가 충분

## 신뢰도 평가

| 영역 | 신뢰도 | 비고 |
|------|------------|-------|
| 스택 | MEDIUM | 공식 문서 확인 불가, 훈련 데이터 기반. React 19, Vite 6, Tailwind v4는 최신 버전으로 검증 필요 |
| 기능 | MEDIUM | 프로젝트 요구사항(HIGH) + ChatGPT UI/UX 패턴(HIGH) + OpenRouter API 스펙(MEDIUM). 무료 모델 필터링 로직 검증 필요 |
| 아키텍처 | MEDIUM | React 생태계 모범 사례 기반. 최신 라이브러리 버전별 특이사항 검증 필요 |
| 위험 요소 | MEDIUM | 문서/경험 기반. SSE, Dexie.js는 HIGH 신뢰도. React 성능, OpenRouter API는 LOW 신뢰도로 Phase 1에서 검증 필요 |

**전체 신뢰도:** MEDIUM

### 해결해야 할 간격

- **OpenRouter API 스펙:** 무료 모델 목록, Rate Limit 정확한 수치, SSE 스트리밍 응답 포맷 → Phase 1 구현 전 공식 문서 확인
- **점진적 마크다운 렌더링:** 불완전한 코드블록 처리 최적 패턴 → Phase 1 구현 전 react-markdown 문서 확인
- **Dexie.js 스키마 마이그레이션:** upgrade 함수 작성 모범 사례 → Phase 2 시작 전 공식 문서 확인
- **TanStack Router v1:** loader 패턴, 파일 기반 라우팅 규칙 → Phase 1 구현 전 공식 문서 확인
- **React 19 + Zustand/TanStack Query 호환성:** 새로운 React 19 기능과 기존 라이브러리 호환성 → Phase 1 구현 전 공식 문서 확인

## 출처

### 1차 (HIGH 신뢰도)
- React 19 공식 블로그 (https://react.dev/blog/2024-12-05-react-19) — React 19 새로운 기능
- Vite 공식 문서 (https://vitejs.dev/guide/) — 빌드 도구 설정
- shadcn/ui 공식 문서 (https://ui.shadcn.com/docs/install) — 컴포넌트 라이브러리
- TanStack Query 공식 문서 (https://tanstack.com/query/latest) — 서버 상태 관리
- TanStack Router 공식 문서 (https://tanstack.com/router/latest) — 파일 기반 라우팅
- Dexie.js 공식 문서 (https://dexie.org/) — IndexedDB ORM
- Biome 공식 문서 (https://biomejs.dev/) — Linter + Formatter
- react-markdown GitHub (https://github.com/remarkjs/react-markdown) — 마크다운 렌더링

### 2차 (MEDIUM 신뢰도)
- Tailwind CSS v4 공식 블로그 (https://tailwindcss.com/blog/tailwindcss-v4-alpha) — alpha 버전으로 변경 가능성
- 프로젝트 요구사항 (PROJECT.md, CLAUDE.md) — 프로젝트 컨텍스트
- 표준 ChatGPT UI/UX 패턴 — 업계 표준

### 3차 (LOW 신뢰도)
- OpenRouter API 스펙 — 공식 문서 미확인, Phase 1에서 검증 필요
- React 성능 최적화 — 구체적 최신 문서 미확인, Phase 1에서 검증 필요
- TanStack Router v1 — 최신 버전 특이사항, Phase 1에서 검증 필요

---
*리서치 완료: 2026-03-30*
*로드맵 준비 완료: yes*
