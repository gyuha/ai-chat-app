# 기술 스택 조사

**도메인:** 프론트엔드 전용 AI 채팅 앱 (React + TypeScript)
**조사일:** 2026-03-30
**신뢰도:** MEDIUM (웹 검색 도구 제한으로 훈련 데이터 기반)

## 추천 스택

### 핵심 기술

| 기술 | 버전 | 목적 | 추천 이유 |
|------|------|------|-----------|
| React | 19.0.0 | UI 라이브러리 | 새로운 use() 훅, 개선된 서버 컴포넌트 지원, useOptimistic으로 낙관적 업데이트 간소화 |
| Vite | 6.x | 빌드 도구 | 번들링 없는 즉시 개발 서버 시작, HMR 지원, TypeScript 즉시 사용 |
| TypeScript | 5.7.x | 타입 시스템 | strict 모드로 런타임 에러 사전 방지, React 19와 완벽한 호환성 |
| Tailwind CSS | v4 | 스타일링 | CSS 변수 기반的新 아키텍처, 제로 런타임, 엔진 내장으로 빌드 단계 간소화 |

### 지원 라이브러리

| 라이브러리 | 버전 | 목적 | 사용 시점 |
|-----------|------|------|-----------|
| shadcn/ui | latest | 컴포넌트 라이브러리 | Radix UI primitives 기반, 완전한 커스터마이징 가능, 복사-붙여넣기 방식으로 npm 의존성 없음 |
| Zustand | 5.0.0 | 클라이언트 상태 관리 | API 키, 테마, UI 상태 등 글로벌 클라이언트 상태용. Context API 불필요, 미니멀한 보일러플레이트 |
| TanStack Query | 5.59.0 | 서버 상태 관리 | OpenRouter API 호출, 자동 캐싱, 재시도, 요청 중복 제거 |
| TanStack Router | 1.55.0 | 파일 기반 라우팅 | 타입 안전한 라우트 매개변수, 중첩 라우트, 코드 스플리팅 |
| Dexie.js | 4.0.8 | IndexedDB ORM | 브라우저 내 영구 저장, 동기식 API로 비동기 IndexedDB 간소화 |
| react-markdown | 9.0.1 | 마크다운 렌더링 | XSS 보호, 플러그인 생태계 (remark-gfm, rehype-highlight) |
| remark-gfm | 4.0.0 | GitHub Flavored Markdown | 테이블, 취소선, 자동 링크 등 GFM 기능 |
| rehype-highlight | 7.0.0 | 코드 하이라이팅 | 190+ 언어 구문 강조, 자동 언어 감지 |

### 개발 도구

| 도구 | 목적 | 참고 사항 |
|------|------|-----------|
| pnpm | 패키지 매니저 | 디스크 공간 절약, stricter 의존성, monorepo 친화적 |
| Biome | Linter + Formatter | ESLint/Prettier 대체, 100x 더 빠른 린팅, ESLint 규칙 호환 |
| Vitest | 테스트 프레임워크 | Vite와 동일한 설정, Jest 호환 API,.watch 모드 |

## 설치

```bash
# 핵심 패키지
pnpm add react@19.0.0 react-dom@19.0.0

# 타입
pnpm add -D @types/react@19 @types/react-dom@19 typescript@5.7

# 빌드 도구
pnpm add -D vite@6 @vitejs/plugin-react@4

# 스타일링
pnpm add -D tailwindcss@4 @tailwindcss/vite@4

# 상태 관리
pnpm add zustand@5 @tanstack/react-query@5 @tanstack/react-router@1

# 데이터베이스
pnpm add dexie@4

# 마크다운
pnpm add react-markdown@9 remark-gfm@4 rehype-highlight@7

# 개발 도구
pnpm add -D @biomejs/biome@1.9 vitest@1
```

## 대안으로 고려한 것

| 추천 | 대안 | 대안 사용 시기 |
|------|------|----------------|
| Zustand | Jotai | atom 기반 상태가 필요할 때. Zustand는 더 단순한 API |
| TanStack Query | SWR | 더 가벼운 클라이언트가 필요할 때. TanStack Query는 더 강력한 캐싱 |
| TanStack Router | React Router v7 | 이미 React Router를 사용 중일 때. TanStack Router는 더 강한 타입 안전성 |
| Dexie.js | 원시 IndexedDB | 용량이 매우 작을 때. Dexie.js는 더 나은 개발자 경험 |
| Biome | ESLint + Prettier | 기존 프로젝트 마이그레이션 시. Biome은 더 빠르고 통합 솔루션 |

