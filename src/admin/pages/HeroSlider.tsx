import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    headline: '',
    subheading: '',
    imageUrl: '',
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
      
      if (error) throw error;
      console.log('Loaded hero slides:', data);
      setSlides(data || []);
      
      const subscription = supabase
        .channel('hero-slides-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_slides' }, (payload: any) => {
          console.log('Hero slides update:', payload);
          loadSlides();
        })
        .subscribe();
      
      return () => subscription?.unsubscribe();
    } catch (error: any) {
      console.error('Error loading slides:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load slides',
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
      buttonText: '',
      buttonLink: '',
      status: 'Draft',
      displayOrder: slides.length + 1,
    });
    setEditingSlide(null);
    setShowForm(true);
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setFormData({
      headline: slide.headline || '',
      subheading: slide.subheading || '',
      imageUrl: slide.image_url || slide.imageUrl || '',
      buttonText: slide.button_text || slide.buttonText || '',
      buttonLink: slide.button_link || slide.buttonLink || '',
      status: slide.status || 'Draft',
      displayOrder: slide.display_order || slide.displayOrder || 1,
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

    try {
      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update({
            headline: formData.headline,
            subheading: formData.subheading,
            image_url: formData.imageUrl,
            button_text: formData.buttonText,
            button_link: formData.buttonLink,
            status: formData.status,
            display_order: formData.displayOrder,
          })
          .eq('id', editingSlide.id);
        
        if (error) throw error;
        addNotification({
          type: 'success',
          message: 'Slide updated',
        });
      } else {
        const { error } = await supabase
          .from('hero_slides')
          .insert({
            id: Date.now().toString(),
            headline: formData.headline,
            subheading: formData.subheading,
            image_url: formData.imageUrl,
            button_text: formData.buttonText,
            button_link: formData.buttonLink,
            status: formData.status,
            display_order: formData.displayOrder,
          });
        
        if (error) throw error;
        addNotification({
          type: 'success',
          message: 'Slide added',
        });
      }
      setShowForm(false);
      await loadSlides();
    } catch (error: any) {
      console.error('Error saving slide:', error);
      addNotification({
        type: 'error',
        message: 'Failed to save slide',
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
        
        if (error) throw error;
        addNotification({
          type: 'success',
          message: 'Slide deleted',
        });
        await loadSlides();
      } catch (error: any) {
        console.error('Error deleting slide:', error);
        addNotification({
          type: 'error',
          message: 'Failed to delete slide',
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
                <Button variant="primary" onClick={handleSaveSlide}>
                  {editingSlide ? 'Update' : 'Add'} Slide
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

              <Input
                label="Image URL"
                placeholder="Background image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />

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
