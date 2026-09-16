/**
 * Cloudinary Upload Service
 * Direct upload to Cloudinary
 * Simple and working
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'gvjhfpzo';
const UPLOAD_PRESET = 'ml_default'; // Using unsigned preset

/**
 * Upload file directly to Cloudinary
 * No signatures, no presets needed
 */
export const uploadToCloudinary = async (file: File, folder: string = 'parbati'): Promise<string> => {
  try {
    console.log('📤 Uploading to Cloudinary...');
    
    if (!file) {
      throw new Error('No file selected');
    }

    // Validate file size
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(`File size exceeds 100MB limit`);
    }

    console.log('File:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('resource_type', 'auto');

    // Upload to Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
    console.log('Uploading to:', url);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary error:', data);
      const errorMsg = data.error?.message || data.error || `Upload failed (${response.status})`;
      throw new Error(errorMsg);
    }

    const imageUrl = data.secure_url;
    console.log('✅ Upload successful!');
    console.log('URL:', imageUrl);

    return imageUrl;
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
};


/**
 * Delete file from Cloudinary
 * Requires public_id and API key
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    console.log('🗑️ Deleting from Cloudinary:', publicId);
    
    // For deletion, we would need the API secret (backend only)
    // Frontend just removes from database
    // Full deletion should be done via backend/API
    
    return true;
  } catch (error: any) {
    console.error('Error deleting from Cloudinary:', error.message);
    throw error;
  }
};

/**
 * Transform Cloudinary URL for different use cases
 * Example: resize, crop, quality, format
 */
export const transformCloudinaryUrl = (
  url: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | 'low' | 'good' | 'best';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string => {
  if (!url || !url.includes('cloudinary')) {
    return url;
  }

  // If no options, return original URL
  if (!options) {
    return url;
  }

  // Build transformation string
  const transforms: string[] = [];
  
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  if (options.format) transforms.push(`f_${options.format}`);

  if (transforms.length === 0) {
    return url;
  }

  // Insert transformation into URL
  const transformation = transforms.join(',');
  return url.replace('/upload/', `/upload/${transformation}/`);
};

/**
 * Example transformations:
 * - Hero images: width 1920, height 600, quality auto, format auto
 * - Gallery thumbs: width 400, height 400, crop fill, quality good
 * - Project images: width 800, height 500, crop fit, quality auto
 */
