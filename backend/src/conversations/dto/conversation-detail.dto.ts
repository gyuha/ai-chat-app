import { ConversationMessageDto } from './conversation-message.dto';

export class ConversationDetailDto {
  id!: string;
  title!: string;
  messages!: ConversationMessageDto[];
}
