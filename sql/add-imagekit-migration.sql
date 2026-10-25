-- ============================================================================
--  BCA Department Website — ImageKit Migration
--  Run in Supabase SQL Editor to add ImageKit support to the gallery table.
-- ============================================================================

-- Add imagekit_file_id column to gallery_items (used for deletions from IK)
alter table public.gallery_items
  add column if not exists imagekit_file_id text;

-- Index for faster lookups when deleting
create index if not exists gallery_items_ik_fileid_idx
  on public.gallery_items (imagekit_file_id)
  where imagekit_file_id is not null;

-- ============================================================================
-- NOTE: After running this migration, update your environment variables:
--
--   IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxx
--   IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxx
--   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_IMAGEKIT_ID
--   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_IMAGEKIT_ID
--
-- These go in:
--   - .env.local (for local development)
--   - Vercel Dashboard > Project > Settings > Environment Variables (for production)
--
-- The existing Supabase 'gallery' storage bucket remains intact for any legacy
-- images already stored there. New uploads will go to ImageKit automatically.
-- ============================================================================
