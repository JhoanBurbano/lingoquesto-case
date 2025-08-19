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

-- Create a scheduled job to run cleanup every 2 minutes (if using pg_cron extension)
-- Note: This requires pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('cleanup-orphaned-connections', '*/2 * * * *', 'SELECT cleanup_orphaned_connections();');

-- Alternative: Create a trigger function that runs on table access
CREATE OR REPLACE FUNCTION trigger_cleanup_on_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Only run cleanup every 10th access to avoid performance impact
    IF (random() < 0.1) THEN
        PERFORM cleanup_orphaned_connections();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on voice_chat_participants table
CREATE TRIGGER cleanup_trigger
    AFTER SELECT ON public.voice_chat_participants
    FOR EACH ROW
    EXECUTE FUNCTION trigger_cleanup_on_access();

-- Grant execute permission on cleanup functions
GRANT EXECUTE ON FUNCTION cleanup_orphaned_connections() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_participant(JSONB) TO anon, authenticated;