// Compatibility wrapper around the canonical Pinia store in '@/stores/voiceChat'
import { ref } from 'vue'
import { useVoiceChatStore as _useVoiceChatStore } from '@/stores/voiceChat'

export const useVoiceChatStore = _useVoiceChatStore

// Local-only compatibility state not present in the canonical store
const _recordingDuration = ref(0)

// Legacy type exported for components that still rely on the old shape
export type VoiceMessage = {
  id: string
  sender: string
  audioBlob: Blob
  duration: number
  timestamp: Date
  isPlaying?: boolean
}

// State getters compatible with previous React context consumers
export const voiceChatState = {
  get messages() {
    return useVoiceChatStore().messages
  },
  get currentUser() {
    const s = useVoiceChatStore()
    return s.user
      ? { nickname: s.user.name, isLoggedIn: true }
      : { nickname: '', isLoggedIn: false }
  },
  get isRecording() {
    const s = useVoiceChatStore()
    return s.recording
  },
  get recordingDuration() {
    return _recordingDuration
  },
  get playbackSpeed() {
    return useVoiceChatStore().playbackSpeed
  },
}

// Action shims mapping to the canonical store API
export const voiceChatActions = {
  login: (nickname: string) => {
    const s = useVoiceChatStore()
    s.login({ id: nickname, name: nickname, role: 'student' })
  },
  logout: () => useVoiceChatStore().logout(),
  addMessage: (payload: VoiceMessage | { audioUrl?: string; text?: string }) => {
    const s = useVoiceChatStore()
    // Accept both legacy VoiceMessage (with audioBlob) and new partial payloads
    if ('audioBlob' in payload && payload.audioBlob instanceof Blob) {
      const url = URL.createObjectURL(payload.audioBlob)
      s.addMessage({ audioUrl: url })
    } else {
      const { audioUrl, text } = payload as { audioUrl?: string; text?: string }
      s.addMessage({ audioUrl, text })
    }
  },
  startRecording: () => {
    const s = useVoiceChatStore()
    _recordingDuration.value = 0
    s.startRecording()
  },
  stopRecording: () => {
    const s = useVoiceChatStore()
    _recordingDuration.value = 0
    s.stopRecording()
  },
  stopAllMessages: () => useVoiceChatStore().stopAllMessages(),
  updateRecordingDuration: (n: number) => {
    _recordingDuration.value = n
  },
  setPlaybackSpeed: (payload: number) => useVoiceChatStore().setPlaybackSpeed(payload),
  setMessagePlaying: (payload: { id: string; isPlaying: boolean }) => {
    const s = useVoiceChatStore()
    if (payload.isPlaying) s.startPlaying(payload.id)
    else s.stopPlaying()
  },
}
