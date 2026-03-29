import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @IsString()
  @IsOptional()
  model?: string;
}
