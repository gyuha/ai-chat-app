# OpenRouter Chat

## What This Is

OpenRouter 무료 모델을 활용한 ChatGPT 스타일의 웹 AI 채팅 애플리케이션. 사용자가 자신의 OpenRouter API 키를 등록하면 무료 LLM들과 대화할 수 있으며, 백엔드 서버 없이 브라우저에서 직접 API를 호출한다. 모든 데이터(대화, 설정)는 IndexedDB에 저장된다.

## Core Value

사용자가 복잡한 설정 없이 OpenRouter의 무료 AI 모델과 쉽게 대화할 수 있는 것

## Current State (v0.1-alpha shipped)

**Latest Milestone:** v0.1-alpha (Phase 2-3 완료, 2026-03-31)
**Current Focus:** Phase 1 (Foundation) 완료 필요 — API 키, 모델 선택, 채팅 기능

### Shipped Features (v0.1-alpha)
- IndexedDB 영속성 (대화, 설정)
- ChatGPT 스타일 레이아웃 (사이드바 + 채팅 영역)
- 반응형 디자인 (모바일/데스크톱)
- 대화 관리 (새 대화, 정렬, 편집, 삭제)
- 테마 시스템 (라이트/다크/시스템)
- 빈 상태 안내 + 자동 제목 생성

### Pending Features (Phase 1 필요)
- API 키 등록/검증
- 무료 모델 선택
- AI 채팅 (스트리밍, Markdown 렌더링)

## Requirements

### Validated

- [x] IndexedDB 영속성: Dexie.js로 대화/설정 저장 (v0.1-alpha — DATA-01, DATA-02)
- [x] ChatGPT 스타일 레이아웃: 사이드바 + 채팅 영역 (v0.1-alpha — UI-01)
- [x] 반응형 디자인: 모바일 <1024px, 데스크톱 ≥1024px (v0.1-alpha — UI-02)
- [x] 대화 관리: 새 대화, 최신순 정렬, 제목 편집, 삭제 (v0.1-alpha — CONV-01~06)
- [x] 테마 시스템: 라이트/다크/시스템 (v0.1-alpha — UI-03)
- [x] 빈 상태 안내 + 자동 제목 생성 (v0.1-alpha — UI-04, CONV-03)

### Active (Phase 1 필요)

- [ ] API 키 관리: 입력/저장/검증/변경/삭제
- [ ] 모델 선택: 무료 모델 목록 조회 및 선택
- [ ] 채팅 기능: 텍스트 입력, AI 응답 (스트리밍), Markdown 렌더링, Stop 버튼

### Out of Scope

- PWA / 오프라인 지원 — 별도 작업 필요
- 대화 내보내기/가져오기 — JSON 포맷, 향후 고려
- 유료 모델 지원 및 토큰 사용량 추적 — 별도 작업 필요
- 이미지/파일 첨부 (멀티모달) — 별도 작업 필요
- 다국어 지원 (i18n) — 한국어만 우선
- 사용자 인증/클라우드 동기화 — 별도 작업 필요

## Context

- **기술 환경**: React 19 + Vite, TypeScript strict mode, ~2,400 LOC
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
| 백엔드 없는 순수 프론트엔드 | 복잡성 감소, 빠른 개발, 무료 호스팅 가능 | ✅ 확인됨 |
| IndexedDB 직접 사용 (Dexie.js) | Dexie.js가 IndexedDB ORM으로 가장 간단 | ✅ 사용 중 |
| shadcn/ui + Tailwind CSS | ChatGPT 스타일 UI 구현에 적합 | ✅ 사용 중 |
| Dexie liveQuery는 useState/useEffect 패턴 | useSyncExternalStore의 비동기 호환성 문제 | ✅ React 19 호환 |
| 한국어만 우선 (i18n 미지원) |初期版의複雑性を低減 | ✅ 유지 |

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
*Last updated: 2026-03-31 after v0.1-alpha milestone*
