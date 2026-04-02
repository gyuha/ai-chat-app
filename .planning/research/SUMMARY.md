# Project Research Summary

**Project:** AI Chat Web App (OpenRouter)
**Domain:** Client-side AI chat SPA
**Researched:** 2026-04-02
**Confidence:** MEDIUM

## Executive Summary

This is a client-side-only AI chat application using OpenRouter's free API, styled after ChatGPT's interface. The product is straightforward architecturally -- a React SPA with streaming AI responses, localStorage persistence, and no backend. Experts build this with React 19 + Vite + TypeScript, using Context + useReducer for state and native Fetch with ReadableStream for streaming. The critical technical challenges are proper streaming cleanup (AbortController), XSS prevention in markdown rendering, and localStorage error handling. Features beyond the MVP (search, export, theme switching) are nice-to-haves that should follow core functionality.

The recommended approach prioritizes: (1) getting a working streaming chat loop, (2) proper state management with persistence, (3) secure markdown rendering, then (4) polish features. The main risk is underestimating streaming complexity -- it requires careful lifecycle management and will likely need iteration to feel smooth.

## Key Findings

### Recommended Stack

React 19.x + Vite 6.x + TypeScript 5.x is the clear recommendation. For a client-only AI chat app, this stack balances modern React features (concurrent mode ready) with a fast development experience. Streaming uses native `fetch()` with `ReadableStream` -- no SSE library needed. Tailwind CSS 4.x handles styling with ChatGPT-like dark mode ease.

**Core technologies:**
- **React 19.x** — UI framework with concurrent features
- **Vite 6.x** — fast HMR, native ESM build tool
- **TypeScript 5.x** — type safety at build time
- **Tailwind CSS 4.x** — utility-first styling, dark mode support
- **react-markdown + remark-gfm** — markdown rendering for AI responses
- **react-syntax-highlighter** — code block syntax highlighting
- **Context + useReducer** — state management (sufficient for single-user, localStorage-only app)

### Expected Features

**Must have (table stakes):**
- API Key input with localStorage storage — no auth, key is sole access method
- Conversation CRUD — create, select, delete conversations in sidebar
- Message input with Enter-to-send — standard chat interaction
- AI response streaming — real-time token display, core ChatGPT-like experience
- Free model selector — dropdown of OpenRouter free models
- localStorage persistence — conversations and settings survive refresh
- Auto-scroll message area — new messages scroll into view

**Should have (competitive):**
- Markdown rendering — code blocks, lists, tables in AI responses
- Dark/Light theme toggle — user preference support
- Conversation search — find past messages
- Keyboard shortcuts — power user productivity
- Code block copy button — developer experience

**Defer (v2+):**
- File attachments — free models have vision limitations
- Multi-model comparison view — scope creep
- Cloud sync — requires server architecture
- Mobile native app — separate project

### Architecture Approach

The architecture is a simple React SPA with clear component boundaries. Global state lives in `ChatProvider` (Context + useReducer) that holds conversations, active conversation ID, API key, and selected model. The UI splits into `Sidebar` (conversation list + model selector) and `ChatArea` (message list + streaming message + input). Streaming uses `useRef` to accumulate tokens without triggering excessive re-renders, then periodically updates React state for display. localStorage writes use `requestIdleCallback` to avoid blocking the UI thread.

**Major components:**
1. **ChatProvider** — global state via Context + Reducer, dispatches actions for all state changes
2. **Sidebar** — conversation list, model selector, new conversation button
3. **ChatArea** — message list, streaming message accumulator, text input
4. **StreamingMessage** — uses useRef to accumulate SSE tokens, periodic state flush for smooth UI

### Critical Pitfalls

1. **Streaming without AbortController** — fetch streams don't auto-cancel on unmount; must wire AbortController and cleanup in useEffect, or face memory leaks and "state update on unmounted component" warnings

2. **localStorage QuotaExceededError** — 5-10MB limit per origin; no error handling causes silent data loss; wrap all operations in try/catch and monitor size before writes

3. **Stale Closure in useEffect** — async callbacks capture stale state; use `useRef` to hold fresh references or functional state updates (`setMessages(prev => ...)`)

4. **XSS via Markdown Rendering** — AI can output malicious scripts; use DOMPurify sanitization after markdown parsing, never render AI content unsanitized

