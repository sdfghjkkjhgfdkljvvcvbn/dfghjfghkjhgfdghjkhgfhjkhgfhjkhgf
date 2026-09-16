-- Create Supabase Storage Bucket
-- Copy and paste this ENTIRE content into Supabase SQL Editor
-- Settings → SQL Editor → New Query
-- Paste this → Execute

-- Step 1: Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Done! Your bucket is created and public
-- You can now upload files to this bucket
