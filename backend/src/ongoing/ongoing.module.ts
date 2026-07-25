import { Module } from '@nestjs/common';
import { OngoingController } from './ongoing.controller';
import { OngoingService } from './ongoing.service';

@Module({
  controllers: [OngoingController],
  providers: [OngoingService],
})
export class OngoingModule {}
