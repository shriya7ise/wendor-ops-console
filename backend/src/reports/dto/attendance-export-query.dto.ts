import { IsISO8601, IsOptional, IsString } from 'class-validator';

// Analytics & Reports > Attendance Exports (1.11) — the dedicated export
// page's own filter bar (Cluster + Start/End Date), separate from the
// generic All Exports screen's filters.
export class AttendanceExportQueryDto {
  @IsOptional()
  @IsString()
  clusterId?: string;

  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;

  resolveRange(): { from: Date; to: Date } {
    const to = this.to ? new Date(this.to) : new Date();
    const from = this.from ? new Date(this.from) : new Date(to.getTime() - 30 * 86_400_000);
    return { from, to };
  }
}
