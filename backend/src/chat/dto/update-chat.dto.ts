import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  systemPrompt?: string;
}
