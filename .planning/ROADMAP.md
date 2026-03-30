# Roadmap: OpenRouter Chat

## Overview

OpenRouter 무료 모델을 활용한 ChatGPT 스타일의 웹 AI 채팅 애플리케이션. Phase 1에서 API 연동과 핵심 채팅 기능을 완성하고, Phase 2에서 IndexedDB 영속성과 기본 레이아웃을 추가하며, Phase 3에서 대화 관리와 UI 완성을 진행한다.

## Phases

- [ ] **Phase 1: Foundation** - API 키 관리, 모델 선택, 핵심 채팅 기능 (스트리밍 포함)
- [ ] **Phase 2: Persistence + Layout** - IndexedDB 저장, 기본 레이아웃 (사이드바 + 채팅 영역)
- [ ] **Phase 3: Conversation Management** - 대화 목록 관리, 테마 전환, 빈 상태

## Phase Details

### Phase 1: Foundation
**Goal**: 사용자가 API 키를 등록하고 무료 모델을 선택한 뒤, AI와 Markdown 스트리밍 채팅可以进行
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, MODL-01, MODL-02, MODL-03, MODL-04, CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06
**Success Criteria** (what must be TRUE):
  1. 사용자가 OpenRouter API 키를 입력하여 저장할 수 있다
  2. 저장된 API 키의 유효성이 API 호출로 검증된다
  3. 앱이 OpenRouter Models API에서 무료 모델 목록을 조회하고 표시한다
  4. 사용자가 대화에 사용할 모델을 선택할 수 있다
  5. 사용자가 텍스트 메시지를 입력하면 AI 응답을 받을 수 있다
  6. AI 응답이 스트리밍 방식으로 실시간 표시된다
  7. AI 응답이 Markdown으로 렌더링된다 (코드블록 하이라이팅 포함)
  8. 메시지 전송 중 로딩 인디케이터가 표시된다
  9. 사용자가 Stop 버튼으로 스트리밍 응답을 중단할 수 있다
  10. 시스템 프롬프트를 설정할 수 있다 (글로벌 또는 대화별)
**Plans:** 4 plans
**Plan List:**
- [ ] 01-01-PLAN.md — Wave 1: Foundation Setup (shadcn/ui, Router, DB, Store)
- [ ] 01-02-PLAN.md — Wave 2: API Layer (OpenRouter API, SSE Streaming, Hooks)
- [ ] 01-03-PLAN.md — Wave 3: UI Components (API Key Setup, Settings, Chat UI)
- [ ] 01-04-PLAN.md — Waves 4-5: Integration + Verification (Dark Mode, Build)

### Phase 2: Persistence + Layout
**Goal**: IndexedDB에 대화와 설정이 영속적으로 저장되고, ChatGPT 스타일 레이아웃이 기본 형태 갖추어짐
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-02, UI-01, UI-02
**Success Criteria** (what must be TRUE):
  1. IndexedDB에 대화 데이터(메시지)가 영속적으로 저장된다
  2. IndexedDB에 사용자 설정(API 키, 기본 모델)이 저장된다
  3. ChatGPT와 유사한 좌측 사이드바 + 우측 채팅 영역 레이아웃이 표시된다
  4. 반응형 디자인이 동작한다 (모바일 <1024px, 데스크톱 >=1024px)
**Plans**: 3 plans
**Plan List:**
- [ ] 02-01-PLAN.md — Wave 1: IndexedDB Persistence (Dexie liveQuery hooks, UI store)
- [ ] 02-02-PLAN.md — Wave 2: ChatGPT Layout (Sidebar, ChatLayout components)
- [ ] 02-03-PLAN.md — Wave 3: Integration (HomePage wrapped in ChatLayout, persistence connected)

### Phase 3: Conversation Management
**Goal**: 사용자가 대화 목록을 관리하고, 테마를 전환하며, 빈 상태에서 안내를 받을 수 있다
**Depends on**: Phase 2
**Requirements**: CONV-01, CONV-02, CONV-03, CONV-04, CONV-05, CONV-06, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. 사용자가 "새 대화" 버튼으로 새 대화를 시작할 수 있다
  2. 앱이 대화 목록을 최신순으로 표시한다
  3. 앱이 대화 제목을 첫 메시지 기반으로 자동 생성한다
  4. 사용자가 대화 제목을 수동 편집할 수 있다
  5. 사용자가 대화를 삭제할 수 있다 (확인 다이얼로그 포함)
  6. 모바일에서 사이드바를 토글할 수 있다
  7. 다크모드/라이트모드 지원이 동작한다 (시스템 테마 감지 + 수동 전환)
  8. 빈 상태에서 환영 메시지와 API 키 미등록 안내가 표시된다
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/4 | Not started | - |
| 2. Persistence + Layout | 0/? | Not started | - |
| 3. Conversation Management | 0/? | Not started | - |
