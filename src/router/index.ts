import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const TeacherDashboard = () => import('../views/TeacherDashboard.vue')
const SlidesView = () => import('../views/Slides.vue')
const CaseStudyView = () => import('../views/CaseStudyView.vue')
const OralPractice = () => import('../views/OralPractice.vue')
const ComingSoon = () => import('../views/ComingSoon.vue')
const HeroBanner = () => import('../views/HeroBanner.vue')
const Achievements = () => import('../views/Achievements.vue')
const ResponsiveTest = () => import('../views/ResponsiveTest.vue')
const VoiceChatView = () => import('../views/VoiceChatView.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/welcome' },
  { path: '/welcome', component: HeroBanner, meta: { title: 'Bienvenida' } },
  { path: '/dashboard', component: TeacherDashboard, meta: { title: 'Dashboard' } },
  { path: '/slides', component: SlidesView, meta: { title: 'Slides' } },
  { path: '/achievements', component: Achievements, meta: { title: 'Logros' } },
  {
    path: '/students',
    component: ComingSoon,
    meta: {
      sectionName: 'Gestión de Estudiantes',
      description:
        'Un sistema completo para administrar la información de tus estudiantes, su progreso y actividades de manera eficiente.',
    },
  },
  {
    path: '/activities',
    component: ComingSoon,
    meta: {
      sectionName: 'Biblioteca de Actividades',
      description:
        'Crea, organiza y asigna actividades personalizadas para potenciar el aprendizaje de tus estudiantes.',
    },
  },
  {
    path: '/reports',
    component: ComingSoon,
    meta: {
      sectionName: 'Reportes Avanzados',
      description:
        'Genera reportes detallados sobre el progreso, participación y rendimiento de tus estudiantes.',
    },
  },
  {
    path: '/progress',
    component: ComingSoon,
    meta: {
      sectionName: 'Seguimiento de Progreso',
      description: 'Monitorea el avance individual y grupal con análisis y visualizaciones.',
    },
  },
  {
    path: '/calendar',
    component: ComingSoon,
    meta: {
      sectionName: 'Calendario Académico',
      description: 'Organiza clases, tareas y eventos importantes en un calendario inteligente.',
    },
  },
  {
    path: '/notifications',
    component: ComingSoon,
    meta: {
      sectionName: 'Centro de Notificaciones',
      description: 'Mantente al día con actividades, mensajes y actualizaciones.',
    },
  },
  {
    path: '/settings',
    component: ComingSoon,
    meta: {
      sectionName: 'Configuración Avanzada',
      description: 'Personaliza tu experiencia con opciones detalladas del sistema.',
    },
  },
  { path: '/oral-practice', component: OralPractice, meta: { title: 'Práctica Oral' } },
  {
    path: '/support',
    component: () => import('../views/SupportContact.vue'),
    meta: { title: 'Soporte' },
  },
  { path: '/case-study', component: CaseStudyView, meta: { title: 'Case Study' } },
  { path: '/responsive-test', component: ResponsiveTest, meta: { title: 'Responsive Test' } },
  { path: '/voice-chat', component: VoiceChatView, meta: { title: 'Voice Chat' } },
]

const router = createRouter({ history: createWebHistory(), routes })

router.afterEach((to) => {
  document.title = (to.meta?.title as string) || (to.meta?.sectionName as string) || 'LingoQuesto'
})

export default router
