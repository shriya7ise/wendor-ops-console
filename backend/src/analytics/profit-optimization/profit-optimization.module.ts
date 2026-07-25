import { Module } from '@nestjs/common';
import { ProfitOptimizationController } from './profit-optimization.controller';
import { ProfitOptimizationService } from './profit-optimization.service';

@Module({
  controllers: [ProfitOptimizationController],
  providers: [ProfitOptimizationService],
})
export class ProfitOptimizationModule {}
