import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Play } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { VideoUpload } from '../components/VideoUpload';
import { Modal } from '../components/Modal';
import { useUIStore } from '../store/uiStore';
import { happyClientsService, supabase } from '../services/supabaseClient';

interface ClientTestimonial {
  id?: number;
  video_path?: string;
  videoPath?: string;
  name?: string;
  title?: string;
  client_image?: string;
  clientImage?: string;
  project_image?: string;
  projectImage?: string;
  rating?: number;
  created_at?: string;
  createdAt?: string;
}

export const HappyClients: React.FC = () => {
  const [testimonials, setTestimonials] = useState<ClientTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // SEPARATE FILE STATE - prevents state overwriting
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  // Form data (without files)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    videoPath: '',
    videoPreview: '',
    rating: 5,
  });
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadTestimonials();
    
    // Set up realtime subscription
    const subscription = happyClientsService.subscribe((payload: any) => {
      console.log('Testimonials update:', payload);
      loadTestimonials();
    });

    // Return cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await happyClientsService.getAll();
      console.log('Loaded testimonials:', data);
      setTestimonials(data || []);
    } catch (error: any) {
      console.error('Error loading testimonials:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load testimonials',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
    try {
      console.log('📤 Uploading to Cloudinary:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        fileType: file.type,
        folder: `parbati/happy-clients/${folder}`,
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('folder', `parbati/happy-clients/${folder}`);
      formData.append('resource_type', 'auto');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/gvjhfpzo/auto/upload`,
        {
          method: 'POST',
          body: formData,
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

  const handleAdd = () => {
    setSelectedVideoFile(null);
    setFormData({
      name: '',
      title: '',
      videoPath: '',
      videoPreview: '',
      rating: 5,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (testimonial: ClientTestimonial) => {
    setSelectedVideoFile(null);
    setFormData({
      name: testimonial.name || '',
      title: testimonial.title || '',
      videoPath: testimonial.video_path || testimonial.videoPath || '',
      videoPreview: '',
      rating: testimonial.rating || 5,
    });
    setEditingId(testimonial.id || null);
    setShowForm(true);
  };

  const handleSave = async () => {
    // Validate individual fields
    const errors: string[] = [];
    
    if (!formData.name.trim()) {
      errors.push('Client Name is required');
    }
    if (!formData.title.trim()) {
      errors.push('Title/Project is required');
    }

    // For NEW testimonials: must have a video file
    if (!editingId && !selectedVideoFile) {
      errors.push('Video is required');
    }

    // Show one error notification if any fields are missing
    if (errors.length > 0) {
      addNotification({
        type: 'error',
        message: errors.join(' • '),
      });
      return;
    }

    try {
      setUploading(true);
      let finalVideoUrl = formData.videoPath;

      // Upload video if file is selected
      if (selectedVideoFile) {
        console.log('🔄 UPLOADING VIDEO...');
        try {
          finalVideoUrl = await uploadToCloudinary(selectedVideoFile, 'videos');
          console.log('✅ Video upload successful');
        } catch (uploadError: any) {
          console.error('❌ Video upload failed:', uploadError.message);
          throw new Error(`Video upload failed: ${uploadError.message}`);
        }
      }

      // Verify we have a video URL
      if (!finalVideoUrl) {
        throw new Error('No video URL available');
      }

      console.log('🗄️ SAVING TO DATABASE...');
      
      // Minimal object - only insert fields that MUST exist
      const dataToSave: any = {};
      
      // Always include name and video
      dataToSave.name = formData.name;
      dataToSave.video_path = finalVideoUrl;
      
      // Only add title if form has it and it's not empty
      if (formData.title && formData.title.trim()) {
        dataToSave.title = formData.title;
      }
      
      // Only add rating if it exists
      if (formData.rating) {
        dataToSave.rating = formData.rating;
      }
      
      console.log('Attempting to insert:', dataToSave);

      if (editingId !== null) {
        console.log('Updating testimonial:', editingId, dataToSave);
        const { data: updateData, error: updateError } = await supabase
          .from('happy_clients')
          .update(dataToSave)
          .eq('id', editingId)
          .select();
        
        if (updateError) {
          console.error('❌ UPDATE ERROR:', updateError);
          throw updateError;
        }
        console.log('✅ Update successful:', updateData);
        
        addNotification({
          type: 'success',
          message: 'Client testimonial updated',
        });
      } else {
        console.log('Creating new testimonial with:', dataToSave);
        const { data: createData, error: createError } = await supabase
          .from('happy_clients')
          .insert([dataToSave])
          .select();
        
        if (createError) {
          console.error('❌ CREATE ERROR:', createError);
          console.error('Error details:', {
            message: createError.message,
            details: createError.details,
            hint: createError.hint,
          });
          throw createError;
        }
        console.log('✅ Create successful:', createData);
        
        addNotification({
          type: 'success',
          message: 'Client testimonial added',
        });
      }

      setShowForm(false);
      setSelectedVideoFile(null);
      await loadTestimonials();
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      addNotification({
        type: 'error',
        message: 'Failed to save testimonial: ' + (error.message || 'Unknown error'),
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (confirm('Delete this client testimonial?')) {
      try {
        await happyClientsService.delete(id);
        addNotification({
          type: 'success',
          message: 'Client testimonial deleted',
        });
        await loadTestimonials();
      } catch (error: any) {
        console.error('Error deleting testimonial:', error);
        addNotification({
          type: 'error',
          message: 'Failed to delete testimonial',
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Happy Clients</h1>
            <p className="text-gray-600 mt-2">Manage client testimonial videos ({testimonials.length} total)</p>
          </div>
          <Button variant="primary" size="md" className="gap-2" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <Modal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title={editingId ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
            size="lg"
            footer={
              <>
                <Button variant="secondary" onClick={() => setShowForm(false)} disabled={uploading}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={uploading}>
                  {uploading ? 'Uploading...' : (editingId ? 'Update' : 'Add')} Client
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input
                label="Client Name"
                placeholder="e.g., Garima"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={uploading}
              />

              <Input
                label="Title/Project"
                placeholder="e.g., Homeowner - Living Room Transformation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={uploading}
              />

              <VideoUpload
                label="Video Upload"
                value={formData.videoPath}
                preview={formData.videoPreview}
                onChange={(file) => {
                  console.log('🎯 HappyClients.tsx received onChange callback with video:', file?.name);
                  setSelectedVideoFile(file);
                }}
                onPreviewChange={(preview) => {
                  console.log('🎯 HappyClients.tsx received onPreviewChange callback for video');
                  setFormData(prev => ({ ...prev, videoPreview: preview }));
                }}
                required
                disabled={uploading}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rating
                </label>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 disabled:opacity-50"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  disabled={uploading}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {'⭐'.repeat(r)} {r} Stars
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Modal>
        )}

        {/* Testimonials Grid */}
        {loading ? (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading testimonials...</p>
            </CardBody>
          </Card>
        ) : testimonials.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600 mb-4">No client testimonials yet. Add your first one!</p>
              <Button variant="primary" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Testimonial
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden">
                {/* Video Preview */}
                <div className="h-48 bg-gray-900 flex items-center justify-center relative group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                    <p className="text-white text-xs font-semibold">VIDEO</p>
                    <p className="text-gray-400 text-xs mt-2 max-w-xs truncate">
                      {testimonial.video_path || testimonial.videoPath}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <CardBody className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{testimonial.title}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </CardBody>

                {/* Actions */}
                <CardFooter className="gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
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
