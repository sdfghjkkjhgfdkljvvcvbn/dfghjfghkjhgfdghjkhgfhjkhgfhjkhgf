-- ============================================
-- Add cover_image column to blog_posts table
-- ============================================

ALTER TABLE blog_posts ADD COLUMN cover_image text DEFAULT NULL;

-- Optional: Add index for faster queries
-- CREATE INDEX idx_blog_posts_status ON blog_posts(status);

-- Verify the column was added
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name = 'cover_image';

-- Test data
SELECT * FROM blog_posts LIMIT 1;
