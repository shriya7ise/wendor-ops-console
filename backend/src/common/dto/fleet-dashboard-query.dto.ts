import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeQueryDto } from './date-range.dto';

export type SalesMetric = 'revenue' | 'quantity';

// Analytics > Operations & Workforce > Fleet Dashboard (1.9.9)
export class FleetDashboardQueryDto extends DateRangeQueryDto {
  // Hours since a machine's last transaction/refill event for it to count
  // as "Recently Alive" on the state donut and the Recently Alive stat card.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24 * 30)
  thresholdHours?: number = 48;

  // Which figure "Top/Worst by sales" ranks machines and clusters on.
  @IsOptional()
  @IsIn(['revenue', 'quantity'])
  salesMetric?: SalesMetric = 'revenue';
}