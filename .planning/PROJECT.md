# AI Chat App

## What This Is

OpenRouter 무료 API를 사용하는 웹 채팅 애플리케이션. 사용자가 웹 브라우저에서 AI와 자연스럽게 대화할 수 있으며, API 키는 백엔드 서버에서만 관리하여 프론트엔드에 절대 노출하지 않는다. MVP는 안정적인 단일 채팅 경험에 집중한다.

## Core Value

**사용자가 AI와 안정적으로 대화할 수 있는 최소한의 채팅 경험을 제공한다.** 무료 모델의 불안정성 속에서도 사용자가 혼란 없이 대화를 이어갈 수 있어야 한다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 사용자가 텍스트 메시지를 입력하고 AI 응답을 받을 수 있다
- [ ] AI 응답이 스트리밍으로 실시간 표시된다
- [ ] 로딩, 오류, 재시도 상태가 명확하게 표시된다
- [ ] 현재 사용 중인 모델 및 응답 상태가 표시된다
- [ ] 카드형 레이아웃의 반응형 UI (모바일/데스크톱 대응)
- [ ] 최소한의 설정 패널 (streaming on/off, system prompt, reset chat)
- [ ] 대화 컨텍스트가 백엔드 세션에 유지된다
- [ ] 표준화된 에러 응답 포맷과 보안 기본값이 적용된다

### Out of Scope

- 사용자 인증 / 다중 사용자 — MVP에서는 단일 사용자 세션 기반
- 결제 / 관리자 페이지 — 상업적 기능 불필요
- 장기 대화 저장용 DB — 백엔드 메모리 세션으로 충분
- 벡터 검색 / RAG — 단순 채팅에 불필요
- 파일 업로드 / 멀티모달 — 텍스트 대화에 집중
- 복잡한 권한 시스템 — 인증 자체가 out of scope
- 프로덕션 배포 — 로컬 개발 환경에서만 실행

## Context

- **OpenRouter 무료 모델 환경**: 응답 속도, 가용성, 품질 편차가 큼. 에러 처리와 fallback UX가 핵심
- **단일 모델 고정**: 기본 무료 모델 하나를 사용하며, 설정에서만 변경 가능
- **카드형 UI**: 메시지를 카드 형태로 표시하여 시각적 구분 강조
- **pnpm 모노레포**: backend(NestJS)와 frontend(React)가 같은 워크스페이스에 존재

## Constraints

- **Tech Stack**: Backend: NestJS, TypeScript, Prisma(SQLite), Passport/JWT | Frontend: React, TypeScript, Vite, shadcn/ui, zustand, @tanstack/react-query, @tanstack/react-router, Tailwind CSS v4, biome
- **Security**: OpenRouter API 키는 서버 환경변수로만 관리. 프론트엔드 직접 호출 금지
- **Runtime**: 로컬 개발 환경만. 배포 파이프라인 불필요
- **Quality**: 무료 모델 불안정성을 전제로 설계. 과설계 금지, MVP 우선

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 백엔드 세션으로 대화 유지 | DB 없이 메모리 기반이므로 구현 단순. 서버 재시작 시 초기화되는 것이 MVP에 적합 | — Pending |
| 단일 모델 고정 | 모델 선택 UX 복잡도를 피하고 안정적인 경험에 집중 | — Pending |
| 카드형 레이아웃 | 메시지 구분이 명확하고 시각적 품질이 높음. shadcn/ui의 Card 컴포넌트 활용 가능 | — Pending |
| pnpm 모노레포 구조 | frontend/backend 분리로 책임 경계 명확. 공통 타입 공유 가능 | — Pending |
| Prisma + SQLite | 복잡한 DB 설정 없이 스키마 관리. 추후 DB 전환 용이 | — Pending |

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