5. **Rapid Message State Corruption** — multiple sends race; disable send button during streaming, debounce input

## Implications for Roadmap

Based on research, the following phase structure emerges from feature dependencies and architectural patterns:

### Phase 1: Foundation
**Rationale:** Everything depends on state management infrastructure; sidebar and layout provide early visible progress
**Delivers:** ChatProvider with Context + Reducer, Sidebar with conversation list, MessageInput, basic layout
**Addresses:** API Key input/storage, conversation CRUD, basic message display
**Avoids:** Pitfall 9 (model selection not persisted) — persist settings from day one

### Phase 2: Core Chat Loop
**Rationale:** Streaming is the core technical challenge; get this working before polishing UI
**Delivers:** Working AI chat with streaming responses
**Uses:** Native fetch with ReadableStream, AbortController, useRef accumulation pattern
**Implements:** StreamingMessage component, API integration
**Avoids:** Pitfalls 1 (streaming cleanup), 3 (stale closure), 5 (rapid messages), 7 (missing error handling)

### Phase 3: Data Persistence
**Rationale:** State flows must be complete before adding persistence; verify everything works without persistence first
**Delivers:** localStorage persistence for conversations and settings
**Avoids:** Pitfalls 2 (localStorage quota), 8 (data corruption), 6 (context re-render cascade — consider splitting contexts here)

### Phase 4: Message Rendering
**Rationale:** Markdown rendering and scroll behavior are polish that should follow working chat
**Delivers:** Rich message display with code highlighting, copy buttons, proper scroll behavior
**Avoids:** Pitfalls 4 (XSS), 10 (scroll position lost), 12 (long messages break layout)

### Phase 5: Polish
**Rationale:** UX enhancements that don't affect core functionality
**Delivers:** Theme toggle, conversation search, keyboard shortcuts, empty states
**Avoids:** Pitfall 11 (empty state not handled)

### Phase Ordering Rationale

- **Persistence (Phase 3) deliberately after streaming works** — debugging state + persistence + streaming simultaneously is painful; isolate streaming issues first
- **Message rendering (Phase 4) after persistence** — markdown rendering depends on having actual AI responses to render
- **Polish (Phase 5) last** — these features depend on all foundations working

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Core Chat Loop):** OpenRouter streaming response format not verified (SSE vs chunked transfer encoding) — needs API testing to confirm implementation approach

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** React Context + Reducer pattern is well-documented on react.dev
- **Phase 3 (Persistence):** localStorage patterns are standard, MDN docs are comprehensive
- **Phase 4 (Rendering):** react-markdown + DOMPurify is common pattern

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Standard stack (React/Vite/TS), well-documented; markdown library versions need verification |
| Features | MEDIUM | Based on established product patterns (ChatGPT, Claude web); OpenRouter API specifics not verified |
| Architecture | MEDIUM | Context + Reducer pattern well-documented on react.dev; streaming pattern is standard but needs testing |
| Pitfalls | MEDIUM-HIGH | All pitfalls have clear prevention strategies from official docs; implementation still needs care |

**Overall confidence:** MEDIUM

### Gaps to Address

- **OpenRouter streaming format:** Not confirmed if SSE or chunked transfer; test early in Phase 2 to avoid rework
- **react-markdown v9 API:** Breaking changes from v8; verify compatibility with React 19 before Phase 4
- **Tailwind CSS 4.x configuration:** Newer version may have configuration changes from v3
- **react-syntax-highlighter React 19 compatibility:** Verify before Phase 4

## Sources

### Primary (HIGH confidence)
- [react.dev](https://react.dev) — Context + Reducer patterns, useRef, useEffect cleanup
- [MDN Web APIs](https://developer.mozilla.org) — localStorage, ReadableStream, AbortController, Fetch
- [OpenRouter Docs](https://openrouter.ai/docs) — API errors, rate limits, streaming support

### Secondary (MEDIUM confidence)
- [Vite Guide](https://vite.dev) — Build tool configuration
- [Tailwind CSS](https://tailwindcss.com) — Styling approach
- ChatGPT/Claude web interface patterns — Feature expectations

### Tertiary (LOW confidence)
- Library version recommendations — Training data, not verified with current docs

---
*Research completed: 2026-04-02*
*Ready for roadmap: yes*
