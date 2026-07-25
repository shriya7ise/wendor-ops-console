import { IsIn } from 'class-validator';

export class UpdateProductStatusDto {
  @IsIn(['Active', 'Inactive', 'Out of Stock'])
  status!: 'Active' | 'Inactive' | 'Out of Stock';
}
