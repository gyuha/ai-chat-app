import { IsIn, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsIn(['default', 'bootstrap'])
  mode?: 'default' | 'bootstrap';
}
