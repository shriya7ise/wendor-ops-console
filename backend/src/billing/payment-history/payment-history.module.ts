import { Module } from '@nestjs/common';
import { PaymentHistoryController } from './payment-history.controller';
import { PaymentHistoryService } from './payment-history.service';

@Module({
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
