# Pitfalls Research

**Domain:** 프론트엔드 전용 OpenRouter chat app
**Researched:** 2026-03-31
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: 브라우저 노출 API key를 안전하다고 착각

**What goes wrong:** API key를 코드나 localStorage에 무방비로 저장하고 배포해 의도치 않은 노출 위험을 만든다.

**Why it happens:** 프론트엔드 전용 구조라서 보안 경계를 과소평가하기 쉽다.

**How to avoid:** 키는 사용자가 직접 입력하고, 저장 위치/위험을 명확히 안내하며, 앱 코드에 기본 키를 절대 포함하지 않는다.

**Warning signs:** 샘플 키 하드코딩, 공개 저장소에 `.env` 대체값 추가, localStorage 영구 저장을 기본 선택으로 두는 경우.

**Phase to address:** Phase 1 (설정 / API key flow)

---

### Pitfall 2: 스트리밍 응답을 한 번에 처리하려고 함

**What goes wrong:** SSE chunk를 누적하지 못하고 전체 응답 완료 후 한 번에 렌더링해 ChatGPT 유사 UX가 무너진다.

**Why it happens:** 일반 JSON 응답 처리 방식으로 구현을 시작하기 쉽기 때문이다.

**How to avoid:** `ReadableStream` + `TextDecoder` + line buffer 기반 파서를 먼저 설계하고, placeholder assistant message 누적 업데이트 패턴을 사용한다.

**Warning signs:** `await response.json()` 사용, Stop 버튼이 없거나 눌러도 아무 변화가 없는 경우.

**Phase to address:** Phase 3 (chat streaming)

---

### Pitfall 3: free model 필터 규칙이 drift 됨

**What goes wrong:** 초기엔 무료였던 모델 목록을 고정값으로 넣어두고, 실제 `/models` 결과와 앱 표시가 어긋난다.

**Why it happens:** 개발 초기에 하드코딩이 편하기 때문이다.

**How to avoid:** 항상 `/api/v1/models` 결과를 기준으로 free 여부를 계산하고, 캐시 만료 정책을 둔다.

**Warning signs:** 모델 목록이 문서와 다르거나, 실제 요청에서 과금/미지원 오류가 나는 경우.

**Phase to address:** Phase 2 (models and validation)

---

### Pitfall 4: IndexedDB schema를 너무 늦게 구조화

**What goes wrong:** settings, conversations, messages 경계를 늦게 나눠 저장 구조 변경 비용이 커진다.

**Why it happens:** MVP에서 저장소 설계를 단순화하려는 유혹이 크기 때문이다.

**How to avoid:** 초기에 Dexie schema와 인덱스를 정의하고, `updatedAt`, `conversationId` 같은 조회 패턴을 먼저 반영한다.

**Warning signs:** 메시지 저장/조회 코드가 화면 로직 안에 섞이기 시작하는 경우.

**Phase to address:** Phase 1~2 (persistence foundation)

---

### Pitfall 5: Markdown 렌더링을 무방비로 넣음

**What goes wrong:** assistant 응답이 길거나 코드 블록이 많을 때 렌더링 품질이 떨어지고, unsafe HTML 처리 위험을 키운다.

**Why it happens:** 단순 텍스트 출력으로 먼저 구현한 뒤 확장하면서 plugin 구성이 늦어진다.

**How to avoid:** `react-markdown` + 필요한 plugin만 명시적으로 구성하고, raw HTML 허용 여부를 보수적으로 유지한다.

**Warning signs:** 코드 블록이 깨지거나, 긴 응답에서 레이아웃 overflow가 발생하는 경우.

