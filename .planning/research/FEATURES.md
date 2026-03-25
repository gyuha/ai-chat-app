# Feature Research (기능 리서치)

**Domain:** Multi-user OpenRouter-based web chat application
**Researched:** 2026-03-25
**Confidence:** HIGH

## Feature Landscape (기능 지형)

### Table Stakes (Users Expect These / 기본 기대 기능)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 이메일/비밀번호 가입 및 로그인 | 다중 사용자 서비스의 기본 진입점이다 | MEDIUM | 세션 유지와 비밀번호 해시 처리가 필요하다 |
| 대화 생성 및 대화 목록 조회 | 채팅 앱이라면 새 대화 시작과 목록 복귀가 당연히 기대된다 | MEDIUM | 사용자별 소유권 분리가 필요하다 |
| 메시지 히스토리 저장 및 재열람 | 사용자는 새로고침 후에도 이전 대화를 기대한다 | MEDIUM | 대화/메시지 스키마와 정렬 규칙이 중요하다 |
| 스트리밍 응답 표시 | AI 채팅 서비스에서 응답 진행 상태를 보는 경험이 기본 기대가 됐다 | MEDIUM | SSE 또는 chunked response 처리 필요 |
| 인증 보호 라우트 | 비로그인 사용자가 타인 데이터에 접근하면 안 된다 | LOW | 프론트 가드와 서버 인증 검증 모두 필요 |

### Differentiators (Competitive Advantage / 차별화 요소)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 시스템 프롬프트 프리셋 | 사용자별 용도 전환이 쉬워진다 | MEDIUM | v1 핵심은 아니다 |
| 모델 전환 UI | 사용자가 품질/속도를 직접 고른다 | HIGH | 무료 모델 고정 정책과 충돌한다 |
| 첨부파일/멀티모달 | 활용 범위가 넓어진다 | HIGH | OpenRouter 모델별 지원 차이가 크다 |

### Anti-Features (Commonly Requested, Often Problematic / 문제성 기능)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| 사용자별 API 키 입력 | 유연해 보인다 | 보안 모델과 UX가 복잡해지고 지원 범위가 커진다 | 서버 단일 키 관리 |
| 실시간 동시 협업 채팅 | 화려해 보인다 | MVP에서 권한, 동기화, 충돌 해결 범위가 너무 커진다 | 사용자 단독 대화 히스토리부터 구현 |
| 초반부터 다중 모델 선택 | 비교 실험 욕구가 있다 | 무료 모델 변동성과 테스트 케이스가 급증한다 | 운영자가 `.env` 로 고정 |

## Feature Dependencies (기능 의존성)

```text
[Streaming chat]
    └──requires──> [Authenticated session]
                       └──requires──> [User account]

[Conversation history]
    └──requires──> [Conversation persistence]
                       └──requires──> [Database schema]

[Protected app routes] ──enhances──> [Authenticated session]

[Model selector] ──conflicts──> [Server-fixed free model policy]
```

### Dependency Notes (의존성 메모)

- **Streaming chat requires authenticated session:** 사용자별 히스토리 귀속과 접근 통제를 동시에 처리해야 한다
- **Conversation history requires conversation persistence:** DB 스키마 없이 목록/메시지 재조회 기능이 성립하지 않는다
- **Protected app routes enhances authenticated session:** 프론트엔드에서 잘못된 접근을 빠르게 차단한다
- **Model selector conflicts with fixed model policy:** v1 운영 단순화 목표와 맞지 않는다

## MVP Definition (MVP 정의)

### Launch With (v1 / 출시 포함)

- [ ] 이메일/비밀번호 가입 및 로그인 — 여러 사용자를 분리하기 위한 최소 조건이다
- [ ] 인증 보호 라우트와 세션 유지 — 새로고침 후에도 앱을 계속 사용할 수 있어야 한다
- [ ] 새 대화 생성과 대화 목록 조회 — 채팅 앱의 기본 탐색 구조다
- [ ] 스트리밍 응답 채팅 — 핵심 사용 경험이다
- [ ] 메시지 히스토리 저장 및 재열람 — 사용자가 “다시 들어와도 이어진다”를 체감해야 한다

### Add After Validation (v1.x / 검증 후 추가)

- [ ] 로그아웃 외 세션 관리 개선 — 실제 사용 흐름에서 불편이 확인되면 추가
- [ ] 시스템 프롬프트 프리셋 — 반복 사용 패턴이 생기면 추가

### Future Consideration (v2+ / 미래 검토)

- [ ] 모델 전환 UI — 운영 정책과 모델 품질 기준이 안정화된 뒤 검토
- [ ] 파일 첨부 및 멀티모달 — 텍스트 채팅 안정화 후 검토
- [ ] 관리자 대시보드 — 초기 사용자 확보 후 운영 니즈가 생기면 검토

## Feature Prioritization Matrix (기능 우선순위 매트릭스)

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 이메일/비밀번호 인증 | HIGH | MEDIUM | P1 |
| 대화 생성/목록 | HIGH | MEDIUM | P1 |
| 스트리밍 응답 | HIGH | MEDIUM | P1 |
| 히스토리 저장/조회 | HIGH | MEDIUM | P1 |
| 시스템 프롬프트 프리셋 | MEDIUM | MEDIUM | P2 |
| 모델 전환 UI | MEDIUM | HIGH | P3 |

## Competitor Feature Analysis (경쟁사 기능 분석)

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| 로그인 | 계정 기반 | 계정 기반 | 이메일/비밀번호 고정 |
| 스트리밍 응답 | 기본 제공 | 기본 제공 | v1 필수 포함 |
| 모델 선택 | 제공하는 경우 많음 | 제공하는 경우 많음 | v1에서는 의도적으로 제외 |
| 히스토리 | 기본 제공 | 기본 제공 | 사용자별 대화/메시지 저장으로 구현 |

## Sources (출처)

- https://openrouter.ai/docs/quickstart
- https://openrouter.ai/docs/api-reference/overview
- 주요 AI 채팅 제품의 일반적 사용 패턴 비교에 대한 도메인 추론

---
*Feature research for: Multi-user OpenRouter-based web chat application*
*Researched: 2026-03-25*
