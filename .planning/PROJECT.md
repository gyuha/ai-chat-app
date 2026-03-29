# OpenRouter Free Chat Web App

## What This Is

OpenRouter의 무료 API를 활용하는 웹 채팅 애플리케이션. ChatGPT와 유사한 사용성을 현대적 conversational UI 패턴으로 재해석하여, 다크 모드 우선의 반응형 인터페이스를 제공한다. API 키 보호를 위해 NestJS 백엔드 프록시를 거치며, 인증 시스템을 포함하여 사용자별 대화 관리가 가능하다.

## Core Value

사용자가 무료 AI 모델과 실시간 스트리밍으로 자연스럽게 대화할 수 있는 채팅 경험. 모든 기능은 이 핵심 흐름 — 질문하고 스트리밍 응답을 받는 것 — 을 방해하지 않아야 한다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 이메일/비밀번호 회원가입 및 로그인 (Passport/JWT)
- [ ] JWT 기반 세션 유지 (브라우저 새로고침 시에도 로그인 상태 유지)
- [ ] OpenRouter 무료 모델 선택 및 교체
- [ ] 토큰 단위 스트리밍 응답 (SSE/chunked)
- [ ] 대화 생성, 목록 조회, 삭제
- [ ] 대화 제목 자동 생성 (첫 메시지 기반)
- [ ] 시스템 프롬프트 및 모델 설정 UI
- [ ] 응답 생성 중단 (Stop generating)
- [ ] 마지막 응답 재시도 (Regenerate)
- [ ] 마크다운 렌더링 (코드 블록, 표, 목록 등)
- [ ] 코드 블록 복사 버튼
- [ ] 다크 모드 우선 UI
- [ ] 반응형 레이아웃 (모바일 지원)
- [ ] 에러/빈 상태/로딩 상태 UI 설계
- [ ] API rate limit 및 예외 처리
- [ ] 환경변수 기반 API 키 보안 관리
- [ ] 서버 사이드 모델 allowlist 관리

### Out of Scope

- 실시간 채팅 (WebSocket 기반 다자간 대화) — 단일 사용자 채팅에 집중
- 파일/이미지 업로드 — 텍스트 대화에 집중
- OAuth 소셜 로그인 — v1은 이메일/비밀번호만 지원
- 음성 입력/출력 — 텍스트 인터페이스에 집중
- 커스텀 모델 파인튜닝 — OpenRouter 제공 모델만 사용
- 결제/구독 시스템 — 무료 모델만 사용
- 모바일 네이티브 앱 — 웹 우선, 모바일은 반응형으로 대응

## Context

- OpenRouter는 다양한 AI 모델을 통합 API로 제공하는 플랫폼. 무료 모델이 일부 존재하며, 이를 활용한 채팅 앱을 구축
- ChatGPT의 정보 구조(사이드바 + 메인 채팅 영역)를 참고하되, 직접 복제가 아닌 현대적 UI 패턴으로 재해석
- shadcn/ui 컴포넌트 라이브러리를 기반으로 일관된 디자인 시스템 구축
- UI/UX Pro Max 스킬을 활용하여 제품 타입, 스타일, 팔레트, 타이포그래피, UX 가이드라인, 컴포넌트 우선순위를 체계적으로 설계
- pnpm workspace 기반 모노레포로 frontend/backend를 관리
- 배포는 v1 이후에 고려하되, 배포 가능한 구조로 설계

## Constraints

- **Tech Stack (Frontend)**: React, TypeScript, shadcn/ui, Zustand, TanStack Query, TanStack Router, Tailwind CSS v4, Biome — 사용자 명시적 요구
- **Tech Stack (Backend)**: NestJS, TypeScript, Prisma (SQLite), Passport/JWT — 사용자 명시적 요구
- **Monorepo**: pnpm workspace 사용 — frontend/backend 동시 개발 효율성
- **API Key Security**: 브라우저에 API 키 노출 금지 — 반드시 백엔드 프록시 거침
- **Free Models Only**: OpenRouter 무료 모델만 사용 — 유료 모델은 v2에서 검토
- **Streaming**: SSE 또는 chunked streaming 방식으로 토큰 단위 응답 — 사용자 경험 핵심

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| pnpm workspace 모노레포 | frontend/backend 동시 개발, 공통 타입 공유 | — Pending |
| Prisma + SQLite (초기 DB) | 경량 시작, 나중에 PostgreSQL로 마이그레이션 용이 | — Pending |
| TanStack Query = 서버 상태, Zustand = UI 상태 | 관심사 분리로 상태 관리 복잡도 감소 | — Pending |
| Tailwind CSS v4 사용 | shadcn/ui 호환, 유틸리티 퍼스트 | — Pending |
| Biome (ESLint/Prettie 대체) | 빠르고 통합된 린트/포맷팅 | — Pending |
| 다크 모드 우선 | 채팅 앱 사용자 선호도 반영 | — Pending |
| SSE 기반 스트리밍 | 구현 단순성, 브라우저 호환성 | — Pending |
| 인증 v1 포함 | 사용자별 대화 분리, 실서비스 수준 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-29 after initialization*
