import { Module } from '@nestjs/common';
import { CancelledCartController } from './cancelled-cart.controller';
import { CancelledCartService } from './cancelled-cart.service';

@Module({
  controllers: [CancelledCartController],
  providers: [CancelledCartService],
})
export class CancelledCartModule {}
