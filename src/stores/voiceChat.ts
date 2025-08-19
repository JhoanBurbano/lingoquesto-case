import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { ChatState, ChatUser, VoiceMessage, EmojiReaction } from '@/types/voice-chat'

function uuid() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

function getInitialSpeed(): number {
  try {
    if (typeof localStorage === 'undefined') return 1
    const raw = localStorage.getItem('voice.playbackSpeed')
    const n = Number(raw)
    return n >= 0.5 && n <= 2 ? n : 1
  } catch {
    return 1
  }
}

type VoiceChatEvent =
  | { type: 'login'; payload: ChatUser }
  | { type: 'logout' }
  | { type: 'message'; payload: VoiceMessage }
  | { type: 'recording'; payload: boolean }
  | { type: 'playbackSpeed'; payload: number }
  | { type: 'playing'; payload: string | null }
  | { type: 'roomChange'; payload: string }
  | { type: 'participantsUpdate'; payload: ChatUser[] }
  | { type: 'addMessage'; payload: VoiceMessage }
  | { type: 'addReaction'; payload: { messageId: string; reaction: EmojiReaction } }
  | { type: 'removeReaction'; payload: { messageId: string; emoji: string; userId: string } }

let channel: BroadcastChannel | null = null
let roomSubscription: ReturnType<typeof supabase.channel> | null = null
let participantsSubscription: ReturnType<typeof supabase.channel> | null = null
let messagesSubscription: ReturnType<typeof supabase.channel> | null = null

