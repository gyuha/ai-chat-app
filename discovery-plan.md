# Discovery Plan: OpenRouter 기반 웹 채팅 애플리케이션

**Date**: 2026-03-25
**Product Stage**: New Product
**Discovery Question**: OpenRouter 무료 API를 백엔드 프록시로 감싸는 회원제 AI 채팅 서비스의 MVP 범위와 핵심 기술 리스크는 무엇인가?

---

## 제품 개요

- **서비스**: 회원제 일반 공개 AI 채팅 웹 앱
- **핵심 설계**: OpenRouter 무료 API 키를 백엔드에서 보호하는 프록시 아키텍처
- **기술 스택**:
  - Backend: NestJS, TypeScript
  - Frontend: React, TypeScript, shadcn UI, Zustand, TanStack Query, TanStack Router, pnpm, Biome

---

## Ideas Explored (10개)

| # | 아이디어 | 관점 |
|---|---------|------|
| 1 | 멀티 모델 선택 채팅 | PM |
| 2 | 채팅 히스토리 & 대화 관리 | PM |
| 3 | 사용량 제한 티어 시스템 | PM |
| 4 | 사이드바 기반 대화 목록 UI | Designer |
| 5 | 마크다운 + 코드 하이라이팅 | Designer |
| 6 | 스트리밍 응답 표시 (타이핑 효과) | Designer |
| 7 | 백엔드 API 키 프록시 + Rate Limiting | Engineer |
| 8 | JWT 기반 회원 인증 시스템 | Engineer |
| 9 | 대화 영속성 (DB 저장) | Engineer |
| 10 | 실시간 스트리밍 SSE | Engineer |

---

## Selected Ideas for Validation (MVP 범위)

| # | 아이디어 | 선택 이유 |
|---|---------|---------|
| 2 | 채팅 히스토리 & 대화 관리 | 재방문 유도, retention 핵심 |
| 4 | 사이드바 기반 대화 목록 UI | 검증된 UX 패턴, 친숙한 인터페이스 |
| 6 | 스트리밍 응답 표시 | 체감 성능 향상, 대기감 해소 |
| 7 | API 키 프록시 + Rate Limiting | 필수 - 핵심 보안 요구사항 |
| 8 | JWT 기반 회원 인증 | 필수 - 회원제 서비스 전제 |
| 9 | 대화 영속성 (DB 저장) | 히스토리 기능의 기반 인프라 |
| 10 | SSE 스트리밍 | 필수 - 스트리밍 응답의 기술적 구현 |

---

## Critical Assumptions

| # | 가정 | 카테고리 | 영향 | 불확실성 | 우선순위 |
|---|------|---------|------|---------|---------|
| F1 | NestJS에서 OpenRouter SSE 스트리밍을 안정적으로 프록시할 수 있다 | Feasibility | 높음 | 높음 | 1순위 |
| V3 | OpenRouter 무료 모델의 응답 품질이 사용자 기대를 충족한다 | Value | 높음 | 높음 | 2순위 |
| F4 | Rate Limiting이 API 한도 초과를 실제로 막을 수 있다 | Feasibility | 높음 | 높음 | 3순위 |
| Vi1 | OpenRouter 무료 API 한도가 초기 트래픽을 감당한다 | Viability | 높음 | 중간 | 4순위 |
| V1 | 사용자가 무료 서비스에 회원가입할 의향이 있다 | Value | 높음 | 중간 | 5순위 |
| G1 | "무료 AI 채팅" 가치 제안이 회원가입을 유도한다 | GTM | 중간 | 높음 | 6순위 |
| F2 | NestJS + 선택 스택으로 MVP 기간 내 구현 가능하다 | Feasibility | 높음 | 낮음 | 7순위 |
| U1 | 사이드바 UI가 별도 튜토리얼 없이 직관적이다 | Usability | 중간 | 낮음 | 8순위 |

---

## Validation Experiments

| # | 검증 가정 | 방법 | 성공 기준 | 노력 | 타임라인 |
|---|---------|------|---------|------|---------|
| E1 | F1: SSE 프록시 안정성 | 기술 스파이크 (PoC) | 10회 연속 스트리밍 성공, 에러 핸들링 정상 동작 | 낮음 | Day 1 |
| E2 | F1 + F4: SSE + Rate Limiting 통합 | 엣지 케이스 테스트 | 동시 5연결 처리, rate limit 초과 시 429 응답 | 낮음 | Day 2 |

