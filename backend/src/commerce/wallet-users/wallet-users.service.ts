import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
  BulkAddWalletUsersDto,
  CreateWalletUserDto,
} from './dto/create-wallet-user.dto';
import { QueryWalletUsersDto } from './dto/query-wallet-users.dto';
import { TopupWalletUserDto } from './dto/topup-wallet-user.dto';
import { UpdateWalletUserStatusDto } from './dto/update-wallet-user-status.dto';
import { WalletUser } from './interfaces/wallet-user.interface';
import {
  MOCK_WALLET_USERS,
  STATUS_OPTIONS,
  TOPUP_MODE_OPTIONS,
} from './wallet-users.mock';

// NOTE: swap-in point for a real data layer (Postgres) — see
// products.service.ts for the same in-memory-mock pattern used elsewhere
// in this codebase. Baseline: in-memory mock array from wallet-users.mock.ts.
@Injectable()
export class WalletUsersService {
  private readonly users: WalletUser[] = MOCK_WALLET_USERS;

  findAll(query: QueryWalletUsersDto) {
    let results = this.users;

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.rfid.toLowerCase().includes(term) ||
          u.phone.includes(term) ||
          u.walletId.toLowerCase().includes(term),
      );
    }
    if (query.status) results = results.filter((u) => u.status === query.status);

    const total = results.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    const summary = {
      totalWalletUsers: total,
      activeCount: results.filter((u) => u.status === 'Active').length,
      blockedCount: results.filter((u) => u.status === 'Blocked').length,
      totalWalletBalance: Math.round(results.reduce((sum, u) => sum + u.balance, 0) * 100) / 100,
    };

    return {
      data: paged,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary,
    };
  }

  findOne(id: string): WalletUser {
    const found = this.users.find((u) => u.id === id);
    if (!found) throw new NotFoundException(`Wallet user ${id} not found`);
    return found;
  }

  private assertUnique(rfid: string, phone: string) {
    const clash = this.users.find((u) => u.rfid === rfid || u.phone === phone);
    if (clash) {
      throw new ConflictException(
        `A wallet user with this RFID or phone already exists (${clash.id})`,
      );
    }
  }

  private buildUser(dto: CreateWalletUserDto, index: number): WalletUser {
    return {
      id: `WU${10001 + this.users.length + index}`,
      name: dto.name,
      walletId: `WLT-${500000 + (this.users.length + index) * 7}`,
      balance: dto.initialBalance ?? 0,
      rfid: dto.rfid,
      phone: dto.phone,
      email: dto.email ?? '',
      status: 'Active',
      createdAt: new Date().toISOString(),
      topups: dto.initialBalance
        ? [
            {
              id: `TOP-INIT-${Date.now()}${index}`,
              amount: dto.initialBalance,
              mode: 'Cash',
              date: new Date().toISOString(),
            },
          ]
        : [],
    };
  }

  // Powers the "New Swift User" action.
  create(dto: CreateWalletUserDto): WalletUser {
    this.assertUnique(dto.rfid, dto.phone);
    const user = this.buildUser(dto, 0);
    this.users.unshift(user);
    return user;
  }

  // Powers the "Bulk Add Users" import action.
  bulkAdd(dto: BulkAddWalletUsersDto): { created: WalletUser[]; skipped: string[] } {
    const created: WalletUser[] = [];
    const skipped: string[] = [];

    dto.users.forEach((userDto, index) => {
      const clash = this.users.find(
        (u) => u.rfid === userDto.rfid || u.phone === userDto.phone,
      );
      if (clash) {
        skipped.push(`${userDto.name} (duplicate RFID/phone, clashes with ${clash.id})`);
        return;
      }
      const user = this.buildUser(userDto, index);
      this.users.unshift(user);
      created.push(user);
    });

    return { created, skipped };
  }

  // Powers the "Actions" column (Active/Blocked toggle).
  updateStatus(id: string, dto: UpdateWalletUserStatusDto): WalletUser {
    const user = this.findOne(id);
    user.status = dto.status;
    return user;
  }

  // Powers the top-up / recharge action, and appends to the top-up
  // history shown in the detail drawer.
  topup(id: string, dto: TopupWalletUserDto): WalletUser {
    const user = this.findOne(id);
    user.balance = Math.round((user.balance + dto.amount) * 100) / 100;
    user.topups.unshift({
      id: `TOP-${id}-${Date.now()}`,
      amount: dto.amount,
      mode: dto.mode,
      date: new Date().toISOString(),
    });
    return user;
  }

  getFilterOptions() {
    return {
      statuses: STATUS_OPTIONS,
      topupModes: TOPUP_MODE_OPTIONS,
    };
  }
}
