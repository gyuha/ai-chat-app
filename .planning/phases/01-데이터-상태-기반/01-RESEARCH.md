# Phase 1: 데이터 & 상태 기반 - Research

**Researched:** 2026-03-31
**Domain:** React 19 + Dexie.js v4 + Zustand + TanStack Query/Router + shadcn/ui
**Confidence:** MEDIUM (웹 검색/문서 읽기 API 불가로 npm registry + 기존 지식 기반)

## Summary

Phase 1은 OpenRouter Chat 앱의 데이터 영속성과 상태 관리 기반을 구축하는 페이즈다. IndexedDB(Dexie.js v4)를 이용한 대화/메시지/설정 저장, Zustand를 이용한 클라이언트 전역 상태, TanStack Query를 이용한 IndexedDB 쿼리 캐싱, TanStack Router를 이용한 파일 기반 라우팅을 설정해야 한다. 프로젝트는 초기 상태로 소스 코드가 전혀 없으므로 Vite 프로젝트 생성부터 shadcn/ui 초기화, 모든 설정 파일 구성까지 전체 기반 구축이 필요하다.

**Primary recommendation:** Dexie.js v4를 데이터 계층으로 사용하고, `dexie-react-hooks`의 `useLiveQuery`를 TanStack Query와 병행하여 IndexedDB의 반응형 쿼리를 구현하라. Zustand는 사이드바 열림/닫힘, 테마 등 순수 UI 상태만 담당하고, IndexedDB 데이터는 Dexie + TanStack Query 조합으로 관리하라.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | 사용자가 새 대화를 생성할 수 있다 | Dexie.js `conversations` 테이블에 UUID PK로 저장, TanStack Router로 생성된 대화 페이지로 네비게이션 |
| DATA-02 | 사이드바에 대화 목록이 최신순으로 표시된다 | Dexie `reverse()` 정렬 + `useLiveQuery` 반응형 구독 또는 TanStack Query `useQuery` |
| DATA-03 | 사용자가 대화를 삭제할 수 있다 (확인 다이얼로그 포함) | shadcn/ui `AlertDialog` 컴포넌트 + Dexie `delete()` + 캐시 무효화 |
| DATA-05 | 사용자가 API 키를 등록/변경/삭제할 수 있다 | Dexie `settings` 테이블 key-value 저장, API 키 마스킹 표시 (`sk-****`) |
| DATA-06 | 사용자가 기본 모델을 설정할 수 있다 | Dexie `settings` 테이블에 `defaultModelId` 저장, shadcn/ui `Select` 컴포넌트 |
| DATA-07 | 사용자가 시스템 프롬프트를 설정할 수 있다 (대화별/글로벌) | 글로벌: `settings` 테이블, 대화별: `conversations.systemPrompt` 필드 (Phase 1은 글로벌만) |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | 19.2.4 | UI 라이브러리 | CLAUDE.md 확정. use() 훅, 개선된 Suspense |
| react-dom | 19.2.4 | React DOM 렌더러 | React 19와 짝 |
| typescript | 5.9.3 | 타입 시스템 | strict 모드, React 19와 호환 |
| vite | 6.4.1 | 빌드 도구 | CLAUDE.md 확정 (6.x 라인) |
| @vitejs/plugin-react | 6.0.1 | Vite React 플러그인 | Vite 6와 짝, Fast Refresh |
| tailwindcss | 4.2.2 | 스타일링 | CLAUDE.md 확정. CSS 변수 기반 v4 아키텍처 |
| @tailwindcss/vite | 4.2.2 | Tailwind v4 Vite 플러그인 | v4는 PostCSS 플러그인 불필요, Vite 플러그인으로 통합 |
| dexie | 4.4.1 | IndexedDB ORM | CLAUDE.md 확정. Dexie v4는 IE11 지원 중단, 모던 브라우저 최적화 |
| dexie-react-hooks | 4.4.0 | Dexie React 통합 | `useLiveQuery`로 IndexedDB 반응형 쿼리 |
| @tanstack/react-query | 5.95.2 | 서버 상태/캐싱 | CLAUDE.md 확정. IndexedDB 쿼리 캐싱 + 나중에 API 캐싱 |
| @tanstack/react-router | 1.168.8 | 파일 기반 라우팅 | CLAUDE.md 확정. 타입 안전 라우트 매개변수 |
| @tanstack/router-plugin | 1.167.9 | TanStack Router Vite 플러그인 | 파일 기반 라우트 자동 생성 |
| zustand | 5.0.12 | 클라이언트 전역 상태 | CLAUDE.md 확정. 사이드바 UI 상태, 테마 등 |
| shadcn/ui | 4.1.1 (CLI) | 컴포넌트 라이브러리 | CLAUDE.md 확정. Radix UI primitives + 복사-붙여넣기 |
| lucide-react | 1.7.0 | 아이콘 라이브러리 | UI-SPEC에서 명시. shadcn/ui 기본 아이콘 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @biomejs/biome | 2.4.9 | Linter + Formatter | CLAUDE.md 확정. ESLint/Prettier 대체 |
| vitest | 4.1.2 | 테스트 프레임워크 | CLAUDE.md 확정. Vite와 동일한 설정 |
| uuid | 13.0.0 | UUID 생성 | 대화/메시지 ID (PK) |
| class-variance-authority | 0.7.1 | 컴포넌트 변형 | shadcn/ui 내부 의존성 |
| clsx | 2.1.1 | 클래스 병합 | shadcn/ui 내부 의존성 |
| tailwind-merge | 3.5.0 | Tailwind 클래스 충돌 해결 | shadcn/ui `cn()` 유틸리티 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand + TanStack Query | Zustand only | TanStack Query가 IndexedDB 캐싱/무효화에 유리. API 호출은 Phase 2에서 필요하므로 미리 세팅 |
| dexie-react-hooks `useLiveQuery` | TanStack Query만 | useLiveQuery는 IndexedDB 변경 시 자동 갱신 보장. TanStack Query는 수동 무효화 필요 |
| uuid (npm) | crypto.randomUUID() | 모던 브라우저에서 crypto.randomUUID() 사용 가능. 의존성 줄이려면 네이티브 API 사용 |

