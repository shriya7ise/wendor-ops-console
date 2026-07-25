import { Module } from '@nestjs/common';
import { EntityAnalysisController } from './entity-analysis.controller';
import { EntityAnalysisService } from './entity-analysis.service';

@Module({
  controllers: [EntityAnalysisController],
  providers: [EntityAnalysisService],
})
export class EntityAnalysisModule {}
