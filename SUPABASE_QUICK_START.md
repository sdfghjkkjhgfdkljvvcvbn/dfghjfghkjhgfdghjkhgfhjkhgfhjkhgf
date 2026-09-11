# 🚀 Supabase Real-Time Integration - Quick Start (5 Minutes)

**Goal**: Get your first module (Projects) syncing with Supabase real-time

---

## ⚡ Quick 5-Step Setup

### Step 1: Create Supabase Project (2 minutes)
1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"** → Sign up with GitHub
3. Create new project:
   - **Name**: `parbati-interior`
   - **Password**: Create a strong one (save it!)
   - **Region**: `Asia` (closest to Nepal)
4. ✅ Wait for project to initialize (~1-2 minutes)

### Step 2: Get Your API Keys (1 minute)
1. In Supabase dashboard → **Settings** → **API**
2. Copy these 3 values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_PUBLISHABLE_KEY`  
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Update .env File (1 minute)

Open `.env` in your project and update:

```env
VITE_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIs..."
SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIs..."
```

### Step 4: Create Database Tables (1 minute)

In Supabase dashboard:
1. Go to **SQL Editor**
2. Click **New Query**
3. Paste this code and run:

```sql
-- Projects Table
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

-- Happy Clients Table
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

-- Enquiries Table
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

-- Blog Posts Table
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

-- Gallery Images Table
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

-- Services Table
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

-- Packages Table
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

-- Hero Slides Table
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
```

### Step 5: Enable Real-Time (1 minute)

In Supabase dashboard:
1. Go to **Database** → **Replication**
2. Find each table and click the icon to enable replication:
   - ✅ projects
   - ✅ happy_clients
   - ✅ enquiries
   - ✅ blog_posts
   - ✅ gallery_images
   - ✅ services
   - ✅ packages
   - ✅ hero_slides

---

## 🎯 Test Connection

1. **Restart dev server**: Press `Ctrl+C` and run `npm run dev`
2. **Check browser console**: Press `F12`, go to **Console** tab
3. **Should see**: No red errors (some warnings are OK)
4. **If errors**: Check that `.env` values are copied correctly

---

## 📊 Next: Connect Your First Module (Projects)

Once Supabase is set up, I'll show you how to update the Projects page to use Supabase.

**The pattern is simple:**
1. Import the `projectsService`
2. Load data with `projectsService.getAll()`
3. Subscribe to changes with `projectsService.subscribe()`
4. Use same add/edit/delete buttons - just call Supabase instead of local state

---

## ❓ Common Issues

### "Connection refused" error
- Check your `.env` values are correct (copy/paste exactly from Supabase)
- Check your Supabase project is "active" (green status)
- Wait 2 minutes for Supabase to fully initialize

### "Table does not exist" error
- Run the SQL queries in Supabase SQL Editor
- Check table names match exactly (lowercase)

### "Permission denied" error
- This is OK for now - we'll add security policies later
- Focus on getting data to flow first

---

## ✅ When Ready

Once you've completed all 5 steps above:
1. **Reply with**: "Supabase setup done ✅"
2. I'll immediately start connecting Projects module to real-time
3. You'll see live data sync as you add/edit/delete projects

---

**Time to complete**: ~5 minutes  
**Difficulty**: Very easy (mostly copy-paste)  
**Reward**: Real-time backend for your admin panel! 🎉

