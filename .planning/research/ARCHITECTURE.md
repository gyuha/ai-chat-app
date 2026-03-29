# 아키텍처 연구

**도메인:** AI 채팅 웹 애플리케이션
**조사 일자:** 2026-03-29
**신뢰도:** MEDIUM

## 표준 아키텍처

### 시스템 개요

```
┌─────────────────────────────────────────────────────────────┐
│                     프레젠테이션 계층                         │
│                    (React Frontend)                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  채팅 UI    │  │  인증 UI    │  │  설정 UI    │         │
│  │  컴포넌트    │  │  컴포넌트    │  │  컴포넌트    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┴────────────────┘                 │
│                        ↓                                    │
├─────────────────────────────────────────────────────────────┤
│                     상태 관리 계층                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Zustand    │  │  TanStack   │  │  Router     │         │
│  │  (클라이언트  │  │  Query      │  │  (탐색 상태)  │         │
│  │   상태)      │  │  (서버 상태)  │  │             │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
├─────────┴────────────────┴────────────────┴─────────────────┤
│                        ↓                                    │
├─────────────────────────────────────────────────────────────┤
│                     API 계층                                 │
│                   (Axios 클라이언트)                          │
└─────────────────────────────────────────────────────────────┘
                         ↕ HTTP/SSE
┌─────────────────────────────────────────────────────────────┐
│                     백엔드 계층                               │
│                    (NestJS 서버)                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Auth       │  │  Chat       │  │  User       │         │
│  │  Module     │  │  Module     │  │  Module     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
├─────────┴────────────────┴────────────────┴─────────────────┤
│                     Guards & Middleware                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  JWT Auth   │  │  SSE        │  │  Error      │         │
│  │  Guard      │  │  Streaming  │  │  Handling   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                         ↕ Prisma Client
┌─────────────────────────────────────────────────────────────┐
│                     데이터 계층                               │
│                    (Prisma + SQLite)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  User       │  │  Chat       │  │  Message    │         │
│  │  테이블      │  │  테이블      │  │  테이블      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                         ↕ HTTP
┌─────────────────────────────────────────────────────────────┐
│                   외부 API 계층                                │
│                  (OpenRouter API)                            │
└─────────────────────────────────────────────────────────────┘
```

### 컴포넌트 책임

| 컴포넌트 | 책임 | 일반적 구현 |
|----------|------|-------------|
| **React UI** | 사용자 인터페이스 렌더링, 사용자 입력 처리 | shadcn/ui 컴포넌트, 폼 핸들러 |
| **Zustand Store** | 클라이언트 측 상태 (UI 상태, 로딩, 모달) | 작은 상태 스토어, 액션/게터 패턴 |
| **TanStack Query** | 서버 상태 (대화 목록, 메시지, 사용자 정보) | 쿼리 키, 뮤테이션, 캐싱 |
| **Axios 클라이언트** | HTTP 요청/응답, 인증 헤더, 인터셉터 | base URL, 요청/응답 인터셉터 |
| **NestJS Auth Module** | 인증 로직, JWT 발급/검증, 사용자 관리 | Passport 전략, JWT 서비스 |
| **NestJS Chat Module** | 채팅 로직, OpenRouter 프록시, SSE 스트리밍 | 컨트롤러, 서비스, SSE 이멘터 |
| **Prisma Client** | 데이터베이스 쿼리, 트랜잭션, 타입 안전성 | Prisma 클라이언트, 스키마 정의 |
| **SQLite DB** | 영구 저장소, 사용자/대화/메시지 데이터 | 단일 파일 데이터베이스 |

## 권장 프로젝트 구조

### 모노레포 구조

