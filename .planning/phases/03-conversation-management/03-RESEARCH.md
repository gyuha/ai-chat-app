# Phase 3: Conversation Management - Research

**Researched:** 2026-03-31
**Domain:** Conversation CRUD, theme system, empty states
**Confidence:** HIGH

## Summary

Phase 3 adds conversation management features (new, edit title, delete), a theme system (dark/light/system), and refined empty states. Phase 2 already established the foundation: Dexie.js schema with `conversations` table, `liveQuery` hooks via `useSyncExternalStore`, Zustand `ui-store` for sidebar/conversation state, and ChatGPT-style sidebar layout. Phase 3 extends these patterns without introducing new paradigms.

**Primary recommendation:** Add a Zustand theme store with localStorage persistence for theme preference. Use shadcn AlertDialog for delete confirmations. Implement auto-title generation in `handleSend` by updating conversation title after the first user message is persisted. Use Tailwind `class` strategy (`.dark` class on `<html>`) consistent with shadcn/ui v0.9.x and Tailwind v4.

---

## User Constraints (from CONTEXT.md)

> No CONTEXT.md exists for Phase 3. All decisions flow from CLAUDE.md, PROJECT.md, ROADMAP.md, and REQUIREMENTS.md.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONV-01 | 사용자가 "새 대화" 버튼으로 새 대화를 시작할 수 있다 | Sidebar button → createConversation() already in use-db.ts; needs proper integration |
| CONV-02 | 앱이 대화 목록을 최신순으로 표시한다 | ✅ Already implemented — `db.conversations.orderBy("updatedAt").reverse()` in use-db.ts |
| CONV-03 | 앱이 대화 제목을 첫 메시지 기반으로 자동 생성한다 | Update title via `updateConversationTitle()` after first user message in handleSend |
| CONV-04 | 사용자가 대화 제목을 수동 편집할 수 있다 | Inline input in sidebar list item; calls `updateConversationTitle()` |
| CONV-05 | 사용자가 대화를 삭제할 수 있다 (확인 다이얼로그 포함) | shadcn AlertDialog + delete button per conversation item |
| CONV-06 | 모바일에서 사이드바를 토글할 수 있다 | ✅ Already implemented — hamburger + overlay in chat-layout.tsx |
| UI-03 | 다크모드/라이트모드 지원 (시스템 테마 감지 + 수동 전환) | Zustand theme store + localStorage + Tailwind `class` strategy |
| UI-04 | 빈 상태에서 환영 메시지와 API 키 미등록 안내가 표시된다 | Two empty states: ApiKeySetup (no API key) + "대화를 시작하세요" card (API key set, no conversation) |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | UI Framework | Project constraint |
| Vite | 8.0.3 | Build Tool | Project constraint |
| TypeScript | 6.0.2 | Type System | Project constraint |

### UI Components
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | 0.9.5 | Component Library | AlertDialog for delete confirmations |
| @radix-ui/react-alert-dialog | (via shadcn) | Delete confirmation modal | CONV-05 |
| Tailwind CSS | 4.2.2 | Utility CSS | Layout, dark mode |
| lucide-react | 1.7.0 | Icons | Sun, Moon, Monitor icons for theme |

### State & Persistence
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zustand | 5.0.12 | Theme state | UI-03 theme preference |
| Dexie.js | 4.4.1 | IndexedDB ORM | Already in project |
| localStorage | (native) | Theme persistence | UI-03 (simpler than Dexie for theme) |

**New installation for Phase 3:**
```bash
npx shadcn@latest add alert-dialog
pnpm add @radix-ui/react-alert-dialog
```

**Version verification:** All package versions verified via npm registry 2026-03-30.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── alert-dialog.tsx  # NEW: shadcn alert-dialog
│   │   └── (existing)
│   └── sidebar.tsx            # MODIFIED: title edit, delete, theme toggle
├── hooks/
│   ├── use-db.ts              # MODIFIED: updateConversationTitle, deleteConversation
│   └── use-theme.ts           # NEW: theme detection + persistence hook
├── stores/
│   ├── ui-store.ts            # MODIFIED: currentConversationId behavior
│   └── theme-store.ts         # NEW: theme state (light/dark/system)
├── routes/
│   └── home.tsx               # MODIFIED: empty state, auto-title, title edit
└── lib/
    └── utils.ts               # (existing)
