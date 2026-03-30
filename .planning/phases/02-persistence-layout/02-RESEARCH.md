# Phase 2: Persistence + Layout - Research

**Researched:** 2026-03-31
**Domain:** IndexedDB persistence with Dexie.js v4, ChatGPT-style sidebar layout
**Confidence:** HIGH

## Summary

Phase 2 implements two independent tracks: (1) IndexedDB persistence for conversations/messages using Dexie.js v4, and (2) ChatGPT-style sidebar + main content layout with responsive breakpoints. Phase 1 already defined the Dexie.js `settings` table schema. Phase 2 extends it with `conversations` and `messages` tables, then integrates `liveQuery` via `useSyncExternalStore` for reactive data binding. The layout track creates a sidebar shell wrapping the existing (Phase 1) chat UI, with mobile-first responsive behavior.

**Primary recommendation:** Use Dexie.js `liveQuery` + React's `useSyncExternalStore` for reactive conversations. Use a CSS-based sidebar layout (not a drawer) with `hidden md:flex` for the sidebar and a hamburger toggle on mobile. Sidebar width 260px, responsive breakpoint at `lg` (1024px).

---

## User Constraints (from CONTEXT.md)

> No Phase 2 context exists yet. CONTEXT.md will be created after planning discussion. All Phase 1 decisions remain in effect. This research assumes no additional constraints beyond those documented in CLAUDE.md, PROJECT.md, and ROADMAP.md.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | IndexedDB에 대화 데이터(메시지)가 영속적으로 저장된다 | Dexie.js schema + liveQuery integration |
| DATA-02 | IndexedDB에 사용자 설정(API 키, 기본 모델)이 저장된다 | Already implemented in Phase 1 (settings table) |
| UI-01 | ChatGPT와 유사한 좌측 사이드바 + 우측 채팅 영역 레이아웃 | Sidebar layout pattern, responsive breakpoint |
| UI-02 | 반응형 디자인 (모바일 <1024px, 데스크톱 >=1024px) | Tailwind responsive classes, mobile sidebar toggle |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | UI Framework | Project constraint |
| Vite | 8.0.3 | Build Tool | Project constraint |
| TypeScript | 6.0.2 | Type System | Project constraint |

### Persistence
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Dexie.js | 4.4.1 | IndexedDB ORM | All IndexedDB operations |
| `liveQuery` | (built-in) | Reactive queries | Subscribing to DB changes |
| `useSyncExternalStore` | (React 18+) | Bridge between Observable and React | Converting Dexie Observable to React state |

### UI
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | 0.9.5 | Component Library | Sheet (mobile sidebar), button, scroll-area |
| Tailwind CSS | 4.2.2 | Utility CSS | Layout, responsive design |
| lucide-react | (bundled with shadcn) | Icons | Menu icon, close icon, chat icons |

### State & Routing
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zustand | 5.0.12 | Client state | Chat state, UI state (sidebar open) |
| TanStack Query | 5.95.2 | Server state | OpenRouter API calls |
| TanStack Router | 1.168.8 | Routing | /chat route, /settings route |

**Version verification:** All versions verified via npm registry 2026-03-30 (same as Phase 1).

**New installation for Phase 2:**
```bash
pnpm add dexie
# shadcn components (if not already added):
npx shadcn@latest add sheet scroll-area separator
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── api/                  # OpenRouter API calls (Phase 1)
├── components/           # UI components
│   ├── ui/             # shadcn/ui components
│   │   ├── sidebar.tsx  # NEW: sidebar shell
│   │   ├── chat-layout.tsx  # NEW: layout wrapper
│   │   └── sheet.tsx    # shadcn Sheet (mobile sidebar)
│   └── chat/           # Chat-specific components (Phase 1)
├── db/                   # Dexie.js database
│   └── index.ts        # Schema (settings + conversations + messages)
├── hooks/                # Custom React hooks
│   ├── use-chat.ts     # Chat streaming (Phase 1)
│   ├── use-models.ts   # Models query (Phase 1)
│   └── use-db.ts       # NEW: Dexie liveQuery hooks
├── stores/               # Zustand stores
│   ├── chat-store.ts   # Chat state (Phase 1)
│   └── ui-store.ts     # NEW: UI state (sidebar open, current conversation)
└── lib/
    └── utils.ts        # cn() helper
```

### Pattern 1: Dexie.js Schema (Extended for Phase 2)
**What:** Database schema with settings, conversations, and messages tables
**When to use:** DATA-01, DATA-02
**Source:** Dexie.js documentation v4.4.1

