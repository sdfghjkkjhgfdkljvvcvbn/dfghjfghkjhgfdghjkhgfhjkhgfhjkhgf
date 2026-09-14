import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ImageUpload } from '../components/ImageUpload';
import { Modal } from '../components/Modal';
import { useUIStore } from '../store/uiStore';
import { galleryService } from '../services/supabaseClient';
import { supabase } from '../services/supabaseClient';

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
  const [uploading, setUploading] = useState(false);
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  
  // SEPARATE FILE STATE - prevents state overwriting
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedBeforeImageFile, setSelectedBeforeImageFile] = useState<File | null>(null);
  
  // Form data (without files)
  const [formData, setFormData] = useState({
    roomType: 'Bedroom',
    title: '',
    imageUrl: '',
    imagePreview: '',
    beforeImage: '',
    beforeImagePreview: '',
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
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to load images';
      console.error('Error loading images:', errorMsg);
      addNotification({
        type: 'error',
        message: errorMsg,
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
    setSelectedImageFile(null);
    setSelectedBeforeImageFile(null);
    setFormData({
      roomType: 'Bedroom',
      title: '',
      imageUrl: '',
      imagePreview: '',
      beforeImage: '',
      beforeImagePreview: '',
      isBeforeAfter: false,
    });
    setEditingImage(null);
    setShowForm(true);
  };

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    try {
      console.log('🔐 CLOUDINARY UPLOAD: Starting...');
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      console.log('📤 Uploading to Cloudinary:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        fileType: file.type,
        folder: `parbati/gallery/${folder}`,
      });

      // Create FormData with actual File object (NOT base64)
      const formData = new FormData();
      formData.append('file', file);  // Send actual file, not base64
      formData.append('upload_preset', 'ml_default');
      formData.append('folder', `parbati/gallery/${folder}`);
      formData.append('resource_type', 'auto');

      console.log('📡 Uploading to Cloudinary API...');
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/gvjhfpzo/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('>>> CLOUDINARY RESPONSE <<<');
      console.log('Full Response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('❌ HTTP Error from Cloudinary:', {
          status: response.status,
          error: data.error,
        });
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      // Check for URL in response
      if (!data.secure_url && !data.url) {
        console.error('❌ No URL in Cloudinary response:', {
          hasSecureUrl: !!data.secure_url,
          hasUrl: !!data.url,
          keys: Object.keys(data),
        });
        throw new Error('Cloudinary response missing secure_url and url');
      }

      const cloudinaryUrl = data.secure_url || data.url;
      console.log('✅ URL extracted:', cloudinaryUrl);

      return cloudinaryUrl;
    } catch (error: any) {
      console.error('\n>>> CLOUDINARY UPLOAD ERROR <<<');
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      console.error('>>> END ERROR <<<\n');
      throw error;
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    setSelectedImageFile(null);
    setSelectedBeforeImageFile(null);
    setFormData({
      roomType: image.room_type || image.roomType || 'Bedroom',
      title: image.title || '',
      imageUrl: image.image_url || image.imageUrl || '',
      imagePreview: '',
      beforeImage: image.before_image_url || image.beforeImage || '',
      beforeImagePreview: '',
      isBeforeAfter: image.is_before_after || image.isBeforeAfter || false,
    });
    setEditingImage(image);
    setShowForm(true);
  };

  const handleSaveImage = async () => {
    console.log('=== SAVE IMAGE STARTED ===');
    console.log('Form Data:', {
      title: formData.title,
      roomType: formData.roomType,
      selectedImageFile: selectedImageFile?.name,
      imageUrl: formData.imageUrl,
      imagePreview: formData.imagePreview ? 'EXISTS' : 'MISSING',
    });

    console.log('=== FINAL FILE CHECK ===');
    console.log('selectedImageFile:', selectedImageFile);
    console.log('is File:', selectedImageFile instanceof File);
    console.log('file name:', selectedImageFile?.name);
    console.log('file type:', selectedImageFile?.type);
    console.log('file size:', selectedImageFile?.size);

    // 1. Validate title
    if (!formData.title.trim()) {
      addNotification({
        type: 'error',
        message: 'Title is required',
      });
      return;
    }

    // 2. For NEW images: must have selectedImageFile
    if (!editingImage && !selectedImageFile) {
      console.error('❌ No selectedImageFile for new gallery entry');
      addNotification({
        type: 'error',
        message: 'Image is required - please select an image file',
      });
      return;
    }

    // 3. Verify it's actually a File
    if (!editingImage && selectedImageFile && !(selectedImageFile instanceof File)) {
      console.error('❌ selectedImageFile is not a File instance');
      addNotification({
        type: 'error',
        message: 'Invalid file - please select again',
      });
      return;
    }

    // 4. For BEFORE/AFTER: must have selectedBeforeImageFile
    if (formData.isBeforeAfter && !editingImage && !selectedBeforeImageFile) {
      addNotification({
        type: 'error',
        message: 'Before image is required for before/after',
      });
      return;
    }

    if (formData.isBeforeAfter && editingImage && formData.isBeforeAfter !== (editingImage.is_before_after || editingImage.isBeforeAfter) && !selectedBeforeImageFile) {
      addNotification({
        type: 'error',
        message: 'Before image is required for before/after',
      });
      return;
    }

    try {
      setUploading(true);
      let finalImageUrl = formData.imageUrl;
      let finalBeforeImageUrl = formData.beforeImage;

      console.log('Initial state:', { 
        finalImageUrl, 
        finalBeforeImageUrl,
        hasImageFile: !!selectedImageFile,
        hasBeforeImageFile: !!selectedBeforeImageFile,
      });

      // STEP 1: Upload main image if file is selected
      if (selectedImageFile) {
        console.log('🔄 UPLOADING MAIN IMAGE...');
        console.log('File details:', {
          name: selectedImageFile.name,
          size: `${(selectedImageFile.size / 1024 / 1024).toFixed(2)}MB`,
          type: selectedImageFile.type,
        });
        
        try {
          finalImageUrl = await uploadImage(selectedImageFile, 'gallery');
          console.log('✅ Main image upload successful');
          console.log('Returned URL:', finalImageUrl);
          
          // Verify URL
          if (!finalImageUrl || !finalImageUrl.startsWith('https://')) {
            throw new Error(`Invalid URL from Cloudinary: ${finalImageUrl}`);
          }
        } catch (uploadError: any) {
          console.error('❌ Main image upload failed:', uploadError.message);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      // STEP 2: Upload before image if file is selected
      if (selectedBeforeImageFile) {
        console.log('🔄 UPLOADING BEFORE IMAGE...');
        console.log('File details:', {
          name: selectedBeforeImageFile.name,
          size: `${(selectedBeforeImageFile.size / 1024 / 1024).toFixed(2)}MB`,
          type: selectedBeforeImageFile.type,
        });
        
        try {
          finalBeforeImageUrl = await uploadImage(selectedBeforeImageFile, 'gallery/before');
          console.log('✅ Before image upload successful');
          console.log('Returned URL:', finalBeforeImageUrl);
          
          // Verify URL
          if (!finalBeforeImageUrl || !finalBeforeImageUrl.startsWith('https://')) {
            throw new Error(`Invalid URL from Cloudinary: ${finalBeforeImageUrl}`);
          }
        } catch (uploadError: any) {
          console.error('❌ Before image upload failed:', uploadError.message);
          throw new Error(`Before image upload failed: ${uploadError.message}`);
        }
      }

      // STEP 3: Verify we have a valid main image URL
      console.log('Pre-database check:', {
        finalImageUrl,
        finalBeforeImageUrl,
        isBeforeAfter: formData.isBeforeAfter,
      });

      if (!finalImageUrl) {
        throw new Error('No image URL available - upload may have failed');
      }

      // STEP 4: Save to database
      console.log('🗄️ SAVING TO DATABASE...');
      const dataToSave = {
        room_type: formData.roomType,
        title: formData.title,
        image_url: finalImageUrl,
        before_image_url: finalBeforeImageUrl || null,
        is_before_after: formData.isBeforeAfter,
      };

      console.log('Database insert/update data:', dataToSave);

      if (editingImage) {
        await galleryService.update(editingImage.id, dataToSave);
        console.log('✅ Database record updated successfully');
        addNotification({
          type: 'success',
          message: 'Gallery image updated successfully',
        });
      } else {
        const newId = Date.now().toString();
        await galleryService.create({
          id: newId,
          ...dataToSave,
        });
        console.log('✅ Database record created successfully');
        addNotification({
          type: 'success',
          message: 'Gallery image added successfully',
        });
      }

      // STEP 5: Reset file state and close
      setSelectedImageFile(null);
      setSelectedBeforeImageFile(null);
      setShowForm(false);
      await loadImages();
      console.log('=== SAVE IMAGE COMPLETED SUCCESSFULLY ===');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to save image';
      console.error('=== SAVE IMAGE FAILED ===');
      console.error('Error:', errorMsg);
      console.error('Full error:', error);
      addNotification({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setUploading(false);
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
                <Button variant="primary" onClick={handleSaveImage} disabled={uploading}>
                  {uploading ? 'Uploading...' : (editingImage ? 'Update' : 'Add')} Image
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
                  disabled={uploading}
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
                disabled={uploading}
              />

              <ImageUpload
                label="Gallery Image"
                value={formData.imageUrl}
                preview={formData.imagePreview}
                onChange={(file) => {
                  console.log('🎯 Gallery.tsx received onChange callback with file:', file?.name);
                  console.log('Setting selectedImageFile state to:', file);
                  setSelectedImageFile(file);
                  console.log('✅ selectedImageFile updated to:', file instanceof File ? 'File object' : 'null');
                }}
                onPreviewChange={(preview) => {
                  console.log('🎯 Gallery.tsx received onPreviewChange callback');
                  console.log('Updating imagePreview (separate from file state)');
                  setFormData(prev => ({ ...prev, imagePreview: preview }));
                }}
                required
                disabled={uploading}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBeforeAfter"
                  checked={formData.isBeforeAfter}
                  onChange={(e) => setFormData({ ...formData, isBeforeAfter: e.target.checked })}
                  className="w-4 h-4 accent-red-600"
                  disabled={uploading}
                />
                <label htmlFor="isBeforeAfter" className="text-sm font-medium text-gray-900">
                  This is a before/after comparison
                </label>
              </div>

              {formData.isBeforeAfter && (
                <ImageUpload
                  label="Before Image"
                  value={formData.beforeImage}
                  preview={formData.beforeImagePreview}
                  onChange={(file) => {
                    console.log('🎯 Gallery.tsx received onChange callback for before image:', file?.name);
                    setSelectedBeforeImageFile(file);
                  }}
                  onPreviewChange={(preview) => {
                    console.log('🎯 Gallery.tsx received onPreviewChange callback for before image');
                    setFormData(prev => ({ ...prev, beforeImagePreview: preview }));
                  }}
                  required
                  disabled={uploading}
                />
              )}
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
