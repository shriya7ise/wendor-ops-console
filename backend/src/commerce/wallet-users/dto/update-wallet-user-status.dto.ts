import { IsIn } from 'class-validator';

export class UpdateWalletUserStatusDto {
  @IsIn(['Active', 'Blocked'])
  status!: 'Active' | 'Blocked';
}
