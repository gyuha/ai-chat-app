import { useState } from "react"
import { useEffect } from "react"
import { liveQuery } from "dexie"
import { db, type Conversation, type Message } from "@/db"

// Generic liveQuery bridge for React
function useLiveQuery<T>(
  query: () => T | Promise<T>,
  deps: unknown[]
): T | undefined {
  const [value, setValue] = useState<T | undefined>(undefined)

  useEffect(() => {
    const subscription = liveQuery(query).subscribe({
      next: setValue,
      error: (err) => console.error("LiveQuery error:", err),
    })
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return value
}

// Conversations list (sorted by updatedAt desc)
export function useConversations(): Conversation[] {
  return useLiveQuery(
    () => db.conversations.orderBy("updatedAt").reverse().toArray(),
    []
  ) ?? []
}

// Messages for a specific conversation (sorted by createdAt asc)
export function useMessages(conversationId: number | null): Message[] {
  return useLiveQuery(
    () =>
      conversationId
        ? db.messages
            .where("conversationId")
            .equals(conversationId)
            .sortBy("createdAt")
        : [],
    [conversationId]
  ) ?? []
}

// Single conversation by ID
export function useConversation(
  id: number | null
): Conversation | undefined {
  return useLiveQuery(
    () => (id ? db.conversations.get(id) : undefined),
    [id]
  )
}

// Setting value by key
export function useSetting(key: string): string | undefined {
  return useLiveQuery(
    async () => {
      const setting = await db.settings.get(key)
      return setting?.value
    },
    [key]
  )
}

// Create new conversation
export async function createConversation(
  title: string = "새 대화"
): Promise<number> {
  const id = await db.conversations.add({
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  return id as number
}

// Add message to conversation
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
  })
  // Update conversation's updatedAt for sorting
  await db.conversations.update(conversationId, { updatedAt: Date.now() })
}

// Delete conversation and its messages
export async function deleteConversation(id: number): Promise<void> {
  await db.transaction(
    "rw",
    db.conversations,
    db.messages,
    async () => {
      await db.messages.where("conversationId").equals(id).delete()
      await db.conversations.delete(id)
    }
  )
}

// Update conversation title
export async function updateConversationTitle(
  id: number,
  title: string
): Promise<void> {
  await db.conversations.update(id, { title, updatedAt: Date.now() })
}