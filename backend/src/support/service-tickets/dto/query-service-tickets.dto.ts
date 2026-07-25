import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryServiceTicketDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  machine?: string;

  @IsOptional()
  @IsString()
  escalationPriority?: string;

  @IsOptional()
  @IsString()
  applicationType?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
