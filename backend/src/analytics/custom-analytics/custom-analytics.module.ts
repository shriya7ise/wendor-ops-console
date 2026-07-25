import { Module } from '@nestjs/common';
import { CustomAnalyticsController } from './custom-analytics.controller';

@Module({ controllers: [CustomAnalyticsController] })
export class CustomAnalyticsModule {}
