import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ReportsModule } from './reports/reports.module';
import { ReportModule } from './report/report.module';
import { OrgContextMiddleware } from './common/middleware/org-context.middleware';

// --- her modules (sarathi-labs-main / wendor-backend) -----------------
// These currently run on in-memory mock data (no Prisma models yet).
// Kept as-is per plan: wire to Prisma later, once schemas exist for
// orders/refunds/claims/commerce/billing/support.
import { OrdersModule } from './orders/orders.module';
import { RefundsModule } from './refunds/refunds.module';
import { OngoingModule } from './ongoing/ongoing.module';
import { CancelledCartModule } from './cancelled-cart/cancelled-cart.module';
import { ClaimsModule } from './claims/claims.module';
import { ProductsModule } from './commerce/products/products.module';
import { StockManagementModule } from './commerce/stock-management/stock-management.module';
import { SettlementsModule } from './commerce/settlements/settlements.module';
import { WalletUsersModule } from './commerce/wallet-users/wallet-users.module';
import { BillingModule } from './billing/billing.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AnalyticsModule,
    ReportsModule,
    ReportModule,
    // her modules
    OrdersModule,
    RefundsModule,
    OngoingModule,
    CancelledCartModule,
    ClaimsModule,
    ProductsModule,
    StockManagementModule,
    SettlementsModule,
    WalletUsersModule,
    BillingModule,
    SupportModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Applied to every route, every method (GET/POST/etc). Her mock
    // modules don't read org context yet, so this is a no-op for them
    // until they're wired to Prisma.
    consumer.apply(OrgContextMiddleware).forRoutes('*');
  }
}
