import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryWalletUsersDto {
  // "Search by name, RFID or phone" — as spelled out in the PRD field table.
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['Active', 'Blocked'])
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
