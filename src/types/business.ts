export interface BusinessProfile {
  id: string;
  companyName: string;
  abn: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  logo?: string;
  markup: number;
  gstRate: number;
  laborRate: number;
  businessHours: string;
  serviceAreas: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  customerType: 'residential' | 'commercial' | 'builder';
  notes?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  customerId: string;
  projectName: string;
  projectType: 'kitchen' | 'bathroom' | 'fireplace' | 'commercial' | 'outdoor' | 'other';
  status: 'quote' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  expectedDelivery?: Date;
  surfaces: DesignSurface[];
  totalCost: number;
  notes?: string;
  address?: string;
  measurements?: ProjectMeasurement[];
}

export interface ProjectMeasurement {
  id: string;
  surfaceId: string;
  measurementType: 'template' | 'site' | 'final';
  dimensions: { width: number; height: number; depth?: number };
  cutouts: Cutout[];
  notes?: string;
  measuredBy: string;
  measuredAt: Date;
  photos?: string[];
}

export interface QuoteItem {
  id: string;
  description: string;
  category: 'material' | 'fabrication' | 'installation' | 'extras';
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  materialId?: string;
}

export interface Quote {
  id: string;
  projectId: string;
  quoteNumber: string;
  version: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  validUntil: Date;
  items: QuoteItem[];
  subtotal: number;
  gst: number;
  total: number;
  notes?: string;
  terms?: string;
  createdAt: Date;
  sentAt?: Date;
}

export interface StoneMaterial {
  id: string;
  name: string;
  category: 'granite' | 'marble' | 'quartz' | 'quartzite' | 'limestone' | 'travertine' | 'slate';
  supplier: string;
  supplierCode: string;
  baseColor: string;
  pattern: 'veined' | 'speckled' | 'solid' | 'swirled' | 'layered';
  finish: 'polished' | 'honed' | 'leathered' | 'flamed' | 'brushed';
  costPrice: number;
  sellPrice: number;
  imageUrl: string;
  description: string;
  durability: number;
  maintenanceLevel: 'low' | 'medium' | 'high';
  thickness: number[];
  slabSize: { width: number; height: number };
  availability: 'in-stock' | 'order-in' | 'discontinued';
  leadTime: number;
  warranty: number;
}

export interface DesignSurface {
  id: string;
  name: string;
  type: 'countertop' | 'splashback' | 'floor' | 'vanity' | 'fireplace' | 'feature-wall';
  width: number;
  height: number;
  depth?: number;
  enabled: boolean;
  selectedMaterial?: StoneMaterial;
  cutouts: Cutout[];
  edgeProfile: 'standard' | 'bullnose' | 'ogee' | 'beveled' | 'waterfall';
  complexity: 'simple' | 'medium' | 'complex';
}

export interface Cutout {
  id: string;
  type: 'sink' | 'cooktop' | 'tap' | 'powerpoint' | 'custom';
  width: number;
  height: number;
  x: number;
  y: number;
  depth?: number;
  notes?: string;
}