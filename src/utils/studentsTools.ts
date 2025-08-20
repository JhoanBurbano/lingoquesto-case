/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Student } from '@/data/students'

// Constantes para cálculos coherentes
export const PROGRESS_CONSTANTS = {
  // Niveles de fluidez por nivel de idioma
  FLUENCY_LEVELS: {
    A1: { min: 0, max: 100, target: 70 },
    A2: { min: 0, max: 100, target: 80 },
    B1: { min: 0, max: 100, target: 85 },
    B2: { min: 0, max: 100, target: 90 },
  },

  // Metas semanales por nivel
  WEEKLY_GOALS: {
    A1: { hours: 5, activities: 8, sessions: 4 },
    A2: { hours: 7, activities: 10, sessions: 5 },
    B1: { hours: 10, activities: 12, sessions: 6 },
    B2: { hours: 12, activities: 15, sessions: 7 },
  },

  // Factores de progreso
  PROGRESS_FACTORS: {
    FLUENCY_PER_HOUR: 2.5, // Puntos de fluidez por hora de práctica
    PRONUNCIATION_PER_HOUR: 2.0, // Puntos de pronunciación por hora
    ACTIVITY_WEIGHT: 0.3, // Peso de actividades en el progreso general
    STREAK_BONUS: 0.5, // Bonus por racha diaria
  },
}

// Función para calcular métricas coherentes del estudiante
export function calculateStudentMetrics(student: Student) {
  const level = student.level
  const constants = PROGRESS_CONSTANTS.FLUENCY_LEVELS[level]
  const weeklyGoals = PROGRESS_CONSTANTS.WEEKLY_GOALS[level]

  // Calcular horas de práctica semanal (últimos 7 días)
  const weeklyPracticeHours = calculateWeeklyPracticeHours(student)

  // Calcular progreso de actividades coherente
  const activityProgress = Math.min(
    100,
    (student.activitiesCompleted / student.totalActivities) * 100,
  )

  // Calcular fluidez coherente basada en práctica real
  const calculatedFluency = Math.min(
    constants.max,
    Math.max(
      constants.min,
      Math.round(
        weeklyPracticeHours * PROGRESS_CONSTANTS.PROGRESS_FACTORS.FLUENCY_PER_HOUR +
          activityProgress * PROGRESS_CONSTANTS.PROGRESS_FACTORS.ACTIVITY_WEIGHT +
          student.streak * PROGRESS_CONSTANTS.PROGRESS_FACTORS.STREAK_BONUS,
      ),
    ),
  )

  // Calcular pronunciación coherente
  const calculatedPronunciation = Math.min(
    constants.max,
    Math.max(
      constants.min,
      Math.round(
        weeklyPracticeHours * PROGRESS_CONSTANTS.PROGRESS_FACTORS.PRONUNCIATION_PER_HOUR +
          activityProgress * 0.2 +
          student.streak * 0.3,
      ),
    ),
  )

  // Calcular progreso semanal coherente
  const weeklyProgress = Math.min(100, (weeklyPracticeHours / weeklyGoals.hours) * 100)

  // Calcular estado de progreso coherente
  const progressStatus = calculateProgressStatus(calculatedFluency, level)

  // Calcular meta semanal ajustada
  const adjustedWeeklyGoal = calculateAdjustedWeeklyGoal(student, level)

  return {
    // Métricas calculadas coherentemente
    calculatedFluency,
    calculatedPronunciation,
    weeklyPracticeHours,
    weeklyProgress,
    activityProgress,
    progressStatus,
    adjustedWeeklyGoal,

    // Indicadores de coherencia
    isDataCoherent: isStudentDataCoherent(student, calculatedFluency, calculatedPronunciation),
    dataQuality: calculateDataQuality(student),

    // Recomendaciones basadas en datos
    recommendations: generateRecommendations(
      student,
      calculatedFluency,
      calculatedPronunciation,
      level,
    ),
  }
}

// Función para calcular horas de práctica semanal
function calculateWeeklyPracticeHours(student: Student): number {
  // Simular cálculo basado en sesiones recientes
  const recentSessions = student.recentSessions || []
  const weeklyHours = recentSessions.reduce((total, session) => {
    const daysAgo = parseDaysAgo(session.date)
    if (daysAgo <= 7) {
      return total + session.duration / 60 // Convertir minutos a horas
    }
    return total
  }, 0)

  // Combinar con horas totales pero dar más peso a las recientes
  return Math.round((weeklyHours * 0.7 + student.oralPracticeHours * 0.3) * 10) / 10
}

// Función para calcular estado de progreso coherente
function calculateProgressStatus(
  fluencyScore: number,
  level: string,
): {
  status: 'excellent' | 'good' | 'needs-attention'
  color: string
  textColor: string
  label: string
} {
  const constants =
    PROGRESS_CONSTANTS.FLUENCY_LEVELS[level as keyof typeof PROGRESS_CONSTANTS.FLUENCY_LEVELS]

  if (fluencyScore >= constants.target) {
    return {
      status: 'excellent',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      label: 'Excelente',
    }
  } else if (fluencyScore >= constants.target * 0.8) {
    return {
      status: 'good',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      label: 'Bueno',
    }
  } else {
    return {
      status: 'needs-attention',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      label: 'Necesita Atención',
    }
  }
}

