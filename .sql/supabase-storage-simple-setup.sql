-- Simplified Supabase Storage Setup for Voice Chat Audio Files
-- Execute this in your Supabase SQL Editor

-- First, ensure storage is enabled in your Supabase project
-- Go to Storage section in Supabase Dashboard and create the bucket manually

-- Create storage bucket for audio files (if not exists via dashboard)
-- Note: This might not work if storage schema is not available
-- In that case, create the bucket manually in the Supabase Dashboard

-- Alternative approach: Use Supabase Dashboard
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Name: voice-chat-audio
-- 4. Make it Public: Yes
-- 5. File size limit: 50MB (52428800 bytes)
-- 6. Allowed MIME types: audio/wav,audio/mp3,audio/ogg,audio/webm,audio/m4a

-- Verify the bucket exists (this will work if storage is enabled)
-- If this query fails, storage is not enabled in your project
DO $$
BEGIN
    -- Try to check if storage schema exists
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        RAISE NOTICE 'Storage schema exists - storage is enabled';
        
        -- Check if buckets table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
            RAISE NOTICE 'Storage buckets table exists';
        ELSE
            RAISE NOTICE 'Storage buckets table does not exist';
        END IF;
    ELSE
        RAISE NOTICE 'Storage schema does not exist - storage is not enabled';
        RAISE NOTICE 'Please enable storage in your Supabase project settings';
    END IF;
END $$;

-- Instructions for manual setup:
/*
MANUAL SETUP INSTRUCTIONS:

1. Go to your Supabase Dashboard (https://supabase.com/dashboard)
2. Select your project
3. Go to "Storage" in the left sidebar
4. If Storage is not enabled, you'll see an option to enable it
5. Click "Enable Storage" if needed
6. Click "New Bucket" to create a new bucket
7. Fill in the details:
   - Name: voice-chat-audio
   - Public bucket: YES (check this box)
   - File size limit: 52428800 (50MB)
   - Allowed MIME types: audio/wav,audio/mp3,audio/ogg,audio/webm,audio/m4a
8. Click "Create bucket"

The bucket will be automatically configured with the necessary RLS policies for public access.
*/

-- Test query to verify setup (run this after creating bucket manually)
-- SELECT name, public, file_size_limit FROM storage.buckets WHERE id = 'voice-chat-audio'; 