```typescript
// src/db/index.ts
import Dexie, { type Table } from "dexie";

export interface Setting {
  key: string;  // "apiKey" | "defaultModel" | "systemPrompt"
  value: string;
}

export interface Conversation {
  id?: number;        // auto-increment
  title: string;
  createdAt: number;  // Date.now()
  updatedAt: number;   // Date.now()
}

export interface Message {
  id?: number;        // auto-increment
  conversationId: number;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;  // Date.now()
}

export class ChatDatabase extends Dexie {
  settings!: Table<Setting>;
  conversations!: Table<Conversation>;
  messages!: Table<Message>;

  constructor() {
    super("OpenRouterChat");
    this.version(1).stores({
      // Phase 1 schema
      settings: "key",
      // Phase 2 schema
      conversations: "++id, updatedAt",
      messages: "++id, conversationId, createdAt",
    });
  }
}

export const db = new ChatDatabase();
```

**Key insight:** Dexie.js v4.4.1 supports compound indexes. `updatedAt` index on conversations enables sorting by most recent.

### Pattern 2: Dexie.js liveQuery + useSyncExternalStore
**What:** Bridge between Dexie's Observable and React state
**When to use:** DATA-01, DATA-02 - any reactive DB query
**Source:** Dexie.js documentation, React docs

```typescript
// src/hooks/use-db.ts
import { useSyncExternalStore } from "react";
import { liveQuery } from "dexie";
import { db } from "@/db";

// Generic hook for reactive Dexie queries
function useLiveQuery<T>(query: () => T | Promise<T>, deps: unknown[] = []): T | undefined {
  return useSyncExternalStore(
    (onStoreChange) => {
      const subscription = liveQuery(query).subscribe({
        next: onStoreChange,
        error: (err) => console.error("LiveQuery error:", err),
      });
      return () => subscription.unsubscribe();
    },
    () => query(),      // Snapshot for client render
    () => query()       // Snapshot for SSR (same in our SPA)
  );
}

// Conversation-specific hooks
export function useConversations(): Conversation[] {
  return useLiveQuery(
    () => db.conversations.orderBy("updatedAt").reverse().toArray(),
    []
  );
}

export function useMessages(conversationId: number | null): Message[] {
  return useLiveQuery(
    () => conversationId
      ? db.messages.where("conversationId").equals(conversationId).sortBy("createdAt")
      : [],
    [conversationId]
  );
}

export function useSetting(key: string): string | undefined {
  return useLiveQuery(
    async () => {
      const setting = await db.settings.get(key);
      return setting?.value;
    },
    [key]
  );
}
```

**Why useSyncExternalStore:** Dexie v4 `liveQuery` returns a TC39 Observable (not a Promise). `useSyncExternalStore` is the idiomatic React 18+ way to subscribe to external observables. It handles SSR (via the third argument, same as client in our SPA) and ensures consistent hydration.

### Pattern 3: UI Store for Sidebar State
**What:** Zustand store for ephemeral UI state (sidebar open/closed, current conversation)
**When to use:** UI-01, UI-02
**Source:** Zustand documentation

```typescript
// src/stores/ui-store.ts
import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;       // Mobile sidebar visibility
  currentConversationId: number | null;
  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCurrentConversation: (id: number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  currentConversationId: null,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCurrentConversation: (currentConversationId) => set({ currentConversationId }),
}));
```

### Pattern 4: ChatGPT-style Layout
**What:** Two-column layout: fixed sidebar + fluid main content
**When to use:** UI-01, UI-02
**Source:** ChatGPT web UI pattern, Tailwind docs

```tsx
// src/components/chat-layout.tsx
import { useUIStore } from "@/stores/ui-store";
import { Sidebar } from "./sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar: always visible at lg+ */}
      <div className="hidden lg:flex lg:flex-col lg:w-[260px] lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar: shown via Sheet/drawer */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[260px]">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content: fills remaining space */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
```

```tsx
// src/components/sidebar.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversations } from "@/hooks/use-db";
import { useUIStore } from "@/stores/ui-store";
import { Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onClose?: () => void;  // Mobile: close button
}

export function Sidebar({ onClose }: SidebarProps) {
  const { setCurrentConversation } = useUIStore();
  const conversations = useConversations();

  return (
    <div className="flex flex-col h-full bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <span className="font-semibold text-foreground">OpenRouter Chat</span>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* New Chat button */}
      <div className="px-3 pb-3">
        <Button variant="outline" className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          새 대화
        </Button>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent"
              onClick={() => setCurrentConversation(conv.id!)}
            >
              {conv.title}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
```

**Responsive strategy:**
- `lg` breakpoint (1024px): sidebar `hidden lg:flex`
- Mobile (<1024px): sidebar hidden by default, toggled via `sidebarOpen` state
- Tailwind classes: `hidden lg:flex` for desktop sidebar, Sheet/overlay for mobile

**Key insight:** Using CSS `hidden lg:flex` (and not a drawer component) for desktop avoids animation/jank issues. Mobile uses conditional rendering with a fixed overlay.

