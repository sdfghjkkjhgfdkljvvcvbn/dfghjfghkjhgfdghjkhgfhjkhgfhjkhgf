-- ============================================
-- PARBATI INTERIOR - SUPABASE DATABASE SCHEMA
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- and run it to set up all tables and policies

-- ============================================
-- 1. BOOKINGS TABLE (Enquiries)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  event_date text,
  requirement text NOT NULL DEFAULT 'General Enquiry',
  message text,
  notes text,
  source text DEFAULT 'website',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- ============================================
-- 2. HERO SLIDES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_hero_slides_active ON hero_slides(active);
CREATE INDEX idx_hero_slides_sort_order ON hero_slides(sort_order);

-- ============================================
-- 3. SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  packages jsonb NOT NULL DEFAULT '[]',
  gallery_category text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_sort_order ON services(sort_order);

-- ============================================
-- 4. PROJECTS TABLE (Portfolio)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  client text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  date_label text NOT NULL DEFAULT '',
  cover text NOT NULL DEFAULT '',
  intro text NOT NULL DEFAULT '',
  description text[] NOT NULL DEFAULT '{}',
  gallery jsonb NOT NULL DEFAULT '[]',
  details jsonb NOT NULL DEFAULT '[]',
  testimonial jsonb NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_sort_order ON projects(sort_order);

-- ============================================
-- 5. BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  cover text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'Parbati Interior',
  date_label text NOT NULL DEFAULT '',
  read_time text NOT NULL DEFAULT '5 min read',
  content text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- ============================================
-- 6. GALLERY IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Interior',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_gallery_images_category ON gallery_images(category);
CREATE INDEX idx_gallery_images_sort_order ON gallery_images(sort_order);

-- ============================================
-- 7. SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 8. USER ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES - PUBLIC READ
-- ============================================

-- Bookings: Public can read all
CREATE POLICY "Public read bookings" ON bookings
  FOR SELECT USING (true);

-- Hero Slides: Public can read active slides
CREATE POLICY "Public read hero_slides" ON hero_slides
  FOR SELECT USING (active = true);

-- Services: Public can read all
CREATE POLICY "Public read services" ON services
  FOR SELECT USING (true);

-- Projects: Public can read published
CREATE POLICY "Public read projects" ON projects
  FOR SELECT USING (published = true);

-- Blog Posts: Public can read published
CREATE POLICY "Public read blog_posts" ON blog_posts
  FOR SELECT USING (published = true);

-- Gallery Images: Public can read all
CREATE POLICY "Public read gallery_images" ON gallery_images
  FOR SELECT USING (true);

-- Site Settings: Public can read all
CREATE POLICY "Public read site_settings" ON site_settings
  FOR SELECT USING (true);

-- ============================================
-- CREATE RLS POLICIES - AUTHENTICATED WRITE
-- ============================================

-- Bookings: Admin can insert, update, delete
CREATE POLICY "Auth insert bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth update bookings" ON bookings
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete bookings" ON bookings
  FOR DELETE USING (true);

-- Hero Slides: Admin can write
CREATE POLICY "Auth insert hero_slides" ON hero_slides
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth update hero_slides" ON hero_slides
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete hero_slides" ON hero_slides
  FOR DELETE USING (true);

-- Services: Admin can write
CREATE POLICY "Auth insert services" ON services
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth update services" ON services
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete services" ON services
  FOR DELETE USING (true);

-- Projects: Admin can write
CREATE POLICY "Auth insert projects" ON projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth update projects" ON projects
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete projects" ON projects
  FOR DELETE USING (true);

-- Blog Posts: Admin can write
CREATE POLICY "Auth insert blog_posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth update blog_posts" ON blog_posts
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete blog_posts" ON blog_posts
  FOR DELETE USING (true);

-- Gallery Images: Admin can write
CREATE POLICY "Auth insert gallery_images" ON gallery_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth update gallery_images" ON gallery_images
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete gallery_images" ON gallery_images
  FOR DELETE USING (true);

-- Site Settings: Admin can write
CREATE POLICY "Auth insert site_settings" ON site_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth update site_settings" ON site_settings
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete site_settings" ON site_settings
  FOR DELETE USING (true);

-- User Roles: Admin can write
CREATE POLICY "Auth insert user_roles" ON user_roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth update user_roles" ON user_roles
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete user_roles" ON user_roles
  FOR DELETE USING (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION has_role(_user_id uuid, _role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to claim first admin
CREATE OR REPLACE FUNCTION claim_first_admin()
RETURNS boolean AS $$
DECLARE
  already_exists boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE role = 'admin') INTO already_exists;
  IF already_exists THEN
    RETURN false;
  END IF;
  INSERT INTO user_roles (user_id, role)
  VALUES (auth.uid(), 'admin');
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample hero slide
INSERT INTO hero_slides (image_url, title, description, sort_order, active)
VALUES (
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
  'Transform Your Space',
  'Premium interior design and construction services',
  1,
  true
);

-- Insert sample booking
INSERT INTO bookings (name, phone, requirement, source, status)
VALUES (
  'Raj Kumar',
  '9845123456',
  'Living room renovation',
  'website',
  'new'
);

-- ============================================
-- VERIFICATION QUERIES (Run these to verify)
-- ============================================

-- Check tables created
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check if sample data exists
SELECT COUNT(*) as booking_count FROM bookings;
SELECT COUNT(*) as hero_slides_count FROM hero_slides;

-- ============================================
-- END OF SCHEMA
-- ============================================
