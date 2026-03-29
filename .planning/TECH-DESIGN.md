# 기술 설계: OpenRouter Free Chat Web App

## 1. 아키텍처 요약

권장안은 `pnpm workspace` 기반 모노레포다. 프론트엔드는 React SPA로 채팅 UX와 라우팅을 담당하고, 백엔드는 NestJS API로 OpenRouter 프록시, 모델 allowlist, 스트리밍 중계, 대화 저장소 추상화를 담당한다. 프론트는 절대 OpenRouter를 직접 호출하지 않는다.

## 2. 모노레포 및 명령 체계

### 추천 구조

```text
apps/
  web/
  server/
packages/
  contracts/
  config/
pnpm-workspace.yaml
package.json
biome.json
.env.example
```

### 선택 이유

- 프론트/백엔드/공통 타입을 한 PR에서 바꾸기 쉽다
- 로컬 개발 명령을 단순하게 유지할 수 있다
- 추후 배포를 분리하더라도 코드 조직이 깨지지 않는다

### Turborepo 사용 여부

- 권장: `pnpm workspace`는 즉시 사용
- 보류: `turbo`는 초기 MVP에는 필수 아님
- 기준: CI 캐시와 병렬 빌드가 실제로 필요해질 때 추가

### 루트 명령 제안

- `pnpm install`: 전체 의존성 설치
- `pnpm dev`: web + server 동시 실행
- `pnpm dev:web`: web만 실행
- `pnpm dev:server`: server만 실행
- `pnpm build`: 전체 빌드
- `pnpm lint`: Biome lint
- `pnpm format`: Biome format
- `pnpm typecheck`: 전체 타입 검사
- `pnpm test`: 전체 테스트

## 3. 프론트엔드 구조

### 앱 선택

- `Vite + React + TypeScript`
- 이유: SPA 중심 대화 앱에 적합하고 TanStack Router와 조합이 가볍다

### 폴더 구조

```text
apps/web/src/
  app/
    providers/
    router.tsx
  routes/
    __root.tsx
    index.tsx
    chat/
      $chatId.tsx
    settings.tsx
  components/
    ui/
    shell/
    chat/
    feedback/
  features/
    chats/
    composer/
    settings/
    models/
  lib/
    api/
    stream/
    markdown/
    utils/
  store/
    ui/
  hooks/
  styles/
  types/
```

### 라우팅 구조

- `/`:
  - 대화가 있으면 마지막 대화로 이동
  - 없으면 빈 상태 화면
- `/chat/$chatId`:
  - 실제 채팅 화면
- `/settings`:
  - 독립 페이지 또는 다이얼로그 fallback

### 프론트 라이브러리 권장

- UI: `shadcn/ui`, `lucide-react`
- 서버 상태: `@tanstack/react-query`
- 라우팅: `@tanstack/react-router`
- UI 상태: `zustand`
- Markdown: `react-markdown`, `remark-gfm`
- 코드 하이라이트: `rehype-highlight` 또는 `rehype-pretty-code`
- 유틸: `clsx`, `tailwind-merge`, `class-variance-authority`

## 4. 백엔드 구조

### 폴더 구조

```text
apps/server/src/
  main.ts
  app.module.ts
  config/
    env.schema.ts
    app.config.ts
  common/
    dto/
    filters/
    interceptors/
    pipes/
    utils/
  modules/
    health/
    models/
      dto/
      models.controller.ts
      models.service.ts
      models.module.ts
    chats/
      dto/
      entities/
      chats.controller.ts
      chats.service.ts
      chats.module.ts
      chats.repository.ts
    streaming/
      dto/
      streaming.controller.ts
      streaming.service.ts
      streaming.module.ts
  infrastructure/
    openrouter/
      openrouter.client.ts
      openrouter.mapper.ts
    storage/
      file-chat.repository.ts
      memory-chat.repository.ts
```

### NestJS 책임 분리

- `Controller`: 요청/응답, validation, status code
- `Service`: 비즈니스 규칙, 제목 생성, regenerate 흐름
- `Repository`: 대화 저장 추상화
- `Infrastructure/OpenRouter`: 외부 API 포맷 처리, 에러 매핑, abort 전달

## 5. 공통 타입 및 env 전략

### 공통 타입

- `packages/contracts`에 아래만 둔다
  - `ChatSummary`
  - `ChatDetail`
  - `ChatMessage`
  - `ChatSettings`
  - `ModelOption`
  - `StreamEvent`
- 서버 DTO class는 백엔드 내부에 둔다
- 프론트는 `contracts` 타입을 기준으로 API 응답을 소비한다

### 환경변수

- 루트 `.env.example`: 전체 샘플
- `apps/server/.env`: 서버 비밀값
- `apps/web/.env`: 공개 가능한 프론트 설정만 허용

필수 서버 env:

