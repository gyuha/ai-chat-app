# Technology Stack

**Project:** OpenRouter Chat
**Researched:** 2026-03-30
**Confidence:** HIGH (verified via npm registry)

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.2.4 | UI Framework | React 19.2 is current latest. Server Components support, use() hook, improved concurrent features. PROJECT.md specifies React 19 which is correct. |
| Vite | 8.0.3 | Build Tool | Vite 8.x is current stable. Fast HMR, ESM-native dev server, optimal DX. |
| TypeScript | 6.0.2 | Type System | TypeScript 6.0 offers best-in-class type checking, strict mode support for quality code. |

### Package Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| pnpm | (latest) | Package Manager | Fast, disk-efficient, strict node_modules. Confirmed in PROJECT.md. |

### UI Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.2.2 | Utility CSS | Tailwind v4 is stable with improved performance, CSS-first configuration. Confirmed in PROJECT.md. |
| shadcn/ui | 0.9.5 | Component Library | Accessible Radix-based components, copy-paste ownership, customizable. ChatGPT-style UI 구현에 적합. |

### Linting/Formatting
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Biome | 2.4.9 | Lint + Format | Biome 2.x offers fast linting and formatting in one tool, replacing ESLint + Prettier. Better performance than separate tools. |

### State Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Zustand | 5.0.12 | Client State | Minimal boilerplate, React 19 compatible, excellent DX. Confirmed in PROJECT.md. |

### Server State
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| TanStack Query | 5.95.2 | Server State | Best-in-class data fetching, caching, background refetching. Handles API responses elegantly. Confirmed in PROJECT.md. |

### Routing
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| TanStack Router | 1.168.8 | Routing | Type-safe routing, file-based routing option, first-class React 19 support. Confirmed in PROJECT.md. |

### Local Storage
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Dexie.js | 4.4.1 | IndexedDB ORM | Simplest IndexedDB abstraction, excellent TypeScript support, reactive queries. Confirmed in PROJECT.md. |

### Markdown Rendering
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| react-markdown | 10.1.0 | Markdown parsing | Current stable, React 19 compatible, plugin ecosystem. |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown | Tables, strikethrough, task lists support. |
| rehype-highlight | 7.0.2 | Syntax highlighting | Code block highlighting within markdown. |

### HTTP Client
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Built-in fetch | (native) | HTTP Client | OpenRouter has OpenAI-compatible API. Native fetch is sufficient, no axios needed. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| State (global) | Zustand | Redux Toolkit | Zustand has less boilerplate, better performance for this scale. Redux is overkill. |
| State (server) | TanStack Query | SWR | TanStack Query has more mature caching, better devtools, larger ecosystem. |
| IndexedDB | Dexie.js | idb / raw IDB | Dexie has best TypeScript types and simplest API. idb is lower-level. |
| Build Tool | Vite | Next.js / Remix | This is a SPA, no SSR needed. Vite is lighter and faster for pure frontend. |
| CSS Framework | Tailwind v4 | CSS Modules | Tailwind enables rapid ChatGPT-style UI development. |

## Stack Verification

All technologies verified via npm registry as of 2026-03-30:

```
react: 19.2.4
vite: 8.0.3
typescript: 6.0.2
zustand: 5.0.12
@tanstack/react-query: 5.95.2
@tanstack/react-router: 1.168.8
dexie: 4.4.1
tailwindcss: 4.2.2
shadcn-ui: 0.9.5
@biomejs/biome: 2.4.9
react-markdown: 10.1.0
remark-gfm: 4.0.1
rehype-highlight: 7.0.2
```

## Confidence Assessment

| Category | Confidence | Reason |
|----------|------------|--------|
| Core Stack | HIGH | All versions verified via npm registry. Technologies are mainstream and stable. |
| UI Stack | HIGH | Tailwind v4 is stable, shadcn/ui is mature (0.9.5). |
| State Management | HIGH | Zustand 5.x and TanStack Query 5.x are production stable. |
| Routing | MEDIUM | TanStack Router is newer but actively maintained (1.168.8). |
| IndexedDB | HIGH | Dexie 4.x is well-established. |

## Notes

1. **Biome replaces ESLint + Prettier**: Biome 2.x is faster and consolidates linting/formatting into one tool. Consider migrating from Biome 0.x if upgrading.

2. **Tailwind CSS v4**: v4 uses CSS-first configuration (no tailwind.config.js by default). Ensure shadcn/ui templates are compatible.

3. **OpenRouter API**: Uses OpenAI-compatible endpoint. Built-in fetch with `Content-Type: application/json` and `Authorization: Bearer <API_KEY>` header is sufficient. No SDK needed.

## Sources

- npm registry (verified 2026-03-30)
- React 19 documentation
- Vite 8 changelog
- TanStack Query documentation
- Dexie.js documentation
- shadcn/ui official site
