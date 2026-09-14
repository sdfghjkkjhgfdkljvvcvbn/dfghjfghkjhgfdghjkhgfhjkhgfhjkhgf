import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Eye } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useUIStore } from '../store/uiStore';
import { servicesService } from '../services/supabaseClient';

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
  isActive?: boolean;
  display_order?: number;
  created_at?: string;
  createdAt?: string;
}

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    isActive: true,
  });
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadServices();
    
    // Set up subscription cleanup
    const subscription = servicesService.subscribe((payload: any) => {
      console.log('Services update:', payload);
      loadServices();
    });

    // Return cleanup function from useEffect
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesService.getAll();
      console.log('Loaded services:', data);
      setServices(data || []);
    } catch (error: any) {
      console.error('Error loading services:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load services',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      isActive: true,
    });
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setFormData({
      name: service.name || '',
      description: service.description || '',
      icon: service.icon || '',
      isActive: service.is_active || service.isActive || true,
    });
    setEditingService(service);
    setShowForm(true);
  };

  const handleSaveService = async () => {
    if (!formData.name.trim()) {
      addNotification({
        type: 'error',
        message: 'Service name is required',
      });
      return;
    }

    try {
      if (editingService) {
        await servicesService.update(editingService.id, {
          name: formData.name,
          description: formData.description,
          icon: formData.icon,
          is_active: formData.isActive,
        });
        addNotification({
          type: 'success',
          message: 'Service updated',
        });
      } else {
        // Find the next display_order value
        const maxOrder = Math.max(...services.map(s => (s.display_order || 0)), 0);
        
        await servicesService.create({
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          icon: formData.icon,
          is_active: formData.isActive,
          display_order: maxOrder + 1,
        });
        addNotification({
          type: 'success',
          message: 'Service added',
        });
      }
      setShowForm(false);
      await loadServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      addNotification({
        type: 'error',
        message: 'Failed to save service: ' + (error.message || 'Unknown error'),
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this service?')) {
      try {
        await servicesService.delete(id);
        addNotification({
          type: 'success',
          message: 'Service deleted',
        });
        await loadServices();
      } catch (error: any) {
        console.error('Error deleting service:', error);
        addNotification({
          type: 'error',
          message: 'Failed to delete service',
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600 mt-2">Manage your service offerings</p>
          </div>
          <Button variant="primary" size="md" className="gap-2" onClick={handleAddService}>
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <Modal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title={editingService ? 'Edit Service' : 'Add Service'}
            size="lg"
            footer={
              <>
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveService}>
                  {editingService ? 'Update' : 'Add'} Service
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input
                label="Service Name"
                placeholder="e.g., Interior Design"
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
                  rows={4}
                  placeholder="Service description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Input
                label="Icon"
                placeholder="Icon name or URL"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />

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

        {services.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              {loading ? (
                <>
                  <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading services...</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">No services yet. Create your first service!</p>
                  <Button variant="primary" onClick={handleAddService}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Service
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{service.description}</p>
                      <div className="mt-4">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          (service.is_active || service.isActive) ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                        }`}>
                          {(service.is_active || service.isActive) ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleEditService(service)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
