import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// Powers the "Create Settlement" action.
export class CreateSettlementDto {
  @IsString()
  @MinLength(2)
  gateway!: string;

  @IsString()
  @MinLength(2)
  merchantId!: string;

  @IsString()
  @MinLength(2)
  serviceProvider!: string;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  machines?: string[] = [];

  @IsOptional()
  @IsIn(['Active', 'Inactive'])
  status?: 'Active' | 'Inactive' = 'Active';
}

// Powers the "Bulk Assign" action — attach many machines to an existing
// settlement account in one call.
export class BulkAssignMachinesDto {
  @IsString()
  settlementId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  machines!: string[];
}
