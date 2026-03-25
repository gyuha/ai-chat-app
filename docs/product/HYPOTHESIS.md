# Pre-Mortem: OpenChat MVP Launch

**Date**: 2026-03-25
**Status**: Draft
**Scenario**: MVP launched 3 months ago and failed. Here's what went wrong.

---

## Executive Summary

After launching OpenChat MVP, the service failed to gain traction and was sunset after 3 months. Root causes included technical instability, user adoption barriers, and sustainability concerns. This document identifies risks and mitigation plans to prevent failure.

---

## Risk Summary

| Category | Count | Details |
|----------|-------|---------|
| **Tigers** | 12 | Launch-Blocking: 5 | Fast-Follow: 4 | Track: 3 |
| **Paper Tigers** | 4 | Concerns that seem scary but are manageable |
| **Elephants** | 5 | Uncomfortable truths the team must discuss |

---

## Launch-Blocking Tigers

These risks MUST be mitigated before launch. Each one could cause complete failure.

| # | Risk | Likelihood | Impact | Mitigation | Owner | Deadline |
|---|------|-----------|--------|-----------|-------|----------|
| T1 | SSE 스트리밍 연결이 불안정하여 메시지가 중간에 끊김 | 높음 | 치명적 | E1 PoC 완료 후 재시험, 재시도 로직 구현, fallback으로 polling 마련 | Tech Lead | Week 1 |
| T2 | 데이터베이스가 미선정되어 대화 저장 기능 구현 불가 | 높음 | 치명적 | Week 1 내에 PostgreSQL + Prisma 결정, 스키마 설계 완료 | Tech Lead | Week 1 Day 3 |
| T3 | OpenRouter 무료 API 한도 초과로 서비스 중단 | 중간 | 치명적 | E2 실험 완료, Redis 기반 분산 rate limiting 구현, 예비 API 키 확보 | Tech Lead | Week 1 |
| T4 | JWT 토큰 보안 미흡으로 계정 탈취 발생 | 낮음 | 높음 | https-only cookie, short expiration (1h), refresh token rotation 구현 | Tech Lead | Week 2 |
| T5 | 4주 타임라인 불가능으로 출시 지연 | 높음 | 높음 | 우선순위 재조정, Phase 1 범위 축소 (대화 삭제 제외), 마일스톤 재설정 | Product Owner | Week 1 Day 1 |

**Decision**: 모든 Launch-Blocking Tiger가 완화될 때까지 출시를 미룹니다.

---

## Fast-Follow Tigers

These risks should be addressed within the first sprint post-launch. Not blocking, but urgent.

| # | Risk | Likelihood | Impact | Planned Response | Owner |
|---|------|-----------|--------|-----------------|-------|
| T6 | 회원가입 friction이 높아 가입 전환율이 10% 미만 | 높음 | 높음 | 가입 단계 축소 (이름 필드 제거), 소셜 로그인 우선순위 상향 (P0 → P1) | Product |
| T7 | 배포 후 실환경에서 예상치 못한 CORS/네트워크 이슈 | 중간 | 높음 | staging 환경 구축, canary 배포 전략, 모니터링 도구 (Sentry) 도입 | Tech Lead |
| T8 | OpenRouter 품질이 기대 미달으로 이탈률 80%+ | 중간 | 높음 | Week 1 내에 수동 품질 테스트 완료, 최소 2개 모델 비교, 유료 모델 혼합 계획 마련 | Product |
| T9 | 초기 100명 사용자 확보 실패 (마케팅 없이 입소문 불가) | 높음 | 높음 | 마케팅 채널 확보 (네이버 카페, 트위터, 디스코드), 베타 테스터 모집 | Product |

**Decision**: Sprint 1에서 이들 이슈를 처리하고 결과를 PRD에 반영합니다.

---

## Track Tigers

These risks should be monitored post-launch. They may trigger action if thresholds are crossed.

