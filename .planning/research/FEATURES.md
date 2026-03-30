# Feature Research

**Domain:** 프론트엔드 전용 OpenRouter chat app
**Researched:** 2026-03-31
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| API key 입력/검증/저장 | 브라우저 직접 호출형 OpenRouter 앱의 시작점 | MEDIUM | 최초 진입, 설정 수정, 검증 실패 안내까지 포함 |
| 무료 모델 목록 조회 및 선택 | 사용자는 어떤 free model을 쓸지 바로 골라야 함 | MEDIUM | `GET /models`, free filter, 기본 모델 지정 필요 |
| 스트리밍 채팅 | ChatGPT 유사 UX의 기본 기대치 | HIGH | SSE 파싱, 토큰 단위 렌더링, Stop 동작 포함 |
| 대화 목록과 재진입 | 채팅 앱은 이전 대화 복귀가 자연스러운 기본 기능 | MEDIUM | 최신순 정렬, 제목 자동 생성, 선택/삭제 필요 |
| 로컬 영속 저장 | 새로고침 후 대화가 사라지면 제품 신뢰가 크게 떨어짐 | MEDIUM | Dexie schema, 대화/메시지/설정 분리 필요 |
| 모바일 대응 sidebar | 채팅 UI는 모바일 사용 비중도 높음 | MEDIUM | 데스크톱 고정 sidebar + 모바일 drawer 패턴 필요 |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| free model 전용 UX 최적화 | “무료 모델만 빠르게 써보는 앱”이라는 포지셔닝이 분명해짐 | MEDIUM | 유료 모델 배제, free badge, 기본 추천 모델 제공 |
| 한국어 UI 완성도 | 대상 사용자에게 즉시 친숙한 경험 제공 | LOW | 토스트, empty state, 설정 설명까지 한국어 일관성 중요 |
| 대화별 system prompt 관리 | 간단하지만 체감 품질이 큰 기능 | MEDIUM | 글로벌/대화별 우선순위 규칙 필요 |
| Markdown + 코드블록 가독성 | 개발자/파워유저 대상 체감 가치가 큼 | LOW | 코드 하이라이트와 긴 응답 가독성 최적화 |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| 사용자 계정/클라우드 동기화 | 여러 기기에서 이어서 쓰고 싶음 | 서버/인증/보안 범위가 급격히 커짐 | 로컬 전용 v1 + 나중에 별도 milestone |
| 멀티모달 파일 업로드 | “ChatGPT 같게” 보이기 쉬움 | 저장, 미리보기, provider 호환성, 비용 이슈가 큼 | 텍스트 채팅 v1에 집중 |
| 실시간 협업/공유 | 멋져 보이는 확장 기능 | 프론트엔드 전용 구조와 맞지 않고 핵심 가치와 거리가 있음 | 대화 export/import를 차기 검토 |

## Feature Dependencies

```text
API key 관리
    └──requires──> 모델 조회/검증
                         └──requires──> 채팅 요청

채팅 요청 ──requires──> 스트리밍 파서
채팅 요청 ──requires──> 로컬 persistence

대화 관리 ──enhances──> 채팅 요청
설정 관리 ──enhances──> 모델 선택, system prompt

클라우드 동기화 ──conflicts──> 프론트엔드 전용 v1 범위
```

### Dependency Notes

- **채팅은 API key 검증과 모델 조회 이후에만 자연스럽게 동작한다:** 잘못된 key 상태를 먼저 해결해야 하기 때문
- **대화 저장은 스트리밍과 함께 설계되어야 한다:** 응답 완료 전/후 저장 타이밍이 UX와 데이터 무결성에 영향을 준다
- **설정 관리는 모델 선택과 system prompt UX를 강화한다:** 기본값/대화별 설정이 서로 연결된다
- **클라우드 기능은 프론트엔드 전용 구조와 충돌한다:** 인증/백엔드가 필요해지므로 v1 범위에서 제외해야 한다

## MVP Definition

### Launch With (v1)

- [ ] API key 등록/검증/수정/삭제 — 제품 진입의 필수 전제
- [ ] 무료 모델 목록 조회 및 선택 — OpenRouter free value proposition의 핵심
- [ ] 스트리밍 채팅과 Stop 버튼 — ChatGPT 유사 UX 검증에 필수
- [ ] 대화 목록/새 대화/삭제/재진입 — 실사용 가능한 채팅 앱 최소 조건
- [ ] Dexie 기반 로컬 저장 — 새로고침 이후에도 기록이 유지되어야 함
- [ ] 한국어 UI + 다크모드 + 반응형 — 타깃 사용자 경험 완성도 확보

### Add After Validation (v1.x)

- [ ] 대화 제목 편집 고도화 — 기본 흐름이 안정화된 뒤 polish 용도
- [ ] 모델 추천/최근 사용 모델 UX — free model 사용 패턴이 쌓였을 때 추가 가치 큼
- [ ] export/import — 로컬 사용성이 검증된 뒤 보강 기능으로 추가 가능

### Future Consideration (v2+)

- [ ] 유료 모델 지원 — 과금/사용량/설정 복잡도가 커서 후순위
- [ ] 멀티모달 입력 — provider 지원 편차와 UI 복잡도가 큼
- [ ] 사용자 인증/동기화 — 프론트엔드 전용 범위를 넘어서는 확장

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| API key 관리 | HIGH | MEDIUM | P1 |
| 무료 모델 선택 | HIGH | MEDIUM | P1 |
| 스트리밍 채팅 | HIGH | HIGH | P1 |
| 대화 관리 sidebar | HIGH | MEDIUM | P1 |
| Dexie persistence | HIGH | MEDIUM | P1 |
| Markdown rendering | MEDIUM | LOW | P2 |
| system prompt 설정 | MEDIUM | MEDIUM | P2 |
| export/import | MEDIUM | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| 스트리밍 응답 | ChatGPT 스타일의 실시간 토큰 렌더링 | 경량 AI chat 앱들도 기본 제공 | 실시간 토큰 렌더링 + Stop 버튼을 v1 기본으로 포함 |
| 대화 목록 | 좌측 sidebar 기반 히스토리 | 모바일에서는 drawer로 축소 | 동일한 mental model 유지, 모바일은 Sheet로 전환 |
| 모델 선택 | 일부 앱은 provider/model selector 제공 | 일부 앱은 고정 모델만 제공 | free model 전용 선택 UX로 단순화 |

## Sources

- `PROMPT.md` — 프로젝트 범위와 요구사항
- https://openrouter.ai/docs/guides/routing/routers/free-models-router — free model UX/동작 방식 참고
- https://openrouter.ai/docs/api/reference/streaming — 스트리밍 UX의 기본 기대치 검증
- https://github.com/josephgodwinkimani/openrouter-web — 브라우저 기반 OpenRouter 채팅 앱 예시

---
*Feature research for: frontend-only OpenRouter chat app*
*Researched: 2026-03-31*
