# 아키텍처 패턴

**도메인:** 프론트엔드 전용 AI 채팅 앱
**연구일:** 2026-03-30
**확신 수준:** MEDIUM

## 권장 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                      │
│                   (React Components + shadcn/ui)                 │
├─────────────────────────────────────────────────────────────────┤
│  View Components  │  Layout Components  │  UI Primitives        │
├─────────────────────────────────────────────────────────────────┤
│                         State Management                        │
│                  (Zustand + TanStack Query)                      │
├─────────────────────────────────────────────────────────────────┤
│  Client State (Zustand)  │  Server State (TanStack Query)        │
├─────────────────────────────────────────────────────────────────┤
│                          Business Logic                         │
│                       (Service Layer)                            │
├─────────────────────────────────────────────────────────────────┤
│  ChatService  │  ModelService  │  StorageService  │  StreamService│
├─────────────────────────────────────────────────────────────────┤
│                          Data Layer                             │
│                      (Dexie.js + IndexedDB)                     │
├─────────────────────────────────────────────────────────────────┤
│                          External APIs                          │
│                      (OpenRouter API)                           │
└─────────────────────────────────────────────────────────────────┘
```

## 컴포넌트 경계

### 레이어별 책임 분리

| 컴포넌트 | 책임 | 통신 대상 |
|---------|------|-----------|
| **View Components** | UI 렌더링, 사용자 입력 처리 | Layout Components, Zustand Store |
| **Layout Components** | 라우트 구조, 공통 레이아웃 제공 | View Components, TanStack Router |
| **Zustand Store** | 클라이언트 전역 상태 (UI 상태, 사용자 설정) | View Components, Service Layer |
| **TanStack Query** | 서버 상태 관리 (API 호출, 캐싱, 동기화) | OpenRouter API, Service Layer |
| **Service Layer** | 비즈니스 로직, 데이터 변환, 외부 API 호출 | Zustand, TanStack Query, Dexie.js |
| **Dexie.js** | 영구 저장소, CRUD 연산 | Service Layer |

### 주요 컴포넌트 상세

#### 1. Presentation Layer

**View Components**
```
src/features/
├── chat/
│   ├── components/
│   │   ├── MessageList.tsx          # 메시지 목록 렌더링
│   │   ├── MessageBubble.tsx        # 개별 메시지 버블
│   │   ├── ChatInput.tsx            # 입력 영역
│   │   ├── StreamingText.tsx        # 스트리밍 텍스트 애니메이션
│   │   └── StopButton.tsx           # 스트리밍 중단 버튼
│   └── hooks/
│       └── useChatStream.ts         # SSE 스트리밍 로직
├── conversations/
│   ├── components/
│   │   ├── ConversationList.tsx     # 대화 목록
│   │   ├── ConversationItem.tsx     # 개별 대화 아이템
│   │   └── NewChatButton.tsx        # 새 대화 버튼
│   └── hooks/
│       └── useConversations.ts      # 대화 CRUD
├── settings/
│   ├── components/
│   │   ├── ApiKeyInput.tsx          # API 키 입력
│   │   ├── ModelSelector.tsx        # 모델 선택
│   │   └── ThemeToggle.tsx          # 테마 전환
│   └── hooks/
│       └── useSettings.ts           # 설정 관리
└── markdown/
    └── components/
        ├── MarkdownRenderer.tsx     # react-markdown 래퍼
        └── CodeBlock.tsx            # 코드블록 + 복사 버튼
```

**Layout Components**
```
src/layouts/
├── RootLayout.tsx                   # 루트 레이아웃 (다크모드 제공자)
├── ChatLayout.tsx                   # 채팅 레이아웃 (사이드바 + 메인)
└── SettingsLayout.tsx               # 설정 레이아웃
```

#### 2. State Management

**Zustand Store (클라이언트 상태)**
```typescript
// src/stores/uiStore.ts
interface UIState {
  // UI 상태
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  streaming: boolean;
  currentConversationId: string | null;

  // 액션
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setStreaming: (streaming: boolean) => void;
  setCurrentConversation: (id: string | null) => void;
}
```

**TanStack Query (서버 상태)**
```typescript
// src/features/chat/api/useChatMessages.ts
const useChatMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => dexieDb.messages
      .where('conversationId')
      .equals(conversationId)
      .toArray(),
  });
};

