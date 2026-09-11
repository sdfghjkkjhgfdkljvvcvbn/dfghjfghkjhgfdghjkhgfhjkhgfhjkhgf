# 🚀 Parbati Interior - Quick Start Guide

## ⏱️ 25 Minutes to Production

### Step 1: Supabase Project Setup (5 min)

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `parbati-interior`
   - **Database Password**: Save this safely
   - **Region**: Closest to your location
4. Wait for project to be created

### Step 2: Create Database Schema (3 min)

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy entire contents of `supabase-schema.sql` from this repo
4. Paste into SQL Editor
5. Click **"Run"**
6. Wait for success message ✅

### Step 3: Get Credentials (2 min)

1. Go to **Project Settings** → **API**
2. Copy these values:
   ```
   Project URL → VITE_SUPABASE_URL
   anon public → VITE_SUPABASE_PUBLISHABLE_KEY
   service_role secret → SUPABASE_SERVICE_ROLE_KEY
   ```

### Step 4: Update Environment (2 min)

Edit `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci... (your anon key)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (your service key)
```

### Step 5: Test It! (3 min)

```bash
npm run dev
```

**Test the booking form:**
1. Go to http://localhost:3000
2. Click "Book a Consultation"
3. Fill in name, phone, requirement
4. Click "Send enquiry"
5. Should redirect to WhatsApp ✅

**Check Supabase:**
1. Go to Supabase → **Table Editor**
2. Click **bookings** table
3. Should see your test entry! ✅

**Test admin panel:**
1. Go to http://localhost:3000/admin
2. Username: `admin`
3. Password: `admin123`
4. Click "Sign In Security"
5. Should see admin dashboard ✅
6. Go to **Enquiries** tab
7. Should see your booking! ✅

### Step 6: You're Done! 🎉

Your system is now live and ready:
- ✅ Users can submit bookings
- ✅ Bookings save to database
- ✅ Admin can view all bookings
- ✅ Admin can change status
- ✅ Admin can send WhatsApp

---

## 🎯 What's Working

### Homepage
- [x] Book a Consultation button
- [x] Opens modal
- [x] Saves to database
- [x] Redirects to WhatsApp

### Admin Panel
- [x] Login page (/admin)
- [x] Dashboard (/dashboard)
- [x] Enquiries tab (full CRUD)
- [x] Hero Slider tab (full CRUD)

### Database
- [x] All tables created
- [x] Indexes for performance
- [x] RLS policies for security
- [x] Sample data included

---

## 🔐 Admin Credentials

**Quick Access:**
- URL: http://localhost:3000/admin
- Username: `admin`
- Password: `admin123`

**Change password in:** `.env`
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

## 📱 Booking Form Fields

When submitting a booking:
- **Name** (required)
- **Phone** (required)
- **Requirement** (optional)

All bookings get:
- Unique ID
- Status: "new"
- Source: "website_modal"
- Timestamp
- Auto-saved to Supabase

---

## 🛠️ Common Tasks

### How to check bookings in database?
1. Supabase → Table Editor → bookings
2. See all submissions there

### How to change booking status?
1. Admin panel → Enquiries tab
2. Click status dropdown
3. Change from "new" → "contacted" → "booked" → "closed"

### How to send WhatsApp message?
1. Admin panel → Enquiries tab
2. Click phone icon on any booking
3. Opens WhatsApp web with pre-filled message

### How to delete a booking?
1. Admin panel → Enquiries tab
2. Click trash icon
3. Confirm deletion

---

## ⚡ Next Steps (When Ready)

1. **Add more hero slides**
   - Admin → Hero Slider tab
   - Click "Add New Slide"
   - Upload image URL, title, description

2. **Build remaining tabs** (7 more tabs ready for you!)
   - Gallery management
   - Projects CRUD
   - Blog posts
   - Services
   - Service pages with packages
   - Packages pricing
   - Settings theme customizer

3. **Integrate Cloudinary** (for file uploads)
   - Get API keys from cloudinary.com
   - Add to .env
   - Implement in Gallery/Projects tabs

---

## 🆘 Troubleshooting

### "Supabase credentials not found" error?
→ Check .env file has correct values
→ Restart `npm run dev`

### Booking not saving?
→ Check browser console (F12)
→ Check Supabase table exists
→ Verify credentials in .env

### Can't login to admin?
→ Username: admin
→ Password: admin123
→ Check localStorage cleared

### Still stuck?
→ Read `SUPABASE_SETUP.md` for detailed guide
→ Check `IMPLEMENTATION_SUMMARY.md` for architecture

---

## 📊 Useful Links

- Supabase Dashboard: https://app.supabase.com
- Local Dev: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Admin Dashboard: http://localhost:3000/dashboard

---

## ✅ Checklist

After setup, verify:
- [ ] Supabase project created
- [ ] Database schema loaded
- [ ] .env updated with credentials
- [ ] `npm run dev` works
- [ ] Booking modal works (http://localhost:3000)
- [ ] Booking saved to database
- [ ] Admin login works (http://localhost:3000/admin)
- [ ] Can see bookings in admin
- [ ] Build passes: `npm run build`

---

## 🎊 Congratulations!

You now have a fully functional booking system with admin panel!

**Next phase:** Implement remaining 7 tabs for full content management.

Questions? See SUPABASE_SETUP.md for complete documentation.

**Happy building! 🚀**
