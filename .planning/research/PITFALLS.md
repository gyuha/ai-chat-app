# Pitfalls Research (함정 리서치)

**Domain:** Multi-user OpenRouter-based web chat application
**Researched:** 2026-03-25
**Confidence:** HIGH

## Critical Pitfalls (치명적 함정)

### Pitfall 1: API 키 노출

**What goes wrong:**
브라우저 번들, 네트워크 호출, 클라이언트 환경 변수에서 OpenRouter 키가 노출된다.

**Why it happens:**
빠르게 MVP를 만들려다 프론트엔드 직접 호출을 선택하기 쉽다.

**How to avoid:**
모든 OpenRouter 호출을 NestJS 서버로 프록시하고, 키와 모델 ID를 서버 `.env` 에서만 읽는다.

**Warning signs:**
프론트 코드에 `OPENROUTER_API_KEY`, `fetch("https://openrouter.ai/api/...")` 같은 흔적이 보인다.

**Phase to address:**
Phase 1

---

### Pitfall 2: 스트리밍만 되고 저장은 깨지는 구현

**What goes wrong:**
실시간 응답은 보이지만 새로고침 후 assistant 메시지나 conversation 상태가 일관되게 남지 않는다.

**Why it happens:**
스트리밍 UX에만 집중하고 메시지 저장 시점과 실패 복구 규칙을 설계하지 않는다.

**How to avoid:**
사용자 메시지 저장, 스트리밍 완료 시 assistant 메시지 확정 저장, 실패 시 상태 표시 규칙을 분리한다.

**Warning signs:**
응답 도중 새로고침하면 대화가 비어 있거나 중복 메시지가 생긴다.

**Phase to address:**
Phase 3

---

### Pitfall 3: 사용자 소유권 검증 누락

**What goes wrong:**
한 사용자가 다른 사용자의 대화 ID를 추측해 조회하거나 수정할 수 있다.

**Why it happens:**
대화 조회 API를 `conversationId` 기준으로만 처리하고 `userId` 필터를 빠뜨린다.

**How to avoid:**
모든 conversation/message 쿼리에 인증된 `userId` 조건을 포함하고, 가드/서비스 레벨 테스트를 작성한다.

**Warning signs:**
인증 테스트 없이 CRUD 구현이 먼저 끝나거나, repository 메서드가 ID 단독 조회를 사용한다.

**Phase to address:**
Phase 2

---

### Pitfall 4: 무료 모델 정책과 UI 범위 불일치

**What goes wrong:**
서버는 모델을 고정하려고 하지만 프론트에서 모델 선택 UI를 추가해 정책과 구현이 어긋난다.

**Why it happens:**
범위를 명시적으로 제한하지 않으면 일반 AI 채팅 제품 패턴을 그대로 복제하기 쉽다.

**How to avoid:**
requirements와 roadmap에 “모델은 서버 고정”을 명시하고 관련 UI를 out of scope로 유지한다.

**Warning signs:**
settings 화면, 모델 selector, 사용자 설정 스키마가 조기에 등장한다.

**Phase to address:**
Phase 1

## Technical Debt Patterns (기술 부채 패턴)

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| 인증 없이 채팅 API 먼저 구현 | 빠른 데모 가능 | 사용자 소유권과 히스토리 구조를 다시 짜야 한다 | 데모 브랜치에서만 |
| 메시지 전체를 단일 JSON blob으로 저장 | 스키마 설계가 빠르다 | 검색, 정렬, 부분 복구가 어려워진다 | 매우 초기 프로토타입까지 |
| 프론트에서 스트림 상태를 컴포넌트 로컬로만 관리 | 구현이 단순하다 | 라우트 전환/복구 시 상태 일관성이 깨진다 | never |

