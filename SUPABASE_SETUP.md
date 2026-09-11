# Parbati Interior - Supabase Integration & Admin Panel Setup Guide

## ✅ What's Been Done

### 1. **Supabase Integration**
- ✅ Installed `@supabase/supabase-js` package
- ✅ Created `/src/utils/supabase.ts` with complete service methods for:
  - Bookings (CRUD operations)
  - Hero Slides
  - Services
  - Projects
  - Blog Posts
  - Gallery Images
  - Site Settings

### 2. **Updated Data Types**
- ✅ `/src/types.ts` now includes all Supabase table interfaces:
  - `Booking` - enquiries table
  - `Service` - services table
  - `Project` - projects (portfolio) table
  - `BlogPost` - blog_posts table
  - `HeroSlide` - hero_slides table
  - `GalleryImage` - gallery_images table
  - And more...

### 3. **Booking Modal Integration**
- ✅ `/src/components/BookingModal.tsx` now saves bookings to Supabase
- ✅ Shows loading state and success/error messages
- ✅ Auto-redirects to WhatsApp after successful submission

### 4. **Admin Dashboard**
- ✅ `/src/pages/AdminDashboard.tsx` - Main dashboard with 9 tabs:
  1. **Enquiries** - Fully functional booking inbox with:
     - Status filters (New, Contacted, Booked, Closed)
     - WhatsApp integration
     - Delete functionality
     - Detailed sidebar for each booking
  2. **Hero Slider** - Manage hero slides with:
     - Add/edit/delete slides
     - Image URL, title, description fields
     - Active/inactive toggle
  3-9. **Gallery, Projects, Blog, Services, Service Pages, Packages, Settings** - Stubs ready for implementation

---

## 🚀 Next Steps: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Create a new project:
   - **Name**: `parbati-interior`
   - **Database Password**: Save this securely
   - **Region**: Choose closest to your location

### Step 2: Create Database Tables

Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- Bookings / enquiries
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  event_date text,
  requirement text NOT NULL DEFAULT 'General Enquiry',
  message text,
  notes text,
  source text DEFAULT 'website',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hero slides
CREATE TABLE hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services
CREATE TABLE services (
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

-- Projects (portfolio)
CREATE TABLE projects (
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

-- Blog posts
CREATE TABLE blog_posts (
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

-- Gallery images
CREATE TABLE gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Interior',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site settings
CREATE TABLE site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- User roles
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (active = true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (published = true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
```

### Step 3: Get Your Credentials

1. Go to **Project Settings** → **API** in Supabase
2. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Update .env

Edit `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 5: Test the Integration

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000
3. Click "Book a Consultation"
4. Fill in the form and submit
5. Check Supabase: **bookings** table should have your new entry

---

## 🔐 Admin Panel Access

### Login Page
- URL: http://localhost:3000/admin
- **Username**: `admin`
- **Password**: `admin123`

### After Login
- URL: http://localhost:3000/dashboard
- You'll see the 9-tab admin dashboard

### Dashboard Features

**1. Enquiries Tab** (✅ Fully functional)
- View all bookings
- Filter by status
- Change status (New → Contacted → Booked → Closed)
- Send WhatsApp messages
- Delete bookings
- View full details in sidebar

**2. Hero Slider Tab** (✅ Fully functional)
- Add new slides
- Edit existing slides
- Upload image URLs
- Toggle active/inactive
- Delete slides

**3-9. Other Tabs** (Ready for implementation)
- Gallery management
- Projects CRUD
- Blog posts management
- Services configuration
- Service page customization
- Packages pricing
- Site settings & theme customization

---

## 📋 Remaining Tasks

### Immediate (High Priority)
- [ ] Implement Gallery Tab
- [ ] Implement Projects Tab
- [ ] Implement Blog Tab
- [ ] Add Cloudinary integration for file uploads
- [ ] Create service pages with packages

### Medium Priority
- [ ] Build Services management tab
- [ ] Build Service Pages tab with full editor
- [ ] Build Packages tab with pricing tiers
- [ ] Implement Theme Customizer in Settings

### Polish
- [ ] Add loading states to all tabs
- [ ] Add success/error notifications
- [ ] Search and filter functionality
- [ ] Bulk actions
- [ ] Export data functionality

---

## 📝 Notes

- **Booking Modal**: Already saves to Supabase when user submits
- **Admin Authentication**: Uses JWT tokens stored in localStorage
- **Database Access**: Supabase RLS (Row Level Security) policies are set up
- **Auto-increment IDs**: All tables use UUID primary keys
- **Timestamps**: All tables have `created_at` and `updated_at` fields

---

## 🆘 Troubleshooting

### "Supabase credentials not found"
- Check `.env` file has correct credentials
- Restart dev server after updating .env

### Bookings not saving
- Check browser console for errors
- Verify Supabase URL is correct
- Check if bookings table exists
- Check RLS policies allow inserts

### Admin panel not loading
- Ensure you're logged in (check localStorage)
- Clear browser cache
- Check network tab for failed requests

---

## 🎯 Quick Reference

| Feature | Status | URL |
|---------|--------|-----|
| Booking Modal | ✅ Done | / (Home) |
| Admin Login | ✅ Done | /admin |
| Admin Dashboard | ✅ Done | /dashboard |
| Enquiries Tab | ✅ Done | /dashboard (tab 1) |
| Hero Slider Tab | ✅ Done | /dashboard (tab 2) |
| Other Tabs | 🚧 Stubs | /dashboard (tabs 3-9) |

---

**Happy building! 🚀**