**Installation:**
```bash
pnpm add react@19 react-dom@19 dexie dexie-react-hooks @tanstack/react-query @tanstack/react-router zustand lucide-react uuid
pnpm add -D typescript @types/react @types/react-dom @types/uuid vite @vitejs/plugin-react tailwindcss @tailwindcss/vite @tanstack/router-plugin @biomejs/biome vitest
```

**Version verification:** 2026-03-31 npm registry 조회 완료. CLAUDE.md에 명시된 Vite 6.x 라인 최신은 6.4.1.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── ui/                    # shadcn/ui 컴포넌트 (자동 생성)
│   ├── layout/
│   │   ├── SidebarLayout.tsx  # 사이드바 + 메인 영역
│   │   ├── Sidebar.tsx        # 좌측 280px 사이드바
│   │   └── MainArea.tsx       # 우측 메인 콘텐츠
│   ├── conversation/
│   │   ├── NewChatButton.tsx
│   │   ├── ConversationList.tsx
│   │   ├── ConversationItem.tsx
│   │   └── DeleteConversationDialog.tsx
│   └── settings/
│       ├── SettingsPage.tsx
│       ├── ApiKeyInput.tsx
│       ├── ModelSelector.tsx
│       └── SystemPromptInput.tsx
├── db/
│   └── index.ts               # Dexie.js DB 정의 + 스키마
├── hooks/
│   ├── useConversation.ts     # 대화 CRUD 훅
│   └── useSettings.ts         # 설정 CRUD 훅
├── stores/
│   └── ui-store.ts            # Zustand: 사이드바 상태, 테마
├── routes/
│   ├── __root.tsx             # 루트 레이아웃
│   ├── index.tsx              # / (새 대화 또는 빈 상태)
│   ├── chat/
│   │   └── $conversationId.tsx # /chat/$conversationId
│   └── settings.tsx           # /settings
├── lib/
│   └── utils.ts               # cn() 유틸리티
├── router.ts                  # TanStack Router 인스턴스
├── main.tsx                   # 진입점
└── index.css                  # Tailwind CSS v4 임포트
```

### Pattern 1: Dexie.js Database Schema
**What:** IndexedDB 데이터베이스 스키마 정의
**When to use:** 앱 시작 시 DB 구조 정의
**Example:**
```typescript
// src/db/index.ts
import Dexie, { type EntityTable } from 'dexie';

// 설정 테이블 key-value 타입
export interface Setting {
  key: string;
  value: string;
}

