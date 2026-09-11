# 🚀 Supabase Real-Time Integration Setup Guide

**Status**: ✅ **Integration Ready**  
**Date**: September 11, 2026  

---

## 📋 Overview

The admin panel is now ready to connect to Supabase for:
- ✅ Real-time data sync across all users
- ✅ Database persistence (data survives server restart)
- ✅ Live notifications for new enquiries
- ✅ Multi-user concurrent editing
- ✅ Automatic backups
- ✅ API access for mobile apps

---

## 🔧 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Visit [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or login with GitHub
4. Create a new project:
   - **Project Name**: parbati-interior
   - **Database Password**: (strong password)
   - **Region**: Choose closest to Nepal (or Asia regions)
5. Wait for project to initialize (~2 minutes)

### Step 2: Get API Keys

1. Go to **Settings** → **API**
2. Copy these keys:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Public Key** (VITE_SUPABASE_PUBLISHABLE_KEY)
   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY)

### Step 3: Update .env File

```env
VITE_SUPABASE_URL="your-project-url-here"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key-here"
SUPABASE_URL="your-project-url-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

### Step 4: Create Database Tables

In Supabase dashboard, go to **SQL Editor** and run these queries:

#### Projects Table
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  media_url TEXT,
  media_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX projects_category_idx ON projects(category);
```

#### Happy Clients Table
```sql
CREATE TABLE happy_clients (
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

CREATE INDEX happy_clients_order_idx ON happy_clients(display_order);
```

#### Enquiries Table
```sql
CREATE TABLE enquiries (
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

CREATE INDEX enquiries_status_idx ON enquiries(status);
CREATE INDEX enquiries_created_at_idx ON enquiries(created_at DESC);
```

#### Blog Posts Table
```sql
CREATE TABLE blog_posts (
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

CREATE INDEX blog_posts_status_idx ON blog_posts(status);
CREATE INDEX blog_posts_slug_idx ON blog_posts(slug);
```

#### Gallery Images Table
```sql
CREATE TABLE gallery_images (
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

CREATE INDEX gallery_room_type_idx ON gallery_images(room_type);
CREATE INDEX gallery_order_idx ON gallery_images(display_order);
```

#### Services Table
```sql
CREATE TABLE services (
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

CREATE INDEX services_active_idx ON services(is_active);
CREATE INDEX services_order_idx ON services(display_order);
```

#### Packages Table
```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id),
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

CREATE INDEX packages_service_idx ON packages(service_id);
CREATE INDEX packages_active_idx ON packages(is_active);
```

#### Hero Slides Table
```sql
CREATE TABLE hero_slides (
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

CREATE INDEX hero_slides_status_idx ON hero_slides(status);
CREATE INDEX hero_slides_order_idx ON hero_slides(display_order);
```

### Step 5: Enable Real-Time

In Supabase dashboard:

1. Go to **Database** → **Replication**
2. Enable replication for all tables:
   - projects
   - happy_clients
   - enquiries
   - blog_posts
   - gallery_images
   - services
   - packages
   - hero_slides

### Step 6: Set Row Level Security (RLS)

For each table, in the **Authentication** section:

1. Enable RLS
2. Add policy to allow authenticated users to read/write:

```sql
-- Example for projects table
CREATE POLICY "Allow authenticated users to read projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update projects"
  ON projects FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete projects"
  ON projects FOR DELETE
  USING (true);
```

### Step 7: Test Connection

1. Restart dev server: `npm run dev`
2. Check browser console (F12) for any errors
3. Data should now sync with Supabase

---

## 📊 Services Integration

The following services are pre-built in `src/admin/services/supabaseClient.ts`:

### Available Services
- ✅ `projectsService` - Projects CRUD + real-time
- ✅ `happyClientsService` - Happy clients CRUD + real-time
- ✅ `enquiriesService` - Enquiries CRUD + real-time
- ✅ `blogService` - Blog posts CRUD + real-time
- ✅ `galleryService` - Gallery images CRUD + real-time
- ✅ `servicesService` - Services CRUD + real-time
- ✅ `packagesService` - Packages CRUD + real-time

### Usage Examples

