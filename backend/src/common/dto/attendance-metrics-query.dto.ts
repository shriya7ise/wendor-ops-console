import { IsOptional, IsString, Matches } from 'class-validator';

// Analytics > Operations & Workforce > Attendance Metrics (1.9.8)
export class AttendanceMetricsQueryDto {
  // "YYYY-MM" — the whole page is scoped to one month, per spec (Select
  // Month filter, no date-range picker).
  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/, { message: 'month must be in YYYY-MM format' })
  month?: string;

  // Comma-separated employee IDs from the "Filter Members" control. Empty
  // means "all employees".
  @IsOptional()
  @IsString()
  memberIds?: string;

  resolveMonthRange(): { from: Date; to: Date } {
    const now = new Date();
    const [year, month] = (this.month ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
      .split('-')
      .map(Number);
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59, 999);
    return { from, to };
  }

  resolveMemberIds(): string[] | null {
    if (!this.memberIds) return null;
    return this.memberIds.split(',').map((s) => s.trim()).filter(Boolean);
  }
}
