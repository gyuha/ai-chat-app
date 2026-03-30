# Roadmap: OpenRouter Chat

## Overview

이 로드맵은 OpenRouter Chat을 브라우저 전용 ChatGPT 스타일 AI 채팅 앱으로 완성하기 위한 순서를 정리한다. 먼저 공용 앱 셸과 반응형 인터페이스를 안정화한 뒤, API 키 및 설정 관리, 무료 모델 선택, 스트리밍 채팅, 대화 히스토리 관리 순으로 수직 기능을 완성한다.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: 앱 셸과 인터페이스 기반** - ChatGPT 유사 레이아웃, 반응형 구조, 테마 기준을 확립한다.
- [ ] **Phase 2: API 키와 설정 관리** - API 키 온보딩, 검증, 기본 설정 저장 흐름을 완성한다.
- [ ] **Phase 3: 무료 모델 선택과 대화 부트스트랩** - 무료 모델 목록, 대화 생성, 대화별 메타데이터 선택을 연결한다.
- [ ] **Phase 4: 스트리밍 채팅 경험** - 메시지 전송, SSE 스트리밍, 중단, Markdown 렌더링을 구현한다.
- [ ] **Phase 5: 대화 히스토리와 로컬 영속성** - 대화 목록 관리와 로컬 저장 복원을 마무리한다.

## Phase Details

### Phase 1: 앱 셸과 인터페이스 기반
**Goal:** 사용자가 한국어 기반 ChatGPT 스타일 레이아웃을 데스크톱과 모바일에서 일관되게 사용할 수 있다.
**Depends on:** Nothing (first phase)
**Requirements:** [UI-01, UI-02, UI-03, UI-04]
**UI hint:** yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 앱을 열면 사이드바, 헤더, 메시지 영역, 입력 영역이 있는 ChatGPT 스타일 셸을 본다.
  2. 사용자는 주요 내비게이션과 빈 상태를 포함한 구조 UI를 한국어로 사용할 수 있다.
  3. 사용자는 데스크톱과 모바일에서 적절한 사이드바 동작을 사용할 수 있다.
  4. 사용자는 다크모드를 기본값으로 사용하고 시스템 테마를 반영한 전환을 사용할 수 있다.
**Plans:** 5 plans

Plans:
- [x] 01-01-PLAN.md — Vite/TypeScript/Biome/Tailwind 기반 앱 골격과 엔트리 구성
- [x] 01-02-PLAN.md — shadcn/ui primitives와 공용 UI 기반 구성
- [x] 01-03-PLAN.md — TanStack Router, theme provider, UI store 기반 라우팅 골격 구성
- [x] 01-04-PLAN.md — ChatGPT 유사 앱 셸과 반응형 사이드바 인터랙션 구현
- [x] 01-05-PLAN.md — 한국어 빈 상태, 온보딩 카드, 설정 플레이스홀더 화면 구성

### Phase 2: API 키와 설정 관리
**Goal:** 사용자가 OpenRouter API 키를 등록하고 검증하며 기본 설정을 저장할 수 있다.
**Depends on:** Phase 1
**Requirements:** [SETT-01, SETT-02, SETT-03, SETT-04, DATA-02]
**UI hint:** yes
**Success Criteria** (what must be TRUE):
  1. 유효한 API 키가 없으면 사용자는 채팅 전에 API 키 온보딩 화면을 본다.
  2. 사용자는 설정에서 OpenRouter API 키를 저장, 수정, 검증, 삭제할 수 있다.
  3. 사용자는 기본 모델과 시스템 프롬프트를 저장하고 새로고침 후에도 같은 설정을 다시 확인할 수 있다.
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 2` to break down)

### Phase 3: 무료 모델 선택과 대화 부트스트랩
**Goal:** 사용자가 무료 모델을 탐색하고 새 대화를 시작할 때 대화별 설정을 확정할 수 있다.
**Depends on:** Phase 2
**Requirements:** [MODL-01, MODL-02, MODL-03, CONV-01, DATA-03]
**UI hint:** yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 무료 모델만 필터링된 OpenRouter 모델 목록을 탐색할 수 있다.
  2. 사용자는 새 대화를 만들고 그 대화에 사용할 모델을 선택할 수 있다.
  3. 사용자는 현재 대화의 활성 모델을 확인하고 같은 메타데이터를 유지한 채 다시 열 수 있다.
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 3` to break down)

### Phase 4: 스트리밍 채팅 경험
**Goal:** 사용자가 선택한 무료 모델과 실시간 스트리밍 채팅을 수행할 수 있다.
**Depends on:** Phase 3
**Requirements:** [CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05]
**UI hint:** yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 메시지를 보내고 같은 대화 안에서 어시스턴트 응답을 받을 수 있다.
  2. 사용자는 응답이 실시간으로 스트리밍되는 것을 보고 완료 전에 중단할 수 있다.
  3. 사용자는 Markdown 응답과 코드 블록을 읽고 로딩 및 오류 상태를 한국어로 이해할 수 있다.
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 4` to break down)

### Phase 5: 대화 히스토리와 로컬 영속성
**Goal:** 사용자가 저장된 대화를 다시 열고 관리할 수 있으며 새로고침 이후에도 데이터가 유지된다.
**Depends on:** Phase 4
**Requirements:** [CONV-02, CONV-03, CONV-04, CONV-05, DATA-01]
**UI hint:** yes
**Success Criteria** (what must be TRUE):
  1. 사용자는 최근 활동 순으로 정렬된 대화 목록을 보고 저장된 대화를 다시 열 수 있다.
  2. 사용자는 사이드바에서 적절한 확인 절차와 함께 대화 제목을 수정하거나 대화를 삭제할 수 있다.
  3. 사용자는 브라우저를 새로고침해도 로컬 저장소에서 이전 메시지를 복원할 수 있다.
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 5` to break down)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. 앱 셸과 인터페이스 기반 | 0/5 | Not started | - |
| 2. API 키와 설정 관리 | 0/0 | Not started | - |
| 3. 무료 모델 선택과 대화 부트스트랩 | 0/0 | Not started | - |
| 4. 스트리밍 채팅 경험 | 0/0 | Not started | - |
| 5. 대화 히스토리와 로컬 영속성 | 0/0 | Not started | - |
