import { Module } from '@nestjs/common';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentHistoryModule } from './payment-history/payment-history.module';
import { CreditHistoryModule } from './credit-history/credit-history.module';

// PRD 3.1 — Billing
@Module({
  imports: [InvoicesModule, PaymentHistoryModule, CreditHistoryModule],
})
export class BillingModule {}