```
gsd-glm/
├── backend/                 # NestJS 백엔드
│   ├── prisma/
│   │   ├── schema.prisma   # 데이터베이스 스키마
│   │   └── migrations/      # 마이그레이션 파일
│   ├── src/
│   │   ├── auth/           # 인증 모듈
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/  # Passport 전략
│   │   │   ├── guards/      # JWT 가드
│   │   │   └── dto/         # 데이터 전송 객체
│   │   ├── chat/           # 채팅 모듈
│   │   │   ├── chat.module.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── dto/
│   │   │   └── streaming/   # SSE 스트리밍 로직
│   │   ├── users/          # 사용자 모듈
│   │   ├── common/         # 공유 모듈
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── interceptors/
│   │   │   └── pipes/
│   │   ├── config/         # 설정
│   │   └── main.ts         # 엔트리 포인트
│   ├── test/               # 테스트 파일
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── frontend/               # Vite + React 프론트엔드
│   ├── src/
│   │   ├── routes/         # TanStack Router 파일 기반 라우팅
│   │   │   ├── index.tsx
│   │   │   ├── __root.tsx
│   │   │   ├── chat.tsx
│   │   │   ├── auth.tsx
│   │   │   └── settings.tsx
│   │   ├── components/     # React 컴포넌트
│   │   │   ├── ui/         # shadcn/ui 컴포넌트
│   │   │   ├── chat/       # 채팅 관련 컴포넌트
│   │   │   ├── auth/       # 인증 관련 컴포넌트
│   │   │   └── layout/     # 레이아웃 컴포넌트
│   │   ├── stores/         # Zustand 스토어
│   │   │   ├── auth.ts
│   │   │   ├── chat.ts
│   │   │   └── chatList.ts
│   │   ├── lib/            # 유틸리티 및 설정
│   │   │   ├── api/        # API 클라이언트
│   │   │   │   ├── client.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── chat.ts
│   │   │   ├── query/      # TanStack Query 설정
│   │   │   └── utils.ts
│   │   ├── hooks/          # 커스텀 훅
│   │   │   ├── useChat.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useStreaming.ts
│   │   ├── types/          # TypeScript 타입
│   │   └── main.tsx        # 엔트리 포인트
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── .planning/              # 프로젝트 계획 문서
├── pnpm-workspace.yaml     # PNPM 워크스페이스 설정
└── package.json            # 루트 package.json
```

### 구조 근거

- **backend/auth/:** 인증 로직을 캡슐화하여 JWT 발급, 검증, Passport 전략을 관리
- **backend/chat/:** 채팅 핵심 로직과 OpenRouter 프록시, SSE 스트리밍을 담당
- **backend/common/:** 재사용 가능한 데코레이터, 필터, 인터셉터를 공유
- **frontend/routes/:** TanStack Router의 파일 기반 라우팅으로 URL과 컴포넌트를 연결
- **frontend/stores/:** Zustand로 클라이언트 상태를 중앙 집중식으로 관리
- **frontend/lib/api/:** API 호출을 캡슐화하여 axios 설정, 인터셉터, 타입 안전성 보장
- **frontend/hooks/:** 컴포넌트에서 상태 로직을 재사용 가능하게 분리

## 아키텍처 패턴

### 패턴 1: 모듈식 모노레포 (pnpm workspace)

**설명:** 프론트엔드와 백엔드를 별도 패키지로 관리하되, 공통 타입과 유틸리티를 공유
**사용 시기:** 풀스택 웹 애플리케이션에서 프론트엔드와 백엔드가 밀접하게 연결될 때
**트레이드오프:**
- 장점: 타입 공유, 통일된 개발 환경, 코드 재사용성
- 단점: 빌드 복잡도 증가, 패키지 관리 오버헤드

**예시:**
```yaml
# pnpm-workspace.yaml
packages:
  - 'backend'
  - 'frontend'
  - 'shared' # 선택사항: 공유 타입
```

### 패턴 2: NestJS 모듈 구조

**설명:** 기능별로 모듈을 분리하여 의존성 주입과 관심사 분리를 명확히 함
**사용 시기:** NestJS 애플리케이션에서 기능이 명확히 구분될 때
**트레이드오프:**
- 장점: 테스트 용이성, 코드 재사용성, 유지보수성
- 단점: 초기 설정 오버헤드, 과도한 추상화 가능성

**예시:**
```typescript
// chat.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [ChatController],
  providers: [ChatService, OpenRouterService],
  exports: [ChatService],
})
export class ChatModule {}
```

### 패턴 3: SSE 기반 스트리밍

**설명:** Server-Sent Events를 사용하여 AI 응답을 토큰 단위로 실시간 전송
**사용 시기:** 단방향 실시간 데이터 스트림이 필요할 때 (AI 응답, 알림)
**트레이드오프:**
- 장점: 구현 단순성, 브라우저 네이티브 지원, 자동 재연결
- 단점: 단방향 통신만 가능, 연결당 하나의 스트림

**예시:**
```typescript
// 백엔드: SSE 이멘터
@Sse('chat')
chatStream(@Query('chatId') chatId: string) {
  return observableFrom(asyncIterable* (
    this.openRouterService.streamResponse(chatId)
  ));
}

// 프론트엔드: EventSource 사용
const eventSource = new EventSource(`/api/chat/sse?chatId=${chatId}`);
eventSource.onmessage = (event) => {
  const token = JSON.parse(event.data);
  appendMessage(token);
};
```

### 패턴 4: 상태 관리 분리 (Zustand + TanStack Query)