- `OPENROUTER_API_KEY`
- `OPENROUTER_BASE_URL` 기본값 제공
- `OPENROUTER_MODEL_ALLOWLIST`
- `PORT`
- `CHAT_STORAGE_MODE=file|memory`
- `CHAT_STORAGE_DIR=./data/chats`

## 6. API 설계

### REST / Streaming 초안

#### `GET /api/v1/health`

- 서버 상태 확인

#### `GET /api/v1/models`

- 서버 allowlist 기준 사용 가능한 모델 목록 반환

#### `GET /api/v1/chats`

- 대화 목록 반환
- 정렬: 최근 업데이트 순

#### `POST /api/v1/chats`

- 새 대화 생성
- 기본 settings 포함 가능

#### `GET /api/v1/chats/:chatId`

- 대화 상세와 메시지 목록 반환

#### `PATCH /api/v1/chats/:chatId/settings`

- 모델, 시스템 프롬프트, 제목 잠금 여부 등 업데이트

#### `DELETE /api/v1/chats/:chatId`

- 대화 삭제

#### `POST /api/v1/chats/:chatId/messages/stream`

- 사용자 메시지 추가 + assistant 응답 스트리밍
- 응답 타입: `text/event-stream`
- 클라이언트는 fetch 기반 SSE 파서 사용

#### `POST /api/v1/chats/:chatId/regenerate/stream`

- 마지막 assistant 응답 regenerate
- 직전 user turn을 재사용

### 스트림 이벤트 표준

```text
event: meta
event: message:start
event: message:delta
event: message:done
event: title
event: error
event: heartbeat
```

## 7. 상태관리 설계

### TanStack Query 책임

- 모델 목록 조회
- 대화 목록 조회
- 대화 상세 조회
- 새 채팅/삭제/설정 저장 mutation
- 스트리밍 도중 query cache의 메시지 목록 patch

### Zustand 책임

- 사이드바 열림/접힘
- 모바일 시트 상태
- chat별 composer draft
- 전송 중 abort controller 참조
- local UI flags:
  - settings dialog open
  - delete dialog target
  - auto-scroll lock

### URL 책임

- 현재 chat 선택 상태는 router param으로 관리
- 마지막 진입 채팅 복원은 라우팅 레벨 처리

## 8. 스트리밍 처리 방식

### 서버

1. 요청 DTO validation
2. chat 존재/모델 allowlist 확인
3. user message 저장
4. OpenRouter streaming request 시작
5. chunk 수신 후 내부 이벤트로 정규화
6. assistant 임시 메시지 누적
7. 완료 시 assistant 메시지 저장
8. 첫 턴이면 제목 자동 생성 시도

### 클라이언트

1. submit 시 user message를 낙관적으로 렌더링
2. placeholder assistant 메시지 생성
3. `message:delta`마다 동일 메시지 content patch
4. `message:done`에서 최종 상태 commit
5. abort 시 상태를 `stopped`로 표시

### Stop Generating

- 브라우저 `AbortController`로 요청 중단
- 서버는 OpenRouter upstream fetch abort
- 부분 응답은 남기되 상태는 `stopped`

## 9. 에러 처리 전략

### 사용자 메시지 변환 규칙

- `401/403`: 서버 설정 문제입니다. 관리자에게 문의하세요.
- `429`: 현재 요청이 많습니다. 잠시 후 다시 시도해 주세요.
- `5xx`: 일시적인 서버 문제입니다. 다시 시도해 주세요.
- 업스트림 timeout: 응답이 지연되고 있습니다. 다시 시도해 주세요.
- allowlist 차단: 현재 선택한 모델은 사용할 수 없습니다.

### UI 표시 위치

- 전역 장애: top inline banner
- 전송 실패: composer 상단 inline error
- 메시지 단위 실패: assistant bubble 하단 retry affordance

## 10. 보안 체크리스트

- [ ] OpenRouter key는 서버 env에만 존재
- [ ] 프론트 빌드 산출물에 key 문자열이 포함되지 않음
- [ ] 서버는 allowlist 밖 모델 요청을 거부
- [ ] DTO validation으로 입력 길이와 필수값 검증
- [ ] 시스템 프롬프트 길이 제한 적용
- [ ] rate limit 적용
- [ ] 서버 로그에 API key, 전체 사용자 프롬프트 원문을 무분별하게 남기지 않음
- [ ] CORS 정책을 명시
- [ ] 예외 응답에서 내부 스택 트레이스 비노출

## 11. 배포 고려사항

- 프론트: 정적 호스팅 가능
- 백엔드: Node 런타임 필요
- 프록시/배포 환경에서 SSE timeout 값을 확인해야 한다
- 저장소가 file 모드면 writable volume 필요
- 이후 PostgreSQL 도입 시 repository adapter만 교체 가능하게 유지
