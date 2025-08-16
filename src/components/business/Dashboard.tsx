import React from 'react';
import { Plus, Building, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { BusinessProfile, Customer, Project, Quote } from '@/types/business';
import { AUSTRALIAN_STONE_MATERIALS } from '@/data/materials';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardProps {
  businessProfile: BusinessProfile;
  projects: Project[];
  customers: Customer[];
  quotes: Quote[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  businessProfile,
  projects,
  customers,
  quotes
}) => {
  // Dashboard stats
  const dashboardStats = {
    totalProjects: projects.length,
    activeQuotes: quotes.filter(q => q.status === 'sent').length,
    monthlyRevenue: projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.totalCost, 0),
    conversionRate: 0.68
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {businessProfile.contactPerson}</p>
        </div>
        <div className="flex space-x-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Customer
          </Button>
          <Button variant="default">
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
                <FileText className="h-6 w-6 text-secondary-foreground" />
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
                <DollarSign className="h-6 w-6 text-accent-foreground" />
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
              <div className="p-2 bg-muted rounded-lg">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Materials</CardTitle>
          </CardHeader>
          <CardContent>
            {AUSTRALIAN_STONE_MATERIALS.slice(0, 5).map(material => (
              <div key={material.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center">
                  <img
                    src={material.imageUrl}
                    alt={material.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-foreground">{material.name}</p>
                    <p className="text-sm text-muted-foreground">{material.supplier}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${material.sellPrice}/m²</p>
                  <p className="text-xs text-muted-foreground">{material.availability}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};