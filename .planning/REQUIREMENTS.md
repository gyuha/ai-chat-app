# Requirements: OpenRouter Chat

**Defined:** 2026-03-31
**Core Value:** 사용자가 별도 백엔드 없이도 자신의 OpenRouter API 키만으로 무료 모델과 안정적으로 대화하고, 그 기록을 로컬에 계속 보존할 수 있어야 한다.

## v1 Requirements

### Settings

- [ ] **SET-01**: 사용자는 최초 진입 시 OpenRouter API key를 입력할 수 있다.
- [ ] **SET-02**: 사용자는 입력한 OpenRouter API key의 유효성을 확인할 수 있다.
- [ ] **SET-03**: 사용자는 저장된 OpenRouter API key를 설정 화면에서 변경하거나 삭제할 수 있다.
- [ ] **SET-04**: 사용자는 기본 모델, 기본 system prompt, 테마를 설정 화면에서 관리할 수 있다.

### Models

- [ ] **MOD-01**: 사용자는 OpenRouter 모델 목록에서 무료 모델만 볼 수 있다.
- [ ] **MOD-02**: 사용자는 대화 시작 전에 사용할 모델을 선택할 수 있다.
- [ ] **MOD-03**: 사용자는 대화별 모델과 기본 모델이 어떻게 적용되는지 일관되게 경험할 수 있다.

### Conversations

- [ ] **CONV-01**: 사용자는 새 대화를 생성할 수 있다.
- [ ] **CONV-02**: 사용자는 좌측 sidebar에서 기존 대화 목록을 최신순으로 볼 수 있다.
- [ ] **CONV-03**: 사용자는 기존 대화를 다시 열어 이어서 볼 수 있다.
- [ ] **CONV-04**: 사용자는 대화 제목을 첫 메시지 기반으로 자동 부여받거나 수정할 수 있다.
- [ ] **CONV-05**: 사용자는 대화를 삭제할 수 있고, 삭제 전 확인을 받는다.

### Chat

- [ ] **CHAT-01**: 사용자는 메시지를 입력하고 전송할 수 있다.
- [ ] **CHAT-02**: 사용자는 assistant 응답이 스트리밍으로 실시간 표시되는 것을 볼 수 있다.
- [ ] **CHAT-03**: 사용자는 응답 스트리밍 중 Stop 버튼으로 생성 중인 응답을 중단할 수 있다.
- [ ] **CHAT-04**: 사용자는 assistant 응답을 Markdown과 코드 블록 형태로 읽기 쉽게 볼 수 있다.
- [ ] **CHAT-05**: 사용자는 대화별 또는 전역 system prompt가 실제 채팅 요청에 반영되는 경험을 할 수 있다.

### Persistence

- [ ] **DATA-01**: 사용자는 새로고침 후에도 저장된 설정을 다시 불러올 수 있다.
- [ ] **DATA-02**: 사용자는 새로고침 후에도 대화 목록과 메시지 기록을 다시 볼 수 있다.
- [ ] **DATA-03**: 시스템은 conversations와 messages를 올바른 관계로 저장하고 조회할 수 있다.

### UX

- [ ] **UX-01**: 사용자는 한국어 UI(버튼, 레이블, 안내 문구)를 일관되게 경험할 수 있다.
- [ ] **UX-02**: 사용자는 다크모드 기본 활성 상태에서 앱을 사용할 수 있고, 테마를 전환할 수 있다.
- [ ] **UX-03**: 사용자는 API 오류, validation 실패, rate limit 상황에서 이해 가능한 안내를 받을 수 있다.
- [ ] **UX-04**: 사용자는 모바일 화면에서도 sidebar를 토글하며 채팅 앱을 사용할 수 있다.
- [ ] **UX-05**: 사용자는 대화가 없을 때와 API key가 없을 때 각각 적절한 empty state 안내를 볼 수 있다.

## v2 Requirements

### Import / Export

- **PORT-01**: 사용자는 대화를 JSON으로 내보낼 수 있다.
- **PORT-02**: 사용자는 내보낸 대화를 다시 가져올 수 있다.

### Advanced Model Support

- **BILL-01**: 사용자는 유료 모델도 선택할 수 있다.
- **BILL-02**: 사용자는 토큰 사용량이나 비용 관련 정보를 확인할 수 있다.

### Extended Input Modes

- **MULTI-01**: 사용자는 이미지나 파일을 첨부해 멀티모달 요청을 보낼 수 있다.
- **MULTI-02**: 사용자는 첨부 파일의 상태를 채팅 흐름 안에서 확인할 수 있다.

## Out of Scope

| Feature | Reason |
|---------|--------|
| 사용자 계정/로그인/클라우드 동기화 | 프론트엔드 전용 v1 범위를 넘어가며 서버/인증이 필요함 |
| 실시간 협업/공유 | 핵심 가치가 개인용 로컬 chat 경험 검증에 있음 |
| 백엔드 프록시 또는 서버 세션 | 현재 프로젝트 제약과 맞지 않음 |
| PWA 오프라인 고도화 | 초기 릴리스에서는 로컬 저장 자체가 우선임 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SET-01 | TBD | Pending |
| SET-02 | TBD | Pending |
| SET-03 | TBD | Pending |
| SET-04 | TBD | Pending |
| MOD-01 | TBD | Pending |
| MOD-02 | TBD | Pending |
| MOD-03 | TBD | Pending |
| CONV-01 | TBD | Pending |
| CONV-02 | TBD | Pending |
| CONV-03 | TBD | Pending |
| CONV-04 | TBD | Pending |
| CONV-05 | TBD | Pending |
| CHAT-01 | TBD | Pending |
| CHAT-02 | TBD | Pending |
| CHAT-03 | TBD | Pending |
| CHAT-04 | TBD | Pending |
| CHAT-05 | TBD | Pending |
| DATA-01 | TBD | Pending |
| DATA-02 | TBD | Pending |
| DATA-03 | TBD | Pending |
| UX-01 | TBD | Pending |
| UX-02 | TBD | Pending |
| UX-03 | TBD | Pending |
| UX-04 | TBD | Pending |
| UX-05 | TBD | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 0
- Unmapped: 25 ⚠️

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-03-31 after initial definition*
