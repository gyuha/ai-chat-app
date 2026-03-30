
#  프롬프트

```
OpenRouter의 무료 api를 이용한 웹 채팅 어플리케이션을 제작 하려고 함. 
UI는 챕GPT와 유사한 모양으로 만들어 줘.

프론트만 있는 프로젝트 이고 기술 스택은 아래와 같음
    - react
    - pnpm
    - biome
    - typescript
    - shadcn ui 
    - zustand
    - tanstack-query
    - tanstack-router

API 키를 이용해서 서버와 채팅을 하고 데이터는 IndexedDB 에 저장 해 줘

get-shit-done(https://github.com/gsd-build/get-shit-done)를 사용 하려고 하고,
/gsd:new-project를 할 때 필요한 프롬프트를 만들어 주세요.
```

# 프롬프트 입력

$gsd-new-project 이후 아래 내용 붙여 넣기

```
프로젝트명: OpenRouter Chat

## 한 줄 요약
OpenRouter 무료 모델을 활용한 ChatGPT 스타일의 웹 AI 채팅 애플리케이션 (프론트엔드 전용, 서버 없음)

## 프로젝트 설명
사용자가 자신의 OpenRouter API 키를 등록하면, OpenRouter에서 제공하는 무료 LLM들과 대화할 수 있는 웹 채팅 앱이다.
백엔드 서버 없이 브라우저에서 직접 OpenRouter API를 호출하고, 모든 데이터(대화, 설정)는 IndexedDB에 저장한다.
UI는 ChatGPT와 유사한 레이아웃(좌측 사이드바 + 우측 채팅 영역)으로 구성한다.

## 확정된 기술 스택
- Language: TypeScript (strict mode)
- Framework: React 19 + Vite
- Package Manager: pnpm
- Linter/Formatter: Biome (ESLint/Prettier 대체)
- UI: shadcn/ui + Tailwind CSS v4
- State: Zustand (클라이언트 전역 상태)
- Server State / 캐싱: TanStack Query v5
- Routing: TanStack Router (파일 기반 라우팅)
- IndexedDB ORM: Dexie.js v4
- Markdown 렌더링: react-markdown + remark-gfm + rehype-highlight (코드 하이라이팅)
- HTTP: 내장 fetch API (OpenRouter는 OpenAI 호환이므로 별도 SDK 불필요)

## 핵심 기능

### 1. API 키 관리
- 최초 진입 시 API 키 입력 화면 표시
- IndexedDB의 settings 테이블에 저장
- 설정 페이지에서 변경/삭제 가능
- 키 유효성 검증: GET /api/v1/models 호출하여 확인

### 2. 무료 모델 선택
- OpenRouter Models API(GET https://openrouter.ai/api/v1/models)에서 모델 목록 조회
- 무료 모델 필터링 조건: pricing.prompt === "0" && pricing.completion === "0"
- TanStack Query로 캐싱 (staleTime: 10분)
- 대화별로 모델 선택 가능
- 기본 모델 설정 기능 (settings에 저장)

### 3. 채팅 (ChatGPT 스타일 UI)
- POST https://openrouter.ai/api/v1/chat/completions (OpenAI 호환 포맷)
- 필수 헤더: Authorization: Bearer <KEY>, HTTP-Referer, X-OpenRouter-Title
- stream: true 로 SSE 스트리밍 응답 지원
- 응답을 실시간으로 토큰 단위 렌더링
- 어시스턴트 응답은 Markdown 렌더링 (코드블록 하이라이팅 포함)
- 메시지 전송 중 로딩 인디케이터
- 스트리밍 중 Stop 버튼으로 중단 가능 (AbortController)
- 시스템 프롬프트 설정 기능 (대화별 또는 글로벌)

### 4. 대화 관리 (사이드바)
- ChatGPT와 동일한 좌측 사이드바 레이아웃
- "새 대화" 버튼
- 대화 목록 (최신순, updatedAt 기준)
- 대화 제목: 첫 메시지 기반 자동 생성 또는 수동 편집
- 대화 삭제 (확인 다이얼로그)
- 모바일에서 사이드바 토글 (Sheet/Drawer)

### 5. 데이터 저장 (IndexedDB via Dexie.js)
- DB명: openrouter-chat-db
- 테이블 스키마:
  - settings: key(PK), value
  - conversations: id(PK, uuid), title, modelId, systemPrompt, createdAt, updatedAt
  - messages: id(PK, uuid), conversationId(indexed), role('user'|'assistant'|'system'), content, createdAt

## UI/UX 상세 (ChatGPT 유사 레이아웃)

### 전체 레이아웃
- 좌측: 사이드바 (280px, 접기 가능)
  - 상단: 앱 로고/이름 + 새 대화 버튼
  - 중간: 대화 목록 (스크롤 가능)
  - 하단: 설정 링크
- 우측: 채팅 영역
  - 상단 헤더: 현재 대화 제목 + 모델 선택 드롭다운
  - 중간: 메시지 목록 (스크롤, 하단 자동 스크롤)
  - 하단: 메시지 입력 영역 (Textarea + 전송 버튼)

### 빈 상태
- 대화가 없을 때: 환영 메시지 + 모델 선택 안내
- API 키 미등록 시: 키 입력 안내 카드

### 반응형
- 데스크톱(>1024px): 사이드바 고정
- 태블릿/모바일(<1024px): 사이드바 숨김, 햄버거 메뉴로 토글

### 테마
- shadcn/ui 기본 다크/라이트 모드 지원
- 시스템 테마 감지 후 수동 전환 가능

## 라우트 구조 (TanStack Router)
- / : 메인 (새 대화 또는 빈 상태)
- /chat/$conversationId : 특정 대화
- /settings : API 키 관리, 기본 모델 설정, 시스템 프롬프트, 테마

## OpenRouter API 상세
- Base URL: https://openrouter.ai/api/v1
- 인증: Authorization: Bearer <API_KEY>
- 모델 목록: GET /models → data[] 배열, pricing.prompt === "0" 으로 무료 필터
- 채팅: POST /chat/completions
  - body: { model, messages: [{role, content}], stream: true }
  - 스트리밍 응답: text/event-stream, data: {choices:[{delta:{content}}]} 형식
  - 종료: data: [DONE]
- 무료 모델 ID 예시: meta-llama/llama-3.3-70b-instruct:free, openrouter/free
- 무료 모델 Rate Limit: 약 20req/min, 200req/day

## 비기능 요구사항
- 한국어 UI (버튼, 레이블, 안내 문구 모두 한국어)
- 다크모드 기본 활성
- 반응형 디자인 (모바일 ~ 데스크톱)
- 접근성: shadcn/ui 기본 a11y 준수
- 에러 처리: API 오류 시 토스트 알림, Rate limit 초과 안내
- 빌드 결과물은 정적 파일 (Vercel, Netlify 등 정적 호스팅 배포 가능)

## v1 범위 밖 (향후 고려)
- PWA / 오프라인 지원
- 대화 내보내기/가져오기 (JSON)
- 유료 모델 지원 및 토큰 사용량 추적
- 이미지/파일 첨부 (멀티모달)
- 다국어 지원 (i18n)
- 사용자 인증/클라우드 동기화

## 프로젝트 초기화 (참고)
pnpm create vite@latest openrouter-chat --template react-ts
```
