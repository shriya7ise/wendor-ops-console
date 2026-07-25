import {
  PrismaClient,
  POStatus,
  MachineStatus,
  TransactionStatus,
  ShipmentStatus,
  ScheduleFrequency,
  ExportType,
  ExportStatus,
  LedgerEntryType,
} from '@prisma/client';

const prisma = new PrismaClient();
const now = Date.now();
const day = 86_400_000;
const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(arr: T[]) => arr[rnd(arr.length)];
const sample = <T,>(arr: T[], n: number) => [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));

// ──────────────────────────────────────────────────────────
// Tunable scale — bump these to grow/shrink the seed dataset
// ──────────────────────────────────────────────────────────
const SCALE = {
  warehouses: 3,            // was 2
  employees: 25,            // was 12
  walletUsers: 150,         // was 40
  posPerSupplier: 35,       // was 20
  refillsPerSupplier: 45,   // was 25
  transactions: 20000,      // was 4000
  attendanceDays: 150,      // was 90
  failureEvents: 150,       // was 60
  shipments: 100,           // was 40
  exportJobs: 40,           // was 18
};

const FIRST_NAMES = [
  'Prashant', 'Rahul', 'Sana', 'Vikram', 'Neha', 'Arjun', 'Priya', 'Karan',
  'Anjali', 'Rohit', 'Divya', 'Sameer', 'Pooja', 'Ankit', 'Meera', 'Yash',
  'Ritu', 'Nikhil', 'Ishaan', 'Tanvi', 'Aditya', 'Kavya', 'Varun', 'Simran',
  'Harsh', 'Aarav', 'Diya', 'Kabir', 'Naina', 'Rajesh', 'Sunita', 'Manish',
  'Deepika', 'Vivek', 'Shreya', 'Gaurav', 'Preeti', 'Amitabh', 'Swati', 'Rakesh',
];
const LAST_NAMES = [
  'Sharma', 'Verma', 'Iyer', 'Nair', 'Kumar', 'Singh', 'Gupta', 'Reddy',
  'Joshi', 'Mehta', 'Kapoor', 'Chatterjee', 'Agarwal', 'Bose', 'Chauhan',
  'Desai', 'Ghosh', 'Malhotra', 'Pillai', 'Rao', 'Saxena', 'Tiwari',
];
const uniqueName = (used: Set<string>) => {
  let name = '';
  do {
    name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  } while (used.has(name));
  used.add(name);
  return name;
};

