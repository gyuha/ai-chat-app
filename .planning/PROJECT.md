# OpenRouter Free Chat Web App

## What This Is

OpenRouter의 무료 모델을 브라우저에 직접 노출하지 않고 NestJS 백엔드 프록시를 통해 안전하게 사용하는 웹 채팅 애플리케이션이다. 제품 경험은 ChatGPT와 유사한 정보 구조를 참고하되 직접 복제하지 않고, 다크 모드 우선의 현대적 conversational workspace로 재해석한다. 초기 목표는 "무료 모델 기반에서도 빠르고 안정적인 스트리밍 대화 경험"을 제공하는 MVP를 만드는 것이다.

## Core Value

사용자는 키 노출 없이 빠르고 읽기 좋은 스트리밍 채팅 경험을 즉시 사용할 수 있어야 한다.

## Requirements

### Validated

(없음 — 초기 가설 단계)

### Active

- [ ] OpenRouter 무료 모델 allowlist 기반 채팅 MVP를 제공한다.
- [ ] ChatGPT 유사 정보 구조를 가진 반응형 conversational UI를 제공한다.
- [ ] 스트리밍, regenerate, stop, markdown/code rendering까지 실사용 가능한 채팅 경험을 제공한다.
- [ ] 추후 로그인, DB, 영속화를 쉽게 붙일 수 있는 확장형 구조를 잡는다.

### Out of Scope

- 로그인/회원가입 — v1 핵심 가치가 아니며 익명 MVP 검증을 먼저 끝내야 한다.
- 다중 사용자 동기화 — 서버 보안과 채팅 경험 검증이 먼저다.
- PostgreSQL 영속 저장소 — 저장소 추상화만 먼저 만들고 DB 연결은 후속 phase로 미룬다.
- 벡터 검색, RAG, 파일 업로드 — 무료 채팅 MVP 범위를 넘고 설계 복잡도를 크게 올린다.

## Context

- 사용자는 OpenRouter 무료 API를 활용한 채팅 앱을 원하고, API 키는 반드시 서버에만 존재해야 한다.
- 프론트엔드는 React, TypeScript, shadcn/ui, Zustand, TanStack Query, TanStack Router, Biome, pnpm 조합을 사용한다.
- 백엔드는 NestJS + TypeScript로 OpenRouter 프록시, allowlist, validation, 에러 변환, 스트리밍 중계 책임을 가진다.
- UI/UX 판단은 `ui-ux-pro-max`를 적극 활용하며, 다크 모드 우선, 키보드 접근성, 모바일 대응, 빈 상태/로딩/에러 상태 완성도가 중요하다.
- MVP지만 조잡하면 안 된다. 첫 화면 빈 상태, 메시지 가독성, 코드 블록, 긴 응답 스크롤 동작까지 초기 문서 단계에서 규칙을 고정한다.

## Constraints

- **보안**: `OPENROUTER_API_KEY`는 서버 환경변수로만 관리 — 브라우저 직접 호출 금지
- **기술 스택**: 프론트 React + TypeScript / 백엔드 NestJS + TypeScript — 사용자 지정
- **UI/UX**: ChatGPT와 유사한 정보 구조, 그러나 직접 복제 금지 — 법적/브랜드 리스크 회피
- **모델 전략**: 무료 모델 선택/교체 가능해야 함 — 운영 유연성 확보
- **확장성**: 추후 로그인/DB를 붙이기 쉬워야 함 — MVP 이후 재작성 비용 최소화
- **배포성**: 프론트와 백엔드 동시 개발/배포가 쉬운 구조 — 실서비스 전환 고려

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| `pnpm workspace` 기반 모노레포 사용 | 프론트/백엔드/공통 타입을 한 저장소에서 관리하기 가장 단순하다 | — Pending |
| 프론트는 `Vite + React + TanStack Router` 조합으로 시작 | Chat UI 중심 SPA에 적합하고 shadcn/ui와 궁합이 좋다 | — Pending |
| 백엔드는 NestJS가 OpenRouter 프록시와 모델 allowlist를 관리 | 키 보호, validation, 에러 변환, 스트리밍 제어를 서버에 집중시킨다 | — Pending |
| 스트리밍은 POST 기반 SSE 스타일 응답으로 표준화 | 메시지 입력 body를 유지하면서 토큰 단위 렌더링을 단순하게 만든다 | — Pending |
| 저장소는 `Repository interface + file/in-memory adapter`로 시작 | DB 없는 MVP와 이후 PostgreSQL 전환을 동시에 만족시킨다 | — Pending |
| 디자인은 다크 모드 OLED 계열과 코드 친화 타이포를 기본으로 채택 | 채팅, 코드 블록, 장시간 사용에 유리하다 | — Pending |

## Evolution

이 문서는 phase 전환과 milestone 경계마다 갱신한다.

**각 phase 전환 후**
1. 검증된 요구사항은 `Validated`로 이동
2. 범위에서 빠진 요구사항은 `Out of Scope`로 이동
3. 새로 생긴 요구사항은 `Active`에 추가
4. 구조 결정은 `Key Decisions`에 기록
5. 제품 설명이 달라졌으면 `What This Is`를 수정

**각 milestone 종료 후**
1. Core Value 유지 여부 확인
2. Out of Scope 근거 재검토
3. 현재 사용자 피드백과 운영 이슈를 Context에 반영

---
*Last updated: 2026-03-29 after initialization*
