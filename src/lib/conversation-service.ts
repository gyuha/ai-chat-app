import { appDb, type ConversationRecord } from '@/lib/app-db';
import { getSettings } from '@/lib/settings-service';

const DEFAULT_CONVERSATION_TITLE = '새 대화';

type ConversationMetadataPatch = Partial<
  Pick<ConversationRecord, 'modelId' | 'systemPrompt' | 'title' | 'updatedAt'>
>;

function getNowIsoString() {
  return new Date().toISOString();
}

function normalizeNullableText(value: string | null | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function normalizeTitle(value: string | null | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : DEFAULT_CONVERSATION_TITLE;
}

export function getConversationDisplayTitle(
  conversation: Pick<ConversationRecord, 'title'> | null | undefined,
) {
  return normalizeTitle(conversation?.title);
}

export async function getConversationById(conversationId: string) {
  return appDb.conversations.get(conversationId) ?? null;
}

export async function listConversations() {
  return appDb.conversations.orderBy('updatedAt').reverse().toArray();
}

export async function createConversationRecord(
  input: Pick<ConversationRecord, 'modelId' | 'systemPrompt' | 'title'>,
) {
  const now = getNowIsoString();
  const conversation: ConversationRecord = {
    id: crypto.randomUUID(),
    createdAt: now,
    modelId: normalizeNullableText(input.modelId),
    systemPrompt: normalizeNullableText(input.systemPrompt),
    title: normalizeTitle(input.title),
    updatedAt: now,
  };

  await appDb.conversations.add(conversation);

  return conversation;
}

export async function createOrReuseDraftConversation() {
  const existingDraft =
    (await appDb.conversations
      .filter((item) => item.modelId === null)
      .first()) ?? null;

  if (existingDraft) {
    const updatedDraft: ConversationRecord = {
      ...existingDraft,
      updatedAt: getNowIsoString(),
    };

    await appDb.conversations.put(updatedDraft);

    return updatedDraft;
  }

  const settings = await getSettings();

  return createConversationRecord({
    modelId: settings.defaultModelId,
    systemPrompt: settings.defaultSystemPrompt,
    title: DEFAULT_CONVERSATION_TITLE,
  });
}

export async function updateConversationMetadata(
  conversationId: string,
  patch: ConversationMetadataPatch,
) {
  const currentConversation = await getConversationById(conversationId);

  if (!currentConversation) {
    return null;
  }

  const nextConversation: ConversationRecord = {
    ...currentConversation,
    modelId:
      patch.modelId === undefined
        ? currentConversation.modelId
        : normalizeNullableText(patch.modelId),
    systemPrompt:
      patch.systemPrompt === undefined
        ? currentConversation.systemPrompt
        : normalizeNullableText(patch.systemPrompt),
    title:
      patch.title === undefined
        ? currentConversation.title
        : normalizeTitle(patch.title),
    updatedAt: patch.updatedAt ?? getNowIsoString(),
  };

  await appDb.conversations.put(nextConversation);

  return nextConversation;
}

export async function updateConversationModel(
  conversationId: string,
  modelId: string | null,
) {
  return updateConversationMetadata(conversationId, {
    modelId,
  });
}
