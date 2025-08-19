export interface ChatUser {
  id: string
  name: string
  role: 'student' | 'teacher' | string
}

export interface EmojiReaction {
  emoji: string
  userId: string
  username: string
  timestamp: number
}

export interface VoiceMessage {
  id: string
  user: ChatUser
  text?: string
  audioUrl?: string | null
  reactions: EmojiReaction[]
  timestamp: number // epoch ms
  isPlaying?: boolean
}

export interface ChatRoom {
  id: string
  name: string
  created_at: string
  updated_at: string
  max_participants: number
  is_active: boolean
}

export interface ChatState {
  user: ChatUser | null
  messages: VoiceMessage[]
  recording: boolean
  playbackSpeed: number
  activeMessageId?: string
  currentRoom: ChatRoom | null
  availableRooms: ChatRoom[]
  participants: ChatUser[]
  isConnected: boolean
  error: string | null
}
