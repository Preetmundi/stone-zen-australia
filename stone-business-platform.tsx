import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Calculator, 
  Palette, 
  Home, 
  Bath, 
  Flame, 
  Archive,
  Eye,
  Cube,
  Smartphone,
  Settings,
  Download,
  Share2,
  Zap,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Plus,
  Minus,
  RotateCcw,
  Save,
  FileText,
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Truck,
  Tool,
  PieChart,
  BarChart3,
  TrendingUp,
  Star,
  Award,
  Shield,
  Wrench,
  Package
} from 'lucide-react';

// Enhanced interfaces for business features
interface BusinessProfile {
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

interface Customer {
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

interface Project {
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

interface ProjectMeasurement {
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

interface QuoteItem {
  id: string;
  description: string;
  category: 'material' | 'fabrication' | 'installation' | 'extras';
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  materialId?: string;
}

interface Quote {
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

interface StoneMaterial {
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

interface DesignSurface {
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

interface Cutout {
  id: string;
  type: 'sink' | 'cooktop' | 'tap' | 'powerpoint' | 'custom';
  width: number;
  height: number;
  x: number;
  y: number;
  depth?: number;
  notes?: string;
}

// Australian Stone Materials Database
const AUSTRALIAN_STONE_MATERIALS: StoneMaterial[] = [
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
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImNhbGFjYXR0YSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y4ZjhmOCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y4ZjhmOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjY2FsYWNhdHRhKSIvPjxwYXRoIGQ9Ik0wLDUwIFE1MCw0MCA4MCw2MCBMMTAwLDcwIFE3MCw4MCA0MCw2MFoiIGZpbGw9IiNjY2NjY2MiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==',
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
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMiIgZmlsbD0iZ29sZCIgb3BhY2l0eT0iMC44Ii8+PC9zdmc+',
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
const PRICING_CONFIG = {
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

// Main Business Platform Component
const StoneDesignBusinessPlatform: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects' | 'customers' | 'quotes' | 'materials' | 'settings'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    id: 'bp-001',
    companyName: 'Premium Stone Works',
    abn: '12 345 678 901',
    contactPerson: 'John Smith',
    email: 'john@premiumstoneworks.com.au',
    phone: '(02) 9876 5432',
    address: '123 Industrial Drive',
    city: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    markup: 0.65,
    gstRate: 0.10,
    laborRate: 85,
    businessHours: 'Mon-Fri 7:00-17:00, Sat 8:00-12:00',
    serviceAreas: ['Sydney', 'Central Coast', 'Blue Mountains', 'Wollongong']
  });

  // Sample data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'cust-001',
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '0412 345 678',
      address: '45 Oak Street',
      city: 'North Sydney',
      postcode: '2060',
      customerType: 'residential',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'cust-002',
      name: 'ABC Constructions',
      email: 'projects@abcconstructions.com.au',
      phone: '(02) 9999 8888',
      address: '88 Builder Avenue',
      city: 'Parramatta',
      postcode: '2150',
      customerType: 'builder',
      createdAt: new Date('2024-02-01')
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-001',
      customerId: 'cust-001',
      projectName: 'Kitchen Renovation',
      projectType: 'kitchen',
      status: 'quote',
      createdAt: new Date('2024-02-15'),
      surfaces: [{
        id: 'surf-001',
        name: 'Main Countertop',
        type: 'countertop',
        width: 3000,
        height: 600,
        enabled: true,
        selectedMaterial: AUSTRALIAN_STONE_MATERIALS[0],
        cutouts: [
          {
            id: 'cut-001',
            type: 'sink',
            width: 600,
            height: 400,
            x: 1200,
            y: 100
          }
        ],
        edgeProfile: 'standard',
        complexity: 'medium'
      }],
      totalCost: 8450,
      address: '45 Oak Street, North Sydney NSW 2060'
    }
  ]);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

  // Dashboard stats
  const dashboardStats = {
    totalProjects: projects.length,
    activeQuotes: quotes.filter(q => q.status === 'sent').length,
    monthlyRevenue: projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.totalCost, 0),
    conversionRate: 0.68
  };

