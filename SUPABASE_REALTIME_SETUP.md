# 🔴 CRITICAL: Enable Real-Time in Supabase

The "Add" buttons save to Supabase, but the website isn't updating because **Real-Time isn't enabled** on the tables.

## Step-by-Step: Enable Real-Time

1. **Go to Supabase Dashboard**
   - URL: https://app.supabase.com/
   - Login with your account

2. **Go to Your Project** (parbati-interior)

3. **Enable Real-Time for Each Table:**
   - Click on **Database** (left sidebar)
   - Click on **Replication** (below Tables)
   - You'll see all your tables listed
   - **Toggle EACH table to ON** (the switch will turn blue):
     ✅ projects
     ✅ blog_posts
     ✅ gallery_images
     ✅ hero_slides
     ✅ services
     ✅ packages
     ✅ happy_clients
     ✅ enquiries

4. **After enabling, ALL ADD buttons will work!**

## Why This Is Needed

Without Real-Time enabled:
- ❌ Add button saves but doesn't show in list (need to refresh page)
- ❌ Website doesn't get live updates
- ❌ Other users won't see changes in real-time

With Real-Time enabled:
- ✅ Add button saves AND immediately shows in the list
- ✅ Website updates live without refresh
- ✅ All users see updates instantly

## Quick Test

After enabling Real-Time:
1. Go to Hero Slider module
2. Click "Add Slide"
3. Fill in: Headline = "Test Slide"
4. Click "Add Slide" button
5. You should see it appear immediately in the list ✅

**DO THIS NOW** - Enable Real-Time on all tables in Supabase, then all Add/Edit buttons will work!
