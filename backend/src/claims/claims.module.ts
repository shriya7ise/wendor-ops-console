import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { ReimbursementsModule } from './reimbursements/reimbursements.module';

// PRD 2.1.2 — Claims (Transactions & Commerce)
@Module({
  imports: [ExpensesModule, ReimbursementsModule],
})
export class ClaimsModule {}
