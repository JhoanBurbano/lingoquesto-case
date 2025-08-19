import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type VoiceChatRoom = Database['public']['Tables']['voice_chat_rooms']['Row']
type VoiceChatParticipant = Database['public']['Tables']['voice_chat_participants']['Row']

export interface VoiceChatState {
  isConnected: boolean
  isSpeaking: boolean
  audioLevel: number
  participants: VoiceChatParticipant[]
  currentRoom: VoiceChatRoom | null
  error: string | null
}

export function useVoiceChat() {
  console.log('🎯 useVoiceChat composable initialized')
  console.log('🔗 Supabase client status:', supabase ? 'Connected' : 'Not connected')
  console.log('📅 Timestamp:', new Date().toISOString())
  console.log('🌍 Environment:', import.meta.env.MODE)
  console.log('🔧 NODE_ENV:', import.meta.env.NODE_ENV)

  // State
  const state = ref<VoiceChatState>({
    isConnected: false,
    isSpeaking: false,
    audioLevel: 0,
    participants: [],
    currentRoom: null,
    error: null,
  })

  // Audio context and stream
  const audioContext = ref<AudioContext | null>(null)
  const mediaStream = ref<MediaStream | null>(null)
  const audioAnalyser = ref<AnalyserNode | null>(null)
  const dataArray = ref<Uint8Array | null>(null)
  const animationFrame = ref<number | null>(null)

  // Supabase subscriptions
  let participantsSubscription: ReturnType<typeof supabase.channel> | null = null
  let roomSubscription: ReturnType<typeof supabase.channel> | null = null

  // Connection tracking
  const connectionId = ref<string>(crypto.randomUUID())
  const isReconnecting = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 3

  // Computed
  const participantCount = computed(() => state.value.participants.length)
  const isRoomFull = computed(() => {
    if (!state.value.currentRoom) return false
    return participantCount.value >= state.value.currentRoom.max_participants
  })

  // Methods
  const initializeAudio = async () => {
    try {
      console.log('🎤 Initializing audio system...')

      audioContext.value = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      console.log('✅ Audio context created')

      mediaStream.value = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      console.log('✅ Microphone access granted')

      const source = audioContext.value.createMediaStreamSource(mediaStream.value)
      audioAnalyser.value = audioContext.value.createAnalyser()
      audioAnalyser.value.fftSize = 256
      source.connect(audioAnalyser.value)
      console.log('✅ Audio analyzer configured')

      dataArray.value = new Uint8Array(audioAnalyser.value.frequencyBinCount)
      startAudioLevelMonitoring()
      console.log('✅ Audio level monitoring started')

      return true
    } catch (error) {
      console.error('❌ Audio initialization failed:', error)
      state.value.error = `Failed to initialize audio: ${error}`
      return false
    }
  }

  const startAudioLevelMonitoring = () => {
    if (!audioAnalyser.value || !dataArray.value) {
      console.warn('⚠️ Audio analyzer not ready for monitoring')
      return
    }

    console.log('🎵 Starting audio level monitoring...')

    const updateAudioLevel = () => {
      if (!audioAnalyser.value || !dataArray.value) return

      audioAnalyser.value.getByteFrequencyData(dataArray.value)
      const average = dataArray.value.reduce((a, b) => a + b) / dataArray.value.length
      const normalizedLevel = Math.min(average / 128, 1)

      const previousSpeaking = state.value.isSpeaking
      state.value.audioLevel = normalizedLevel
      state.value.isSpeaking = normalizedLevel > 0.1

      // Update speaking status in Supabase if changed
      if (previousSpeaking !== state.value.isSpeaking) {
        console.log('🗣️ Speaking status changed:', state.value.isSpeaking ? 'Speaking' : 'Silent')
        updateSpeakingStatus(state.value.isSpeaking)
      }

      animationFrame.value = requestAnimationFrame(updateAudioLevel)
    }

    updateAudioLevel()
    console.log('✅ Audio level monitoring active')
  }

  const createRoom = async (name: string, maxParticipants: number = 10): Promise<string | null> => {
    try {
      console.log('🏗️ Creating new room:', name, 'with max participants:', maxParticipants)

      const { data, error } = await supabase
        .from('voice_chat_rooms')
        .insert({
          name,
          max_participants: maxParticipants,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Failed to create room:', error)
        throw error
      }

      console.log('✅ Room created successfully:', data.id)
      state.value.currentRoom = data

      // Join the newly created room
      console.log('🚀 Auto-joining newly created room...')
      await joinRoom(data.id)

      return data.id
    } catch (error) {
      console.error('❌ Failed to create room:', error)
      state.value.error = `Failed to create room: ${error}`
      return null
    }
  }

  const joinRoom = async (roomId: string, username: string = 'Anonymous'): Promise<boolean> => {
    try {
      console.log('🚀 Attempting to join room:', roomId, 'as:', username)

      // Get room details
      const { data: room, error: roomError } = await supabase
        .from('voice_chat_rooms')
        .select('*')
        .eq('id', roomId)
        .eq('is_active', true)
        .single()

      if (roomError || !room) {
        console.error('❌ Room not found or inactive:', roomError)
        throw new Error('Room not found or inactive')
      }

      console.log('✅ Room found:', room.name)

      if (isRoomFull.value) {
        console.error('❌ Room is full')
        throw new Error('Room is full')
      }

      // Initialize audio if not already done
      if (!audioContext.value) {
        console.log('🎤 Initializing audio...')
        const audioInitialized = await initializeAudio()
        if (!audioInitialized) {
          console.error('❌ Audio initialization failed')
          return false
        }
        console.log('✅ Audio initialized successfully')
      }

      // Join as participant
      const userId = crypto.randomUUID()
      console.log('👤 Creating participant record with ID:', userId)

      const { error: participantError } = await supabase.from('voice_chat_participants').insert({
        room_id: roomId,
        user_id: userId,
        username,
        is_speaking: false,
        audio_level: 0,
      })

      if (participantError) {
        console.error('❌ Failed to create participant:', participantError)
        throw participantError
      }

      console.log('✅ Participant record created successfully')

      // Update state
      state.value.currentRoom = room
      state.value.isConnected = true
      console.log('✅ Successfully joined room:', room.name)

      // Subscribe to real-time updates
      console.log('📡 Setting up real-time subscriptions...')
      subscribeToRoomUpdates(roomId)
      subscribeToParticipantsUpdates(roomId)

      // Track this connection
      console.log('🔗 Connection ID:', connectionId.value)
      console.log('🌐 Supabase integration active')
      console.log('✅ Supabase integration confirmed')

      return true
    } catch (error) {
      console.error('❌ Failed to join room:', error)
      state.value.error = `Failed to join room: ${error}`
      return false
    }
  }

  const leaveRoom = async () => {
    try {
      if (state.value.currentRoom) {
        console.log('👋 Leaving room:', state.value.currentRoom.name)

        // Remove participant
        const { error: deleteError } = await supabase
          .from('voice_chat_participants')
          .delete()
          .eq('room_id', state.value.currentRoom.id)

        if (deleteError) {
          console.error('❌ Error removing participant:', deleteError)
        } else {
          console.log('✅ Participant removed successfully')
        }

        // Unsubscribe from real-time updates
        if (participantsSubscription) {
          participantsSubscription.unsubscribe()
          console.log('📡 Unsubscribed from participants updates')
        }
        if (roomSubscription) {
          roomSubscription.unsubscribe()
          console.log('📡 Unsubscribed from room updates')
        }

        // Cleanup audio
        if (mediaStream.value) {
          mediaStream.value.getTracks().forEach((track) => track.stop())
          console.log('🎤 Audio tracks stopped')
        }
        if (audioContext.value) {
          await audioContext.value.close()
          console.log('🎤 Audio context closed')
        }
        if (animationFrame.value) {
          cancelAnimationFrame(animationFrame.value)
          console.log('🔄 Animation frame cancelled')
        }

        // Reset state
        state.value = {
          isConnected: false,
          isSpeaking: false,
          audioLevel: 0,
          participants: [],
          currentRoom: null,
          error: null,
        }

        console.log('✅ Room left successfully, state reset')
      }
    } catch (error) {
      console.error('❌ Error leaving room:', error)
      state.value.error = `Failed to leave room: ${error}`
    }
  }

  const updateSpeakingStatus = async (isSpeaking: boolean) => {
    if (!state.value.currentRoom) {
      console.warn('⚠️ Cannot update speaking status: no current room')
      return
    }

    try {
      console.log('📝 Updating speaking status to:', isSpeaking)

      const { error } = await supabase
        .from('voice_chat_participants')
        .update({ is_speaking: isSpeaking })
        .eq('room_id', state.value.currentRoom.id)

      if (error) {
        console.error('❌ Failed to update speaking status:', error)
      } else {
        console.log('✅ Speaking status updated successfully')
      }
    } catch (error) {
      console.error('❌ Error updating speaking status:', error)
    }
  }

  const handleReconnection = async (roomId: string) => {
    if (isReconnecting.value || reconnectAttempts.value >= maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached')
      state.value.error = 'Connection lost. Please refresh the page.'
      return
    }

    console.log('🔄 Attempting to reconnect...', reconnectAttempts.value + 1)
    isReconnecting.value = true
    reconnectAttempts.value++

    try {
      // Wait before reconnecting
      await new Promise((resolve) => setTimeout(resolve, 1000 * reconnectAttempts.value))

      // Resubscribe to channels
      subscribeToRoomUpdates(roomId)
      subscribeToParticipantsUpdates(roomId)

      console.log('✅ Reconnection successful')
      isReconnecting.value = false
    } catch (error) {
      console.error('❌ Reconnection failed:', error)
      isReconnecting.value = false

      if (reconnectAttempts.value < maxReconnectAttempts) {
        // Retry reconnection
        setTimeout(() => handleReconnection(roomId), 2000)
      } else {
        state.value.error = 'Connection failed after multiple attempts. Please refresh the page.'
      }
    }
  }

  const subscribeToRoomUpdates = (roomId: string) => {
    // Unsubscribe from existing subscription if any
    if (roomSubscription) {
      roomSubscription.unsubscribe()
    }

    roomSubscription = supabase
      .channel(`room:${roomId}:${connectionId.value}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'voice_chat_rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          console.log('🔄 Room update received:', payload)
          state.value.currentRoom = payload.new as VoiceChatRoom
        },
      )
      .on('presence', { event: 'sync' }, () => {
        console.log('👥 Presence sync for room:', roomId)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('➕ User joined room:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('➖ User left room:', key, leftPresences)
      })
      .subscribe((status) => {
        console.log('📡 Room subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to room updates')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Room subscription error')
          handleReconnection(roomId)
        }
      })
  }

  const subscribeToParticipantsUpdates = (roomId: string) => {
    // Unsubscribe from existing subscription if any
    if (participantsSubscription) {
      participantsSubscription.unsubscribe()
    }

    participantsSubscription = supabase
      .channel(`participants:${roomId}:${connectionId.value}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voice_chat_participants',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          console.log('👥 Participants update received:', payload)

          // Refresh participants list
          const { data: participants, error } = await supabase
            .from('voice_chat_participants')
            .select('*')
            .eq('room_id', roomId)
            .eq('left_at', null) // Only active participants
            .order('joined_at', { ascending: true })

          if (error) {
            console.error('❌ Error fetching participants:', error)
            return
          }

          if (participants) {
            console.log('📊 Updated participants list:', participants.length, 'participants')
            state.value.participants = participants
          }
        },
      )
      .on('presence', { event: 'sync' }, () => {
        console.log('👥 Participants presence sync for room:', roomId)
      })
      .subscribe((status) => {
        console.log('📡 Participants subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to participants updates')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Participants subscription error')
          handleReconnection(roomId)
        }
      })
  }

  const getAvailableRooms = async (): Promise<VoiceChatRoom[]> => {
    try {
      console.log('🔍 Fetching available rooms...')

      const { data, error } = await supabase
        .from('voice_chat_rooms')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Failed to fetch rooms:', error)
        throw error
      }

      console.log('✅ Found', data?.length || 0, 'available rooms')
      return data || []
    } catch (error) {
      console.error('❌ Failed to get rooms:', error)
      state.value.error = `Failed to get rooms: ${error}`
      return []
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    leaveRoom()
  })

  console.log('✅ useVoiceChat composable ready with methods:', {
    createRoom: !!createRoom,
    joinRoom: !!joinRoom,
    leaveRoom: !!leaveRoom,
    getAvailableRooms: !!getAvailableRooms,
    initializeAudio: !!initializeAudio,
  })

  console.log('🎉 useVoiceChat composable initialization COMPLETE!')
  console.log('🚀 Ready to use voice chat functionality')

  return {
    // State
    state: readonly(state),

    // Computed
    participantCount,
    isRoomFull,

    // Methods
    createRoom,
    joinRoom,
    leaveRoom,
    getAvailableRooms,
    initializeAudio,
  }
}
