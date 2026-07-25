import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ItemQueryDto, BrandQueryDto } from './dto/entity-query.dto';
import { Granularity } from '../../common/dto/date-range.dto';
import { bucketSeries, round2, sum, topBottom } from '../../common/analytics.util';

@Injectable()
export class EntityAnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  async searchItems(orgId: string, term: string) {
    return this.prisma.product.findMany({
      where: { OR: [{ name: { contains: term, mode: 'insensitive' } }, { sku: { contains: term, mode: 'insensitive' } }] },
      select: { id: true, name: true, sku: true },
      take: 10,
    });
  }

  async searchBrands(orgId: string, term: string) {
    return this.prisma.brand.findMany({
      where: { orgId, name: { contains: term, mode: 'insensitive' } },
      select: { id: true, name: true },
      take: 10,
    });
  }

  /** Warehouse options for the Brand Analysis Warehouse filter. */
  async listWarehouses(orgId: string) {
    return this.prisma.warehouse.findMany({ where: { orgId }, select: { id: true, name: true }, orderBy: { name: 'asc' } });
  }

  /** Analytics > Entity Analysis > Single Item Analysis */
  async getItemAnalysis(orgId: string, query: ItemQueryDto) {
    const product = query.productId
      ? await this.prisma.product.findUnique({ where: { id: query.productId } })
      : await this.prisma.product.findFirst({
          where: query.sku ? { sku: query.sku } : { name: { equals: query.item, mode: 'insensitive' } },
        });
    if (!product) throw new NotFoundException('Item not found.');

    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;

    const [tx, refills] = await Promise.all([
      this.prisma.transaction.findMany({ where: { orgId, productId: product.id, createdAt: { gte: from, lte: to }, status: 'COMPLETED' }, include: { machine: { include: { cluster: true } } } }),
      this.prisma.refill.findMany({ where: { orgId, productId: product.id, eventAt: { gte: from, lte: to } }, include: { machine: true } }),
    ]);

    return {
      item: { id: product.id, name: product.name, sku: product.sku },
      range: { from, to, granularity },
      unitsSold: sum(tx.map((t) => t.quantity)),
      revenue: round2(sum(tx.map((t) => Number(t.amount)))),
      refillQty: sum(refills.map((r) => r.quantity)),
      activeMachines: new Set(tx.map((t) => t.machineId)).size,
      salesTrend: bucketSeries(tx, (t) => t.createdAt, (t) => Number(t.amount), from, to, granularity),
      refillTrend: bucketSeries(refills, (r) => r.eventAt, (r) => r.quantity, from, to, granularity),
      salesByMachine: topBottom(tx, (t) => t.machine.name, (t) => Number(t.amount), 5).top,
      salesByCluster: topBottom(tx.filter((t) => t.machine.cluster), (t) => t.machine.cluster!.name, (t) => Number(t.amount), 5).top,
    };
  }

  /** Analytics > Entity Analysis > Brand Analysis
   *  Previously roughly half the spec's widget list — see gap-closure doc.
   *  This pass adds: Granularity/Limit (inherited from DateRangeQueryDto,
   *  now actually exposed in the UI) + Warehouse/Cluster/Machine filters;
   *  the Refill Qty / Active Clusters / Ordered & Received Qty+Value cards;
   *  Top Items/Machines by Sales + Sales by Cluster; a dedicated Refill
   *  Trend chart; the Supply section (PO/Receipts by Warehouse, PO vs.
   *  Receipts trend); and Stockout Signals off WarehouseStock. */
  async getBrandAnalysis(orgId: string, query: BrandQueryDto) {
    const limit = query.limit ?? 5;
    const brand = query.brandId
      ? await this.prisma.brand.findFirst({ where: { id: query.brandId, orgId } })
      : await this.prisma.brand.findFirst({ where: { orgId, name: { equals: query.brand, mode: 'insensitive' } } });
    if (!brand) throw new NotFoundException('Brand not found for this organisation.');

    const { from, to } = query.resolveRange();
    const granularity = (query.granularity ?? 'week') as Granularity;

    const products = await this.prisma.product.findMany({ where: { brandId: brand.id } });
    const productIds = products.map((p) => p.id);

    const machineFilter = {
      ...(query.machineId ? { machineId: query.machineId } : {}),
      ...(query.clusterId ? { machine: { clusterId: query.clusterId } } : {}),
    };

    const tx = await this.prisma.transaction.findMany({
      where: { orgId, productId: { in: productIds }, createdAt: { gte: from, lte: to }, status: 'COMPLETED', ...machineFilter },
      include: { machine: { include: { cluster: true } }, product: true },
    });
    const refills = await this.prisma.refill.findMany({
      where: {
        orgId,
        productId: { in: productIds },
        eventAt: { gte: from, lte: to },
        ...machineFilter,
        ...(query.warehouseId ? { warehouseId: query.warehouseId } : {}),
      },
      include: { machine: { include: { cluster: true } }, product: true, warehouse: true },
    });

    // Supply section: PO items for this brand's products, optionally scoped
    // to one warehouse (PurchaseOrder is the only entity here with a real
    // warehouseId — there's no PO↔cluster/machine link, so Cluster/Machine
    // filters don't apply to the Supply section, only Sales/Refills above).
    const poItems = await this.prisma.purchaseOrderItem.findMany({
      where: {
        productId: { in: productIds },
        purchaseOrder: {
          supplier: { orgId },
          orderedAt: { gte: from, lte: to },
          ...(query.warehouseId ? { warehouseId: query.warehouseId } : {}),
        },
      },
      include: { purchaseOrder: { include: { warehouse: true } } },
    });

    const orderedQty = sum(poItems.map((i) => i.orderedQty));
    const receivedQty = sum(poItems.map((i) => i.receivedQty));
    const orderedValue = round2(sum(poItems.map((i) => i.orderedQty * Number(i.unitCost))));
    const receivedValue = round2(sum(poItems.map((i) => i.receivedQty * Number(i.unitCost))));

    const poReceiptsByWarehouse = topBottom(
      poItems.filter((i) => i.purchaseOrder.warehouse),
      (i) => i.purchaseOrder.warehouse!.name,
      (i) => i.receivedQty,
      limit,
    );
    const poOrderedByWarehouse = topBottom(
      poItems.filter((i) => i.purchaseOrder.warehouse),
      (i) => i.purchaseOrder.warehouse!.name,
      (i) => i.orderedQty,
      limit,
    );
    const poVsReceiptsTrend = bucketSeries(poItems, (i) => i.purchaseOrder.orderedAt ?? from, (i) => i.orderedQty, from, to, granularity).map(
      (bucket, idx) => ({
        label: bucket.label,
        ordered: bucket.value,
        received: bucketSeries(poItems, (i) => i.purchaseOrder.orderedAt ?? from, (i) => i.receivedQty, from, to, granularity)[idx]?.value ?? 0,
      }),
    );

    // Stockout Signals: live stock-on-hand for this brand's products, per
    // warehouse, from WarehouseStock (Low = available <= threshold and > 0,
    // Out = available <= 0).
    const stock = await this.prisma.warehouseStock.findMany({
      where: { orgId, productId: { in: productIds }, ...(query.warehouseId ? { warehouseId: query.warehouseId } : {}) },
      include: { warehouse: true, product: true },
    });
    const stockoutSignals = stock
      .map((s) => {
        const available = s.onHand - s.allocated;
        const severity = available <= 0 ? 'OUT' : available <= s.threshold ? 'LOW' : 'OK';
        return { warehouse: s.warehouse.name, product: s.product.name, onHand: s.onHand, allocated: s.allocated, available, threshold: s.threshold, severity };
      })
      .filter((s) => s.severity !== 'OK')
      .sort((a, b) => a.available - b.available);

    return {
      brand: { id: brand.id, name: brand.name, productCount: products.length },
      range: { from, to, granularity },
      revenue: round2(sum(tx.map((t) => Number(t.amount)))),
      unitsSold: sum(tx.map((t) => t.quantity)),
      refillQty: sum(refills.map((r) => r.quantity)),
      activeMachines: new Set(tx.map((t) => t.machineId)).size,
      activeClusters: new Set(tx.filter((t) => t.machine.cluster).map((t) => t.machine.clusterId)).size,
      orderedQty,
      orderedValue,
      receivedQty,
      receivedValue,
      salesTrend: bucketSeries(tx, (t) => t.createdAt, (t) => Number(t.amount), from, to, granularity),
      refillTrend: bucketSeries(refills, (r) => r.eventAt, (r) => r.quantity, from, to, granularity),
      topItemsBySales: topBottom(tx, (t) => t.product.name, (t) => Number(t.amount), limit).top,
      topMachinesBySales: topBottom(tx, (t) => t.machine.name, (t) => Number(t.amount), limit).top,
      salesByCluster: topBottom(tx.filter((t) => t.machine.cluster), (t) => t.machine.cluster!.name, (t) => Number(t.amount), limit).top,
      refillsByMachine: topBottom(refills, (r) => r.machine.name, (r) => r.quantity, limit).top,
      refillsByItem: topBottom(refills, (r) => r.product.name, (r) => r.quantity, limit).top,
      refillRegularityByMachine: (() => {
        const weeksInRange = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (7 * 86_400_000)));
        const byMachine = new Map<string, Set<number>>();
        for (const r of refills) {
          const weekIdx = Math.floor((r.eventAt.getTime() - from.getTime()) / (7 * 86_400_000));
          const set = byMachine.get(r.machine.name) ?? new Set<number>();
          set.add(weekIdx);
          byMachine.set(r.machine.name, set);
        }
        return [...byMachine.entries()].map(([machine, weeks]) => ({ machine, regularityScorePct: round2((weeks.size / weeksInRange) * 100) }));
      })(),
      supply: {
        poReceiptsByWarehouse: poReceiptsByWarehouse.top,
        poOrderedByWarehouse: poOrderedByWarehouse.top,
        poVsReceiptsTrend,
      },
      stockoutSignals,
    };
  }
}