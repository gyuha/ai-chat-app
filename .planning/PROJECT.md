# OpenRouter Chat

## What This Is

OpenRouter의 무료 모델을 활용해 브라우저에서 직접 대화할 수 있는 ChatGPT 스타일의 웹 AI 채팅 애플리케이션이다. 사용자는 자신의 OpenRouter API 키를 등록하고, 무료 모델을 선택해 대화를 생성·조회·관리할 수 있으며, 모든 데이터는 서버 없이 IndexedDB에 저장된다.

## Core Value

사용자가 별도 백엔드 없이도 자신의 OpenRouter API 키만으로 무료 모델과 안정적으로 대화하고, 그 기록을 로컬에 계속 보존할 수 있어야 한다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] OpenRouter API 키를 입력·검증·저장·수정·삭제할 수 있어야 한다.
- [ ] 무료 모델만 필터링해서 조회하고 기본 모델 및 대화별 모델을 선택할 수 있어야 한다.
- [ ] ChatGPT 스타일의 채팅 UI에서 스트리밍 응답을 실시간으로 표시할 수 있어야 한다.
- [ ] 대화 목록, 제목, 생성/삭제/선택 흐름을 사이드바에서 관리할 수 있어야 한다.
- [ ] 모든 설정, 대화, 메시지를 IndexedDB에 영속 저장할 수 있어야 한다.
- [ ] 한국어 UI, 다크모드 기본, 반응형 레이아웃을 제공해야 한다.

### Out of Scope

- 사용자 인증/클라우드 동기화 — v1은 프론트엔드 전용 로컬 앱 범위를 유지하기 위해 제외
- 유료 모델 지원 및 토큰 사용량 추적 — 무료 모델 경험을 먼저 검증하기 위해 제외
- 이미지/파일 첨부 및 멀티모달 — 초기 범위를 채팅 텍스트 경험에 집중하기 위해 제외
- PWA / 오프라인 고도화 — IndexedDB 기반 로컬 저장만 우선 제공하고 이후 검토
- 다국어 지원 — v1은 한국어 UI를 기본으로 고정
- 대화 내보내기/가져오기 — 핵심 채팅 경험이 아닌 부가 기능이므로 후순위

## Context

- 제품 형태: OpenRouter 무료 모델 기반 ChatGPT 유사 웹 채팅 앱
- 실행 환경: 브라우저 전용 프론트엔드, 서버 없음
- 데이터 저장: IndexedDB (`settings`, `conversations`, `messages`)
- 핵심 UX: 좌측 사이드바 + 우측 채팅 영역, 모바일에서는 토글형 사이드바
- 사용자 언어: 버튼, 레이블, 안내 문구를 포함한 사용자-facing 텍스트는 한국어
- 문서 규칙: GSD 관련 안내, 질문, 요약, 생성 문서와 `ui-ux-pro-max` 설명/추천안/근거는 한국어

## Constraints

- **Tech stack**: React 19 + Vite + TypeScript strict mode — 확정된 스택을 유지해야 함
- **Package manager**: pnpm — 프로젝트 초기화 및 의존성 관리는 pnpm 기준으로 진행
- **UI**: shadcn/ui + Tailwind CSS v4 — 일관된 컴포넌트/테마 시스템을 유지하기 위함
- **State**: Zustand + TanStack Query + TanStack Router — 로컬 상태, 서버 상태, 라우팅 역할을 분리하기 위함
- **Persistence**: Dexie.js over IndexedDB — 서버 없이 로컬에 대화 및 설정을 저장해야 하기 때문
- **Networking**: 브라우저 내장 `fetch` — OpenRouter OpenAI 호환 API를 직접 호출하기 위함
- **Deployment**: 정적 호스팅 가능해야 함 — Vercel/Netlify 등에 배포 가능한 산출물이어야 함
- **Language**: 한국어 UI와 한국어 GSD 문서 — 사용자 경험과 프로젝트 운영 규칙을 맞추기 위함

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 프론트엔드 전용 구조를 유지한다 | 서버 운영 없이 빠르게 배포하고 개인 API 키 기반 사용 모델을 단순화하기 위해 | — Pending |
| OpenRouter 무료 모델만 v1 대상에 포함한다 | 초기 경험을 낮은 비용과 명확한 범위 안에서 검증하기 위해 | — Pending |
| ChatGPT 유사 2-pane 레이아웃을 채택한다 | 사용자가 익숙한 채팅 UX를 빠르게 이해하도록 하기 위해 | — Pending |
| 모든 핵심 데이터는 IndexedDB에 저장한다 | 대화/설정 지속성을 서버 없이 확보하기 위해 | — Pending |
| GSD UI 관련 작업에는 `ui-ux-pro-max`를 함께 사용한다 | UI/UX 산출물과 설명 품질을 일관되게 유지하기 위해 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-31 after initialization*