**설명:** 클라이언트 상태(Zustand)와 서버 상태(TanStack Query)를 명확히 분리
**사용 시기:** 서버 데이터와 UI 상태가 혼재된 복잡한 애플리케이션
**트레이드오프:**
- 장점: 관심사 분리, 자동 캐싱 및 재검증, 타입 안전성
- 단점: 학습 곡선, 상태 동기화 복잡도

**예시:**
```typescript
// Zustand: 클라이언트 상태
interface ChatUIState {
  isInputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
}

// TanStack Query: 서버 상태
const useChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: ['chat', 'messages', chatId],
    queryFn: () => api.chat.getMessages(chatId),
  });
};
```

## 데이터 흐름

### 요청 흐름

```
[사용자 입력]
    ↓
[React 컴포넌트] → [Zustand 액션] → [UI 상태 업데이트]
    ↓
[TanStack Query 뮤테이션] → [Axios POST 요청]
    ↓
[NestJS 컨트롤러] → [Guard: JWT 검증] → [서비스 계층]
    ↓
[Prisma 쿼리] → [SQLite 저장] 및 [OpenRouter API 호출]
    ↓
[서비스 응답 변환] → [컨트롤러 응답]
    ↓
[Axios 응답] → [TanStack Query 캐시 업데이트] → [React 리렌더]
```

### 스트리밍 흐름 (SSE)

```
[사용자 메시지 전송]
    ↓
[POST /api/chat/stream]
    ↓
[NestJS ChatService] → [OpenRouter API]
    ↓
[OpenRouter 스트리밍 응답] → [SSE 이멘터]
    ↓
[클라이언트 EventSource] → [onmessage 이벤트]
    ↓
[Zustand 스토어 업데이트] → [React 컴포넌트 리렌더]
```

### 인증 흐름

```
[로그인 요청]
    ↓
[POST /api/auth/login]
    ↓
[NestJS AuthService] → [Prisma: 사용자 확인]
    ↓
[JWT 서명] → [토큰 반환]
    ↓
[클라이언트 저장소: localStorage] → [Axios 인터셉터]
    ↓
[모든 요청에 Authorization 헤더 추가] → [JwtAuthGuard 검증]
```

### 주요 데이터 흐름

1. **메시지 전송:** React 컴포넌트 → TanStack Mutation → Axios → NestJS → Prisma → SQLite
2. **스트리밍 응답:** OpenRouter → NestJS SSE 이멘터 → EventSource → Zustand → React
3. **대화 목록 조회:** React → TanStack Query → Axios → NestJS → Prisma → SQLite (캐시)
4. **인증 검증:** 모든 API 요청 → Axios 인터셉터 → JWT 헤더 → NestJS Guard → Prisma

## 확장성 고려사항

| 규모 | 아키텍처 조정 |
|------|----------------|
| 0-1K 사용자 | 단일 SQLite 인스턴스, 단일 NestJS 프로세스, Vite 개발 서버 |
| 1K-10K 사용자 | 연결 풀 최적화, Prisma 미들웨어 캐싱, CDN 배포, Redis 세션 저장소 |
| 10K-100K 사용자 | PostgreSQL 마이그레이션, 로드 밸런싱, 마이크로서비스 분리 (인증/채팅), SSE 연결 풀 |

### 확장성 우선순위

1. **첫 번째 병목점:** SQLite 동시성 제한 (쓰기 잠금)
   - 해결: PostgreSQL로 마이그레이션 또는 Prisma 연결 풀 최적화
2. **두 번째 병목점:** NestJS 단일 프로세스 메모리 제한
   - 해결: PM2 클러스터 모드 또는 Kubernetes 배포
3. **세 번째 병목점:** SSE 연결 수 제한
   - 해결: Redis Pub/Sub을 통한 다중 서버 SSE, 연결 풀 관리

## 안티 패턴

### 안티 패턴 1: 프론트엔드에서 OpenRouter API 직접 호출

**사람들이 하는 실수:** API 키를 프론트엔드 .env 파일에 저장하고 직접 호출
**왜 문제인가:** API 키가 브라우저에 노출되어 악용 가능
**대신 이렇게:** 백엔드 프록시를 통해 API 호출, 서버 측에서 API 키 관리

### 안티 패턴 2: 모든 상태를 Zustand에 저장

**사람들이 하는 실수:** 서버 데이터, UI 상태, 폼 데이터를 모두 Zustand에 저장
**왜 문제인가:** 서버 상태 동기화, 캐싱, 재검증 로직을 중복 구현해야 함
**대신 이렇게:** TanStack Query로 서버 상태 관리, Zustand는 순수 UI 상태만 담당

