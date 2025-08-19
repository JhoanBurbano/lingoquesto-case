-- Supabase Storage Setup for Voice Chat Audio Files
-- Execute this in your Supabase SQL Editor

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'voice-chat-audio',
  'voice-chat-audio',
  true,
  52428800, -- 50MB limit
  ARRAY['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm', 'audio/m4a']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
CREATE POLICY "Public read access for audio files" ON storage.objects
FOR SELECT USING (bucket_id = 'voice-chat-audio');

-- Create storage policy for authenticated users to upload
CREATE POLICY "Authenticated users can upload audio" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'voice-chat-audio' 
  AND auth.role() = 'authenticated'
);

-- Create storage policy for users to update their own audio files
CREATE POLICY "Users can update their own audio files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'voice-chat-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policy for users to delete their own audio files
CREATE POLICY "Users can delete their own audio files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'voice-chat-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'voice-chat-audio';

-- Verify policies were created
SELECT * FROM storage.policies WHERE bucket_id = 'voice-chat-audio'; 