**Phase to address:** Phase 3~4 (message rendering polish)

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| 모델 목록 하드코딩 | 개발 초기에 빠름 | 모델 drift, 잘못된 free 표시 | 초기 spike에서만 잠깐 |
| localStorage로 임시 저장 | 구현 간단 | 검색/정렬/크기 제한/이관 비용 큼 | 거의 never |
| 컴포넌트 내부 직접 fetch | 빠르게 보이는 데모 제작 | 중복 헤더/에러 처리/테스트 어려움 | 1회성 실험까지 |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| OpenRouter Models API | free 모델을 문서 예시로만 고정 | `/models` 응답과 `pricing` 기준으로 계산 |
| OpenRouter Chat API | stream 응답을 일반 JSON처럼 처리 | SSE 파서와 AbortController를 함께 설계 |
| Dexie | schema/version 계획 없이 시작 | 초기에 테이블과 인덱스 전략부터 명시 |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 긴 대화 전체 재렌더링 | 스크롤 끊김, 입력 지연 | message list 분리, virtualization 여지 확보 | 대화 길이가 길어질 때 |
| 과도한 모델 재조회 | 설정/채팅 진입마다 로딩 표시 | TanStack Query staleTime 설정 | 모델 화면 방문이 잦을 때 |
| Markdown 과렌더링 | 긴 코드 응답에서 FPS 저하 | renderer 분리, memoization 고려 | 긴 응답/모바일 기기 |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| API key 하드코딩 | 키 유출 및 오용 | 사용자 입력 기반, 코드 저장 금지 |
| key 저장 위험 미고지 | 사용자가 로컬 보안 리스크를 모름 | 설정 화면과 초기 입력 단계에서 경고 |
| raw HTML 허용 Markdown | XSS/렌더링 위험 | 보수적 markdown config 유지 |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Stop 버튼 무동작 | 스트리밍 제어 불신 | AbortController 취소를 실제 연결 |
| 빈 상태가 설명 부족 | 첫 사용자가 막힘 | 모델 선택/키 등록 안내를 명확히 제공 |
| 모바일 sidebar 전환 불편 | 좁은 화면에서 탐색 어려움 | Sheet/drawer 패턴 사용 |

## "Looks Done But Isn't" Checklist

- [ ] **API key flow:** 검증 실패/만료/빈 값 상태가 모두 처리되는지 확인
- [ ] **Models:** 실제 free filter와 UI badge가 일치하는지 확인
- [ ] **Streaming:** Stop 후 추가 chunk가 append 되지 않는지 확인
- [ ] **Persistence:** 새로고침 후 대화 목록과 현재 대화 복원이 되는지 확인
- [ ] **Responsive UI:** 모바일에서 sidebar, composer, 메시지 영역이 모두 usable 한지 확인

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| API key 저장 설계 오류 | MEDIUM | storage 전략 재정의, 마이그레이션/삭제 유도, 안내문 보강 |
| stream 파서 오류 | MEDIUM | parser를 line-buffer 방식으로 재구성, Stop/에러 케이스 테스트 |
| Dexie schema 부족 | HIGH | version bump, migration 추가, 조회 로직 정리 |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| API key 노출 착각 | Phase 1 | 하드코딩 key가 없는지, 위험 안내가 있는지 확인 |
| free model drift | Phase 2 | `/models` 응답 기준 필터 테스트 |
| stream 처리 오류 | Phase 3 | chunk 누적/Stop 동작 수동 검증 |
| Dexie schema 부실 | Phase 1~2 | 대화 생성/삭제/복원 흐름 점검 |
| Markdown 안전성 문제 | Phase 4 | 코드블록/긴 응답/unsafe HTML 처리 점검 |

## Sources

- `PROMPT.md` — 프로젝트 요구사항 및 범위
- https://openrouter.ai/docs/api/reference/streaming — 스트리밍 관련 gotcha 확인
- https://openrouter.ai/docs/guides/routing/routers/free-models-router — free model routing 확인
- https://github.com/josephgodwinkimani/openrouter-web — 브라우저 기반 구현 참고

---
*Pitfalls research for: frontend-only OpenRouter chat app*
*Researched: 2026-03-31*
