import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Customer, Project } from '@/types/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface CustomersViewProps {
  projects: Project[];
  onNewCustomer: () => void;
  onSelectCustomer: (customer: Customer) => void;
}

// Placeholder for CustomerModal (to be implemented)
const CustomerModal = ({ open, onClose, onSave, customer }: any) => null;

export const CustomersView: React.FC<CustomersViewProps> = ({
  projects,
  onNewCustomer,
  onSelectCustomer
}) => {
  const api = useApi();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineEditName, setInlineEditName] = useState('');
  const [inlineEditType, setInlineEditType] = useState('');

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await api.getCustomers();
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };
  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };
  const handleView = (customer: Customer) => {
    setViewCustomer(customer);
  };
  const handleInlineEdit = (customer: Customer) => {
    setInlineEditId(customer.id);
    setInlineEditName(customer.name);
    setInlineEditType(customer.customerType);
  };
  const handleInlineSave = async (customer: Customer) => {
    try {
      const { error } = await api.updateCustomer(customer.id, {
        ...customer,
        name: inlineEditName,
        customer_type: inlineEditType,
      });
      if (error) throw error;
      fetchCustomers();
    } catch {
      setError('Failed to update customer');
    }
    setInlineEditId(null);
  };
  const handleDelete = async (customer: Customer) => {
    try {
      const { error } = await api.deleteCustomer(customer.id);
      if (error) throw error;
      fetchCustomers();
    } catch {
      setError('Failed to delete customer');
    }
  };
  const handleSave = async (customer: Customer) => {
    try {
      if (customer.id) {
        const { error } = await api.updateCustomer(customer.id, customer);
        if (error) throw error;
      } else {
        const { error } = await api.createCustomer(customer);
        if (error) throw error;
      }
      fetchCustomers();
    } catch {
      setError('Failed to save customer');
    }
    setModalOpen(false);
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'residential': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      case 'builder': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Customer Database</CardTitle>
            <div className="flex space-x-2">
              <input type="text" placeholder="Search customers..." className="px-3 py-1 border border-input rounded text-sm bg-background" />
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
                  const isEditing = inlineEditId === customer.id;
                  return (
                    <tr key={customer.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input value={inlineEditName} onChange={e => setInlineEditName(e.target.value)} className="border px-2 py-1 rounded w-full" />
                        ) : (
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
                        )}
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
                        {isEditing ? (
                          <select value={inlineEditType} onChange={e => setInlineEditType(e.target.value)} className="border px-2 py-1 rounded">
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="builder">Builder</option>
                          </select>
                        ) : (
                          <Badge variant="outline" className={`capitalize ${getCustomerTypeColor(customer.customerType)}`}>
                            {customer.customerType}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-foreground">{customerProjects.length}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {customer.createdAt.toLocaleDateString('en-AU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(customer)}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Project
                          </Button>
                          {isEditing ? (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleInlineSave(customer)}>Save</Button>
                              <Button variant="ghost" size="sm" onClick={() => setInlineEditId(null)}>Cancel</Button>
                            </>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleInlineEdit(customer)}>Edit</Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(customer)}>Edit (Modal)</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(customer)}>Delete</Button>
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
      {/* Modal for Add/Edit Customer */}
      <CustomerModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={() => setModalOpen(false)} customer={editingCustomer} />
      {/* Dialog for Customer Details */}
      <Dialog open={!!viewCustomer} onOpenChange={open => !open && setViewCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewCustomer && (
            <div>
              <p><b>Name:</b> {viewCustomer.name}</p>
              <p><b>Email:</b> {viewCustomer.email}</p>
              <p><b>Phone:</b> {viewCustomer.phone}</p>
              <p><b>Type:</b> {viewCustomer.customerType}</p>
              <p><b>Address:</b> {viewCustomer.address}, {viewCustomer.city} {viewCustomer.postcode}</p>
              <p><b>Created:</b> {viewCustomer.createdAt.toLocaleDateString('en-AU')}</p>
              {/* Add more details as needed */}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};