import { Module } from '@nestjs/common';
import { StockLocationLedgerController } from './stock-location-ledger.controller';
import { StockLocationLedgerService } from './stock-location-ledger.service';

@Module({
  controllers: [StockLocationLedgerController],
  providers: [StockLocationLedgerService],
})
export class StockLocationLedgerModule {}
