import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TeacherDashboard from '../views/TeacherDashboard.vue'

// Mock de los componentes
vi.mock('../components/atoms/Button.vue', () => ({
  default: {
    name: 'Button',
    template: '<button><slot /></button>',
  },
}))

vi.mock('../components/atoms/LingoLogo.vue', () => ({
  default: {
    name: 'LingoLogo',
    template: '<div class="lingo-logo"><slot /></div>',
  },
}))

vi.mock('../components/atoms/LingoCharacter.vue', () => ({
  default: {
    name: 'LingoCharacter',
    template: '<div class="lingo-character"><slot /></div>',
  },
}))

vi.mock('../components/atoms/DecorativePattern.vue', () => ({
  default: {
    name: 'DecorativePattern',
    template: '<div class="decorative-pattern"><slot /></div>',
  },
}))

vi.mock('../components/molecules/GradientButton.vue', () => ({
  default: {
    name: 'GradientButton',
    template: '<button class="gradient-button"><slot /></button>',
  },
}))

vi.mock('../components/MetricCard.vue', () => ({
  default: {
    name: 'MetricCard',
    template: '<div class="metric-card"><slot /></div>',
  },
}))

vi.mock('./StudentsFilters.vue', () => ({
  default: {
    name: 'StudentsFilters',
    template: '<div class="students-filters"><slot /></div>',
  },
}))

vi.mock('./StudentsViews.vue', () => ({
  default: {
    name: 'StudentsViews',
    template: '<div class="students-views"><slot /></div>',
  },
}))

vi.mock('./StudentDetailView.vue', () => ({
  default: {
    name: 'StudentDetailView',
    template: '<div class="student-detail-view"><slot /></div>',
  },
}))

// Mock de los datos
vi.mock('../data/students', () => ({
  STUDENTS_DATA: [
    {
      id: '1',
      name: 'Test Student 1',
      email: 'test1@example.com',
      level: 'A1',
      oralPracticeHours: 10,
      fluencyScore: 75,
      pronunciationScore: 70,
      activitiesCompleted: 8,
      totalActivities: 10,
      lastActiveDate: '1 hora',
      streak: 5,
      weeklyGoal: 5,
      joinDate: '2024-01-01',
      recentSessions: [],
      strengths: [],
      improvements: [],
      pronunciationDetails: [],
      voiceRecordings: [],
    },
    {
      id: '2',
      name: 'Test Student 2',
      email: 'test2@example.com',
      level: 'B1',
      oralPracticeHours: 20,
      fluencyScore: 85,
      pronunciationScore: 80,
      activitiesCompleted: 15,
      totalActivities: 18,
      lastActiveDate: '2 horas',
      streak: 10,
      weeklyGoal: 8,
      joinDate: '2024-01-01',
      recentSessions: [],
      strengths: [],
      improvements: [],
      pronunciationDetails: [],
      voiceRecordings: [],
    },
  ],
  calculateOverallMetrics: () => ({
    totalStudents: 2,
    activeStudents: 2,
    avgOralPractice: 15,
    avgFluencyScore: 80,
    avgPronunciationScore: 75,
    activityRate: 100,
    progressDistribution: {
      excellent: 1,
      good: 1,
      needsAttention: 0,
    },
  }),
}))

// Mock de las utilidades
vi.mock('@/utils/studentsTools', () => ({
  filterStudents: vi.fn((students, filters) => {
    if (filters.searchQuery) {
      return students.filter(
        (s: { name: string; email: string }) =>
          s.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(filters.searchQuery.toLowerCase()),
      )
    }
    return students
  }),
  sortStudents: vi.fn((students, sortBy, sortOrder) => {
    return [...students].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      return 0
    })
  }),
}))

describe('TeacherDashboard', () => {
  it('renders dashboard correctly', () => {
    const wrapper = mount(TeacherDashboard)

    expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.text()).toContain('Dashboard del Profesor')
  })

  it('shows metrics correctly', () => {
    const wrapper = mount(TeacherDashboard)

    expect(wrapper.text()).toContain('Estudiantes Totales')
    expect(wrapper.text()).toContain('Estudiantes Activos')
    expect(wrapper.text()).toContain('Práctica Oral Promedio')
    expect(wrapper.text()).toContain('Fluidez Promedio')
  })

  it('shows progress distribution', () => {
    const wrapper = mount(TeacherDashboard)

    expect(wrapper.text()).toContain('Buen Progreso')
    expect(wrapper.text()).toContain('Progreso Medio')
    expect(wrapper.text()).toContain('Necesita Atención')
  })

  it('shows students filters', () => {
    const wrapper = mount(TeacherDashboard)

    expect(wrapper.find('.students-filters').exists()).toBe(true)
  })

  it('shows students views', () => {
    const wrapper = mount(TeacherDashboard)

    expect(wrapper.find('.students-views').exists()).toBe(true)
  })
})