// src/features/models/api/useFreeModels.ts
const useFreeModels = () => {
  return useQuery({
    queryKey: ['free-models'],
    queryFn: fetchFreeModels,
    staleTime: 1000 * 60 * 60, // 1시간
  });
};
```

**역할 분리 원칙**
- **Zustand**: 사용자 인터랙션에 의해 즉시 변하는 상태 (사이드바 열기/닫기, 테마, 스트리밍 상태)
- **TanStack Query**: 외부 API 또는 영구 저장소에서 가져오는 데이터 (메시지, 대화 목록, 모델 목록)

#### 3. Service Layer

```typescript
// src/services/chatService.ts
class ChatService {
  async sendMessage(
    conversationId: string,
    content: string,
    modelId: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // 1. 사용자 메시지를 IndexedDB에 저장
    // 2. SSE 스트리밍 시작
    // 3. 청크 수신 시 콜백 호출
    // 4. 완료 시 어시스턴트 메시지 저장
  }

  stopStreaming(): void {
    // 현재 스트리밍 중단
  }
}

// src/services/modelService.ts
class ModelService {
  async fetchFreeModels(): Promise<Model[]> {
    // OpenRouter API에서 무료 모델 목록 조회
    const response = await fetch('https://openrouter.ai/api/v1/models');
    const models = await response.json();
    return models.data.filter(m =>
      m.pricing.prompt === '0' && m.pricing.completion === '0'
    );
  }
}

// src/services/storageService.ts
class StorageService {
  async createConversation(data: CreateConversationDTO): Promise<string> {
    // 새 대화 생성
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    // 대화 조회
  }

  async listConversations(): Promise<Conversation[]> {
    // 대화 목록 조회
  }

  async deleteConversation(id: string): Promise<void> {
    // 대화 삭제
  }

  async updateConversation(id: string, data: Partial<Conversation>): Promise<void> {
    // 대화 업데이트
  }
}

// src/services/streamService.ts
class StreamService {
  async streamChatCompletion(
    messages: Message[],
    modelId: string,
    apiKey: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) onChunk(content);
        }
      }
    }
  }
}
```

#### 4. Data Layer

```typescript
// src/db/schema.ts
export const db = new Dexie('openrouter-chat-db');

db.version(1).stores({
  settings: 'key',
  conversations: 'id, createdAt, updatedAt',
  messages: 'id, conversationId, createdAt',
});

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Setting {
  key: string;
  value: string;
}
```

## 데이터 흐름

### 1. 새 대화 생성 흐름

```
[사용자] → "새 대화" 클릭
    ↓
[NewChatButton] → onClick 핸들러
    ↓
[useConversations Hook] → createConversation()
    ↓
[StorageService] → IndexedDB에 새 대화 저장
    ↓
[TanStack Query] → 쿼리 무효화 (대화 목록 갱신)
    ↓
[TanStack Router] → /chat/$conversationId로 네비게이션
    ↓
[Zustand Store] → currentConversationId 업데이트
    ↓
[ChatLayout] → 새 대화 UI 렌더링
```

### 2. 메시지 전송 및 스트리밍 흐름

```
[사용자] → 메시지 입력 후 전송
    ↓
[ChatInput] → onSend 핸들러
    ↓
[useChatStream Hook] → sendMessage()
    ↓
[Zustand Store] → streaming: true 설정
    ↓
[ChatService] → 1단계: 사용자 메시지를 IndexedDB에 저장
    ↓
[MessageList] → 즉시 사용자 메시지 표시 (낙관적 업데이트)
    ↓
[ChatService] → 2단계: StreamService.streamChatCompletion() 호출
    ↓
[StreamService] → OpenRouter API에 SSE 요청 전송
    ↓
[StreamService] → 스트리밍 청크 수신
    ↓ (각 청크)
[onChunk 콜백] → Zustand Store에 청크 추가
    ↓
[StreamingText] → 진행 중인 텍스트 애니메이션 렌더링
    ↓ (스트리밍 완료)
[ChatService] → 3단계: 완성된 어시스턴트 메시지를 IndexedDB에 저장
    ↓
[TanStack Query] → 쿼리 무효화 (메시지 목록 갱신)
    ↓
[ChatService] → 4단계: 자동 제목 생성 (첫 메시지인 경우)
    ↓
[Zustand Store] → streaming: false 설정
    ↓
