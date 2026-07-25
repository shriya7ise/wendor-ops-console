import { Module } from '@nestjs/common';
import { WalletUsersController } from './wallet-users.controller';
import { WalletUsersService } from './wallet-users.service';

@Module({
  controllers: [WalletUsersController],
  providers: [WalletUsersService],
})
export class WalletUsersModule {}