| # | Risk | Trigger Condition | Response Plan |
|---|------|------------------|---------------|
| T10 | OpenRouter가 무료 티어 정책 변경 | 공지사항 확인 또는 rate limit 50% 감소 시 | 유료 모델로 마이그레이션 또는 Anthropic API 직접 연동 |
| T11 | 비러클 성장으로 API 비용 폭증 | 월 1000달러 초과 시 | 사용량 hard cap 도입, 프리미엄 티어 출시 앞당김 |
| T12 | 경쟁사(ChatGPT 등)가 한국어 UI 출시 | 공지 시 | 우리만의 차별점(예: 특정 도메인 특화) 재정의 |

**Monitoring**: Weekly review in sprint retrospective.

---

## Paper Tigers

These concerns seem scary but are manageable. Don't let them block progress.

| # | Concern | Why It's a Paper Tiger | What Would Make It Real |
|---|----------|------------------------|------------------------|
| P1 | "한국 사용자는 웹보다 앱을 선호한다" | 2024-2025년 트렌드는 PWA로 앱 경험 제공 가능, 초기 MVP는 웹으로 충분 | 앱 스토어 출시 필요성이 명확해질 때 (요청 100+ 건) |
| P2 | "무료 AI 품질이 너무 낮아서 아무도 안 쓴다" | Gemma 2 9B, Llama 3.1 8B는 일상 대화에 충분한 품질, 사용자 기대치 조절 가능 | 한국어 벤치마크에서 점수가 30% 미만일 경우 |
| P3 | "shadcn/ui로 심플한 채팅 UI 구현이 어렵다" | shadcn는 완성된 컴포넌트 라이브러리, Tailwind CSS로 커스텀 용이 | 디자인 요구사항이 매우 특이할 때 |
| P4 | "Zustand로 전역 상태 관리가 복잡해질 것이다" | MVP에서는 auth state + conversations만 관리, 복잡도 낮음 | 실시간 협업 기능이 추가될 때 |

**Recommendation**: 걱정하지 말고 구현을 시작하세요. 필요하면 리팩토링합니다.

---

## Elephants in the Room

These are the uncomfortable truths nobody is discussing. We need to talk about them.

### E1: 리더십 공백
**현실**: PO, Tech Lead, Designer가 모두 "TBD"입니다. 누가 의사결정을 하나요?
**위험**: 4주 타임라인은 충분한 리더십이 있을 때만 가능합니다.
**제안**: Sprint 0에서 역할과 의사결정 권한을 명확히 정하세요. 최소한 Acting Tech Lead는 지정해야 합니다.
**대화 시작**: "이 프로젝트의 최종 의사결정자는 누구인가요?"

### E2: 비즈니스 모델 부재
**현실**: Phase 2 이후 수익화 계획이 없습니다. "데이터를 확보하여"는 구체적이지 않습니다.
**위험**: 투자자나 경영진이 "이걸로 돈을 어떻게 벌 건가요?"라고 묻는 순간 프로젝트가 중단될 수 있습니다.
**제안**: 최소한 개략적인 monetization roadmap이 필요합니다 (예: 월 1000명 달성 시 프리미엄 티어 고려).
**대화 시작**: "Phase 2의 수익화 옵션 3가지를 리스트업해볼까요?"

### E3: "입소문"만으로 100명 확보는 불가능
**현실**: "마케팅 없이 입소문 확산"은 fantasy입니다. ChatGPT와 Claude가 이미 시장을 장악했습니다.
**위험**: 출시 후 2주간 사용자가 10명도 안 되면 팀 사기가 떨어지고 프로젝트가 조용히 사라집니다.
**제안**: 최소한의 마케팅 계획이 필요합니다 (예: Hacker News posting, 네이버 카페 공유, 친구 10명 초대).
**대화 시작**: "초기 100명을 확보할 구체적인 액션 플랜을 만들까요?"

### E4: ChatGPT/Claude를 이기는 차별점이 없음
**현실**: "한국어 UI"만으로는 충분한 차별점이 아닙니다. ChatGPT도 한국어를 잘 합니다.
**위험**: "왜 이 서비스를 써야 하죠?"라는 질문에 답할 수 없으면 사용자는 떠납니다.
**제안**: 특정 use case에 특화하세요 (예: 코딩 질문专用, 한국 법률 상담, 블로그 글쓰기 도우미).
**대화 시작**: "ChatGPT가 못 하는 우리만의 한 가지는 무엇인가요?"

