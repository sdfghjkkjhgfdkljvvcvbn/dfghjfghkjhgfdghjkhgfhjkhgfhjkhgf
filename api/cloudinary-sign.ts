/**
 * Cloudinary Signature Generator API
 * Generates signed requests for Cloudinary uploads
 * 
 * This endpoint should be called from frontend to get a signature
 * for uploading files to Cloudinary
 */

import crypto from 'crypto';

const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Generate signature for Cloudinary upload
 * POST /api/cloudinary-sign
 */
export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timestamp, folder } = req.body;

    if (!timestamp) {
      return res.status(400).json({ error: 'Timestamp required' });
    }

    if (!API_SECRET) {
      console.error('CLOUDINARY_API_SECRET not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate signature
    const params_to_sign = {
      timestamp: timestamp,
      folder: folder || 'parbati',
    };

    // Create string to sign
    const string_to_sign = Object.entries(params_to_sign)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Generate signature using SHA-256
    const signature = crypto
      .createHash('sha256')
      .update(string_to_sign + API_SECRET)
      .digest('hex');

    console.log('✓ Signature generated for timestamp:', timestamp);

    res.status(200).json({
      signature,
      timestamp,
      api_key: process.env.VITE_CLOUDINARY_API_KEY,
    });
  } catch (error: any) {
    console.error('Error generating signature:', error);
    res.status(500).json({ error: error.message || 'Failed to generate signature' });
  }
}
