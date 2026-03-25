# Product Requirements Document: OpenChat - 회원제 AI 채팅 서비스

**Author**: Product Team
**Date**: 2026-03-25
**Status**: Draft
**Version**: 1.0

---

## 1. Summary

OpenChat은 OpenRouter의 무료 AI 모델을 활용하는 회원제 웹 채팅 서비스입니다. 사용자는 무료로 AI 어시스턴트와 대화를 나누고, 대화 기록을 저장하고 관리할 수 있습니다. 백엔드에서 API 키를 보안 처리하는 프록시 아키텍처로 안전한 서비스를 제공합니다.

---

## 2. Contacts

| 역할 | 이름 | 담당 |
|------|------|------|
| Product Owner | TBD | 전체 책임, 의사결정 |
| Tech Lead | TBD | 기술 아키텍처, 구현 리드 |
| Designer | TBD | UI/UX 설계 |

---

## 3. Background

### 3.1 Context

AI 채팅 서비스 시장은 ChatGPT, Claude, Perplexity 등의 경쟁자로 포화 상태입니다. 그러나 대부분의 서비스는 유료이거나, 무료라도 회원가입이 필요합니다. 한국 사용자들을 위해 한국어 UI에 최적화된 무료 AI 채팅 서비스의 기회가 있습니다.

### 3.2 Why Now?

1. **기술 성숙도**: OpenRouter와 같은 API 집중화 서비스가 안정화되어 백엔드 구현이 단순해졌습니다
2. **무료 모델 품질**: Google Gemma, Meta Llama 등 오픈소스 모델의 품질이 실용 수준에 도달했습니다
3. **시장 기회**: 한국어 친화적 무료 AI 채팅 서비스의 니치가 존재합니다

### 3.3 What Changed?

OpenRouter가 다양한 AI 모델을 단일 API로 통합하여 제공하기 시작하면서, 복잡한 모델별 통합 없이 백엔드를 구축할 수 있게 되었습니다.

---

## 4. Objective

### 4.1 What's the Objective?

한국 사용자에게 **무료**로 제공되는 **한국어 친화적** AI 채팅 서비스를 출시하여 초기 사용자 기반을 구축합니다.

### 4.2 Why It Matters

- **고객 가치**: 무료로 고품질 AI 채팅을 이용할 수 있습니다
- **비즈니스 가치**: 초기 사용자 데이터를 확보하여 향후 프리미엄 티어 전환의 기반을 마련합니다

### 4.3 Alignment with Strategy

Phase 1 목표는 **사용자 확보**입니다. 수익화는 Phase 2 이후로 연기합니다.

### 4.4 Key Results (SMART OKRs)

| 목표 | 측정 방식 | 목표치 | 타임라인 |
|------|----------|--------|---------|
| 가입 사용자 수 | JWT 기반 유니크 사용자 | 100명 | MVP 출시 후 30일 |
| 일일 활성 사용자 (DAU) | 하루 1회 이상 채팅한 사용자 | 20명 | MVP 출시 후 30일 |
| 대화 보존률 | 7일 내 재방문율 | 30% | MVP 출시 후 30일 |
| 기술 안정성 | SSE 스트리밍 성공률 | 95%+ | 지속 |

---

## 5. Market Segment(s)

### 5.1 Primary Segment: 가성비 중시 한국 AI 사용자

**Profile**:
- **인구통계**: 20-30대 한국인, 기술 친화적
- **현재 행동**: ChatGPT 무료 요금제 사용 중, 사용량 한도에 답답함
- **페인 포인트**:
  - 유료 서비스에 지불할 의향이 아직 없음
  - 한국어 UI를 선호
  - 대화 기록이 사라지는 것이 불편

**Size**: 초기 타겟은 100명 (마케팅 없이 입소문 확산)

### 5.2 Secondary Segment: AI 채팅 입문자

**Profile**:
- **인구통계**: 다양한 연령대, AI 도구 사용 경험 적음
- **현재 행동**: AI 채팅을 써보고 싶지만 회원가입이 귀찮음
- **페인 포인트**: 복잡한 가입 절차, 영어 UI

---

## 6. Value Proposition(s)

### 6.1 Customer Jobs

- **핵심 Job**: AI 어시스턴트와 대화하여 질문에 답변 받기, 아이디어 얻기, 글쓰기 도움 받기
- **보조 Job**: 대화 기록 저장 및 검색, 이어서 대화하기

### 6.2 What Customers Gain

| 혜택 | 설명 |
|------|------|
| 완전 무료 | OpenRouter 무료 모델 활용, 사용량 제한 없음 (초기) |
| 한국어 UI | 친숙한 인터페이스, 별도 학습 불필요 |
| 대화 기록 | 언제든지 이전 대화를 불러와 이어서 질문 |
| 간편 가입 | 이메일만으로 1분 내 가입 완료 |

### 6.3 Pains Avoided

- **사용량 한도**: ChatGPT 무료 요금제의 3시간 제한 없음
- **영어 UI**: 한국어로 자연스럽게 사용
- **대화 분실**: 대화 기록이 자동으로 저장

### 6.4 Better Than Competitors

| 경쟁사 | 우리의 차별점 |
|--------|-------------|
| ChatGPT 무료 | 한국어 UI, 사용량 한도 없음 (초기) |
| Claude | 완전 무료, 한국어 UI |
| Perplexity | 채팅 중심 심플한 UX |

### 6.5 Value Curve