```

### Pattern 1: Theme Store (Zustand + localStorage)
**What:** Persist theme preference (light/dark/system) in localStorage, detect system preference via `matchMedia`
**When to use:** UI-03
**Source:** shadcn/ui dark mode docs, Zustand docs

```typescript
// src/stores/theme-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-preference", // localStorage key
    }
  )
)
```

**Apply theme to document:**
```typescript
// src/hooks/use-theme.ts
import { useEffect } from "react"
import { useThemeStore } from "@/stores/theme-store"

export function useTheme() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(mediaQuery.matches ? "dark" : "light")
    }
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [theme])
}
```

**Why localStorage instead of Dexie:** Theme is synchronous (needed on first render before any async), localStorage is simpler, and theme doesn't need Dexie's reactive queries.

### Pattern 2: Auto-Title Generation
**What:** After the first user message is sent and persisted, update conversation title from message content
**When to use:** CONV-03
**Source:** ChatGPT behavior — title is first message preview (truncated to ~40 chars)

```typescript
// In home.tsx handleSend — after first message is persisted
const handleSend = useCallback(async (content: string) => {
  let targetConvId = currentConversationId

  if (!targetConvId) {
    // Create new conversation (initial title is placeholder)
    targetConvId = await createConversation()
    setCurrentConversation(targetConvId)
  }

  // Persist user message
  await addMessage(targetConvId, "user", content)

  // CONV-03: Auto-generate title from first message if this is the first message
  const messages = await db.messages.where("conversationId").equals(targetConvId!).count()
  if (messages === 1) {
    // First message — generate title from content
    const title = content.slice(0, 40).replace(/[#*`_\[\]]/g, "").trim()
    const displayTitle = title + (content.length > 40 ? "..." : "")
    await updateConversationTitle(targetConvId!, displayTitle || "새 대화")
  }

  // Send to API
  await sendMessage(content)
}, [currentConversationId, setCurrentConversation, sendMessage])
```

**Title generation rules:**
- Extract first 40 characters of first user message
- Strip markdown syntax characters (`#*`_"[]` etc.)
- Append "..." if original message > 40 chars
- Fallback to "새 대화" if message is empty/whitespace only

### Pattern 3: Inline Title Editing
**What:** Click conversation title in sidebar to edit inline, Enter to save, Escape to cancel
**When to use:** CONV-04
**Source:** ChatGPT sidebar pattern

```tsx
// Conversation list item in sidebar.tsx
import { useState, useRef, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateConversationTitle, deleteConversation } from "@/hooks/use-db"
import { useUIStore } from "@/stores/ui-store"

function ConversationItem({ conv }: { conv: Conversation }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(conv.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const { currentConversationId, setCurrentConversation } = useUIStore()

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const handleSave = async () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== conv.title) {
      await updateConversationTitle(conv.id!, trimmed)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave()
    if (e.key === "Escape") {
      setEditValue(conv.title)
      setIsEditing(false)
    }
  }

  return (
    <div className="group relative flex items-center gap-1">
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-background px-3 py-1.5 text-sm rounded border border-ring"
          maxLength={40}
        />
      ) : (
        <button
          onClick={() => setCurrentConversation(conv.id!)}
          onDoubleClick={() => setIsEditing(true)}
          className={cn(
            "flex-1 truncate px-3 py-2 rounded-md text-sm text-left transition-colors",
            currentConversationId === conv.id
              ? "bg-accent/10 text-accent"
              : "hover:bg-accent/5"
          )}
          title={conv.title}
        >
          {conv.title}
        </button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100"
        onClick={() => /* open delete dialog */ }
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}
```

### Pattern 4: Delete Confirmation Dialog
**What:** shadcn AlertDialog confirms before deleting conversation
**When to use:** CONV-05
**Source:** shadcn AlertDialog documentation

```tsx
// In sidebar.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Inside ConversationItem
const [deleteOpen, setDeleteOpen] = useState(false)

const handleDelete = async () => {
  await deleteConversation(conv.id!)
  if (currentConversationId === conv.id) {
    setCurrentConversation(null)
  }
  setDeleteOpen(false)
}

// In JSX
<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
  <AlertDialogTrigger asChild>
    <Button variant="ghost" size="icon" className="...">
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>대화 삭제</AlertDialogTitle>
      <AlertDialogDescription>
        정말로 이 대화를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>취소</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        삭제
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Pattern 5: Empty State — Ready but No Conversation
**What:** Show "대화를 시작하세요" card when API key is set but no conversation is selected
**When to use:** UI-04
**Source:** UI-SPEC.md empty state contract

```tsx
// In home.tsx — inside ChatLayout, replacing the placeholder div
{messages.length === 0 && !currentConversationId ? (
  <div className="flex h-full items-center justify-center">
    <div className="text-center space-y-3 max-w-md px-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
        <MessageSquare className="h-6 w-6 text-accent" />
      </div>
      <h2 className="text-xl font-semibold">대화를 시작하세요</h2>
      <p className="text-muted-foreground text-sm">
        질문을 입력해 AI와 대화를 시작하세요.
      </p>
      <Button
        onClick={async () => {
          const id = await createConversation()
          setCurrentConversation(id)
        }}
        className="mt-2"
      >
        새 대화
      </Button>
    </div>
  </div>
) : (
  // Existing message list
  messages.map((msg) => <ChatMessage key={msg.id} ... />)
)}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme persistence | Custom localStorage wrapper | Zustand `persist` middleware | Built-in, tested, simple |
| Delete confirmation | Custom modal | shadcn AlertDialog | Accessible, keyboard-navigable, consistent |
| System theme detection | `window.matchMedia` scattered | `useTheme` hook | Centralized, reactive to system changes |
| Title generation | LLM or complex NLP | Simple string slice + strip | Requirement is simple truncation, not semantic |

---

## Common Pitfalls

### Pitfall 1: Theme flash on initial load
**What goes wrong:** Page loads with wrong theme (light) for ~100ms before JS applies dark class.
**Why it happens:** React renders before `useTheme` effect runs.
**How to avoid:** Add inline `<script>` in `index.html` that reads localStorage and sets class before React hydrates, OR accept minimal flash (acceptable for most apps).
**Warning signs:** Flicker from light to dark on page load.

### Pitfall 2: Auto-title uses unstripped markdown
**What goes wrong:** Title contains markdown syntax like `**bold**` or `# header`.
**Why it happens:** Title is generated from raw message content.
**How to avoid:** Strip `#*`_"[]` characters before truncating (see Pattern 2).
**Warning signs:** Titles showing markdown characters.

### Pitfall 3: Title edit input bleeds outside list item on mobile
**What goes wrong:** Inline input overflows container on narrow screens.
**Why it happens:** No `overflow-hidden` or width constraints on list item.
**How to avoid:** Set `inputRef` width to 100% and constrain parent. Use `flex-1` and `min-w-0`.
**Warning signs:** UI layout breaks on mobile conversation list.

### Pitfall 4: Delete dialog re-renders causing focus loss
**What goes wrong:** AlertDialog causes re-render and focus moves away from trigger.
**Why it happens:** `open` state change triggers re-render.
**How to avoid:** Use `onOpenChange` to control open state; shadcn AlertDialog handles this well.
**Warning signs:** Delete button loses focus immediately after click.

### Pitfall 5: Conversation list sorted incorrectly after delete
**What goes wrong:** Deleted conversation briefly shows in list before removal.
**Why it happens:** Dexie `liveQuery` subscription updates asynchronously.
**How to avoid:** Already handled by `liveQuery` — the subscription fires after delete commits. No action needed.
**Warning signs:** Deleted conversation briefly visible.

---

## Code Examples

### Theme store with persist (Zustand)
```typescript
// Source: Zustand persist middleware docs
import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

export const useThemeStore = create<{ theme: Theme; setTheme: (t: Theme) => void }>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "theme-preference" }
  )
)
```

### Apply Tailwind dark class based on theme
```typescript
// Source: shadcn/ui dark mode docs
useEffect(() => {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (theme === "system") {
    root.classList.add(prefersDark ? "dark" : "light")
  } else {
    root.classList.add(theme)
  }
}, [theme])
```

### Auto-title from first message (in home.tsx)
```typescript
// Source: ChatGPT behavior analysis
const handleSend = useCallback(async (content: string) => {
  let convId = currentConversationId

  if (!convId) {
    convId = await createConversation()
    setCurrentConversation(convId)
  }

  await addMessage(convId, "user", content)

  // CONV-03: If this is the first message, generate title
  const msgCount = await db.messages
    .where("conversationId").equals(convId).count()
  if (msgCount === 1) {
    const raw = content.slice(0, 40).replace(/[#*`_\[\]]/g, "").trim()
    const title = raw + (content.length > 40 ? "..." : "")
    await updateConversationTitle(convId, title || "새 대화")
  }

  await sendMessage(content)
}, [currentConversationId, setCurrentConversation, sendMessage])
```

### Dexie count query (for detecting first message)
```typescript
// Source: Dexie.js documentation
const count = await db.messages
  .where("conversationId").equals(conversationId).count()
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| No theme system | Tailwind class-based dark mode | 2024+ (shadcn v0.8+) | Instant dark/light toggle, no flash |
| useState for theme | Zustand persist store | 2024+ | Persistent across refreshes, simpler |
| Custom delete modal | shadcn AlertDialog | 2024+ | Accessible, keyboard-navigable |
| Hardcoded empty state | Conditional rendering based on API key + conversation | 2024+ | Context-appropriate messaging |

