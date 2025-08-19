import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types/business';

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  customer: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ open, onClose, onSave, customer }) => {
  const [form, setForm] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setForm({ ...customer });
    } else {
      setForm({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postcode: '',
        customerType: 'residential',
        createdAt: new Date(),
      });
    }
    setError(null);
  }, [customer, open]);

  if (!form) return null;

  const handleChange = (field: keyof Customer, value: any) => {
    setForm(f => f ? { ...f, [field]: value } : f);
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) {
      setError('Name, email, and phone are required.');
      return;
    }
    setError(null);
    onSave({ ...form, createdAt: form.createdAt || new Date() });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? 'Edit Customer' : 'New Customer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input className="border px-2 py-1 rounded w-full" value={form.name} onChange={e => handleChange('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Email *</label>
            <input className="border px-2 py-1 rounded w-full" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone *</label>
            <input className="border px-2 py-1 rounded w-full" value={form.phone} onChange={e => handleChange('phone', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select className="border px-2 py-1 rounded w-full" value={form.customerType} onChange={e => handleChange('customerType', e.target.value)}>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="builder">Builder</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input className="border px-2 py-1 rounded w-full" value={form.address} onChange={e => handleChange('address', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input className="border px-2 py-1 rounded w-full" value={form.city} onChange={e => handleChange('city', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Postcode</label>
            <input className="border px-2 py-1 rounded w-full" value={form.postcode} onChange={e => handleChange('postcode', e.target.value)} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit">Save</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal;