export const useVoiceChatStore = defineStore('voiceChat', {
  state: (): ChatState & {
    _cleanupData: { roomId: string | null; userId: string | null; timestamp: number }
    _updateCleanupData: (() => void) | null
  } => ({
    user: null,
    messages: [],
    recording: false,
    playbackSpeed: getInitialSpeed(),
    activeMessageId: undefined,
    currentRoom: null,
    availableRooms: [],
    participants: [],
    isConnected: false,
    error: null,
    _cleanupData: {
      roomId: null,
      userId: null,
      timestamp: Date.now(),
    },
    _updateCleanupData: null,
  }),
  getters: {
    activeMessage(state): VoiceMessage | undefined {
      return state.messages.find((m) => m.id === state.activeMessageId)
    },
  },
  actions: {
    login(user: ChatUser) {
      this.user = user
      this._broadcast({ type: 'login', payload: user })
    },
    logout() {
      this.user = null
      this._broadcast({ type: 'logout' })
    },
    // Add message with storage and real-time sync
    async addMessage(
      partial: Omit<Partial<VoiceMessage>, 'id' | 'timestamp' | 'reactions'> & {
        text?: string
        audioUrl?: string
      },
    ) {
      try {
        if (!this.currentRoom || !this.user) {
          console.error('❌ Cannot add message: no room or user')
          return null
        }

        console.log('💬 Adding new message:', partial)

        // Handle audio blob URL conversion and upload to Supabase Storage
        let audioUrl = partial.audioUrl
        if (audioUrl && audioUrl.startsWith('blob:')) {
          try {
            console.log('🎵 Processing audio blob for upload...')

            // Convert blob URL to File object
            const response = await fetch(audioUrl)
            const blob = await response.blob()

            // Create file name with timestamp and user ID
            const timestamp = Date.now()
            const fileName = `audio_${timestamp}_${this.user.id}.wav`
            const filePath = `${this.user.id}/${fileName}`

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('voice-chat-audio')
              .upload(filePath, blob, {
                contentType: 'audio/wav',
                cacheControl: '3600',
                upsert: false,
              })

            if (uploadError) {
              console.error('❌ Error uploading audio to Supabase Storage:', uploadError)
              throw uploadError
            }

            // Get public URL for the uploaded file
            const { data: urlData } = supabase.storage
              .from('voice-chat-audio')
              .getPublicUrl(filePath)

            audioUrl = urlData.publicUrl
            console.log('✅ Audio uploaded to Supabase Storage:', audioUrl)

            // Clean up the blob URL to prevent memory leaks
            if (partial.audioUrl) {
              URL.revokeObjectURL(partial.audioUrl)
            }
          } catch (error) {
            console.error('❌ Error processing audio for upload:', error)
            audioUrl = undefined
          }
        }

        // Create message object
        const message: VoiceMessage = {
          id: uuid(),
          user: this.user,
          text: partial.text || '',
          audioUrl: audioUrl || undefined,
          reactions: [],
          timestamp: Date.now(),
          isPlaying: false,
        }

        // Add to local state immediately for UI responsiveness
        this.messages.push(message)
        this.activeMessageId = message.id

        // Save to Supabase for persistence
        const { data: savedMessage, error } = await supabase
          .from('voice_messages')
          .insert({
            room_id: this.currentRoom.id,
            user_id: this.user.id,
            username: this.user.name,
            text: message.text,
            audio_url: message.audioUrl,
            reactions: message.reactions,
          })
          .select()
          .single()

        if (error) {
          console.error('❌ Failed to save message to Supabase:', error)
          // Remove from local state if save failed
          this.messages = this.messages.filter((m) => m.id !== message.id)
          this.error = `Failed to save message: ${error.message}`
          return null
        }

        console.log('✅ Message saved to Supabase:', savedMessage.id)

        // Update local message with Supabase ID
        message.id = savedMessage.id
        this.activeMessageId = message.id

        // Broadcast to other tabs
        this._broadcast({ type: 'addMessage', payload: message })

        return message
      } catch (error) {
        console.error('❌ Error adding message:', error)
        this.error = `Failed to add message: ${error}`
        return null
      }
    },

    // Add reaction to message
    async addReaction(messageId: string, emoji: string) {
      try {
        console.log('😀 Adding reaction:', emoji, 'to message:', messageId)

        const message = this.messages.find((m) => m.id === messageId)
        if (!message) {
          console.error('❌ Message not found:', messageId)
          return false
        }

        // Create reaction object
        const reaction: EmojiReaction = {
          emoji,
          userId: this.user?.id || '',
          username: this.user?.name || 'Anonymous',
          timestamp: Date.now(),
        }

        // Add to local state
        message.reactions.push(reaction)

        // Update in Supabase
        const { error } = await supabase
          .from('voice_messages')
          .update({ reactions: message.reactions })
          .eq('id', messageId)

        if (error) {
          console.error('❌ Failed to update reactions in Supabase:', error)
          // Remove from local state if update failed
          message.reactions = message.reactions.filter(
            (r) => r.emoji !== emoji || r.userId !== reaction.userId,
          )
          this.error = `Failed to update reactions: ${error.message}`
          return false
        }

        console.log('✅ Reaction added successfully')

        // Broadcast to other tabs
        this._broadcast({ type: 'addReaction', payload: { messageId, reaction } })

        return true
      } catch (error) {
        console.error('❌ Error adding reaction:', error)
        this.error = `Failed to add reaction: ${error}`
        return false
      }
    },

    // Remove reaction from message
    async removeReaction(messageId: string, emoji: string, userId: string) {
      try {
        console.log('🗑️ Removing reaction:', emoji, 'from message:', messageId)

        const message = this.messages.find((m) => m.id === messageId)
        if (!message) {
          console.error('❌ Message not found:', messageId)
          return false
        }

        // Remove from local state
        message.reactions = message.reactions.filter(
          (r) => !(r.emoji === emoji && r.userId === userId),
        )

        // Update in Supabase
        const { error } = await supabase
          .from('voice_messages')
          .update({ reactions: message.reactions })
          .eq('id', messageId)

        if (error) {
          console.error('❌ Failed to update reactions in Supabase:', error)
          this.error = `Failed to update reactions: ${error.message}`
          return false
        }

        console.log('✅ Reaction removed successfully')

        // Broadcast to other tabs
        this._broadcast({ type: 'removeReaction', payload: { messageId, emoji, userId } })

        return true
      } catch (error) {
        console.error('❌ Error removing reaction:', error)
        this.error = `Failed to remove reaction: ${error}`
        return false
      }
    },
    setPlaybackSpeed(speed: number) {
      this.playbackSpeed = Math.max(0.5, Math.min(speed, 2))
      this._broadcast({ type: 'playbackSpeed', payload: this.playbackSpeed })
      try {
        localStorage.setItem('voice.playbackSpeed', String(this.playbackSpeed))
      } catch {}
    },
    startRecording() {
      this.recording = true
      this._broadcast({ type: 'recording', payload: true })
    },
    stopRecording() {
      this.recording = false
      this._broadcast({ type: 'recording', payload: false })
    },
    stopAllMessages() {
      this.activeMessageId = undefined
      this.messages = this.messages.map((m) => ({ ...m, isPlaying: false }))
      this._broadcast({ type: 'playing', payload: null })
    },
    startPlaying(id: string) {
      this.activeMessageId = id
      this.messages = this.messages.map((m) => ({ ...m, isPlaying: m.id === id }))
      this._broadcast({ type: 'playing', payload: id })
    },
    stopPlaying() {
      this.activeMessageId = undefined
      this.messages = this.messages.map((m) => ({ ...m, isPlaying: false }))
      this._broadcast({ type: 'playing', payload: null })
    },

    // Supabase integration methods
    async getAvailableRooms() {
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

        this.availableRooms = data || []
        console.log('✅ Found', this.availableRooms.length, 'available rooms')
        return this.availableRooms
      } catch (error) {
        console.error('❌ Error getting rooms:', error)
        this.error = `Failed to get rooms: ${error}`
        return []
      }
    },

    async createRoom(name: string, maxParticipants: number = 10) {
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
        this.currentRoom = data

        // Auto-join the newly created room
        await this.joinRoom(data.id)

        return data.id
      } catch (error) {
        console.error('❌ Failed to create room:', error)
        this.error = `Failed to create room: ${error}`
        return null
      }
    },

    async joinRoom(roomId: string) {
      try {
        console.log('🚀 Attempting to join room:', roomId)

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

        // Check if user is already in the room
        const { data: existingParticipant } = await supabase
          .from('voice_chat_participants')
          .select('*')
          .eq('room_id', roomId)
          .eq('user_id', this.user?.id)
          .is('left_at', null)
          .single()

        if (existingParticipant) {
          console.log('👤 User already in room, reconnecting...')
          // Update existing participant record
          const { error: updateError } = await supabase
            .from('voice_chat_participants')
            .update({
              left_at: null,
              joined_at: new Date().toISOString(),
              is_speaking: false,
              audio_level: 0,
            })
            .eq('id', existingParticipant.id)

          if (updateError) {
            console.error('❌ Error reconnecting participant:', updateError)
            throw updateError
          }
        } else {
          // Join as new participant
          const userId = this.user?.id || uuid()
          console.log('👤 Creating new participant record with ID:', userId)

          const { error: participantError } = await supabase
            .from('voice_chat_participants')
            .insert({
              room_id: roomId,
              user_id: userId,
              username: this.user?.name || 'Anonymous',
              is_speaking: false,
              audio_level: 0,
            })

          if (participantError) {
            console.error('❌ Failed to create participant:', participantError)
            throw participantError
          }

          console.log('✅ New participant record created successfully')
        }

        // Update state
        this.currentRoom = room
        this.isConnected = true
        console.log('✅ Successfully joined room:', room.name)

        // Update cleanup data for Beacon API
        if (this._updateCleanupData) {
          this._updateCleanupData()
        }

        // Subscribe to real-time updates
        this._setupRealtimeSubscriptions(roomId)

        // Load existing messages
        await this._loadRoomMessages(roomId)

        // Load participants
        await this._loadRoomParticipants(roomId)

        return true
      } catch (error) {
        console.error('❌ Failed to join room:', error)
        this.error = `Failed to join room: ${error}`
        return false
      }
    },

    async leaveRoom() {
      try {
        if (this.currentRoom) {
          console.log('👋 Leaving room:', this.currentRoom.name)

          // Mark participant as left instead of deleting
          const { error: updateError } = await supabase
            .from('voice_chat_participants')
            .update({ left_at: new Date().toISOString() })
            .eq('room_id', this.currentRoom.id)
            .eq('user_id', this.user?.id)

          if (updateError) {
            console.error('❌ Error marking participant as left:', updateError)
          } else {
            console.log('✅ Participant marked as left successfully')
          }

          // Unsubscribe from real-time updates
          this._cleanupRealtimeSubscriptions()

          // Reset state
          this.currentRoom = null
          this.isConnected = false
          this.messages = []
          this.participants = []

          console.log('✅ Room left successfully, state reset')
        }
      } catch (error) {
        console.error('❌ Error leaving room:', error)
        this.error = `Failed to leave room: ${error}`
      }
    },

    async _loadRoomMessages(roomId: string) {
      try {
        console.log('💬 Loading messages for room:', roomId)

        const { data, error } = await supabase
          .from('voice_messages')
          .select('*')
          .eq('room_id', roomId)
          .order('timestamp', { ascending: true })

        if (error) {
          console.error('❌ Error loading messages:', error)
          return
        }

        // Transform Supabase data to VoiceMessage format
        this.messages = (data || []).map((msg) => ({
          id: msg.id,
          user: {
            id: msg.user_id,
            name: msg.username,
            role: 'student',
          },
          text: msg.text || '',
          audioUrl: msg.audio_url || '',
          reactions: msg.reactions || [],
          timestamp: new Date(msg.timestamp).getTime(),
          isPlaying: false,
        }))

        console.log('✅ Loaded', this.messages.length, 'messages')

        // Set active message to the latest one
        if (this.messages.length > 0) {
          this.activeMessageId = this.messages[this.messages.length - 1].id
        }
      } catch (error) {
        console.error('❌ Error loading messages:', error)
      }
    },

    async _loadRoomParticipants(roomId: string) {
      try {
        console.log('👥 Loading participants for room:', roomId)

        const { data, error } = await supabase
          .from('voice_chat_participants')
          .select('*')
          .eq('room_id', roomId)
          .is('left_at', null)
          .order('joined_at', { ascending: true })

        if (error) {
          console.error('❌ Error loading participants:', error)
          return
        }

        this.participants = (data || []).map((p) => ({
          id: p.user_id,
          name: p.username,
          role: 'student',
        }))

        console.log(
          '✅ Loaded',
          this.participants.length,
          'participants:',
          this.participants.map((p) => p.name),
        )
      } catch (error) {
        console.error('❌ Error loading participants:', error)
      }
    },

    _setupRealtimeSubscriptions(roomId: string) {
      console.log('📡 Setting up real-time subscriptions for room:', roomId)

      // Subscribe to messages
      messagesSubscription = supabase
        .channel(`messages:${roomId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'voice_messages',
            filter: `room_id=eq.${roomId}`,
          },
          async (payload) => {
            console.log('🔄 Message update received:', payload)

            if (payload.eventType === 'INSERT') {
              const newMessage = payload.new
              const message: VoiceMessage = {
                id: newMessage.id,
                user: {
                  id: newMessage.user_id,
                  name: newMessage.username,
                  role: 'student',
                },
                text: newMessage.text || '',
                audioUrl: newMessage.audio_url || '',
                reactions: newMessage.reactions || [],
                timestamp: new Date(newMessage.timestamp).getTime(),
                isPlaying: false,
              }

              // Avoid duplicates
              if (!this.messages.some((m) => m.id === message.id)) {
                this.messages.push(message)
                this.activeMessageId = message.id
                console.log('✅ New message added:', message.id)
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedMessage = payload.new
              const existingMessage = this.messages.find((m) => m.id === updatedMessage.id)

              if (existingMessage) {
                // Update message properties
                existingMessage.text = updatedMessage.text || existingMessage.text
                existingMessage.audioUrl = updatedMessage.audio_url || existingMessage.audioUrl
                existingMessage.reactions = updatedMessage.reactions || existingMessage.reactions
                console.log('✅ Message updated:', updatedMessage.id)
              }
            } else if (payload.eventType === 'DELETE') {
              const deletedMessage = payload.old
              this.messages = this.messages.filter((m) => m.id !== deletedMessage.id)
              console.log('✅ Message deleted:', deletedMessage.id)
            }
          },
        )
        .subscribe()

      // Subscribe to participants
      participantsSubscription = supabase
        .channel(`participants:${roomId}`)
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
            await this._loadRoomParticipants(roomId)
          },
        )
        .subscribe()
    },

    _cleanupRealtimeSubscriptions() {
      console.log('🧹 Cleaning up real-time subscriptions')

      // Close all active channels
      if (roomSubscription) {
        roomSubscription.unsubscribe()
        roomSubscription = null
        console.log('📡 Room subscription closed')
      }

      if (participantsSubscription) {
        participantsSubscription.unsubscribe()
        participantsSubscription = null
        console.log('📡 Participants subscription closed')
      }

      if (messagesSubscription) {
        messagesSubscription.unsubscribe()
        messagesSubscription = null
        console.log('📡 Messages subscription closed')
      }
    },

    // BroadcastChannel integration (best-effort; safe in non-browser envs)
    _ensureChannel(): BroadcastChannel | null {
      if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null
      if (!channel) {
        channel = new BroadcastChannel('voice-chat')
        channel.onmessage = (e: MessageEvent<VoiceChatEvent>) => this._onMessage(e.data)
      }
      return channel
    },
    _broadcast(event: VoiceChatEvent) {
      const ch = this._ensureChannel()
      try {
        ch?.postMessage(event)
      } catch {}
    },
    _onMessage(event: VoiceChatEvent) {
      switch (event?.type) {
        case 'login':
          this.user = event.payload as ChatUser
          break
        case 'logout':
          this.user = null
          break
        case 'message':
          // avoid duplicates by id
          if (!this.messages.some((m) => m.id === (event.payload as VoiceMessage)?.id)) {
            this.messages.push(event.payload as VoiceMessage)
          }
          break
        case 'recording':
          this.recording = Boolean(
            (event as Extract<VoiceChatEvent, { type: 'recording' }>).payload,
          )
          break
        case 'playbackSpeed':
          this.playbackSpeed =
            Number((event as Extract<VoiceChatEvent, { type: 'playbackSpeed' }>).payload) || 1
          try {
            localStorage.setItem('voice.playbackSpeed', String(this.playbackSpeed))
          } catch {}
          break
        case 'playing':
          this.activeMessageId =
            (event as Extract<VoiceChatEvent, { type: 'playing' }>).payload ?? undefined
          this.messages = this.messages.map((m) => ({
            ...m,
            isPlaying: m.id === this.activeMessageId,
          }))
          break
        case 'addMessage':
          this.messages.push(event.payload as VoiceMessage)
          break
        case 'addReaction':
          const { messageId, reaction } = event.payload as {
            messageId: string
            reaction: EmojiReaction
          }
          const message = this.messages.find((m) => m.id === messageId)
          if (message) {
            message.reactions.push(reaction)
          }
          break
        case 'removeReaction':
          const {
            messageId: rmMessageId,
            emoji,
            userId,
          } = event.payload as { messageId: string; emoji: string; userId: string }
          const rmMessage = this.messages.find((m) => m.id === rmMessageId)
          if (rmMessage) {
            rmMessage.reactions = rmMessage.reactions.filter(
              (r) => !(r.emoji === emoji && r.userId === userId),
            )
          }
          break
        default:
          break
      }
    },

    // Clean up orphaned connections (participants who left without proper cleanup)
    async cleanupOrphanedConnections() {
      try {
        console.log('🧹 Cleaning up orphaned connections...')

        // Find participants who joined more than 5 minutes ago but haven't been marked as left
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

        const { data: orphanedParticipants, error } = await supabase
          .from('voice_chat_participants')
          .select('*')
          .is('left_at', null)
          .lt('joined_at', fiveMinutesAgo)

        if (error) {
          console.error('❌ Error finding orphaned connections:', error)
          return
        }

        if (orphanedParticipants && orphanedParticipants.length > 0) {
          console.log(`🧹 Found ${orphanedParticipants.length} orphaned connections`)

          // Mark them as left
          for (const participant of orphanedParticipants) {
            const { error: updateError } = await supabase
              .from('voice_chat_participants')
              .update({ left_at: new Date().toISOString() })
              .eq('id', participant.id)

            if (updateError) {
              console.error('❌ Error cleaning up orphaned participant:', updateError)
            } else {
              console.log(`✅ Cleaned up orphaned participant: ${participant.username}`)
            }
          }
        } else {
          console.log('✅ No orphaned connections found')
        }
      } catch (error) {
        console.error('❌ Error during orphaned connection cleanup:', error)
      }
    },

    // Initialize store with cleanup listeners
    initialize() {
      console.log('🚀 Initializing voice chat store')

      // Register service worker for robust cleanup
      this._registerServiceWorker()

      // Set up message listener for service worker
      this._setupServiceWorkerListener()

      // Set up robust page unload listeners
      if (typeof window !== 'undefined') {
        // Primary cleanup on page unload
        window.addEventListener('beforeunload', this._cleanupOnUnload)
        window.addEventListener('pagehide', this._cleanupOnUnload)

        // Additional cleanup for reloads
        window.addEventListener('unload', this._cleanupOnUnload)

        // Detect page reload specifically
        window.addEventListener('load', this._detectReload)

        // Use Beacon API for guaranteed cleanup
        this._setupBeaconCleanup()

        console.log('📡 Page unload listeners attached')

        // Clean up orphaned connections on initialization
        this.cleanupOrphanedConnections()

        // Set up periodic cleanup every 2 minutes
        setInterval(
          () => {
            this.cleanupOrphanedConnections()
          },
          2 * 60 * 1000,
        )
      }
    },

    // Setup listener for service worker messages
    _setupServiceWorkerListener() {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'PERFORM_CLEANUP') {
            console.log('🧹 Service worker cleanup request received:', event.data)
            this._performCleanupFromServiceWorker(event.data.data)
          }
        })
      }
    },

    // Perform cleanup when requested by service worker
    async _performCleanupFromServiceWorker(cleanupData: { roomId: string; userId: string }) {
      try {
        console.log('🧹 Performing cleanup from service worker request')

        if (cleanupData.roomId && cleanupData.userId) {
          await this._markParticipantAsLeft(cleanupData.roomId, cleanupData.userId)
          console.log('✅ Cleanup completed from service worker request')
        }
      } catch (error) {
        console.error('❌ Error during service worker cleanup:', error)
      }
    },

    // Register service worker for robust cleanup
    async _registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw-cleanup.js')
          console.log('✅ Service Worker registered:', registration)

          // Send cleanup data to service worker when joining rooms
          this._updateCleanupData = () => {
            if (this.currentRoom && this.user?.id && registration.active) {
              registration.active.postMessage({
                type: 'CLEANUP_CONNECTION',
                roomId: this.currentRoom.id,
                userId: this.user.id,
                supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
                supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              })
              console.log('📡 Cleanup data sent to Service Worker')
            }
          }
        } catch (error) {
          console.error('❌ Service Worker registration failed:', error)
        }
      }
    },

    // Detect if this is a page reload
    _detectReload() {
      if (performance.navigation.type === 1) {
        console.log('🔄 Page reload detected, triggering cleanup...')
        // Force cleanup on reload detection
        if (this.currentRoom && this.user?.id) {
          this._forceCleanup()
        }
      }
    },

    // Setup Beacon API for guaranteed cleanup
    _setupBeaconCleanup() {
      // Store cleanup data for Beacon API
      this._cleanupData = {
        roomId: null,
        userId: null,
        timestamp: Date.now(),
      }

      // Update cleanup data when joining rooms
      this._updateCleanupData = () => {
        if (this.currentRoom && this.user?.id) {
          this._cleanupData = {
            roomId: this.currentRoom.id,
            userId: this.user.id,
            timestamp: Date.now(),
          }
        }
      }
    },

    // Force immediate cleanup
    async _forceCleanup() {
      try {
        console.log('🧹 Force cleanup triggered')

        if (this.currentRoom && this.user?.id) {
          await this._markParticipantAsLeft(this.currentRoom.id, this.user.id)
        }

        this._cleanupRealtimeSubscriptions()

        // Reset state
        this.currentRoom = null
        this.isConnected = false
        this.messages = []
        this.participants = []

        console.log('✅ Force cleanup completed')
      } catch (error) {
        console.error('❌ Error during force cleanup:', error)
      }
    },

    // Enhanced cleanup on page unload
    async _cleanupOnUnload(event: Event) {
      try {
        console.log('🔄 Page unloading, cleaning up connections...')

        // Use Beacon API for guaranteed cleanup
        if (navigator.sendBeacon && this._cleanupData.roomId && this._cleanupData.userId) {
          const cleanupPayload = {
            action: 'cleanup_participant',
            roomId: this._cleanupData.roomId,
            userId: this._cleanupData.userId,
            timestamp: this._cleanupData.timestamp,
          }

          const success = navigator.sendBeacon(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/cleanup_participant`,
            JSON.stringify(cleanupPayload),
          )

          if (success) {
            console.log('✅ Beacon cleanup sent successfully')
          } else {
            console.log('⚠️ Beacon cleanup failed, using fallback')
            await this._markParticipantAsLeft(this._cleanupData.roomId, this._cleanupData.userId)
          }
        } else {
          // Fallback to direct cleanup
          if (this.currentRoom && this.user?.id) {
            await this._markParticipantAsLeft(this.currentRoom.id, this.user.id)
          }
        }

        // Clean up subscriptions
        this._cleanupRealtimeSubscriptions()
      } catch (error) {
        console.error('❌ Error during unload cleanup:', error)
      }
    },

    // Mark participant as left (for cleanup)
    async _markParticipantAsLeft(roomId: string, userId: string) {
      try {
        console.log('🧹 Marking participant as left for cleanup:', userId)

        const { error } = await supabase
          .from('voice_chat_participants')
          .update({ left_at: new Date().toISOString() })
          .eq('room_id', roomId)
          .eq('user_id', userId)

        if (error) {
          console.error('❌ Error marking participant as left during cleanup:', error)
        } else {
          console.log('✅ Participant marked as left during cleanup')
        }
      } catch (error) {
        console.error('❌ Error during cleanup:', error)
      }
    },

    // Get audio URL for playback (now directly from Supabase Storage)
    getAudioUrl(audioUrl: string): string | null {
      try {
        if (!audioUrl) {
          return null
        }

        // If it's already a Supabase Storage URL, return it directly
        if (audioUrl.includes('supabase.co') || audioUrl.includes('storage.googleapis.com')) {
          return audioUrl
        }

        // If it's a blob URL, it might be from a recent recording
        if (audioUrl.startsWith('blob:')) {
          return audioUrl
        }

        // If it's a local storage key (legacy), try to convert
        if (audioUrl.startsWith('audio_')) {
          const base64Audio = localStorage.getItem(audioUrl)
          if (base64Audio) {
            try {
              const binaryString = atob(base64Audio)
              const bytes = new Uint8Array(binaryString.length)
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
              }

              const blob = new Blob([bytes], { type: 'audio/wav' })
              const blobUrl = URL.createObjectURL(blob)

              console.log('✅ Legacy audio converted from localStorage:', blobUrl)
              return blobUrl
            } catch (error) {
              console.error('❌ Error converting legacy audio:', error)
              return null
            }
          }
        }

        console.error('❌ Unknown audio URL format:', audioUrl)
        return null
      } catch (error) {
        console.error('❌ Error getting audio URL:', error)
        return null
      }
    },

    // Clean up blob URLs to prevent memory leaks
    cleanupAudioUrls() {
      this.messages.forEach((message) => {
        if (message.audioUrl && message.audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(message.audioUrl)
        }
      })
    },

    // Delete audio file from Supabase Storage
    async deleteAudioFile(audioUrl: string): Promise<boolean> {
      try {
        if (!audioUrl || !audioUrl.includes('supabase.co')) {
          return false
        }

        // Extract file path from URL
        const urlParts = audioUrl.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const userId = urlParts[urlParts.length - 2]
        const filePath = `${userId}/${fileName}`

        console.log('🗑️ Deleting audio file:', filePath)

        const { error } = await supabase.storage.from('voice-chat-audio').remove([filePath])

        if (error) {
          console.error('❌ Error deleting audio file:', error)
          return false
        }

        console.log('✅ Audio file deleted successfully')
        return true
      } catch (error) {
        console.error('❌ Error deleting audio file:', error)
        return false
      }
    },
  },
})