// 대화 타입
export interface Conversation {
  id: string;           // UUID
  title: string;
  modelId: string;
  systemPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 메시지 타입 (Phase 2에서 사용, Phase 1에서 스키마만 정의)
export interface Message {
  id: string;           // UUID
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

class OpenRouterChatDB extends Dexie {
  settings!: EntityTable<Setting, 'key'>;
  conversations!: EntityTable<Conversation, 'id'>;
  messages!: EntityTable<Message, 'id'>;

  constructor() {
    super('openrouter-chat-db');
    this.version(1).stores({
      settings: 'key',
      conversations: 'id, updatedAt',
      messages: 'id, conversationId, createdAt',
    });
  }
}

export const db = new OpenRouterChatDB();
```

**주의:** Dexie v4에서는 `EntityTable<T, KeyType>` 제네릭을 사용하여 타입 안전성을 확보한다. `Table` 대신 `EntityTable` 사용.

### Pattern 2: TanStack Query + Dexie Integration
**What:** IndexedDB 데이터를 TanStack Query로 캐싱하고 관리
**When to use:** 대화 목록 조회, 설정 읽기/쓰기
**Example:**
```typescript
// src/hooks/useConversation.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/db';
import type { Conversation } from '@/db';

// 대화 목록 조회 (최신순)
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () =>
      db.conversations.orderBy('updatedAt').reverse().toArray(),
  });
}

// 새 대화 생성
export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { modelId: string }) => {
      const id = crypto.randomUUID();
      const now = new Date();
      const conversation: Conversation = {
        id,
        title: '새 대화',
        modelId: data.modelId,
        createdAt: now,
        updatedAt: now,
      };
      await db.conversations.add(conversation);
      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// 대화 삭제
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // 관련 메시지도 함께 삭제 (cascade)
      await db.messages.where('conversationId').equals(id).delete();
      await db.conversations.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
```

### Pattern 3: Settings Key-Value Store
**What:** 설정을 key-value 형태로 IndexedDB에 저장
**When to use:** API 키, 기본 모델, 시스템 프롬프트 등
**Example:**
```typescript
// src/hooks/useSettings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/db';

// 단일 설정 조회
export function useSetting(key: string) {
  return useQuery({
    queryKey: ['settings', key],
    queryFn: async () => {
      const setting = await db.settings.get(key);
      return setting?.value ?? null;
    },
  });
}

// 설정 저장/업데이트
export function useSaveSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await db.settings.put({ key, value });
    },
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['settings', key] });
    },
  });
}

// 설정 삭제
export function useDeleteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      await db.settings.delete(key);
    },
    onSuccess: (_, key) => {
      queryClient.invalidateQueries({ queryKey: ['settings', key] });
    },
  });
}
```

### Pattern 4: Zustand UI Store
**What:** 순수 클라이언트 UI 상태 관리
**When to use:** 사이드바 열림/닫힘, 테마 등 서버와 무관한 상태
**Example:**
```typescript
// src/stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

### Pattern 5: TanStack Router File-Based Routing
**What:** 파일 기반 라우팅 설정
**When to use:** 라우트 정의
**Example:**
```typescript
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

export const Route = createRootRoute({
  component: () => (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  ),
});

// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { EmptyConversationList } from '@/components/conversation/EmptyConversationList';

export const Route = createFileRoute('/')({
  component: () => <EmptyConversationList />,
});

// src/routes/chat/$conversationId.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/chat/$conversationId')({
  component: ChatPage,
});

// src/routes/settings.tsx
import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '@/components/settings/SettingsPage';

export const Route = createFileRoute('/settings')({
  component: () => <SettingsPage />,
});
```

