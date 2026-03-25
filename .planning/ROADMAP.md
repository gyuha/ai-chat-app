# Roadmap: OpenRouter Free Chat App

## Overview

이 프로젝트는 보안 경계와 인증 기반을 먼저 만든 뒤, 사용자별 대화 저장 구조를 구축하고, 그 위에 OpenRouter 스트리밍 채팅을 연결한 다음, 마지막으로 실제 사용 가능한 앱 UX와 검증을 마무리하는 순서로 구현한다. 이 순서는 API 키 노출과 권한 누락 같은 초반 리스크를 먼저 줄이고, 히스토리 요구사항을 깨지 않으면서 채팅 경험을 완성하기 위한 구성이다.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): 기본 milestone 작업
- Decimal phases (2.1, 2.2): 긴급 삽입 작업 (INSERTED 표기)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Auth** - 워크스페이스, 공통 설정, 인증 기반, 서버 비밀값 경계를 준비한다
- [ ] **Phase 2: Conversation Persistence** - 사용자별 대화와 메시지 저장 구조를 만든다
- [ ] **Phase 3: OpenRouter Streaming Chat** - 서버 프록시 기반 스트리밍 채팅과 저장 연계를 완성한다
- [ ] **Phase 4: App UX Completion** - 보호 라우트, 히스토리 복원, 에러 흐름을 정리해 사용 가능한 MVP로 마무리한다

## Phase Details

### Phase 1: Foundation & Auth
**Goal**: 프론트엔드와 백엔드의 실행 기반을 만들고, 이메일/비밀번호 인증과 서버 비밀값 경계를 확립한다
**Depends on**: Nothing
**Requirements**: AUTH-01, AUTH-02, AUTH-03, CHAT-04
**Success Criteria** (what must be TRUE):
  1. 사용자가 이메일과 비밀번호로 가입하고 로그인할 수 있다
  2. 사용자가 새로고침 후에도 인증 상태를 유지한 채 앱에 다시 진입할 수 있다
  3. OpenRouter API 키와 모델 ID가 서버 환경 변수로만 관리되고 클라이언트 코드에 나타나지 않는다
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — pnpm 워크스페이스, backend env 경계, frontend auth 토큰 셸을 만든다
- [ ] 01-02-PLAN.md — Prisma SQLite 사용자 저장소와 NestJS 쿠키 JWT 인증 API를 구현한다
- [ ] 01-03-PLAN.md — React 인증 화면, 세션 복원, 보호 라우트를 연결한다

### Phase 2: Conversation Persistence
**Goal**: 인증된 사용자 기준으로 대화와 메시지를 안전하게 저장하고 조회할 수 있게 한다
**Depends on**: Phase 1
**Requirements**: CONV-01, CONV-02, CONV-04
**Success Criteria** (what must be TRUE):
  1. 로그인한 사용자가 새 대화를 생성할 수 있다
  2. 로그인한 사용자가 자신의 대화 목록만 조회할 수 있다
  3. 다른 사용자의 대화 ID로 접근해도 데이터가 노출되지 않는다
**Plans**: 2 plans

Plans:
- [ ] 02-01: SQLite 스키마와 conversation/message 도메인 모델을 정의한다
- [ ] 02-02: 대화 생성 및 목록 조회 API와 프론트 목록 UI를 연결한다

### Phase 3: OpenRouter Streaming Chat
**Goal**: 서버 고정 무료 모델을 사용한 스트리밍 채팅과 메시지 저장을 구현한다
**Depends on**: Phase 2
**Requirements**: CHAT-01, CHAT-02, CHAT-03
**Success Criteria** (what must be TRUE):
  1. 로그인한 사용자가 대화 화면에서 메시지를 보내면 서버가 OpenRouter에 요청한다
  2. 사용자가 assistant 응답을 스트리밍 형태로 볼 수 있다
  3. 스트리밍 완료 후 assistant 메시지가 히스토리에 저장된다
**Plans**: 2 plans

Plans:
- [ ] 03-01: NestJS OpenRouter 프록시와 스트리밍 응답 중계 로직을 구현한다
- [ ] 03-02: React 채팅 입력/메시지 패널에서 스트리밍 UI를 연결한다

### Phase 4: App UX Completion
**Goal**: 보호 라우트, 히스토리 복원, 오류 처리까지 포함해 실제 사용 가능한 MVP로 정리한다
**Depends on**: Phase 3
**Requirements**: AUTH-04, CONV-03
**Success Criteria** (what must be TRUE):
  1. 인증되지 않은 사용자는 채팅 앱 화면에 접근할 수 없다
  2. 로그인한 사용자가 대화 목록에서 선택한 대화의 이전 메시지를 다시 볼 수 있다
  3. 로그인, 히스토리 조회, 채팅 실패 시 사용자에게 일관된 오류 상태가 보인다
  4. “로그인 후 채팅이 잘 되고, 히스토리가 나옴” 기준으로 수동 검증이 가능하다
**Plans**: 2 plans

Plans:
- [ ] 04-01: 보호 라우트, 대화 상세 로딩, 오류/빈 상태 UX를 정리한다
- [ ] 04-02: 통합 검증과 문서 정리로 MVP 완료 기준을 맞춘다

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 0/3 | Not started | - |
| 2. Conversation Persistence | 0/2 | Not started | - |
| 3. OpenRouter Streaming Chat | 0/2 | Not started | - |
| 4. App UX Completion | 0/2 | Not started | - |
