import { IsOptional, IsString } from 'class-validator';

export class AskAiDto {
  @IsString()
  question!: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsString()
  personaId?: string;
}
