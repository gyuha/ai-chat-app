# Requirements: OpenRouter Free Chat App

**Defined:** 2026-03-25
**Core Value:** OpenRouter API 키를 노출하지 않으면서 여러 사용자가 안정적으로 로그인하고 채팅 히스토리를 이어서 사용할 수 있어야 한다.

## v1 Requirements

이번 milestone에서 실제로 구현하고 검증할 요구사항입니다.

### Authentication

- [ ] **AUTH-01**: 사용자가 이메일과 비밀번호로 가입할 수 있다
- [ ] **AUTH-02**: 사용자가 이메일과 비밀번호로 로그인할 수 있다
- [ ] **AUTH-03**: 사용자가 브라우저를 새로고침해도 로그인 세션이 유지된다
- [ ] **AUTH-04**: 인증되지 않은 사용자는 채팅 앱 화면에 접근할 수 없다

### Conversations

- [ ] **CONV-01**: 로그인한 사용자가 새 대화를 생성할 수 있다
- [ ] **CONV-02**: 로그인한 사용자가 자신의 대화 목록을 볼 수 있다
- [ ] **CONV-03**: 로그인한 사용자가 특정 대화의 이전 메시지 히스토리를 다시 볼 수 있다
- [ ] **CONV-04**: 한 사용자는 다른 사용자의 대화와 메시지에 접근할 수 없다

### Chat

- [ ] **CHAT-01**: 로그인한 사용자가 메시지를 보내면 서버가 OpenRouter 무료 모델에 요청을 전달할 수 있다
- [ ] **CHAT-02**: 사용자가 assistant 응답을 스트리밍 형태로 볼 수 있다
- [ ] **CHAT-03**: 스트리밍이 완료되면 assistant 응답이 해당 대화 히스토리에 저장된다
- [ ] **CHAT-04**: OpenRouter API 키와 모델 ID는 서버 환경 변수로만 관리되고 클라이언트에 노출되지 않는다

## v2 Requirements

이번 roadmap에는 넣지 않지만 추후 후보로 추적할 요구사항입니다.

### Experience

- **EXP-01**: 사용자가 시스템 프롬프트 프리셋을 선택할 수 있다
- **EXP-02**: 사용자가 대화 제목을 직접 수정할 수 있다

### Models

- **MOD-01**: 사용자가 여러 무료 모델 중 하나를 선택할 수 있다

### Media

- **MED-01**: 사용자가 파일을 첨부해 멀티모달 요청을 보낼 수 있다

## Out of Scope

이번 범위에서 명시적으로 제외한 항목입니다.

| Feature | Reason |
|---------|--------|
| 소셜 로그인 | 이메일/비밀번호 기반 MVP 검증이 우선 |
| 사용자별 모델 선택 UI | 서버 고정 무료 모델 정책과 충돌 |
| 파일 첨부 및 멀티모달 | 핵심 텍스트 채팅 범위를 넘음 |
| 관리자 대시보드 | 초기 사용자 가치 검증보다 운영 기능에 가깝다 |
| 브라우저 직접 OpenRouter 호출 | API 키 보안 요구사항을 위반한다 |

## Traceability

요구사항과 roadmap phase의 연결 관계를 기록합니다.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 4 | Pending |
| CONV-01 | Phase 2 | Pending |
| CONV-02 | Phase 2 | Pending |
| CONV-03 | Phase 4 | Pending |
| CONV-04 | Phase 2 | Pending |
| CHAT-01 | Phase 3 | Pending |
| CHAT-02 | Phase 3 | Pending |
| CHAT-03 | Phase 3 | Pending |
| CHAT-04 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0

---
*Requirements defined: 2026-03-25*
*Last updated: 2026-03-25 after initialization*