## Integration Gotchas (통합 함정)

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| OpenRouter | non-stream 응답 가정으로만 구현 | 스트리밍/에러/타임아웃 처리를 포함한 서버 어댑터 작성 |
| SQLite | 동시 요청에서 잠금 전략 미고려 | 트랜잭션 범위를 짧게 유지하고 write 경로를 단순화 |
| Auth cookies/tokens | 프론트 라우트 보호만 하고 서버 검증 생략 | 서버 가드와 클라이언트 가드를 모두 둔다 |

## Performance Traps (성능 함정)

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 대화 목록 매번 전체 재조회 | 앱 전환 시 느린 목록 렌더링 | React Query 캐시와 필요한 범위만 refetch | 대화 수가 수백 개를 넘길 때 |
| 메시지 저장을 과도한 다중 write로 처리 | 스트리밍 중 지연과 DB 잠금 | 저장 이벤트를 최소화하고 완료 시점 확정 저장 | 동시 채팅 수가 늘 때 |
| 모든 페이지에서 인증 사용자 재조회 | 불필요한 API 호출 증가 | 공통 query 캐시와 라우트 loader 재사용 | 페이지 수가 늘 때 |

## Security Mistakes (보안 실수)

| Mistake | Risk | Prevention |
|---------|------|------------|
| 비밀번호 평문 저장 또는 약한 해시 | 계정 탈취 | 검증된 password hashing 사용 |
| conversationId만으로 메시지 접근 허용 | 타인 데이터 노출 | userId ownership 검증 필수 |
| 서버 에러에 OpenRouter 응답 원문 노출 | 내부 정보 노출 | 클라이언트용 에러 메시지 표준화 |

## UX Pitfalls (UX 함정)

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| 스트리밍 중 상태 표시 부재 | 앱이 멈춘 것처럼 느껴짐 | 생성 중 상태와 취소/재시도 UX 제공 |
| 히스토리 목록 제목이 모두 동일 | 대화를 찾기 어렵다 | 첫 메시지 기반 기본 제목 생성 |
| 로그인 만료 처리 부재 | 갑작스러운 실패 경험 | 만료 시 로그인 화면으로 명확히 리다이렉트 |

## "Looks Done But Isn't" Checklist

- [ ] **Authentication:** 세션 유지가 새로고침 후에도 동작하는지 검증
- [ ] **Conversations:** 다른 사용자의 대화가 보이지 않는지 검증
- [ ] **Streaming:** 응답 중 실패 시 UI와 저장 상태가 일관적인지 검증
- [ ] **History:** 대화 목록과 메시지 상세가 모두 재조회되는지 검증

## Recovery Strategies (복구 전략)

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| API 키 노출 | HIGH | 키 교체, 배포 비밀값 점검, 프론트 직접 호출 제거 |
| 저장 불일치 | MEDIUM | 메시지 상태 마이그레이션, 완료 이벤트 기준 저장 로직 재구성 |
| 소유권 검증 누락 | HIGH | 전 API 감사, 쿼리 수정, 회귀 테스트 추가 |

## Pitfall-to-Phase Mapping (함정-Phase 매핑)

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| API 키 노출 | Phase 1 | 브라우저 코드에서 OpenRouter 직접 호출이 없는지 확인 |
| 사용자 소유권 검증 누락 | Phase 2 | 인증된 userId 조건이 모든 조회/수정에 포함되는지 테스트 |
| 스트리밍만 되고 저장은 깨짐 | Phase 3 | 채팅 후 새로고침 시 히스토리가 유지되는지 검증 |
| 무료 모델 정책과 UI 범위 불일치 | Phase 1 | 모델 선택 UI가 roadmap/requirements에 포함되지 않았는지 확인 |

## Sources (출처)

- https://openrouter.ai/docs/quickstart
- https://openrouter.ai/docs/api-reference/overview
- https://docs.nestjs.com/security/authentication
- 도메인 구현 경험 기반 위험 분석

---
*Pitfalls research for: Multi-user OpenRouter-based web chat application*
*Researched: 2026-03-25*
