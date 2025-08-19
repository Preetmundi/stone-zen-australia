import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MaterialModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (material: any) => void;
  material: any;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({ open, onClose, onSave, material }) => {
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (material) {
      setForm({ ...material });
    } else {
      setForm({
        id: '',
        name: '',
        supplier: '',
        category: 'granite',
        finish: 'polished',
        sellPrice: 0,
        availability: 'in-stock',
        leadTime: 1,
        description: '',
        imageUrl: '',
      });
    }
    setError(null);
  }, [material, open]);

  if (!form) return null;

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.supplier) {
      setError('Name and supplier are required.');
      return;
    }
    setError(null);
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{material ? 'Edit Material' : 'New Material'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input className="border px-2 py-1 rounded w-full" value={form.name} onChange={e => handleChange('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Supplier *</label>
            <input className="border px-2 py-1 rounded w-full" value={form.supplier} onChange={e => handleChange('supplier', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select className="border px-2 py-1 rounded w-full" value={form.category} onChange={e => handleChange('category', e.target.value)}>
              <option value="granite">Granite</option>
              <option value="marble">Marble</option>
              <option value="quartz">Quartz</option>
              <option value="quartzite">Quartzite</option>
              <option value="limestone">Limestone</option>
              <option value="travertine">Travertine</option>
              <option value="slate">Slate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Finish</label>
            <select className="border px-2 py-1 rounded w-full" value={form.finish} onChange={e => handleChange('finish', e.target.value)}>
              <option value="polished">Polished</option>
              <option value="honed">Honed</option>
              <option value="leathered">Leathered</option>
              <option value="flamed">Flamed</option>
              <option value="brushed">Brushed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Price (per m²)</label>
            <input className="border px-2 py-1 rounded w-full" type="number" value={form.sellPrice} onChange={e => handleChange('sellPrice', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Availability</label>
            <select className="border px-2 py-1 rounded w-full" value={form.availability} onChange={e => handleChange('availability', e.target.value)}>
              <option value="in-stock">In Stock</option>
              <option value="order-in">Order In</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Lead Time (days)</label>
            <input className="border px-2 py-1 rounded w-full" type="number" value={form.leadTime} onChange={e => handleChange('leadTime', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea className="border px-2 py-1 rounded w-full" value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input className="border px-2 py-1 rounded w-full" value={form.imageUrl} onChange={e => handleChange('imageUrl', e.target.value)} />
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

export default MaterialModal;
