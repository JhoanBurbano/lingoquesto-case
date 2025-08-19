/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_VOICE_CHAT_MAX_PARTICIPANTS?: string
  readonly VITE_VOICE_CHAT_DEFAULT_LANGUAGE?: string
  readonly VITE_VOICE_CHAT_AUDIO_QUALITY?: string
  readonly VITE_DEV_MODE?: string
  readonly VITE_ENABLE_LOGGING?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
