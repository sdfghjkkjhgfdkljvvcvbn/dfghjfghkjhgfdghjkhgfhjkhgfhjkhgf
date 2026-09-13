import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

interface ImageUploadProps {
  label?: string;
  value?: string;
  preview?: string;
  onChange: (file: File | null) => void;
  onPreviewChange: (preview: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Image',
  value,
  preview,
  onChange,
  onPreviewChange,
  disabled = false,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { addNotification } = useUIStore();

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      addNotification({
        type: 'error',
        message: 'Please select a valid image file',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addNotification({
        type: 'error',
        message: 'Image must be less than 10MB',
      });
      return;
    }

    onChange(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      onPreviewChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    onPreviewChange('');
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      <div className="space-y-3">
        {/* Upload Input */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-red-600 bg-red-50'
              : 'border-gray-300 hover:border-red-600 hover:bg-red-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="px-4 py-6 text-center">
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 10MB</p>
          </div>
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Current Image Info */}
        {value && !preview && (
          <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">
            ✓ Current image is saved
          </div>
        )}
      </div>
    </div>
  );
};
