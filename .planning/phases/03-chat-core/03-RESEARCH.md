# Phase 03: 채팅 핵심 - 연구 문서

**작성일:** 2026-03-29
**상태:** 계획 준비 완료

## 연구 목적

Phase 03(채팅 핵심) 구현을 위해 필요한 기술적 사전 지식, 기존 코드베이스 패턴, OpenRouter 통합 방법론, 그리고 잠재적 위험 요소를 체계적으로 조사한다.

## 기존 자산 분석

### 재사용 가능한 백엔드 패턴

**PrismaService (Global Module)**
- 파일: `backend/src/prisma/prisma.service.ts`
- 패턴: `@Global()` 데코레이터로 전역 주입 가능
- Prisma v7 library 엔진 + better-sqlite3 adapter 사용
- ChatModule에서 직접 주입받아 사용 가능

**NestJS 모듈 구조 (AuthModule 참고)**
- 파일: `backend/src/auth/`
- Controller → Service → PrismaService 계층 구조
- DTO: `class-validator` 데코레이터로 유효성 검증 (`@IsEmail()`, `@IsString()`, `@MinLength()`)
- Guard: `JwtAuthGuard`로 모든 라우트 보호 (이미 전역 적용됨)

**Prisma 스키마 (이미 정의됨)**
```prisma
model Chat {
  id           String    @id @default(uuid())
  title        String?
  userId       String
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages     Message[]
  systemPrompt String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Message {
  id        String   @id @default(uuid())
  content   String
  role      String
  chatId    String
  chat      Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

**필요한 수정사항:**
- `Message` 모델에 `status` 필드 추가 (`streaming` | `completed` | `stopped` | `error`)
- 마이그레이션 필요: `npx prisma migrate dev --name add_message_status`

### 재사용 가능한 프론트엔드 패턴

**API 클라이언트 구조**
- 파일: `frontend/src/lib/api/`
- `client.ts`: Axios 인스턴스 (Vite 프록시로 `/api` → `localhost:3000` 자동 라우팅)
- `types.ts`: TypeScript 타입 정의
- `auth.ts`: API 함수 그룹화 패턴 (`chat.ts`, `message.ts` 추가 예정)

**Zustand 스토어 패턴 (auth.ts 참고)**
- `persist` 미들웨어로 상태 유지
- `partialize`로 민감 데이터 제외 (액세스 토큰은 메모리에만)
- 타입 안전한 상태 관리

**TanStack Router 패턴**
- 파일 기반 라우팅 (`src/routes/`)
- `beforeLoad`로 인증 가드
- `createFileRoute`로 라우트 생성

## OpenRouter 스트리밍 통합

### SSE/스트리밍 아키텍처

**OpenRouter API 호환성:**
- OpenAI SDK와 호환 (openai 라이브러리 v4.77.3 사용)
- `stream: true` 옵션으로 Server-Sent Events (SSE) 응답
- 응답 형식: `data: {"choices":[{"delta":{"content":"..."}}]}`

**백엔드 구현 전략:**

1. **OpenRouterService (새 모듈)**
   - OpenAI SDK 클라이언트 초기화 (API 키는 환경변수에서)
   - `streamChat(messages, model, abortSignal)` 메서드
   - `AbortController`로 클라이언트 연결 해제 시 요청 취소

2. **ChatController 스트리밍 엔드포인트**
   - `POST /api/chats/:id/messages` → 스트리밍 응답
   - NestJS `@Sse()` 데코레이터 대신 직접 스트림 핸들링
   - Response 객체에 직접 쓰기: `res.write()`로 청크 전송

3. **프론트엔드 스트리밍 클라이언트**
   - `fetch()` API + `ReadableStream` (EventSource 대신 POST 본문 필요)
   - `TextDecoder`로 바이너리 → 텍스트 변환
   - SSE 파서: `data:` 접두사 제거, `[DONE]` 감지
   - AbortController로 Stop 기능 구현

### SSE 파싱 상세

**형식:**
```
data: {"id":"chat-1","choices":[{"delta":{"content":"Hello"}}]}

data: {"id":"chat-2","choices":[{"delta":{"content":" World"}}]}

data: [DONE]
```

**파싱 로직 (의사코드):**
```typescript
const lines = chunk.split('\n');
for (const line of lines) {
  if (line.startsWith('data: ')) {
    const data = line.slice(6);
    if (data === '[DONE]') return;
    const json = JSON.parse(data);
    const content = json.choices[0]?.delta?.content;
    if (content) emit(content);
  }
}
```

## 상태 관리 설계

### Zustand 스토어 구조

**chatStore (새 파일)**
```typescript
interface ChatState {
  currentChat: Chat | null;
  messages: Message[];
  streamingMessage: string | null; // 스트리밍 중인 내용
  isStreaming: boolean;
  error: string | null;

  // 액션
  setCurrentChat: (chat: Chat) => void;
  addMessage: (message: Message) => void;
  updateStreamingMessage: (chunk: string) => void;
  stopStreaming: () => void;
  regenerateLast: () => void;
  clearError: () => void;
}
```

**chatListStore (새 파일)**
```typescript
interface ChatListState {
  chats: Chat[];
  isLoading: boolean;

