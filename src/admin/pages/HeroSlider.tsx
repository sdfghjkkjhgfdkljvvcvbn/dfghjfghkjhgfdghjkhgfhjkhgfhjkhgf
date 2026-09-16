import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, GripVertical, Upload, X } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useUIStore } from '../store/uiStore';
import { supabase } from '../services/supabaseClient';

interface HeroSlide {
  id: string;
  headline?: string;
  subheading?: string;
  image_url?: string;
  imageUrl?: string;
  button_text?: string;
  buttonText?: string;
  button_link?: string;
  buttonLink?: string;
  status?: 'Draft' | 'Published' | 'Scheduled';
  display_order?: number;
  displayOrder?: number;
  created_at?: string;
  createdAt?: string;
}

export const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    subheading: '',
    imageUrl: '',
    imageFile: null as File | null,
    imagePreview: '',
    buttonText: '',
    buttonLink: '',
    status: 'Draft' as 'Draft' | 'Published' | 'Scheduled',
    displayOrder: 1,
  });
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        const errorMsg = error.message || 'Failed to load slides. Make sure the hero_slides table exists in Supabase.';
        console.error('Load error:', errorMsg);
        addNotification({
          type: 'error',
          message: errorMsg,
        });
        setSlides([]);
        return;
      }
      
      console.log('Loaded hero slides:', data);
      setSlides(data || []);
    } catch (error: any) {
      const errorMsg = error.message || 'Unexpected error loading slides';
      console.error('Error loading slides:', errorMsg);
      addNotification({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = () => {
    setFormData({
      headline: '',
      subheading: '',
      imageUrl: '',
      imageFile: null,
      imagePreview: '',
      buttonText: '',
      buttonLink: '',
      status: 'Draft',
      displayOrder: slides.length + 1,
    });
    setEditingSlide(null);
    setShowForm(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addNotification({
        type: 'error',
        message: 'Please select a valid image file',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        type: 'error',
        message: 'Image must be less than 5MB',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      
      console.log('🔐 UPLOAD STARTED: Using Cloudinary...');
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('Image must be less than 100MB');
      }

      console.log('📤 Uploading to Cloudinary:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        fileType: file.type,
        folder: 'parbati/hero-slides',
      });

      // Direct upload without using service
      const CLOUD_NAME = 'gvjhfpzo';
      const UPLOAD_PRESET = 'ml_default';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'parbati/hero-slides');
      formData.append('resource_type', 'auto');

      console.log('📡 Sending to Cloudinary API...');
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Cloudinary error:', data);
        throw new Error(data.error?.message || `Upload failed: ${response.status}`);
      }

      if (!data.secure_url) {
        console.error('No URL in response:', data);
        throw new Error('No URL returned from Cloudinary');
      }

      const imageUrl = data.secure_url;
      console.log('✓ Upload successful, URL:', imageUrl);
      return imageUrl;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to upload image';
      console.error('❌ Image upload error:', errorMsg);
      addNotification({
        type: 'error',
        message: errorMsg,
      });
      throw new Error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setFormData({
      headline: slide.headline || '',
      subheading: slide.subheading || '',
      imageUrl: slide.image_url || '',
      imageFile: null as any,
      imagePreview: '',
      buttonText: slide.button_text || '',
      buttonLink: slide.button_link || '',
      status: slide.status || 'Draft',
      displayOrder: slide.display_order || 1,
    });
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleSaveSlide = async () => {
    if (!formData.headline.trim()) {
      addNotification({
        type: 'error',
        message: 'Headline is required',
      });
      return;
    }

    if (!formData.imageFile && !formData.imageUrl && !editingSlide) {
      addNotification({
        type: 'error',
        message: 'Image is required',
      });
      return;
    }

    try {
      let finalImageUrl = formData.imageUrl;

      // Upload image if a new file was selected
      if (formData.imageFile) {
        finalImageUrl = await uploadImage(formData.imageFile);
      }

      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update({
            headline: formData.headline,
            subheading: formData.subheading,
            image_url: finalImageUrl,
            button_text: formData.buttonText,
            button_link: formData.buttonLink,
            status: formData.status,
            display_order: formData.displayOrder,
          })
          .eq('id', editingSlide.id);
        
        if (error) {
          console.error('Update error:', error);
          throw new Error(error.message || 'Failed to update slide');
        }
        addNotification({
          type: 'success',
          message: 'Slide updated successfully',
        });
      } else {
        // Generate UUID for new slide
        const newId = crypto.randomUUID();
        const { error } = await supabase
          .from('hero_slides')
          .insert({
            id: newId,
            headline: formData.headline,
            subheading: formData.subheading,
            image_url: finalImageUrl,
            button_text: formData.buttonText,
            button_link: formData.buttonLink,
            status: formData.status,
            display_order: formData.displayOrder,
          });
        
        if (error) {
          console.error('Insert error:', error);
          throw new Error(error.message || 'Failed to add slide');
        }
        addNotification({
          type: 'success',
          message: 'Slide added successfully',
        });
      }
      setShowForm(false);
      await loadSlides();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to save slide';
      console.error('Error saving slide:', errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this slide?')) {
      try {
        const { error } = await supabase
          .from('hero_slides')
          .delete()
          .eq('id', id);
        
        if (error) {
          const errorMsg = error.message || 'Failed to delete slide';
          console.error('Delete error:', errorMsg);
          throw new Error(errorMsg);
        }
        
        addNotification({
          type: 'success',
          message: 'Slide deleted successfully',
        });
        await loadSlides();
      } catch (error: any) {
        const errorMsg = error.message || 'Failed to delete slide';
        console.error('Error deleting slide:', errorMsg);
        addNotification({
          type: 'error',
          message: errorMsg,
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Slider</h1>
            <p className="text-gray-600 mt-2">Manage homepage hero slider content</p>
          </div>
          <Button variant="primary" size="md" className="gap-2" onClick={handleAddSlide}>
            <Plus className="w-4 h-4" />
            Add Slide
          </Button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <Modal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title={editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
            size="lg"
            footer={
              <>
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveSlide} disabled={uploading}>
                  {uploading ? 'Uploading...' : (editingSlide ? 'Update' : 'Add')} Slide
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input
                label="Headline"
                placeholder="Hero slide headline"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                required
              />

              <Input
                label="Subheading"
                placeholder="Supporting text"
                value={formData.subheading}
                onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
              />

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hero Image *
                </label>
                <div className="space-y-3">
                  {/* Upload Input */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 transition-colors text-center">
                      <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formData.imagePreview && (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageFile: null,
                            imagePreview: '',
                          }))
                        }
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Current Image for Editing */}
                  {editingSlide && formData.imageUrl && !formData.imagePreview && (
                    <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                      Current image is saved
                    </div>
                  )}
                </div>
              </div>

              <Input
                label="Button Text"
                placeholder="e.g., View Projects"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              />

              <Input
                label="Button Link"
                placeholder="/projects"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Draft' | 'Published' | 'Scheduled' })}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <Input
                label="Display Order"
                type="number"
                placeholder="1"
                value={String(formData.displayOrder)}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
              />
            </div>
          </Modal>
        )}

        {slides.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              {loading ? (
                <>
                  <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading slides...</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">No slides yet. Create your first slide!</p>
                  <Button variant="primary" onClick={handleAddSlide}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Slide
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {slides.map((slide) => (
              <Card key={slide.id}>
                <CardBody>
                  <div className="flex items-start gap-4">
                    <GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{slide.headline}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded flex-shrink-0 ${
                          (slide.status || 'Draft') === 'Published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {slide.status || 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{slide.subheading}</p>
                      {(slide.button_text || slide.buttonText) && (
                        <p className="text-xs text-red-600 mt-1">Button: {slide.button_text || slide.buttonText}</p>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="secondary" size="sm" onClick={() => handleEditSlide(slide)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(slide.id)}>
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
