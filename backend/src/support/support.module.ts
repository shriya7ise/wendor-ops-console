import { Module } from '@nestjs/common';
import { ServiceTicketsModule } from './service-tickets/service-tickets.module';
import { FeatureRequestsModule } from './feature-requests/feature-requests.module';
import { ConsumerHelpCenterModule } from './consumer-help-center/consumer-help-center.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';
import { VendorAcademyModule } from './vendor-academy/vendor-academy.module';

// PRD 3.2 — Support
@Module({
  imports: [
    ServiceTicketsModule,
    FeatureRequestsModule,
    ConsumerHelpCenterModule,
    AiAssistantModule,
    VendorAcademyModule,
  ],
})
export class SupportModule {}