**Deprecated/outdated:**
- CSS variables for theme alone (without class strategy) — requires more JavaScript
- Third-party theme libraries — shadcn's built-in class strategy is sufficient

---

## Open Questions

1. **Should auto-generated title update if user edits the first message?**
   - What we know: Title is generated from first message content once.
   - What's unclear: Whether editing the original message should update the title.
   - Recommendation: No — title is set once at conversation creation. Editing first message does not change title. This matches ChatGPT behavior.

2. **Where should theme toggle UI appear?**
   - What we know: UI-SPEC.md says "sidebar header" with dropdown or icon button.
   - What's unclear: Whether to put it in the sidebar header (next to "OpenRouter Chat") or as a dropdown menu item.
   - Recommendation: Place in sidebar header as a DropdownMenu with Sun/Moon/Monitor icons. DropdownMenu is already installed (via shadcn dropdown-menu).

3. **Should theme apply to settings page too?**
   - What we know: Settings page currently doesn't use ChatLayout (standalone page).
   - What's unclear: Whether theme toggle should be accessible from settings.
   - Recommendation: Theme toggle in sidebar only. Settings page doesn't have sidebar so theme toggle is not needed there.

---

## Environment Availability

> Step 2.6: SKIPPED — no external dependencies beyond project packages (shadcn components to be added via npx shadcn@latest, which is already in project)

