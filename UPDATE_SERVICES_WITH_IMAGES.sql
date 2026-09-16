-- ============================================
-- UPDATE EXISTING SERVICES WITH IMAGES
-- Run this if you already have services but they have NULL images
-- ============================================

-- Update each service with a Cloudinary image
UPDATE services
SET 
  image = 'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561249/parbati/projects/residential2.jpg',
  updated_at = NOW()
WHERE id = '1' AND name LIKE '%Interior Design%';

UPDATE services
SET 
  image = 'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561250/parbati/projects/kitchen1.jpg',
  updated_at = NOW()
WHERE id = '2' AND name LIKE '%Modular Kitchens%';

UPDATE services
SET 
  image = 'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561251/parbati/projects/residential1.jpg',
  updated_at = NOW()
WHERE id = '3' AND name LIKE '%Home Interiors%';

UPDATE services
SET 
  image = 'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561252/parbati/projects/construction2.jpg',
  updated_at = NOW()
WHERE id = '4' AND name LIKE '%Construction%';

-- Verify the updates
SELECT 
  id,
  name,
  image,
  is_active
FROM services
ORDER BY display_order ASC;
