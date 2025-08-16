import React from 'react';
import { 
  PieChart, 
  Building, 
  Users, 
  FileText, 
  Package, 
  Settings 
} from 'lucide-react';
import { BusinessProfile } from '@/types/business';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: 'dashboard' | 'projects' | 'customers' | 'quotes' | 'materials' | 'settings') => void;
  businessProfile: BusinessProfile;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  setCurrentView, 
  businessProfile 
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'projects', label: 'Projects', icon: Building },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'quotes', label: 'Quotes', icon: FileText },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border">
      {/* Company Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">{businessProfile.companyName}</h1>
        <p className="text-sm text-muted-foreground">{businessProfile.city}, {businessProfile.state}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};