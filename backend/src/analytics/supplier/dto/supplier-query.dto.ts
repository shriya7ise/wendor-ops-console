import { IsOptional, IsString } from 'class-validator';
import { DateRangeQueryDto } from '../../../common/dto/date-range.dto';

export class SupplierQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsString()
  supplierId?: string;

  // Free-text search, matched against name/code, used by the autocomplete
  @IsOptional()
  @IsString()
  supplier?: string;
}
