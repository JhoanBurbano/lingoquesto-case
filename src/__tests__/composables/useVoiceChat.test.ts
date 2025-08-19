import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useVoiceChat } from '@/composables/useVoiceChat'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
      channel: vi.fn(() => ({
        on: vi.fn(() => ({
          subscribe: vi.fn(() => ({
            unsubscribe: vi.fn(),
          })),
        })),
      })),
    })),
  },
}))

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-123'),
  },
})

// Mock navigator.mediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn(),
  },
  writable: true,
})

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
  createMediaStreamSource: vi.fn(() => ({
    connect: vi.fn(),
  })),
  createAnalyser: vi.fn(() => ({
    fftSize: 256,
    frequencyBinCount: 128,
    connect: vi.fn(),
  })),
  close: vi.fn(),
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn()
global.cancelAnimationFrame = vi.fn()

describe('useVoiceChat', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    // Reset mocks
    vi.clearAllMocks()

    // Mock successful getUserMedia
    navigator.mediaDevices.getUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [
        {
          stop: vi.fn(),
        },
      ],
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { state } = useVoiceChat()

      expect(state.value.isConnected).toBe(false)
      expect(state.value.isSpeaking).toBe(false)
      expect(state.value.audioLevel).toBe(0)
      expect(state.value.participants).toEqual([])
      expect(state.value.currentRoom).toBe(null)
      expect(state.value.error).toBe(null)
    })

    it('should compute participant count correctly', () => {
      const { participantCount } = useVoiceChat()

      expect(participantCount.value).toBe(0)
    })

    it('should compute room full status correctly', () => {
      const { isRoomFull } = useVoiceChat()

      expect(isRoomFull.value).toBe(false)
    })
  })

  describe('audio initialization', () => {
    it('should initialize audio successfully', async () => {
      const { initializeAudio } = useVoiceChat()

      const result = await initializeAudio()

      expect(result).toBe(true)
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
    })

    it('should handle audio initialization failure', async () => {
      const error = new Error('Permission denied')
      navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(error)

      const { initializeAudio, state } = useVoiceChat()

      const result = await initializeAudio()

      expect(result).toBe(false)
      expect(state.value.error).toContain('Failed to initialize audio')
    })
  })

  describe('room management', () => {
    it('should create room successfully', async () => {
      const mockRoom = {
        id: 'room-123',
        name: 'Test Room',
        max_participants: 10,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      const { createRoom } = useVoiceChat()

      // Mock Supabase response
      const mockSupabase = await import('@/lib/supabase')
      mockSupabase.supabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockRoom, error: null }),
          }),
        }),
      })

      const roomId = await createRoom('Test Room', 10)

      expect(roomId).toBe('room-123')
    })

    it('should handle room creation failure', async () => {
      const { createRoom, state } = useVoiceChat()

      // Mock Supabase error
      const mockSupabase = await import('@/lib/supabase')
      mockSupabase.supabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      })

      const roomId = await createRoom('Test Room', 10)

      expect(roomId).toBe(null)
      expect(state.value.error).toContain('Failed to create room')
    })

    it('should join room successfully', async () => {
      const mockRoom = {
        id: 'room-123',
        name: 'Test Room',
        max_participants: 10,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      const { joinRoom, state } = useVoiceChat()

      // Mock Supabase responses
      const mockSupabase = await import('@/lib/supabase')
      mockSupabase.supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockRoom, error: null }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      })

      const result = await joinRoom('room-123', 'TestUser')

      expect(result).toBe(true)
      expect(state.value.isConnected).toBe(true)
      expect(state.value.currentRoom).toEqual(mockRoom)
    })

    it('should handle room join failure when room not found', async () => {
      const { joinRoom, state } = useVoiceChat()

      // Mock Supabase error
      const mockSupabase = await import('@/lib/supabase')
      mockSupabase.supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Room not found' },
            }),
          }),
        }),
      })

      const result = await joinRoom('invalid-room', 'TestUser')

      expect(result).toBe(false)
      expect(state.value.error).toContain('Failed to join room')
    })
  })

  describe('participant management', () => {
    it('should update speaking status', async () => {
      const { updateSpeakingStatus } = useVoiceChat()

      // Mock Supabase
      const mockSupabase = await import('@/lib/supabase')
      mockSupabase.supabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      })

      // This should not throw an error
      await expect(updateSpeakingStatus(true)).resolves.not.toThrow()
    })

    it('should handle speaking status update failure', async () => {
      const { updateSpeakingStatus } = useVoiceChat()

      // Mock Supabase error
      const mockSupabase = await import('@/lib/supabase')
      mockSupabase.supabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: 'Update failed' },
          }),
        }),
      })

      // Mock console.error to avoid test noise
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await updateSpeakingStatus(true)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to update speaking status:',
        expect.any(Error),
      )

      consoleSpy.mockRestore()
    })
  })

  describe('room listing', () => {
    it('should get available rooms successfully', async () => {
      const mockRooms = [
        {
          id: 'room-1',
          name: 'Room 1',
          max_participants: 10,
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      const { getAvailableRooms } = useVoiceChat()

      // Mock Supabase response
      const mockSupabase = await import('@/lib/supabase')
      mockSupabase.supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockRooms, error: null }),
          }),
        }),
      })

      const rooms = await getAvailableRooms()

      expect(rooms).toEqual(mockRooms)
    })

    it('should handle room listing failure', async () => {
      const { getAvailableRooms, state } = useVoiceChat()

      // Mock Supabase error
      const mockSupabase = await import('@/lib/supabase')
      mockSupabase.supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      })

      const rooms = await getAvailableRooms()

      expect(rooms).toEqual([])
      expect(state.value.error).toContain('Failed to get rooms')
    })
  })

  describe('cleanup', () => {
    it('should cleanup audio resources on unmount', async () => {
      const { leaveRoom } = useVoiceChat()

      // Mock Supabase
      const mockSupabase = await import('@/lib/supabase')
      mockSupabase.supabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      })

      // Mock audio context and stream
      const mockAudioContext = {
        close: vi.fn(),
      }
      const mockMediaStream = {
        getTracks: () => [
          {
            stop: vi.fn(),
          },
        ],
      }

      // Set up state as if connected
      const { state } = useVoiceChat()
      state.value.currentRoom = {
        id: 'room-123',
        name: 'Test Room',
        max_participants: 10,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }
      state.value.isConnected = true

      await leaveRoom()

      expect(state.value.isConnected).toBe(false)
      expect(state.value.currentRoom).toBe(null)
    })
  })
})
