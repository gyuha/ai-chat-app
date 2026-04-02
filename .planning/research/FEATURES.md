# Feature Landscape

**Domain:** AI Chat Web Application (OpenRouter-powered)
**Researched:** 2026-04-02
**Confidence:** MEDIUM (based on established UI patterns; web search unavailable for verification)

## Overview

이 문서는 OpenRouter 무료 API 기반 웹 채팅 앱의 기능 분야를 정리합니다. ChatGPT, Claude, Gemini 웹 인터페이스의 일반적 패턴과 무료/로컬-first 특성을 고려한 분석입니다.

---

## Table Stakes

사용자가 기대하는 기본 기능. 없으면 제품이 incomplete하게 느껴짐.

| Feature | 이유 | 복잡도 | 비고 |
|---------|------|--------|------|
| API Key 입력/저장 | 서비스 접근의 유일한 수단 | Low | 유효성 검사 포함 |
| 대화방 목록 (CRUD) | 대화 관리의 기본 | Low | 생성, 선택, 삭제 |
| 메시지 입력창 | 핵심 인터랙션 | Low | Enter로 전송 |
| AI 응답 스트리밍 | 실시간 피드백, ChatGPT 경험 | Medium | SSE 기반 |
| 무료 모델 선택기 | OpenRouter 무료 모델 목록 | Low | 드롭다운 |
| localStorage 저장 | 세션 유지, 영속성 | Low | 대화, 설정 저장 |
| 메시지 영역 스크롤 | 대화 이력 탐색 | Low | 자동 스크롤 (최신) |

### Table Stakes 상세

**1. API Key 입력/저장**
- 입력 폼 + "연결" 버튼
- localStorage에 저장 (보안 주의: 평문存储이므로 경고 표시)
- 유효성 검사: API 호출로 검증
- 재입력 필요시 수정 가능

**2. 대화방 목록 (CRUD)**
- 사이드바에 대화방 나열
- 생성: "새 대화" 버튼
- 선택: 클릭으로 대화 전환
- 삭제: 휴지통 아이콘 또는 우클릭 메뉴
- 대화방 이름: 첫 사용자 메시지 또는 "새 대화" 기본값

**3. 메시지 입력창**
- 텍스트area (자동 높이 조절)
- Enter: 전송 / Shift+Enter: 줄바꿈
- 빈 입력 방지
- 전송 중 비활성화 (중복 전송 방지)

**4. AI 응답 스트리밍**
- SSE (Server-Sent Events) 또는 fetch stream
- 토큰 단위 실시간 표시
- 타이핑 효과와 유사한 UX
- 응답 완료 전 취소 버튼

**5. 무료 모델 선택기**
- OpenRouter 무료 모델 목록 표시
- 현재 선택 상태 저장
- 모델별 특성 설명 (能力/제한)

**6. localStorage 저장**
- 저장 대상: 대화内容, API Key, 선택된 모델, UI 설정
- 키 구조: `chat_rooms`, `api_key`, `selected_model`
- 용량 고려: 큰 대화는 trimming

**7. 메시지 영역 스크롤**
- 자동 스크롤: 새 메시지 시 하단으로
- 상단 스크롤: 이전 대화 확인
- 로딩 상태 표시

---

## Differentiators

경쟁 제품을 차별화하는 기능. 선택적으로 구현.

| Feature | 가치 제안 | 복잡도 | 비고 |
|---------|----------|--------|------|
| 대화 검색 | 과거 대화 내용 검색 | Medium | regex 또는 키워드 |
| 대화 공유 | 대화를 export/share | Low | JSON, Markdown |
| Markdown 렌더링 | 코드 블록, 리스트 등 | Low | marked.js 등 |
| 코드 블록 복사 | 개발자 경험 향상 | Low | 버튼 추가 |
| 토큰/비용 표시 | 사용량 투명성 | Low | OpenRouter API 응답 활용 |
| Dark/Light 테마 | 사용자 선호 대응 | Low | CSS variable |
| 키보드 단축키 | 고급 사용자 생산성 | Low | Cmd+K 등 |
| 대화 내비게이션 | 빠르게 이전 대화로 | Low | 단축키 지원 |
| 타이핑 인디케이터 | AI 처리 중 상태 표시 | Low | "응답 중..." 텍스트 |

### Differentiators 상세