### Anti-Patterns to Avoid
- **TanStack Query 없이 Dexie 직접 호출:** 컴포넌트에서 직접 `db.conversations.toArray()` 호출 시 로딩/에러 상태 관리 누락. 반드시 TanStack Query 래핑
- **Zustand에 비즈니스 데이터 저장:** 대화/메시지 데이터는 Zustand가 아닌 IndexedDB(Dexie)에 저장. Zustand는 순수 UI 상태만
- **IndexedDB에 평문 API 키 저장:** 로컬 전용이지만 기본 주의 필요. CLAUDE.md에서 로컬 환경 명시로 수용 가능
- **Dexie `Table` 대신 `EntityTable` 사용:** Dexie v4에서 `EntityTable<T, KeyType>`이 타입 안전성 제공. 구형 `Table` 타입 사용 금지
- **라우트 파일에서 데이터 로직 직접 호출:** 라우트 컴포넌트는 hooks를 통해 간접적으로만 데이터 접근

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| IndexedDB 래핑 | 원시 IndexedDB API | Dexie.js v4 | 트랜잭션 관리, 스키마 버전 관리, 반응형 쿼리 복잡도 |
| UI 컴포넌트 | 커스텀 Dialog, Select 등 | shadcn/ui (Radix UI 기반) | 접근성(a11y) 키보드 내비게이션, 포커스 트랩 자동 처리 |
| 클래스명 병합 | 커스텀 문자열 결합 | `clsx` + `tailwind-merge` (`cn()`) | Tailwind 클래스 충돌 자동 해결 |
| UUID 생성 | 커스텀 ID 생성기 | `crypto.randomUUID()` (네이티브) 또는 `uuid` 패키지 | UUID v4 표준 준수, 충돌 방지 |
| 라우트 타입 안전성 | 수동 파라미터 파싱 | TanStack Router | 타입 안전한 파라미터, 자동 코드 스플리팅 |
| 캐시 무효화 | 수동 상태 동기화 | TanStack Query `invalidateQueries` | 관련 쿼리 자동 갱신, 경쟁 상태 방지 |

**Key insight:** 이 프로젝트의 데이터 계층은 IndexedDB가 유일한 "서버"다. TanStack Query를 IndexedDB 쿼리에 사용하면 API 호출과 동일한 패턴(로딩/에러/캐시)을 일관되게 적용할 수 있으며, Phase 2에서 실제 API 호출이 추가될 때 패턴이 그대로 확장된다.

## Common Pitfalls

### Pitfall 1: Dexie v4 EntityTable 마이그레이션
**What goes wrong:** Dexie v3 코드(`Table<T>`)를 그대로 사용하면 타입 에러
**Why it happens:** Dexie v4가 `EntityTable<T, KeyType>` 제네릭을 도입
**How to avoid:** 모든 테이블 정의에 `EntityTable` 사용, `key` 타입 파라미터 명시
**Warning signs:** `Property 'id' does not exist on type 'Table'` 에러

### Pitfall 2: shadcn/ui 초기화 순서
**What goes wrong:** Tailwind v4 설정이 없는 상태에서 shadcn 컴포넌트 추가 시 스타일 깨짐
**Why it happens:** shadcn/ui는 Tailwind 설정과 CSS 변수에 의존
**How to avoid:** (1) Vite 프로젝트 생성 -> (2) Tailwind v4 설정 -> (3) shadcn init -> (4) 컴포넌트 추가 순서 엄수
**Warning signs:** 컴포넌트가 스타일 없이 렌더링됨

### Pitfall 3: TanStack Router Plugin과 Vite 6 호환성
**What goes wrong:** 플러그인이 라우트 파일을 인식하지 못함
**Why it happens:** TanStack Router Plugin 버전이 Vite 버전과 호환되지 않음
**How to avoid:** `@tanstack/router-plugin` 최신 버전(1.167.x)과 Vite 6.x 조합 사용, `routesDirectory` 경로 명확히 설정
**Warning signs:** `routeTree.gen.ts` 파일이 생성되지 않음

### Pitfall 4: IndexedDB 트랜잭션 내 비동기 흐름
**What goes wrong:** Dexie 트랜잭션 내에서 `await` 후 추가 작업 시 트랜잭션 이미 종료
**Why it happens:** IndexedDB 트랜잭션은 자동 커밋됨
**How to avoid:** Dexie의 `db.transaction()` 블록 내에서 모든 작업을 직렬로 수행. 또는 `useMutation`의 `mutationFn`에서 하나의 논리적 단위로 처리
**Warning signs:** `TransactionInactiveError` 런타임 에러

### Pitfall 5: 대화 삭제 시 관련 메시지 누락
**What goes wrong:** 대화만 삭제하고 메시지가 남아 고아 데이터 발생
**Why it happens:** IndexedDB는 관계형 DB가 아니므로 cascade delete 자동 수행 안 됨
**How to avoid:** 대화 삭제 mutation에서 반드시 `db.messages.where('conversationId').equals(id).delete()` 먼저 실행 후 대화 삭제
**Warning signs:** IndexedDB 용량 지속 증가, 고아 메시지 데이터