  loadChats: () => Promise<void>;
  createChat: (title?: string) => Promise<Chat>;
  deleteChat: (id: string) => Promise<void>;
}
```

### TanStack Query 활용

- `useQuery`: 대화 목록 조회, 메시지 로드 (자동 캐싱)
- `useMutation`: 대화 생성, 삭제 (낙관적 업데이트)
- 스트리밍은 Zustand에서 관리 (TanStack Query는 실시간 상태에 비적합)

## UI 구조 설계

### 레이아웃 (Phase 3 최소 구현)

**2단 구조:**
```
┌─────────────────┬─────────────────────────┐
│                 │                         │
│  Sidebar        │  Main Chat Area         │
│  (260px fixed)  │  (flex-1)               │
│                 │                         │
│  - New Chat     │  - Messages List        │
│  - Chat List    │  - Input Area           │
│  - Logout       │  - Stop/Regenerate      │
│                 │                         │
└─────────────────┴─────────────────────────┘
```

**컴포넌트 구조:**
- `ChatLayout`: 루트 레이아웃 컴포넌트
- `ChatSidebar`: 대화 목록 + 새 대화 버튼
- `ChatMain`: 메시지 목록 + 입력 영역
- `MessageItem`: 단일 메시지 (role별 스타일)
- `ChatInput`: 멀티라인 입력창 (기본 텍스트영역, 자동 높이는 Phase 4)

### 라우팅 설계

```
/ → 최근 대화 또는 빈 화면
/chat/:id → 특정 대화
/new → 새 대화 생성 후 리다이렉트
```

## 기술적 위험 요소

### 1. 스트리밍 연결 누수

**문제:** 클라이언트 연결 해제 시 백엔드 HTTP 요청이 계속 진행
**해결:**
- 클라이언트: `AbortController.abort()` 호출
- 백엔드: `req.on('close')` 이벤트 리스너로 연결 해제 감지
- OpenAI SDK: `abortSignal` 옵션 전달

### 2. 메시지 상태 불일치

**문제:** 스트리밍 중단 시 메시지가 `streaming` 상태로 남음
**해결:**
- Prisma `Message.status` 필드 도입
- 중단 시 `stopped` 상태로 업데이트
- 완료 시 `completed`로 업데이트
- 에러 시 `error` 상태로 업데이트

### 3. JWT 토큰 만료 후 스트리밍 중단

**문제:** 15분 액세스 토큰 만료 시 스트리밍 중 401 에러
**해결:**
- 스트리밍 시작 전 토큰 만료 시간 확인
- 만료 5분 전 자동 갱신 (Axios 인터셉터 이미 처리)
- 스트리밍 중 401 에러 시 사용자에게 알림 + 재시도 버튼

### 4. OpenRouter Rate Limiting

**문제:** HTTP 429 에러 처리 누락 시 사용자 경험 저하
**해결:**
- OpenRouterService에서 429 감지
- `Retry-After` 헤더 파싱
- 사용자 친화적 메시지: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
- 재시도 버튼 표시

### 5. SSE 파싱 오류

**문제:** 청크 경계에서 JSON 불완전
**해결:**
- 불완전한 라인 버퍼링
- JSON 파싱 실패 시 다음 청크에서 이어서 시도
- `try-catch`로 파싱 에러 처리

## 구현 우선순위

### Wave 1: 백엔드 기초 (03-01)
1. Prisma 마이그레이션 (`status` 필드 추가)
2. ChatModule 생성 (ChatService, ChatController)
3. OpenRouterService 생성 (OpenAI SDK 연동)
4. 대화 CRUD API (`POST /api/chats`, `GET /api/chats`, `DELETE /api/chats/:id`)

### Wave 2: 스트리밍 핵심 (03-02)
1. 메시지 전송 API + 스트리밍 (`POST /api/chats/:id/messages`)
2. 프론트엔드 스트리밍 클라이언트 (fetch + ReadableStream)
3. SSE 파서 구현
4. AbortController로 Stop 기능

### Wave 3: 프론트엔드 UI (03-03)
1. ChatLayout + ChatSidebar + ChatMain
2. chatStore + chatListStore
3. 메시지 표시 (사용자/AI 구분)
4. ChatInput + 전송 기능

### Wave 4: 고급 기능 (03-04)
1. Regenerate 기능
2. 대화 제목 자동 생성 (백그라운드)
3. 시스템 프롬프트 설정
4. Rate limit 에러 처리

## 의존성 추가 필요사항

### 백엔드
- `openai`: ^4.77.3 (이미 CLAUDE.md에 명시됨)
- 환경변수: `OPENROUTER_API_KEY`

### 프론트엔드
- 새로운 의존성 없음 (기존 라이브러리로 충분)
- 선택사항: `lucide-react` (아이콘, Phase 4)

## 검증 기준

### 기능적 요구사항
- [ ] CHAT-01: SSE 기반 토큰 단위 스트리밍
- [ ] CHAT-02: Stop generating 기능
- [ ] CHAT-03: Regenerate 기능
- [ ] CHAT-04: 대화별 시스템 프롬프트
- [ ] CONV-01~04: 대화 CRUD + 자동 제목 생성

### 비기능적 요구사항
- [ ] BACK-01: OpenRouter 프록시 (API 키 보호)
- [ ] BACK-02: 모델 allowlist
- [ ] BACK-03: Rate limit 에러 처리
- [ ] BACK-05: 토큰 단위 응답 전달

## 참조 자산

### 기존 코드 (읽기 필수)
- `backend/src/auth/`: 인증 패턴 참조
- `frontend/src/stores/auth.ts`: Zustand 패턴
- `frontend/src/lib/api/`: API 클라이언트 구조
- `backend/prisma/schema.prisma`: 데이터 모델

### 외부 문서 (읽기 권장)
- OpenRouter 공식 문서: https://openrouter.ai/docs (웹 검색 제한으로 확인 불가, 구현 시 참조 필요)
- OpenAI SDK 스트리밍 문서
- NestJS HTTP 스트리밍 가이드
- ReadableStream API (MDN)

---

**다음 단계:** `/gsd:plan-phase 3`으로 상세 계획 수립
