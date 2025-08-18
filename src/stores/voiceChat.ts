import { defineStore } from 'pinia'
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

let channel: BroadcastChannel | null = null

export const useVoiceChatStore = defineStore('voiceChat', {
  state: (): ChatState => ({
    user: null,
    messages: [],
    recording: false,
    playbackSpeed: getInitialSpeed(),
    activeMessageId: undefined,
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
    addMessage(
      partial: Omit<Partial<VoiceMessage>, 'id' | 'timestamp' | 'reactions'> & {
        text?: string
        audioUrl?: string
      },
    ) {
      const message: VoiceMessage = {
        id: uuid(),
        user: this.user ?? { id: 'anon', name: 'Anonymous', role: 'student' },
        text: partial.text,
        audioUrl: partial.audioUrl,
        reactions: [],
        timestamp: Date.now(),
        isPlaying: false,
      }
      this.messages.push(message)
      this._broadcast({ type: 'message', payload: message })
      return message
    },

    addReaction(messageId: string, emoji: string) {
      const message = this.messages.find((m) => m.id === messageId)
      if (message && this.user) {
        const reaction: EmojiReaction = {
          emoji,
          userId: this.user.id,
          userName: this.user.name,
          timestamp: Date.now(),
        }
        message.reactions.push(reaction)
        this._broadcast({ type: 'message', payload: message })
      }
    },

    removeReaction(messageId: string, emoji: string) {
      const message = this.messages.find((m) => m.id === messageId)
      if (message && this.user) {
        const index = message.reactions.findIndex(
          (r) => r.emoji === emoji && r.userId === this.user?.id,
        )
        if (index !== -1) {
          message.reactions.splice(index, 1)
          this._broadcast({ type: 'message', payload: message })
        }
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
        default:
          break
      }
    },
  },
})
