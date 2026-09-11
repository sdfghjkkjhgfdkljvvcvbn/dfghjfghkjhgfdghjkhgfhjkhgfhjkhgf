import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';

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
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || categories[0],
    mediaUrl: project?.mediaUrl || '',
    mediaType: project?.mediaType || 'image' as 'image' | 'video',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.mediaUrl.trim()) {
      newErrors.mediaUrl = 'Media URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      mediaUrl: formData.mediaUrl,
      mediaType: formData.mediaType,
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={project ? 'Edit Project' : 'Add New Project'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {project ? 'Update Project' : 'Add Project'}
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
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            className={`w-full px-4 py-2.5 border-2 rounded-lg text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:border-red-600 resize-none ${
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
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-red-600 bg-white hover:border-gray-400 transition-colors"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
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
              />
              <span className="text-sm text-gray-700">Video</span>
            </label>
          </div>
        </div>

        {/* Media URL */}
        <Input
          label={`${formData.mediaType === 'image' ? 'Image' : 'Video'} URL`}
          type="text"
          placeholder={
            formData.mediaType === 'image'
              ? 'https://example.com/image.jpg'
              : 'https://example.com/video.mp4 or Google Drive link'
          }
          value={formData.mediaUrl}
          onChange={(e) =>
            setFormData({ ...formData, mediaUrl: e.target.value })
          }
          error={errors.mediaUrl}
          helperText={
            formData.mediaType === 'video'
              ? 'Support Google Drive links and direct video URLs'
              : 'Direct image URL'
          }
          required
        />

        {/* Preview */}
        {formData.mediaUrl && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">Preview:</p>
            <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              {formData.mediaType === 'video' ? (
                <div className="text-center">
                  <div className="text-2xl mb-2">▶</div>
                  <p className="text-xs">Video Preview</p>
                </div>
              ) : (
                <p className="text-xs">[Image Preview]</p>
              )}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
