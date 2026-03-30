# 로드맵: OpenRouter Chat

## 개요

로컬 개발 환경에서 사용하는 OpenRouter 무료 모델 기반 AI 채팅 앱을 구축합니다. 백엔드 서버 없이 브라우저에서만 실행되며, 모든 데이터는 IndexedDB에 저장됩니다. 데이터 계층 구축부터 시작하여 실시간 스트리밍 채팅 구현, 대화 관리, 마지막으로 사용자 경험 개선까지 순차적으로 개발합니다.

## 페이즈

**페이즈 번호 매기기:**
- 정수 페이즈 (1, 2, 3): 계획된 마일스톤 작업
- 소수 페이즈 (2.1, 2.2): 긴급 삽입 작업 (INSERTED로 표시)

소수 페이즈는 주변 정수 사이에 숫자순으로 나타납니다.

- [ ] **Phase 1: 데이터 & 상태 기반** - IndexedDB와 상태 관리 레이어 구축
- [x] **Phase 2: 채팅 핵심** - 실시간 스트리밍 채팅 구현
- [ ] **Phase 3: 대화 관리 & 설정** - 대화 및 설정 기능 구현
- [ ] **Phase 4: 사용자 경험 개선** - 고급 UX 기능 구현

## 페이즈 상세

### Phase 1: 데이터 & 상태 기반
**Goal**: 브라우저 내 영구 저장소와 상태 관리 시스템 구축
**Depends on**: 없음 (첫 번째 페이즈)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-05, DATA-06, DATA-07
**Success Criteria** (what must be TRUE):
  1. 사용자가 새 대화를 생성할 수 있다
  2. 사이드바에 대화 목록이 최신순으로 표시된다
  3. 사용자가 대화를 삭제할 수 있다 (확인 다이얼로그 포함)
  4. 사용자가 API 키를 등록/변경/삭제할 수 있다
  5. 사용자가 기본 모델을 설정할 수 있다
  6. 사용자가 시스템 프롬프트를 설정할 수 있다 (대화별/글로벌)
**Plans**: TBD

### Phase 2: 채팅 핵심
**Goal**: OpenRouter API와 실시간 스트리밍 채팅 구현
**Depends on**: Phase 1
**Requirements**: CHAT-01, CHAT-02, CHAT-03, CHAT-06, CHAT-07, CHAT-08, MODL-01, MODL-02, MODL-03, MODL-04
**Success Criteria** (what must be TRUE):
  1. 사용자가 메시지를 전송하고 SSE 스트리밍으로 실시간 토큰 단위 응답을 받을 수 있다
  2. 사용자가 Stop 버튼으로 스트리밍 응답을 중단할 수 있다 (AbortController)
  3. 어시스턴트 응답이 마크다운으로 렌더링된다 (코드블록 구문 강조 포함)
  4. 스트리밍 중 오토스크롤이 동작한다 (사용자 수동 스크롤 시 자동 스크롤 중지)
  5. 응답 대기 중 로딩 인디케이터가 표시된다
  6. Enter로 전송, Shift+Enter로 줄바꿈이 동작한다
  7. 사용자가 무료 모델 목록을 조회하고 대화별로 모델을 선택할 수 있다
  8. API 오류 시 토스트 알림이 표시된다
  9. Rate Limit(429) 초과 시 사용자에게 안내가 표시된다
  10. API 오류 발생 시 재시도 버튼이 표시된다
**Plans**: 2 plans
Plans:
- [x] 02-01-PLAN.md — API & 데이터 레이어 (스트리밍 서비스, 메시지/모델 훅, 오류 처리, Toaster)
- [x] 02-02-PLAN.md — 채팅 UI & 통합 (메시지 렌더링, 입력, 모델 선택, 채팅 페이지, 라우트)
**UI hint**: yes

### Phase 3: 대화 관리 & 설정
**Goal**: 대화 제목 자동 생성 및 UI/UX 기능 구현
**Depends on**: Phase 2
**Requirements**: DATA-04, UIUX-01, UIUX-02, UIUX-03
**Success Criteria** (what must be TRUE):
  1. 대화 제목이 첫 메시지 기반으로 자동 생성된다
  2. 데스크톱(>1024px)에서 사이드바 고정, 모바일(<1024px)에서 토글 동작
  3. 다크/라이트 테마 전환이 가능하다 (시스템 감지 + 수동 전환)
  4. 입력 영역이 내용에 따라 자동으로 높이 조절
**Plans**: TBD
**UI hint**: yes

### Phase 4: 사용자 경험 개선
**Goal**: 점진적 마크다운 렌더링 및 고급 UX 기능 구현
**Depends on**: Phase 3
**Requirements**: CHAT-04, CHAT-05, CHAT-09, CHAT-10, CHAT-11
**Success Criteria** (what must be TRUE):
  1. 스트리밍 중 점진적 마크다운 렌더링이 표시된다 (불완전한 마크다운 깨짐 없이)
  2. 코드블록에 복사 버튼이 표시된다 (클릭 시 전체 코드 복사 + 토스트 피드백)
  3. 사용자가 마지막 어시스턴트 응답을 재전송(Regenerate)할 수 있다
  4. 사용자가 메시지 텍스트를 복사할 수 있다
  5. 키보드 단축키가 동작한다 (Cmd+K 새 대화 등)
**Plans**: TBD
**UI hint**: yes

## 진행 상황

**실행 순서:**
페이즈는 숫자 순서대로 실행: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. 데이터 & 상태 기반 | 0/0 | Not started | - |
| 2. 채팅 핵심 | 2/2 | Complete | 2026-03-30 |
| 3. 대화 관리 & 설정 | 0/0 | Not started | - |
| 4. 사용자 경험 개선 | 0/0 | Not started | - |
