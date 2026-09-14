-- ============================================
-- SUPABASE STORAGE RLS POLICIES
-- For admin image uploads
-- ============================================

-- Get the bucket IDs (run these queries first to find the correct IDs)
-- SELECT id, name FROM storage.buckets WHERE name IN ('hero-slide', 'gallery', 'project');

-- ============================================
-- HERO-SLIDE BUCKET POLICIES
-- ============================================
-- Note: Replace 'xxxxx-xxxxx-xxxxx' with actual bucket_id from query above

-- Allow authenticated admin users to INSERT (upload) files to hero-slide bucket
CREATE POLICY "Allow authenticated admin to upload hero-slide images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'hero-slide')
  AND auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to READ (download) hero-slide images
CREATE POLICY "Allow authenticated users to read hero-slide images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'hero-slide')
);

-- Allow authenticated users to UPDATE their own uploaded hero-slide images
CREATE POLICY "Allow authenticated users to update their hero-slide images"
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

-- Allow authenticated users to DELETE their own uploaded hero-slide images
CREATE POLICY "Allow authenticated users to delete their hero-slide images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'hero-slide')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
);

-- ============================================
-- GALLERY BUCKET POLICIES
-- ============================================

CREATE POLICY "Allow authenticated admin to upload gallery images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery')
  AND auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow authenticated users to read gallery images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery')
);

CREATE POLICY "Allow authenticated users to update their gallery images"
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

CREATE POLICY "Allow authenticated users to delete their gallery images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
);

-- ============================================
-- PROJECT BUCKET POLICIES
-- ============================================

CREATE POLICY "Allow authenticated admin to upload project images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'project')
  AND auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow authenticated users to read project images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'project')
);

CREATE POLICY "Allow authenticated users to update their project images"
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

CREATE POLICY "Allow authenticated users to delete their project images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = (SELECT id FROM storage.buckets WHERE name = 'project')
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()
);
