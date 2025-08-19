import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export interface RouteMeta {
  requiresAuth?: boolean
  allowedRoles?: ('teacher' | 'student' | 'admin')[]
}

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()

  // Wait for auth store to initialize
  if (authStore.loading) {
    await new Promise<void>((resolve) => {
      const unwatch = authStore.$subscribe((mutation, state) => {
        if (!state.loading) {
          unwatch()
          resolve()
        }
      })
    })
  }

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/welcome',
    '/support',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/callback',
  ]

  // Check if the target route is public
  const isPublicRoute = publicRoutes.includes(to.path)

  // Check if user is authenticated
  const isAuthenticated = authStore.isAuthenticated

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && to.path.startsWith('/auth/')) {
    console.log('🔄 Authenticated user accessing auth page, redirecting to dashboard')
    next('/dashboard')
    return
  }

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    console.log('🔒 Unauthenticated user accessing protected route, redirecting to login')
    // Store the intended destination for after login
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // If user is authenticated and accessing protected route, check roles
  if (isAuthenticated && to.meta.requiresAuth) {
    const allowedRoles = to.meta.allowedRoles as string[] | undefined

    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = authStore.userRole

      if (!allowedRoles.includes(userRole)) {
        console.log(
          `🚫 User role '${userRole}' not allowed for route '${to.path}', redirecting to dashboard`,
        )
        next('/dashboard')
        return
      }
    }
  }

  // Allow navigation
  console.log('✅ Navigation allowed:', to.path)
  next()
}

// Specific guards for single role checks
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
