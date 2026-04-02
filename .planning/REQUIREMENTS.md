# Requirements: AI Chat App

**Defined:** 2026-04-02
**Core Value:** 브라우저에서 간단하게 사용할 수 있는 무료 AI 채팅 도구

## v1 Requirements

### API & Authentication

- [x] **API-01**: 사용자는 API 키 입력 필드에 OpenRouter API 키를 입력 가능
- [x] **API-02**: 사용자는 "연결" 버튼으로 API 키 유효성 검사 가능
- [x] **API-03**: API 키는 localStorage에 저장되어 페이지 새로고침 후에도 유지
- [x] **API-04**: API 키 유효하지 않을 때 오류 메시지 표시

### Conversations

- [x] **CHAT-01**: 사용자는 사이드바에서 "새 대화" 버튼으로 새 대화방 생성 가능
- [x] **CHAT-02**: 사용자는 사이드바에서 기존 대화방 클릭하여 선택 가능
- [x] **CHAT-03**: 사용자는 사이드바에서 대화방 삭제 가능
- [x] **CHAT-04**: 대화방 이름은 첫 번째 사용자 메시지 내용으로 자동 설정
- [x] **CHAT-05**: 선택된 대화방의 메시지 목록이 메인 영역에 표시

### Messaging

- [x] **MSG-01**: 사용자는 텍스트 입력창에 메시지 작성 가능
- [x] **MSG-02**: 사용자는 Enter로 메시지 전송 (Shift+Enter는 줄바꿈)
- [x] **MSG-03**: 빈 메시지는 전송 불가 (입력 방지)
- [x] **MSG-04**: AI 응답은 실시간 스트리밍으로 토큰 단위 표시
- [x] **MSG-05**: AI 응답 완료 전 취소 버튼으로 중단 가능
- [x] **MSG-06**: 메시지 전송 중 입력창 비활성화 (중복 전송 방지)
- [x] **MSG-07**: 메시지 영역은 자동 스크롤로 최신 메시지 위치

### Model Selection

- [x] **MODEL-01**: 사용자는 오른쪽 상단 셀렉트 박스에서 무료 모델 선택 가능
- [x] **MODEL-02**: 선택된 모델은 localStorage에 저장

### Storage

- [ ] **STORE-01**: 모든 대화방 데이터는 localStorage에 자동 저장
- [ ] **STORE-02**: 페이지 새로고침 후 대화 데이터 복원
- [ ] **STORE-03**: localStorage 용량 초과 시 적절한 오류 처리

## v2 Requirements

Deferred for future release.

### UI/UX Enhancements

- **UX-01**: Dark/Light 테마 전환
- **UX-02**: 대화 검색 기능
- **UX-03**: Markdown 렌더링 (코드 블록, 리스트, 테이블)
- **UX-04**: 코드 블록 복사 버튼
- **UX-05**: 키보드 단축키 지원

### Data Management

- **DATA-01**: 대화 내용을 Markdown으로 내보내기
- **DATA-02**: 토큰 사용량 표시

## Out of Scope

| Feature | Reason |
|---------|--------|
| 사용자 인증/로그인 | API 키로 개별 식별, 별도 인증 불필요 |
| 클라우드 동기화 | 서버 없음, localStorage만 사용 |
| 유료 모델 지원 | 무료 모델만 대상 |
| 파일 첨부 | 무료 모델 제한, 범위 밖 |
| 다중 모델 비교 | 단순 단일 모델 선택 |
| 모바일 네이티브 앱 | 웹 SPA 우선 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| API-01 | Phase 1 | Complete |
| API-02 | Phase 1 | Complete |
| API-03 | Phase 1 | Complete |
| API-04 | Phase 1 | Complete |
| CHAT-01 | Phase 1 | Complete |
| CHAT-02 | Phase 1 | Complete |
| CHAT-03 | Phase 1 | Complete |
| CHAT-04 | Phase 1 | Complete |
| CHAT-05 | Phase 1 | Complete |
| MSG-01 | Phase 2 | Complete |
| MSG-02 | Phase 2 | Complete |
| MSG-03 | Phase 2 | Complete |
| MSG-04 | Phase 2 | Complete |
| MSG-05 | Phase 2 | Complete |
| MSG-06 | Phase 2 | Complete |
| MSG-07 | Phase 2 | Complete |
| MODEL-01 | Phase 1 | Complete |
| MODEL-02 | Phase 1 | Complete |
| STORE-01 | Phase 3 | Pending |
| STORE-02 | Phase 3 | Pending |
| STORE-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

---

*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after roadmap creation*
