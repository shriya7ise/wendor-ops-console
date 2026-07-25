import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DateRangeQueryDto } from './date-range.dto';

// Analytics > Operations & Workforce > Org Attendance & Discipline (1.9.7)
export class OrgAttendanceQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsString()
  clusterId?: string;

  // Hour-of-day (24h) at/after which a check-in counts as late. Exposed as
  // a filter per the spec rather than hardcoded, since different orgs run
  // different shift starts.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(23)
  lateThresholdHour?: number = 10;
}
