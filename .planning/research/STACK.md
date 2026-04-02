# Technology Stack

**Project:** AI Chat Web App (OpenRouter)
**Researched:** 2026-04-02
**Research Mode:** Stack recommendation
**Confidence:** LOW (web search tools unavailable, based on training data)

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 19.x | UI framework | Latest stable, concurrent features |
| Vite | 6.x | Build tool | Fast HMR, native ESM, standard for React |
| TypeScript | 5.x | Type safety | Catch errors at build time, better DX |

### Database / Persistence
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| localStorage | Native | Chat persistence | Already in spec, no extra dependency |
| @tanstack/react-query | 5.x | Server state | Caches API responses, manages loading/error states (optional for simple app) |

### Streaming / SSE Handling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Native Fetch API | ES2017+ | Streaming requests | ReadableStream support in all modern browsers, no library needed |
| eventsource | 3.x | SSE fallback | Only if OpenRouter uses Server-Sent Events (most AI APIs use chunked transfer) |

**Recommendation:** Use native `fetch()` with `response.body.getReader()` for streaming. This is the modern (2024-2025) standard approach for AI streaming. No external SSE library required.

### Chat UI Components
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-markdown | 9.x | Render AI markdown responses | AI responses are markdown-formatted |
| remark-gfm | 4.x | GitHub Flavored Markdown | Tables, task lists in AI responses |
| react-syntax-highlighter | 15.x | Code block syntax highlighting | AI generates code |
| date-fns | 4.x | Timestamp formatting | Human-readable message times |

**Recommendation:** Avoid heavy UI component libraries (MUI, Ant, etc). ChatGPT-style UI is custom and lightweight. Use Tailwind CSS for styling.

### Styling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.x | Utility-first CSS | Rapid UI development, consistent design system, ChatGPT-like dark mode easy |
| @tailwindcss/typography | 0.5.x | Prose styling | Beautiful markdown rendering out of box |

### State Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Context + useReducer | Built-in | Global state (chats, settings) | Simple app scope, no auth, localStorage sync |
| Zustand | 5.x | Alternative for local state | Simpler than Context, less boilerplate (optional) |

**Recommendation:** Start with React Context + useReducer. Add Zustand only if Context becomes painful. For a single-user app with localStorage, Context is sufficient.

### Utilities
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| uuid | 11.x | Generate message/chat IDs | Unique identifiers for localStorage |
| clsx | 2.x | Conditional classNames | Cleaner JSX className logic |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| State | Context + useReducer | Redux Toolkit | Overkill for single-user, localStorage-only app |
| State | Context + useReducer | Jotai | Good alternative but adds dep for marginal gain |
| Streaming | Native Fetch | @ai-sdk/sdk | Adds framework lock-in, OpenRouter has simple REST API |
| UI Library | Custom + Tailwind | shadcn/ui | Good but adds complexity for custom chat UI |
| Markdown | react-markdown | marked | react-markdown has React integration, safer |
| Persistence | localStorage | IndexedDB | Spec says localStorage only, simpler |

## Installation

```bash
# Core
npm create vite@latest . -- --template react-ts
npm install react react-dom

# Streaming (none needed - native fetch sufficient)
# If SSE needed:
npm install eventsource

# Chat UI
npm install react-markdown remark-gfm react-syntax-highlighter date-fns uuid clsx

# Styling
npm install -D tailwindcss @tailwindcss/typography autoprefixer postcss
npx tailwindcss init -p

# State (optional - may not need)
npm install zustand  # only if Context becomes painful
```

## Sources

- [React 19 Docs](https://react.dev) - Training data
- [Vite 6 Guide](https://vite.dev) - Training data
- [Tailwind CSS](https://tailwindcss.com) - Training data
- [MDN Fetch Streaming](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) - Official docs

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| React/Vite/TypeScript | MEDIUM | Standard stack, stable releases |
| Streaming approach | MEDIUM | Native Fetch + ReadableStream is well-documented |
| Styling (Tailwind) | MEDIUM | Industry standard in 2025 |
| Markdown libraries | LOW | Training data, not verified with current docs |
| State management | MEDIUM | Context/useReducer is standard React pattern |

## Research Flags

- [ ] Verify react-markdown@9.x API (breaking changes from v8)
- [ ] Verify Tailwind CSS 4.x configuration (newer version, may have changes)
- [ ] Verify OpenRouter streaming response format (SSE vs chunked)
- [ ] Verify react-syntax-highlighter compatibility with React 19

## Deferrable Decisions

1. **Add @tanstack/react-query?** Only if caching API responses becomes painful
2. **Add Zustand?** Only if Context boilerplate becomes problematic
3. **Add IndexedDB wrapper?** Only if localStorage performance becomes an issue at scale
