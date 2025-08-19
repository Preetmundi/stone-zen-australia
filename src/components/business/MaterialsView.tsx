import React from 'react';
import { AUSTRALIAN_STONE_MATERIALS } from '@/data/materials';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const MaterialsView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Materials Catalog</h1>
        <div className="flex space-x-2">
          <select className="px-3 py-1 border border-input rounded text-sm bg-background">
            <option>All Categories</option>
            <option>Granite</option>
            <option>Marble</option>
            <option>Quartz</option>
            <option>Limestone</option>
          </select>
          <select className="px-3 py-1 border border-input rounded text-sm bg-background">
            <option>All Suppliers</option>
            <option>Caesarstone Australia</option>
            <option>Quantum Quartz</option>
            <option>Stone Gallery</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AUSTRALIAN_STONE_MATERIALS.map(material => (
          <Card key={material.id} className="overflow-hidden">
            <div className="h-48 bg-muted flex items-center justify-center">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};