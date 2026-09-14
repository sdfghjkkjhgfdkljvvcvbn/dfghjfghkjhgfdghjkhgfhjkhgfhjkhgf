import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { ImageUpload } from './ImageUpload';
import { Modal } from './Modal';
import { useUIStore } from '../store/uiStore';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: string;
  updatedAt?: string;
}

interface ProjectFormProps {
  project: Project | null;
  categories: string[];
  onSave: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  categories,
  onSave,
  onCancel,
}) => {
  const [uploading, setUploading] = useState(false);
  const { addNotification } = useUIStore();
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || categories[0],
    mediaUrl: project?.mediaUrl || '',
    mediaFile: null as File | null,
    mediaPreview: '',
    mediaType: project?.mediaType || 'image' as 'image' | 'video',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const uploadMedia = async (file: File): Promise<string> => {
    try {
      console.log('🔐 CLOUDINARY UPLOAD: Starting...');
      console.log('File:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      // Validate file type (image or video)
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        throw new Error('Only image and video files are allowed');
      }

      // Direct Cloudinary upload
      const CLOUD_NAME = 'gvjhfpzo';
      const UPLOAD_PRESET = 'ml_default';

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('upload_preset', UPLOAD_PRESET);
      cloudinaryFormData.append('folder', 'parbati/projects');
      cloudinaryFormData.append('resource_type', 'auto');

      console.log('📡 Uploading to Cloudinary...');
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: cloudinaryFormData,
      });

      const data = await response.json();
      console.log('Cloudinary response:', data);

      if (!response.ok) {
        console.error('Cloudinary error:', data);
        throw new Error(data.error?.message || 'Upload failed');
      }

      const cloudinaryUrl = data.secure_url || data.url;
      console.log('✅ Upload successful, URL:', cloudinaryUrl);
      return cloudinaryUrl;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to upload media';
      console.error('❌ Media upload error:', errorMsg);
      throw new Error(errorMsg);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.mediaFile && !formData.mediaUrl && !project) {
      newErrors.mediaUrl = 'Media is required - please select an image or enter video URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FORM SUBMITTED ===');
    console.log('Current form data:', formData);

    if (!validateForm()) {
      console.error('Form validation failed');
      console.log('Errors:', errors);
      return;
    }

    try {
      setUploading(true);
      let finalMediaUrl = formData.mediaUrl;

      console.log('Media file check:', {
        hasFile: !!formData.mediaFile,
        hasUrl: !!formData.mediaUrl,
        isEditing: !!project,
      });

      // Upload media if a new file was selected
      if (formData.mediaFile) {
        console.log('🔄 Starting media upload...');
        finalMediaUrl = await uploadMedia(formData.mediaFile);
        console.log('✅ Media URL obtained:', finalMediaUrl);
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        mediaUrl: finalMediaUrl,
        mediaType: formData.mediaType,
      };

      console.log('📤 Calling onSave with data:', projectData);
      onSave(projectData);
      console.log('=== FORM SUBMISSION COMPLETED ===');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to save project';
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Error:', errorMsg);
      console.error('Stack:', error.stack);
      addNotification({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={project ? 'Edit Project' : 'Add New Project'}
      size="lg"
      footer={
        <>
          <Button 
            variant="secondary" 
            onClick={onCancel} 
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={uploading}
            type="button"
          >
            {uploading ? 'Uploading...' : (project ? 'Update Project' : 'Add Project')}
          </Button>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Title */}
        <Input
          label="Project Title"
          type="text"
          placeholder="e.g., Modern Kitchen Design"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
          disabled={uploading}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:border-red-600 resize-none disabled:opacity-50 ${
              errors.description
                ? 'border-red-600 bg-red-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            placeholder="Describe your project..."
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={uploading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {errors.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Category <span className="text-red-600">*</span>
          </label>
          <select
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-red-600 bg-white hover:border-gray-400 transition-colors disabled:opacity-50"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            disabled={uploading}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Media Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Media Type <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                value="image"
                checked={formData.mediaType === 'image'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mediaType: e.target.value as 'image' | 'video',
                  })
                }
                className="w-4 h-4"
                disabled={uploading}
              />
              <span className="text-sm text-gray-700">Image</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                value="video"
                checked={formData.mediaType === 'video'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mediaType: e.target.value as 'image' | 'video',
                  })
                }
                className="w-4 h-4"
                disabled={uploading}
              />
              <span className="text-sm text-gray-700">Video</span>
            </label>
          </div>
        </div>

        {/* Media Upload/URL */}
        {formData.mediaType === 'image' ? (
          <ImageUpload
            label="Project Image"
            value={formData.mediaUrl}
            preview={formData.mediaPreview}
            onChange={(file) => {
              console.log('Image selected:', file?.name);
              setFormData({ ...formData, mediaFile: file });
            }}
            onPreviewChange={(preview) => {
              console.log('Preview created');
              setFormData(prev => ({ ...prev, mediaPreview: preview }));
            }}
            required
            disabled={uploading}
          />
        ) : (
          <Input
            label="Video URL"
            type="text"
            placeholder="https://example.com/video.mp4 or Google Drive link"
            value={formData.mediaUrl}
            onChange={(e) =>
              setFormData({ ...formData, mediaUrl: e.target.value })
            }
            error={errors.mediaUrl}
            helperText="Support Google Drive links and direct video URLs"
            required
            disabled={uploading}
          />
        )}
      </form>
    </Modal>
  );
};
