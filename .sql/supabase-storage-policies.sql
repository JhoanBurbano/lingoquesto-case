-- Supabase Storage RLS Policies for voice-chat-audio Bucket
-- Execute this in your Supabase SQL Editor AFTER creating the bucket

-- First, ensure the bucket exists
-- If you haven't created it yet, go to Storage > New Bucket > voice-chat-audio

-- Enable RLS on storage.objects table (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. POLICY: Allow authenticated users to upload audio files
CREATE POLICY "Users can upload audio files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'voice-chat-audio' 
  AND auth.role() = 'authenticated'
);

-- 2. POLICY: Allow public access to read audio files (for sharing)
CREATE POLICY "Public access to audio files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'voice-chat-audio'
);

-- 3. POLICY: Allow users to update their own audio files
CREATE POLICY "Users can update their own audio files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'voice-chat-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
) WITH CHECK (
  bucket_id = 'voice-chat-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. POLICY: Allow users to delete their own audio files
CREATE POLICY "Users can delete their own audio files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'voice-chat-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- Test the setup by checking bucket permissions
SELECT 
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'voice-chat-audio';

-- Optional: Create a function to help with file management
CREATE OR REPLACE FUNCTION get_user_audio_files(user_id UUID)
RETURNS TABLE (
  name TEXT,
  size BIGINT,
  updated_at TIMESTAMPTZ,
  public_url TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.name,
    o.metadata->>'size'::BIGINT as size,
    o.updated_at,
    storage.get_public_url('voice-chat-audio', o.name) as public_url
  FROM storage.objects o
  WHERE o.bucket_id = 'voice-chat-audio'
    AND (storage.foldername(o.name))[1] = user_id::text
  ORDER BY o.updated_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_audio_files(UUID) TO authenticated;

-- Test the function (replace with actual user ID)
-- SELECT * FROM get_user_audio_files('your-user-id-here'::UUID); 