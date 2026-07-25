import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeQueryDto } from './date-range.dto';

// Analytics > Supply Chain > Failure Analytics (1.9.14)
export class FailureAnalyticsQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsString()
  machineId?: string;

  @IsOptional()
  @IsString()
  clusterId?: string;

  // Hour-of-day (24h) window on reportedAt, for the "time of day" filter —
  // e.g. isolate failures that only happen overnight.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(23)
  hourFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(23)
  hourTo?: number;

  inTimeOfDayWindow(reportedAt: Date): boolean {
    if (this.hourFrom === undefined || this.hourTo === undefined) return true;
    const h = reportedAt.getHours();
    // Supports overnight windows (e.g. 22 -> 6) as well as same-day ones.
    return this.hourFrom <= this.hourTo ? h >= this.hourFrom && h <= this.hourTo : h >= this.hourFrom || h <= this.hourTo;
  }
}