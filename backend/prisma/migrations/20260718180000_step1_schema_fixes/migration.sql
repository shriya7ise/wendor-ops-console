-- Step 1 schema fixes — unblocks:
--   • Refill Operations (1.9.5) + User Analytics refill trips (1.9.19): Refill.employeeId
--   • Org Procurement Approval Delay chart (1.9.10): PurchaseOrder.approvedAt/approvedBy
--   • Org Warehouses Analytics (1.9.12, net new) + Org Inventory Risk real
--     stock model (1.9.13): WarehouseLedgerEntry, WarehouseStock
--   • Failure Analytics Slots tab / Slot vs Failures chart (1.9.14): FailureEvent.slot

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('INBOUND', 'OUTBOUND', 'ADJUSTMENT');

-- AlterTable: Refill gets an employeeId FK
ALTER TABLE "Refill" ADD COLUMN "employeeId" TEXT;

-- CreateIndex
CREATE INDEX "Refill_employeeId_eventAt_idx" ON "Refill"("employeeId", "eventAt");

-- AddForeignKey
ALTER TABLE "Refill" ADD CONSTRAINT "Refill_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable: PurchaseOrder gets an approval step
ALTER TABLE "PurchaseOrder" ADD COLUMN "approvedAt" TIMESTAMP(3);
ALTER TABLE "PurchaseOrder" ADD COLUMN "approvedBy" TEXT;

-- CreateIndex
CREATE INDEX "PurchaseOrder_supplierId_approvedAt_idx" ON "PurchaseOrder"("supplierId", "approvedAt");

-- AlterTable: FailureEvent gets a slot reference
ALTER TABLE "FailureEvent" ADD COLUMN "slot" TEXT;

-- CreateIndex
CREATE INDEX "FailureEvent_orgId_slot_idx" ON "FailureEvent"("orgId", "slot");

-- CreateTable
CREATE TABLE "WarehouseLedgerEntry" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productId" TEXT,
    "type" "LedgerEntryType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "isAnomaly" BOOLEAN NOT NULL DEFAULT false,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarehouseLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseStock" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "onHand" INTEGER NOT NULL DEFAULT 0,
    "allocated" INTEGER NOT NULL DEFAULT 0,
    "threshold" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseStock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WarehouseLedgerEntry_orgId_occurredAt_idx" ON "WarehouseLedgerEntry"("orgId", "occurredAt");

-- CreateIndex
CREATE INDEX "WarehouseLedgerEntry_warehouseId_occurredAt_idx" ON "WarehouseLedgerEntry"("warehouseId", "occurredAt");

-- CreateIndex
CREATE INDEX "WarehouseLedgerEntry_productId_occurredAt_idx" ON "WarehouseLedgerEntry"("productId", "occurredAt");

-- CreateIndex
CREATE INDEX "WarehouseLedgerEntry_orgId_isAnomaly_idx" ON "WarehouseLedgerEntry"("orgId", "isAnomaly");

-- CreateIndex
CREATE INDEX "WarehouseStock_orgId_warehouseId_idx" ON "WarehouseStock"("orgId", "warehouseId");

-- CreateIndex
CREATE INDEX "WarehouseStock_productId_idx" ON "WarehouseStock"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseStock_warehouseId_productId_key" ON "WarehouseStock"("warehouseId", "productId");

-- AddForeignKey
ALTER TABLE "WarehouseLedgerEntry" ADD CONSTRAINT "WarehouseLedgerEntry_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseLedgerEntry" ADD CONSTRAINT "WarehouseLedgerEntry_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseLedgerEntry" ADD CONSTRAINT "WarehouseLedgerEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
