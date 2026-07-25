import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QuerySettlementsDto {
  @IsOptional()
  @IsString()
  search?: string; // matches Settlement ID, Merchant ID, or Gateway

  @IsOptional()
  @IsString()
  gateway?: string;

  @IsOptional()
  @IsString()
  serviceProvider?: string;

  @IsOptional()
  @IsString()
  machine?: string; // filter settlements that include this machine

  @IsOptional()
  @IsIn(['Active', 'Inactive'])
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
