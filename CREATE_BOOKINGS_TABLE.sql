-- ============================================
-- BOOKINGS TABLE CREATION
-- ============================================
-- Run this in Supabase SQL Editor to create the bookings/enquiries table

-- 1. Create the bookings table first
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
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create indexes for performance
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
CREATE POLICY "Public insert bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read bookings" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Auth update bookings" ON bookings
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete bookings" ON bookings
  FOR DELETE USING (true);

-- ============================================
-- VERIFICATION
-- ============================================
-- The table has been created successfully!
-- You should see the bookings table in the "Tables" list on the left.
