-- ============================================
-- POPULATE PROJECTS TABLE WITH SAMPLE DATA
-- Run this in Supabase SQL Editor to add projects
-- ============================================

-- First, clear any existing projects (optional)
-- DELETE FROM projects;

-- Insert sample projects with real Cloudinary URLs
INSERT INTO projects (id, title, description, category, media_url, media_type, created_at, updated_at)
VALUES 
  (
    '1',
    'Custom Exposed Brick Curved Wall and Concrete Staircase Construction',
    'A structural construction project highlighting precision masonry work with a curved, exposed red brick wall facade. The project features structural concrete stairs, secure bamboo scaffolding framework, and an architectural layout engineered to optimize panoramic urban views while ensuring structural durability.',
    'General Construction',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561243/parbati/projects/construction1.jpg',
    'image',
    NOW(),
    NOW()
  ),
  (
    '2',
    'Modern Institutional Classroom and Administrative Workspace in Kalanki',
    'An educational institute in Kalanki was outfitted with a functional classroom layout featuring durable student desk-bench sets, optimized lighting, and modern window blinds. The adjacent administrative space integrates a sleek reception setup, premium seating, and a decorative vertical indoor plant feature wall to create an inviting, professional environment.',
    'Commercial',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561244/parbati/projects/commercial1.jpg',
    'image',
    NOW(),
    NOW()
  ),
  (
    '3',
    'Minimalist Corporate Reception Desk and Front Office Setup',
    'A contemporary front office reception area designed with a striking, custom-built counter featuring sleek curves, wood slat accents, and integrated LED under-lighting. The clean design combines crisp white finishes with warm natural timber textures to establish a premium, welcoming first impression for corporate clients and visitors.',
    'Commercial',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561245/parbati/projects/office1.jpg',
    'image',
    NOW(),
    NOW()
  ),
  (
    '4',
    'Modern Residential Furnishing and Custom False Ceiling in Budhanilkantha',
    'A residential home interior featuring premium custom woodwork, a sleek built-in media unit with vertical glass shelving, and an integrated hidden door setup. The design elevates the living and bedroom spaces with striking wooden tray false ceilings, warm recessed LED lighting, and tailored tufted headboard accents to maximize both comfort and modern aesthetic appeal.',
    'Modular Kitchen',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561246/parbati/projects/residential1.jpg',
    'image',
    NOW(),
    NOW()
  ),
  (
    '5',
    'Roadside Stone Retaining Wall and Footpath Infrastructure Construction',
    'Civil construction works involving the installation of a durable stone masonry retaining wall along a major urban roadway. This infrastructure project focuses on slope stabilization, soil erosion control, and earthwork preparation to secure and build safe, elevated roadside pedestrian footpaths.',
    'General Construction',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561247/parbati/projects/construction2.jpg',
    'image',
    NOW(),
    NOW()
  ),
  (
    '6',
    'Structural Steel Framing for Custom Glass Garage Roofing',
    'An outdoor structural engineering project featuring the fabrication and assembly of a heavy-duty steel grid frame for a residential garage roof. The black-coated metal framework is precision-welded and reinforced over a brick foundation wall, specifically designed to support overhead safety glass panels and provide durable, weather-resistant protection.',
    'General Construction',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561248/parbati/projects/construction3.jpg',
    'image',
    NOW(),
    NOW()
  ),
  (
    '7',
    'Luxury Living Room & Media Wall',
    'A stunning modern residential living room designed with customized LED backlighting, elegant marble-textured wooden paneling, and an integrated modular media center. Tailored for comfort and entertainment.',
    'Residential',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561249/parbati/projects/residential2.jpg',
    'image',
    NOW(),
    NOW()
  ),
  (
    '8',
    'Modern Minimalist Modular Kitchen',
    'Space-efficient modular kitchen featuring high-gloss acrylic finishes, hydraulic soft-close fittings, intelligent pull-out organizers, and a custom quartz countertop designed for ultimate utility.',
    'Modular Kitchen',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561250/parbati/projects/kitchen1.jpg',
    'image',
    NOW(),
    NOW()
  ),
  (
    '9',
    'Executive Corporate Workspace',
    'A state-of-the-art office workspace featuring customized acoustic glass partitions, ergonomic wood-metal collaborative desks, integrated power hubs, and elegant brand-accent corporate walls.',
    'Commercial',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561251/parbati/projects/commercial2.jpg',
    'image',
    NOW(),
    NOW()
  ),
  (
    '10',
    'Custom Metal & Hardwood Lounge Set',
    'Bespoke furniture crafted in-house utilizing premium structural MS frames, powder-coated in modern matte black, and paired with premium teak hardwood inserts. Combines industrial durability with natural warmth.',
    'Custom Furniture',
    'https://res.cloudinary.com/gvjhfpzo/image/upload/v1726234561252/parbati/projects/furniture1.jpg',
    'image',
    NOW(),
    NOW()
  );

-- Verify the data was inserted
SELECT 
  id, 
  title, 
  category, 
  media_url, 
  media_type, 
  created_at 
FROM projects 
ORDER BY created_at DESC;
