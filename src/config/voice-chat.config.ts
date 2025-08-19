export const VOICE_CHAT_CONFIG = {
  // Audio settings
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000,
    channelCount: 1,
    fftSize: 256,
    speakingThreshold: 0.1,
    updateInterval: 100, // ms
  },

  // Room settings
  room: {
    maxParticipants: 20,
    defaultMaxParticipants: 10,
    minMaxParticipants: 1,
    maxMaxParticipants: 50,
    autoCleanupInterval: 5 * 60 * 1000, // 5 minutes
    inactivityTimeout: 5 * 60 * 1000, // 5 minutes
  },

  // Real-time settings
  realtime: {
    eventsPerSecond: 10,
    reconnectAttempts: 3,
    reconnectDelay: 1000, // 1 second
    heartbeatInterval: 30000, // 30 seconds
  },

  // UI settings
  ui: {
    participantGridColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 4,
    },
    audioLevelUpdateRate: 60, // FPS
    speakingIndicatorDelay: 200, // ms
    modalAnimationDuration: 300, // ms
  },

  // Error messages
  errors: {
    audioPermissionDenied:
      'Microphone access denied. Please allow microphone access to use voice chat.',
    roomNotFound: 'Room not found or has been deactivated.',
    roomFull: 'This room is full. Please try another room.',
    connectionFailed: 'Failed to connect to voice chat server.',
    audioInitFailed: 'Failed to initialize audio. Please check your microphone settings.',
    networkError: 'Network error. Please check your internet connection.',
  },

  // Success messages
  success: {
    roomCreated: 'Room created successfully!',
    roomJoined: 'Successfully joined the room!',
    roomLeft: 'You have left the room.',
  },

  // Validation rules
  validation: {
    roomName: {
      minLength: 3,
      maxLength: 255,
      pattern: /^[a-zA-Z0-9\s\-_]+$/,
    },
    username: {
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_]+$/,
    },
  },
} as const

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const

export const PARTICIPANT_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  SPEAKING: 'speaking',
  SILENT: 'silent',
  MUTED: 'muted',
} as const

export const ROOM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  FULL: 'full',
  EMPTY: 'empty',
} as const

export const AUDIO_LEVELS = {
  SILENT: 0,
  LOW: 0.25,
  MEDIUM: 0.5,
  HIGH: 0.75,
  MAX: 1.0,
} as const
