import { Module } from '@nestjs/common';
import { ConsumerHelpCenterController } from './consumer-help-center.controller';
import { ConsumerHelpCenterService } from './consumer-help-center.service';

@Module({
  controllers: [ConsumerHelpCenterController],
  providers: [ConsumerHelpCenterService],
})
export class ConsumerHelpCenterModule {}
