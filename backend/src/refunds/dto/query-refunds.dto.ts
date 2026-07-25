import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryRefundsDto {
  @IsOptional()
  @IsString()
  search?: string; // matches Refund ID or Transaction ID

  @IsOptional()
  @IsIn(['Refunded', 'Pending', 'Failed', 'Disabled'])
  status?: string;

  @IsOptional()
  @IsString()
  refundType?: string;

  @IsOptional()
  @IsString()
  paymentMode?: string;

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