  const MaterialCalculatorService = {
    calculateDetailedQuote: (project: Project, businessProfile: BusinessProfile): Quote => {
      const items: QuoteItem[] = [];
      let itemId = 1;

      // Calculate material costs
      project.surfaces.forEach(surface => {
        if (surface.enabled && surface.selectedMaterial) {
          const area = (surface.width * surface.height) / 1000000; // Convert to sqm
          const wasteArea = area * 0.15; // 15% waste
          const totalArea = area + wasteArea;
          
          items.push({
            id: `item-${itemId++}`,
            description: `${surface.selectedMaterial.name} - ${surface.name}`,
            category: 'material',
            quantity: totalArea,
            unit: 'sqm',
            unitPrice: surface.selectedMaterial.sellPrice,
            totalPrice: totalArea * surface.selectedMaterial.sellPrice,
            materialId: surface.selectedMaterial.id
          });

          // Fabrication costs
          const edgeLength = 2 * ((surface.width + surface.height) / 1000); // Perimeter in meters
          const fabricationRate = PRICING_CONFIG.fabrication[surface.complexity];
          
          items.push({
            id: `item-${itemId++}`,
            description: `Fabrication - ${surface.name} (${surface.complexity})`,
            category: 'fabrication',
            quantity: edgeLength,
            unit: 'lm',
            unitPrice: fabricationRate,
            totalPrice: edgeLength * fabricationRate
          });

          // Edge profile costs
          if (surface.edgeProfile !== 'standard') {
            const edgeRate = PRICING_CONFIG.edgeProfiles[surface.edgeProfile];
            items.push({
              id: `item-${itemId++}`,
              description: `Edge Profile - ${surface.edgeProfile}`,
              category: 'fabrication',
              quantity: edgeLength,
              unit: 'lm',
              unitPrice: edgeRate,
              totalPrice: edgeLength * edgeRate
            });
          }

          // Cutout costs
          surface.cutouts.forEach(cutout => {
            const cutoutCost = PRICING_CONFIG.cutouts[cutout.type];
            items.push({
              id: `item-${itemId++}`,
              description: `${cutout.type} cutout`,
              category: 'fabrication',
              quantity: 1,
              unit: 'ea',
              unitPrice: cutoutCost,
              totalPrice: cutoutCost
            });
          });

          // Installation costs
          const installationRate = project.customerId.includes('builder') ? 
            PRICING_CONFIG.installation.commercial : 
            PRICING_CONFIG.installation.residential;
          
          items.push({
            id: `item-${itemId++}`,
            description: `Installation - ${surface.name}`,
            category: 'installation',
            quantity: area,
            unit: 'sqm',
            unitPrice: installationRate,
            totalPrice: area * installationRate
          });
        }
      });

      // Add templating
      const templatingCost = project.customerId.includes('builder') ? 
        PRICING_CONFIG.templating.commercial : 
        PRICING_CONFIG.templating.residential;
      
      items.push({
        id: `item-${itemId++}`,
        description: 'Digital Templating',
        category: 'extras',
        quantity: 1,
        unit: 'ea',
        unitPrice: templatingCost,
        totalPrice: templatingCost
      });

      // Add delivery
      items.push({
        id: `item-${itemId++}`,
        description: 'Delivery & Installation',
        category: 'extras',
        quantity: 1,
        unit: 'ea',
        unitPrice: PRICING_CONFIG.delivery.metro,
        totalPrice: PRICING_CONFIG.delivery.metro
      });

      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const gst = subtotal * businessProfile.gstRate;
      const total = subtotal + gst;

      return {
        id: `quote-${Date.now()}`,
        projectId: project.id,
        quoteNumber: `Q${Date.now().toString().slice(-6)}`,
        version: 1,
        status: 'draft',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        items,
        subtotal,
        gst,
        total,
        terms: 'Payment terms: 50% deposit, 50% on completion. Quote valid for 30 days.',
        createdAt: new Date()
      };
    }
  };

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {businessProfile.contactPerson}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowNewCustomerModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Customer
          </button>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeQuotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${dashboardStats.monthlyRevenue.toLocaleString('en-AU')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(dashboardStats.conversionRate * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
          </div>
          <div className="p-6">
            {projects.slice(0, 5).map(project => {
              const customer = customers.find(c => c.id === project.customerId);
              return (
                <div key={project.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{material.name}</p>
                    <p className="text-sm text-gray-600">{material.supplier}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${material.sellPrice}/m²</p>
                  <p className="text-xs text-gray-500">{material.availability}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">All Projects</h3>
            <div className="flex space-x-2">
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option>All Status</option>
                <option>Quote</option>
                <option>Approved</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option>All Types</option>
                <option>Kitchen</option>
                <option>Bathroom</option>
                <option>Commercial</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map(project => {
                const customer = customers.find(c => c.id === project.customerId);
                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{project.projectName}</p>
                        <p className="text-sm text-gray-500">{project.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{customer?.name}</p>
                        <p className="text-sm text-gray-500">{customer?.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-gray-900">{project.projectType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        ${project.totalCost.toLocaleString('en-AU')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'quote' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.createdAt.toLocaleDateString('en-AU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          Quote
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={() => setShowNewCustomerModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Customer Database</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search customers..."
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option>All Types</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Builder</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map(customer => {
                const customerProjects = projects.filter(p => p.customerId === customer.id);
                return (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{customer.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900">{customer.city}</p>
                        <p className="text-sm text-gray-500">{customer.postcode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                        customer.customerType === 'residential' ? 'bg-blue-100 text-blue-800' :
                        customer.customerType === 'commercial' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {customer.customerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{customerProjects.length}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.createdAt.toLocaleDateString('en-AU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          Project
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQuotes = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Create Quote
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quote Management</h3>
        </div>
        
        <div className="p-6">
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
              <p className="text-gray-600 mb-6">Create your first quote from a project to get started.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Create First Quote
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map(quote => (
                <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">Quote #{quote.quoteNumber}</h4>
                      <p className="text-sm text-gray-600">Version {quote.version}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        ${quote.total.toLocaleString('en-AU')}
                      </p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                        quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        quote.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {AUSTRALIAN_STONE_MATERIALS.map(material => (
          <div key={material.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={material.imageUrl}
              alt={material.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{material.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  material.availability === 'in-stock' ? 'bg-green-100 text-green-800' :
                  material.availability === 'order-in' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {material.availability}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{material.supplier}</p>
              <p className="text-xs text-gray-600 mb-3">{material.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">${material.costPrice}/m²</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Sell:</span>
                  <span className="font-bold text-green-600">${material.sellPrice}/m²</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Margin:</span>
                  <span className="font-medium text-blue-600">
                    {Math.round(((material.sellPrice - material.costPrice) / material.costPrice) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Lead Time:</span>
                  <span>{material.leadTime} days</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                  Edit
                </button>
                <button className="flex-1 px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Profile */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={businessProfile.companyName}
                onChange={(e) => setBusinessProfile({...businessProfile, companyName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ABN</label>
              <input
                type="text"
                value={businessProfile.abn}
                onChange={(e) => setBusinessProfile({...businessProfile, abn: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={businessProfile.contactPerson}
                onChange={(e) => setBusinessProfile({...businessProfile, contactPerson: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={businessProfile.email}
                onChange={(e) => setBusinessProfile({...businessProfile, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={businessProfile.phone}
                onChange={(e) => setBusinessProfile({...businessProfile, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard Markup (%)</label>
              <input
                type="number"
                value={businessProfile.markup * 100}
                onChange={(e) => setBusinessProfile({...businessProfile, markup: Number(e.target.value) / 100})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
              <input
                type="number"
                value={businessProfile.gstRate * 100}
                onChange={(e) => setBusinessProfile({...businessProfile, gstRate: Number(e.target.value) / 100})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Labor Rate ($/hour)</label>
              <input
                type="number"
                value={businessProfile.laborRate}
                onChange={(e) => setBusinessProfile({...businessProfile, laborRate: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Service Areas</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {businessProfile.serviceAreas.map((area, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
              {area}
              <button
                onClick={() => {
                  const newAreas = businessProfile.serviceAreas.filter((_, i) => i !== index);
                  setBusinessProfile({...businessProfile, serviceAreas: newAreas});
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Add service area..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                if (input.value && !businessProfile.serviceAreas.includes(input.value)) {
                  setBusinessProfile({
                    ...businessProfile,
                    serviceAreas: [...businessProfile.serviceAreas, input.value]
                  });
                  input.value = '';
                }
              }
            }}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Cube className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">StoneDesigner</h1>
              <p className="text-xs text-gray-600">Pro Business</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          <div className="px-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                currentView === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Dashboard
            </button>
            
            <button
              onClick={() => setCurrentView('projects')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                currentView === 'projects' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Building className="mr-3 h-5 w-5" />
              Projects
            </button>
            
            <button
              onClick={() => setCurrentView('customers')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                currentView === 'customers' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Customers
            </button>
            
            <button
              onClick={() => setCurrentView('quotes')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                currentView === 'quotes' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="mr-3 h-5 w-5" />
              Quotes
            </button>
            
            <button
              onClick={() => setCurrentView('materials')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                currentView === 'materials' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="mr-3 h-5 w-5" />
              Materials
            </button>
            
            <button
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                currentView === 'settings' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </button>
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {businessProfile.contactPerson.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{businessProfile.contactPerson}</p>
              <p className="text-xs text-gray-600">{businessProfile.companyName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'projects' && renderProjects()}
        {currentView === 'customers' && renderCustomers()}
        {currentView === 'quotes' && renderQuotes()}
        {currentView === 'materials' && renderMaterials()}
        {currentView === 'settings' && renderSettings()}
      </div>

      {/* New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">New Customer</h3>
              <button
                onClick={() => setShowNewCustomerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="customer@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0412 345 678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Street address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sydney"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="builder">Builder</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewCustomerModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add customer logic here
                  setShowNewCustomerModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">New Project</h3>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Kitchen Renovation"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="commercial">Commercial</option>
                    <option value="fireplace">Fireplace</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Project installation address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional project details..."
                />
              </div>

              {/* Surface Configuration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surfaces</label>
                <div className="border border-gray-300 rounded-md p-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Main Countertop</span>
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Width (mm)"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                          defaultValue="3000"
                        />
                        <input
                          type="number"
                          placeholder="Height (mm)"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                          defaultValue="600"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Splashback</span>
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Width (mm)"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                          defaultValue="3000"
                        />
                        <input
                          type="number"
                          placeholder="Height (mm)"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                          defaultValue="600"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Island</span>
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Width (mm)"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                          defaultValue="2000"
                        />
                        <input
                          type="number"
                          placeholder="Height (mm)"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                          defaultValue="1000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Surface
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add project logic here
                  setShowNewProjectModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[900px] shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900">{selectedProject.projectName}</h3>
                <p className="text-sm text-gray-600">
                  {customers.find(c => c.id === selectedProject.customerId)?.name}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const quote = MaterialCalculatorService.calculateDetailedQuote(selectedProject, businessProfile);
                    setQuotes([...quotes, quote]);
                    alert('Quote generated successfully!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate Quote
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {/* Project Info */}
              <div className="col-span-1 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="capitalize">{selectedProject.projectType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedProject.status === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedProject.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        selectedProject.status === 'quote' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedProject.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{selectedProject.createdAt.toLocaleDateString('en-AU')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">${selectedProject.totalCost.toLocaleString('en-AU')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Customer Info</h4>
                  {(() => {
                    const customer = customers.find(c => c.id === selectedProject.customerId);
                    return customer ? (
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-gray-600">{customer.email}</p>
                        <p className="text-gray-600">{customer.phone}</p>
                        <p className="text-gray-600">{customer.address}</p>
                        <p className="text-gray-600">{customer.city}, {customer.postcode}</p>
                      </div>
                    ) : null;
                  })()}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Call Customer
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Send Email
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Schedule Visit
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>

              {/* Surfaces & Materials */}
              <div className="col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Surfaces & Materials</h4>
                  </div>
                  <div className="p-4">
                    {selectedProject.surfaces.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No surfaces configured yet</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Add Surfaces
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedProject.surfaces.map(surface => (
                          <div key={surface.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-medium text-gray-900">{surface.name}</h5>
                                <p className="text-sm text-gray-600 capitalize">{surface.type}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">
                                  {(surface.width/1000).toFixed(1)}m × {(surface.height/1000).toFixed(1)}m
                                </p>
                                <p className="text-sm font-medium">
                                  {((surface.width * surface.height) / 1000000).toFixed(2)} m²
                                </p>
                              </div>
                            </div>
                            
                            {surface.selectedMaterial ? (
                              <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-3">
                                <img
                                  src={surface.selectedMaterial.imageUrl}
                                  alt={surface.selectedMaterial.name}
                                  className="h-12 w-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{surface.selectedMaterial.name}</p>
                                  <p className="text-sm text-gray-600">{surface.selectedMaterial.supplier}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${surface.selectedMaterial.sellPrice}/m²</p>
                                  <p className="text-sm text-gray-600">{surface.selectedMaterial.finish}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <p className="text-gray-600 mb-2">No material selected</p>
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                  Choose Material
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="mt-6 bg-white border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Cost Breakdown</h4>
                  </div>
                  <div className="p-4">
                    {selectedProject.surfaces.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">Configure surfaces to see cost breakdown</p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Materials:</span>
                          <span>${(selectedProject.totalCost * 0.6).toLocaleString('en-AU')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Fabrication:</span>
                          <span>${(selectedProject.totalCost * 0.25).toLocaleString('en-AU')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Installation:</span>
                          <span>${(selectedProject.totalCost * 0.15).toLocaleString('en-AU')}</span>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex justify-between">
                          <span className="font-medium">Subtotal:</span>
                          <span>${(selectedProject.totalCost / 1.1).toLocaleString('en-AU')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">GST (10%):</span>
                          <span>${(selectedProject.totalCost * 0.1).toLocaleString('en-AU')}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-blue-600">
                          <span>Total:</span>
                          <span>${selectedProject.totalCost.toLocaleString('en-AU')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoneDesignBusinessPlatform;900">{project.projectName}</p>
                    <p className="text-sm text-gray-600">{customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${project.totalCost.toLocaleString('en-AU')}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'quote' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Popular Materials</h3>
          </div>
          <div className="p-6">
            {AUSTRALIAN_STONE_MATERIALS.slice(0, 5).map(material => (
              <div key={material.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <img
                    src={material.imageUrl}
                    alt={material.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-