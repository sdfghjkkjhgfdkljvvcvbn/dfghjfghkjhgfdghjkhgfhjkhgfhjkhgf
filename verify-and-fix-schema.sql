-- VERIFY EXISTING HAPPY CLIENTS TABLE STRUCTURE
-- Run this first to see what columns actually exist

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'happy_clients' 
ORDER BY ordinal_position;

-- ==================================================
-- IF THE ABOVE QUERY SHOWS MISSING COLUMNS:
-- Run the fixes below
-- ==================================================

-- Ensure all required columns exist
ALTER TABLE happy_clients ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE happy_clients ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE happy_clients ADD COLUMN IF NOT EXISTS video_path text;
ALTER TABLE happy_clients ADD COLUMN IF NOT EXISTS rating integer DEFAULT 5;
ALTER TABLE happy_clients ADD COLUMN IF NOT EXISTS client_image text;
ALTER TABLE happy_clients ADD COLUMN IF NOT EXISTS project_image text;
ALTER TABLE happy_clients ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
ALTER TABLE happy_clients ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- ==================================================
-- VERIFY FINAL STRUCTURE
-- ==================================================

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'happy_clients' 
ORDER BY ordinal_position;

-- If you still get errors, it means the table doesn't exist at all.
-- In that case, uncomment and run the CREATE TABLE below:

-- CREATE TABLE IF NOT EXISTS happy_clients (
--   id integer PRIMARY KEY DEFAULT nextval('happy_clients_id_seq'::regclass),
--   name text NOT NULL,
--   title text,
--   video_path text,
--   client_image text,
--   project_image text,
--   rating integer DEFAULT 5,
--   display_order integer DEFAULT 0,
--   created_at timestamptz DEFAULT now()
-- );
-- CREATE SEQUENCE IF NOT EXISTS happy_clients_id_seq;
-- ALTER TABLE happy_clients ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON happy_clients FOR ALL USING (true) WITH CHECK (true);
