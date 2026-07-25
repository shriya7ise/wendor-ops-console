import { Module } from '@nestjs/common';
import { DayEndStockController } from './day-end-stock.controller';
import { DayEndStockService } from './day-end-stock.service';

@Module({
  controllers: [DayEndStockController],
  providers: [DayEndStockService],
})
export class DayEndStockModule {}