## 사용하지 말아야 할 것

| 피해야 할 것 | 이유 | 대안 |
|-------------|------|------|
| Redux Toolkit | 과도한 보일러플레이트, 클라이언트 상태에만 필요 | Zustand |
| Apollo Client | GraphQL 중심, REST API에는 과함 | TanStack Query |
| MobX | 암시적 상태 관리, 디버깅 어려움 | Zustand + TanStack Query |
| localStorage | 동기식으로 메인 스레드 차단, 용량 제한 (5-10MB) | IndexedDB via Dexie.js |
| Styled Components | 런타임 오버헤드, 더 큰 번들 크기 | Tailwind CSS v4 |
| emotion | 런타임 오버헤드, CSS-in-JS 단점 | Tailwind CSS v4 |
| Babel | 느린 변환, Vite의 esbuild가 더 빠름 | Vite 내장 esbuild |
| Prettier + ESLint | 느린 실행, 별도 설정 필요 | Biome (통합 솔루션) |
| Next.js | 불필요한 백엔드 복잡도, 정적 사이트에 과함 | Vite (순수 클라이언트) |
| CRA (Create React App) | 유지 관리 중단됨, Vite가 더 현대적 | Vite |

## 변형별 스택 패턴

**PWA가 필요한 경우:**
- Vite PWA 플러그인 사용 (vite-plugin-pwa)
- Workbox로 서비스 워커 생성
- Manifest 파일 추가

**SSR이 필요한 경우:**
- Vite의 ssr 옵션 활성화
- @vitejs/plugin-react의 reactssr 옵션
- 정적 생성 또는 서버 측 렌더링 결정

**더 간단한 상태 관리가 필요한 경우:**
- Zustand 제거, React Context API + useReducer 사용
- 작은 규모 앱에 적합

## 버전 호환성

| 패키지 A | 호환 가능 | 참고 사항 |
|-----------|----------|----------|
| React 19 | TypeScript 5.7+, Vite 6+ | React 19는 @types/react@19 필요 |
| Tailwind v4 | Vite 6+, PostCSS 없음 | v4는 독립 실행형, PostCSS 플러그인 불필요 |
| TanStack Query 5 | React 18+, 19 지원 | useMutation, useQuery API 동일 |
| TanStack Router 1 | React 18+, 19 지원 | 파일 기반 라우팅 선택 사항 |
| Dexie.js 4 | 모든 최신 브라우저 | IE11 지원 중단됨 |
| Biome 1.9 | Node.js 18+, 20+, 22+ | 네이티브 ESM |

## 구체적인 설정 방법

### Vite + React 19 + TypeScript

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      // React 19의 새로운 JSX 변환 사용
      jsxImportSource: 'react',
      babel: {
        plugins: ['babel-plugin-react-compiler']
      }
    }),
    tailwindcss()
  ],
  server: {
    port: 5173,
    strictPort: true
  }
})
```

```typescript
// tsconfig.json (strict 모드)
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "allowJs": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Tailwind CSS v4

```javascript
// tailwind.config.js (v4는 CSS 변수 기반)
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        }
      }
    }
  },
  plugins: []
}
```

```css
/* src/index.css (v4 CSS 변수 방식) */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.5 0.15 250);
  --color-primary-foreground: oklch(0.98 0 0);

  /* 다크 모드 */
  @media (prefers-color-scheme: dark) {
    --color-primary: oklch(0.6 0.18 250);
    --color-primary-foreground: oklch(0.1 0 0);
  }
}
```

### TanStack Query + Zustand 상태 관리 분리

```typescript
// src/stores/useSettingsStore.ts (Zustand - 클라이언트 상태)
import { create } from 'zustand'

interface SettingsState {
  apiKey: string | null
  defaultModel: string
  theme: 'light' | 'dark'
  setApiKey: (key: string | null) => void
  setDefaultModel: (model: string) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  apiKey: null,
  defaultModel: 'google/gemma-3-27b-it',
  theme: 'dark',
  setApiKey: (key) => set({ apiKey: key }),
  setDefaultModel: (model) => set({ defaultModel: model }),
  setTheme: (theme) => set({ theme })
}))
```