async function main() {
  const org = await prisma.organisation.upsert({
    where: { id: 'seed-org' },
    update: {},
    create: { id: 'seed-org', name: 'Demo Org' },
  });

  // ── Warehouses ────────────────────────────────────────────
  const warehouseDefs = [
    { name: 'Main Warehouse', code: 'WH-1' },
    { name: 'Secondary Warehouse - Manesar', code: 'WH-2' },
    { name: 'North Hub - Noida', code: 'WH-3' },
    { name: 'South Hub - Faridabad', code: 'WH-4' },
  ].slice(0, SCALE.warehouses);
  const warehouses = await Promise.all(
    warehouseDefs.map((w) =>
      prisma.warehouse.upsert({
        where: { orgId_code: { orgId: org.id, code: w.code } },
        update: {},
        create: { orgId: org.id, name: w.name, code: w.code },
      }),
    ),
  );


  // ── Clusters ───────────────────────────────────────────────
  const clusters = await Promise.all(
    ['Gurgaon Solution Cluster', 'Manesar Cluster', 'Delhi NCR Cluster', 'Noida Cluster', 'Faridabad Cluster', 'Unassigned'].map((name) =>
      prisma.cluster.upsert({
        where: { orgId_name: { orgId: org.id, name } },
        update: {},
        create: { orgId: org.id, name },
      }),
    ),
  );

  // ── Brands ─────────────────────────────────────────────────
  const brands = await Promise.all(
    ['Quick Buying Solutions', 'Nutro Foods', 'Chill Beverages'].map((name) =>
      prisma.brand.upsert({
        where: { orgId_name: { orgId: org.id, name } },
        update: {},
        create: { orgId: org.id, name },
      }),
    ),
  );

  // ── Products (6 per brand, 3 brands = 18) ────────────────────
  const productDefs = [
    // Quick Buying Solutions
    { name: 'Yoga Bar Protein Mini', category: 'Snacks', price: 20 },
    { name: 'Almonds 40g', category: 'Snacks', price: 45 },
    { name: 'Trail Mix 50g', category: 'Snacks', price: 40 },
    { name: 'Roasted Chana 60g', category: 'Snacks', price: 25 },
    { name: 'Protein Bar Choco', category: 'Snacks', price: 60 },
    { name: 'Makhana 30g', category: 'Snacks', price: 35 },
    { name: 'Banana Chips 50g', category: 'Snacks', price: 27 },
    { name: 'Peri Peri Peanuts 40g', category: 'Snacks', price: 30 },
    { name: 'Cheese Crackers 45g', category: 'Snacks', price: 32 },
    { name: 'Nachos 55g', category: 'Snacks', price: 48 },
    // Nutro Foods
    { name: 'Granola Bar Honey', category: 'Health', price: 30 },
    { name: 'Mixed Nuts 45g', category: 'Health', price: 55 },
    { name: 'Oats Cookies', category: 'Health', price: 28 },
    { name: 'Multigrain Chips', category: 'Health', price: 22 },
    { name: 'Peanut Butter Cups', category: 'Health', price: 38 },
    { name: 'Dry Fruit Mix 50g', category: 'Health', price: 65 },
    { name: 'Protein Cookies', category: 'Health', price: 42 },
    { name: 'Quinoa Bar', category: 'Health', price: 50 },
    { name: 'Sugar-Free Granola', category: 'Health', price: 58 },
    { name: 'Millet Puffs 40g', category: 'Health', price: 26 },
    // Chill Beverages
    { name: 'Diet Coke 300ml', category: 'Beverages', price: 40 },
    { name: 'Sparkling Water 300ml', category: 'Beverages', price: 35 },
    { name: 'Cold Coffee 250ml', category: 'Beverages', price: 50 },
    { name: 'Orange Juice 200ml', category: 'Beverages', price: 45 },
    { name: 'Green Tea Bottle 300ml', category: 'Beverages', price: 42 },
    { name: 'Lemon Soda 300ml', category: 'Beverages', price: 30 },
    { name: 'Mango Shake 250ml', category: 'Beverages', price: 55 },
    { name: 'Buttermilk 200ml', category: 'Beverages', price: 25 },
    { name: 'Energy Drink 250ml', category: 'Beverages', price: 60 },
    { name: 'Coconut Water 300ml', category: 'Beverages', price: 48 },
  ];
  const PRODUCTS_PER_BRAND = 10;
  const products = await Promise.all(
    productDefs.map((p, i) =>
      prisma.product.upsert({
        where: { sku: `SKU-${i + 1}` },
        update: {},
        create: {
          sku: `SKU-${i + 1}`,
          name: p.name,
          category: p.category,
          unitPrice: p.price,
          brandId: brands[Math.floor(i / PRODUCTS_PER_BRAND)].id,
        },
      }),
    ),
  );

  // ── Suppliers ──────────────────────────────────────────────
  const suppliers = await Promise.all(
    [
      'Fresh Foods Co',
      'Snack Distributors Ltd',
      'Beverage Partners',
      'Healthy Bites Supply',
      'Metro FoodTrade',
      'Northline Provisions',
      'Capital Snacks Wholesale',
      'Greenfield Beverages',
      'Sunrise Food Traders',
      'Eastline Distribution',
    ].map((name, i) =>
      prisma.supplier.upsert({
        where: { orgId_code: { orgId: org.id, code: `SUP-${i + 1}` } },
        update: {},
        create: { orgId: org.id, name, code: `SUP-${i + 1}` },
      }),
    ),
  );

  // ── Machines (24, spread across clusters, mostly ONLINE) ──────
  const MACHINE_COUNT = 50;
  const curatedMachineNames = [
    'The Oberoi Hotel', 'CEAT-1', 'CEAT-2', 'CIPL (Gurgaon)', 'Taj Vivanta Lobby',
    'DLF Cyber City T1', 'DLF Cyber City T2', 'Genpact Campus', 'Maruti Suzuki HQ',
    'Ambience Mall Food Court', 'IMT Manesar Gate 1', 'IMT Manesar Gate 2',
    'HCL Tech Park', 'Sapient Tower', 'Vatika Business Park', 'Unitech Cyber Park',
    'Global Foyer', 'Two Horizon Center', 'Building 8 - Infosys', 'Building 9 - Infosys',
    'AIPL Business Club', 'Emaar Digital Greens', 'M3M Urbana', 'ILD Trade Centre',
    'Cyber Hub Food Court', 'Airia Mall', 'Worldmark Aerocity', 'One Horizon Center',
    'Spaze IT Park', 'Candor TechSpace', 'JMD Megapolis', 'Vipul Trade Centre',
    'Baani Corporate One', 'Signature Towers', 'Suncity Business Tower',
    'Tikri Metro Station', 'Sector 29 Market', 'Golf Course Road Plaza',
    'Rajiv Chowk Metro Hub', 'Noida Sector 62 IT Park', 'Noida Sector 18 Mall',
    'Great India Place', 'Amity University Gate', 'Botanical Garden Metro',
    'Faridabad Sector 15', 'Crown Interiorz Mall', 'NIT Faridabad Campus',
    'Manesar Industrial Model Township', 'Kherki Daula Toll Plaza',
    'IMT Bawal Gate', 'Sohna Road Junction',
  ];
  const machineNames = Array.from({ length: MACHINE_COUNT }).map((_, i) =>
    curatedMachineNames[i] ?? `Site Kiosk ${i + 1}`,
  );
  const machines = await Promise.all(
    machineNames.map((name, i) => {
      const roll = Math.random();
      const status = roll < 0.08 ? MachineStatus.OFFLINE : roll < 0.14 ? MachineStatus.MAINTENANCE : MachineStatus.ONLINE;
      return prisma.machine.upsert({
        where: { orgId_code: { orgId: org.id, code: `MCH-${i + 1}` } },
        update: {},
        create: {
          orgId: org.id,
          name,
          code: `MCH-${i + 1}`,
          clusterId: clusters[i % clusters.length].id,
          status,
          lat: 28.4 + Math.random() * 0.5,
          lng: 77.0 + Math.random() * 0.5,
        },
      });
    }),
  );

  // ── Employees ──────────────────────────────────────────────
  const usedEmployeeNames = new Set<string>();
  const employees = await Promise.all(
    Array.from({ length: SCALE.employees }).map(() => {
      const name = uniqueName(usedEmployeeNames);
      return prisma.employee.create({
        data: {
          orgId: org.id,
          name,
          role: 'Refill Operator',
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@demo.org`,
        },
      });
    }),
  );

  // ── Wallet users ───────────────────────────────────────────
  const usedWalletNames = new Set<string>();
  await Promise.all(
    Array.from({ length: SCALE.walletUsers }).map((_, i) => {
      const name = uniqueName(usedWalletNames);
      return prisma.walletUser.create({
        data: {
          orgId: org.id,
          name,
          phone: `98${String(10000000 + i).padStart(8, '0')}`,
          balance: rnd(500),
          lastActivityAt: new Date(now - rnd(45) * day),
        },
      });
    }),
  );

  // ── Purchase orders + refills, per supplier ───────────────
  for (const supplier of suppliers) {
    for (let i = 0; i < SCALE.posPerSupplier; i++) {
      const createdAt = new Date(now - (SCALE.posPerSupplier * 3 - i * 3) * day);
      const orderedAt = new Date(createdAt.getTime() + day);
      const leadTime = 2 + rnd(5);
      const status = i % 5 === 0 ? POStatus.CANCELLED : i % 3 === 0 ? POStatus.PARTIAL : POStatus.RECEIVED;
      // Most POs get approved within a day; every 4th one sits for several
      // days so the Approval Delay chart has real variance to show.
      const approvalDelayHours = i % 4 === 0 ? 48 + rnd(72) : 2 + rnd(20);
      const poWarehouse = pick(warehouses);
      const po = await prisma.purchaseOrder.create({
        data: {
          poNumber: `PO-${supplier.code}-${i + 1}`,
          supplierId: supplier.id,
          warehouseId: poWarehouse.id,
          status,
          createdAt,
          approvedAt: status === POStatus.CANCELLED ? null : new Date(createdAt.getTime() + approvalDelayHours * 3_600_000),
          approvedBy: status === POStatus.CANCELLED ? null : pick(employees).name,
          orderedAt,
          expectedAt: new Date(orderedAt.getTime() + leadTime * day),
          receivedAt: status === POStatus.CANCELLED ? null : new Date(orderedAt.getTime() + leadTime * day),
        },
      });
      const poProducts = sample(products, 3 + rnd(5));
      for (const product of poProducts) {
        const orderedQty = 20 + rnd(60);
        const fillRatio = status === POStatus.CANCELLED ? 0 : status === POStatus.PARTIAL ? 0.6 : 1;
        await prisma.purchaseOrderItem.create({
          data: {
            purchaseOrderId: po.id,
            productId: product.id,
            orderedQty,
            receivedQty: Math.floor(orderedQty * fillRatio),
            unitCost: Number(product.unitPrice),
          },
        });
      }
    }

    for (let i = 0; i < SCALE.refillsPerSupplier; i++) {
      const eventAt = new Date(now - (SCALE.refillsPerSupplier * 2 - i * 2) * day);
      const quantity = 10 + rnd(20);
      const refillEmployee = pick(employees);
      const refillProduct = pick(products);
      const refillWarehouse = pick(warehouses);
      const refill = await prisma.refill.create({
        data: {
          orgId: org.id,
          machineId: pick(machines).id,
          supplierId: supplier.id,
          warehouseId: refillWarehouse.id,
          productId: refillProduct.id,
          employeeId: refillEmployee.id,
          quantity,
          eventAt,
        },
      });
      // A refill dispatch draws stock out of the warehouse — one ledger row
      // per refill keeps Org Warehouses Analytics' Refill Supply By
      // Warehouse widget in sync with what Refill Operations already shows.
      await prisma.warehouseLedgerEntry.create({
        data: {
          orgId: org.id,
          warehouseId: refillWarehouse.id,
          productId: refillProduct.id,
          type: LedgerEntryType.OUTBOUND,
          quantity,
          reason: 'Refill Dispatch',
          referenceType: 'Refill',
          referenceId: refill.id,
          occurredAt: eventAt,
        },
      });
    }
  }

  // ── Transactions ───────────────────────────────────────────
  for (let i = 0; i < SCALE.transactions; i++) {
    const machine = pick(machines);
    const product = pick(products);
    const employee = pick(employees);
    const createdAt = new Date(now - rnd(90) * day - rnd(24) * 3_600_000);
    const quantity = 1 + rnd(3);
    await prisma.transaction.create({
      data: {
        orgId: org.id,
        machineId: machine.id,
        employeeId: Math.random() > 0.5 ? employee.id : null,
        productId: product.id,
        quantity,
        amount: quantity * Number(product.unitPrice),
        paymentMethod: pick(['UPI', 'Card', 'Wallet']),
        status: Math.random() > 0.1 ? TransactionStatus.COMPLETED : TransactionStatus.FAILED,
        createdAt,
      },
    });
  }

  // ── Attendance ─────────────────────────────────────────────
  for (let d = 0; d < SCALE.attendanceDays; d++) {
    for (const employee of employees) {
      if (Math.random() > 0.85) continue;
      const checkIn = new Date(now - d * day);
      checkIn.setHours(9 + rnd(3), rnd(60), 0, 0);
      // Mostly a normal 7-9h day, but with enough variety that the
      // Attendance color-key/legend (On Time, Late Check-In, Early/Missed
      // Check-Out, Overtime, Pending) and Org Attendance & Discipline's
      // Worst/Best lists have something real to show:
      //   ~10% no checkout logged at all (missed check-out)
      //   ~15% an unusually short day (<7h, early check-out)
      //   ~15% an unusually long day (>9h, overtime)
      //   remainder a normal 7-9h day
      const roll = Math.random();
      let checkOut: Date | null;
      if (roll < 0.1) {
        checkOut = null;
      } else if (roll < 0.25) {
        checkOut = new Date(checkIn.getTime() + (4 + rnd(3)) * 3_600_000);
      } else if (roll < 0.4) {
        checkOut = new Date(checkIn.getTime() + (10 + rnd(3)) * 3_600_000);
      } else {
        checkOut = new Date(checkIn.getTime() + (7 + rnd(3)) * 3_600_000);
      }
      // Spread across clusters instead of always clusters[0], so the
      // cluster filter on Org Attendance & Discipline / Attendance Exports
      // actually has more than one option to show something different for.
      const clusterId = pick(clusters).id;
      await prisma.attendance.create({ data: { orgId: org.id, employeeId: employee.id, clusterId, checkIn, checkOut } });
    }
  }

  // ── Failure events ─────────────────────────────────────────
  for (let i = 0; i < SCALE.failureEvents; i++) {
    const reportedAt = new Date(now - rnd(60) * day);
    const failureType = pick(['Coin jam', 'Door sensor', 'Payment gateway', 'Dispense fault', 'Network dropout', 'Cooling fault']);
    // Payment gateway / door sensor / network / cooling failures aren't tied
    // to one dispensing slot; the rest are.
    const slotless = ['Payment gateway', 'Door sensor', 'Network dropout', 'Cooling fault'];
    const slot = slotless.includes(failureType) ? null : `A${1 + rnd(6)}`;
    await prisma.failureEvent.create({
      data: {
        orgId: org.id,
        machineId: pick(machines).id,
        failureType,
        slot,
        reportedAt,
        resolvedAt: Math.random() > 0.3 ? new Date(reportedAt.getTime() + (2 + rnd(48)) * 3_600_000) : null,
      },
    });
  }

  // ── Shipments ──────────────────────────────────────────────
  for (let i = 0; i < SCALE.shipments; i++) {
    const dispatchedAt = new Date(now - (SCALE.shipments * 2 - i * 2) * day);
    const status = i % 4 === 0 ? ShipmentStatus.DELAYED : i % 3 === 0 ? ShipmentStatus.IN_TRANSIT : ShipmentStatus.DELIVERED;
    await prisma.shipment.create({
      data: {
        orgId: org.id,
        warehouseId: pick(warehouses).id,
        supplierId: pick(suppliers).id,
        status,
        dispatchedAt,
        expectedAt: new Date(dispatchedAt.getTime() + 5 * day),
        deliveredAt: status === ShipmentStatus.DELIVERED ? new Date(dispatchedAt.getTime() + 4 * day) : null,
      },
    });
  }

  // ── Warehouse stock snapshot (per warehouse x product) ──────
  // powers Org Inventory Risk's Products At Risk / Warehouse Risk tables
  // with real onHand/allocated/threshold numbers. A handful of products
  // per warehouse are pushed into OUT/LOW so risk tables have something
  // to show; the rest are healthy.
  for (const wh of warehouses) {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const threshold = 30;
      const roll = Math.random();
      const onHand = roll < 0.1 ? 0 : roll < 0.25 ? 10 + rnd(20) : 60 + rnd(150);
      const allocated = roll < 0.25 ? rnd(15) : rnd(30);
      await prisma.warehouseStock.upsert({
        where: { warehouseId_productId: { warehouseId: wh.id, productId: product.id } },
        update: { onHand, allocated, threshold },
        create: { orgId: org.id, warehouseId: wh.id, productId: product.id, onHand, allocated, threshold },
      });

      // Inbound restock event backing the current on-hand figure.
      await prisma.warehouseLedgerEntry.create({
        data: {
          orgId: org.id,
          warehouseId: wh.id,
          productId: product.id,
          type: LedgerEntryType.INBOUND,
          quantity: onHand + 40,
          reason: 'PO Receipt',
          occurredAt: new Date(now - (20 - (i % 15)) * day),
        },
      });
    }
  }

  // ── Unexplained ledger adjustments — Ledger Anomalies widget ─
  for (let i = 0; i < 5; i++) {
    await prisma.warehouseLedgerEntry.create({
      data: {
        orgId: org.id,
        warehouseId: pick(warehouses).id,
        productId: pick(products).id,
        type: LedgerEntryType.ADJUSTMENT,
        quantity: -(3 + rnd(20)),
        reason: null,
        isAnomaly: true,
        occurredAt: new Date(now - rnd(30) * day),
      },
    });
  }

  // ── Export jobs ────────────────────────────────────────────
  const exportTypes = Object.values(ExportType);
  const requesters = ['ops@demo.org', 'admin@demo.org', 'prashant@demo.org'];
  for (let i = 0; i < SCALE.exportJobs; i++) {
    const type = exportTypes[i % exportTypes.length] as ExportType;
    const roll = Math.random();
    const status = roll < 0.6 ? ExportStatus.COMPLETED : roll < 0.75 ? ExportStatus.FAILED : roll < 0.9 ? ExportStatus.PROCESSING : ExportStatus.PENDING;
    const createdAt = new Date(now - rnd(45) * day);
    const startedAt = status === ExportStatus.PENDING ? null : new Date(createdAt.getTime() + rnd(30) * 60_000);
    const completedAt =
      status === ExportStatus.COMPLETED || status === ExportStatus.FAILED
        ? new Date((startedAt ?? createdAt).getTime() + (5 + rnd(120)) * 60_000)
        : null;
    await prisma.exportJob.create({
      data: {
        orgId: org.id,
        type,
        requestedBy: pick(requesters),
        filters: { rangeDays: pick([7, 30, 90]) },
        status,
        fileUrl: status === ExportStatus.COMPLETED ? `https://exports.demo.org/${org.id}/${type.toLowerCase()}-${i + 1}.csv` : null,
        rowCount: status === ExportStatus.COMPLETED ? 50 + rnd(5000) : null,
        errorMessage: status === ExportStatus.FAILED ? pick(['Timeout generating export', 'Upstream data source unavailable', 'Row limit exceeded']) : null,
        startedAt,
        completedAt,
        createdAt,
      },
    });
  }

  // ── Report schedules ───────────────────────────────────────
  await prisma.reportSchedule.createMany({
    data: [
      { orgId: org.id, type: ExportType.TRANSACTION_DOWNLOAD, frequency: ScheduleFrequency.WEEKLY, recipients: ['ops@demo.org'], nextRunAt: new Date(now + 7 * day) },
      { orgId: org.id, type: ExportType.ATTENDANCE_EXPORT, frequency: ScheduleFrequency.DAILY, recipients: ['hr@demo.org'], nextRunAt: new Date(now + day) },
      { orgId: org.id, type: ExportType.SUPPLIER_ANALYSIS, frequency: ScheduleFrequency.MONTHLY, recipients: ['procurement@demo.org'], nextRunAt: new Date(now + 30 * day) },
    ],
  });

  console.log(
    `Seed complete. Suppliers: ${suppliers.length}, Machines: ${machines.length}, Products: ${products.length}, ` +
      `Employees: ${employees.length}, Transactions: ${SCALE.transactions}, ExportJobs: ${SCALE.exportJobs}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());