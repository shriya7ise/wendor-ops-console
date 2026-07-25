import { IsIn, IsOptional } from 'class-validator';
import { MachineQueryDto } from '../../analytics/machine-analytics/machine-query.dto';

// Step 4 (1.9.20): the gap-closure doc flagged "confirm both tabs actually
// render distinct data, not the same query with a relabeled header" — they
// didn't exist as a real control at all (frontend had no tab UI, backend had
// no period param). This DTO adds the `period` switch the Weekly/Monthly
// tabs drive; when the caller hasn't pinned an explicit from/to, the service
// derives genuinely different ranges (last 7 days vs. last 30 days) so the
// two tabs are provably not the same query twice.
export class ProfitOptimizationQueryDto extends MachineQueryDto {
  @IsOptional()
  @IsIn(['week', 'month'])
  period?: 'week' | 'month' = 'week';
}