---

## Experiment Details

### E1: NestJS SSE 스트리밍 프록시 PoC

**가설**: NestJS `@Sse()` 데코레이터로 OpenRouter streaming API를 프록시하면 프론트엔드가 끊김 없이 토큰을 수신할 수 있다.

**구현 구조**:
```typescript
// NestJS - chat.controller.ts
@Sse('stream')
streamChat(@Body() dto: ChatDto, @Res() res: Response) {
  return new Observable(observer => {
    openRouterService.stream(dto.messages).subscribe({
      next: (chunk) => observer.next({ data: chunk }),
      complete: () => observer.complete(),
      error: (err) => observer.error(err)
    });
  });
}
```

**테스트 시나리오**:
1. 짧은 응답 (50토큰 이하)
2. 긴 응답 (500토큰 이상)
3. 네트워크 지연 시뮬레이션

**성공 기준**:
- [ ] 토큰이 실시간으로 순서대로 도착
- [ ] 응답 완료 시 스트림 정상 종료
- [ ] 에러 발생 시 클라이언트가 에러 메시지 수신
- [ ] 10회 연속 요청 중 실패 없음

**결정 기준**:
- 성공 -> MVP 전체 스택으로 개발 진행
- 실패 -> WebSocket 대안 또는 polling 방식 검토

---

### E2: Rate Limiting + SSE 통합 검증

**가설**: ThrottlerModule 활성화 상태에서도 SSE 스트리밍 연결이 중단되지 않으며, 동시 5개 이상 요청을 처리할 수 있다.

**테스트 시나리오**:
1. 동시 요청 시뮬레이션 (3 / 5 / 10 연결)
2. 한도 초과 요청 시 에러 응답 확인
3. 진행 중인 스트림의 rate limit 영향 여부

**성공 기준**:
- [ ] 동시 5개 스트리밍 연결 처리 가능
- [ ] Rate limit 초과 시 429 응답 (스트림 시작 전 차단)
- [ ] 진행 중인 스트림은 rate limit에 영향받지 않음

**결정 기준**:
- 성공 -> Rate limiting 전략 확정, MVP 개발 진행
- 실패 -> Redis 기반 분산 rate limiting 검토

---

## Discovery Timeline

### Week 1: 기술 리스크 검증
- **Day 1**: E1 - SSE 스트리밍 PoC 구현 및 테스트
- **Day 2**: E2 - Rate Limiting 통합 테스트
- **Day 3**: 결과 분석 및 아키텍처 확정
- **Day 4-5**: OpenRouter 무료 모델 품질 수동 테스트 (V3 검증)

### Week 2: MVP 설계 및 개발 착수
- 아키텍처 확정 후 PRD 작성
- DB 스키마 설계 (User, Conversation, Message)
- JWT 인증 플로우 설계
- 프론트엔드 라우팅 구조 설계

### Week 3: MVP 구현
- 백엔드: Auth, Chat, History API
- 프론트엔드: 로그인, 채팅 UI, 사이드바, 스트리밍 렌더링

---

## Decision Framework

| 실험 결과 | 다음 단계 |
|---------|---------|
| E1 성공 | MVP 전체 스택으로 개발 진행 |
| E1 실패 (SSE 불안정) | WebSocket 또는 polling 방식으로 아키텍처 변경 후 재검증 |
| E2 성공 | Rate limiting 전략 확정 |
| E2 실패 | Redis 기반 분산 rate limiting 검토 |
| V3 품질 불만족 | 유료 모델 소량 혼합 또는 모델 선택 UI 추가 검토 |

---

## MVP 기능 범위 (최종)

### In Scope
- 회원가입 / 로그인 (JWT)
- 채팅 인터페이스 (스트리밍 응답)
- 대화 목록 사이드바
- 대화 히스토리 저장 / 불러오기 / 삭제
- API 키 프록시 (백엔드)
- Rate Limiting (유저/IP별)

### Out of Scope (Post-MVP)
- 멀티 모델 선택 UI
- 사용량 티어 시스템 (무료/프리미엄)
- 마크다운 렌더링 (Phase 2에서 추가 권장)
- 소셜 로그인

---

*이 문서는 실험 결과에 따라 지속적으로 업데이트되어야 합니다.*
