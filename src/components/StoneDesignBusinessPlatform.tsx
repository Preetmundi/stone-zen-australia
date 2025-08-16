import React, { useState } from 'react';
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
  Wrench as Tool,
  PieChart,
  BarChart3,
  TrendingUp,
  Star,
  Award,
  Shield,
  Wrench,
  Package
} from 'lucide-react';

// Import business components
import { BusinessProfile, Customer, Project, Quote } from '@/types/business';
import { AUSTRALIAN_STONE_MATERIALS } from '@/data/materials';
import { Dashboard } from '@/components/business/Dashboard';
import { Navigation } from '@/components/business/Navigation';

// Main Business Platform Component
export const StoneDesignBusinessPlatform: React.FC = () => {
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
      surfaces: [],
      totalCost: 8450,
      address: '45 Oak Street, North Sydney NSW 2060'
    }
  ]);

  const [quotes, setQuotes] = useState<Quote[]>([]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            businessProfile={businessProfile}
            projects={projects}
            customers={customers}
            quotes={quotes}
          />
        );
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