[MessageList] → 최종 메시지 렌더링
```

### 3. 스트리밍 중단 흐름

```
[사용자] → Stop 버튼 클릭
    ↓
[StopButton] → onClick 핸들러
    ↓
[useChatStream Hook] → stopStreaming()
    ↓
[StreamService] → AbortController.abort() 호출
    ↓
[Fetch API] → 연결 중단
    ↓
[ChatService] → 진행 중인 메시지를 IndexedDB에 저장 (부분 완료)
    ↓
[TanStack Query] → 쿼리 무효화
    ↓
[Zustand Store] → streaming: false 설정
    ↓
[MessageList] → 현재까지의 메시지 렌더링
```

### 4. 설정 변경 흐름

```
[사용자] → 설정 페이지에서 API 키 입력
    ↓
[ApiKeyInput] → onChange 핸들러
    ↓
[useSettings Hook] → updateSetting('apiKey', value)
    ↓
[StorageService] → IndexedDB settings 테이블에 저장
    ↓
[TanStack Query] → 쿼리 무효화
    ↓
[Zustand Store] → 필요한 경우 UI 상태 업데이트
    ↓
[앱 전체] → 새 API 키 사용 가능
```

## 패턴

### 패턴 1: SSE 스트리밍 with AbortController

**용도:** OpenRouter API에서 실시간 스트리밍 응답 수신 및 중단

**구현:**
```typescript
// src/features/chat/hooks/useChatStream.ts
const useChatStream = (conversationId: string) => {
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (content: string) => {
    abortControllerRef.current = new AbortController();
    setIsStreaming(true);
    setStreamingContent('');

    try {
      await streamChatCompletion(
        messages,
        modelId,
        apiKey,
        (chunk) => {
          setStreamingContent(prev => prev + chunk);
        },
        abortControllerRef.current.signal
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const stopStreaming = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  };

  return { sendMessage, stopStreaming, streamingContent, isStreaming };
};
```

### 패턴 2: TanStack Query + Dexie.js 통합

**용도:** IndexedDB 데이터를 TanStack Query 캐싱 레이어로 관리

**구현:**
```typescript
// src/lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30,    // 30분
    },
  },
});

// src/features/conversations/api/useConversations.ts
const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      return await db.conversations
        .orderBy('updatedAt')
        .reverse()
        .toArray();
    },
  });
};

// src/features/conversations/api/useCreateConversation.ts
const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateConversationDTO) => {
      const id = uuid();
      await db.conversations.add({
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
```

### 패턴 3: TanStack Router 라우트 구조

**용도:** 파일 기반 라우팅 및 중첩 레이아웃

**구현:**
```
src/routes/
├── __root.tsx                       # 루트 레이아웃 (ThemeProvider)
├── index.tsx                        # 홈 (/)
├── chat.tsx                         # 채팅 레이아웃
│   └── $conversationId.tsx          # 특정 대화 (/chat/:id)
└── settings.tsx                     # 설정 (/settings)
```

```typescript
// src/routes/chat.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Sidebar } from '@/features/conversations/components/Sidebar';

export const Route = createFileRoute('/chat')({
  component: ChatLayout,
});

function ChatLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
```

### 패턴 4: 점진적 마크다운 렌더링

**용도:** 스트리밍 중 마크다운을 부분적으로 렌더링

**구현:**
```typescript
// src/features/markdown/components/StreamingMarkdown.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface Props {
  content: string;
  isStreaming?: boolean;
}

export function StreamingMarkdown({ content, isStreaming }: Props) {
  // 스트리밍 중인 경우 불완전한 마크다운 처리
  const safeContent = isStreaming
    ? ensureCompleteMarkdown(content)
    : content;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code: CodeBlock,
        p: Paragraph,
      }}
    >
      {safeContent}
    </ReactMarkdown>
  );
}

