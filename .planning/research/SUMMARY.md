# Project Research Summary

**Project:** OpenRouter Chat
**Domain:** AI ChatGPT-style Web Application (Frontend SPA)
**Researched:** 2026-03-30
**Confidence:** MEDIUM

## Executive Summary

This project is a frontend-only React SPA that communicates directly with OpenRouter's OpenAI-compatible API to provide a ChatGPT-like chat experience. Users bring their own OpenRouter API key, select from free models, and chat with AI in a Markdown-enabled streaming interface with local conversation persistence via IndexedDB.

Research strongly supports a phased build approach: **core chat first**, then **persistence**, then **navigation/settings**. The recommended stack (React 19, Vite, Zustand, TanStack Query, Dexie.js) is verified and production-stable. The biggest risks are streaming edge cases (stream duplication, error handling, AbortController timing) and IndexedDB transaction conflicts. These are well-documented pitfalls with clear mitigations.

Key differentiators for v1 are typing indicators, copy/retry buttons, auto-generated conversation titles, and keyboard shortcuts — all low complexity but high perceived value. Advanced features like voice input, conversation search, and code block execution should be deferred to v2+.

## Key Findings

### Recommended Stack

All technologies verified via npm registry (2026-03-30). The stack is mainstream, stable, and well-suited for a frontend-only AI chat application.

**Core technologies:**
- **React 19.2.4** — UI framework with concurrent features, `use()` hook
- **Vite 8.0.3** — build tool with fast HMR, ESM-native
- **TypeScript 6.0.2** — strict type checking
- **Zustand 5.0.12** — minimal-boilerplate client state, React 19 compatible
- **TanStack Query 5.95.2** — server state, caching, background refetching
- **TanStack Router 1.168.8** — type-safe file-based routing
- **Dexie.js 4.4.1** — IndexedDB ORM with excellent TypeScript support
- **Tailwind CSS 4.2.2 + shadcn/ui 0.9.5** — utility CSS + accessible Radix-based components
- **Biome 2.4.9** — linting and formatting in one tool
- **react-markdown 10.1.0 + remark-gfm 4.0.1 + rehype-highlight 7.0.2** — Markdown rendering with GFM and syntax highlighting

### Expected Features

**Must have (table stakes):**
- API key management (register, save, change, delete) — required by PROJECT.md
- Free model selection via OpenRouter API
- Basic text chat with streaming responses
- Markdown rendering (code blocks, lists, emphasis)
- Conversation list and persistence (IndexedDB via Dexie.js)
- Dark/Light mode via shadcn/ui

**Should have (differentiators for v1):**
- Typing indicator during streaming — natural part of streaming, low complexity
- Copy/Regenerate buttons on responses — low complexity, high value
- Auto-generated conversation titles — low complexity, UX improvement
- Keyboard shortcuts (Cmd+K command palette, Cmd+Enter send) — power user value

**Defer (v2+):**
- Voice input (Web Speech API) — separate effort
- Conversation search (IndexedDB indexing) — separate effort
- Conversation sharing/export — marked as future consideration in PROJECT.md
- Code block execution (sandbox environment) — separate effort
- PWA/offline support — explicitly out of scope per PROJECT.md
- Multi-modal (file attachments) — explicitly out of scope per PROJECT.md
- i18n — Korean-only per PROJECT.md

### Architecture Approach

Standard layered React SPA architecture with clear component boundaries. Component hierarchy flows from `App` (root) to `Sidebar` (conversation list) and `ChatArea` (messaging). State management uses Zustand for client state and TanStack Query for server state. IndexedDB via Dexie is the persistence layer.

**Major components:**
1. **ChatArea** — orchestrates chat flow, holds message list state, communicates with `chatStore` and `apiStore`
2. **MessageList + Message** — renders messages, handles auto-scroll, individual message error boundaries
3. **Sidebar + ConversationList** — navigation, conversation management, stores state via `conversationStore`
4. **SettingsDialog + ChatHeader** — API key management and model selection

**Key patterns to follow:**
- Streaming message state via incremental updates (not waiting for complete response)
- Optimistic UI with rollback on error
- Debounced IndexedDB persistence (500ms debounce)
- API layer abstraction (all OpenRouter calls go through typed `openrouterApi` module)
- `response.clone()` when stream needs multiple consumers

### Critical Pitfalls

1. **Streaming response error suppression** — SSE errors come as `finish_reason: "error"` in data chunks, not HTTP errors. Must check every chunk for this field and handle `finish_reason: "length"` (token exceeded) separately from success.
2. **IndexedDB concurrent transaction conflicts** — Multiple simultaneous writes (especially during streaming) cause `TransactionInactiveError`. Use explicit transactions and debounce writes.
3. **API key client-side exposure** — API key stored in IndexedDB is vulnerable to XSS. Use `type="password"` input, consider AES-GCM encryption (long-term), set CSP headers.
4. **Stream read duplication** — `response.body` can only be read once. Use `response.clone()` before creating multiple readers.
5. **AbortController timing errors** — Calling `abort()` after fetch completion throws `AbortError`. Cancel must happen before or during body reading, not after.