**Missing shadcn components to add:**
- `alert-dialog` — via `npx shadcn@latest add alert-dialog`

---

## Validation Architecture

> Note: `nyquist_validation` is explicitly `false` in `.planning/config.json`. Validation Architecture section is informational only and will not be consumed by a validator.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Biome lint + TypeScript typecheck (no formal test framework) |
| Config file | biome.json |
| Quick run command | `pnpm typecheck && pnpm lint` |
| Full suite command | `pnpm build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Manual Verification |
|--------|----------|-----------|---------------------|
| CONV-01 | New conversation button creates DB record | Manual | Click button, verify conversation appears in list |
| CONV-02 | List sorted by updatedAt desc | Manual | Send message, verify conversation moves to top |
| CONV-03 | Title auto-generated from first message | Manual | Send first message, verify title updates |
| CONV-04 | Title editable inline | Manual | Double-click title, edit, press Enter |
| CONV-05 | Delete with confirmation | Manual | Click delete, verify dialog, confirm delete |
| CONV-06 | Mobile sidebar toggle | Manual | Resize < 1024px, verify hamburger works |
| UI-03 | Dark/light/system theme | Manual | Toggle theme, verify colors change |
| UI-04 | Empty states display | Manual | Remove API key, verify empty state; clear conversation, verify welcome |

### Wave 0 Gaps
- None — existing infrastructure (Dexie liveQuery, Zustand stores) covers phase requirements. No new test files needed.

---

## Sources

### Primary (HIGH confidence)
- [shadcn/ui AlertDialog](https://ui.shadcn.com/docs/components/alert-dialog) — Delete confirmation dialog
- [shadcn/ui Dark Mode](https://ui.shadcn.com/docs/dark-mode) — Tailwind class-based theme strategy
- [Zustand persist middleware](https://zustand.docs.pmnd.rs/plugins/persist) — Theme persistence
- [Dexie.js documentation](https://dexie.org/docs/) — count() query, liveQuery

### Secondary (MEDIUM confidence)
- [Tailwind CSS dark mode](https://tailwindcss.com/docs/dark-mode) — class-based dark mode
- [ChatGPT UI behavior](https://chat.openai.com) — Auto-title generation, conversation list behavior

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — shadcn AlertDialog, Zustand persist, Tailwind class strategy all verified via official docs
- Architecture: HIGH — Patterns extend existing Phase 2 architecture without new paradigms
- Pitfalls: MEDIUM — Known issues from community patterns, not all verified via official docs

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (30 days — mature, stable technologies)
