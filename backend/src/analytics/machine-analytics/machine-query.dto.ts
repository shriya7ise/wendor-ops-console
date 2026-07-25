import { IsOptional, IsString } from 'class-validator';
import { DateRangeQueryDto } from '../../common/dto/date-range.dto';

export class MachineQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsString()
  machineId?: string;

  @IsOptional()
  @IsString()
  machine?: string; // free-text search box value
}