**Moderate pitfalls to address:**
- Rate limit (429) without retry logic — implement exponential backoff
- Token length exceeded (`finish_reason: "length"`) returned as HTTP 200 — must detect and inform user
- Markdown rendering performance — debounce or render after streaming completes
- New conversation interrupting existing stream — use global AbortController management in Zustand
- IndexedDB schema migration — implement migration callbacks in Dexie versioning

## Implications for Roadmap

Based on research, the recommended phase structure:

### Phase 1: Core Chat
**Rationale:** The main chat loop is the core product. Validate streaming API integration before building around it. No persistence until chat works correctly.

**Delivers:** Working chat with streaming AI responses, basic message display with Markdown rendering

**Uses:** React, Vite, TypeScript, Zustand (chatStore), openrouterApi.chat() with ReadableStream, react-markdown

**Avoids:** PITFALL #4 (stream duplication) — use `response.clone()` from the start

### Phase 2: Persistence
**Rationale:** After core chat works, layer in IndexedDB persistence so conversations survive refresh. Debounce writes to avoid transaction conflicts.

**Delivers:** Conversations and messages saved to IndexedDB, survive page refresh

**Uses:** Dexie.js with versioned schema, debounced persistence pattern

**Avoids:** PITFALL #2 (transaction conflicts), PITFALL #10 (schema migration data loss)

### Phase 3: Navigation & Sidebar
**Rationale:** Once persistence works, add conversation management and routing. TanStack Router file-based routes.

**Delivers:** Sidebar with conversation list, routing (`/`, `/chat/:id`), new conversation button

**Uses:** TanStack Router, conversationStore

**Implements:** Architecture component `Sidebar` + `ConversationList`

### Phase 4: Settings & Model Selection
**Rationale:** After basic flow works, add API key management and model selection. This is orthogonal to core chat.

**Delivers:** Settings dialog, API key input with password field, model selector in ChatHeader

**Uses:** settingsStore, openrouterApi.listModels(), encrypted storage consideration

**Avoids:** PITFALL #3 (API key exposure) — use `type="password"` from the start

### Phase Ordering Rationale

- **Core chat first:** No point building UI around a broken streaming implementation
- **Persistence second:** Conversations must survive refresh; this is a table stake
- **Navigation third:** Once persistence is solid, add conversation management
- **Settings last:** API key and model selection are important but don't affect core chat flow

### Research Flags

Phases with standard patterns (skip deep research):
- **Phase 1:** LOW research needed — well-established streaming chat patterns with OpenAI-compatible API, documented in MDN

Phases needing deeper research during planning:
- **Phase 2:** MEDIUM — Dexie.js + Zustand integration patterns may need validation, especially debounce timing
- **Phase 4:** MEDIUM — OpenRouter streaming with TanStack Query v5 specific patterns may differ; verify compatibility

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm registry, mainstream stable technologies |
| Features | MEDIUM | Based on similar app analysis (Open WebUI, Chatbot UI, Chatbox, Vercel AI Chatbot), not user research |
| Architecture | HIGH | Standard React patterns, clear component boundaries, established Zustand + Dexie patterns |
| Pitfalls | HIGH | Official OpenRouter docs for errors/rate limits, MDN for Fetch streaming, well-documented Dexie patterns |

**Overall confidence:** MEDIUM

Research is solid on stack and pitfalls (official docs verified). Feature prioritization is based on competitive analysis, not user interviews. Actual Korean user expectations may differ.

### Gaps to Address

- **User research:** Feature prioritization (table stakes vs differentiators) is based on similar app analysis, not direct user feedback. Korean UI expectations need validation.
- **Performance benchmarks:** No actual testing of streaming latency, Markdown rendering speed, or IndexedDB write frequency. Recommend prototype testing before Phase 3.
- **API key security:** Current plan stores API key in IndexedDB (plaintext). Long-term solution (AES-GCM encryption) is marked as future work but should be designed now to avoid rework.

## Sources

### Primary (HIGH confidence)
- npm registry (verified 2026-03-30) — all package versions
- OpenRouter official docs (openrouter.ai/docs/api/reference) — errors, rate limits, OpenAI-compatible endpoints
- MDN Web Docs (developer.mozilla.org) — Fetch API streaming response bodies
- React 19 documentation — framework features

### Secondary (MEDIUM confidence)
- Open WebUI (GitHub) — feature landscape reference
- Chatbot UI (GitHub) — ChatGPT clone feature reference
- Chatbox (GitHub) — cross-platform chat feature reference
- Vercel AI Chatbot — shadcn/ui + Next.js patterns reference
- Dexie.js documentation — IndexedDB ORM patterns
- TanStack Query v5 documentation — server state patterns
- Zustand community patterns — client state with streaming

### Tertiary (LOW confidence)
- Feature prioritization — competitive analysis only, needs user validation

---

*Research completed: 2026-03-30*
*Ready for roadmap: yes*
