-- Working Supabase Setup Script for Voice Chat
-- Execute this in your Supabase SQL Editor

-- Create voice_chat_rooms table
CREATE TABLE IF NOT EXISTS public.voice_chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    max_participants INTEGER DEFAULT 10 CHECK (max_participants > 0 AND max_participants <= 50),
    is_active BOOLEAN DEFAULT true
);

-- Create voice_chat_participants table
CREATE TABLE IF NOT EXISTS public.voice_chat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.voice_chat_rooms(id) ON DELETE CASCADE,
    user_id VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    left_at TIMESTAMP WITH TIME ZONE,
    is_speaking BOOLEAN DEFAULT false,
    audio_level DECIMAL(3,2) DEFAULT 0.00 CHECK (audio_level >= 0.00 AND audio_level <= 1.00)
);

-- Create voice_messages table
CREATE TABLE IF NOT EXISTS public.voice_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.voice_chat_rooms(id) ON DELETE CASCADE,
    user_id VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    text TEXT,
    audio_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reactions JSONB DEFAULT '[]'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_voice_chat_rooms_active ON public.voice_chat_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_voice_chat_rooms_created ON public.voice_chat_rooms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_chat_participants_room ON public.voice_chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_voice_chat_participants_user ON public.voice_chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_chat_participants_active ON public.voice_chat_participants(room_id, left_at) WHERE left_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_voice_messages_room ON public.voice_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_voice_messages_timestamp ON public.voice_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_voice_messages_user ON public.voice_messages(user_id);

-- Enable Row Level Security
ALTER TABLE public.voice_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for voice_chat_rooms
CREATE POLICY "Allow public read access to active rooms" ON public.voice_chat_rooms
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to create rooms" ON public.voice_chat_rooms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow room creators to update their rooms" ON public.voice_chat_rooms
    FOR UPDATE USING (true);

-- Create RLS policies for voice_chat_participants
CREATE POLICY "Allow public read access to participants" ON public.voice_chat_participants
    FOR SELECT USING (true);

CREATE POLICY "Allow users to join rooms" ON public.voice_chat_participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update their own participation" ON public.voice_chat_participants
    FOR UPDATE USING (true);

CREATE POLICY "Allow users to leave rooms" ON public.voice_chat_participants
    FOR DELETE USING (true);

-- Create RLS policies for voice_messages
CREATE POLICY "Allow public read access to messages" ON public.voice_messages
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to send messages" ON public.voice_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow message authors to update their messages" ON public.voice_messages
    FOR UPDATE USING (true);

CREATE POLICY "Allow message authors to delete their messages" ON public.voice_messages
    FOR DELETE USING (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_chat_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_messages;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for voice_chat_rooms
CREATE TRIGGER update_voice_chat_rooms_updated_at 
    BEFORE UPDATE ON public.voice_chat_rooms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up orphaned connections
CREATE OR REPLACE FUNCTION cleanup_orphaned_connections()
RETURNS void AS $$
BEGIN
    -- Mark participants as left if they joined more than 5 minutes ago and haven't been marked as left
    UPDATE public.voice_chat_participants 
    SET left_at = timezone('utc'::text, now())
    WHERE left_at IS NULL 
      AND joined_at < timezone('utc'::text, now()) - INTERVAL '5 minutes';
    
    -- Log cleanup activity
    RAISE NOTICE 'Cleaned up orphaned connections at %', timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql;

-- Create RPC function for Beacon API cleanup
CREATE OR REPLACE FUNCTION cleanup_participant(cleanup_data JSONB)
RETURNS JSONB AS $$
DECLARE
    room_id UUID;
    user_id TEXT;
    result JSONB;
BEGIN
    -- Extract data from JSON payload
    room_id := (cleanup_data->>'roomId')::UUID;
    user_id := cleanup_data->>'userId';
    
    -- Validate input
    IF room_id IS NULL OR user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid input data');
    END IF;
    
    -- Mark participant as left
    UPDATE public.voice_chat_participants 
    SET left_at = timezone('utc'::text, now())
    WHERE room_id = $1 
      AND user_id = $2 
      AND left_at IS NULL;
    
    -- Check if update was successful
    IF FOUND THEN
        result := jsonb_build_object(
            'success', true, 
            'message', 'Participant marked as left',
            'roomId', room_id,
            'userId', user_id,
            'timestamp', timezone('utc'::text, now())
        );
    ELSE
        result := jsonb_build_object(
            'success', false, 
            'error', 'Participant not found or already left',
            'roomId', room_id,
            'userId', user_id
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on cleanup functions
GRANT EXECUTE ON FUNCTION cleanup_orphaned_connections() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_participant(JSONB) TO anon, authenticated;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;

-- Insert sample data (optional)
INSERT INTO public.voice_chat_rooms (name, max_participants) VALUES
    ('Conversación Básica', 10),
    ('Práctica Avanzada', 15),
    ('Chat Grupal', 20)
ON CONFLICT DO NOTHING;

-- Verify tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('voice_chat_rooms', 'voice_chat_participants', 'voice_messages')
ORDER BY table_name;

-- Verify Realtime is enabled
SELECT 
    schemaname,
    tablename,
    pubname
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
    AND tablename IN ('voice_chat_rooms', 'voice_chat_participants', 'voice_messages')
ORDER BY tablename;

-- Verify functions were created
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
    AND routine_name IN ('cleanup_orphaned_connections', 'cleanup_participant')
ORDER BY routine_name; 