import { Module } from '@nestjs/common';
import { ItemsInStockController } from './items-in-stock.controller';
import { ItemsInStockService } from './items-in-stock.service';

@Module({
  controllers: [ItemsInStockController],
  providers: [ItemsInStockService],
})
export class ItemsInStockModule {}
