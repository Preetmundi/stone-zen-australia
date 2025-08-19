import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Customer, Project, DesignSurface } from '@/types/business';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project: Project | null;
  customers: Customer[];
}

const defaultSurface: DesignSurface = {
  id: '',
  name: '',
  type: 'countertop',
  width: 0,
  height: 0,
  enabled: true,
  cutouts: [],
  edgeProfile: 'standard',
  complexity: 'simple',
};

export const ProjectModal: React.FC<ProjectModalProps> = ({ open, onClose, onSave, project, customers }) => {
  const [form, setForm] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setForm({ ...project });
    } else {
      setForm({
        id: '',
        customerId: customers[0]?.id || '',
        projectName: '',
        projectType: 'kitchen',
        status: 'quote',
        createdAt: new Date(),
        surfaces: [],
        totalCost: 0,
        address: '',
      });
    }
    setError(null);
  }, [project, customers, open]);

  if (!form) return null;

  const handleChange = (field: keyof Project, value: any) => {
    setForm(f => f ? { ...f, [field]: value } : f);
  };

  const handleSurfaceChange = (idx: number, field: keyof DesignSurface, value: any) => {
    setForm(f => {
      if (!f) return f;
      const surfaces = [...f.surfaces];
      surfaces[idx] = { ...surfaces[idx], [field]: value };
      return { ...f, surfaces };
    });
  };

  const handleAddSurface = () => {
    setForm(f => f ? { ...f, surfaces: [...f.surfaces, { ...defaultSurface, id: `surf-${Date.now()}` }] } : f);
  };

  const handleRemoveSurface = (idx: number) => {
    setForm(f => f ? { ...f, surfaces: f.surfaces.filter((_, i) => i !== idx) } : f);
  };

  const handleSubmit = () => {
    if (!form.projectName || !form.customerId) {
      setError('Project name and customer are required.');
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
          <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Project Name *</label>
            <input className="border px-2 py-1 rounded w-full" value={form.projectName} onChange={e => handleChange('projectName', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Customer *</label>
            <select className="border px-2 py-1 rounded w-full" value={form.customerId} onChange={e => handleChange('customerId', e.target.value)} required>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select className="border px-2 py-1 rounded w-full" value={form.projectType} onChange={e => handleChange('projectType', e.target.value)}>
              <option value="kitchen">Kitchen</option>
              <option value="bathroom">Bathroom</option>
              <option value="fireplace">Fireplace</option>
              <option value="commercial">Commercial</option>
              <option value="outdoor">Outdoor</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select className="border px-2 py-1 rounded w-full" value={form.status} onChange={e => handleChange('status', e.target.value)}>
              <option value="quote">Quote</option>
              <option value="approved">Approved</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input className="border px-2 py-1 rounded w-full" value={form.address || ''} onChange={e => handleChange('address', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Surfaces</label>
            <div className="space-y-2">
              {form.surfaces.map((surface, idx) => (
                <div key={surface.id} className="border p-2 rounded flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input className="border px-2 py-1 rounded w-full" placeholder="Name" value={surface.name} onChange={e => handleSurfaceChange(idx, 'name', e.target.value)} />
                    <select className="border px-2 py-1 rounded" value={surface.type} onChange={e => handleSurfaceChange(idx, 'type', e.target.value)}>
                      <option value="countertop">Countertop</option>
                      <option value="splashback">Splashback</option>
                      <option value="floor">Floor</option>
                      <option value="vanity">Vanity</option>
                      <option value="fireplace">Fireplace</option>
                      <option value="feature-wall">Feature Wall</option>
                    </select>
                    <input className="border px-2 py-1 rounded w-20" type="number" placeholder="Width (mm)" value={surface.width} onChange={e => handleSurfaceChange(idx, 'width', Number(e.target.value))} />
                    <input className="border px-2 py-1 rounded w-20" type="number" placeholder="Height (mm)" value={surface.height} onChange={e => handleSurfaceChange(idx, 'height', Number(e.target.value))} />
                    <select className="border px-2 py-1 rounded" value={surface.edgeProfile} onChange={e => handleSurfaceChange(idx, 'edgeProfile', e.target.value)}>
                      <option value="standard">Standard</option>
                      <option value="bullnose">Bullnose</option>
                      <option value="ogee">Ogee</option>
                      <option value="beveled">Beveled</option>
                      <option value="waterfall">Waterfall</option>
                    </select>
                    <select className="border px-2 py-1 rounded" value={surface.complexity} onChange={e => handleSurfaceChange(idx, 'complexity', e.target.value)}>
                      <option value="simple">Simple</option>
                      <option value="medium">Medium</option>
                      <option value="complex">Complex</option>
                    </select>
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveSurface(idx)}>Remove</Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddSurface}>Add Surface</Button>
            </div>
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

export default ProjectModal;
