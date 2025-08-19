import React, { useEffect, useState } from 'react';
import { AUSTRALIAN_STONE_MATERIALS } from '@/data/materials';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
// Placeholder for MaterialModal (to be implemented)
const MaterialModal = ({ open, onClose, onSave, material }: any) => null;

export const MaterialsView: React.FC = () => {
  const api = useApi();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [viewMaterial, setViewMaterial] = useState(null);

  useEffect(() => {
    fetchMaterials();
    // eslint-disable-next-line
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/api/materials');
      setMaterials(data);
    } catch (err) {
      setError('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMaterial(null);
    setModalOpen(true);
  };
  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setModalOpen(true);
  };
  const handleDelete = async (material: any) => {
    try {
      await api.del(`/api/materials/${material.id}`);
      fetchMaterials();
    } catch {
      setError('Failed to delete material');
    }
  };
  const handleSave = async (material: any) => {
    try {
      if (material.id) {
        await api.put(`/api/materials/${material.id}`, material);
      } else {
        await api.post('/api/materials', material);
      }
      fetchMaterials();
    } catch {
      setError('Failed to save material');
    }
    setModalOpen(false);
  };

  if (loading) return <div>Loading materials...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Materials Catalog</h1>
        <Button onClick={handleAdd}>Add Material</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(material => (
          <Card key={material.id} className="overflow-hidden">
            <div className="h-48 bg-muted flex items-center justify-center cursor-pointer" onClick={() => setViewMaterial(material)}>
              <img 
                src={material.imageUrl} 
                alt={material.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{material.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{material.supplier}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="secondary" className="capitalize">{material.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Finish</span>
                  <span className="text-sm capitalize text-foreground">{material.finish}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-bold text-foreground">${material.sellPrice}/m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Availability</span>
                  <Badge variant={material.availability === 'in-stock' ? 'default' : 'secondary'}>
                    {material.availability}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lead Time</span>
                  <span className="text-sm text-foreground">{material.leadTime} days</span>
                </div>
                <p className="text-xs text-muted-foreground">{material.description}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(material)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(material)}>Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Modal for Add/Edit Material */}
      <MaterialModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} material={editingMaterial} />
      {/* Dialog for Material Details */}
      <Dialog open={!!viewMaterial} onOpenChange={open => !open && setViewMaterial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Material Details</DialogTitle>
          </DialogHeader>
          {viewMaterial && (
            <div>
              <p><b>Name:</b> {viewMaterial.name}</p>
              <p><b>Supplier:</b> {viewMaterial.supplier}</p>
              <p><b>Category:</b> {viewMaterial.category}</p>
              <p><b>Finish:</b> {viewMaterial.finish}</p>
              <p><b>Price:</b> ${viewMaterial.sellPrice}/m²</p>
              <p><b>Availability:</b> {viewMaterial.availability}</p>
              <p><b>Lead Time:</b> {viewMaterial.leadTime} days</p>
              <p><b>Description:</b> {viewMaterial.description}</p>
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