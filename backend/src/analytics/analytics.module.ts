import { Module } from '@nestjs/common';
import { SupplierAnalyticsController } from './supplier/supplier-analytics.controller';
import { SupplierAnalyticsService } from './supplier/supplier-analytics.service';
import { BusinessPerformanceModule } from './business-performance/business-performance.module';
import { OperationsWorkforceModule } from './operations-workforce/operations-workforce.module';
import { SupplyChainModule } from './supply-chain/supply-chain.module';
import { EntityAnalysisModule } from './entity-analysis/entity-analysis.module';
import { MachineAnalyticsModule } from './machine-analytics/machine-analytics.module';
import { UserAnalyticsModule } from './user-analytics/user-analytics.module';
import { ProfitOptimizationModule } from './profit-optimization/profit-optimization.module';
import { CustomAnalyticsModule } from './custom-analytics/custom-analytics.module';
import { AnalyticsHubModule } from './hub/analytics-hub.module';

// Aggregates every Analytics sub-page into one module so app.module.ts only
// imports one thing. supplier/ is kept as direct controller+service here
// (rather than its own .module.ts) since it predates the others — behaves
// identically either way.
@Module({
  imports: [
    BusinessPerformanceModule,
    OperationsWorkforceModule,
    SupplyChainModule,
    EntityAnalysisModule,
    MachineAnalyticsModule,
    UserAnalyticsModule,
    ProfitOptimizationModule,
    CustomAnalyticsModule,
    AnalyticsHubModule,
  ],
  controllers: [SupplierAnalyticsController],
  providers: [SupplierAnalyticsService],
  exports: [BusinessPerformanceModule],
})
export class AnalyticsModule {}
