import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useUIStore } from '../store/uiStore';
import { servicesService } from '../services/supabaseClient';

interface Service {
  id: string;
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  features?: string[];
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
  const [uploading, setUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    imagePreview: '',
    icon: '',
    features: '',
    displayOrder: 0,
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
      image: '',
      imagePreview: '',
      icon: '',
      features: '',
      displayOrder: 0,
      isActive: true,
    });
    setSelectedImageFile(null);
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setFormData({
      name: service.name || '',
      description: service.description || '',
      image: service.image || '',
      imagePreview: service.image || '',
      icon: service.icon || '',
      features: (service.features || []).join('\n'),
      displayOrder: service.display_order || 0,
      isActive: service.is_active || service.isActive || true,
    });
    setSelectedImageFile(null);
    setEditingService(service);
    setShowForm(true);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      console.log('📤 Uploading to Cloudinary:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        fileType: file.type,
      });

      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('upload_preset', 'ml_default');
      formDataObj.append('folder', 'parbati/services');
      formDataObj.append('resource_type', 'auto');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/gvjhfpzo/auto/upload`,
        {
          method: 'POST',
          body: formDataObj,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Cloudinary error:', data);
        throw new Error(data.error?.message || `Upload failed (${response.status})`);
      }

      const cloudinaryUrl = data.secure_url || data.url;
      if (!cloudinaryUrl) {
        throw new Error('No URL returned from Cloudinary');
      }

      console.log('✅ Upload successful:', cloudinaryUrl);
      return cloudinaryUrl;
    } catch (error: any) {
      console.error('❌ Upload error:', error.message);
      throw error;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      addNotification({
        type: 'error',
        message: 'Please select a valid image file (JPG, PNG, WebP, or GIF)',
      });
      return;
    }

    // Validate file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      addNotification({
        type: 'error',
        message: 'Image must be less than 15MB',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        imagePreview: e.target?.result as string,
      }));
      setSelectedImageFile(file);
    };
    reader.readAsDataURL(file);
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
      setUploading(true);
      let finalImageUrl = formData.image;

      // Upload image if selected
      if (selectedImageFile) {
        try {
          finalImageUrl = await uploadToCloudinary(selectedImageFile);
        } catch (uploadError: any) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      const serviceData = {
        name: formData.name,
        description: formData.description,
        image: finalImageUrl,
        icon: formData.icon,
        is_active: formData.isActive,
        display_order: formData.displayOrder,
      };

      if (editingService) {
        await servicesService.update(editingService.id, serviceData);
        addNotification({
          type: 'success',
          message: 'Service updated',
        });
      } else {
        // Generate UUID or use timestamp string
        const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        await servicesService.create({
          ...serviceData,
          id: newId,
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
    } finally {
      setUploading(false);
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

  const getServiceNumber = (index: number) => {
    return String(index + 1).padStart(2, '0');
  };

  return (
    <DashboardLayout pageTitle="Services" pageDescription="Manage the services displayed on your website">
      <div className="space-y-8">
        {/* Header Action */}
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            size="md" 
            className="gap-2" 
            onClick={handleAddService}
          >
            <Plus className="w-4 h-4" />
            New Service
          </Button>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#8F2F2F] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-[#77736D]">Loading services...</p>
            </div>
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardBody className="text-center py-16">
              <p className="text-[#77736D] mb-6">No services yet. Create your first service.</p>
              <Button variant="primary" onClick={handleAddService}>
                <Plus className="w-4 h-4" />
                Create First Service
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                {service.image && (
                  <div className="relative h-40 overflow-hidden bg-[#F7F6F2]">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {/* Service Number */}
                    <div className="text-[#77736D] text-xs font-light tracking-widest">
                      {getServiceNumber(index)}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-light text-[#202124] tracking-tight">
                      {service.name}
                    </h3>

                    {/* Description */}
                    {service.description && (
                      <p className="text-sm text-[#77736D] line-clamp-2 font-light">
                        {service.description}
                      </p>
                    )}

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#E5E1DA]">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            (service.is_active || service.isActive)
                              ? 'bg-green-600'
                              : 'bg-[#D4CDBF]'
                          }`}
                        ></div>
                        <span className="text-xs font-light text-[#77736D]">
                          {(service.is_active || service.isActive) ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-2 text-[#77736D] hover:text-[#202124] hover:bg-[#F7F6F2] rounded-lg transition-colors"
                          title="Edit service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 text-[#77736D] hover:text-[#8F2F2F] hover:bg-[#F7F6F2] rounded-lg transition-colors"
                          title="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
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
              <Button 
                variant="secondary" 
                onClick={() => setShowForm(false)} 
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveService} 
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : (editingService ? 'Update' : 'Add')} Service
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <Input
              label="Service Title"
              placeholder="e.g., Interior Design"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={uploading}
            />

            <div>
              <label className="block text-sm font-medium text-[#202124] mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-[8px] text-[#202124] placeholder-[#77736D] transition-all duration-200 focus:outline-none border-[#E5E1DA] bg-white hover:border-[#D4CDBF] focus:border-[#8F2F2F] focus:ring-1 focus:ring-[#8F2F2F]/20 resize-vertical disabled:opacity-50"
                rows={4}
                placeholder="Service description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={uploading}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[#202124] mb-2">
                Image Upload
              </label>
              <p className="text-xs text-[#77736D] mb-2">JPG, PNG, WebP or GIF · maximum 15 MB</p>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  disabled={uploading}
                  className="w-full px-3 py-2 border rounded-[8px] border-[#E5E1DA] cursor-pointer disabled:opacity-50"
                />
                {formData.imagePreview && (
                  <div className="relative">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <Input
              label="Features (One Per Line)"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              disabled={uploading}
            />

            <Input
              label="Order"
              type="number"
              placeholder="0"
              value={String(formData.displayOrder)}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              disabled={uploading}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                disabled={uploading}
                className="w-4 h-4 accent-[#8F2F2F] rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[#202124]">
                Active
              </label>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};
