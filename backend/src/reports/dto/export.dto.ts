import { IsEnum, IsInt, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ExportStatus, ExportType } from '@prisma/client';

export class CreateExportDto {
  @IsEnum(ExportType)
  type!: ExportType;

  // Whatever the source screen's filter bar had selected — date range,
  // machine/employee ids, etc. Stored as-is and replayed by the worker.
  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;
}

export class ListExportsQueryDto {
  @IsOptional()
  @IsEnum(ExportType)
  type?: ExportType;

  @IsOptional()
  @IsEnum(ExportStatus)
  status?: ExportStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
