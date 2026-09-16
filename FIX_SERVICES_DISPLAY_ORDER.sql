-- ============================================
-- FIX: Add display_order column to services table
-- This is a safe migration that won't delete data
-- ============================================

-- Add the display_order column if it doesn't exist
ALTER TABLE services
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Assign sequential display_order to existing services
-- based on their creation order
UPDATE services
SET display_order = (
  SELECT ROW_NUMBER() OVER (ORDER BY created_at ASC)
  FROM services s2
  WHERE s2.id = services.id
)
WHERE display_order = 0;

-- Create index on display_order for performance
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

-- Verify the column exists and has values
-- SELECT id, name, display_order FROM services ORDER BY display_order;
