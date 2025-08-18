export interface Student {
  id: string
  name: string
  email: string
  level: 'A1' | 'A2' | 'B1' | 'B2'
  oralPracticeHours: number
  fluencyScore: number
  pronunciationScore: number
  activitiesCompleted: number
  totalActivities: number
  lastActiveDate: string
  streak: number
  weeklyGoal: number
  joinDate: string
  recentSessions: Array<{
    date: string
    duration: number
    score: number
    type: string
  }>
  strengths: string[]
  improvements: string[]
  pronunciationDetails: Array<{
    phoneme: string
    accuracy: number
    attempts: number
  }>
  voiceRecordings: Array<{
    id: string
    date: string
    duration: string
    topic: string
    score: number
  }>
}

export const STUDENTS_DATA: Student[] = [
  // ESTUDIANTES CON BUEN PROGRESO (6 estudiantes - 50%)
  {
    id: '1',
    name: 'Susana Casas',
    email: 'susana.casas@email.com',
    level: 'A1',
    oralPracticeHours: 18.5,
    fluencyScore: 85,
    pronunciationScore: 88,
    activitiesCompleted: 18,
    totalActivities: 20,
    lastActiveDate: '1 hora',
    streak: 12,
    weeklyGoal: 10,
    joinDate: '2024-01-15',
    recentSessions: [
      { date: 'Hoy, 14:30', duration: 25, score: 88, type: 'Conversación Guiada' },
      { date: 'Ayer, 16:15', duration: 20, score: 85, type: 'Pronunciación' },
      { date: '2 días', duration: 30, score: 90, type: 'Diálogo Interactivo' },
    ],
    strengths: [
      'Excelente comprensión auditiva',
      'Vocabulario cotidiano sólido',
      'Pronunciación de vocales clara',
      'Gran motivación y constancia',
    ],
    improvements: [
      'Fluidez en conversaciones espontáneas',
      'Conectores y expresiones de transición',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 78, attempts: 24 },
      { phoneme: 'r', accuracy: 82, attempts: 31 },
      { phoneme: 'v', accuracy: 92, attempts: 18 },
      { phoneme: 'w', accuracy: 95, attempts: 15 },
      { phoneme: 'l', accuracy: 88, attempts: 22 },
      { phoneme: 's', accuracy: 98, attempts: 12 },
    ],
    voiceRecordings: [
      { id: '1', date: 'Hoy', duration: '2:15', topic: 'Mi rutina diaria', score: 88 },
      { id: '2', date: 'Ayer', duration: '1:45', topic: 'Describir mi familia', score: 85 },
      {
        id: '3',
        date: '2 días',
        duration: '3:20',
        topic: 'Planes para el fin de semana',
        score: 90,
      },
    ],
  },
  {
    id: '2',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    level: 'B1',
    oralPracticeHours: 22.8,
    fluencyScore: 92,
    pronunciationScore: 89,
    activitiesCompleted: 21,
    totalActivities: 24,
    lastActiveDate: '2 horas',
    streak: 15,
    weeklyGoal: 12,
    joinDate: '2024-01-10',
    recentSessions: [
      { date: 'Hoy, 09:45', duration: 35, score: 94, type: 'Debate Estructurado' },
      { date: 'Ayer, 15:30', duration: 28, score: 91, type: 'Narración' },
      { date: '2 días', duration: 40, score: 89, type: 'Presentación Formal' },
    ],
    strengths: [
      'Excelente fluidez natural',
      'Uso correcto de tiempos verbales',
      'Rica expresión idiomática',
      'Confianza al expresarse',
    ],
    improvements: ['Reducir muletillas ocasionales', 'Perfeccionar entonación interrogativa'],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 89, attempts: 15 },
      { phoneme: 'r', accuracy: 91, attempts: 20 },
      { phoneme: 'v', accuracy: 94, attempts: 12 },
      { phoneme: 'w', accuracy: 96, attempts: 8 },
    ],
    voiceRecordings: [
      { id: '5', date: 'Hoy', duration: '4:22', topic: 'Opinión sobre tecnología', score: 94 },
      { id: '6', date: 'Ayer', duration: '3:15', topic: 'Experiencia de viaje', score: 91 },
    ],
  },
  {
    id: '3',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    level: 'A2',
    oralPracticeHours: 16.2,
    fluencyScore: 83,
    pronunciationScore: 86,
    activitiesCompleted: 15,
    totalActivities: 18,
    lastActiveDate: '3 horas',
    streak: 8,
    weeklyGoal: 8,
    joinDate: '2024-01-20',
    recentSessions: [
      { date: 'Hoy, 11:20', duration: 22, score: 86, type: 'Conversación Casual' },
      { date: 'Ayer, 14:45', duration: 18, score: 83, type: 'Descripción de Imágenes' },
      { date: '2 días', duration: 25, score: 80, type: 'Role Playing' },
    ],
    strengths: [
      'Buena pronunciación general',
      'Vocabulario en expansión',
      'Participación activa en clases',
      'Mejora constante',
    ],
    improvements: [
      'Aumentar velocidad de respuesta',
      'Trabajar en conectores complejos',
      'Ganar más confianza',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 75, attempts: 20 },
      { phoneme: 'r', accuracy: 88, attempts: 25 },
      { phoneme: 'v', accuracy: 82, attempts: 16 },
      { phoneme: 'w', accuracy: 90, attempts: 12 },
    ],
    voiceRecordings: [
      { id: '7', date: 'Hoy', duration: '2:10', topic: 'Mi comida favorita', score: 86 },
      { id: '8', date: 'Ayer', duration: '1:55', topic: 'Actividades de fin de semana', score: 83 },
    ],
  },
  {
    id: '4',
    name: 'Andrea Ruiz',
    email: 'andrea.ruiz@email.com',
    level: 'B1',
    oralPracticeHours: 20.1,
    fluencyScore: 87,
    pronunciationScore: 84,
    activitiesCompleted: 17,
    totalActivities: 20,
    lastActiveDate: '1 hora',
    streak: 10,
    weeklyGoal: 9,
    joinDate: '2024-01-25',
    recentSessions: [
      { date: 'Hoy, 16:00', duration: 32, score: 89, type: 'Discusión de Temas Actuales' },
      { date: 'Ayer, 10:30', duration: 28, score: 87, type: 'Storytelling' },
      { date: '2 días', duration: 35, score: 85, type: 'Simulacro de Entrevista' },
    ],
    strengths: [
      'Excelente comprensión contextual',
      'Uso apropiado de expresiones',
      'Buena estructura narrativa',
      'Pronunciación clara',
    ],
    improvements: ['Ampliar vocabulario técnico', 'Mejorar pronunciación de consonantes complejas'],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 81, attempts: 18 },
      { phoneme: 'r', accuracy: 85, attempts: 22 },
      { phoneme: 'v', accuracy: 89, attempts: 14 },
      { phoneme: 'w', accuracy: 92, attempts: 10 },
    ],
    voiceRecordings: [
      { id: '9', date: 'Hoy', duration: '3:45', topic: 'Cambios en mi ciudad', score: 89 },
      { id: '10', date: 'Ayer', duration: '2:50', topic: 'Libro que me gustó', score: 87 },
    ],
  },
  {
    id: '5',
    name: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    level: 'A2',
    oralPracticeHours: 15.7,
    fluencyScore: 81,
    pronunciationScore: 85,
    activitiesCompleted: 14,
    totalActivities: 17,
    lastActiveDate: '4 horas',
    streak: 7,
    weeklyGoal: 7,
    joinDate: '2024-02-01',
    recentSessions: [
      { date: 'Hoy, 08:15', duration: 20, score: 83, type: 'Práctica de Vocabulario' },
      { date: 'Ayer, 17:20', duration: 24, score: 81, type: 'Conversación Dirigida' },
      { date: '2 días', duration: 18, score: 79, type: 'Pronunciación Específica' },
    ],
    strengths: [
      'Dedicación y esfuerzo constante',
      'Buena retención de nuevo vocabulario',
      'Pronunciación en mejora continua',
    ],
    improvements: [
      'Aumentar fluidez general',
      'Trabajar en entonación',
      'Ganar más confianza al hablar',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 72, attempts: 22 },
      { phoneme: 'r', accuracy: 85, attempts: 28 },
      { phoneme: 'v', accuracy: 88, attempts: 15 },
      { phoneme: 'w', accuracy: 91, attempts: 13 },
    ],
    voiceRecordings: [
      { id: '11', date: 'Hoy', duration: '1:45', topic: 'Mi trabajo diario', score: 83 },
      { id: '12', date: 'Ayer', duration: '2:00', topic: 'Planes de vacaciones', score: 81 },
    ],
  },
  {
    id: '6',
    name: 'Lucía Herrera',
    email: 'lucia.herrera@email.com',
    level: 'B2',
    oralPracticeHours: 25.3,
    fluencyScore: 94,
    pronunciationScore: 91,
    activitiesCompleted: 23,
    totalActivities: 25,
    lastActiveDate: '30 min',
    streak: 18,
    weeklyGoal: 14,
    joinDate: '2024-01-05',
    recentSessions: [
      { date: 'Hoy, 18:45', duration: 45, score: 96, type: 'Debate Avanzado' },
      { date: 'Ayer, 12:15', duration: 38, score: 94, type: 'Análisis Crítico' },
      { date: '2 días', duration: 42, score: 92, type: 'Presentación Académica' },
    ],
    strengths: [
      'Excelente dominio del idioma',
      'Capacidad de análisis profundo',
      'Rica variedad léxica',
      'Pronunciación casi nativa',
      'Liderazgo en discusiones grupales',
    ],
    improvements: [
      'Perfeccionar algunos matices culturales',
      'Trabajar expresiones muy específicas',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 94, attempts: 12 },
      { phoneme: 'r', accuracy: 92, attempts: 16 },
      { phoneme: 'v', accuracy: 96, attempts: 10 },
      { phoneme: 'w', accuracy: 98, attempts: 8 },
    ],
    voiceRecordings: [
      {
        id: '13',
        date: 'Hoy',
        duration: '5:20',
        topic: 'Impacto de la IA en educación',
        score: 96,
      },
      { id: '14', date: 'Ayer', duration: '4:15', topic: 'Sostenibilidad ambiental', score: 94 },
    ],
  },

  // ESTUDIANTES CON PROGRESO MEDIO (3 estudiantes - 25%)
  {
    id: '7',
    name: 'David Garzón',
    email: 'david.garzon@email.com',
    level: 'A1',
    oralPracticeHours: 9.2,
    fluencyScore: 68,
    pronunciationScore: 72,
    activitiesCompleted: 10,
    totalActivities: 20,
    lastActiveDate: '1 día',
    streak: 4,
    weeklyGoal: 6,
    joinDate: '2024-02-10',
    recentSessions: [
      { date: 'Ayer, 10:20', duration: 15, score: 72, type: 'Vocabulario Básico' },
      { date: '3 días', duration: 18, score: 68, type: 'Conversación Simple' },
      { date: '5 días', duration: 12, score: 65, type: 'Pronunciación Elemental' },
    ],
    strengths: [
      'Buena retención de vocabulario básico',
      'Motivación para mejorar',
      'Escucha atenta en clases',
    ],
    improvements: [
      'Aumentar confianza al hablar',
      'Mejorar pronunciación de consonantes',
      'Incrementar tiempo de práctica',
      'Desarrollar fluidez básica',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 45, attempts: 18 },
      { phoneme: 'r', accuracy: 72, attempts: 25 },
      { phoneme: 'v', accuracy: 68, attempts: 14 },
      { phoneme: 'w', accuracy: 85, attempts: 12 },
    ],
    voiceRecordings: [
      { id: '15', date: 'Ayer', duration: '1:20', topic: 'Saludos y presentación', score: 72 },
      { id: '16', date: '3 días', duration: '1:05', topic: 'Números y fechas', score: 68 },
    ],
  },
  {
    id: '8',
    name: 'Patricia Moreno',
    email: 'patricia.moreno@email.com',
    level: 'A2',
    oralPracticeHours: 11.5,
    fluencyScore: 71,
    pronunciationScore: 74,
    activitiesCompleted: 12,
    totalActivities: 18,
    lastActiveDate: '2 días',
    streak: 2,
    weeklyGoal: 6,
    joinDate: '2024-02-05',
    recentSessions: [
      { date: '2 días, 15:30', duration: 20, score: 74, type: 'Descripción Personal' },
      { date: '4 días, 11:45', duration: 16, score: 71, type: 'Rutinas Diarias' },
      { date: '6 días', duration: 22, score: 68, type: 'Pasatiempos' },
    ],
    strengths: [
      'Comprensión auditiva decente',
      'Vocabulario básico sólido',
      'Pronunciación en mejora',
    ],
    improvements: [
      'Aumentar frecuencia de práctica',
      'Mejorar fluidez en conversaciones',
      'Trabajar en pronunciación específica',
      'Ganar más confianza',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 58, attempts: 16 },
      { phoneme: 'r', accuracy: 75, attempts: 21 },
      { phoneme: 'v', accuracy: 73, attempts: 13 },
      { phoneme: 'w', accuracy: 82, attempts: 11 },
    ],
    voiceRecordings: [
      { id: '17', date: '2 días', duration: '1:50', topic: 'Mi familia', score: 74 },
      { id: '18', date: '4 días', duration: '1:35', topic: 'Mi casa', score: 71 },
    ],
  },
  {
    id: '9',
    name: 'Fernando López',
    email: 'fernando.lopez@email.com',
    level: 'B1',
    oralPracticeHours: 13.8,
    fluencyScore: 75,
    pronunciationScore: 77,
    activitiesCompleted: 13,
    totalActivities: 20,
    lastActiveDate: '1 día',
    streak: 3,
    weeklyGoal: 8,
    joinDate: '2024-01-30',
    recentSessions: [
      { date: 'Ayer, 19:15', duration: 26, score: 78, type: 'Opiniones Personales' },
      { date: '3 días, 14:20', duration: 24, score: 75, type: 'Narración Pasada' },
      { date: '5 días', duration: 20, score: 73, type: 'Planes Futuros' },
    ],
    strengths: [
      'Buen manejo de tiempos verbales básicos',
      'Comprensión contextual adecuada',
      'Vocabulario intermedio en desarrollo',
    ],
    improvements: [
      'Mejorar consistencia en la práctica',
      'Trabajar en fluidez natural',
      'Ampliar expresiones idiomáticas',
      'Reducir pausas excesivas',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 68, attempts: 15 },
      { phoneme: 'r', accuracy: 79, attempts: 19 },
      { phoneme: 'v', accuracy: 76, attempts: 12 },
      { phoneme: 'w', accuracy: 84, attempts: 9 },
    ],
    voiceRecordings: [
      { id: '19', date: 'Ayer', duration: '2:35', topic: 'Experiencias de trabajo', score: 78 },
      { id: '20', date: '3 días', duration: '2:15', topic: 'Viaje memorable', score: 75 },
    ],
  },

  // ESTUDIANTES CON MAL PROGRESO (3 estudiantes - 25%)
  {
    id: '10',
    name: 'Miguel Torres',
    email: 'miguel.torres@email.com',
    level: 'A1',
    oralPracticeHours: 4.1,
    fluencyScore: 45,
    pronunciationScore: 48,
    activitiesCompleted: 4,
    totalActivities: 20,
    lastActiveDate: '1 semana',
    streak: 0,
    weeklyGoal: 4,
    joinDate: '2024-02-15',
    recentSessions: [
      { date: '1 semana, 16:30', duration: 8, score: 48, type: 'Vocabulario Básico' },
      { date: '2 semanas', duration: 12, score: 45, type: 'Pronunciación' },
      { date: '3 semanas', duration: 6, score: 42, type: 'Saludos' },
    ],
    strengths: ['Asistencia ocasional a clases', 'Interés inicial mostrado'],
    improvements: [
      'Aumentar significativamente la práctica',
      'Trabajar en motivación y constancia',
      'Mejorar pronunciación básica',
      'Desarrollar vocabulario fundamental',
      'Establecer rutina de estudio',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 25, attempts: 8 },
      { phoneme: 'r', accuracy: 48, attempts: 12 },
      { phoneme: 'v', accuracy: 42, attempts: 6 },
      { phoneme: 'w', accuracy: 65, attempts: 5 },
    ],
    voiceRecordings: [
      { id: '21', date: '1 semana', duration: '0:45', topic: 'Presentación básica', score: 48 },
      { id: '22', date: '2 semanas', duration: '0:30', topic: 'Números', score: 45 },
    ],
  },
  {
    id: '11',
    name: 'Carmen Jiménez',
    email: 'carmen.jimenez@email.com',
    level: 'A1',
    oralPracticeHours: 5.8,
    fluencyScore: 52,
    pronunciationScore: 55,
    activitiesCompleted: 6,
    totalActivities: 20,
    lastActiveDate: '5 días',
    streak: 0,
    weeklyGoal: 5,
    joinDate: '2024-02-12',
    recentSessions: [
      { date: '5 días, 10:45', duration: 10, score: 55, type: 'Alfabeto y Sonidos' },
      { date: '1 semana', duration: 14, score: 52, type: 'Colores y Números' },
      { date: '10 días', duration: 8, score: 48, type: 'Saludos Básicos' },
    ],
    strengths: ['Esfuerzo por participar ocasionalmente', 'Comprensión básica de instrucciones'],
    improvements: [
      'Establecer consistencia en el estudio',
      'Superar timidez al hablar',
      'Mejorar pronunciación fundamental',
      'Aumentar vocabulario básico',
      'Desarrollar confianza',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 30, attempts: 10 },
      { phoneme: 'r', accuracy: 55, attempts: 15 },
      { phoneme: 'v', accuracy: 48, attempts: 8 },
      { phoneme: 'w', accuracy: 72, attempts: 7 },
    ],
    voiceRecordings: [
      { id: '23', date: '5 días', duration: '0:55', topic: 'Mi nombre', score: 55 },
      { id: '24', date: '1 semana', duration: '0:40', topic: 'Colores favoritos', score: 52 },
    ],
  },
  {
    id: '12',
    name: 'Alberto Vega',
    email: 'alberto.vega@email.com',
    level: 'A2',
    oralPracticeHours: 7.3,
    fluencyScore: 58,
    pronunciationScore: 61,
    activitiesCompleted: 7,
    totalActivities: 18,
    lastActiveDate: '4 días',
    streak: 0,
    weeklyGoal: 5,
    joinDate: '2024-02-08',
    recentSessions: [
      { date: '4 días, 20:00', duration: 15, score: 61, type: 'Descripción Simple' },
      { date: '1 semana', duration: 18, score: 58, type: 'Presente Simple' },
      { date: '12 días', duration: 12, score: 55, type: 'Familia y Amigos' },
    ],
    strengths: [
      'Comprensión auditiva básica',
      'Vocabulario elemental presente',
      'Ocasionales intentos de participación',
    ],
    improvements: [
      'Aumentar drasticamente la práctica',
      'Trabajar en pronunciación sistemática',
      'Desarrollar fluidez básica',
      'Mejorar confianza al comunicarse',
      'Establecer metas realistas y alcanzables',
    ],
    pronunciationDetails: [
      { phoneme: 'th', accuracy: 38, attempts: 12 },
      { phoneme: 'r', accuracy: 61, attempts: 18 },
      { phoneme: 'v', accuracy: 55, attempts: 10 },
      { phoneme: 'w', accuracy: 74, attempts: 8 },
    ],
    voiceRecordings: [
      { id: '25', date: '4 días', duration: '1:10', topic: 'Mi día típico', score: 61 },
      { id: '26', date: '1 semana', duration: '1:25', topic: 'Mi familia', score: 58 },
    ],
  },
]

