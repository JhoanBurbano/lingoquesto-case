/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import VoiceChatRoom from '../../components/VoiceChat/VoiceChatRoom.vue'

// Mock the useVoiceChat composable
vi.mock('@/composables/useVoiceChat', () => ({
  useVoiceChat: vi.fn(),
}))

describe('VoiceChatRoom', () => {
  let pinia: ReturnType<typeof createPinia>
  let mockUseVoiceChat: {
    state: { value: any }
    participantCount: { value: number }
    isRoomFull: { value: boolean }
    createRoom: ReturnType<typeof vi.fn>
    joinRoom: ReturnType<typeof vi.fn>
    leaveRoom: ReturnType<typeof vi.fn>
    getAvailableRooms: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    // Reset mocks
    vi.clearAllMocks()

    // Mock useVoiceChat
    mockUseVoiceChat = {
      state: {
        value: {
          isConnected: false,
          isSpeaking: false,
          audioLevel: 0,
          participants: [],
          currentRoom: null,
          error: null,
        },
      },
      participantCount: { value: 0 },
      isRoomFull: { value: false },
      createRoom: vi.fn(),
      joinRoom: vi.fn(),
      leaveRoom: vi.fn(),
      getAvailableRooms: vi.fn(),
    }

    vi.mocked(vi.importMock('@/composables/useVoiceChat')).useVoiceChat.mockReturnValue(
      mockUseVoiceChat,
    )
  })

  describe('rendering', () => {
    it('should render correctly with default state', () => {
      const wrapper = mount(VoiceChatRoom)

      expect(wrapper.find('.voice-chat-room').exists()).toBe(true)
      expect(wrapper.find('h2').text()).toBe('Voice Chat')
      expect(wrapper.find('.participants-count').text()).toBe('0/10 participants')
      expect(wrapper.find('.connection-status').text()).toBe('Disconnected')
      expect(wrapper.find('.btn-primary').text()).toBe('Join Room')
    })

    it('should render room name when connected', () => {
      mockUseVoiceChat.state.value.currentRoom = {
        id: 'room-123',
        name: 'Test Room',
        max_participants: 15,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      const wrapper = mount(VoiceChatRoom)

      expect(wrapper.find('h2').text()).toBe('Test Room')
      expect(wrapper.find('.participants-count').text()).toBe('0/15 participants')
    })

    it('should render participants correctly', () => {
      mockUseVoiceChat.state.value.participants = [
        {
          id: 'user-1',
          room_id: 'room-123',
          user_id: 'user-1',
          username: 'Alice',
          joined_at: '2024-01-01T00:00:00Z',
          is_speaking: true,
          audio_level: 0.8,
        },
        {
          id: 'user-2',
          room_id: 'room-123',
          user_id: 'user-2',
          username: 'Bob',
          joined_at: '2024-01-01T00:00:00Z',
          is_speaking: false,
          audio_level: 0.3,
        },
      ]

      const wrapper = mount(VoiceChatRoom)
      const participantCards = wrapper.findAll('.participant-card')

      expect(participantCards).toHaveLength(2)
      expect(participantCards[0].find('.participant-name').text()).toBe('Alice')
      expect(participantCards[1].find('.participant-name').text()).toBe('Bob')
      expect(participantCards[0].classes()).toContain('speaking')
      expect(participantCards[1].classes()).not.toContain('speaking')
    })

    it('should render error message when error exists', () => {
      mockUseVoiceChat.state.value.error = 'Connection failed'

      const wrapper = mount(VoiceChatRoom)

      expect(wrapper.find('.error-message').exists()).toBe(true)
      expect(wrapper.find('.error-message p').text()).toBe('Connection failed')
    })
  })

  describe('connection state', () => {
    it('should show connected state when connected', () => {
      mockUseVoiceChat.state.value.isConnected = true

      const wrapper = mount(VoiceChatRoom)

      expect(wrapper.find('.connection-status').text()).toBe('Connected')
      expect(wrapper.find('.connection-status').classes()).toContain('connected')
      expect(wrapper.find('.btn-danger').text()).toBe('Leave Room')
    })

    it('should show speaking indicator when user is speaking', () => {
      mockUseVoiceChat.state.value.isSpeaking = true
      mockUseVoiceChat.state.value.audioLevel = 0.7

      const wrapper = mount(VoiceChatRoom)

      expect(wrapper.find('.mic-indicator').classes()).toContain('active')
      expect(wrapper.find('.microphone-status span').text()).toBe('Speaking')
    })
  })

  describe('room modal', () => {
    it('should show room selection modal when join button is clicked', async () => {
      const wrapper = mount(VoiceChatRoom)

      await wrapper.find('.btn-primary').trigger('click')

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
      expect(wrapper.find('.modal-title').text()).toBe('Select or Create Room')
    })

    it('should close modal when overlay is clicked', async () => {
      const wrapper = mount(VoiceChatRoom)

      // Open modal
      await wrapper.find('.btn-primary').trigger('click')
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)

      // Click overlay
      await wrapper.find('.modal-overlay').trigger('click')
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('should not close modal when modal content is clicked', async () => {
      const wrapper = mount(VoiceChatRoom)

      // Open modal
      await wrapper.find('.btn-primary').trigger('click')
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)

      // Click modal content
      await wrapper.find('.modal-content').trigger('click')
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    })
  })

  describe('room creation', () => {
    it('should create new room when form is submitted', async () => {
      const mockCreateRoom = vi.fn().mockResolvedValue('room-123')
      mockUseVoiceChat.createRoom = mockCreateRoom

      const wrapper = mount(VoiceChatRoom)

      // Open modal
      await wrapper.find('.btn-primary').trigger('click')

      // Fill form
      await wrapper.find('input[placeholder="Room name"]').setValue('New Room')
      await wrapper.find('input[placeholder="Max participants"]').setValue('15')

      // Submit form
      await wrapper.find('form').trigger('submit')

      expect(mockCreateRoom).toHaveBeenCalledWith('New Room', 15)
    })

    it('should validate required fields', async () => {
      const wrapper = mount(VoiceChatRoom)

      // Open modal
      await wrapper.find('.btn-primary').trigger('click')

      // Try to submit without filling required fields
      const form = wrapper.find('form')
      expect(form.element.checkValidity()).toBe(false)
    })
  })

  describe('room joining', () => {
    it('should join existing room when clicked', async () => {
      const mockJoinRoom = vi.fn().mockResolvedValue(true)
      mockUseVoiceChat.joinRoom = mockJoinRoom

      const mockRooms = [
        {
          id: 'room-1',
          name: 'Existing Room',
          max_participants: 10,
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      mockUseVoiceChat.getAvailableRooms = vi.fn().mockResolvedValue(mockRooms)

      const wrapper = mount(VoiceChatRoom)

      // Open modal
      await wrapper.find('.btn-primary').trigger('click')

      // Wait for rooms to load
      await wrapper.vm.$nextTick()

      // Click on room
      await wrapper.find('.room-item').trigger('click')

      expect(mockJoinRoom).toHaveBeenCalledWith('room-1')
    })
  })

  describe('room leaving', () => {
    it('should leave room when leave button is clicked', async () => {
      const mockLeaveRoom = vi.fn()
      mockUseVoiceChat.leaveRoom = mockLeaveRoom
      mockUseVoiceChat.state.value.isConnected = true

      const wrapper = mount(VoiceChatRoom)

      await wrapper.find('.btn-danger').trigger('click')

      expect(mockLeaveRoom).toHaveBeenCalled()
    })
  })

  describe('audio level display', () => {
    it('should display audio level bars for participants', () => {
      mockUseVoiceChat.state.value.participants = [
        {
          id: 'user-1',
          room_id: 'room-123',
          user_id: 'user-1',
          username: 'Alice',
          joined_at: '2024-01-01T00:00:00Z',
          is_speaking: true,
          audio_level: 0.8,
        },
      ]

      const wrapper = mount(VoiceChatRoom)
      const audioLevelFill = wrapper.find('.audio-level-fill')

      expect(audioLevelFill.exists()).toBe(true)
      expect(audioLevelFill.attributes('style')).toContain('width: 80%')
    })

    it('should display user audio level', () => {
      mockUseVoiceChat.state.value.audioLevel = 0.6

      const wrapper = mount(VoiceChatRoom)
      const levelFill = wrapper.find('.level-fill')

      expect(levelFill.exists()).toBe(true)
      expect(levelFill.attributes('style')).toContain('width: 60%')
    })
  })

  describe('accessibility', () => {
    it('should have proper button states', () => {
      const wrapper = mount(VoiceChatRoom)

      const joinButton = wrapper.find('.btn-primary')
      expect(joinButton.attributes('disabled')).toBeUndefined()

      // Test disabled state when room is full
      mockUseVoiceChat.isRoomFull.value = true
      const wrapperFull = mount(VoiceChatRoom)
      const joinButtonDisabled = wrapperFull.find('.btn-primary')
      expect(joinButtonDisabled.attributes('disabled')).toBeDefined()
    })

    it('should have proper form labels and placeholders', () => {
      const wrapper = mount(VoiceChatRoom)

      // Open modal
      wrapper.find('.btn-primary').trigger('click')

      const nameInput = wrapper.find('input[placeholder="Room name"]')
      const participantsInput = wrapper.find('input[placeholder="Max participants"]')

      expect(nameInput.exists()).toBe(true)
      expect(participantsInput.exists()).toBe(true)
      expect(nameInput.attributes('required')).toBeDefined()
      expect(participantsInput.attributes('required')).toBeDefined()
    })
  })
})
