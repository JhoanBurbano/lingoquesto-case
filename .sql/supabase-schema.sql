-- Voice Chat Schema for Supabase
-- This schema supports multiple concurrent connections and real-time updates

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create voice chat rooms table
CREATE TABLE IF NOT EXISTS public.voice_chat_rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    max_participants INTEGER DEFAULT 10 CHECK (max_participants > 0 AND max_participants <= 50),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_by UUID,
    language VARCHAR(10) DEFAULT 'en',
    description TEXT,
    tags TEXT[]
);

-- Create voice chat participants table
CREATE TABLE IF NOT EXISTS public.voice_chat_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.voice_chat_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    username VARCHAR(100) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    left_at TIMESTAMP WITH TIME ZONE,
    is_speaking BOOLEAN DEFAULT false NOT NULL,
    audio_level DECIMAL(3,2) DEFAULT 0.00 CHECK (audio_level >= 0.00 AND audio_level <= 1.00),
    is_muted BOOLEAN DEFAULT false NOT NULL,
    is_host BOOLEAN DEFAULT false NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_voice_chat_rooms_active ON public.voice_chat_rooms(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_chat_rooms_language ON public.voice_chat_rooms(language, is_active);
CREATE INDEX IF NOT EXISTS idx_voice_chat_participants_room_id ON public.voice_chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_voice_chat_participants_user_id ON public.voice_chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_chat_participants_joined_at ON public.voice_chat_participants(joined_at);
CREATE INDEX IF NOT EXISTS idx_voice_chat_participants_speaking ON public.voice_chat_participants(is_speaking, room_id);

-- Create unique constraint to prevent duplicate participants in same room
CREATE UNIQUE INDEX IF NOT EXISTS idx_voice_chat_participants_unique_room_user 
ON public.voice_chat_participants(room_id, user_id) 
WHERE left_at IS NULL;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_voice_chat_rooms_updated_at 
    BEFORE UPDATE ON public.voice_chat_rooms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up inactive participants
CREATE OR REPLACE FUNCTION cleanup_inactive_participants()
RETURNS void AS $$
BEGIN
    -- Remove participants who haven't been active for more than 5 minutes
    DELETE FROM public.voice_chat_participants 
    WHERE last_activity < NOW() - INTERVAL '5 minutes';
    
    -- Deactivate rooms with no participants
    UPDATE public.voice_chat_rooms 
    SET is_active = false 
    WHERE id NOT IN (
        SELECT DISTINCT room_id 
        FROM public.voice_chat_participants 
        WHERE left_at IS NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to get room participant count
CREATE OR REPLACE FUNCTION get_room_participant_count(room_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM public.voice_chat_participants 
        WHERE room_id = room_uuid AND left_at IS NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to check if room is full
CREATE OR REPLACE FUNCTION is_room_full(room_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT get_room_participant_count(room_uuid) >= max_participants
        FROM public.voice_chat_rooms 
        WHERE id = room_uuid
    );
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE public.voice_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_chat_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voice_chat_rooms
-- Allow anyone to read active rooms
CREATE POLICY "Allow read access to active rooms" ON public.voice_chat_rooms
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to create rooms
CREATE POLICY "Allow authenticated users to create rooms" ON public.voice_chat_rooms
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow room creators to update their rooms
CREATE POLICY "Allow room creators to update rooms" ON public.voice_chat_rooms
    FOR UPDATE USING (auth.uid() = created_by);

-- Allow room creators to delete their rooms
CREATE POLICY "Allow room creators to delete rooms" ON public.voice_chat_rooms
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for voice_chat_participants
-- Allow reading participants in active rooms
CREATE POLICY "Allow read access to participants in active rooms" ON public.voice_chat_participants
    FOR SELECT USING (
        room_id IN (
            SELECT id FROM public.voice_chat_rooms WHERE is_active = true
        )
    );

-- Allow users to join rooms if not full
CREATE POLICY "Allow users to join rooms if not full" ON public.voice_chat_participants
    FOR INSERT WITH CHECK (
        NOT is_room_full(room_id) AND
        room_id IN (
            SELECT id FROM public.voice_chat_rooms WHERE is_active = true
        )
    );

-- Allow users to update their own participant record
CREATE POLICY "Allow users to update own participant record" ON public.voice_chat_participants
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Allow users to leave rooms
CREATE POLICY "Allow users to leave rooms" ON public.voice_chat_participants
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create view for room statistics
CREATE OR REPLACE VIEW public.voice_chat_room_stats AS
SELECT 
    r.id,
    r.name,
    r.language,
    r.max_participants,
    r.is_active,
    r.created_at,
    COUNT(p.id) as current_participants,
    r.max_participants - COUNT(p.id) as available_slots,
    CASE 
        WHEN COUNT(p.id) >= r.max_participants THEN true 
        ELSE false 
    END as is_full
FROM public.voice_chat_rooms r
LEFT JOIN public.voice_chat_participants p ON r.id = p.room_id AND p.left_at IS NULL
WHERE r.is_active = true
GROUP BY r.id, r.name, r.language, r.max_participants, r.is_active, r.created_at
ORDER BY r.created_at DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.voice_chat_rooms TO anon, authenticated;
GRANT ALL ON public.voice_chat_participants TO anon, authenticated;
GRANT SELECT ON public.voice_chat_room_stats TO anon, authenticated;

-- Insert sample data for testing
INSERT INTO public.voice_chat_rooms (name, language, description, max_participants) VALUES
('English Practice Room', 'en', 'Practice English conversation with other learners', 15),
('Spanish Conversation', 'es', 'Chat in Spanish with native speakers and learners', 12),
('French Beginners', 'fr', 'Perfect for French beginners - slow and clear speech', 10),
('German Advanced', 'de', 'Advanced German conversation for fluent speakers', 8),
('Japanese Study Group', 'ja', 'Learn Japanese through conversation', 20)
ON CONFLICT DO NOTHING;

-- Create function to handle participant join/leave events
CREATE OR REPLACE FUNCTION handle_participant_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Update room's updated_at when participants change
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        UPDATE public.voice_chat_rooms 
        SET updated_at = NOW() 
        WHERE id = COALESCE(NEW.room_id, OLD.room_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for participant events
CREATE TRIGGER trigger_participant_event
    AFTER INSERT OR UPDATE OR DELETE ON public.voice_chat_participants
    FOR EACH ROW EXECUTE FUNCTION handle_participant_event();

-- Enable real-time for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_chat_participants; 