### Pattern 5: Conversation Persistence Hook
**What:** Hook that creates/updates conversations and saves messages to Dexie
**When to use:** DATA-01
**Source:** Dexie.js patterns

```typescript
// src/hooks/use-db.ts (continued)

export async function createConversation(): Promise<number> {
  const id = await db.conversations.add({
    title: "새 대화",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return id as number;
}

export async function addMessage(
  conversationId: number,
  role: Message["role"],
  content: string
): Promise<void> {
  await db.messages.add({
    conversationId,
    role,
    content,
    createdAt: Date.now(),
  });
  // Update conversation's updatedAt
  await db.conversations.update(conversationId, { updatedAt: Date.now() });
}

export async function deleteConversation(id: number): Promise<void> {
  await db.transaction("rw", db.conversations, db.messages, async () => {
    await db.messages.where("conversationId").equals(id).delete();
    await db.conversations.delete(id);
  });
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| IndexedDB access | Raw IDB API | Dexie.js | Already in project constraints; simpler API, better TypeScript |
| Reactive DB queries | useState + useEffect polling | `liveQuery` + `useSyncExternalStore` | Dexie's reactive queries are efficient; polling wastes resources |
| Sidebar on mobile | Complex drawer animation | Conditional rendering with overlay | Simpler, less code, no animation edge cases |
| Sidebar state management | Prop drilling | Zustand ui-store | Already in project constraints |

---

## Common Pitfalls

### Pitfall 1: Dexie liveQuery causing re-render storms
**What goes wrong:** `liveQuery` fires on every DB change, even during initial render.
**Why it happens:** Observable subscribes immediately, triggering multiple renders.
**How to avoid:** Always use `useSyncExternalStore` (handles subscription deduplication) or ensure `query` function is stable (defined outside component or memoized).
**Warning signs:** Console shows excessive re-renders when conversation list updates.

### Pitfall 2: Conversation list not updating after new message
**What goes wrong:** New message saved to DB but conversation list doesn't reflect updated `updatedAt`.
**Why it happens:** `addMessage` doesn't update conversation's `updatedAt`.
**How to avoid:** Always update `updatedAt` on conversation when a message is added (see Pattern 5).
**Warning signs:** Conversations appear in wrong order after sending a message.

### Pitfall 3: Mobile sidebar toggle doesn't close on route change
**What goes wrong:** Sidebar stays open after navigating on mobile.
**Why it happens:** `sidebarOpen` is in ui-store, but navigation doesn't reset it.
**How to avoid:** Reset `sidebarOpen` to `false` when navigation occurs (via TanStack Router `beforeNavigate` or similar).
**Warning signs:** Sidebar overlay persists after clicking a conversation on mobile.

### Pitfall 4: IndexedDB schema migration on future version bump
**What goes wrong:** Adding new tables/indexes requires schema migration.
**Why it happens:** Dexie requires explicit `version()` bump for schema changes.
**How to avoid:** Keep schema changes additive only (Phase 2+); never delete indexes in a live version. Use Dexie's migration API.
**Warning signs:** "DatabaseClosedError" after deploying new version.

### Pitfall 5: Large message content causing IndexedDB quota issues
**What goes wrong:** Very long conversations fill IndexedDB storage.
**Why it happens:** IndexedDB has browser limits (~50MB-GB depending on browser).
**How to avoid:** Phase 3 could implement message pruning; for now, accept as a limitation.
**Warning signs:** QuotaExceededError in console.

---

## Code Examples

### Database Initialization (db/index.ts)
```typescript
// Source: Dexie.js documentation
import Dexie from "dexie";

export class ChatDatabase extends Dexie {
  settings!: Table<Setting>;
  conversations!: Table<Conversation>;
  messages!: Table<Message>;

  constructor() {
    super("OpenRouterChat");
    this.version(1).stores({
      settings: "key",
      conversations: "++id, updatedAt",
      messages: "++id, conversationId, createdAt",
    });
  }
}

export const db = new ChatDatabase();
```

### useSyncExternalStore Bridge
```typescript
// Source: React 18 docs + Dexie.js documentation
import { useSyncExternalStore } from "react";
import { liveQuery } from "dexie";

function useLiveQuery<T>(query: () => T | Promise<T>): T | undefined {
  return useSyncExternalStore(
    (onChange) => {
      const observable = liveQuery(query);
      const sub = observable.subscribe({ next: onChange, error: console.error });
      return () => sub.unsubscribe();
    },
    () => query(),  // Client snapshot
    () => query()   // Server snapshot (same in SPA)
  );
}
```

### Responsive Layout Shell
```tsx
// Source: Tailwind CSS responsive design
<div className="flex h-screen overflow-hidden">
  {/* Sidebar: hidden on mobile, fixed width on desktop */}
  <div className="hidden lg:flex lg:w-[260px] lg:shrink-0">
    <Sidebar />
  </div>
  {/* Main: flex-1 fills remaining space */}
  <main className="flex-1 flex flex-col overflow-hidden">
    {children}
  </main>
