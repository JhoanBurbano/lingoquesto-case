import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authGuard } from './guards'

const TeacherDashboard = () => import('../views/TeacherDashboard.vue')
const SlidesView = () => import('../views/Slides.vue')
const CaseStudyView = () => import('../views/CaseStudyView.vue')
const OralPractice = () => import('../views/OralPractice.vue')
const ComingSoon = () => import('../views/ComingSoon.vue')
const HeroBanner = () => import('../views/HeroBanner.vue')
const Achievements = () => import('../views/Achievements.vue')
const ResponsiveTest = () => import('../views/ResponsiveTest.vue')
const VoiceChatView = () => import('../views/VoiceChatView.vue')

// Auth views
const LoginView = () => import('../views/auth/LoginView.vue')
const RegisterView = () => import('../views/auth/RegisterView.vue')
const ForgotPasswordView = () => import('../views/auth/ForgotPasswordView.vue')
const ResetPasswordView = () => import('../views/auth/ResetPasswordView.vue')
const AuthCallbackView = () => import('../views/auth/AuthCallbackView.vue')

const routes: RouteRecordRaw[] = [
  // Public routes
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/welcome',
    component: HeroBanner,
    meta: {
      title: 'Bienvenida',
      requiresAuth: false,
    },
  },
  {
    path: '/support',
    component: () => import('../views/SupportContact.vue'),
    meta: {
      title: 'Soporte',
      requiresAuth: false,
    },
  },

  // Auth routes
  {
    path: '/auth/login',
    component: LoginView,
    meta: {
      title: 'Iniciar Sesión',
      requiresAuth: false,
    },
  },
  {
    path: '/auth/register',
    component: RegisterView,
    meta: {
      title: 'Registrarse',
      requiresAuth: false,
    },
  },
  {
    path: '/auth/forgot-password',
    component: ForgotPasswordView,
    meta: {
      title: 'Recuperar Contraseña',
      requiresAuth: false,
    },
  },
  {
    path: '/auth/reset-password',
    component: ResetPasswordView,
    meta: {
      title: 'Restablecer Contraseña',
      requiresAuth: false,
    },
  },
  {
    path: '/auth/callback',
    component: AuthCallbackView,
    meta: {
      title: 'Autenticando...',
      requiresAuth: false,
    },
  },

  // Protected routes - require authentication
  {
    path: '/dashboard',
    component: TeacherDashboard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
    },
  },
  {
    path: '/slides',
    component: SlidesView,
    meta: {
      title: 'Slides',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
    },
  },
  {
    path: '/achievements',
    component: Achievements,
    meta: {
      title: 'Logros',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
    },
  },
  {
    path: '/students',
    component: ComingSoon,
    meta: {
      title: 'Gestión de Estudiantes',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
      sectionName: 'Gestión de Estudiantes',
      description:
        'Un sistema completo para administrar la información de tus estudiantes, su progreso y actividades de manera eficiente.',
    },
  },
  {
    path: '/activities',
    component: ComingSoon,
    meta: {
      title: 'Biblioteca de Actividades',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
      sectionName: 'Biblioteca de Actividades',
      description:
        'Crea, organiza y asigna actividades personalizadas para potenciar el aprendizaje de tus estudiantes.',
    },
  },
  {
    path: '/reports',
    component: ComingSoon,
    meta: {
      title: 'Reportes Avanzados',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
      sectionName: 'Reportes Avanzados',
      description:
        'Genera reportes detallados sobre el progreso, participación y rendimiento de tus estudiantes.',
    },
  },
  {
    path: '/progress',
    component: ComingSoon,
    meta: {
      title: 'Seguimiento de Progreso',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
      sectionName: 'Seguimiento de Progreso',
      description: 'Monitorea el avance individual y grupal con análisis y visualizaciones.',
    },
  },
  {
    path: '/calendar',
    component: ComingSoon,
    meta: {
      title: 'Calendario Académico',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
      sectionName: 'Calendario Académico',
      description: 'Organiza clases, tareas y eventos importantes en un calendario inteligente.',
    },
  },
  {
    path: '/notifications',
    component: ComingSoon,
    meta: {
      title: 'Centro de Notificaciones',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
      sectionName: 'Centro de Notificaciones',
      description: 'Mantente al día con actividades, mensajes y actualizaciones.',
    },
  },
  {
    path: '/settings',
    component: ComingSoon,
    meta: {
      title: 'Configuración Avanzada',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
      sectionName: 'Configuración Avanzada',
      description: 'Personaliza tu experiencia con opciones detalladas del sistema.',
    },
  },
  {
    path: '/oral-practice',
    component: OralPractice,
    meta: {
      title: 'Práctica Oral',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
    },
  },
  {
    path: '/case-study',
    component: CaseStudyView,
    meta: {
      title: 'Case Study',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
    },
  },
  {
    path: '/responsive-test',
    component: ResponsiveTest,
    meta: {
      title: 'Responsive Test',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
    },
  },
  {
    path: '/voice-chat',
    component: VoiceChatView,
    meta: {
      title: 'Voice Chat',
      requiresAuth: true,
      allowedRoles: ['teacher', 'student', 'admin'],
    },
  },

  // Catch all route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Apply authentication guard to all routes
router.beforeEach(authGuard)

router.afterEach((to) => {
  document.title = (to.meta?.title as string) || (to.meta?.sectionName as string) || 'LingoQuesto'
})

export default router
