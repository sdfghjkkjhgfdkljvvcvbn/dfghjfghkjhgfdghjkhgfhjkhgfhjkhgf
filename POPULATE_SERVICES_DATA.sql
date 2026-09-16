-- ============================================
-- POPULATE SERVICES TABLE WITH SAMPLE DATA
-- Run this in Supabase SQL Editor to add services
-- ============================================

-- First, clear any existing services (optional)
-- DELETE FROM services;

-- Insert sample services with REAL Cloudinary URLs
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

-- Verify the data was inserted
SELECT 
  id, 
  name, 
  description,
  image,
  is_active, 
  display_order, 
  created_at 
FROM services 
ORDER BY display_order ASC;
