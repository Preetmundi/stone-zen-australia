import { StoneMaterial } from '@/types/business';

// Australian Stone Materials Database
export const AUSTRALIAN_STONE_MATERIALS: StoneMaterial[] = [
  {
    id: 'caesarstone-calacatta-nuvo',
    name: 'Caesarstone Calacatta Nuvo',
    category: 'quartz',
    supplier: 'Caesarstone Australia',
    supplierCode: '5131',
    baseColor: '#f8f8f8',
    pattern: 'veined',
    finish: 'polished',
    costPrice: 280,
    sellPrice: 420,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImNhbGFjYXR0YSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y4ZjhmOCIvPjxzdG9wIG9mZnNldD0iMTAwJSiIgc3R5bGU9InN0b3AtY29sb3I6I2Y4ZjhmOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjY2FsYWNhdHRhKSIvPjxwYXRoIGQ9Ik0wLDUwIFE1MCw0MCA4MCw2MCBMMTAwLDcwIFE3MCw4MCA0MCw2MFoiIGZpbGw9IiNjY2NjY2MiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==',
    description: 'Premium engineered quartz with dramatic veining. Australian manufactured.',
    durability: 9,
    maintenanceLevel: 'low',
    thickness: [20, 30],
    slabSize: { width: 3200, height: 1600 },
    availability: 'in-stock',
    leadTime: 3,
    warranty: 15
  },
  {
    id: 'quantum-quartz-statuario',
    name: 'Quantum Quartz Statuario',
    category: 'quartz',
    supplier: 'Quantum Quartz',
    supplierCode: 'QT-STA',
    baseColor: '#ffffff',
    pattern: 'veined',
    finish: 'polished',
    costPrice: 320,
    sellPrice: 480,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTIwLDIwIFE4MCw0MCAyMDAsNjAiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+',
    description: 'Premium Australian engineered quartz with Italian marble aesthetics.',
    durability: 9,
    maintenanceLevel: 'low',
    thickness: [20, 30],
    slabSize: { width: 3200, height: 1600 },
    availability: 'in-stock',
    leadTime: 5,
    warranty: 15
  },
  {
    id: 'carrara-marble-italian',
    name: 'Italian Carrara Marble',
    category: 'marble',
    supplier: 'Stone Gallery',
    supplierCode: 'CAR-IT-01',
    baseColor: '#f8f9fa',
    pattern: 'veined',
    finish: 'polished',
    costPrice: 150,
    sellPrice: 280,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Im1hcmJsZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y4ZjlmYSIvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZWRlZGVkIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNtYXJibGUpIi8+PC9zdmc+',
    description: 'Classic Italian Carrara marble. Requires proper sealing and maintenance.',
    durability: 7,
    maintenanceLevel: 'high',
    thickness: [20, 30],
    slabSize: { width: 2800, height: 1800 },
    availability: 'order-in',
    leadTime: 14,
    warranty: 1
  },
  {
    id: 'granite-black-galaxy',
    name: 'Black Galaxy Granite',
    category: 'granite',
    supplier: 'Australian Stone Co.',
    supplierCode: 'BG-001',
    baseColor: '#1a1a1a',
    pattern: 'speckled',
    finish: 'polished',
    costPrice: 85,
    sellPrice: 160,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMiIgZmlsbD0iI2dvbGQiIG9wYWNpdHk9IjAuOCIvPjwvc3ZnPg==',
    description: 'Indian granite with gold speckles. Extremely durable and heat resistant.',
    durability: 9,
    maintenanceLevel: 'low',
    thickness: [20, 30, 40],
    slabSize: { width: 3200, height: 2000 },
    availability: 'in-stock',
    leadTime: 2,
    warranty: 10
  },
  {
    id: 'limestone-australian-cream',
    name: 'Australian Cream Limestone',
    category: 'limestone',
    supplier: 'Aussie Stone Quarries',
    supplierCode: 'ACL-001',
    baseColor: '#f4e5d3',
    pattern: 'solid',
    finish: 'honed',
    costPrice: 65,
    sellPrice: 120,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjRlNWQzIi8+PC9zdmc+',
    description: 'Locally quarried limestone. Perfect for outdoor applications.',
    durability: 6,
    maintenanceLevel: 'medium',
    thickness: [20, 30, 40],
    slabSize: { width: 2400, height: 1200 },
    availability: 'in-stock',
    leadTime: 1,
    warranty: 5
  }
];

// Pricing Configuration for Australian Market
export const PRICING_CONFIG = {
  fabrication: {
    simple: 45,      // per linear meter
    medium: 65,
    complex: 95
  },
  installation: {
    residential: 85,  // per sqm
    commercial: 95
  },
  edgeProfiles: {
    standard: 0,
    bullnose: 15,     // per linear meter
    ogee: 25,
    beveled: 20,
    waterfall: 150    // per waterfall edge
  },
  cutouts: {
    sink: 120,
    cooktop: 95,
    tap: 35,
    powerpoint: 25,
    custom: 75
  },
  templating: {
    residential: 150,
    commercial: 250
  },
  delivery: {
    metro: 85,
    regional: 150
  }
};