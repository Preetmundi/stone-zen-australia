import React from 'react';
import { BusinessProfile } from '@/types/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingsViewProps {
  businessProfile: BusinessProfile;
  onUpdateProfile: (profile: BusinessProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  businessProfile,
  onUpdateProfile
}) => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Business Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName"
                value={businessProfile.companyName}
                onChange={(e) => onUpdateProfile({...businessProfile, companyName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="abn">ABN</Label>
              <Input 
                id="abn"
                value={businessProfile.abn}
                onChange={(e) => onUpdateProfile({...businessProfile, abn: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input 
                id="contactPerson"
                value={businessProfile.contactPerson}
                onChange={(e) => onUpdateProfile({...businessProfile, contactPerson: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={businessProfile.email}
                onChange={(e) => onUpdateProfile({...businessProfile, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                value={businessProfile.phone}
                onChange={(e) => onUpdateProfile({...businessProfile, phone: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input 
                id="address"
                value={businessProfile.address}
                onChange={(e) => onUpdateProfile({...businessProfile, address: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input 
                id="city"
                value={businessProfile.city}
                onChange={(e) => onUpdateProfile({...businessProfile, city: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state"
                  value={businessProfile.state}
                  onChange={(e) => onUpdateProfile({...businessProfile, state: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input 
                  id="postcode"
                  value={businessProfile.postcode}
                  onChange={(e) => onUpdateProfile({...businessProfile, postcode: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="markup">Markup (%)</Label>
              <Input 
                id="markup"
                type="number"
                value={businessProfile.markup * 100}
                onChange={(e) => onUpdateProfile({...businessProfile, markup: parseFloat(e.target.value) / 100})}
              />
            </div>
            <div>
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Input 
                id="gstRate"
                type="number"
                value={businessProfile.gstRate * 100}
                onChange={(e) => onUpdateProfile({...businessProfile, gstRate: parseFloat(e.target.value) / 100})}
              />
            </div>
            <div>
              <Label htmlFor="laborRate">Labor Rate ($/hour)</Label>
              <Input 
                id="laborRate"
                type="number"
                value={businessProfile.laborRate}
                onChange={(e) => onUpdateProfile({...businessProfile, laborRate: parseFloat(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Hours & Service Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessHours">Business Hours</Label>
              <Input 
                id="businessHours"
                value={businessProfile.businessHours}
                onChange={(e) => onUpdateProfile({...businessProfile, businessHours: e.target.value})}
              />
            </div>
            <div>
              <Label>Service Areas</Label>
              <div className="text-sm text-muted-foreground">
                {businessProfile.serviceAreas.join(', ')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};