### Pitfall 6: API 키 마스킹 UX
**What goes wrong:** API 키를 항상 평문으로 표시하거나, 마스킹 후 수정 불가
**Why it happens:** 입력 상태 관리(평문 vs 마스킹) 미흡
**How to avoid:** 기본은 `sk-****` 마스킹 표시, "변경" 클릭 시에만 입력 필드 활성화. UI-SPEC의 인터랙션 스펙 참조
**Warning signs:** API 키가 항상 노출되거나 편집이 불가능한 상태

### Pitfall 7: Tailwind CSS v4 설정 방식 변경
**What goes wrong:** v3 방식(`tailwind.config.js`, PostCSS 플러그인)으로 설정
**Why it happens:** Tailwind v4는 완전히 새로운 설정 아키텍처 사용
**How to avoid:** (1) `@tailwindcss/vite` 플러그인 사용 (PostCSS 불필요), (2) CSS 파일에서 `@import "tailwindcss"` 사용, (3) CSS 변수 기반 테마 정의
**Warning signs:** Tailwind 클래스가 작동하지 않음, `tailwind.config.js`가 무시됨

## Code Examples

### Dexie.js v4 Database Definition
```typescript
// Source: npm registry dexie@4.4.1, 공식 문서 패턴
import Dexie, { type EntityTable } from 'dexie';

export interface Setting {
  key: string;
  value: string;
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  systemPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

class OpenRouterChatDB extends Dexie {
  settings!: EntityTable<Setting, 'key'>;
  conversations!: EntityTable<Conversation, 'id'>;
  messages!: EntityTable<Message, 'id'>;

  constructor() {
    super('openrouter-chat-db');
    this.version(1).stores({
      settings: 'key',
      conversations: 'id, updatedAt',
      messages: 'id, conversationId, createdAt',
    });
  }
}

export const db = new OpenRouterChatDB();
```

### TanStack Router Setup with Vite
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Vite Project Entry Point
```typescript
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30,   // 30분
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
```

### Tailwind CSS v4 Entry
```css
/* src/index.css */
@import "tailwindcss";

/* shadcn/ui 테마 변수 (다크모드 기본) */
@theme {
  --color-background: hsl(0 0% 3.9%);
  --color-foreground: hsl(0 0% 98%);
  --color-card: hsl(0 0% 14.9%);
  --color-card-foreground: hsl(0 0% 98%);
  --color-primary: hsl(0 0% 98%);
  --color-primary-foreground: hsl(0 0% 9%);
  --color-destructive: hsl(0 84.2% 60.2%);
  --color-muted: hsl(0 0% 14.9%);
  --color-muted-foreground: hsl(0 0% 63.9%);
  --color-border: hsl(0 0% 14.9%);
  --color-input: hsl(0 0% 14.9%);
  --color-ring: hsl(0 0% 83.1%);
}
```

### shadcn/ui cn() Utility
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Dexie v3 `Table<T>` | Dexie v4 `EntityTable<T, Key>` | Dexie 4.0 (2024) | 더 강력한 타입 안전성 |
| Tailwind v3 `tailwind.config.js` | Tailwind v4 CSS-native config | Tailwind v4 (2025) | PostCSS 불필요, CSS `@theme` 디렉티브 |
| TanStack Router `@tanstack/router-vite-plugin` | `@tanstack/router-plugin` | Router 1.x | 패키지명 변경, 안정화 |
| Zustand v4 `create()` | Zustand v5 `create()` (API 동일) | Zustand 5.0 (2024) | API 호환, 내부 개선 |
| React 18 | React 19 | React 19 (2024-12) | 새로운 use() 훅, ref cleanup |
| Vite 5 | Vite 6 | Vite 6.0 (2024) | Environment API, 성능 개선 |

**Deprecated/outdated:**
- `@tanstack/router-vite-plugin`: `@tanstack/router-plugin`으로 이름 변경됨
- Tailwind v3 PostCSS 플러그인: v4에서는 `@tailwindcss/vite` 플러그인 사용
- CRA (Create React App): 유지보수 중단, Vite 사용 필수

## Open Questions