### E5: 4주 MVP는 번아웃 레시피
**현실**: 4주 만에 백엔드 + 프론트엔드 + 인프라 + QA를 완료하는 것은 풀타임 2인 이상이 필요합니다.
**위험**: 팀이 지치면 코드 품질이 떨어지고 기술 부채가 쌓입니다. 2달 뒤 리팩토링해야 할 수도 있습니다.
**제안**: 6-8주로 현실적으로 재조정하거나, 범위를 더 축소하세요 (사이드바 제외, 단일 대화만).
**대화 시작**: "우리의 인력 현실은 무엇이며, 현실적인 타임라인은 얼마인가요?"

---

## Go/No-Go Launch Checklist

**Pre-Launch (모두 Yes여야 출시)**:

- [ ] **T1**: SSE 스트리밍 10회 연속 성공 (E1 PoC)
- [ ] **T2**: 데이터베이스 선정 및 스키마 설계 완료
- [ ] **T3**: Rate limiting 테스트 통과 (E2)
- [ ] **T4**: JWT 보안 구현 완료 (code review)
- [ ] **T5**: 현실적인 타임라인과 범위로 재조정
- [ ] **E1**: 리더십 역할 할당
- [ ] **모니터링**: Sentry/Grafana 등 모니터링 도구 설치

**Week 1 Post-Launch (Fast-Follow)**:

- [ ] **T6**: 가입 전환율 측정, 20% 미만시 개선
- [ ] **T7**: staging 환경 구축
- [ ] **T8**: AI 품질 테스트 완료
- [ ] **T9**: 마케팅 채널 확보

**Ongoing Monitoring (Track Tigers)**:

- [ ] **T10**: OpenRouter 정책 변경 감시
- [ ] **T11**: 비용 모니터링 (월 $1,000 알림)
- [ ] **T12**: 경쟁사 동향 감시

---

## Updated Timeline (Realistic)

| 단계 | 기간 | 변경사항 |
|------|------|----------|
| Week 1 | 기술 리스크 검증 + 리더십 확정 | T1-T5, E1 완화 |
| Week 2 | 설계 + 인프라 | 데이터베이스, 모니터링 |
| Week 3-4 | MVP 구현 (백엔드) | Auth, Chat, History API |
| Week 5-6 | MVP 구현 (프론트엔드) | UI, 스트리밍 렌더링 |
| Week 7 | QA & 버그 수정 |  |
| Week 8 | 베타 출시 & Fast-Follow | T6-T9 해결 |
| Week 9-10 | 정식 출시 준비 | 마케팅, 문서 |

**총 10주 (6-8주가 현실적)**

---

## Risk Mitigation Progress Tracker

| Risk | Status | Last Updated | Notes |
|------|--------|--------------|-------|
| T1: SSE 안정성 | ⏳ 검증 중 |  | E1 PoC 진행 필요 |
| T2: 데이터베이스 | ❌ 미정 |  | Week 1 Day 3 마감 |
| T3: Rate Limiting | ⏳ 검증 중 |  | E2 실험 진행 필요 |
| T4: JWT 보안 | ⏳ 설계 중 |  | Week 2 마감 |
| T5: 타임라인 | ❌ 재조정 필요 |  | 4주 → 10주 권장 |
| E1: 리더십 | ❌ 미할당 |  | 즉시 필요 |
| E2: 비즈니스 모델 | ❌ 미정 |  | Phase 2 계획 필요 |
| E3: 마케팅 | ❌ 계획 없음 |  | 채널 확보 필요 |
| E4: 차별점 | ❌ 불분명 |  | use case 특화 필요 |

---

*이 문서는 프로젝트 진행에 따라 주간 업데이트됩니다. 새로운 리스크가 발견되면 즉시 추가하세요.*