```
               High
                |
가격 (무료)      | ●━━━━━━━━━━━━━━━━━━━━━● 우리
                |
한국어 UI       |       ●           ● 우리
                |
사용량 제한     |━━━━━━━━━━━━━━━━●     ● 우리
                |
대화 기록       |           ●       ● 우리
                |
편의성          | ●━━━━━━━━━━━━━●━━━━━━━● 우리
                |
               Low
```

---

## 7. Solution

### 7.1 UX/Prototypes

#### User Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  랜딩 페이지  │ → │  회원가입    │ → │  채팅 인터페이스 │
└─────────────┘    └─────────────┘    └─────────────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │  대화 목록    │
                                    │  (사이드바)   │
                                    └─────────────┘
```

#### Key Screens

1. **랜딩 페이지**
   - 헤드라인: "무료 AI 채팅, 한국어로"
   - CTA: "시작하기" (회원가입 또는 로그인)

2. **회원가입/로그인**
   - 이메일 + 비밀번호
   - 간단한 form validation

3. **채팅 인터페이스**
   - 중앙: 채팅 메시지 영역
   - 하단: 입력창 + 전송 버튼
   - 좌측: 대화 목록 사이드바 (토글)

4. **대화 관리**
   - 새 대화 시작 버튼
   - 대화 제목 클릭하여 불러오기
   - 대화 삭제

### 7.2 Key Features

| # | 기능 | 설명 | Priority |
|---|------|------|----------|
| F1 | 회원가입/로그인 (JWT) | 이메일 인증 기반 회원가입, JWT 토큰으로 세션 관리 | P0 |
| F2 | 채팅 인터페이스 | AI와 실시간 대화, 스트리밍 응답 표시 | P0 |
| F3 | 대화 목록 사이드바 | 과거 대화 목록 표시, 클릭하여 불러오기 | P0 |
| F4 | 대화 저장/불러오기 | 대화가 DB에 자동 저장, 언제든 불러오기 | P0 |
| F5 | 대화 삭제 | 원치 않는 대화 삭제 | P1 |
| F6 | API 키 프록시 | 백엔드에서 OpenRouter API 키 보안 처리 | P0 |
| F7 | Rate Limiting | 사용자/IP별 요청 제한 (남용 방지) | P0 |

### 7.3 Technology

**Backend**:
- Framework: NestJS (TypeScript)
- Auth: JWT (`@nestjs/jwt`)
- Streaming: SSE (`@Sse()` decorator)
- Rate Limiting: `@nestjs/throttler`
- Database: PostgreSQL (Prisma ORM) - 추후 추가

**Frontend**:
- Framework: React (TypeScript)
- UI Library: shadcn/ui
- State Management: Zustand
- Data Fetching: TanStack Query
- Routing: TanStack Router
- Package Manager: pnpm
- Linting/Formatting: Biome

**Infrastructure**:
- Hosting: 추후 결정 (Vercel, Railway, etc.)
- Database: 추후 결정 (Supabase, Neon, etc.)

### 7.4 Assumptions

| # | 가정 | 카테고리 | 검증 방법 |
|---|------|---------|----------|
| A1 | NestJS SSE로 OpenRouter 스트리밍을 안정적으로 프록시할 수 있다 | Feasibility | 기술 PoC (E1) |
| A2 | OpenRouter 무료 모델 품질이 사용자 기대를 충족한다 | Value | 수동 테스트 |
| A3 | Rate Limiting이 API 한도 초과를 막을 수 있다 | Feasibility | 엣지 케이스 테스트 (E2) |
| A4 | 사용자가 무료 서비스에 회원가입할 의향이 있다 | Value | A/B 테스트 (추후) |

---

## 8. Release

### 8.1 Timeline (Relative)

| 단계 | 기간 | 내용 |
|------|------|------|
| Week 1 | 기술 리스크 검증 | SSE PoC, Rate Limiting 테스트 |
| Week 2 | 설계 | PRD 확정, DB 스키마, 아키텍처 설계 |
| Week 3 | MVP 구현 | 백엔드 API, 프론트엔드 UI |
| Week 4 | 테스트 & 출시 | QA, 버그 수정, 배포 |

### 8.2 MVP Scope (Phase 1)

**In Scope**:
- 회원가입 / 로그인 (이메일 인증)
- 채팅 인터페이스 (스트리밍 응답)
- 대화 목록 사이드바
- 대화 히스토리 저장 / 불러오기 / 삭제
- API 키 프록시 (백엔드)
- Rate Limiting (유저/IP별)

**Out of Scope (Phase 2+)**:
- 멀티 모델 선택 UI
- 사용량 티어 시스템 (무료/프리미엄)
- 마크다운 렌더링
- 소셜 로그인 (Google, GitHub)
- 대화 검색
- 대화 공유/내보내기

### 8.3 Success Criteria

MVP 출시 성공 여부는 다음으로 판단합니다:

- [ ] 10회 연속 스트리밍 요청이 무중단 성공
- [ ] 동시 5개 스트리밍 연결 처리 가능
- [ ] Rate limit 초과 시 429 응답 정상 반환
- [ ] 가입부터 첫 채팅까지 3분 이내 완료
- [ ] 한국어 UI에서 UX 저하 없음

---

## Appendix: Open Questions

| 질문 | Owner | 마감 기한 |
|------|-------|-----------|
| 데이터베이스 선택 (PostgreSQL vs MongoDB) | Tech Lead | Week 2 |
| 호스팅 서비스 선택 | Tech Lead | Week 2 |
| OpenRouter 무료 모델 품질 벤치마킹 | Product | Week 1 |
| 초기 100명 사용자 확보 채널 | Product | Week 3 |

---

*이 PRD는 발견 계획(discovery-plan.md)의 실험 결과에 따라 업데이트됩니다.*
