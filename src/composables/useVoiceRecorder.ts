import { onUnmounted, ref, shallowRef, type Ref } from 'vue'
import { toast } from 'vue-sonner'

export interface UseVoiceRecorderOptions {
  minDurationSec?: number
  maxDurationSec?: number
  /** Average absolute amplitude threshold for silence detection */
  silenceThreshold?: number
  mimeCandidates?: string[]
}

export interface UseVoiceRecorderResult {
  isRecording: Readonly<Ref<boolean>>
  durationSec: Readonly<Ref<number>>
  audioUrl: Readonly<Ref<string | null>>
  error: Readonly<Ref<string | null>>
  start: () => Promise<void>
  stop: () => Promise<Blob | null>
  reset: () => void
}

export function useVoiceRecorder(options: UseVoiceRecorderOptions = {}): UseVoiceRecorderResult {
  const { 
    minDurationSec = 1.0,
    maxDurationSec = 30,
    silenceThreshold = 0.001,
    mimeCandidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4;codecs=mp4a.40.2', // Safari fallback
    ] 
  } = options

  const isRecording = ref(false)
  const durationSec = ref(0)
  const audioUrl = ref<string | null>(null)
  const error = ref<string | null>(null)

  const mediaRecorder = shallowRef<MediaRecorder | null>(null)
  const chunks = shallowRef<BlobPart[]>([])
  const stream = shallowRef<MediaStream | null>(null)
  let tickTimer: number | null = null
  let startedAt = 0

  function pickMimeType(): string | undefined {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return undefined
    const ctor = MediaRecorder as unknown as { isTypeSupported?: (type: string) => boolean }
    const isSupported = (type: string) => typeof ctor.isTypeSupported === 'function' ? !!ctor.isTypeSupported(type) : false
    for (const t of mimeCandidates) {
      try {
        if (isSupported(t)) return t
      } catch {}
    }
    return undefined
  }

  async function start() {
    if (isRecording.value) return
    error.value = null

    try {
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.value = ms
      const mimeType = pickMimeType()
      const mr = new MediaRecorder(ms, mimeType ? { mimeType } : undefined)
      mediaRecorder.value = mr
      chunks.value = []

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) chunks.value.push(e.data)
      }
      mr.onstop = () => {
        // no-op, handled in stop()
      }

      mr.start()
      startedAt = Date.now()
      isRecording.value = true
      durationSec.value = 0

      tickTimer = window.setInterval(() => {
        durationSec.value = (Date.now() - startedAt) / 1000
        if (durationSec.value >= maxDurationSec) {
          // auto-stop when reaching max duration
          void stop()
        }
      }, 100)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to start recording'
      toast.error('Error accessing microphone')
      cleanup()
    }
  }

  async function stop(): Promise<Blob | null> {
    if (!isRecording.value || !mediaRecorder.value) return null

    return new Promise<Blob | null>((resolve) => {
      const mr = mediaRecorder.value!

      const finalize = async () => {
        clearTick()
        isRecording.value = false

        const blob = new Blob(chunks.value, { type: mr.mimeType || 'audio/webm' })
        const dur = (Date.now() - startedAt) / 1000
        if (dur < minDurationSec) {
          error.value = `Recording too short. Min ${minDurationSec}s.`
          toast.error(`Recording too short. Min ${minDurationSec}s.`)
          URL.revokeObjectURL(audioUrl.value || '')
          audioUrl.value = null
          cleanupStream()
          resolve(null)
          return
        }

        // Validate audio amplitude (silence detection)
        try {
          const valid = await validateAudio(blob, silenceThreshold)
          if (!valid) {
            error.value = 'Recording is too quiet or empty. Please try again.'
            toast.error('Recording is too quiet or empty. Please try again.')
            URL.revokeObjectURL(audioUrl.value || '')
            audioUrl.value = null
            cleanupStream()
            resolve(null)
            return
          }
        } catch (err) {
          // If validation step fails unexpectedly, mark as invalid to be safe
          error.value = 'Failed to validate audio.'
          toast.error('Failed to validate audio.')
          URL.revokeObjectURL(audioUrl.value || '')
          audioUrl.value = null
          cleanupStream()
          resolve(null)
          return
        }

        try {
          URL.revokeObjectURL(audioUrl.value || '')
        } catch {}
        audioUrl.value = URL.createObjectURL(blob)
        cleanupStream()
        resolve(blob)
      }

      if (mr.state !== 'inactive') {
        mr.onstop = finalize
        try { mr.stop() } catch { finalize() }
      } else {
        finalize()
      }
    })
  }

  function reset() {
    clearTick()
    isRecording.value = false
    durationSec.value = 0
    error.value = null
    chunks.value = []
    try {
      URL.revokeObjectURL(audioUrl.value || '')
    } catch {}
    audioUrl.value = null
    cleanupStream()
  }

  function cleanupStream() {
    mediaRecorder.value = null
    if (stream.value) {
      stream.value.getTracks().forEach(t => t.stop())
      stream.value = null
    }
  }

  function clearTick() {
    if (tickTimer != null) {
      clearInterval(tickTimer)
      tickTimer = null
    }
  }

  function cleanup() {
    clearTick()
    cleanupStream()
  }

  async function validateAudio(audioBlob: Blob, threshold: number): Promise<boolean> {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      type AudioContextCtor = new () => AudioContext
      const Ctor: AudioContextCtor | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext
      if (!Ctor) {
        console.error('AudioContext is not supported in this environment')
        return false
      }
      const audioContext: AudioContext = new Ctor()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const channelData = audioBuffer.getChannelData(0)
      let sum = 0
      for (let i = 0; i < channelData.length; i++) {
        sum += Math.abs(channelData[i])
      }
      const average = sum / channelData.length
      await audioContext.close()
      return average > threshold
    } catch (err) {
      // surface error to console but treat as failure to be safe
      console.error('Error validating audio:', err)
      return false
    }
  }

  onUnmounted(() => cleanup())

  return { isRecording, durationSec, audioUrl, error, start, stop, reset }
}
