import { Module } from '@nestjs/common';
import { AnalyticsHubController } from './analytics-hub.controller';

@Module({ controllers: [AnalyticsHubController] })
export class AnalyticsHubModule {}
