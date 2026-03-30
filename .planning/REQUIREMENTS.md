# Requirements: OpenRouter Chat

**Defined:** 2026-03-30
**Core Value:** 사용자가 서버 없이 자신의 OpenRouter API 키만으로 무료 모델과 안정적으로 대화하고, 대화 기록을 로컬에 안전하게 보관할 수 있어야 한다.

## v1 Requirements

초기 릴리스를 위한 요구사항이다. 각 요구사항은 정확히 하나의 roadmap phase에 매핑된다.

### Interface

- [x] **UI-01**: 사용자는 좌측 사이드바와 메인 채팅 패널이 있는 ChatGPT 스타일 레이아웃을 사용할 수 있다.
- [x] **UI-02**: 사용자는 온보딩, 채팅, 설정, 빈 상태, 오류 상태 전반에서 한국어 UI를 사용할 수 있다.
- [x] **UI-03**: 사용자는 모바일과 데스크톱에서 반응형 사이드바 인터랙션을 사용할 수 있다.
- [x] **UI-04**: 사용자는 다크모드를 기본값으로 사용하고 시스템 테마를 존중하면서 수동 전환할 수 있다.

### Settings

- [x] **SETT-01**: 저장된 OpenRouter API 키가 없을 때 사용자는 API 키 온보딩 화면을 본다.
- [x] **SETT-02**: 사용자는 설정 화면에서 OpenRouter API 키를 저장, 수정, 삭제할 수 있다.
- [x] **SETT-03**: 사용자는 채팅 전에 models endpoint를 통해 저장된 API 키를 검증할 수 있다.
- [x] **SETT-04**: 사용자는 설정에서 기본 무료 모델과 기본 시스템 프롬프트를 지정할 수 있다.

### Models

- [x] **MODL-01**: 사용자는 무료 모델만 필터링된 OpenRouter 모델 목록을 볼 수 있다.
- [x] **MODL-02**: 사용자는 대화마다 무료 모델을 선택할 수 있다.
- [x] **MODL-03**: 사용자는 현재 대화에 어떤 모델이 활성화되어 있는지 확인할 수 있다.

### Chat

- [ ] **CHAT-01**: 사용자는 선택한 모델에 메시지를 보내고 같은 대화 안에서 응답을 받을 수 있다.
- [ ] **CHAT-02**: 사용자는 어시스턴트 응답이 실시간으로 스트리밍되는 것을 볼 수 있다.
- [ ] **CHAT-03**: 사용자는 진행 중인 스트리밍 응답을 중단할 수 있다.
- [ ] **CHAT-04**: 사용자는 문법 강조가 적용된 코드 블록을 포함한 Markdown 응답을 읽을 수 있다.
- [ ] **CHAT-05**: 사용자는 rate limit 오류를 포함한 로딩, 빈 상태, 오류 상태를 한국어로 이해할 수 있다.

### Conversations

- [x] **CONV-01**: 사용자는 사이드바나 빈 상태 화면에서 새 대화를 시작할 수 있다.
- [ ] **CONV-02**: 사용자는 최신 업데이트 순으로 저장된 대화 목록을 볼 수 있다.
- [ ] **CONV-03**: 사용자는 기존 대화를 다시 열고 이전 메시지에서 이어서 사용할 수 있다.
- [ ] **CONV-04**: 사용자는 대화 제목을 직접 수정할 수 있다.
- [ ] **CONV-05**: 사용자는 확인 절차를 거쳐 대화를 삭제할 수 있다.

### Persistence

- [ ] **DATA-01**: 사용자의 대화와 메시지는 브라우저 새로고침 이후에도 유지된다.
- [x] **DATA-02**: 사용자의 설정은 브라우저 새로고침 이후에도 유지된다.
- [x] **DATA-03**: 선택한 모델과 시스템 프롬프트를 포함한 대화 메타데이터는 로컬에 유지된다.

## v2 Requirements

향후 릴리스로 미루는 요구사항이다. 기록은 하지만 현재 roadmap에는 포함하지 않는다.

### Platform

- **PLAT-01**: 사용자는 앱을 PWA로 설치하고 기본 오프라인 셸을 사용할 수 있다.
- **PLAT-02**: 사용자는 대화를 JSON으로 내보내고 가져올 수 있다.

### Models

- **PAID-01**: 사용자는 유료 OpenRouter 모델을 사용하고 토큰 또는 비용 사용량을 확인할 수 있다.

### Multimodal

- **MM-01**: 사용자는 프롬프트에 이미지나 파일을 첨부할 수 있다.

### Localization

- **I18N-01**: 사용자는 한국어 외의 앱 언어로 전환할 수 있다.

### Sync

- **SYNC-01**: 사용자는 로그인하고 대화를 여러 기기에서 동기화할 수 있다.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend relay or proxy server | v1은 브라우저에서 OpenRouter를 직접 호출하는 구조를 유지한다 |
| User authentication and cloud sync | 프론트엔드 전용 로컬 앱 범위를 벗어난다 |
| Paid models and billing analytics | 무료 모델 기반 핵심 경험을 먼저 검증한다 |
| Image or file attachments | 텍스트 중심 채팅 MVP보다 복잡도가 높다 |
| PWA/offline and import/export flows | 초기 출시 범위를 줄이고 이후 검증한다 |

## Traceability

어떤 phase가 어떤 요구사항을 담당하는지 추적한다. roadmap 생성 시 업데이트한다.

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 1 | Complete |
| UI-02 | Phase 1 | Complete |
| UI-03 | Phase 1 | Complete |
| UI-04 | Phase 1 | Complete |
| SETT-01 | Phase 2 | Complete |
| SETT-02 | Phase 2 | Complete |
| SETT-03 | Phase 2 | Complete |
| SETT-04 | Phase 2 | Complete |
| DATA-02 | Phase 2 | Complete |
| MODL-01 | Phase 3 | Complete |
| MODL-02 | Phase 3 | Complete |
| MODL-03 | Phase 3 | Complete |
| CONV-01 | Phase 3 | Complete |
| DATA-03 | Phase 3 | Complete |
| CHAT-01 | Phase 4 | Pending |
| CHAT-02 | Phase 4 | Pending |
| CHAT-03 | Phase 4 | Pending |
| CHAT-04 | Phase 4 | Pending |
| CHAT-05 | Phase 4 | Pending |
| CONV-02 | Phase 5 | Pending |
| CONV-03 | Phase 5 | Pending |
| CONV-04 | Phase 5 | Pending |
| CONV-05 | Phase 5 | Pending |
| DATA-01 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-31 after Phase 3 completion*
