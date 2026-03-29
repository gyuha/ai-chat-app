# Feature Research

**Domain:** AI Chat Web Application (OpenRouter 기반)
**Researched:** 2026-03-29
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 스트리밍 응답 (토큰 단위) | ChatGPT/Claude 표준 — 완성된 응답 대기는 불편 | HIGH | SSE 또는 chunked transfer, scroll management 필수 |
| 대화 목록 (사이드바) | 이전 대화 접근은 기본 기능 | MEDIUM | 생성/삭제/제목 표시, 최근 순 정렬 |
| 마크다운 렌더링 | 코드/포맷팅 없는 텍스트만 표시하면 부족함 | MEDIUM | 코드 블록 문법 하이라이팅, 표/목록 지원 |
| 응답 복사 버튼 | 사용자가 응답을 재사용함 | LOW | 클립보드 복사, 성공 피드백 |
| 다크 모드 | 채팅 앱 표준 (눈의 피로 감소) | MEDIUM | 시스템 설정 감지 또는 토글 버튼 |
| Stop generating | 긴 응답 중단 필요 | LOW | 스트림 취소 API 연동 |
| 메시지 입력 (textarea) | 자동 높이 조절, Enter 전송 | LOW | Shift+Enter 줄바꿈 |
| 로딩 상태 표시 | "생각 중" 피드백 | LOW | 타이핑 인디케이터 또는 스켈레톤 |
| 에러 표시 및 재시도 | API 실패는 빈번함 | MEDIUM | 사용자 친화적 메시지, 재시도 버튼 |
| 반응형 레이아웃 | 모바일 사용 필수 | MEDIUM | 사이드바 접기/펴기, 모바일 최적화 |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 모델 전환 (Model Switching) | OpenRouter 다양한 모델 탐색 | MEDIUM | 서버 allowlist, 클라이언트 선택 UI |
| 시스템 프롬프트 설정 | 모델 동작 커스터마이즈 | LOW | 대화별 컨텍스트 설정 |
| 코드 블록 언어 감지 | 자동 하이라이팅 향상 | LOW | markdown 파싱 시 감지 |
| 대화 제목 자동 생성 | 목록 가독성 향상 | MEDIUM | 첫 메시지로 요약 생성 |
| 응답 재생성 (Regenerate) | 같은 질문으로 다른 답변 | LOW | 마지막 메시지 재전송 |
| 빈 상태 UX | 신규 사용자 온보딩 | LOW | 추천 프롬프트 또는 빈 메시지 안내 |
| 토큰 사용량 시각화 | API 사용량 투명성 | MEDIUM | 메시지별 토큰 수 (OpenRouter 제공 시) |
| 키보드 단축키 | 파워 유저 경험 | MEDIUM | Cmd+K 새 대화, Cmd+/ 단축키 목록 |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| 실시간 다자 채팅 (WebSocket) | "협업"처럼 보임 | 복잡도 폭증, 단일 사용자 채팅과 경쟁 | 단일 사용자 경험에 집중 |
| 파일 업로드/이미지 분석 | 멀티모달 표준 | v1 범위 초과, OpenRouter 무료 모델 한계 | 텍스트 채팅 완성 후 검토 |
| 음성 입력/출력 | "모바일 친화적" | 브라우저 호환성, API 비용 | 텍스트 인터페이스 마스터 |
| 소셜 로그인 (OAuth) | "간편한 가입" | v1 범위, 제공자 관리 복잡도 | 이메일/비밀번호로 시작 |
| 커스텀 모델 파인튜닝 | "나만의 AI" | OpenRouter 제공 모델 사용 중점 | 시스템 프롬프트로 동작 제어 |
| 결제/구독 시스템 | "유료 모델 사용" | 무료 모델 v1 목적과 상충 | 무료 모델로 제품 가치 검증 |

## Feature Dependencies

```
[스트리밍 응답]
    └──requires──> [SSE/Chunked transfer backend]
        └──requires──> [토큰 단위 렌더링]
            └──enhances──> [Stop generating]

[대화 관리]
    └──requires──> [인증 (JWT)]
        └──requires──> [User 모델]
            └──requires──> [Prisma schema]

[마크다운 렌더링]
    └──enhances──> [코드 블록 복사 버튼]
    └──enhances──> [코드 블록 언어 감지]

[모델 전환]
    └──requires──> [OpenRouter API 통합]
        └──requires──> [서버 allowlist 관리]

[대화 제목 자동 생성]
    └──requires──> [첫 메시지 요약 API]
```