1. **Dexie.js v4 EntityTable vs Table 타입**
   - What we know: Dexie v4에서 `EntityTable` 도입, CLAUDE.md에서는 v4 명시
   - What's unclear: EntityTable의 정확한 제네릭 시그니처가 최신 버전에서 변경되었을 가능성
   - Recommendation: 구현 시 Dexie v4.4.1 타입 정의 확인. `EntityTable<T, 'keyProp'>` 패턴 사용

2. **shadcn/ui Tailwind v4 호환성**
   - What we know: shadcn/ui CLI 4.x가 Tailwind v4 지원
   - What's unclear: `shadcn init` 실행 시 Tailwind v4에 맞는 CSS 변수를 자동 생성하는지
   - Recommendation: `shadcn init` 실행 후 생성된 CSS 파일 확인. 필요시 수동으로 `@theme` 블록 수정

3. **TanStack Router Plugin 버전 매칭**
   - What we know: Router core 1.168.8, Plugin 1.167.9로 마이너 버전 차이 존재
   - What's unclear: 이 버전 조합의 호환성 보장 여부
   - Recommendation: 동일한 마이너 버전 사용 권장. 구현 시 `routeTree.gen.ts` 생성 확인으로 검증

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite, 빌드 | ✓ | 24.13.0 | -- |
| pnpm | 패키지 매니저 | ✓ | 10.28.2 | -- |
| npx | shadcn CLI 실행 | ✓ | 11.6.2 | -- |

**Missing dependencies with no fallback:**
- 없음. 모든 필수 도구 사용 가능.

**Missing dependencies with fallback:**
- 없음.

## Sources

### Primary (HIGH confidence)
- npm registry (2026-03-31 조회): 모든 패키지 버전 직접 확인
- CLAUDE.md: 프로젝트 기술 스택 확정 사항
- UI-SPEC.md: Phase 1 UI 디자인 컨트랙트
- REQUIREMENTS.md: DATA-01~DATA-07 요구사항 정의

### Secondary (MEDIUM confidence)
- Dexie.js v4 공식 문서 패턴 (훈련 데이터 기반, 버전 확인 완료)
- TanStack Router 파일 기반 라우팅 설정 패턴 (훈련 데이터 기반, 플러그인 버전 확인 완료)
- TanStack Query v5 mutation/cache invalidation 패턴 (훈련 데이터 기반)
- Tailwind CSS v4 설정 패턴 (훈련 데이터 기반, 버전 확인 완료)

### Tertiary (LOW confidence)
- shadcn/ui CLI v4와 Tailwind v4 통합 세부사항 (실제 실행 확인 필요)
- Dexie.js v4 EntityTable 최신 타입 시그니처 (실제 타입 정의 확인 필요)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - 모든 버전 npm registry에서 직접 확인, CLAUDE.md에서 확정된 스택
- Architecture: MEDIUM - 패턴은 검증되었으나 Dexie v4 EntityTable 세부사항은 실행 확인 필요
- Pitfalls: HIGH - 일반적인 IndexedDB/React/Dexie 함정은 잘 알려져 있음

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (안정적인 라이브러리, 30일 유효)

## Project Constraints (from CLAUDE.md)

### 기술 스택 (확정)
- React 19 + Vite 6 + TypeScript (strict)
- pnpm (패키지 매니저)
- Biome (lint + format, ESLint/Prettier 대체)
- shadcn/ui + Tailwind CSS v4
- Zustand (클라이언트 전역 상태)
- TanStack Query v5 (서버 상태/캐싱)
- TanStack Router (파일 기반 라우팅)
- Dexie.js v4 (IndexedDB ORM)
- react-markdown + remark-gfm + rehype-highlight

### 코딩 컨벤션
- 한국어 UI (버튼, 라벨, 안내 문구)
- 코드 식별자는 영어, 문서는 한국어
- PascalCase: 컴포넌트/클래스, camelCase: 변수/함수, kebab-case: 폴더/파일명
- 다크모드 기본 활성

### 아키텍처 제약
- DB명: `openrouter-chat-db`
- 테이블: settings(key PK), conversations(id PK uuid), messages(id PK uuid)
- 사이드바: 280px, 접기 가능
- 반응형 분기: 1024px 기준
- 로컬 개발 환경만, 백엔드 없음

### 금지 사항
- Redux, MobX, Apollo Client 사용 금지
- localStorage 대신 IndexedDB 사용
- Styled Components, emotion 사용 금지
- Next.js, CRA 사용 금지
- ESLint + Prettier 대신 Biome 사용
