-- ============================================
-- PARBATI INTERIOR - COMPLETE SCHEMA FIX
-- ============================================

-- DROP all existing tables
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS happy_clients CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;

-- ============================================
-- 1. HERO SLIDES TABLE
-- ============================================
CREATE TABLE hero_slides (
  id text PRIMARY KEY,
  headline text NOT NULL,
  subheading text,
  image_url text,
  button_text text,
  button_link text,
  status text DEFAULT 'Draft',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. GALLERY IMAGES TABLE
-- ============================================
CREATE TABLE gallery_images (
  id text PRIMARY KEY,
  room_type text,
  title text NOT NULL,
  image_url text NOT NULL,
  before_image_url text,
  is_before_after boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 3. PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text,
  media_url text,
  media_type text DEFAULT 'image',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. ENQUIRIES TABLE
-- ============================================
CREATE TABLE enquiries (
  id text PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  requirement text DEFAULT 'General Enquiry',
  message text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 5. BLOG POSTS TABLE
-- ============================================
CREATE TABLE blog_posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text,
  excerpt text,
  content text,
  author text DEFAULT 'Parbati Interior',
  published_date timestamptz DEFAULT now(),
  status text DEFAULT 'Draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 6. SERVICES TABLE
-- ============================================
CREATE TABLE services (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 7. HAPPY CLIENTS TABLE
-- ============================================
CREATE TABLE happy_clients (
  id integer PRIMARY KEY,
  name text NOT NULL,
  image_url text,
  review text,
  rating integer,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 8. PACKAGES TABLE
-- ============================================
CREATE TABLE packages (
  id text PRIMARY KEY,
  service_id text,
  name text NOT NULL,
  description text,
  price integer,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE happy_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================
CREATE POLICY "Allow all" ON hero_slides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON gallery_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON happy_clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON packages FOR ALL USING (true) WITH CHECK (true);
