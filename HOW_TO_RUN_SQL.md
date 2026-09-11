# 📝 How to Run SQL in Supabase - Visual Guide

**Goal**: Create all 8 database tables in one click  
**Time**: 2 minutes  
**Difficulty**: ⭐ Very Easy (Copy → Paste → Run)  

---

## 🎯 Quick Summary

```
1. Open Supabase dashboard
2. Open SQL Editor
3. Copy content of SUPABASE_TABLES.sql
4. Paste into SQL Editor
5. Click Run
6. Done! ✅
```

---

## 📋 Step-by-Step Guide

### Step 1: Open Supabase Dashboard

1. **Go to**: https://supabase.com/dashboard
2. **You should see your projects**
3. **Click**: `parbati-interior` (the project you created)

```
Expected screen:
┌─────────────────────────────────────────┐
│ Supabase Dashboard                      │
│                                         │
│ parbati-interior ← Click this           │
│ ├── Storage                             │
│ ├── Database                            │
│ └── Settings                            │
└─────────────────────────────────────────┘
```

---

### Step 2: Open SQL Editor

1. **Left sidebar**: Find **SQL Editor**
2. **Click**: SQL Editor

```
Expected screen:
┌─────────────────────────────────────────┐
│ parbati-interior Project                │
│                                         │
│ LEFT SIDEBAR:                           │
│ ├── Dashboard                           │
│ ├── SQL Editor ← Click here             │
│ ├── Table Editor                        │
│ ├── Database                            │
│ ├── API                                 │
│ └── ... more options                    │
└─────────────────────────────────────────┘
```

---

### Step 3: Create New Query

1. **In SQL Editor**, look for a button or dropdown
2. **Click**: **New Query** or **Create Query**
3. **You should see** a blank SQL editor box

```
Expected screen:
┌─────────────────────────────────────────┐
│ SQL Editor                              │
│                                         │
│ [New Query] [Saved Queries]             │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ -- Start typing SQL here          │   │
│ │ SELECT * FROM projects;           │   │
│ │                                   │   │
│ │ [Run] [Save] [Format]             │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

### Step 4: Copy SQL Content

1. **Open file**: `SUPABASE_TABLES.sql` (in your project folder)
   - Or find it in the files list on left in VS Code
   - It's in the root of parbati-interior project

2. **Select all** content:
   - Press: `Ctrl+A`
   - Or: Right-click → Select All

3. **Copy**:
   - Press: `Ctrl+C`
   - Or: Right-click → Copy

```
File content to copy (first few lines):
─────────────────────────────────────
-- ============================================
-- PARBATI INTERIOR - DATABASE TABLES
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  ...
```

---

### Step 5: Paste into SQL Editor

1. **In Supabase SQL Editor**:
   - Click in the white text area (where it says "Start typing SQL")
   - Press: `Ctrl+A` (select all existing text if any)
   - Press: `Ctrl+V` (paste the SQL)

2. **Result**: You should see all the CREATE TABLE statements

```
You should see:
┌─────────────────────────────────────────┐
│ SQL Editor                              │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ -- ============================================ │
│ │ -- PARBATI INTERIOR - DATABASE TABLES    │
│ │ -- Run this entire script...    │
│ │                                   │
│ │ -- 1. PROJECTS TABLE              │
│ │ CREATE TABLE IF NOT EXISTS proje... │
│ │ ...                               │
│ │ ...                               │
│ │                                   │
│ │ [Run] [Save] [Format]             │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

### Step 6: Run the Query

1. **Click the button**: `[Run]` (top right of SQL editor)
2. **Or press**: `Ctrl+Enter`
3. **Wait**: 5-10 seconds for execution

```
What happens:
1. Query starts executing
2. You see "Running..."
3. You see green ✅ "Success!"
4. Message says: "All 8 tables created with indexes!"
```

---

### Step 7: Verify Tables Created

1. **Left sidebar**: Click **Table Editor**
2. **You should see** 8 tables:
   - projects
   - happy_clients
   - enquiries
   - blog_posts
   - gallery_images
   - services
   - packages
   - hero_slides

```
Expected view:
┌─────────────────────────────────────────┐
│ Supabase - parbati-interior             │
│                                         │
│ Table Editor                            │
│ ├── projects ✅                         │
│ ├── happy_clients ✅                    │
│ ├── enquiries ✅                        │
│ ├── blog_posts ✅                       │
│ ├── gallery_images ✅                   │
│ ├── services ✅                         │
│ ├── packages ✅                         │
│ └── hero_slides ✅                      │
└─────────────────────────────────────────┘
```

