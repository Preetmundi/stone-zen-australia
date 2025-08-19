import React from 'react';
import { Plus } from 'lucide-react';
import { Customer, Project } from '@/types/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CustomersViewProps {
  customers: Customer[];
  projects: Project[];
  onNewCustomer: () => void;
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  projects,
  onNewCustomer,
  onSelectCustomer
}) => {
  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'residential': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      case 'builder': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <Button onClick={onNewCustomer} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Customer Database</CardTitle>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search customers..."
                className="px-3 py-1 border border-input rounded text-sm bg-background"
              />
              <select className="px-3 py-1 border border-input rounded text-sm bg-background">
                <option>All Types</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Builder</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Projects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map(customer => {
                  const customerProjects = projects.filter(p => p.customerId === customer.id);
                  return (
                    <tr key={customer.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-muted-foreground font-medium">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-foreground">{customer.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-foreground">{customer.email}</p>
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-foreground">{customer.city}</p>
                          <p className="text-sm text-muted-foreground">{customer.postcode}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={`capitalize ${getCustomerTypeColor(customer.customerType)}`}>
                          {customer.customerType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-foreground">{customerProjects.length}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {customer.createdAt.toLocaleDateString('en-AU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectCustomer(customer)}
                          >
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Project
                          </Button>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};