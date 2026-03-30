# Requirements: OpenRouter Chat

**Defined:** 2026-03-30
**Core Value:** 사용자가 무료 AI 모델과 실시간 스트리밍 채팅을 할 수 있는 것

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### 채팅 핵심 (Chat)

- [ ] **CHAT-01**: 사용자가 메시지를 전송하고 SSE 스트리밍으로 실시간 토큰 단위 응답을 받을 수 있다
- [ ] **CHAT-02**: 사용자가 Stop 버튼으로 스트리밍 응답을 중단할 수 있다 (AbortController)
- [ ] **CHAT-03**: 어시스턴트 응답이 마크다운으로 렌더링된다 (코드블록 구문 강조 포함)
- [ ] **CHAT-04**: 스트리밍 중 점진적 마크다운 렌더링이 표시된다 (불완전한 마크다운 깨짐 없이)
- [ ] **CHAT-05**: 코드블록에 복사 버튼이 표시된다 (클릭 시 전체 코드 복사 + 토스트 피드백)
- [ ] **CHAT-06**: 스트리밍 중 오토스크롤이 동작한다 (사용자 수동 스크롤 시 자동 스크롤 중지)
- [ ] **CHAT-07**: 응답 대기 중 로딩 인디케이터가 표시된다
- [ ] **CHAT-08**: Enter로 전송, Shift+Enter로 줄바꿈이 동작한다
- [ ] **CHAT-09**: 사용자가 마지막 어시스턴트 응답을 재전송(Regenerate)할 수 있다
- [ ] **CHAT-10**: 사용자가 메시지 텍스트를 복사할 수 있다
- [ ] **CHAT-11**: 키보드 단축키가 동작한다 (Cmd+K 새 대화 등)

### 데이터 관리 (Data)

- [ ] **DATA-01**: 사용자가 새 대화를 생성할 수 있다
- [ ] **DATA-02**: 사이드바에 대화 목록이 최신순으로 표시된다
- [ ] **DATA-03**: 사용자가 대화를 삭제할 수 있다 (확인 다이얼로그 포함)
- [ ] **DATA-04**: 대화 제목이 첫 메시지 기반으로 자동 생성된다
- [ ] **DATA-05**: 사용자가 API 키를 등록/변경/삭제할 수 있다
- [ ] **DATA-06**: 사용자가 기본 모델을 설정할 수 있다
- [ ] **DATA-07**: 사용자가 시스템 프롬프트를 설정할 수 있다 (대화별/글로벌)

### UI/UX

- [ ] **UIUX-01**: 데스크톱(>1024px)에서 사이드바 고정, 모바일(<1024px)에서 토글 동작
- [ ] **UIUX-02**: 다크/라이트 테마 전환 가능 (시스템 감지 + 수동 전환)
- [ ] **UIUX-03**: 입력 영역이 내용에 따라 자동으로 높이 조절

### 모델 & API (Modl)

- [ ] **MODL-01**: 사용자가 무료 모델 목록을 조회하고 대화별로 모델을 선택할 수 있다
- [ ] **MODL-02**: API 오류 시 토스트 알림이 표시된다
- [ ] **MODL-03**: Rate Limit(429) 초과 시 사용자에게 안내가 표시된다
- [ ] **MODL-04**: API 오류 발생 시 재시도 버튼이 표시된다

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### 부가 기능

- **EXTR-01**: 대화 검색 기능 (Dexie.js 쿼리)
- **EXTR-02**: 토큰 사용량 표시 (입력/출력 추정)
- **EXTR-03**: 응답 시간 표시 (지연 ms)
- **EXTR-04**: 스트리밍 속도 제어 (딜레이 옵션)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| PWA/오프라인 지원 | 로컬 환경에서 항상 온라인 상태이므로 불필요 |
| 대화 내보내기/가져오기 (JSON) | v2에서 고려 |
| 유료 모델 지원 | 무료 모델만 사용 목적 |
| 토큰 사용량 추적/비용 계산 | 무료 모델만 사용하므로 불필요 |
| 이미지/파일 첨부 (멀티모달) | 복잡도 높음, v2에서 고려 |
| 다국어 지원 (i18n) | 한국어 UI만 필요 |
| 사용자 인증/로그인 | 로컬 전용, 백엔드 없음 |
| 클라우드 동기화 | 로컬 전용, 프라이버시 |
| 대화 목록 날짜별 그룹화 | 단순 최신순으로 충분 |
| 배포 (Vercel, Netlify 등) | 로컬 개발 환경에서만 사용 |
| 대화 분기 (Forking) | 복잡도 높음, 사용 빈도 낮음 |
| 음성 입력/출력 | 복잡도 높음, v2에서 고려 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CHAT-01 | — | Pending |
| CHAT-02 | — | Pending |
| CHAT-03 | — | Pending |
| CHAT-04 | — | Pending |
| CHAT-05 | — | Pending |
| CHAT-06 | — | Pending |
| CHAT-07 | — | Pending |
| CHAT-08 | — | Pending |
| CHAT-09 | — | Pending |
| CHAT-10 | — | Pending |
| CHAT-11 | — | Pending |
| DATA-01 | — | Pending |
| DATA-02 | — | Pending |
| DATA-03 | — | Pending |
| DATA-04 | — | Pending |
| DATA-05 | — | Pending |
| DATA-06 | — | Pending |
| DATA-07 | — | Pending |
| UIUX-01 | — | Pending |
| UIUX-02 | — | Pending |
| UIUX-03 | — | Pending |
| MODL-01 | — | Pending |
| MODL-02 | — | Pending |
| MODL-03 | — | Pending |
| MODL-04 | — | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 0
- Unmapped: 25 ⚠️

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after initial definition*
