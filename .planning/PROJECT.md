# OpenRouter Chat

## What This Is

OpenRouter 무료 모델을 활용한 ChatGPT 스타일의 웹 AI 채팅 애플리케이션. 사용자가 자신의 OpenRouter API 키를 등록하면 무료 LLM들과 대화할 수 있으며, 백엔드 서버 없이 브라우저에서 직접 API를 호출한다. 모든 데이터(대화, 설정)는 IndexedDB에 저장된다.

## Core Value

사용자가 복잡한 설정 없이 OpenRouter의 무료 AI 모델과 쉽게 대화할 수 있는 것

## Requirements

### Validated

- [x] API 키 관리: 사용자가 OpenRouter API 키를 등록/저장/변경/삭제 가능 (Phase 1)
- [x] 데이터 영속성: IndexedDB에 대화/설정 저장 (Phase 2 — DATA-01, DATA-02)
- [x] 채팅 기능: AI와 Markdown 포함 스트리밍 대화 가능 (Phase 1)
- [x] 대화 관리: 새 대화, 대화 목록, 대화 삭제, 제목 편집 (Phase 2)
- [x] UI-01: 좌측 사이드바 + 우측 채팅 영역 (Phase 2)
- [x] UI-02: 반응형 디자인 (모바일 <1024px, 데스크톱 >=1024px) (Phase 2)

### Active

- [ ] 무료 모델 선택: OpenRouter에서 무료 모델 목록 조회 및 선택 가능

### Out of Scope

- PWA / 오프라인 지원 — 별도 작업 필요
- 대화 내보내기/가져오기 — JSON 포맷, 향후 고려
- 유료 모델 지원 및 토큰 사용량 추적 — 별도 작업 필요
- 이미지/파일 첨부 (멀티모달) — 별도 작업 필요
- 다국어 지원 (i18n) — 한국어만 우선
- 사용자 인증/클라우드 동기화 — 별도 작업 필요

## Context

- **기술 환경**: React 19 + Vite, TypeScript strict mode
- **的目标**: ChatGPT와 유사한 직관적인 UI/UX
- **한국어 UI**: 모든 버튼, 레이블, 안내 문구 한국어
- **다크모드 기본**: shadcn/ui 기본 다크/라이트 모드 지원

## Constraints

- **프레임워크**: React 19 + Vite (확정)
- **패키지 관리**: pnpm (확정)
- **UI 라이브러리**: shadcn/ui + Tailwind CSS v4 (확정)
- **상태 관리**: Zustand (확정)
- **서버 상태**: TanStack Query v5 (확정)
- **라우팅**: TanStack Router (파일 기반 라우팅, 확정)
- **IndexedDB**: Dexie.js v4 (확정)
- **마크다운**: react-markdown + remark-gfm + rehype-highlight (확정)
- **HTTP**: 내장 fetch API (OpenRouter OpenAI 호환)
- **빌드**: 정적 파일 (Vercel, Netlify 등 배포 가능)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 백엔드 없는 순수 프론트엔드 | 복잡성 감소, 빠른 개발, 무료 호스팅 가능 | — Pending |
| IndexedDB 직접 사용 (Dexie.js) | Dexie.js가 IndexedDB ORM으로 가장 간단 | — Pending |
| shadcn/ui + Tailwind CSS | ChatGPT 스타일 UI 구현에 적합 | — Pending |
| 한국어만 우선 (i18n 미지원) |初期版의複雑性を低減 | — Pending |

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
*Last updated: 2026-03-31 after Phase 02 completion*
