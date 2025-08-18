import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StudentsViews from '../views/StudentsViews.vue'
import type { Student } from '../data/students'

// Mock data para testing
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Test Student',
    email: 'test@example.com',
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
]

describe('StudentsViews', () => {
  it('renders grid view correctly', () => {
    const wrapper = mount(StudentsViews, {
      props: {
        students: mockStudents,
        viewMode: 'grid',
        onStudentClick: () => {},
        selectedStudent: null,
      },
      global: {
        stubs: {
          Badge: true, // Stub del componente Badge
        },
      },
    })

    expect(wrapper.find('.grid').exists()).toBe(true)
    expect(wrapper.find('.bg-white.rounded-2xl').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Student')
    expect(wrapper.text()).toContain('test@example.com')
  })

  it('renders list view correctly', () => {
    const wrapper = mount(StudentsViews, {
      props: {
        students: mockStudents,
        viewMode: 'list',
        onStudentClick: () => {},
        selectedStudent: null,
      },
      global: {
        stubs: {
          Badge: true,
        },
      },
    })

    expect(wrapper.find('.space-y-3').exists()).toBe(true)
    expect(wrapper.find('.bg-white.rounded-xl').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Student')
  })

  it('renders table view correctly', () => {
    const wrapper = mount(StudentsViews, {
      props: {
        students: mockStudents,
        viewMode: 'table',
        onStudentClick: () => {},
        selectedStudent: null,
      },
      global: {
        stubs: {
          Badge: true,
        },
      },
    })

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('thead').exists()).toBe(true)
    expect(wrapper.find('tbody').exists()).toBe(true)
    expect(wrapper.text()).toContain('Estudiante')
    expect(wrapper.text()).toContain('Nivel')
  })

  it('shows empty state when no students', () => {
    const wrapper = mount(StudentsViews, {
      props: {
        students: [],
        viewMode: 'grid',
        onStudentClick: () => {},
        selectedStudent: null,
      },
      global: {
        stubs: {
          Badge: true,
        },
      },
    })

    expect(wrapper.text()).toContain('No se encontraron estudiantes')
    expect(wrapper.text()).toContain('Intenta ajustar los filtros de búsqueda')
  })

  it('calls onStudentClick when student card is clicked', async () => {
    const onStudentClick = vi.fn()
    const wrapper = mount(StudentsViews, {
      props: {
        students: mockStudents,
        viewMode: 'grid',
        onStudentClick,
        selectedStudent: null,
      },
      global: {
        stubs: {
          Badge: true,
        },
      },
    })

    await wrapper.find('.cursor-pointer').trigger('click')
    expect(onStudentClick).toHaveBeenCalledWith('1')
  })

  it('highlights selected student correctly', () => {
    const wrapper = mount(StudentsViews, {
      props: {
        students: mockStudents,
        viewMode: 'grid',
        onStudentClick: () => {},
        selectedStudent: '1',
      },
      global: {
        stubs: {
          Badge: true,
        },
      },
    })

    expect(wrapper.find('.ring-2.ring-\\[\\#967AFE\\]').exists()).toBe(true)
  })
})