</div>
```

### Mobile Sidebar Toggle
```tsx
// Source: ChatGPT mobile pattern
const { sidebarOpen, toggleSidebar } = useUIStore();

// In header (visible on mobile):
<Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
  <Menu className="h-5 w-5" />
</Button>

// Sidebar overlay (shown when sidebarOpen):
{sidebarOpen && (
  <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={toggleSidebar} />
)}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Raw IndexedDB | Dexie.js ORM | 2024+ | Simpler API, TypeScript support, reactive queries |
| useState + useEffect for DB | liveQuery + useSyncExternalStore | 2022+ (React 18) | Efficient reactive updates, no polling |
| Drawer component for mobile sidebar | Conditional overlay rendering | 2024+ | Less complexity, no animation edge cases |
| CSS Grid for sidebar layout | Flexbox with fixed width | 2024 | Simpler, better mobile integration |

**Deprecated/outdated:**
- `use-debounce` for Dexie queries: Not needed with `liveQuery`
- Third-party drawer components for sidebar: Simple conditional rendering suffices

---

## Open Questions

1. **Should conversations auto-save during streaming or only after complete?**
   - What we know: Phase 1 has `streamingContent` in chat store, messages saved after streaming completes in current plan.
   - What's unclear: Whether partial messages (mid-stream) should be persisted.
   - Recommendation: Save only after streaming completes (simpler, less edge cases). Mid-stream save can be Phase 3 optimization.

2. **Should the sidebar show on `/settings` route?**
   - What we know: ChatGPT hides sidebar on settings. Phase 1 plan has `/settings` as a route.
   - What's unclear: Whether Phase 2 layout should apply to all routes.
   - Recommendation: Sidebar applies to chat view only; settings uses a centered card layout (no sidebar). This is Phase 3 work (settings page is Phase 1).

3. **How to handle the initial empty state when no conversations exist?**
   - What we know: UI-04 (Phase 3) covers empty state with welcome message.
   - What's unclear: What to show in sidebar when no conversations.
   - Recommendation: Show "새 대화" button prominently in empty sidebar (Phase 3 CONV-01).

---

## Environment Availability

> Step 2.6: SKIPPED (no external dependencies beyond project dependencies — all required packages are in node_modules or will be installed via shadcn)

---

## Dependencies

### Phase 1 Artifacts (Must Exist Before Phase 2)
| File | Purpose | Status |
|------|---------|--------|
| `src/db/index.ts` | Dexie.js database (Phase 1 defined settings table) | Phase 1 pending implementation |
| `src/stores/chat-store.ts` | Zustand chat state | Phase 1 pending implementation |
| `src/hooks/use-chat.ts` | Chat streaming hook | Phase 1 pending implementation |
| `src/hooks/use-models.ts` | Models query hook | Phase 1 pending implementation |
| `src/components/ui/*` | shadcn/ui components | Phase 1 pending installation |

**Note:** Phase 1 is still in execution (waves 4-5). Phase 2 implementation depends on Phase 1 completing its core components.

### Phase 2 Dependencies on Phase 1
- `use-db.ts` (Phase 2) extends `db` from Phase 1
- Chat layout wraps Phase 1 chat components
- `ui-store.ts` (Phase 2) is independent of Phase 1 stores

---

## Sources

### Primary (HIGH confidence)
- [Dexie.js Documentation](https://dexie.org/docs/) — Schema design, liveQuery, Observable API
- [React useSyncExternalStore Documentation](https://react.dev/reference/react/useSyncExternalStore) — Official React docs for subscribing to external stores
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design) — Breakpoint utilities
- [Zustand Documentation](https://zustand.docs.pmnd.rs/) — State management patterns

### Secondary (MEDIUM confidence)
- [ChatGPT UI Layout Patterns](https://chat.openai.com) — Web UI observation for sidebar dimensions and behavior
- [TanStack Router Documentation](https://tanstack.com/router/latest) — File-based routing, navigation hooks
- [shadcn/ui Sheet Component](https://ui.shadcn.com/docs/components/sheet) — Mobile sidebar alternative

### Tertiary (LOW confidence)
- Community Dexie.js + React integration patterns (not officially documented)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Dexie.js, React 18+ patterns, Tailwind v4 all verified
- Architecture: HIGH — Patterns match official docs and established practices
- Pitfalls: MEDIUM — Common Dexie.js + React issues, some from documentation

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (30 days — Dexie.js and React patterns are stable)
