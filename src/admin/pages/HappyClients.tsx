import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Play } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useUIStore } from '../store/uiStore';
import { happyClientsService } from '../services/supabaseClient';

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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    videoPath: '',
    clientImage: '',
    rating: 5,
  });
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await happyClientsService.getAll();
      console.log('Loaded testimonials:', data);
      setTestimonials(data || []);
      
      const subscription = happyClientsService.subscribe((payload: any) => {
        console.log('Testimonials update:', payload);
        loadTestimonials();
      });
      
      return () => subscription?.unsubscribe();
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

  const handleAdd = () => {
    setFormData({
      name: '',
      title: '',
      videoPath: '',
      clientImage: '',
      rating: 5,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (testimonial: ClientTestimonial) => {
    setFormData({
      name: testimonial.name || '',
      title: testimonial.title || '',
      videoPath: testimonial.video_path || testimonial.videoPath || '',
      clientImage: testimonial.client_image || testimonial.clientImage || '',
      rating: testimonial.rating || 5,
    });
    setEditingId(testimonial.id || null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.title.trim() || !formData.videoPath.trim()) {
      addNotification({
        type: 'error',
        message: 'Please fill in all fields',
      });
      return;
    }

    try {
      if (editingId !== null) {
        await happyClientsService.update(editingId, {
          name: formData.name,
          title: formData.title,
          video_path: formData.videoPath,
          client_image: formData.clientImage,
          rating: formData.rating,
        });
        addNotification({
          type: 'success',
          message: 'Client testimonial updated',
        });
      } else {
        await happyClientsService.create({
          name: formData.name,
          title: formData.title,
          video_path: formData.videoPath,
          client_image: formData.clientImage,
          project_image: formData.clientImage,
          rating: formData.rating,
        });
        addNotification({
          type: 'success',
          message: 'Client testimonial added',
        });
      }
      setShowForm(false);
      await loadTestimonials();
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      addNotification({
        type: 'error',
        message: 'Failed to save testimonial',
      });
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
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  {editingId ? 'Update' : 'Add'} Client
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
              />

              <Input
                label="Title/Project"
                placeholder="e.g., Homeowner - Living Room Transformation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Input
                label="Video Path"
                placeholder="/video/our happy client/1.mp4"
                value={formData.videoPath}
                onChange={(e) => setFormData({ ...formData, videoPath: e.target.value })}
                helperText="Local video path or URL"
                required
              />

              <Input
                label="Client Image Path"
                placeholder="/reviewers/garima.jpg"
                value={formData.clientImage}
                onChange={(e) => setFormData({ ...formData, clientImage: e.target.value })}
                helperText="Image path or URL"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rating
                </label>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
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

                  <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                    Image: {testimonial.client_image || testimonial.clientImage}
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

        {/* Video Preview Guide */}
        <Card>
          <CardHeader title="Video Paths" />
          <CardBody className="space-y-2">
            <p className="text-sm text-gray-600">Supported video formats:</p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>/video/our happy client/1.mp4</li>
              <li>/video/our happy client/2.mp4</li>
              <li>/video/our happy client/3.mp4</li>
              <li>/video/our happy client/4.mp4</li>
              <li>/video/our happy client/5 .mp4</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
};
