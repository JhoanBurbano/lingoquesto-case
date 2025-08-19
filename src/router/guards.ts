import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export interface RouteMeta {
  requiresAuth?: boolean
  allowedRoles?: ('teacher' | 'student' | 'admin')[]
  title?: string
  sectionName?: string
}

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()

  // Wait for auth to initialize
  if (authStore.loading) {
    await authStore.initializeAuth()
  }

  const meta = to.meta as RouteMeta

  // Routes that don't require authentication
  const publicRoutes = [
    '/support',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/callback',
    '/auth/reset-password',
  ]

  if (publicRoutes.includes(to.path)) {
    // If user is already authenticated and trying to access auth pages, redirect to dashboard
    if (authStore.isAuthenticated && to.path.startsWith('/auth/')) {
      next('/dashboard')
      return
    }
    next()
    return
  }

  // Check if authentication is required
  if (meta.requiresAuth !== false) {
    if (!authStore.isAuthenticated) {
      // Redirect to login with return URL
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // Check role-based access
    if (meta.allowedRoles && meta.allowedRoles.length > 0) {
      const userRole = authStore.userRole
      if (!meta.allowedRoles.includes(userRole)) {
        // User doesn't have required role, redirect to dashboard
        next('/dashboard')
        return
      }
    }
  }

  next()
}

export const teacherOnlyGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()

  if (!authStore.isTeacher) {
    next('/dashboard')
    return
  }

  next()
}

export const studentOnlyGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()

  if (!authStore.isStudent) {
    next('/dashboard')
    return
  }

  next()
}

export const adminOnlyGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()

  if (!authStore.isAdmin) {
    next('/dashboard')
    return
  }

  next()
}
