export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'teacher' | 'student' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'teacher' | 'student' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'teacher' | 'student' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
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
          reactions: Json
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          username: string
          text?: string
          audio_url?: string
          timestamp?: string
          reactions?: Json
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          username?: string
          text?: string
          audio_url?: string
          timestamp?: string
          reactions?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