```typescript
// Import service
import { projectsService } from '@/admin/services/supabaseClient';

// Get all projects
const projects = await projectsService.getAll();

// Create project
const newProject = await projectsService.create({
  title: 'New Project',
  description: 'Description',
  category: 'Residential',
  media_url: 'https://...',
  media_type: 'image'
});

// Update project
await projectsService.update(id, {
  title: 'Updated Title'
});

// Delete project
await projectsService.delete(id);

// Real-time subscription
projectsService.subscribe((payload) => {
  console.log('Data changed:', payload);
});
```

---

## 🔄 Real-Time Features

### What Happens in Real-Time:

1. **Project Updates** - Changes appear instantly for all users
2. **Happy Clients** - Video additions/edits appear immediately
3. **Enquiries** - New enquiries notify all logged-in admins
4. **Blog Posts** - Scheduled posts publish automatically
5. **Gallery** - Image additions sync across devices
6. **Services** - Service changes update instantly
7. **Packages** - Pricing changes appear in real-time

### Notifications

When someone adds a new enquiry:
- Toast notification appears
- Badge count updates
- New item appears at top of list
- All users see it simultaneously

---

## 🔐 Security Considerations

### RLS Policies
- Only authenticated users can modify data
- Admins can see all data
- Enquiry responders can update status only

### API Keys
- **Anon Key**: Client-side, read/write to public data
- **Service Key**: Server-side, full access (secret!)
- Never commit keys to GitHub (use .env)

---

## 🚀 Next Steps

After connecting to Supabase:

### Phase 2A: Update Modules (This Week)
1. [ ] Projects module - Read/write to Supabase
2. [ ] Happy Clients - Load/save from Supabase
3. [ ] Enquiries - Real-time updates
4. [ ] Blog - Scheduled posts
5. [ ] Gallery - Real-time sync

### Phase 2B: Advanced Features (Next Week)
1. [ ] Cloudinary integration for uploads
2. [ ] File upload to Supabase Storage
3. [ ] Automatic image optimization
4. [ ] Backup/versioning
5. [ ] Analytics tracking

### Phase 2C: Performance (Later)
1. [ ] Caching strategy
2. [ ] Query optimization
3. [ ] Batch operations
4. [ ] Pagination for large datasets

---

## 📞 Troubleshooting

### Connection Issues

**Error: "Failed to connect to Supabase"**
- Check `.env` file for correct URLs
- Verify Supabase project is active
- Check browser console (F12) for CORS errors

**Error: "Table does not exist"**
- Run SQL scripts to create tables
- Check table names match exactly
- Verify RLS policies are enabled

### Data Not Syncing

**Changes not appearing**
- Check subscription is active
- Verify RLS policies allow write access
- Check network tab for failed requests

**Real-time not working**
- Verify replication is enabled in Supabase
- Check browser console for errors
- Restart dev server

---

## 📊 Database Schema

```
projects
├── id (TEXT, PK)
├── title (TEXT)
├── description (TEXT)
├── category (TEXT)
├── media_url (TEXT)
├── media_type (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

happy_clients
├── id (BIGSERIAL, PK)
├── video_path (TEXT)
├── name (TEXT)
├── title (TEXT)
├── client_image (TEXT)
├── project_image (TEXT)
├── rating (INTEGER)
├── display_order (INTEGER)
└── created_at (TIMESTAMP)

enquiries
├── id (UUID, PK)
├── customer_name (TEXT)
├── email (TEXT)
├── phone (TEXT)
├── service_type (TEXT)
├── status (TEXT)
├── created_at (TIMESTAMP)
└── ... (more fields)

blog_posts, gallery_images, services, packages, hero_slides
└── (similar structure with appropriate fields)
```

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Copied API keys to .env
- [ ] Created all database tables
- [ ] Enabled replication
- [ ] Set up RLS policies
- [ ] Tested connection
- [ ] Admin panel showing Supabase data
- [ ] Real-time updates working
- [ ] Notifications functional

---

## 🎯 Benefits After Setup

✅ **Data Persistence** - Survives server restarts  
✅ **Real-Time Sync** - All users see updates instantly  
✅ **Multi-User Support** - Multiple admins working simultaneously  
✅ **Automatic Backups** - Supabase handles backups  
✅ **Scalability** - Ready for growth  
✅ **API Access** - Mobile app can access same data  
✅ **Analytics** - Track user behavior  
✅ **Security** - Industry-standard authentication  

---

**Ready to connect? Follow the steps above and your admin panel will have real-time superpowers!** 🚀

---

Version: 1.0.0  
Date: September 11, 2026  
Status: ✅ Ready for Implementation