### Dependency Notes

- **스트리밍 응답 requires SSE/Chunked transfer backend:** 백엔드에서 OpenRouter 스트리밍을 클라이언트로 전달하는 프록시가 필요
- **Stop generating enhances 스트리밍 응답:** 스트림 취소는 UX 필수 요소, 스트리밍이 없으면 의미 없음
- **대화 관리 requires 인증:** 사용자별 대화 분리를 위해 JWT 기반 세션 필수
- **모델 전환 requires OpenRouter API 통합:** 모델 리스트 조회 및 선택 UI 필요
- **대화 제목 자동 생성 requires 첫 메시지 요약 API:** 첫 번째 사용자 메시지로 요약 생성, v1.1에서 고려

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] 인증 (이메일/비밀번호 회원가입, 로그인) — 사용자별 대화 분리
- [ ] 스트리밍 응답 (토큰 단위) — 핵심 사용자 경험
- [ ] 대화 생성, 목록 조회, 삭제 — 기본 대화 관리
- [ ] 마크다운 렌더링 (코드 블록 포함) — 응답 가독성
- [ ] Stop generating — 스트림 제어
- [ ] 다크 모드 우선 UI — 채팅 앱 표준
- [ ] 반응형 레이아웃 — 모바일 지원
- [ ] 에러 표시 및 재시도 — API 안정성 대응

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] 모델 전환 — OpenRouter 모델 탐색 경험
- [ ] 시스템 프롬프트 설정 — 모델 동작 커스터마이즈
- [ ] 대화 제목 자동 생성 — 목록 가독성 향상
- [ ] 응답 재생성 (Regenerate) — 같은 질문으로 다른 답변
- [ ] 코드 블록 복사 버튼 — 사용자 편의성
- [ ] 빈 상태 UX — 신규 사용자 온보딩

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] 토큰 사용량 시각화 — 사용량 투명성 (OpenRouter API 지원 의존)
- [ ] 키보드 단축키 — 파워 유저 경험
- [ ] 소셜 로그인 (OAuth) — 가입 장벽 하향
- [ ] 파일 업로드/이미지 분석 — 멀티모달 지원 (유료 모델 필요 시)
- [ ] 음성 입력/출력 — 모바일 경험 강화

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 스트리밍 응답 | HIGH | HIGH | P1 |
| 인증 (이메일/비밀번호) | HIGH | MEDIUM | P1 |
| 대화 관리 (생성/목록/삭제) | HIGH | MEDIUM | P1 |
| 마크다운 렌더링 | HIGH | MEDIUM | P1 |
| Stop generating | MEDIUM | LOW | P1 |
| 다크 모드 | MEDIUM | MEDIUM | P1 |
| 반응형 레이아웃 | HIGH | MEDIUM | P1 |
| 에러 표시 및 재시도 | HIGH | MEDIUM | P1 |
| 모델 전환 | MEDIUM | MEDIUM | P2 |
| 시스템 프롬프트 설정 | MEDIUM | LOW | P2 |
| 대화 제목 자동 생성 | MEDIUM | MEDIUM | P2 |
| 응답 재생성 | LOW | LOW | P2 |
| 코드 블록 복사 버튼 | MEDIUM | LOW | P2 |
| 빈 상태 UX | LOW | LOW | P2 |
| 토큰 사용량 시각화 | LOW | MEDIUM | P3 |
| 키보드 단축키 | LOW | MEDIUM | P3 |
| 소셜 로그인 | MEDIUM | HIGH | P3 |
| 파일 업로드/이미지 분석 | HIGH | HIGH | P3 |
| 음성 입력/출력 | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | ChatGPT | Claude | Our Approach |
|---------|---------|--------|--------------|
| 스트리밍 응답 | ✓ 토큰 단위 | ✓ 토큰 단위 | ✓ SSE 기반 스트리밍 (P1) |
| 대화 관리 | ✓ 폴더/아카이빙 | ✓ 프로젝트 | ✓ 기본 생성/삭제 (P1), 폴더는 P3 |
| 마크다운 렌더링 | ✓ 코드 하이라이팅 | ✓ Artifacts | ✓ 기본 마크다운 (P1), 하이라이팅 (P2) |
| Stop generating | ✓ 버튼 | ✓ 버튼 | ✓ 스트림 취소 (P1) |
| 모델 전환 | ✓ GPT-3.5/4 | ✓ Claude 3/3.5 | ✓ OpenRouter 모델 선택 (P2) |
| 시스템 프롬프트 | ✓ Custom Instructions | ✓ Custom | ✓ 대화별 설정 (P2) |
| 파일 업로드 | ✓ 이미지/PDF | ✓ 이미지 | ✗ v1에서 제외 (P3) |
| 음성 입력 | ✓ 모바일 | ✗ | ✗ v1에서 제외 (P3) |
| 다크 모드 | ✓ | ✓ | ✓ 다크 모드 우선 (P1) |
| 반응형 | ✓ | ✓ | ✓ 모바일 최적화 (P1) |

