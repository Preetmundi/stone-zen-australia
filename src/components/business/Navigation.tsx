import React from 'react';
import { 
  PieChart, 
  Building, 
  Users, 
  FileText, 
  Package, 
  Settings, 
  LogOut
} from 'lucide-react';
import { BusinessProfile } from '@/types/business';
import { useAuth } from '@/hooks/use-auth';

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
  const { user, logout } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col justify-between">
      <div>
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
      {/* User Info & Logout */}
      <div className="p-4 border-t border-border flex flex-col items-start">
        {user && (
          <>
            <div className="text-xs text-muted-foreground mb-2">Signed in as</div>
            <div className="text-sm font-medium text-foreground mb-2 break-all">{user.email}</div>
            <button
              onClick={logout}
              className="flex items-center text-sm text-red-600 hover:underline mt-1"
            >
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};