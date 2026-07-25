import { IsOptional, IsString } from 'class-validator';
import { DateRangeQueryDto } from '../../../common/dto/date-range.dto';

export class ItemQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  // Free-text search box in the filter bar (matches by name)
  @IsOptional()
  @IsString()
  item?: string;
}

export class BrandQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  warehouseId?: string;

  @IsOptional()
  @IsString()
  clusterId?: string;

  @IsOptional()
  @IsString()
  machineId?: string;
}