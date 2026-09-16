-- ============================================
-- FIX HAPPY CLIENTS TABLE SCHEMA
-- Add missing client_image column
-- ============================================

-- Check current happy_clients table structure
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'happy_clients' ORDER BY ordinal_position;

-- Add missing client_image column if it doesn't exist
ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS client_image text;

-- Verify the column exists now
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'happy_clients' ORDER BY ordinal_position;

-- If needed, also add project_image column
ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS project_image text;

-- Add display_order column if missing (for sorting)
ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- ============================================
-- HAPPY CLIENTS TABLE FINAL SCHEMA
-- ============================================
-- After this fix, table should have:
--   id: integer PRIMARY KEY
--   name: text NOT NULL
--   title: text
--   video_path: text
--   client_image: text ← ADDED
--   project_image: text ← ADDED
--   rating: integer DEFAULT 5
--   display_order: integer DEFAULT 0
--   created_at: timestamptz DEFAULT now()
-- ============================================
