/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Student } from '../data/students'

export function getProgressStatus(score: number) {
  if (score >= 80)
    return {
      status: 'excellent',
      color: 'from-green-500 to-emerald-500',
      label: 'Excelente',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    }
  if (score >= 60)
    return {
      status: 'good',
      color: 'from-yellow-500 to-orange-500',
      label: 'Bueno',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
    }
  return {
    status: 'needs-attention',
    color: 'from-red-500 to-pink-500',
    label: 'Necesita Atención',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  }
}

export function getActivityStatus(lastActive: string) {
  if (lastActive.includes('hora') || lastActive.includes('min')) {
    return {
      status: 'online',
      color: 'bg-green-500 aspect-square',
      label: 'En línea',
      priority: 1,
    }
  }
  if (lastActive.includes('día') && !lastActive.includes('semana')) {
    return {
      status: 'recent',
      color: 'bg-yellow-500 aspect-square',
      label: 'Reciente',
      priority: 2,
    }
  }
  return {
    status: 'inactive',
    color: 'bg-red-500 aspect-square',
    label: 'Inactivo',
    priority: 3,
  }
}

export function calculateCompletionRate(completed: number, total: number): number {
  return Math.round((completed / total) * 100)
}

export function getStudentInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function formatLastActive(lastActive: string): string {
  if (lastActive.includes('min')) return 'Hace minutos'
  if (lastActive.includes('hora')) return lastActive
  if (lastActive.includes('día')) return lastActive
  if (lastActive.includes('semana')) return lastActive
  return lastActive
}

export function getLevelColor(level: string) {
  switch (level) {
    case 'A1':
      return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
    case 'A2':
      return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
    case 'B1':
      return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
    case 'B2':
      return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
  }
}

export function sortStudents(
  students: Student[],
  sortBy: string,
  sortOrder: 'asc' | 'desc',
): Student[] {
  return [...students].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'progress':
        aValue = a.fluencyScore
        bValue = b.fluencyScore
        break
      case 'practiceHours':
        aValue = a.oralPracticeHours
        bValue = b.oralPracticeHours
        break
      case 'lastActive':
        aValue = getActivityStatus(a.lastActiveDate).priority
        bValue = getActivityStatus(b.lastActiveDate).priority
        break
      case 'streak':
        aValue = a.streak
        bValue = b.streak
        break
      case 'level':
        const levelOrder = { A1: 1, A2: 2, B1: 3, B2: 4 }
        aValue = levelOrder[a.level]
        bValue = levelOrder[b.level]
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
}

export function filterStudents(students: Student[], filters: any): Student[] {
  return students.filter((student) => {
    // Text search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      const searchableText = `${student.name} ${student.email} ${student.id}`.toLowerCase()
      if (!searchableText.includes(query)) return false
    }

    // Level filter
    if (filters.level && filters.level.length > 0 && !filters.level.includes(student.level)) {
      return false
    }

    // Progress range
    if (
      filters.progressRange &&
      (student.fluencyScore < filters.progressRange[0] ||
        student.fluencyScore > filters.progressRange[1])
    ) {
      return false
    }

    // Practice hours range
    if (
      filters.practiceHoursRange &&
      (student.oralPracticeHours < filters.practiceHoursRange[0] ||
        student.oralPracticeHours > filters.practiceHoursRange[1])
    ) {
      return false
    }

    // Streak range
    if (
      filters.streakRange &&
      (student.streak < filters.streakRange[0] || student.streak > filters.streakRange[1])
    ) {
      return false
    }

    // Activity status
    if (filters.activityStatus && filters.activityStatus.length > 0) {
      const isRecent =
        student.lastActiveDate.includes('hora') || student.lastActiveDate.includes('min')
      const isToday = student.lastActiveDate.includes('hora') || student.lastActiveDate === 'Hoy'
      const isThisWeek =
        student.lastActiveDate.includes('día') && !student.lastActiveDate.includes('semana')
      const isInactive = student.lastActiveDate.includes('semana')

      const matchesActivity = filters.activityStatus.some((status: string) => {
        if (status === 'recent' && isRecent) return true
        if (status === 'today' && isToday) return true
        if (status === 'week' && isThisWeek) return true
        if (status === 'inactive' && isInactive) return true
        return false
      })

      if (!matchesActivity) return false
    }

    // Quick filters
    if (filters.showOnlyActive) {
      const isActive =
        student.lastActiveDate.includes('hora') ||
        student.lastActiveDate.includes('min') ||
        (student.lastActiveDate.includes('día') && !student.lastActiveDate.includes('semana'))
      if (!isActive) return false
    }

    if (filters.showOnlyNeedsAttention) {
      if (student.fluencyScore >= 60) return false
    }

    return true
  })
}
