import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  BulkAddWalletUsersDto,
  CreateWalletUserDto,
} from './dto/create-wallet-user.dto';
import { QueryWalletUsersDto } from './dto/query-wallet-users.dto';
import { TopupWalletUserDto } from './dto/topup-wallet-user.dto';
import { UpdateWalletUserStatusDto } from './dto/update-wallet-user-status.dto';
import { WalletUsersService } from './wallet-users.service';

// PRD 2.2.4 — Wallet Users
@Controller('commerce/wallet-users')
export class WalletUsersController {
  constructor(private readonly walletUsersService: WalletUsersService) {}

  // GET /api/commerce/wallet-users?search=&status=&page=&limit=
  @Get()
  findAll(@Query() query: QueryWalletUsersDto) {
    return this.walletUsersService.findAll(query);
  }

  // GET /api/commerce/wallet-users/filters — dropdown options
  @Get('filters')
  getFilters() {
    return this.walletUsersService.getFilterOptions();
  }

  // GET /api/commerce/wallet-users/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletUsersService.findOne(id);
  }

  // POST /api/commerce/wallet-users — the "New Swift User" action
  @Post()
  create(@Body() dto: CreateWalletUserDto) {
    return this.walletUsersService.create(dto);
  }

  // POST /api/commerce/wallet-users/bulk-add — the "Bulk Add Users" action
  @Post('bulk-add')
  bulkAdd(@Body() dto: BulkAddWalletUsersDto) {
    return this.walletUsersService.bulkAdd(dto);
  }

  // PATCH /api/commerce/wallet-users/:id/status — the "Actions" column
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateWalletUserStatusDto) {
    return this.walletUsersService.updateStatus(id, dto);
  }

  // PATCH /api/commerce/wallet-users/:id/topup — recharge the wallet
  @Patch(':id/topup')
  topup(@Param('id') id: string, @Body() dto: TopupWalletUserDto) {
    return this.walletUsersService.topup(id, dto);
  }
}