## Streaming UX Patterns

### Visual Feedback During Streaming

1. **텍스트 스트리밍 시작 전**: 타이핑 인디케이터 또는 "생각 중" 상태
2. **스트리밍 중**: 토큰 단위 텍스트 추가, 끝에 커서 깜빡임
3. **완료 후**: 커서 제거, 마지막 토큰 렌더링 완료

### Scroll Management

1. **자동 스크롤**: 새 토큰 도착 시 하단으로 자동 스크롤
2. **수동 스크롤 방지**: 사용자가 위로 스크롤 시 자동 스크롤 일시 중지
3. **하단 이동 버튼**: 사용자가 위로 스크롤 시 "아래로 이동" 버튼 표시

### Stop/Interruption Controls

1. **Stop generating 버튼**: 스트리밍 중 표시, 클릭 시 스트림 취소
2. **재시도 옵션**: 중단된 응답에 대해 "재생성" 버튼 제공
3. **그레이스풀 핸들링**: 중단 시 부분 응답 보존

## Conversational UI Patterns

### Message Input

1. **Textarea 자동 높이**: 내용에 따라 높이 자동 조절 (최대 높이 제한)
2. **Enter 전송**: 단일 Enter로 전송, Shift+Enter로 줄바꿈
3. **전송 버튼**: 비활성화 (빈 입력) → 활성화 (텍스트 입력)
4. **플레이스홀더**: "OpenRouter AI에게 질문하세요..."

### Message Display

1. **사용자 메시지**: 오른쪽 정렬, 배경색 구분
2. **AI 메시지**: 왼쪽 정렬, 아바타 또는 아이콘
3. **시간 표시**: 메시지 위 또는 아래에 타임스탬프 (선택)
4. **마크다운 렌더링**: AI 메시지만 (사용자는 일반 텍스트)

### Chat Management

1. **사이드바**: 대화 목록, 새 대화 버튼, 설정 액세스
2. **대화 제목**: 자동 생성 또는 사용자 편집 가능
3. **대화 삭제**: 휴지통 또는 즉시 삭제 (확인 다이얼로그)
4. **대화 전환**: 클릭으로 대화 로드

## Model Switching Considerations

### Server-Side

1. **Allowlist 관리**: 사용 가능한 모델 ID 목록 (환경변수 또는 DB)
2. **모델 메타데이터**: 모델 이름, 설명, 컨텍스트 길이
3. **기본 모델**: 새 대화 시 기본 선택

### Client-Side

1. **모델 선택 UI**: 드롭다운 또는 설정 패널
2. **현재 모델 표시**: 대화 중 모델 이름 표시
3. **대화별 모델**: 각 대화는 독립적인 모델 설정

### UX Patterns

1. **모델 전환 시점**: 새 대화 생성 시 또는 대화 중
2. **전환 확인**: 대화 중 전환 시 사용자 확인 (기존 컨텍스트 초기화 경고)
3. **모델 정보**: 모델 선택 시 간단한 설명 또는 링크

## Sources

**Confidence: MEDIUM** — Web search tools were rate-limited during research. Findings are based on:

1. **Project Documentation** — `.planning/PROJECT.md` (validated requirements, out of scope decisions)
2. **Professional Knowledge** — AI chat application patterns, streaming UX best practices, conversational UI standards
3. **Competitor Analysis** — ChatGPT, Claude interface patterns (general knowledge)
4. **Tech Stack Context** — NestJS, React, OpenRouter constraints from project setup

**Limitations:**
- Could not verify latest 2026 trends via web search (rate limit)
- Source citations not available for web-based research
- Some features may need validation against current OpenRouter API capabilities

**Validation Flags:**
- OpenRouter 모델 스위칭 API 지원 확인 필요
- OpenRouter 토큰 사용량 메타데이터 확인 필요
- SSE vs WebSocket for streaming tradeoffs 확인 필요

---
*Feature research for: OpenRouter Free Chat Web App*
*Researched: 2026-03-29*
