import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useUIStore } from '../store/uiStore';
import { galleryService } from '../services/supabaseClient';

interface GalleryImage {
  id: string;
  room_type?: string;
  roomType?: string;
  title?: string;
  image_url?: string;
  imageUrl?: string;
  before_image_url?: string;
  beforeImage?: string;
  is_before_after?: boolean;
  isBeforeAfter?: boolean;
  created_at?: string;
  createdAt?: string;
}

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    roomType: 'Bedroom',
    title: '',
    imageUrl: '',
    beforeImage: '',
    isBeforeAfter: false,
  });
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAll();
      console.log('Loaded gallery images:', data);
      setImages(data || []);
      
      const subscription = galleryService.subscribe((payload: any) => {
        console.log('Gallery update:', payload);
        loadImages();
      });
      
      return () => subscription?.unsubscribe();
    } catch (error: any) {
      console.error('Error loading images:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load images',
      });
    } finally {
      setLoading(false);
    }
  };

  const roomTypes = ['All', 'Bedroom', 'Living Room', 'Kitchen', 'Bathroom', 'Office', 'Commercial'];

  const filteredImages = roomTypeFilter === 'All' 
    ? images 
    : images.filter(img => (img.room_type || img.roomType) === roomTypeFilter);

  const handleAddImage = () => {
    setFormData({
      roomType: 'Bedroom',
      title: '',
      imageUrl: '',
      beforeImage: '',
      isBeforeAfter: false,
    });
    setEditingImage(null);
    setShowForm(true);
  };

  const handleEditImage = (image: GalleryImage) => {
    setFormData({
      roomType: image.room_type || image.roomType || 'Bedroom',
      title: image.title || '',
      imageUrl: image.image_url || image.imageUrl || '',
      beforeImage: image.before_image_url || image.beforeImage || '',
      isBeforeAfter: image.is_before_after || image.isBeforeAfter || false,
    });
    setEditingImage(image);
    setShowForm(true);
  };

  const handleSaveImage = async () => {
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      addNotification({
        type: 'error',
        message: 'Title and image URL are required',
      });
      return;
    }

    try {
      if (editingImage) {
        await galleryService.update(editingImage.id, {
          room_type: formData.roomType,
          title: formData.title,
          image_url: formData.imageUrl,
          before_image_url: formData.beforeImage,
          is_before_after: formData.isBeforeAfter,
        });
        addNotification({
          type: 'success',
          message: 'Gallery image updated',
        });
      } else {
        await galleryService.create({
          id: Date.now().toString(),
          room_type: formData.roomType,
          title: formData.title,
          image_url: formData.imageUrl,
          before_image_url: formData.beforeImage,
          is_before_after: formData.isBeforeAfter,
        });
        addNotification({
          type: 'success',
          message: 'Gallery image added',
        });
      }
      setShowForm(false);
      await loadImages();
    } catch (error: any) {
      console.error('Error saving image:', error);
      addNotification({
        type: 'error',
        message: 'Failed to save image',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this image?')) {
      try {
        await galleryService.delete(id);
        addNotification({
          type: 'success',
          message: 'Image deleted',
        });
        await loadImages();
      } catch (error: any) {
        console.error('Error deleting image:', error);
        addNotification({
          type: 'error',
          message: 'Failed to delete image',
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
            <p className="text-gray-600 mt-2">Manage gallery images by room type</p>
          </div>
          <Button variant="primary" size="md" className="gap-2" onClick={handleAddImage}>
            <Plus className="w-4 h-4" />
            Add Image
          </Button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <Modal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title={editingImage ? 'Edit Gallery Image' : 'Add Gallery Image'}
            size="lg"
            footer={
              <>
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveImage}>
                  {editingImage ? 'Update' : 'Add'} Image
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Room Type
                </label>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                >
                  {roomTypes.filter(r => r !== 'All').map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Image Title"
                placeholder="e.g., Modern Living Room"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Input
                label="Image URL"
                placeholder="Image path or URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
              />

              <Input
                label="Before Image URL"
                placeholder="Before image path (for before/after)"
                value={formData.beforeImage}
                onChange={(e) => setFormData({ ...formData, beforeImage: e.target.value })}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBeforeAfter"
                  checked={formData.isBeforeAfter}
                  onChange={(e) => setFormData({ ...formData, isBeforeAfter: e.target.checked })}
                  className="w-4 h-4 accent-red-600"
                />
                <label htmlFor="isBeforeAfter" className="text-sm font-medium text-gray-900">
                  This is a before/after comparison
                </label>
              </div>
            </div>
          </Modal>
        )}

        {/* Room Type Filter */}
        <div className="flex flex-wrap gap-2">
          {roomTypes.map((type) => (
            <button
              key={type}
              onClick={() => setRoomTypeFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roomTypeFilter === type
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading images...</p>
            </CardBody>
          </Card>
        ) : filteredImages.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600">No images in this category. Add your first image!</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="h-32 bg-gray-200 flex items-center justify-center relative group">
                  <span className="text-gray-400 text-sm">[Image]</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="p-2 bg-white rounded-full hover:bg-gray-100" onClick={() => handleEditImage(image)}>
                      <Edit2 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button 
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <CardBody className="space-y-2">
                  <p className="text-xs font-semibold text-red-600">{image.room_type || image.roomType}</p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">{image.title}</p>
                  {(image.is_before_after || image.isBeforeAfter) && (
                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded">
                      Before/After
                    </span>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
