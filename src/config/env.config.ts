import { VOICE_CHAT_CONFIG } from './voice-chat.config'

/**
 * Environment Configuration for Voice Chat
 * Validates and provides access to environment variables
 */

export interface EnvConfig {
  supabase: {
    url: string
    anonKey: string
  }
  voiceChat: {
    maxParticipants: number
    defaultLanguage: string
    audioQuality: string
  }
  development: {
    devMode: boolean
    enableLogging: boolean
  }
}

/**
 * Validates required environment variables
 * @throws Error if required variables are missing
 */
function validateEnvVars(): void {
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']

  const missingVars = requiredVars.filter((varName) => !import.meta.env[varName])

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.',
    )
  }
}

/**
 * Parses and validates environment variables
 */
function parseEnvVars(): EnvConfig {
  validateEnvVars()

  return {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    voiceChat: {
      maxParticipants: parseInt(import.meta.env.VITE_VOICE_CHAT_MAX_PARTICIPANTS || '20', 10),
      defaultLanguage: import.meta.env.VITE_VOICE_CHAT_DEFAULT_LANGUAGE || 'en',
      audioQuality: import.meta.env.VITE_VOICE_CHAT_AUDIO_QUALITY || 'high',
    },
    development: {
      devMode: import.meta.env.VITE_DEV_MODE === 'true',
      enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
    },
  }
}

/**
 * Environment configuration instance
 */
export const envConfig = parseEnvVars()

/**
 * Helper function to check if running in development mode
 */
export const isDevelopment = (): boolean => envConfig.development.devMode

/**
 * Helper function to check if logging is enabled
 */
export const isLoggingEnabled = (): boolean => envConfig.development.enableLogging

/**
 * Helper function to get Supabase configuration
 */
export const getSupabaseConfig = () => ({
  url: envConfig.supabase.url,
  anonKey: envConfig.supabase.anonKey,
})

/**
 * Helper function to get voice chat configuration
 */
export const getVoiceChatConfig = () => ({
  ...VOICE_CHAT_CONFIG,
  room: {
    ...VOICE_CHAT_CONFIG.room,
    maxParticipants: envConfig.voiceChat.maxParticipants,
  },
  defaultLanguage: envConfig.voiceChat.defaultLanguage,
  audioQuality: envConfig.voiceChat.audioQuality,
})

/**
 * Logs environment configuration (only in development)
 */
export const logEnvConfig = (): void => {
  if (isDevelopment() && isLoggingEnabled()) {
    console.group('🔧 Environment Configuration')
    console.log('Supabase URL:', envConfig.supabase.url)
    console.log('Supabase Anon Key:', envConfig.supabase.anonKey ? '***' : 'MISSING')
    console.log('Voice Chat Max Participants:', envConfig.voiceChat.maxParticipants)
    console.log('Default Language:', envConfig.voiceChat.defaultLanguage)
    console.log('Audio Quality:', envConfig.voiceChat.audioQuality)
    console.log('Development Mode:', envConfig.development.devMode)
    console.log('Logging Enabled:', envConfig.development.enableLogging)
    console.groupEnd()
  }
}

// Auto-log configuration in development
if (isDevelopment()) {
  logEnvConfig()
}

// Validate Supabase configuration on startup
console.log('🔍 Validating Supabase configuration...')
try {
  const supabaseConfig = getSupabaseConfig()
  if (supabaseConfig.url && supabaseConfig.anonKey) {
    console.log('✅ Supabase configuration validated successfully')
    console.log('🌐 URL format:', supabaseConfig.url.includes('supabase.co') ? 'Valid' : 'Invalid')
    console.log('🔑 Key format:', supabaseConfig.anonKey.startsWith('eyJ') ? 'Valid' : 'Invalid')
  } else {
    console.error('❌ Supabase configuration incomplete')
  }
} catch (error) {
  console.error('❌ Supabase configuration validation failed:', error)
}
