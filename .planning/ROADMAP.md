# Roadmap: OpenRouter Free Chat Web App

## Overview

이 로드맵은 "보안이 보장된 스트리밍 채팅 MVP"를 가장 먼저 완성하고, 그 위에 대화 관리, 설정, 모바일, 접근성, 확장성 레이어를 순차적으로 쌓는다. Phase 1은 모노레포, 서버 프록시, 공통 계약, 기본 저장소 추상화까지 잡아 이후 UI 작업이 흔들리지 않게 만드는 기반 phase다.

## Phases

- [ ] **Phase 1: Foundation & Secure Proxy** - 모노레포, 공통 설정, NestJS 프록시, 모델 allowlist, 저장소 추상화 기반 구축
- [ ] **Phase 2: Conversational Shell UI** - 사이드바, 빈 상태, 대화 라우팅, composer, 기본 메시지 화면 구현
- [ ] **Phase 3: Streaming Chat Experience** - 스트리밍, stop, regenerate, markdown/code rendering 구현
- [ ] **Phase 4: Conversation Management & Settings** - 제목 자동 생성, 대화 삭제/복원 흐름, 모델/시스템 프롬프트 설정 구현
- [ ] **Phase 5: Reliability, Mobile & A11y Polish** - 에러 상태, 빈 상태 개선, 모바일 최적화, 접근성 보강
- [ ] **Phase 6: Persistence Adapter & Deployment Readiness** - 파일 저장소 고도화, DB 전환 포인트, 배포/운영 준비

## Phase Details

### Phase 1: Foundation & Secure Proxy
**Goal**: 구현이 가능한 모노레포 골격과 보안 프록시 API를 먼저 완성한다.
**Depends on**: Nothing (first phase)
**Requirements**: SET-04, PLAT-01, PLAT-02, PLAT-03
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 개발자는 `pnpm dev` 한 번으로 web과 server를 동시에 실행할 수 있다.
  2. 서버는 allowlist 기반 모델 목록 API와 health API를 제공한다.
  3. 브라우저는 OpenRouter 키를 모른 채 내부 API만 호출한다.
  4. 대화 저장소 인터페이스와 기본 file/memory adapter 골격이 준비된다.
**Plans**: 3 plans

Plans:
- [ ] 01-01: pnpm workspace, Biome, 공통 tsconfig, contracts 패키지 스캐폴드
- [ ] 01-02: NestJS app skeleton, env schema, health/models/chats module 생성
- [ ] 01-03: OpenRouter proxy client, allowlist 설정, repository interface 연결

### Phase 2: Conversational Shell UI
**Goal**: 채팅 제품으로 보이는 기본 shell과 빈 상태 UX를 구현한다.
**Depends on**: Phase 1
**Requirements**: SHELL-01, SHELL-02, SHELL-03, CHAT-01, MSG-01, REND-04, FB-01
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 사이드바에서 새 채팅과 대화 목록을 볼 수 있다.
  2. 사용자는 빈 상태에서도 예시 프롬프트와 시작 액션을 본다.
  3. 사용자는 chat route 전환 시 shell이 깨지지 않는다.
  4. 사용자는 composer에 멀티라인 입력 후 제출할 수 있다.
**Plans**: 3 plans

Plans:
- [ ] 02-01: app shell, sidebar, route scaffold, theme tokens 구현
- [ ] 02-02: empty state, chat header, composer, draft state 구현
- [ ] 02-03: chats query/mutation 연결과 route-driven active chat 처리

### Phase 3: Streaming Chat Experience
**Goal**: 이 제품의 핵심 가치인 스트리밍 대화 경험을 구현한다.
**Depends on**: Phase 2
**Requirements**: MSG-02, MSG-03, MSG-04, MSG-05, REND-01, REND-02
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 assistant 응답이 토큰 단위로 갱신되는 것을 본다.
  2. 사용자는 응답 생성 중 중단할 수 있다.
  3. 사용자는 마지막 응답을 regenerate 할 수 있다.
  4. 사용자는 markdown과 코드 블록을 자연스럽게 읽고 복사할 수 있다.
**Plans**: 3 plans

Plans:
- [ ] 03-01: server streaming endpoint와 client stream parser 구현
- [ ] 03-02: message lifecycle, optimistic rendering, abort flow 구현
- [ ] 03-03: markdown renderer, code block copy, regenerate flow 구현

### Phase 4: Conversation Management & Settings
**Goal**: 모델 설정과 대화 관리 기능을 사용 가능한 수준으로 완성한다.
**Depends on**: Phase 3
**Requirements**: SHELL-04, CHAT-02, CHAT-03, CHAT-04, SET-01, SET-02, SET-03
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 설정 UI에서 모델과 시스템 프롬프트를 변경할 수 있다.
  2. 사용자는 대화를 삭제할 수 있다.
  3. 사용자는 첫 교환 이후 제목이 자동 생성되는 것을 본다.
  4. 저장소 범위 내 대화 목록과 대화 상세가 재로딩 후 유지된다.
**Plans**: 3 plans

Plans:
- [ ] 04-01: settings dialog/page, models query, chat settings mutation 구현
- [ ] 04-02: delete flow, confirm dialog, list/detail 동기화 구현
- [ ] 04-03: title generation service와 저장소 반영 구현

### Phase 5: Reliability, Mobile & A11y Polish
**Goal**: 실제 사용감을 좌우하는 오류 처리, 모바일, 접근성을 마무리한다.
**Depends on**: Phase 4
**Requirements**: REND-03, FB-02, FB-03, FB-04, A11Y-01, A11Y-02, A11Y-03, A11Y-04
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 모바일에서도 가로 스크롤 없이 채팅을 사용한다.
  2. 사용자는 주요 실패 상황에서 이해 가능한 안내와 재시도 경로를 본다.
  3. 사용자는 키보드와 스크린리더로 핵심 흐름을 수행할 수 있다.
  4. 긴 코드, 표, 목록이 레이아웃을 깨뜨리지 않는다.
**Plans**: 3 plans

Plans:
- [ ] 05-01: error boundaries, user-friendly error mapping, retry UX 구현
- [ ] 05-02: responsive composer/sidebar/message layout polish
- [ ] 05-03: focus, aria-live, keyboard flows, content overflow 대응

### Phase 6: Persistence Adapter & Deployment Readiness
**Goal**: 이후 로그인/DB/실서비스 전환이 쉬운 기반까지 정리한다.
**Depends on**: Phase 5
**Requirements**: PLAT-04
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. 저장소 계층이 file/memory adapter와 명확히 분리된다.
  2. PostgreSQL adapter를 붙일 포인트가 인터페이스 수준에서 확정된다.
  3. 배포 시 필요한 env, SSE 운영 조건, 로그 정책이 문서화된다.
**Plans**: 2 plans

Plans:
- [ ] 06-01: repository adapter 정리와 persistence seam 문서화
- [ ] 06-02: deployment/env/operability 체크리스트 정리

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Secure Proxy | 0/3 | Not started | - |
| 2. Conversational Shell UI | 0/3 | Not started | - |
| 3. Streaming Chat Experience | 0/3 | Not started | - |
| 4. Conversation Management & Settings | 0/3 | Not started | - |
| 5. Reliability, Mobile & A11y Polish | 0/3 | Not started | - |
| 6. Persistence Adapter & Deployment Readiness | 0/2 | Not started | - |
