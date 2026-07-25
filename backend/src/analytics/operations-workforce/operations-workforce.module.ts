import { Module } from '@nestjs/common';
import { OperationsWorkforceController } from './operations-workforce.controller';
import { OperationsWorkforceService } from './operations-workforce.service';

@Module({
  controllers: [OperationsWorkforceController],
  providers: [OperationsWorkforceService],
})
export class OperationsWorkforceModule {}