// Función para obtener estudiantes por categoría
export function getStudentsByProgress() {
  return {
    excellent: STUDENTS_DATA.filter((s) => s.fluencyScore >= 80),
    good: STUDENTS_DATA.filter((s) => s.fluencyScore >= 60 && s.fluencyScore < 80),
    needsAttention: STUDENTS_DATA.filter((s) => s.fluencyScore < 60),
  }
}

// Función para obtener estudiantes activos
export function getActiveStudents() {
  return STUDENTS_DATA.filter(
    (s) =>
      s.lastActiveDate.includes('hora') ||
      s.lastActiveDate.includes('min') ||
      (s.lastActiveDate.includes('día') && !s.lastActiveDate.includes('semana')),
  )
}

// Función para calcular métricas generales
export function calculateOverallMetrics() {
  const totalStudents = STUDENTS_DATA.length
  const activeStudents = getActiveStudents().length
  const avgOralPractice =
    Math.round(
      (STUDENTS_DATA.reduce((sum, s) => sum + s.oralPracticeHours, 0) / totalStudents) * 10,
    ) / 10
  const avgFluencyScore = Math.round(
    STUDENTS_DATA.reduce((sum, s) => sum + s.fluencyScore, 0) / totalStudents,
  )
  const avgPronunciationScore = Math.round(
    STUDENTS_DATA.reduce((sum, s) => sum + s.pronunciationScore, 0) / totalStudents,
  )

  const progressDistribution = getStudentsByProgress()

  return {
    totalStudents,
    activeStudents,
    avgOralPractice,
    avgFluencyScore,
    avgPronunciationScore,
    activityRate: Math.round((activeStudents / totalStudents) * 100),
    progressDistribution: {
      excellent: progressDistribution.excellent.length,
      good: progressDistribution.good.length,
      needsAttention: progressDistribution.needsAttention.length,
    },
  }
}

// Distribución por niveles
export function getStudentsByLevel() {
  return {
    A1: STUDENTS_DATA.filter((s) => s.level === 'A1'),
    A2: STUDENTS_DATA.filter((s) => s.level === 'A2'),
    B1: STUDENTS_DATA.filter((s) => s.level === 'B1'),
    B2: STUDENTS_DATA.filter((s) => s.level === 'B2'),
  }
}