### 안티 패턴 3: 스트리밍 없이 전체 응답 대기

**사람들이 하는 실수:** AI API 호출 후 전체 응답이 올 때까지 로딩만 표시
**왜 문제인가:** 사용자 경험 저하, 응답 시간이 길어질 때 앱이 멈춘 것처럼 보임
**대신 이렇게:** SSE 또는 chunked transfer로 토큰 단위 스트리밍 구현

### 안티 패턴 4: Prisma를 전역 싱글톤으로 사용

**사람들이 하는 실수:** 모듈마다 새로운 PrismaClient 인스턴스 생성
**왜 문제인가:** 연결 수 초과, 메모리 누수, 성능 저하
**대신 이렇게:** NestJS PrismaService를 프로바이더로 등록하여 싱글톤 사용

### 안티 패턴 5: 인증 없는 채팅 엔드포인트

**사람들이 하는 실수:** 개발 편의성을 위해 인증을 생략했다가 운영에서도 그대로
**왜 문제인가:** 사용자 데이터 노출, 무단 사용 가능
**대신 이렇게:** JwtAuthGuard를 모든 채팅 엔드포인트에 적용, 개발 시에는 모의 인증 사용

## 통합 지점

### 외부 서비스

| 서비스 | 통합 패턴 | 주의사항 |
|---------|-----------|----------|
| **OpenRouter API** | HTTP POST + 스트리밍 응답 | API 키 보호, rate limiting, 에러 처리 |
| **NestJS Config** | ConfigModule (+ joi 환경변수 검증) | .env 파일 gitignore, 타입 안전한 설정 접근 |
| **Prisma** | PrismaService (싱글톤) | 마이그레이션 관리, 스키마 동기화 |

### 내부 경계

| 경계 | 통신 방식 | 고려사항 |
|------|-----------|----------|
| **Frontend ↔ Backend** | HTTP (REST) + SSE (스트리밍) | CORS 설정, 인증 헤더, 에러 형식 통일 |
| **Auth Module ↔ Chat Module** | 모듈 임포트 (의존성 주입) | 순환 의존 방지, 인가 로직 위임 |
| **Chat Module ↔ Prisma** | Prisma Client (직접) | 트랜잭션 범위, 에러 변환 |

### 빌드 순서 (종속성)

다음 순서로 구현 및 테스트를 권장합니다:

1. **Prisma 스키마 & 마이그레이션** → 데이터베이스 계층
2. **NestJS Auth Module** → 인증 서비스, JWT 발급/검증
3. **NestJS Chat Module** → 채팅 로직, OpenRouter 프록시
4. **Frontend API 레이어** → Axios 클라이언트, 인터셉터
5. **Frontend 상태 관리** → Zustand 스토어, TanStack Query 설정
6. **Frontend UI 컴포넌트** → shadcn/ui, 채팅 인터페이스
7. **스트리밍 구현** → SSE 이멘터, EventSource 연결

**근거:** 하위 계층(데이터, 서비스)이 먼저 안정되어야 상위 계층(UI, 상태)을 안정적으로 구현할 수 있습니다. 스트리밍은 복잡도가 높아 마지막에 구현하는 것을 권장합니다.

## 출처

**공식 문서 및 기술 참고자료:**
- NestJS SSE 공식 문서 (https://docs.nestjs.com/techniques/server-sent-events) - HIGH confidence
- Prisma 공식 문서 (https://www.prisma.io/docs) - HIGH confidence
- TanStack Query 공식 문서 (https://tanstack.com/query/latest) - HIGH confidence
- Zustand 공식 문서 (https://zustand-demo.pmnd.rs) - HIGH confidence
- shadcn/ui 공식 문서 (https://ui.shadcn.com) - HIGH confidence
- OpenRouter API 문서 (https://openrouter.ai/docs) - MEDIUM confidence

**아키텍처 패턴 참고자료:**
- NestJS 모듈 아키텍처 패턴 - HIGH confidence
- pnpm workspace 모노레포 패턴 - HIGH confidence
- SSE vs WebSocket 비교 분석 - MEDIUM confidence

**주의:** 웹 검색 도구의 rate limit으로 인해 일부 최신 정보를 확인하지 못했으나, 공식 문서와 입증된 아키텍처 패턴을 기반으로 작성되었습니다. 2026년 최신 트렌드를 반영하기 위해서는 추가 검증이 권장됩니다.

---
*AI 채팅 애플리케이션 아키텍처 연구*
*조사 일자: 2026-03-29*
