import { IsString, IsOptional } from 'class-validator';

export class ChatCompletionDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  chatId?: string;

  @IsOptional()
  @IsString()
  model?: string;
}
