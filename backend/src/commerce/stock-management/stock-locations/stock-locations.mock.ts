import { mulberry32, pick } from '../../../common/mock.util';
import { WAREHOUSES } from '../overview/overview.mock';
import { StockLocation, StockLocationType } from './interfaces/stock-location.interface';

const MANAGERS = ['Anita Rao', 'Vikram Shah', 'Priya Nair', 'Rohit Mehta', 'Sana Iyer'];
const TYPES: StockLocationType[] = ['Warehouse', 'Warehouse', 'Vehicle', 'Machine'];
const AREAS = ['Industrial Estate', 'Sector 18', 'Ring Road', 'MG Road Depot', 'Tech Park Lane'];

function generateLocations(): StockLocation[] {
  const rng = mulberry32(606);
  const list: StockLocation[] = [];

  // One canonical warehouse entry per named warehouse first, so Overview
  // and this list agree on the four core sites...
  WAREHOUSES.forEach((name, i) => {
    list.push({
      id: `LOC${String(1000 + i)}`,
      name,
      type: 'Warehouse',
      address: `${1 + Math.floor(rng() * 200)} ${pick(rng, AREAS)}`,
      phone: `+91 8${Math.floor(rng() * 900000000 + 100000000)}`,
      manager: pick(rng, MANAGERS),
    });
  });

  // ...then pad with vehicle/machine-level storage locations.
  for (let i = 0; i < 14; i++) {
    const type = pick(rng, TYPES);
    list.push({
      id: `LOC${String(1004 + i)}`,
      name: type === 'Vehicle' ? `Route Van ${i + 1}` : `Micro-store ${i + 1}`,
      type,
      address: `${1 + Math.floor(rng() * 200)} ${pick(rng, AREAS)}`,
      phone: `+91 8${Math.floor(rng() * 900000000 + 100000000)}`,
      manager: pick(rng, MANAGERS),
    });
  }

  return list;
}

export const MOCK_STOCK_LOCATIONS: StockLocation[] = generateLocations();
export const STOCK_LOCATION_TYPES: StockLocationType[] = ['Warehouse', 'Vehicle', 'Machine'];
