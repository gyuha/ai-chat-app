import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  systemPrompt?: string;
}
