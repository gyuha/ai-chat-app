# OpenRouter Free Chat App

## What This Is

여러 사용자가 이메일과 비밀번호로 로그인한 뒤, 서버가 보관한 OpenRouter API 키를 통해 무료 모델 기반 채팅을 사용할 수 있는 웹 애플리케이션이다. 프론트엔드는 React와 TypeScript 중심의 SPA로 구성하고, 백엔드는 NestJS와 TypeScript로 인증, 채팅 프록시, 히스토리 저장을 담당한다. v1 목표는 로그인 이후 안정적으로 채팅하고, 이전 대화 히스토리를 다시 확인할 수 있는 수준까지 완성하는 것이다.

## Core Value

OpenRouter API 키를 노출하지 않으면서 여러 사용자가 안정적으로 로그인하고 채팅 히스토리를 이어서 사용할 수 있어야 한다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 여러 사용자가 이메일/비밀번호로 계정을 만들고 로그인할 수 있어야 한다
- [ ] 로그인한 사용자가 서버에 저장된 OpenRouter 무료 모델로 스트리밍 채팅을 할 수 있어야 한다
- [ ] 로그인한 사용자가 대화 목록과 대화별 메시지 히스토리를 다시 볼 수 있어야 한다

### Out of Scope

- 사용자가 직접 OpenRouter 모델이나 API 키를 선택/입력하는 기능 — 서버 `.env` 에서 무료 모델과 키를 고정해 보안과 운영 복잡도를 낮춘다
- 소셜 로그인 및 OAuth — v1 핵심 가치인 안전한 채팅 플로우 검증보다 범위가 커진다
- 파일 첨부, 멀티모달 입력, 이미지 생성 — 무료 텍스트 채팅 MVP 범위를 벗어난다
- 다중 모델 전환, 프롬프트 프리셋 관리 — 핵심 채팅 경험 검증 후 고려한다
- 관리자 콘솔, 사용량 분석 대시보드 — 초기 검증보다 운영 보조 기능에 가깝다

## Context

- 현재 디렉터리는 실질적인 앱 코드가 없는 greenfield 상태다
- 웹 앱과 서버를 분리해 OpenRouter API 키를 브라우저에 노출하지 않는 것이 핵심 전제다
- 백엔드는 NestJS + TypeScript, 프론트엔드는 React + TypeScript + shadcn/ui + Zustand + TanStack Query + TanStack Router + pnpm + Biome를 사용한다
- 인증은 이메일/비밀번호 방식으로 시작하고, 히스토리는 SQLite에 저장한다
- 모델 선택은 사용자 노출 없이 서버 `.env` 값으로 고정한다

## Constraints

- **Security**: OpenRouter API 키는 서버 환경 변수로만 관리하고 클라이언트 번들에 포함되면 안 된다 — 사용자별 키 유출 위험을 막아야 한다
- **Model policy**: 무료 모델 1종을 서버에서 고정한다 — UI와 운영 복잡도를 줄이고 비용/호환성 변동을 통제한다
- **Database**: SQLite를 사용한다 — 초기 개발 속도와 단순 배포를 우선한다
- **Auth**: 이메일/비밀번호 로그인을 제공한다 — 다중 사용자 서비스의 최소 계정 경계를 확보해야 한다
- **Scope**: v1 완료 기준은 로그인 후 채팅 성공과 히스토리 조회 가능 여부다 — MVP 범위를 엄격히 유지해야 한다

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| NestJS 백엔드 + React 프론트엔드 분리 | API 키 은닉과 역할 분리가 명확하다 | — Pending |
| OpenRouter 무료 모델을 서버 `.env` 로 고정 | 사용자 선택 기능보다 안정적 운영과 보안이 우선이다 | — Pending |
| SQLite로 사용자/대화 히스토리 저장 | MVP에서 설정과 배포 복잡도를 낮춘다 | — Pending |
| 인증 방식을 이메일/비밀번호로 제한 | 다중 사용자 지원의 최소 요구를 빠르게 충족한다 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-25 after initialization*
