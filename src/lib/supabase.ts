import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/config/env.config'

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseConfig()

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Validate Supabase connection
console.log('🔧 Supabase configuration loaded')
console.log('🌐 Supabase URL configured:', supabaseUrl ? 'Yes' : 'No')
console.log('🔑 Supabase Anon Key configured:', supabaseAnonKey ? 'Yes' : 'No')

// Test connection
supabase.auth
  .getSession()
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', error)
    } else {
      console.log('✅ Supabase connection test successful')
    }
  })
  .catch((error) => {
    console.error('❌ Supabase connection error:', error)
  })

export type Database = {
  public: {
    Tables: {
      voice_chat_rooms: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          max_participants: number
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
          max_participants?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
          max_participants?: number
          is_active?: boolean
        }
      }
      voice_chat_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          username: string
          joined_at: string
          is_speaking: boolean
          audio_level: number
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          username: string
          joined_at?: string
          is_speaking?: boolean
          audio_level?: number
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          username?: string
          joined_at?: string
          is_speaking?: boolean
          audio_level?: number
        }
      }
      voice_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string
          username: string
          text?: string
          audio_url?: string
          timestamp: string
          reactions: Record<string, unknown>
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          username: string
          text?: string
          audio_url?: string
          timestamp?: string
          reactions?: Record<string, unknown>
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          username?: string
          text?: string
          audio_url?: string
          timestamp?: string
          reactions?: Record<string, unknown>
        }
      }
    }
  }
}
