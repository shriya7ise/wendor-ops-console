import { IsIn, IsInt, IsISO8601, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export type Granularity = 'day' | 'week' | 'month';

export class DateRangeQueryDto {
  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;

  @IsOptional()
  @IsIn(['day', 'week', 'month'])
  granularity?: Granularity = 'week';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  // Resolves defaults the same way the UI does: last ~90 days, this week's
  // end date, so an empty query string still renders something useful.
  resolveRange(): { from: Date; to: Date } {
    const to = this.to ? new Date(this.to) : new Date();
    const from = this.from ? new Date(this.from) : new Date(to.getTime() - 90 * 86_400_000);
    return { from, to };
  }
}
