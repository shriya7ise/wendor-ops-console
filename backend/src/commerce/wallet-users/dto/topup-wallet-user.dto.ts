import { IsIn, IsNumber, Min } from 'class-validator';

// Powers the "Actions" -> top-up flow, which also feeds the recharge
// history shown next to the balance (PRD "Anything Else We Can Add").
export class TopupWalletUserDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsIn(['UPI', 'Card', 'Cash', 'Net Banking'])
  mode!: 'UPI' | 'Card' | 'Cash' | 'Net Banking';
}