---

## ✅ Success Indicators

### ✅ If You See This:
- Green ✅ checkmark on the query
- Success message in result panel
- 8 tables in Table Editor list
- **Result**: Everything worked! 🎉

### ❌ If You See This:
- Red ❌ error message
- Error text in result panel
- Only some tables showing
- **Result**: Check troubleshooting section below

---

## 🆘 Troubleshooting

### Problem 1: "Syntax error" in SQL

**Cause**: SQL might be corrupted in copy/paste  
**Fix**:
1. Close this query
2. Create new query
3. Copy `SUPABASE_TABLES.sql` again
4. Paste carefully (Ctrl+V)
5. Try running again

---

### Problem 2: "Table already exists" error

**Cause**: Tables were already created (from previous run)  
**Solution**: This is actually OK! 
1. The SQL uses `CREATE TABLE IF NOT EXISTS`
2. It won't recreate existing tables
3. Just means you ran it before
4. Safe to run again

---

### Problem 3: "Permission denied" error

**Cause**: Your Supabase role doesn't have permission  
**Fix**: 
1. Make sure you're logged into Supabase with the right account
2. Make sure you selected the right project (parbati-interior)
3. Try running individual CREATE TABLE statements one at a time

---

### Problem 4: Nothing happens when I click Run

**Cause**: Server might be overloaded or SQL is too large  
**Fix**:
1. Wait 10 seconds
2. Check if tables appeared in Table Editor
3. If still nothing, try smaller queries:
   - Delete old query
   - Create new query
   - Copy just first CREATE TABLE
   - Run that
   - Repeat for others

---

## 🎯 What Happens After Success

Once SQL runs successfully:

1. **8 tables created** in your PostgreSQL database
2. **Indexes added** for performance
3. **Ready for data** (ready for admin panel to save)
4. **Real-time ready** (next step: enable replication)

---

## ✨ Pro Tips

### Tip 1: Save the Query
After running successfully:
1. Click: **Save** button
2. Name it: `Create All Tables`
3. You can run it again later if needed

### Tip 2: Check Table Structure
After creation:
1. Click on table name in Table Editor
2. See all columns and types
3. Verify everything looks right

### Tip 3: Add Sample Data (Optional)
In SQL Editor, try:
```sql
INSERT INTO projects (id, title, description, category, media_type)
VALUES ('test-1', 'Test Project', 'Test Description', 'Residential', 'image');
```

Then check in Table Editor → see your test data!

---

## 📝 What the SQL Does

**SUPABASE_TABLES.sql creates:**

1. **projects** table
   - Stores portfolio projects
   - Columns: id, title, description, category, media_url, media_type, created_at, updated_at

2. **happy_clients** table
   - Customer testimonials
   - Columns: id, video_path, name, title, rating, display_order

3. **enquiries** table
   - Customer inquiries from website
   - Columns: id, customer_name, email, phone, service_type, status, created_at

4. **blog_posts** table
   - Blog articles
   - Columns: id, title, slug, category, content, status, published_date

5. **gallery_images** table
   - Portfolio images
   - Columns: id, room_type, image_url, before_image_url, is_before_after

6. **services** table
   - Services offered
   - Columns: id, name, description, display_order, is_active

7. **packages** table
   - Pricing packages
   - Columns: id, service_id, name, price, features, display_order

8. **hero_slides** table
   - Homepage banner slides
   - Columns: id, headline, subheading, image_url, display_order

**Plus indexes** for fast lookups!

---

## ⏰ Expected Time

- Opening Supabase: 30 seconds
- Finding SQL Editor: 30 seconds
- Copying SQL file: 30 seconds
- Pasting into editor: 30 seconds
- Running query: 5 seconds
- Verifying tables: 1 minute

**Total: ~4 minutes** ⏱️

---

## 🎉 Next Step After This

Once tables are created:

1. **Go to**: Database → **Replication** (next file: `ENABLE_REALTIME.md`)
2. **Enable** real-time for all 8 tables
3. **Verify** all tables show blue icon

---

## 💡 Remember

- **Don't worry about errors** - they're usually fixable
- **Read error messages** - they tell you what went wrong
- **Copy/paste carefully** - make sure all text comes through
- **One step at a time** - no need to rush

---

**You've got this!** 💪

Go create those tables! ⚡

