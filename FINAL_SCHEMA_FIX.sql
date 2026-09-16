-- CORRECT SQL - Run this in Supabase SQL Editor

-- 1. Drop the old table FIRST
DROP TABLE IF EXISTS happy_clients CASCADE;

-- 2. Drop the old sequence
DROP SEQUENCE IF EXISTS happy_clients_id_seq CASCADE;

-- 3. CREATE SEQUENCE FIRST (before using it)
CREATE SEQUENCE happy_clients_id_seq START 1 INCREMENT 1;

-- 4. NOW create the table using the sequence
CREATE TABLE happy_clients (
  id bigint PRIMARY KEY DEFAULT nextval('happy_clients_id_seq'),
  name text NOT NULL,
  title text,
  video_path text,
  rating integer DEFAULT 5,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5. Enable RLS
ALTER TABLE happy_clients ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policy (allow all)
CREATE POLICY "Allow all" ON happy_clients 
  FOR ALL USING (true) WITH CHECK (true);

-- VERIFY IT WORKED
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'happy_clients' 
ORDER BY ordinal_position;