function ensureCompleteMarkdown(content: string): string {
  // 불완전한 코드 블록 닫기
  let fixed = content;
  const codeBlocks = (content.match(/```/g) || []).length;
  if (codeBlocks % 2 !== 0) {
    fixed += '\n```';
  }
  return fixed;
}
```

## 안티 패턴

### 안티 패턴 1: Zustand에 영구 데이터 저장

**문제:** 대화 목록, 메시지 등 영구 데이터를 Zustand에 저장
- 페이지 새로고침 시 데이터 소실
 TanStack Query의 캐싱 혜택을 못 받음
- 낙관적 업데이트와 동기화 복잡

**대신:**
- 영구 데이터는 IndexedDB(Dexie.js)에 저장
- TanStack Query로 IndexedDB 데이터 쿼리
- Zustand는 UI 상태만 관리 (사이드바 열기/닫기, 테마, 스트리밍 상태)

### 안티 패턴 2: 컴포넌트 내에서 직접 API 호출

**문제:** 각 컴포넌트에서 fetch API로 직접 OpenRouter 호출
- API 로직 분산으로 재사용 어려움
- 에러 처리, 재시도 로직 중복
- 테스트 어려움

**대신:**
- Service Layer에 API 로직 집중
- 컴포넌트는 Service 메서드만 호출
- TanStack Query의 mutation으로 서버 상태 관리

### 안티 패턴 3: 스트리밍 데이터를 즉시 IndexedDB에 저장

**문제:** 각 청크 수신 시마다 IndexedDB에 쓰기
- 불필요한 I/O 연산으로 성능 저하
- 트랜잭션 비용

**대신:**
- 스트리밍 중은 메모리(Zustand)에만 저장
- 스트리밍 완료 시 한 번만 IndexedDB에 저장
- TanStack Query 캐시로 중간 상태 관리

### 안티 패턴 4: useEffect로 API 폴링

**문제:** 메시지 업데이트를 위해 setInterval로 폴링
- 불필요한 네트워크 요청
- 배터리 소모

**대신:**
- Dexie.js의 `useLiveQuery`로 반응형 쿼리
- IndexedDB 변경 시 자동으로 컴포넌트 업데이트
- TanStack Query의 캐싱과 결합

## 확장성 고려사항

| 관심사 | 100명 동시 사용자 | 1만명 동시 사용자 | 100만명 동시 사용자 |
|--------|-------------------|-------------------|---------------------|
| API 요청 | 클라이언트 직접 호출 | OpenRouter Rate Limit 고려 | 요청 큐/스로틀링 필수 |
| IndexedDB | 단일 DB 충분 | 단일 DB 가능 (저장소 할당량 확인) | Web Workers 필요 |
| 스트리밍 | 메모리 충분 | 메모리 관리 필요 | 청크 디스퍼싱 필요 |
| 캐싱 | TanStack Query 기본 | 캐시 크기 제한 필요 | 캐시 전략 세분화 |

**현재 범위 (로컬 개발 환경):**
- 단일 사용자 전용
- IndexedDB 저장소 할당량 여유
- OpenRouter Rate Limit (200req/day) 고려하여 스로틀링

## 빌드 순서 (컴포넌트 의존성)

### 1단계: 데이터 계층
```
1. Dexie.js 스키마 정의
2. StorageService 구현
3. TanStack Query 클라이언트 설정
```

### 2단계: 서비스 계층
```
4. StreamService 구현 (SSE 스트리밍)
5. ChatService 구현
6. ModelService 구현
```

### 3단계: 상태 관리
```
7. Zustand Store 생성
8. TanStack Query 훅 구현
```

### 4단계: UI 컴포넌트
```
9. 공통 컴포넌트
10. 메시지 관련 컴포넌트
11. 대화 관련 컴포넌트
12. 설정 관련 컴포넌트
```

### 5단계: 라우팅
```
13. TanStack Router 설정
14. 레이아웃 컴포넌트
15. 라우트 연결
```

### 6단계: 통합
```
16. 메인 앱 진입점
17. 테마 제공자
18. 에러 바운더리
```

**의존성 순서:** 1 → 2 → 3 → 4 → 5 → 6

## 출처

**신뢰 수준: MEDIUM**
- 웹 검색 서비스 오류로 공식 문서 확인 불가
- React 19, Zustand, TanStack Query, Dexie.js, TanStack Router의 일반적인 아키텍처 패턴 기반
- 프론트엔드 전용 AI 채팅 앱의 표준적인 컴포넌트 구조 적용
- 검증이 필요한 영역: 최신 라이브러리 버전별 특이사항

**검증이 필요한 항목:**
- React 19의 새로운 상태 관리 기능과 Zustand/TanStack Query와의 호환성
- TanStack Query v5의 최신 API 변경사항
- Dexie.js v4의 useLiveQuery 성능 특성
