-- ============================================
-- FIX: Add missing 'image' column to services table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add image column if it doesn't exist
ALTER TABLE services
ADD COLUMN IF NOT EXISTS image text;

-- Add other missing columns that might be needed
ALTER TABLE services
ADD COLUMN IF NOT EXISTS features text[] DEFAULT ARRAY[]::text[];

-- Verify the table structure
\d services;

-- Check if columns were added
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'services'
ORDER BY ordinal_position;
