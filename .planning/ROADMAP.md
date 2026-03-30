# Roadmap: OpenRouter Chat

## Overview

이 로드맵은 브라우저 전용 OpenRouter Chat을 **앱 골격 → 설정/API key → 모델/대화 구조 → 스트리밍 채팅 → UX polish** 순서로 구축한다. 각 phase는 사용자가 체감할 수 있는 기능 단위를 기준으로 묶였고, 앞선 phase가 다음 phase의 기술적 전제를 만든다.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: App Foundation & Shell** - 앱 골격, 테마, 한국어 UI, 기본 empty state를 준비한다.
- [ ] **Phase 2: Settings & OpenRouter Access** - API key 검증과 설정 관리 흐름을 완성한다.
- [ ] **Phase 3: Models & Conversation Structure** - 무료 모델 선택과 대화 목록/저장 구조를 완성한다.
- [ ] **Phase 4: Streaming Chat Runtime** - OpenRouter 스트리밍 채팅 경험을 구현한다.
- [ ] **Phase 5: Conversation Polish & UX Hardening** - Markdown, 대화 관리, 에러 UX를 완성한다.

## Phase Details

### Phase 1: App Foundation & Shell
**Goal**: React/Vite 앱 골격, 공통 레이아웃, 다크모드, 한국어 UI 기본 상태를 준비한다.
**Depends on**: Nothing (first phase)
**Requirements**: UX-01, UX-02, UX-05, DATA-01
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 앱 진입 시 한국어 기반의 기본 shell과 empty state를 볼 수 있다.
  2. 사용자는 다크모드 기본 상태로 앱을 사용할 수 있고 테마 전환이 동작한다.
  3. 설정 저장 구조가 준비되어 새로고침 후 기본 설정을 다시 불러올 수 있다.
**Plans**: 3 plans

Plans:
- [ ] 01-01: Vite app scaffold와 공통 provider/query/router 골격 구성
- [ ] 01-02: App shell, layout, sidebar/header/composer placeholder 구성
- [ ] 01-03: theme, 한국어 기본 문구, empty state, settings persistence 기초 구성

### Phase 2: Settings & OpenRouter Access
**Goal**: API key 입력/검증/수정/삭제와 기본 모델/system prompt 설정 흐름을 완성한다.
**Depends on**: Phase 1
**Requirements**: SET-01, SET-02, SET-03, SET-04
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 최초 진입 시 API key를 입력하고 유효성을 확인할 수 있다.
  2. 사용자는 설정 화면에서 API key, 기본 모델, 기본 system prompt, 테마를 관리할 수 있다.
  3. 잘못된 key 또는 검증 실패 시 이해 가능한 안내를 받는다.
**Plans**: 3 plans

Plans:
- [ ] 02-01: settings route, form, Dexie settings 저장 구조 구현
- [ ] 02-02: OpenRouter key validation flow와 에러 분기 구현
- [ ] 02-03: 기본 모델/system prompt/theme 설정 연결 및 복원 구현

### Phase 3: Models & Conversation Structure
**Goal**: 무료 모델 조회/선택과 conversation 목록/생성/재진입의 기본 구조를 완성한다.
**Depends on**: Phase 2
**Requirements**: MOD-01, MOD-02, MOD-03, CONV-01, CONV-02, CONV-03, DATA-03, UX-04
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 무료 모델만 조회하고 대화 시작 전 또는 대화별로 모델을 선택할 수 있다.
  2. 사용자는 sidebar에서 대화 목록을 최신순으로 보고 새 대화를 만들거나 다시 열 수 있다.
  3. 모바일 화면에서도 sidebar를 토글해 대화 탐색이 가능하다.
  4. conversations와 messages 저장 구조가 이후 채팅 흐름을 받을 수 있도록 준비된다.
**Plans**: 3 plans

Plans:
- [ ] 03-01: `/models` query, free filter, model selector 구현
- [ ] 03-02: conversation schema, 생성/선택/최신순 목록 구현
- [ ] 03-03: responsive sidebar (desktop fixed + mobile Sheet) 구현

### Phase 4: Streaming Chat Runtime
**Goal**: 실제 OpenRouter chat completions 스트리밍과 메시지 저장/복원을 구현한다.
**Depends on**: Phase 3
**Requirements**: CHAT-01, CHAT-02, CHAT-03, DATA-02
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 메시지를 입력하고 전송할 수 있다.
  2. assistant 응답이 스트리밍으로 실시간 표시된다.
  3. 사용자는 Stop 버튼으로 진행 중인 응답을 중단할 수 있다.
  4. 새로고침 후에도 저장된 메시지 기록을 다시 볼 수 있다.
**Plans**: 3 plans

Plans:
- [ ] 04-01: OpenRouter chat client와 SSE parser 구현
- [ ] 04-02: composer, pending state, placeholder assistant message lifecycle 구현
- [ ] 04-03: message persistence, reload restoration, stop/cancel 검증 구현

### Phase 5: Conversation Polish & UX Hardening
**Goal**: Markdown 렌더링, 대화 제목/삭제, system prompt 반영, 에러 UX를 마무리한다.
**Depends on**: Phase 4
**Requirements**: CHAT-04, CHAT-05, CONV-04, CONV-05, UX-03
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 assistant 응답을 Markdown과 코드 블록 형태로 읽기 쉽게 볼 수 있다.
  2. 사용자는 대화 제목 자동 생성/수정과 삭제 확인 흐름을 사용할 수 있다.
  3. system prompt 설정이 실제 채팅 요청에 반영된다.
  4. API 오류, validation 실패, rate limit 상황에서 명확한 toast/안내를 받는다.
**Plans**: 3 plans

Plans:
- [ ] 05-01: Markdown renderer, code highlighting, message presentation polish
- [ ] 05-02: conversation title generation/edit/delete confirm 흐름 구현
- [ ] 05-03: system prompt application, toast/error UX, 최종 polish

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. App Foundation & Shell | 0/3 | Not started | - |
| 2. Settings & OpenRouter Access | 0/3 | Not started | - |
| 3. Models & Conversation Structure | 0/3 | Not started | - |
| 4. Streaming Chat Runtime | 0/3 | Not started | - |
| 5. Conversation Polish & UX Hardening | 0/3 | Not started | - |
