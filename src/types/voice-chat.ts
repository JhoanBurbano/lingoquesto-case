export interface ChatUser {
  id: string
  name: string
  role: 'student' | 'teacher' | string
}

export interface EmojiReaction {
  emoji: string
  userId: string
  userName: string
  timestamp: number
}

export interface VoiceMessage {
  id: string
  user: ChatUser
  text?: string
  audioUrl?: string
  reactions: EmojiReaction[]
  timestamp: number // epoch ms
  isPlaying?: boolean
}

export interface ChatState {
  user: ChatUser | null
  messages: VoiceMessage[]
  recording: boolean
  playbackSpeed: number
  activeMessageId?: string
}