**1. 대화 검색**
- 사이드바 상단 검색창
- 현재 대화 또는 전체 대화 대상
- 실시간 필터링
- 검색어 하이라이트

**2. 대화 공유/Export**
- 현재 대화 Markdown으로 복사
- JSON export (전체 메타데이터 포함)
- Shareable link (서버 없이? → 불가능, localStorage만)

**3. Markdown 렌더링**
- 메시지에서 Markdown 구문 해석
- 코드 블록: syntax highlighting (Prism.js)
- 인라인 코드: backtick 스타일
- 테이블, 리스트, 인용구

**4. 코드 블록 복사 버튼**
- 코드 우측 상단에 "Copy" 버튼
- 클립보드 복사 후 "Copied!" 피드백
- 토스트 또는 툴팁

**5. 토큰/비용 표시**
- OpenRouter 응답에서 usage 정보 추출
- 요청/응답 토큰 수 표시
- 누적 비용 추정 (선택적)

**6. Dark/Light 테마**
- 시스템 설정 따르기 (prefers-color-scheme)
- 수동 토글
- localStorage 저장

**7. 키보드 단축키**
- `Cmd/Ctrl + Enter`: 메시지 전송
- `Cmd/Ctrl + N`: 새 대화
- `Cmd/Ctrl + K`: 대화 검색
- `Escape`: 입력 취소

**8. 대화 내비게이션**
- 상단 화살표: 이전 메시지 편집
- `Cmd/Ctrl + ]` / `[`: 대화 간 이동

**9. 타이핑 인디케이터**
- AI 응답 시작 전 "생각 중..." 표시
- 3점 애니메이션 또는 타이핑 커서

---

## Anti-Features

构建하지 않을 기능. 명시적으로 제외.

| Anti-Feature | 이유 | 대안 |
|--------------|------|------|
| 사용자 인증/로그인 | 프로젝트 범위 밖 | API Key로 개별 식별 |
| 클라우드 동기화 | 서버 없음, 범위 밖 | - |
| 모바일 네이티브 앱 | React SPA 범위 | PWA로 확장 가능 (미래) |
| 유료 모델 지원 | 무료 모델만 대상 | - |
| 다중 모델 비교 뷰 | 복잡도 증가 | 하나의 모델 선택에 집중 |
| 실시간 협업 | 범위 밖 | - |
| 플러그인/마켓플레이스 | 범위 밖 | - |
| 파일 첨부 (이미지/문서) | 무료 모델 제한, 범위 밖 | - |
| TTS/음성 입력 | 범위 밖 | - |

---

## Feature Dependencies

```
API Key 저장
    └── API 유효성 검사 → 에러 표시

대화방 목록
    └── 대화 선택 → 메시지 로드
    └── 대화 삭제 → localStorage 업데이트

메시지 입력
    └── 스트리밍 요청 → SSE 수신 → 토큰 렌더링
    └── 응답 완료 → 저장

모델 선택
    └── 선택 변경 → 이후 요청에 적용

Markdown 렌더링
    └── 메시지 표시 → Markdown 파싱 → HTML 렌더링
```

---

## MVP Recommendation

### 반드시 구현 (Phase 1)
1. API Key 입력 + 저장 + 유효성 검사
2. 대화방 CRUD (sidebar)
3. 메시지 입력 + 전송
4. AI 응답 스트리밍 (SSE)
5. 무료 모델 선택
6. localStorage 영속성

### Phase 2 (차별화 시작)
1. Markdown 렌더링 (코드 블록 포함)
2. Dark/Light 테마
3. 대화 검색
4. 키보드 단축키

### Phase 3 (완성도 향상)
1. 코드 복사 버튼
2. 토큰/비용 표시
3. 대화 Export (Markdown)
4. 타이핑 인디케이터 커스터마이즈

---

## Defer (Anti-Features 또는 복잡도 높음)
- **파일 첨부**: 무료 모델의 Vision 제한, 구현 복잡도 높음
- **다중 모델 비교**: Phase 1 범위 초과
- **클라우드 동기화**: 서버 아키텍처 필요
- **모바일 앱**: 별도 프로젝트

---

## Sources

- ChatGPT web interface patterns (training data)
- Claude web interface patterns (training data)
- OpenRouter API documentation (training data)
- Common SPA chat application patterns (training data)

**Note:** Web search unavailable at time of research. Confidence MEDIUM - based on established product patterns from major AI chat interfaces.
