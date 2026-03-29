# Requirements: OpenRouter Free Chat Web App

**Defined:** 2026-03-29
**Core Value:** 사용자는 키 노출 없이 빠르고 읽기 좋은 스트리밍 채팅 경험을 즉시 사용할 수 있어야 한다.

## v1 Requirements

### Shell & Navigation

- [ ] **SHELL-01**: 사용자는 좌측 사이드바에서 새 채팅을 시작할 수 있다.
- [ ] **SHELL-02**: 사용자는 좌측 사이드바에서 기존 대화 목록을 최근순으로 볼 수 있다.
- [ ] **SHELL-03**: 사용자는 현재 보고 있는 대화를 시각적으로 구분할 수 있다.
- [ ] **SHELL-04**: 사용자는 설정 UI에 진입할 수 있다.

### Conversations

- [ ] **CHAT-01**: 사용자는 새 대화를 생성하면 즉시 빈 대화 화면을 볼 수 있다.
- [ ] **CHAT-02**: 사용자는 대화를 삭제할 수 있다.
- [ ] **CHAT-03**: 사용자는 대화 제목이 첫 교환 이후 자동 생성되는 것을 볼 수 있다.
- [ ] **CHAT-04**: 사용자는 페이지를 새로고침해도 현재 저장소 범위 내에서 대화 목록을 다시 볼 수 있다.

### Messaging & Streaming

- [ ] **MSG-01**: 사용자는 멀티라인 입력창에 프롬프트를 입력하고 전송할 수 있다.
- [ ] **MSG-02**: 사용자는 assistant 응답을 스트리밍으로 읽을 수 있다.
- [ ] **MSG-03**: 사용자는 응답 생성 중 `Stop generating`으로 생성을 중단할 수 있다.
- [ ] **MSG-04**: 사용자는 마지막 assistant 응답을 `Regenerate` 할 수 있다.
- [ ] **MSG-05**: 사용자는 전송 중 상태와 완료 상태를 명확히 구분해 볼 수 있다.

### Rendering

- [ ] **REND-01**: 사용자는 markdown 형식의 본문을 읽을 수 있다.
- [ ] **REND-02**: 사용자는 코드 블록을 복사할 수 있다.
- [ ] **REND-03**: 사용자는 긴 목록, 표, 긴 코드 응답도 레이아웃이 깨지지 않은 상태로 볼 수 있다.
- [ ] **REND-04**: 사용자는 user / assistant / system 메시지를 명확히 구분할 수 있다.

### Settings & Models

- [ ] **SET-01**: 사용자는 허용된 무료 모델 목록 중에서 모델을 선택할 수 있다.
- [ ] **SET-02**: 사용자는 현재 대화에 적용된 모델을 메인 화면에서 확인할 수 있다.
- [ ] **SET-03**: 사용자는 시스템 프롬프트를 입력하거나 수정할 수 있다.
- [ ] **SET-04**: 운영자는 서버 설정만으로 모델 allowlist를 관리할 수 있다.

### Reliability & Feedback

- [ ] **FB-01**: 사용자는 빈 대화 상태에서 예시 프롬프트와 시작 행동을 볼 수 있다.
- [ ] **FB-02**: 사용자는 로딩, 스트리밍, 실패 상태를 이해할 수 있다.
- [ ] **FB-03**: 사용자는 rate limit 또는 서버 오류를 사용자 친화적 문장으로 볼 수 있다.
- [ ] **FB-04**: 사용자는 네트워크 실패 후 같은 흐름에서 다시 시도할 수 있다.

### Accessibility & Responsive

- [ ] **A11Y-01**: 사용자는 키보드만으로 새 채팅, 대화 선택, 설정 진입, 전송을 수행할 수 있다.
- [ ] **A11Y-02**: 사용자는 모든 주요 인터랙션에서 명확한 focus 상태를 볼 수 있다.
- [ ] **A11Y-03**: 사용자는 모바일 화면에서도 채팅 생성과 읽기를 무리 없이 수행할 수 있다.
- [ ] **A11Y-04**: 스크린리더 사용자는 비동기 상태 변화를 요약 안내받을 수 있다.

### Platform & Security

- [ ] **PLAT-01**: 브라우저는 OpenRouter를 직접 호출하지 않는다.
- [ ] **PLAT-02**: 서버는 `OPENROUTER_API_KEY`를 환경변수로만 사용한다.
- [ ] **PLAT-03**: 서버는 입력 validation과 예외 변환을 수행한다.
- [ ] **PLAT-04**: 시스템은 file/in-memory 저장소에서 동작하며 이후 DB 저장소로 교체 가능한 구조를 가진다.

## v2 Requirements

### Accounts & Persistence

- **V2-01**: 사용자는 로그인 후 자신의 대화만 볼 수 있다.
- **V2-02**: 사용자는 PostgreSQL 기반 영구 저장을 사용할 수 있다.
- **V2-03**: 사용자는 여러 디바이스에서 같은 대화 목록을 볼 수 있다.

### Advanced Product

- **V2-04**: 사용자는 프롬프트 템플릿을 저장할 수 있다.
- **V2-05**: 사용자는 파일 업로드 또는 멀티모달 입력을 사용할 수 있다.
- **V2-06**: 사용자는 대화를 export/import 할 수 있다.

## Out of Scope

| Feature | Reason |
|---------|--------|
| OAuth/Login | 익명 MVP에서 핵심 가치가 아니다 |
| PostgreSQL 필수화 | 저장소 추상화만 먼저 잡고 속도를 확보한다 |
| 협업/공유 기능 | 초기 사용자 가치보다 범위가 크다 |
| 이미지/파일 업로드 | 스트리밍 텍스트 MVP 범위를 넘어선다 |
| 음성 인터페이스 | 구현/검증 비용이 크다 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHELL-01 | Phase 2 | Pending |
| SHELL-02 | Phase 2 | Pending |
| SHELL-03 | Phase 2 | Pending |
| SHELL-04 | Phase 4 | Pending |
| CHAT-01 | Phase 2 | Pending |
| CHAT-02 | Phase 4 | Pending |
| CHAT-03 | Phase 4 | Pending |
| CHAT-04 | Phase 4 | Pending |
| MSG-01 | Phase 2 | Pending |
| MSG-02 | Phase 3 | Pending |
| MSG-03 | Phase 3 | Pending |
| MSG-04 | Phase 3 | Pending |
| MSG-05 | Phase 3 | Pending |
| REND-01 | Phase 3 | Pending |
| REND-02 | Phase 3 | Pending |
| REND-03 | Phase 5 | Pending |
| REND-04 | Phase 2 | Pending |
| SET-01 | Phase 4 | Pending |
| SET-02 | Phase 4 | Pending |
| SET-03 | Phase 4 | Pending |
| SET-04 | Phase 1 | Pending |
| FB-01 | Phase 2 | Pending |
| FB-02 | Phase 5 | Pending |
| FB-03 | Phase 5 | Pending |
| FB-04 | Phase 5 | Pending |
| A11Y-01 | Phase 5 | Pending |
| A11Y-02 | Phase 5 | Pending |
| A11Y-03 | Phase 5 | Pending |
| A11Y-04 | Phase 5 | Pending |
| PLAT-01 | Phase 1 | Pending |
| PLAT-02 | Phase 1 | Pending |
| PLAT-03 | Phase 1 | Pending |
| PLAT-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0

---
*Requirements defined: 2026-03-29*
*Last updated: 2026-03-29 after initial definition*
