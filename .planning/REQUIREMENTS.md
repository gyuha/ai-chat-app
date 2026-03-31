# Requirements: OpenRouter Chat

**Defined:** 2026-03-30
**Core Value:** 사용자가 복잡한 설정 없이 OpenRouter의 무료 AI 모델과 쉽게 대화할 수 있는 것

## v1 Requirements

### Authentication (API 키 관리)

- [ ] **AUTH-01**: 사용자가 OpenRouter API 키를 입력하여 저장할 수 있다
- [ ] **AUTH-02**: 저장된 API 키의 유효성을 API 호출로 검증할 수 있다
- [ ] **AUTH-03**: 사용자가 설정 페이지에서 API 키를 변경/삭제할 수 있다

### Models (모델 선택)

- [ ] **MODL-01**: 앱이 OpenRouter Models API에서 모델 목록을 조회할 수 있다
- [ ] **MODL-02**: 앱이 무료 모델(prompt=0, completion=0)만 필터링하여 표시할 수 있다
- [ ] **MODL-03**: 사용자가 대화에 사용할 모델을 선택할 수 있다
- [ ] **MODL-04**: 사용자가 기본 모델을 설정으로 저장할 수 있다

### Chat (채팅 기능)

- [ ] **CHAT-01**: 사용자가 텍스트 메시지를 입력하고 AI 응답을 받을 수 있다
- [ ] **CHAT-02**: AI 응답이 스트리밍 방식으로 실시간 표시된다
- [ ] **CHAT-03**: AI 응답이 Markdown으로 렌더링된다 (코드블록 하이라이팅 포함)
- [ ] **CHAT-04**: 메시지 전송 중 로딩 인디케이터가 표시된다
- [ ] **CHAT-05**: 사용자가 스트리밍 중 Stop 버튼으로 응답을 중단할 수 있다
- [ ] **CHAT-06**: 시스템 프롬프트를 설정할 수 있다 (글로벌 또는 대화별)

### Conversation (대화 관리)

- [x] **CONV-01**: 사용자가 "새 대화" 버튼으로 새 대화를 시작할 수 있다
- [x] **CONV-02**: 앱이 대화 목록을 최신순으로 표시한다
- [x] **CONV-03**: 앱이 대화 제목을 첫 메시지 기반으로 자동 생성한다
- [x] **CONV-04**: 사용자가 대화 제목을 수동 편집할 수 있다
- [x] **CONV-05**: 사용자가 대화를 삭제할 수 있다 (확인 다이얼로그 포함)
- [x] **CONV-06**: 모바일에서 사이드바를 토글할 수 있다

### UI/UX

- [ ] **UI-01**: ChatGPT와 유사한 좌측 사이드바 + 우측 채팅 영역 레이아웃
- [ ] **UI-02**: 반응형 디자인 (모바일 <1024px, 데스크톱 ≥1024px)
- [x] **UI-03**: 다크모드/라이트모드 지원 (시스템 테마 감지 + 수동 전환)
- [x] **UI-04**: 빈 상태 표시 (환영 메시지, API 키 미등록 안내)

### Data (데이터 저장)

- [x] **DATA-01**: IndexedDB에 대화 데이터(메시지)가 영속적으로 저장된다
- [x] **DATA-02**: IndexedDB에 사용자 설정(API 키, 기본 모델)이 저장된다

## v2 Requirements

### Enhanced Features

- **NOTF-01**: 응답 복사 버튼
- **NOTF-02**: 타이핑 인디케이터 (AI가 입력 중임을 표시)
- **NOTF-03**: 대화 검색
- **NOTF-04**: 프롬프트 템플릿
- **NOTF-05**: 키보드 단축키

### Future

- **FUTR-01**: 음성 입력
- **FUTR-02**: 대화 공유
- **FUTR-03**: 코드 실행 (Sandbox)
- **FUTR-04**: 모델별 설정

## Out of Scope

| Feature | Reason |
|---------|--------|
| PWA / 오프라인 지원 | 별도 작업 필요 |
| 대화 내보내기/가져오기 (JSON) | 향후 고려 |
| 유료 모델 지원 및 토큰 사용량 추적 | 별도 작업 필요 |
| 이미지/파일 첨부 (멀티모달) | 별도 작업 필요 |
| 다국어 지원 (i18n) | 한국어만 우선 |
| 사용자 인증/클라우드 동기화 | 별도 작업 필요 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| MODL-01 | Phase 1 | Pending |
| MODL-02 | Phase 1 | Pending |
| MODL-03 | Phase 1 | Pending |
| MODL-04 | Phase 1 | Pending |
| CHAT-01 | Phase 1 | Pending |
| CHAT-02 | Phase 1 | Pending |
| CHAT-03 | Phase 1 | Pending |
| CHAT-04 | Phase 1 | Pending |
| CHAT-05 | Phase 1 | Pending |
| CHAT-06 | Phase 1 | Pending |
| DATA-01 | Phase 2 | Complete |
| DATA-02 | Phase 2 | Complete |
| UI-01 | Phase 2 | Pending |
| UI-02 | Phase 2 | Pending |
| CONV-01 | Phase 3 | Complete |
| CONV-02 | Phase 3 | Complete |
| CONV-03 | Phase 3 | Complete |
| CONV-04 | Phase 3 | Complete |
| CONV-05 | Phase 3 | Complete |
| CONV-06 | Phase 3 | Complete |
| UI-03 | Phase 3 | Complete |
| UI-04 | Phase 3 | Complete |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after roadmap creation*
