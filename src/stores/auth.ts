import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import type { Tables } from '../types/supabase'

export interface UserProfile extends Tables<'profiles'> {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'teacher' | 'student' | 'admin'
  created_at: string
  updated_at: string
}

// Session storage key
const SESSION_STORAGE_KEY = 'lingoquesto_auth_session'
const SESSION_EXPIRY_KEY = 'lingoquesto_auth_expiry'

// Helper functions for session persistence
const saveSessionToStorage = (session: Session) => {
  try {
    const expiry = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString())
  } catch (error) {
    console.warn('Failed to save session to localStorage:', error)
  }
}

const getSessionFromStorage = (): Session | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY)
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY)

    if (!sessionData || !expiry) return null

    const expiryTime = parseInt(expiry)
    if (Date.now() > expiryTime) {
      // Session expired, clean up
      clearSessionFromStorage()
      return null
    }

    return JSON.parse(sessionData)
  } catch (error) {
    console.warn('Failed to get session from localStorage:', error)
    return null
  }
}

const clearSessionFromStorage = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.removeItem(SESSION_EXPIRY_KEY)
  } catch (error) {
    console.warn('Failed to clear session from localStorage:', error)
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const isTeacher = computed(() => profile.value?.role === 'teacher')
  const isStudent = computed(() => profile.value?.role === 'student')
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const userRole = computed(() => profile.value?.role || 'student')
  const displayName = computed(() => profile.value?.full_name || user.value?.email || 'Usuario')

  // Actions
  const initializeAuth = async () => {
    try {
      loading.value = true
      error.value = null

      // Try to restore session from storage first
      const storedSession = getSessionFromStorage()
      if (storedSession) {
        console.log('🔄 Restoring session from storage')
        session.value = storedSession
        user.value = storedSession.user
        await fetchProfile()
        return
      }

      // Get initial session from Supabase
      const {
        data: { session: initialSession },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (initialSession) {
        session.value = initialSession
        user.value = initialSession.user
        await fetchProfile()
        // Save to storage
        saveSessionToStorage(initialSession)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error initializing auth'
      console.error('Auth initialization error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async () => {
    if (!user.value) return

    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (profileError) {
        // Profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          await createProfile()
        } else {
          throw profileError
        }
      } else {
        profile.value = data
        console.log('✅ Profile loaded successfully:', data)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching profile'
      console.error('Profile fetch error:', err)
      // Don't throw here, just log the error
    }
  }

  const createProfile = async () => {
    if (!user.value) return

    try {
      const newProfile: Omit<UserProfile, 'created_at' | 'updated_at'> = {
        id: user.value.id,
        email: user.value.email!,
        full_name: user.value.user_metadata?.full_name || null,
        avatar_url: user.value.user_metadata?.avatar_url || null,
        role: 'student', // Default role
      }

      const { data, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single()

      if (createError) throw createError

      profile.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error creating profile'
      console.error('Profile creation error:', err)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        user.value = data.user
        session.value = data.session
        if (data.session) {
          saveSessionToStorage(data.session)
        }
        await createProfile()
      }

      return { success: true, user: data.user }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error signing up'
      console.error('Sign up error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (data.user && data.session) {
        user.value = data.user
        session.value = data.session
        saveSessionToStorage(data.session)
        await fetchProfile()
      }

      return { success: true, user: data.user }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error signing in'
      console.error('Sign in error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (googleError) throw googleError

      return { success: true, data }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error signing in with Google'
      console.error('Google sign in error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      loading.value = true
      error.value = null

      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) throw signOutError

      // Clear local state and storage
      user.value = null
      session.value = null
      profile.value = null
      clearSessionFromStorage()

      // Redirect to login immediately
      window.location.href = '/auth/login'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error signing out'
      console.error('Sign out error:', err)
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (
    updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'role'>>,
  ) => {
    if (!user.value) return

    try {
      loading.value = true
      error.value = null

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.value.id)
        .select()
        .single()

      if (updateError) throw updateError

      profile.value = data
      return { success: true, profile: data }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error updating profile'
      console.error('Profile update error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    try {
      loading.value = true
      error.value = null

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) throw resetError

      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error resetting password'
      console.error('Password reset error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    session,
    profile,
    loading,
    error,

    // Computed
    isAuthenticated,
    isTeacher,
    isStudent,
    isAdmin,
    userRole,
    displayName,

    // Actions
    initializeAuth,
    fetchProfile,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    resetPassword,
    clearError,
  }
})
