import { IsIn } from 'class-validator';

export class UpdateSettlementStatusDto {
  @IsIn(['Active', 'Inactive'])
  status!: 'Active' | 'Inactive';
}