```typescript
// src/api/openRouter.ts (TanStack Query - 서버 상태)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useFreeModels = () => {
  return useQuery({
    queryKey: ['models', 'free'],
    queryFn: async () => {
      const response = await fetch('https://openrouter.ai/api/v1/models')
      const data = await response.json()
      return data.data.filter((model: any) =>
        model.pricing.prompt === '0' && model.pricing.completion === '0'
      )
    },
    staleTime: 1000 * 60 * 60 // 1시간 캐싱
  })
}

export const useChatCompletion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messages, model }: { messages: any[], model: string }) => {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true
        })
      })
      return response.body
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }
  })
}
```

### Dexie.js IndexedDB 설정

```typescript
// src/db/db.ts
import Dexie, { Table } from 'dexie'

export interface Conversation {
  id?: string
  title: string
  modelId: string
  systemPrompt: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id?: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
}

export class OpenRouterChatDB extends Dexie {
  conversations!: Table<Conversation>
  messages!: Table<Message>

  constructor() {
    super('openrouter-chat-db')
    this.version(1).stores({
      conversations: 'id, createdAt, updatedAt',
      messages: 'id, conversationId, createdAt'
    })
  }
}

export const db = new OpenRouterChatDB()
```

```typescript
// src/hooks/useConversations.ts (Dexie + TanStack Query)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/db/db'
import { uuid } from 'uuidv4'

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => db.conversations.orderBy('updatedAt').reverse().toArray()
  })
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = uuid()
      const now = new Date()
      const conversation = { ...data, id, createdAt: now, updatedAt: now }
      await db.conversations.add(conversation)
      return conversation
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }
  })
}
```

### TanStack Router 파일 기반 라우팅

```typescript
// src/routes/__root.tsx (루트 레이아웃)
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  )
})
```

```typescript
// src/routes/index.tsx (메인 페이지)
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage
})
```

```typescript
// src/routes/chat.$conversationId.tsx (동적 라우트)
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/$conversationId')({
  component: ChatPage,
  loader: ({ params }) => {
    // 타입 안전한 params 접근
    return { conversationId: params.conversationId }
  }
})
```

### Biome 설정

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["node_modules", "dist", ".next"]
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error"
      },
      "style": {
        "noNonNullAssertion": "warn"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "es5"
    }
  }
}
```

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "biome check .",
    "format": "biome format --write .",
    "test": "vitest"
  }
}
```

### react-markdown + 코드 하이라이팅

```typescript
// src/components/MarkdownMessage.tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { copyToClipboard } from '@/lib/copy'

export const MarkdownMessage = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <div className="relative group">
              <pre className={className}>
                <code {...props}>{children}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(String(children))}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
              >
                복사
              </button>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
```

## 정보 출처

- React 19 공식 블로그 (https://react.dev/blog/2024-12-05-react-19) — HIGH confidence
- Vite 공식 문서 (https://vitejs.dev/guide/) — HIGH confidence
- Tailwind CSS v4 공식 블로그 (https://tailwindcss.com/blog/tailwindcss-v4-alpha) — MEDIUM confidence (alpha 버전)
- shadcn/ui 공식 문서 (https://ui.shadcn.com/docs/install) — HIGH confidence
- TanStack Query 공식 문서 (https://tanstack.com/query/latest) — HIGH confidence
- TanStack Router 공식 문서 (https://tanstack.com/router/latest) — HIGH confidence
- Dexie.js 공식 문서 (https://dexie.org/) — HIGH confidence
- Biome 공식 문서 (https://biomejs.dev/) — HIGH confidence
- react-markdown GitHub (https://github.com/remarkjs/react-markdown) — HIGH confidence

**참고:** 웹 검색 도구 제한으로 인해 일부 정보는 훈련 데이터 기반으로, MEDIUM confidence로 표시됩니다. 프로덕션 사용 전 공식 문서 확인을 권장합니다.

---
*OpenRouter Chat 스택 조사*
*조사일: 2026-03-30*
