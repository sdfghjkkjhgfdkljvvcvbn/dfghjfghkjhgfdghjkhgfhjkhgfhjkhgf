-- ============================================
-- SUPABASE STORAGE RLS POLICIES - FIXED VERSION
-- Simplified for authenticated admin users
-- ============================================

-- NOTE: Run these queries FIRST to check existing policies
-- SELECT policyname, tablename, schemaname FROM pg_policies WHERE tablename = 'objects' ORDER BY policyname;
-- SELECT id, name FROM storage.buckets;

-- ============================================
-- IF POLICIES ALREADY EXIST, DROP THEM FIRST
-- ============================================
-- DROP POLICY IF EXISTS "Allow authenticated admin to upload hero-slide" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated to read hero-slide" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated admin to upload hero-slide images" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated users to read hero-slide images" ON storage.objects;
-- ... repeat for gallery and project buckets

-- ============================================
-- HERO-SLIDE BUCKET POLICIES (SIMPLIFIED)
-- ============================================

-- Allow authenticated users to INSERT (upload) files to hero-slide bucket
-- NOTE: owner_id will be set automatically by Supabase
CREATE POLICY "Allow authenticated to upload hero-slide"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'hero-slide')
  AND auth.role() = 'authenticated'
);

-- Allow all users to READ (download/view) hero-slide images
-- This allows the public website to display images
CREATE POLICY "Allow all to read hero-slide"
ON storage.objects
FOR SELECT
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'hero-slide')
);

-- Allow authenticated users to UPDATE their own hero-slide images
CREATE POLICY "Allow authenticated to update hero-slide"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'hero-slide')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
)
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'hero-slide')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
);

-- Allow authenticated users to DELETE their own hero-slide images
CREATE POLICY "Allow authenticated to delete hero-slide"
ON storage.objects
FOR DELETE
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'hero-slide')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
);

-- ============================================
-- GALLERY BUCKET POLICIES (SIMPLIFIED)
-- ============================================

CREATE POLICY "Allow authenticated to upload gallery"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery')
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow all to read gallery"
ON storage.objects
FOR SELECT
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery')
);

CREATE POLICY "Allow authenticated to update gallery"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
)
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
);

CREATE POLICY "Allow authenticated to delete gallery"
ON storage.objects
FOR DELETE
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
);

-- ============================================
-- PROJECT BUCKET POLICIES (SIMPLIFIED)
-- ============================================

CREATE POLICY "Allow authenticated to upload project"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'project')
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow all to read project"
ON storage.objects
FOR SELECT
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'project')
);

CREATE POLICY "Allow authenticated to update project"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'project')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
)
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'project')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
);

CREATE POLICY "Allow authenticated to delete project"
ON storage.objects
FOR DELETE
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'project')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if all policies were created
-- SELECT policyname, tablename FROM pg_policies WHERE tablename = 'objects' ORDER BY policyname;

-- Check bucket IDs
-- SELECT id, name, created_at FROM storage.buckets WHERE name IN ('hero-slide', 'gallery', 'project');
