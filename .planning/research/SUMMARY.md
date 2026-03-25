# Project Research Summary (프로젝트 리서치 요약)

**Project:** OpenRouter Free Chat App
**Domain:** Multi-user OpenRouter-based web chat application
**Researched:** 2026-03-25
**Confidence:** HIGH

## Executive Summary (핵심 요약)

이 프로젝트는 브라우저에서 직접 AI API를 호출하는 대신, NestJS 서버가 OpenRouter 무료 모델을 프록시하는 전형적인 BFF형 AI 채팅 웹앱이다. 핵심 구조는 인증, 대화 영속화, 스트리밍 중계 세 축으로 나뉘며, v1에서는 모델 선택이나 멀티모달보다 “안전한 로그인 + 안정적인 채팅 + 히스토리 복원”에 집중하는 것이 가장 타당하다.

권장 접근은 React 19 기반 SPA와 NestJS 11 백엔드를 분리하고, SQLite에 사용자/대화/메시지를 저장하는 방식이다. 서버 `.env` 로 OpenRouter API 키와 무료 모델 ID를 고정해 보안과 운영 복잡도를 통제하고, 프론트엔드는 TanStack Query와 Zustand를 분리 사용해 서버 상태와 UI 상태를 구분한다.

가장 큰 리스크는 API 키 노출, 사용자 소유권 검증 누락, 스트리밍과 저장 간 불일치다. roadmap은 이 세 가지를 초기에 차단하도록 인증/보안 기반을 먼저 만들고, 그 다음 대화 저장 구조와 스트리밍 통합을 쌓는 순서가 적절하다.

## Key Findings (핵심 발견)

### Recommended Stack (권장 스택)

NestJS 11.1.17, React 19.2.4, SQLite, TypeScript 5.x 조합이 현재 요구사항과 가장 잘 맞는다. React Query와 TanStack Router는 인증 라우트와 대화 데이터 흐름을 명확하게 만들고, Zustand는 선택된 대화나 입력 UI 같은 짧은 수명 상태를 관리하기 좋다.

**Core technologies:**
- NestJS: 서버 프록시, 인증, 도메인 모듈 분리에 적합
- React: SPA UI와 스트리밍 채팅 경험 구현에 적합
- SQLite: MVP 대화 히스토리 저장을 단순하게 시작할 수 있음

### Expected Features (예상 기능)

**Must have (table stakes):**
- 이메일/비밀번호 가입 및 로그인 — 다중 사용자 서비스의 최소 조건
- 대화 생성/목록/히스토리 — 채팅 앱의 기본 기대
- 스트리밍 응답 표시 — AI 채팅 UX의 기본 기대

**Should have (competitive):**
- 시스템 프롬프트 프리셋 — 반복 작업에 유용

**Defer (v2+):**
- 모델 전환 UI — 서버 고정 무료 모델 정책과 충돌
- 파일 첨부/멀티모달 — v1 범위를 벗어남

### Architecture Approach (아키텍처 접근)

프론트엔드는 보호 라우트가 있는 React SPA, 백엔드는 NestJS BFF, 저장소는 SQLite로 단순하게 시작한다. 핵심 경계는 `auth`, `conversations`, `chat proxy` 세 모듈이며, 모든 대화 데이터는 인증된 `userId` 기준으로만 접근해야 한다.

**Major components:**
1. Auth module — 가입, 로그인, 세션 검증
2. Conversation module — 대화/메시지 저장과 조회
3. Chat proxy module — OpenRouter 스트리밍 호출과 응답 중계

### Critical Pitfalls (치명적 함정)

1. **API 키 노출** — OpenRouter 호출을 전부 서버에 고정
2. **사용자 소유권 검증 누락** — 모든 대화 쿼리에 `userId` 조건 강제
3. **스트리밍과 저장 불일치** — 완료 시점 저장 규칙과 실패 처리 설계

## Implications for Roadmap (roadmap 시사점)

Based on research, suggested phase structure:

### Phase 1: Foundation & Auth
**Rationale:** 보안 경계와 실행 기반이 먼저 있어야 이후 기능이 안전하게 붙는다  
**Delivers:** monorepo/workspace 구성, 공통 설정, 인증 기반, 환경 변수 구조  
**Addresses:** AUTH requirements and security baseline  
**Avoids:** API 키 노출, 모델 정책 흔들림

### Phase 2: Conversation Persistence
**Rationale:** 채팅 UX 이전에 사용자별 대화 저장 구조가 있어야 한다  
**Delivers:** SQLite 스키마, 대화/메시지 CRUD, 사용자 소유권 검증  
**Uses:** ORM, NestJS domain modules  
**Implements:** conversation persistence boundary

### Phase 3: Streaming Chat
**Rationale:** 기반 저장 구조 위에 OpenRouter 스트리밍을 안전하게 얹는다  
**Delivers:** 메시지 전송, 스트리밍 중계, assistant 응답 저장  

### Phase 4: App UX Completion
**Rationale:** 핵심 기능이 연결된 뒤 보호 라우트, 히스토리 UX, 에러 핸들링을 다듬는다  
**Delivers:** 실제 사용 가능한 로그인 후 채팅 앱 경험

### Phase Ordering Rationale (phase 순서 근거)

- 인증과 환경 변수 경계가 먼저 있어야 API 키 노출 위험을 차단할 수 있다
- 히스토리 저장 구조가 먼저 있어야 스트리밍 완료 후 데이터를 일관되게 남길 수 있다
- 마지막 phase에서 UX 정리와 회귀 검증을 묶는 편이 MVP 완료 기준과 잘 맞는다

### Research Flags (추가 조사 플래그)

Phases likely needing deeper research during planning:
- **Phase 3:** OpenRouter 스트리밍 중계 방식과 실패 복구 규칙 세부 검증 필요

Phases with standard patterns (skip research-phase):
- **Phase 1:** NestJS auth/bootstrap, React app shell은 비교적 표준 패턴
- **Phase 2:** SQLite 기반 CRUD 구조는 비교적 표준 패턴

## Confidence Assessment (신뢰도 평가)

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | 공식 문서와 최신 패키지 버전으로 확인 |
| Features | HIGH | 사용자 요구와 일반 AI 채팅 제품 기대치가 명확함 |
| Architecture | HIGH | BFF형 AI 채팅 앱에서 일반적으로 타당한 구조 |
| Pitfalls | HIGH | 보안/저장/권한 경계가 명확한 도메인 리스크 |

**Overall confidence:** HIGH

### Gaps to Address (해결할 공백)

- OpenRouter 무료 모델 ID의 실제 선택은 구현 직전 공식 모델 목록으로 다시 검증 필요
- 세션 방식(cookie vs token)은 Phase 1 설계 시 구체화 필요

## Sources (출처)

### Primary (HIGH confidence)
- https://openrouter.ai/docs/quickstart — 서버사이드 호출 전제
- https://openrouter.ai/docs/api-reference/overview — API 구조 확인
- https://docs.nestjs.com/ — NestJS 구조와 인증 문서
- https://react.dev/ — React 19 공식 가이드
- https://tanstack.com/query/latest — Query 패턴
- https://tanstack.com/router/latest — Router 패턴

### Secondary (MEDIUM confidence)
- https://zustand.docs.pmnd.rs/ — 로컬 UI 상태 관리 패턴
- https://biomejs.dev/ — toolchain 패턴

### Tertiary (LOW confidence)
- 도메인 일반 구현 경험 기반 제품 기능/함정 정리

---
*Research completed: 2026-03-25*
*Ready for roadmap: yes*
