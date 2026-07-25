import { IsArray, IsBoolean, IsEnum, IsObject, IsOptional } from 'class-validator';
import { ExportType, ScheduleFrequency } from '@prisma/client';

export class CreateScheduleDto {
  @IsEnum(ExportType)
  type!: ExportType;

  @IsEnum(ScheduleFrequency)
  frequency!: ScheduleFrequency;

  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;

  @IsArray()
  recipients!: string[];
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(ScheduleFrequency)
  frequency?: ScheduleFrequency;
}
