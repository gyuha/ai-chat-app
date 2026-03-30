# OpenRouter Chat

## What This Is

OpenRouter 무료 모델을 활용한 ChatGPT 스타일의 웹 AI 채팅 애플리케이션. 사용자가 자신의 OpenRouter API 키를 등록하면 무료 LLM 모델들과 대화할 수 있으며, 백엔드 서버 없이 브라우저에서 직접 API를 호출하고 모든 데이터는 IndexedDB에 저장된다. 로컬 개발 환경에서 사용 목적.

## Core Value

사용자가 무료 AI 모델과 실시간 스트리밍 채팅을 할 수 있는 것. 이것만 작동하면 된다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 사용자가 OpenRouter API 키를 등록/변경/삭제할 수 있다
- [ ] 무료 모델 목록을 조회하고 대화별로 모델을 선택할 수 있다
- [ ] SSE 스트리밍으로 실시간 토큰 단위 채팅이 가능하다
- [ ] 어시스턴트 응답이 마크다운으로 렌더링된다 (코드블록 하이라이팅 포함)
- [ ] 채팅 중 Stop 버튼으로 스트리밍을 중단할 수 있다
- [ ] 대화 생성/목록조회/삭제가 가능하다 (사이드바)
- [ ] 대화 제목이 첫 메시지 기반으로 자동 생성된다
- [ ] 시스템 프롬프트를 대화별/글로벌로 설정할 수 있다
- [ ] 기본 모델을 설정할 수 있다
- [ ] 다크/라이트 테마 전환이 가능하다
- [ ] 반응형 레이아웃 (모바일 사이드바 토글)
- [ ] 스트리밍 중 타이핑 효과, 코드블록 복사 버튼, 마크다운 점진적 렌더링

### Out of Scope

- PWA / 오프라인 지원 — 로컬 환경에서 항상 온라인 상태이므로 불필요
- 대화 내보내기/가져오기 (JSON) — v2에서 고려
- 유료 모델 지원 및 토큰 사용량 추적 — 무료 모델만 사용 목적
- 이미지/파일 첨부 (멀티모달) — 복잡도 높음, v2에서 고려
- 다국어 지원 (i18n) — 한국어 UI만 필요
- 사용자 인증/클라우드 동기화 — 로컬 전용, 백엔드 없음
- 대화 목록 날짜별 그룹화 — 단순 최신순 목록으로 충분
- 배포 (Vercel, Netlify 등) — 로컬 개발 환경에서만 사용

## Context

- OpenRouter는 OpenAI 호환 API를 제공하므로 별도 SDK 없이 fetch API로 직접 호출 가능
- 무료 모델 필터링: `pricing.prompt === "0" && pricing.completion === "0"`
- 무료 모델 Rate Limit: 약 20req/min, 200req/day
- SSE 스트리밍 응답 포맷: `text/event-stream`, `data: {choices:[{delta:{content}}]}`, 종료: `data: [DONE]`
- 모든 데이터는 브라우저 IndexedDB에 저장 (서버 없는 순수 프론트엔드)

## Constraints

- **Tech Stack**: React 19 + Vite + TypeScript (strict), shadcn/ui + Tailwind CSS v4 — 사용자가 확정한 스택
- **State Management**: Zustand (클라이언트 전역), TanStack Query v5 (서버 상태/캐싱) — 역할 분리 명확
- **Routing**: TanStack Router (파일 기반) — 확정된 라우트 구조
- **Storage**: Dexie.js v4 (IndexedDB ORM) — 서버 없이 로컬 데이터 저장
- **Package Manager**: pnpm — 프로젝트 매니저
- **Linter/Formatter**: Biome — ESLint/Prettier 대체
- **Markdown**: react-markdown + remark-gfm + rehype-highlight — 코드 하이라이팅 포함
- **UI 언어**: 한국어 — 버튼, 라벨, 안내 문구 모두 한국어
- **Deployment**: 로컬 개발 환경만 — 정적 호스팅 배포 불필요

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 백엔드 서버 없이 순수 프론트엔드 | 로컬 사용 목적, 단순성, 배포 불필요 | — Pending |
| OpenRouter 무료 모델만 사용 | 비용 없이 AI 채팅 가능 | — Pending |
| Dexie.js로 IndexedDB 사용 | 브라우저 내 영속 저장, 서버 없이 동작 | — Pending |
| 내장 fetch API 사용 | OpenRouter가 OpenAI 호환 포맷 제공, 별도 SDK 불필요 | — Pending |
| SSE 스트리밍 지원 | 실시간 응답 렌더링으로 UX 향상 | — Pending |

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
*Last updated: 2026-03-30 after initialization*
