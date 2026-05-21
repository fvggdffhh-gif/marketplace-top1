-- Run this in Supabase SQL Editor to allow product insertion via anon key
-- Add a policy that allows INSERT on products for anon role
CREATE POLICY "Allow anonymous product insertion"
  ON products FOR INSERT
  WITH CHECK (true);
