# OpenRouter Chat

## What This Is

OpenRouter 무료 모델을 활용해 브라우저에서 바로 대화할 수 있는 ChatGPT 스타일의 웹 AI 채팅 애플리케이션이다. 사용자는 자신의 OpenRouter API 키를 등록하고 무료 모델을 선택해 대화하며, 대화 기록과 설정은 모두 로컬 IndexedDB에 저장된다. 대상 사용자는 서버 없이 가볍고 빠르게 개인 AI 채팅 환경을 쓰고 싶은 웹 사용자다.

## Core Value

사용자가 서버 없이 자신의 OpenRouter API 키만으로 무료 모델과 안정적으로 대화하고, 대화 기록을 로컬에 안전하게 보관할 수 있어야 한다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] OpenRouter API 키를 등록하고 유효성을 검증할 수 있어야 한다.
- [ ] 무료 모델만 탐색하고 대화별로 모델을 선택할 수 있어야 한다.
- [ ] ChatGPT 스타일 UI에서 스트리밍 채팅과 Markdown 응답 렌더링이 동작해야 한다.
- [ ] 대화를 생성, 조회, 이름 변경, 삭제할 수 있어야 한다.
- [ ] 설정과 대화 데이터가 브라우저 로컬 저장소에 유지되어야 한다.

### Out of Scope

- 사용자 인증 및 클라우드 동기화 — v1은 프론트엔드 전용 로컬 앱에 집중한다.
- 유료 모델 지원 및 토큰 사용량 추적 — 무료 모델 경험 검증이 우선이다.
- 이미지/파일 첨부 및 멀티모달 흐름 — 텍스트 채팅 MVP 범위를 넘는다.
- PWA 오프라인 지원 및 데이터 내보내기/가져오기 — 초기 출시 후 사용성 검증 뒤 검토한다.
- 다국어 지원 — v1은 한국어 UI만 제공한다.

## Context

- 브라우저에서 OpenRouter OpenAI-compatible API를 직접 호출하는 프론트엔드 전용 프로젝트다.
- 좌측 사이드바와 우측 채팅 영역으로 구성된 ChatGPT 유사 레이아웃이 핵심 UX 기준이다.
- 대화, 설정, 선택한 모델, 시스템 프롬프트는 모두 IndexedDB에 저장한다.
- 한국어 UI, 다크모드 기본 활성, 반응형 레이아웃, 정적 호스팅 배포 가능성이 비기능 요구사항으로 확정되어 있다.
- OpenRouter 무료 모델 목록, 무료 여부 판단 기준, rate limit 정책은 구현 시점에 재검증이 필요하다.

## Constraints

- **Tech stack**: React 19 + Vite + TypeScript + pnpm + Biome — 사용자 지정 스택을 유지해야 한다.
- **UI stack**: shadcn/ui + Tailwind CSS v4 — 빠른 UI 구현과 일관된 접근성을 확보해야 한다.
- **State**: Zustand + TanStack Query v5 — 클라이언트 상태와 서버 상태 캐싱 역할을 분리한다.
- **Storage**: Dexie.js v4 기반 IndexedDB — 서버 없이 로컬 영속성을 제공해야 한다.
- **API architecture**: OpenRouter를 브라우저에서 직접 호출 — 백엔드 서버나 프록시를 두지 않는다.
- **Hosting**: 정적 파일 배포 가능 — Vercel, Netlify 같은 정적 호스팅에 올릴 수 있어야 한다.
- **Localization**: 한국어 UI 고정 — 버튼, 레이블, 안내 문구, 오류 문구를 한국어로 제공해야 한다.
- **Responsive UX**: 모바일부터 데스크톱까지 지원 — 사이드바 토글과 채팅 입력 UX가 반응형이어야 한다.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| OpenRouter Chat를 프론트엔드 전용 앱으로 설계 | 서버 운영 없이 빠르게 MVP를 검증하기 위해 | — Pending |
| OpenRouter API를 브라우저에서 직접 호출 | OpenAI 호환 API를 별도 백엔드 없이 사용할 수 있기 때문에 | — Pending |
| 모든 설정과 대화를 IndexedDB에 저장 | 로컬 우선 UX와 정적 호스팅 배포 조건을 만족하기 위해 | — Pending |
| shadcn/ui + Tailwind CSS v4를 기본 UI 체계로 사용 | ChatGPT 유사 레이아웃을 빠르고 일관되게 구현하기 위해 | — Pending |
| 한국어 UI와 다크모드를 v1 기본값으로 채택 | 목표 사용자 경험을 명확히 하고 초반 범위를 좁히기 위해 | — Pending |

## Evolution

이 문서는 phase 전환과 milestone 경계에서 계속 갱신된다.

**After each phase transition** (via `$gsd-transition`):
1. 무효화된 요구사항이 있으면 Out of Scope로 이동하고 이유를 남긴다.
2. 검증된 요구사항이 있으면 Validated로 이동하고 어떤 phase에서 검증됐는지 기록한다.
3. 새 요구사항이 생기면 Active에 추가한다.
4. 기록할 결정이 생기면 Key Decisions에 추가한다.
5. 제품 설명이 달라졌다면 What This Is를 현재 상태에 맞게 갱신한다.

**After each milestone** (via `$gsd-complete-milestone`):
1. 모든 섹션을 전체 검토한다.
2. Core Value가 여전히 맞는 우선순위인지 확인한다.
3. Out of Scope의 이유가 여전히 유효한지 점검한다.
4. 현재 제품 상태를 Context에 반영한다.

---
*Last updated: 2026-03-30 after initialization*