// Función para calcular meta semanal ajustada
function calculateAdjustedWeeklyGoal(student: Student, level: string): number {
  const baseGoal =
    PROGRESS_CONSTANTS.WEEKLY_GOALS[level as keyof typeof PROGRESS_CONSTANTS.WEEKLY_GOALS]

  // Ajustar basado en el progreso actual
  const currentProgress = (student.activitiesCompleted / student.totalActivities) * 100
  const fluencyRatio = student.fluencyScore / 100

  let adjustment = 1.0

  if (currentProgress < 50) {
    adjustment = 0.8 // Reducir meta si no está progresando
  } else if (currentProgress > 80 && fluencyRatio > 0.8) {
    adjustment = 1.2 // Aumentar meta si está progresando bien
  }

  return Math.round(baseGoal.hours * adjustment)
}

// Función para verificar coherencia de datos
function isStudentDataCoherent(
  student: Student,
  calculatedFluency: number,
  calculatedPronunciation: number,
): boolean {
  const fluencyDiff = Math.abs(student.fluencyScore - calculatedFluency)
  const pronunciationDiff = Math.abs(student.pronunciationScore - calculatedPronunciation)

  // Los datos son coherentes si la diferencia es menor al 15%
  return fluencyDiff <= 15 && pronunciationDiff <= 15
}

// Función para calcular calidad de datos
function calculateDataQuality(student: Student): 'high' | 'medium' | 'low' {
  let score = 0

  // Verificar completitud de datos
  if (student.recentSessions?.length >= 3) score += 2
  if (student.pronunciationDetails?.length >= 4) score += 2
  if (student.voiceRecordings?.length >= 2) score += 2

  // Verificar consistencia temporal
  const lastActive = parseDaysAgo(student.lastActiveDate)
  if (lastActive <= 1) score += 2
  else if (lastActive <= 7) score += 1

  // Verificar coherencia de métricas
  if (student.oralPracticeHours > 0 && student.fluencyScore > 0) score += 2

  if (score >= 8) return 'high'
  if (score >= 5) return 'medium'
  return 'low'
}

// Función para generar recomendaciones
function generateRecommendations(
  student: Student,
  calculatedFluency: number,
  calculatedPronunciation: number,
  level: string,
): string[] {
  const recommendations: string[] = []
  const constants =
    PROGRESS_CONSTANTS.FLUENCY_LEVELS[level as keyof typeof PROGRESS_CONSTANTS.FLUENCY_LEVELS]

  // Recomendaciones basadas en fluidez
  if (calculatedFluency < constants.target * 0.8) {
    recommendations.push('Aumentar tiempo de práctica oral semanal')
    recommendations.push('Completar más actividades de conversación')
  }

  // Recomendaciones basadas en pronunciación
  if (calculatedPronunciation < calculatedFluency * 0.9) {
    recommendations.push('Enfocarse en ejercicios de pronunciación específicos')
    recommendations.push('Practicar fonemas problemáticos identificados')
  }

  // Recomendaciones basadas en racha
  if (student.streak < 3) {
    recommendations.push('Establecer rutina diaria de práctica')
    recommendations.push('Usar recordatorios para mantener consistencia')
  }

  // Recomendaciones basadas en nivel
  if (level === 'A1' && calculatedFluency > 80) {
    recommendations.push('Considerar avanzar al siguiente nivel')
  }

  return recommendations.slice(0, 3) // Máximo 3 recomendaciones
}

// Función auxiliar para parsear días atrás
function parseDaysAgo(dateString: string): number {
  if (dateString.includes('hora') || dateString.includes('min')) return 0
  if (dateString.includes('Hoy')) return 0
  if (dateString.includes('Ayer')) return 1

  const dayMatch = dateString.match(/(\d+)\s*días?/)
  if (dayMatch) return parseInt(dayMatch[1])

  const weekMatch = dateString.match(/(\d+)\s*semanas?/)
  if (weekMatch) return parseInt(weekMatch[1]) * 7

  return 30 // Default para fechas muy antiguas
}

// Función para obtener iniciales del nombre
export function getStudentInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Función para formatear última actividad
export function formatLastActive(lastActive: string): string {
  if (lastActive.includes('hora') || lastActive.includes('min')) {
    return lastActive
  }

  const daysAgo = parseDaysAgo(lastActive)
  if (daysAgo === 0) return 'Hoy'
  if (daysAgo === 1) return 'Ayer'
  if (daysAgo < 7) return `${daysAgo} días`
  if (daysAgo < 30) return `${Math.ceil(daysAgo / 7)} semanas`
  return `${Math.ceil(daysAgo / 30)} meses`
}

// Función para obtener estado de actividad
export function getActivityStatus(lastActive: string): {
  label: string
  color: string
  bgColor: string
} {
  const daysAgo = parseDaysAgo(lastActive)

  if (daysAgo === 0) {
    return {
      label: 'Activo',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    }
  } else if (daysAgo <= 3) {
    return {
      label: 'Reciente',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    }
  } else if (daysAgo <= 7) {
    return {
      label: 'Semanal',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    }
  } else {
    return {
      label: 'Inactivo',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    }
  }
}

// Función para ordenar estudiantes
export function sortStudents(students: any[], sortBy: string, sortOrder: 'asc' | 'desc'): any[] {
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
        aValue = getActivityStatus(a.lastActiveDate).label
        bValue = getActivityStatus(b.lastActiveDate).label
        break
      case 'streak':
        aValue = a.streak
        bValue = b.streak
        break
      case 'level':
        const levelOrder = { A1: 1, A2: 2, B1: 3, B2: 4 }
        aValue = levelOrder[a.level as keyof typeof levelOrder]
        bValue = levelOrder[b.level as keyof typeof levelOrder]
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

// Función para filtrar estudiantes
export function filterStudents(students: any[], filters: any): any[] {
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

// Función para obtener color del nivel
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
