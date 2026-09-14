-- Fix Happy Clients Schema
-- Run this in Supabase SQL Editor if you get column not found errors

-- Ensure happy_clients table has the required columns
ALTER TABLE IF EXISTS happy_clients 
ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';

ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS title text;

ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS video_path text;

ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS rating integer DEFAULT 5;

-- Optional columns (not used in form, but for backward compatibility)
ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS client_image text;

ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS project_image text;

ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

ALTER TABLE happy_clients 
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Verify the table structure
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'happy_clients' ORDER BY ordinal_position;
