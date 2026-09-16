-- ============================================
-- COMPLETE FIX: Add image column + Populate services with images
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Add image column if missing
ALTER TABLE services
ADD COLUMN IF NOT EXISTS image text;

-- Step 2: Clear existing services (optional - comment out if you want to keep them)
DELETE FROM services;

-- Step 3: Insert services with proper image URLs
INSERT INTO services (id, name, description, image, is_active, display_order, created_at, updated_at)
VALUES 
  (
    '1',
    'Interior Design & 3D Planning',
    'Thoughtful layouts, practical planning and realistic 3D visualization before execution.',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561249/parbati/projects/residential2.jpg',
    true,
    1,
    NOW(),
    NOW()
  ),
  (
    '2',
    'Modular Kitchens & Furniture',
    'Custom kitchens, wardrobes and furniture designed around your space and lifestyle.',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561250/parbati/projects/kitchen1.jpg',
    true,
    2,
    NOW(),
    NOW()
  ),
  (
    '3',
    'Home Interiors & Decor',
    'Complete interior solutions that bring comfort, functionality and personality into your home.',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561251/parbati/projects/residential1.jpg',
    true,
    3,
    NOW(),
    NOW()
  ),
  (
    '4',
    'Construction & WPC Works',
    'Reliable construction and finishing work delivered with practical site execution.',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561252/parbati/projects/construction2.jpg',
    true,
    4,
    NOW(),
    NOW()
  );

-- Step 4: Verify data
SELECT 
  id,
  name,
  description,
  image,
  is_active,
  display_order
FROM services
ORDER BY display_order ASC;

-- If you see 4 rows with images, you're good! ✅
