-- ============================================
-- PARBATI INTERIOR - DATABASE TABLES
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  media_url TEXT,
  media_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_category_idx ON projects(category);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);

-- 2. HAPPY CLIENTS TABLE
CREATE TABLE IF NOT EXISTS happy_clients (
  id BIGSERIAL PRIMARY KEY,
  video_path TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  client_image TEXT,
  project_image TEXT,
  rating INTEGER DEFAULT 5,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS happy_clients_order_idx ON happy_clients(display_order);
CREATE INDEX IF NOT EXISTS happy_clients_created_at_idx ON happy_clients(created_at DESC);

-- 3. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service_type TEXT,
  room_type TEXT,
  budget_range TEXT,
  project_description TEXT,
  status TEXT DEFAULT 'New',
  contacted_by UUID,
  contacted_at TIMESTAMP,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries(status);
CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_email_idx ON enquiries(email);

-- 4. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  cloudinary_id TEXT,
  author TEXT,
  status TEXT DEFAULT 'Draft',
  published_date TIMESTAMP,
  scheduled_publish_date TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts(status);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_date_idx ON blog_posts(published_date DESC);

-- 5. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_type TEXT NOT NULL,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  cloudinary_id TEXT,
  before_image_url TEXT,
  before_cloudinary_id TEXT,
  is_before_after BOOLEAN DEFAULT FALSE,
  project_reference UUID,
  display_order INTEGER,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gallery_room_type_idx ON gallery_images(room_type);
CREATE INDEX IF NOT EXISTS gallery_order_idx ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS gallery_status_idx ON gallery_images(status);

-- 6. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  featured_image_url TEXT,
  cloudinary_id TEXT,
  icon_emoji TEXT,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS services_active_idx ON services(is_active);
CREATE INDEX IF NOT EXISTS services_order_idx ON services(display_order);
CREATE INDEX IF NOT EXISTS services_slug_idx ON services(slug);

-- 7. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'NPR',
  features JSONB,
  delivery_timeline_days INTEGER,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS packages_service_idx ON packages(service_id);
CREATE INDEX IF NOT EXISTS packages_active_idx ON packages(is_active);
CREATE INDEX IF NOT EXISTS packages_order_idx ON packages(display_order);

-- 8. HERO SLIDES TABLE
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline TEXT NOT NULL,
  subheading TEXT,
  button_text TEXT,
  button_link TEXT,
  image_url TEXT NOT NULL,
  cloudinary_id TEXT,
  status TEXT DEFAULT 'Draft',
  scheduled_publish_date TIMESTAMP,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hero_slides_status_idx ON hero_slides(status);
CREATE INDEX IF NOT EXISTS hero_slides_order_idx ON hero_slides(display_order);

-- ============================================
-- SUCCESS MESSAGE
-- All 8 tables created with indexes!
-- ============================================
