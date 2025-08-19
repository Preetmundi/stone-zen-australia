import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/lib/api';

export const SettingsView: React.FC = () => {
  const api = useApi();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/api/business-profile');
      setForm(data || {});
    } catch (err) {
      setError('Failed to load business profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.company_name || !form.email) {
      setError('Company name and email are required.');
      return;
    }
    setError(null);
    try {
      await api.put('/api/business-profile', form);
      setSuccess(true);
    } catch {
      setError('Failed to save business profile');
    }
  };

  if (loading) return <div>Loading business profile...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

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
              <Input id="companyName" value={form.companyName} onChange={e => handleChange('companyName', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="abn">ABN</Label>
              <Input id="abn" value={form.abn} onChange={e => handleChange('abn', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" value={form.contactPerson} onChange={e => handleChange('contactPerson', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
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
              <Input id="address" value={form.address} onChange={e => handleChange('address', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={e => handleChange('city', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state} onChange={e => handleChange('state', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input id="postcode" value={form.postcode} onChange={e => handleChange('postcode', e.target.value)} />
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
              <Input id="markup" type="number" value={form.markup * 100} onChange={e => handleChange('markup', parseFloat(e.target.value) / 100)} />
            </div>
            <div>
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Input id="gstRate" type="number" value={form.gstRate * 100} onChange={e => handleChange('gstRate', parseFloat(e.target.value) / 100)} />
            </div>
            <div>
              <Label htmlFor="laborRate">Labor Rate ($/hour)</Label>
              <Input id="laborRate" type="number" value={form.laborRate} onChange={e => handleChange('laborRate', parseFloat(e.target.value))} />
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
              <Input id="businessHours" value={form.businessHours} onChange={e => handleChange('businessHours', e.target.value)} />
            </div>
            <div>
              <Label>Service Areas</Label>
              <div className="text-sm text-muted-foreground">{form.serviceAreas.join(', ')}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2">Profile saved successfully!</div>}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};