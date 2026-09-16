-- ============================================
-- MIGRATION: Add `image` column to `services` table
-- ============================================
-- This fixes the schema mismatch where frontend sends `image`
-- but the database column doesn't exist

-- Add the missing `image` column
ALTER TABLE services
ADD COLUMN IF NOT EXISTS image text;

-- Verify the column was added
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'services'
ORDER BY ordinal_position;

-- Expected output should include:
-- image | text | YES
