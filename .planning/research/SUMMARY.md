# Project Research Summary

**Project:** OpenRouter Chat
**Domain:** 브라우저 전용 AI chat web app
**Researched:** 2026-03-31
**Confidence:** HIGH

## Executive Summary

이 프로젝트는 서버 없이 브라우저에서 OpenRouter를 직접 호출하는 ChatGPT 스타일의 AI 채팅 앱이다. 연구 결과, 이런 제품은 **얇은 route layer + 기능 단위 feature 모듈 + OpenRouter service + Dexie persistence** 구조로 설계할 때 가장 안정적으로 확장된다. 핵심은 “API key 관리 → free model 탐색 → 스트리밍 채팅 → 대화 저장/복원” 흐름을 끊김 없이 연결하는 것이다.

기술 선택은 이미 좋은 방향으로 고정되어 있다. React 19 + Vite + TypeScript strict + TanStack Query + Zustand + Dexie 조합은 브라우저 전용 채팅 앱에 적합하며, OpenRouter 쪽은 `/models`, `openrouter/free`, streaming endpoint, AbortController 패턴을 기반으로 구현하면 된다. 가장 큰 리스크는 브라우저 API key 취급, SSE 처리 미숙, free model 목록 drift, IndexedDB schema 지연이다.

## Key Findings

### Recommended Stack

이 도메인에서는 fetch 기반 OpenRouter client를 중심으로, 원격 데이터는 TanStack Query, 로컬 UI 상태는 Zustand, 영속 저장은 Dexie로 분리하는 구성이 가장 자연스럽다. Markdown 응답과 코드 블록 가독성을 위해 `react-markdown` 조합도 사실상 필수에 가깝다.

**Core technologies:**
- TypeScript: strict data contracts — stream/DB/API 응답 안정성 확보
- React + Vite: browser-first UI shell — 빠른 개발과 정적 호스팅 적합성
- TanStack Query + Zustand + Dexie: remote/local/persistent state 분리 — 책임 경계가 명확함

### Expected Features

사용자가 기대하는 최소 기능은 API key 등록, free model 선택, 스트리밍 채팅, 대화 목록, 로컬 저장, 반응형 sidebar다. 차별화 요소는 “무료 모델 전용 UX 최적화”, “한국어 UI 완성도”, “대화별 system prompt”, “Markdown/코드 블록 품질” 쪽에서 나온다.

**Must have (table stakes):**
- API key 관리 — 제품 진입과 사용 가능 여부를 결정
- free model 선택 — OpenRouter 무료 가치 제안의 중심
- 스트리밍 채팅 + Stop — ChatGPT 유사 UX의 핵심
- 대화 저장/복원 — 실제 사용 가능한 앱으로 느끼게 함

**Should have (competitive):**
- 대화별 system prompt — 사용성 향상
- 한국어 중심 안내/에러 UX — 타깃 사용자 친화성 강화

**Defer (v2+):**
- 클라우드 동기화, 유료 모델, 멀티모달, export/import 고도화

### Architecture Approach

아키텍처는 **thin route, fat feature** 패턴이 적합하다. route는 URL 진입점과 화면 조립만 담당하고, 실제 도메인 로직은 feature/service/db/store 계층으로 나눠야 한다. 이렇게 해야 streaming, persistence, settings, sidebar 관리가 서로 꼬이지 않는다.

**Major components:**
1. App Shell — sidebar, header, chat pane, responsive layout
2. OpenRouter Client — models 조회, chat completions, stream parsing
3. Persistence Layer — settings/conversations/messages Dexie 저장
4. State Layer — active conversation, drawer state, composing/stream status

### Critical Pitfalls

1. **브라우저 API key 노출 착각** — 사용자 입력 기반 key 관리와 위험 안내를 분명히 둘 것
2. **SSE를 일반 JSON처럼 처리** — line-buffer parser와 AbortController를 먼저 설계할 것
3. **free model 목록 하드코딩** — `/models` 기반 free filter로 일관성 유지할 것
4. **Dexie schema를 늦게 설계** — 초기에 테이블/인덱스를 정할 것

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Settings
**Rationale:** 모든 후속 기능이 API key, theme, DB foundation 위에 올라간다.
**Delivers:** 앱 scaffold, 기본 레이아웃, theme, Dexie schema, settings flow
**Addresses:** API key 관리, persistence foundation
**Avoids:** API key 노출 착각, schema 부실

### Phase 2: Model Discovery & Conversation Skeleton
**Rationale:** 채팅 전에 free model 선택과 대화 구조가 먼저 안정화돼야 한다.
**Delivers:** `/models` 조회, free filter, 기본 모델/대화 생성/목록 sidebar
**Uses:** TanStack Query, Dexie, route structure
**Implements:** model query layer + conversation shell

### Phase 3: Streaming Chat Runtime
**Rationale:** 제품의 핵심 가치가 여기서 처음 검증된다.
**Delivers:** chat completions 요청, streaming parser, Stop 버튼, assistant placeholder lifecycle
**Uses:** OpenRouter streaming endpoint, AbortController
**Avoids:** stream 처리 오류

### Phase 4: Rendering Polish & UX Hardening
**Rationale:** core flow 이후 Markdown, mobile, error UX를 다듬어 실사용 품질을 맞춘다.
**Delivers:** Markdown renderer, 코드 하이라이트, empty states, mobile drawer polish, toast/error handling
**Avoids:** Markdown 안전성/모바일 UX 문제

### Phase Ordering Rationale

- 설정/API key 없이는 모델 조회와 채팅을 안전하게 시작할 수 없다.
- 모델 선택과 대화 껍데기가 있어야 스트리밍 런타임을 자연스럽게 얹을 수 있다.
- Markdown/rendering polish는 핵심 채팅 성공 이후에 넣는 편이 범위 통제가 쉽다.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** SSE parser/AbortController/partial persistence 정책 결정이 필요함
- **Phase 4:** Markdown safety, 코드블록 스타일, 모바일 UX 최적화 세부 연구가 유효함

Phases with standard patterns (skip research-phase):
- **Phase 1:** React/Vite/TanStack/Dexie 초기 골격은 표준 패턴이 풍부함
- **Phase 2:** 모델 조회/캐시/sidebar 구조는 비교적 잘 알려진 패턴으로 풀 수 있음

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | 프로젝트 요구사항과 공식 OpenRouter docs가 일치함 |
| Features | HIGH | 사용자가 제공한 상세 범위가 명확함 |
| Architecture | HIGH | 브라우저 전용 chat app 패턴이 비교적 표준적임 |
| Pitfalls | HIGH | OpenRouter streaming/free routing 제약과 브라우저 구조 리스크가 분명함 |

**Overall confidence:** HIGH

### Gaps to Address

- OpenRouter 문서 URL 구조가 자주 변할 수 있음 — 구현 단계에서 실제 endpoint 응답을 재검증할 것
- free model filter 기준은 API 응답 필드 기준으로 테스트 코드/수동 검증을 함께 둘 것

## Sources

### Primary (HIGH confidence)
- `PROMPT.md` — 프로젝트 목표와 고정 스택
- https://openrouter.ai/docs/api/api-reference/models/get-models.mdx — models endpoint
- https://openrouter.ai/docs/guides/routing/routers/free-models-router — free model routing
- https://openrouter.ai/docs/api/reference/streaming — streaming / AbortController

### Secondary (MEDIUM confidence)
- https://github.com/josephgodwinkimani/openrouter-web — 브라우저 기반 구현 예시

---
*Research completed: 2026-03-31*
*Ready for roadmap: yes*
