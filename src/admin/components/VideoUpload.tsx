import React, { useState } from 'react';
import { Upload, X, Film } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

interface VideoUploadProps {
  label?: string;
  value?: string;
  preview?: string;
  onChange: (file: File | null) => void;
  onPreviewChange: (preview: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  label = 'Video',
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
    console.log('🎬 VideoUpload.handleFileSelect called:', {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: file.type,
    });

    // Validate file type - accept video files
    if (!file.type.startsWith('video/')) {
      console.error('❌ Invalid file type:', file.type);
      addNotification({
        type: 'error',
        message: 'Please select a valid video file',
      });
      return;
    }

    // Validate file size (max 100MB for videos)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      addNotification({
        type: 'error',
        message: 'Video must be less than 100MB',
      });
      return;
    }

    console.log('✅ File validation passed, calling onChange callback...');
    onChange(file);
    console.log('✅ onChange callback executed');

    // For video preview, just use the filename (no binary preview)
    const previewText = `📹 ${file.name}`;
    console.log('🎞️ Video preview text:', previewText);
    onPreviewChange(previewText);
    console.log('✅ onPreviewChange callback executed');
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
            accept="video/*"
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="px-4 py-6 text-center">
            <Film className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">MP4, WebM, MOV, AVI up to 100MB</p>
          </div>
        </div>

        {/* Video Info Preview */}
        {preview && (
          <div className="relative">
            <div className="w-full h-32 bg-gray-900 rounded-lg border border-gray-200 flex items-center justify-center relative">
              <div className="text-center">
                <Film className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-white text-sm font-semibold">Video Selected</p>
                <p className="text-gray-400 text-xs mt-2 max-w-xs truncate px-4">
                  {preview}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Current Video Info */}
        {value && !preview && (
          <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">
            ✓ Current video is saved
          </div>
        )}
      </div>
    </div>
  );
};
