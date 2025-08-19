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
  Box,
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
  Wrench,
  PieChart,
  BarChart3,
  TrendingUp,
  Star,
  Award,
  Shield,
  Package
} from 'lucide-react';

// Import business components
import { BusinessProfile, Customer, Project, Quote, QuoteItem, StoneMaterial, DesignSurface, Cutout, ProjectMeasurement } from '@/types/business';
import { AUSTRALIAN_STONE_MATERIALS, PRICING_CONFIG } from '@/data/materials';
import { Navigation } from '@/components/business/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Material Calculator Service
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

// Main Business Platform Component
const StoneDesignBusinessPlatform: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects' | 'customers' | 'quotes' | 'materials' | 'settings'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  
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

  // Dashboard stats
  const dashboardStats = {
    totalProjects: projects.length,
    activeQuotes: quotes.filter(q => q.status === 'sent').length,
    monthlyRevenue: projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.totalCost, 0),
    conversionRate: 0.68
  };

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {businessProfile.contactPerson}</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowNewCustomerModal(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Customer
          </Button>
          <Button
            onClick={() => setShowNewProjectModal(true)}
            variant="secondary"
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground">{dashboardStats.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Active Quotes</p>
                <p className="text-2xl font-bold text-foreground">{dashboardStats.activeQuotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-accent/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${dashboardStats.monthlyRevenue.toLocaleString('en-AU')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-muted-foreground/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">{(dashboardStats.conversionRate * 100).toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.slice(0, 5).map(project => {
              const customer = customers.find(c => c.id === project.customerId);
              return (
                <div key={project.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{project.projectName}</p>
                    <p className="text-sm text-muted-foreground">{customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${project.totalCost.toLocaleString('en-AU')}</p>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Materials</CardTitle>
          </CardHeader>
          <CardContent>
            {AUSTRALIAN_STONE_MATERIALS.slice(0, 5).map(material => (
              <div key={material.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{material.name}</p>
                  <p className="text-sm text-muted-foreground">{material.supplier}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${material.sellPrice}/m²</p>
                  <Badge variant={material.availability === 'in-stock' ? 'default' : 'secondary'}>
                    {material.availability}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'projects':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">Project management coming soon...</p>
          </div>
        );
      case 'customers':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">Customer management coming soon...</p>
          </div>
        );
      case 'quotes':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Quotes</h1>
            <p className="text-muted-foreground">Quote management coming soon...</p>
          </div>
        );
      case 'materials':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Materials</h1>
            <p className="text-muted-foreground">Material catalog coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Business settings coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView}
        setCurrentView={setCurrentView}
        businessProfile={businessProfile}
      />
      <main className="ml-64">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default StoneDesignBusinessPlatform;