-- RUN THIS IN SUPABASE SQL EDITOR RIGHT NOW
-- This adds the missing 'image' column to services table

ALTER TABLE services ADD COLUMN image text;