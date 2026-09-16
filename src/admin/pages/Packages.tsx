import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useUIStore } from '../store/uiStore';
import { packagesService } from '../services/supabaseClient';

interface Package {
  id: string;
  service_id?: string;
  serviceId?: string;
  name: string;
  description?: string;
  price?: number;
  currency?: 'NPR' | 'USD';
  features?: string[] | any;
  delivery_timeline_days?: number;
  deliveryTimeline?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
}

export const Packages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'NPR' as 'NPR' | 'USD',
    features: '',
    deliveryTimeline: '',
    isActive: true,
  });
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await packagesService.getAll();
      console.log('Loaded packages:', data);
      setPackages(data || []);
      
      const subscription = packagesService.subscribe((payload: any) => {
        console.log('Packages update:', payload);
        loadPackages();
      });
      
      return () => subscription?.unsubscribe();
    } catch (error: any) {
      console.error('Error loading packages:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load packages',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'NPR',
      features: '',
      deliveryTimeline: '',
      isActive: true,
    });
    setEditingPackage(null);
    setShowForm(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setFormData({
      name: pkg.name || '',
      description: pkg.description || '',
      price: pkg.price || 0,
      currency: (pkg.currency || 'NPR') as 'NPR' | 'USD',
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : (pkg.features || ''),
      deliveryTimeline: String(pkg.delivery_timeline_days || ''),
      isActive: pkg.is_active || true,
    });
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleSavePackage = async () => {
    if (!formData.name.trim()) {
      addNotification({
        type: 'error',
        message: 'Package name is required',
      });
      return;
    }

    try {
      const featuresList = formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      if (editingPackage) {
        await packagesService.update(editingPackage.id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          currency: formData.currency,
          features: featuresList,
          delivery_timeline_days: formData.deliveryTimeline,
          is_active: formData.isActive,
        });
        addNotification({
          type: 'success',
          message: 'Package updated',
        });
      } else {
        await packagesService.create({
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          price: formData.price,
          currency: formData.currency,
          features: featuresList,
          delivery_timeline_days: formData.deliveryTimeline,
          is_active: formData.isActive,
        });
        addNotification({
          type: 'success',
          message: 'Package added',
        });
      }
      setShowForm(false);
      await loadPackages();
    } catch (error: any) {
      console.error('Error saving package:', error);
      addNotification({
        type: 'error',
        message: 'Failed to save package',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this package?')) {
      try {
        await packagesService.delete(id);
        addNotification({
          type: 'success',
          message: 'Package deleted',
        });
        await loadPackages();
      } catch (error: any) {
        console.error('Error deleting package:', error);
        addNotification({
          type: 'error',
          message: 'Failed to delete package',
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
            <p className="text-gray-600 mt-2">Create and manage service packages with pricing</p>
          </div>
          <Button variant="primary" size="md" className="gap-2" onClick={handleAddPackage}>
            <Plus className="w-4 h-4" />
            New Package
          </Button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <Modal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title={editingPackage ? 'Edit Package' : 'Add Package'}
            size="lg"
            footer={
              <>
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSavePackage}>
                  {editingPackage ? 'Update' : 'Add'} Package
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input
                label="Package Name"
                placeholder="e.g., Starter Package"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 resize-vertical"
                  rows={3}
                  placeholder="Package description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Input
                label="Price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Currency
                </label>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'NPR' | 'USD' })}
                >
                  <option value="NPR">NPR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <Input
                label="Delivery Timeline"
                placeholder="e.g., 5 days"
                value={formData.deliveryTimeline}
                onChange={(e) => setFormData({ ...formData, deliveryTimeline: e.target.value })}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Features (one per line)
                </label>
                <textarea
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 resize-vertical"
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-red-600"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-900">
                  Active
                </label>
              </div>
            </div>
          </Modal>
        )}

        {packages.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              {loading ? (
                <>
                  <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading packages...</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">No packages yet. Create your first package!</p>
                  <Button variant="primary" onClick={handleAddPackage}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Package
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <Card key={pkg.id}>
                <CardBody className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                    <div className="text-2xl font-bold text-red-600 mt-2">
                      {(pkg.currency || 'NPR') === 'USD' ? '$' : 'रु '}{(pkg.price || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{pkg.delivery_timeline_days || pkg.deliveryTimeline || 'N/A'}</p>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {(Array.isArray(pkg.features) ? pkg.features : []).slice(0, 2).map((feature: any, idx: number) => (
                      <li key={idx}>✓ {typeof feature === 'string' ? feature : JSON.stringify(feature)}</li>
                    ))}
                  </ul>
                </CardBody>
                <CardFooter className="gap-2">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleEditPackage(pkg)}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="danger" size="sm" className="flex-1" onClick={() => handleDelete(pkg.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
