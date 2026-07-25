import { Injectable } from '@nestjs/common';
import { OVERVIEW_MOCK } from './overview.mock';
import { StockOverview } from './interfaces/overview.interface';

// PRD 2.2.2.1 — Stock Management Overview. This is a rollup dashboard;
// in a real data layer it would aggregate across the other 9 stock
// management modules rather than holding its own mock state.
@Injectable()
export class OverviewService {
  get(): StockOverview {
    return OVERVIEW_MOCK;
  }
}
