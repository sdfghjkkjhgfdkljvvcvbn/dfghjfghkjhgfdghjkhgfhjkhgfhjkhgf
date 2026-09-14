-- ============================================
-- PARBATI INTERIOR - FINAL SCHEMA
-- With Cloudinary Integration for Images/Videos
-- Last Updated: September 2024
-- ============================================

-- ============================================
-- 1. HERO SLIDES TABLE
-- Stores hero slider configurations
-- Images stored in Cloudinary (URL in image_url)
-- ============================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline text NOT NULL,
  subheading text,
  image_url text,  -- Cloudinary URL
  button_text text,
  button_link text,
  status text DEFAULT 'Draft',  -- Draft, Published, Scheduled
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. GALLERY IMAGES TABLE
-- Stores gallery images by room type
-- Images stored in Cloudinary
-- Supports before/after comparisons
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type text,  -- Bedroom, Living Room, Kitchen, etc.
  title text NOT NULL,
  image_url text,  -- Cloudinary URL (main image)
  before_image_url text,  -- Cloudinary URL (before image for before/after)
  is_before_after boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 3. PROJECTS TABLE
-- Stores project information with media
-- Images and Videos stored in Cloudinary
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,  -- Design category
  media_url text,  -- Cloudinary URL (image or video)
  media_type text DEFAULT 'image',  -- image or video
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. BLOG POSTS TABLE
-- Stores blog articles
-- Can optionally include featured image in future
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,  -- Design Tip, Case Study, etc.
  excerpt text,
  content text,
  author text,
  status text DEFAULT 'Draft',  -- Draft, Published, Scheduled
  featured_image text,  -- Cloudinary URL (optional)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 5. BOOKINGS TABLE
-- Stores customer inquiries and bookings
-- No media storage here
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  requirement text DEFAULT 'General Enquiry',
  message text,
  status text DEFAULT 'new',  -- new, contacted, booked, rejected
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 6. SERVICES TABLE
-- Stores available interior design services
-- Optional featured image in Cloudinary
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,  -- Cloudinary URL (optional)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 7. HAPPY CLIENTS TABLE
-- Stores client testimonials
-- Client images stored in Cloudinary
-- ============================================
CREATE TABLE IF NOT EXISTS happy_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,  -- Cloudinary URL
  review text,
  rating integer,  -- 1-5 stars
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 8. PACKAGES TABLE
-- Stores service packages
-- Linked to services table
-- ============================================
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price integer,  -- in rupees
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 9. ENQUIRIES TABLE (Alias for bookings)
-- Same as bookings, used for form submissions
-- ============================================
-- We'll use bookings table for this purpose

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE happy_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES (Allow all for now)
-- These allow all authenticated users to READ
-- And allow INSERT/UPDATE/DELETE for admin
-- In production, implement proper role-based access
-- ============================================

-- Hero Slides Policies
CREATE POLICY "Allow all" ON hero_slides FOR ALL USING (true) WITH CHECK (true);

-- Gallery Images Policies
CREATE POLICY "Allow all" ON gallery_images FOR ALL USING (true) WITH CHECK (true);

-- Projects Policies
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);

-- Blog Posts Policies
CREATE POLICY "Allow all" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

-- Bookings Policies
CREATE POLICY "Allow all" ON bookings FOR ALL USING (true) WITH CHECK (true);

-- Services Policies
CREATE POLICY "Allow all" ON services FOR ALL USING (true) WITH CHECK (true);

-- Happy Clients Policies
CREATE POLICY "Allow all" ON happy_clients FOR ALL USING (true) WITH CHECK (true);

-- Packages Policies
CREATE POLICY "Allow all" ON packages FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================

-- Hero Slides Indexes
CREATE INDEX IF NOT EXISTS hero_slides_status ON hero_slides(status);
CREATE INDEX IF NOT EXISTS hero_slides_display_order ON hero_slides(display_order);
CREATE INDEX IF NOT EXISTS hero_slides_created_at ON hero_slides(created_at);

-- Gallery Images Indexes
CREATE INDEX IF NOT EXISTS gallery_images_room_type ON gallery_images(room_type);
CREATE INDEX IF NOT EXISTS gallery_images_is_before_after ON gallery_images(is_before_after);
CREATE INDEX IF NOT EXISTS gallery_images_created_at ON gallery_images(created_at);

-- Projects Indexes
CREATE INDEX IF NOT EXISTS projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS projects_media_type ON projects(media_type);

-- Blog Posts Indexes
CREATE INDEX IF NOT EXISTS blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_created_at ON blog_posts(created_at);

-- Bookings Indexes
CREATE INDEX IF NOT EXISTS bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS bookings_phone ON bookings(phone);

-- Services Indexes
CREATE INDEX IF NOT EXISTS services_created_at ON services(created_at);

-- Happy Clients Indexes
CREATE INDEX IF NOT EXISTS happy_clients_created_at ON happy_clients(created_at);
CREATE INDEX IF NOT EXISTS happy_clients_rating ON happy_clients(rating);

-- Packages Indexes
CREATE INDEX IF NOT EXISTS packages_service_id ON packages(service_id);
CREATE INDEX IF NOT EXISTS packages_display_order ON packages(display_order);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample hero slide
-- INSERT INTO hero_slides (headline, subheading, image_url, button_text, button_link, status, display_order)
-- VALUES (
--   'Transform Your Space',
--   'Premium interior design for modern homes',
--   'https://res.cloudinary.com/gvjhfpzo/image/upload/v1234567890/parbati/hero-slides/sample.jpg',
--   'View Portfolio',
--   '/portfolio',
--   'Published',
--   1
-- );

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- Check all policies
-- SELECT policyname, tablename FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname;

-- Check all indexes
-- SELECT indexname, tablename FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, indexname;

-- ============================================
-- NOTES FOR DEPLOYMENT
-- ============================================
/*
1. CLOUDINARY INTEGRATION:
   - All large media (images > 5MB, videos) stored in Cloudinary
   - URLs stored in database as TEXT fields
   - No file size limits compared to Supabase
   - Automatic image optimization via Cloudinary

2. COLUMN NAMING:
   - Use snake_case for column names (image_url, before_image_url, etc.)
   - Frontend will handle camelCase conversion if needed

3. MEDIA TYPES:
   - image_url: Stores Cloudinary URLs for images
   - media_url: Stores Cloudinary URLs for images or videos
   - featured_image: Optional featured image for blog posts

4. STATUS VALUES:
   - hero_slides: Draft, Published, Scheduled
   - blog_posts: Draft, Published, Scheduled
   - bookings: new, contacted, booked, rejected

5. SECURITY:
   - RLS policies currently allow all (for development)
   - Before production: Implement proper role-based access control
   - API keys should be server-side only

6. PERFORMANCE:
   - All frequently filtered columns have indexes
   - Foreign keys maintain referential integrity
   - Cascade delete for packages when service deleted

7. FUTURE IMPROVEMENTS:
   - Add user authentication table
   - Add admin roles table
   - Add audit logging table
   - Add email notification settings table
*/

-- ============================================
-- END OF SCHEMA
-- ============================================
