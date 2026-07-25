import { Module } from '@nestjs/common';
import { OverviewModule } from './overview/overview.module';
import { StockLocationsModule } from './stock-locations/stock-locations.module';
import { ItemsInStockModule } from './items-in-stock/items-in-stock.module';
import { VendorsModule } from './vendors/vendors.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { ReturnOrdersModule } from './return-orders/return-orders.module';
import { StockTransfersModule } from './stock-transfers/stock-transfers.module';
import { StockAuditsModule } from './stock-audits/stock-audits.module';
import { DayEndStockModule } from './day-end-stock/day-end-stock.module';
import { StockLocationLedgerModule } from './stock-location-ledger/stock-location-ledger.module';

@Module({
  imports: [
    OverviewModule,
    StockLocationsModule,
    ItemsInStockModule,
    VendorsModule,
    PurchaseOrdersModule,
    ReturnOrdersModule,
    StockTransfersModule,
    StockAuditsModule,
    DayEndStockModule,
    StockLocationLedgerModule,
  ],
})
export class StockManagementModule {}
