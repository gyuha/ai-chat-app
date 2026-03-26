export class ConversationMessageDto {
  id!: string;
  role!: 'user' | 'assistant';
  content!: string;
}
