/**
 * Audio processing utilities following clean code principles
 *
 * This module handles:
 * - Audio format detection and validation
 * - Blob processing and upload preparation
 * - Audio file integrity validation
 * - Configuration management
 */

// Configuration constants - easily modifiable
export const AUDIO_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: {
    'audio/wav': 'wav',
    'audio/mp3': 'mp3',
    'audio/mp4': 'm4a',
    'audio/ogg': 'ogg',
    'audio/webm': 'webm',
    'audio/aac': 'aac',
  } as const,
  DEFAULT_FORMAT: 'audio/wav' as const,
  DEFAULT_EXTENSION: 'wav' as const,
  LOAD_TIMEOUT: 5000, // 5 seconds
  MIN_DURATION: 0.1, // 100ms minimum
} as const

// Types for better type safety
export type SupportedAudioFormat = keyof typeof AUDIO_CONFIG.SUPPORTED_FORMATS
export type AudioExtension = (typeof AUDIO_CONFIG.SUPPORTED_FORMATS)[SupportedAudioFormat]

export interface AudioValidationResult {
  isValid: boolean
  error?: string
}

export interface AudioFormatInfo {
  contentType: string
  extension: AudioExtension
}

export interface AudioUploadResult {
  audioUrl: string
  filePath: string
}

/**
 * Audio validation class following Single Responsibility Principle
 * Handles all audio validation logic
 */
export class AudioValidator {
  /**
   * Validates a blob for audio processing
   * @param blob - The audio blob to validate
   * @returns Validation result with error details if invalid
   */
  static validateBlob(blob: Blob): AudioValidationResult {
    if (blob.size === 0) {
      return { isValid: false, error: 'Audio blob is empty' }
    }

    if (blob.size > AUDIO_CONFIG.MAX_FILE_SIZE) {
      const maxSizeMB = AUDIO_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
      return {
        isValid: false,
        error: `Audio file too large (max ${maxSizeMB}MB)`,
      }
    }

    if (!blob.type.startsWith('audio/')) {
      return { isValid: false, error: 'Invalid audio format' }
    }

    return { isValid: true }
  }

  /**
   * Gets supported format information from MIME type
   * @param mimeType - The MIME type to check
   * @returns Format information with content type and extension
   */
  static getSupportedFormat(mimeType: string): AudioFormatInfo {
    const extension = AUDIO_CONFIG.SUPPORTED_FORMATS[mimeType as SupportedAudioFormat]

    if (extension) {
      return { contentType: mimeType, extension }
    }

    console.warn(
      `⚠️ Unsupported audio format: ${mimeType}, defaulting to ${AUDIO_CONFIG.DEFAULT_FORMAT}`,
    )
    return {
      contentType: AUDIO_CONFIG.DEFAULT_FORMAT,
      extension: AUDIO_CONFIG.DEFAULT_EXTENSION,
    }
  }

  /**
   * Validates audio file integrity by testing metadata loading
   * @param audioUrl - The audio URL to validate
   * @returns Validation result with specific error details
   */
  static async validateAudioFile(audioUrl: string): Promise<AudioValidationResult> {
    try {
      console.log('🧪 Testing audio file integrity:', audioUrl)

      // Validate HTTP response
      const response = await fetch(audioUrl)
      if (!response.ok) {
        return {
          isValid: false,
          error: `HTTP error: ${response.status} ${response.statusText}`,
        }
      }

      // Validate blob properties
      const blob = await response.blob()
      if (blob.size === 0) {
        return { isValid: false, error: 'Audio file is empty' }
      }

      console.log('🔍 Audio blob info:', {
        size: blob.size,
        type: blob.type,
      })

      // Validate audio metadata
      const metadataValidation = await this.validateAudioMetadata(audioUrl)
      if (!metadataValidation.isValid) {
        return metadataValidation
      }

      return { isValid: true }
    } catch (error) {
      console.error('❌ Error testing audio file:', error)
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Validates audio metadata by loading it in a temporary audio element
   * @param audioUrl - The audio URL to validate
   * @returns Validation result for metadata
   */
  private static async validateAudioMetadata(audioUrl: string): Promise<AudioValidationResult> {
    return new Promise((resolve) => {
      const testAudio = new Audio()
      testAudio.src = audioUrl

      const timeout = setTimeout(() => {
        console.error('❌ Audio load timeout')
        resolve({ isValid: false, error: 'Audio load timeout' })
      }, AUDIO_CONFIG.LOAD_TIMEOUT)

      testAudio.addEventListener('loadedmetadata', () => {
        clearTimeout(timeout)

        const duration = testAudio.duration
        const isValidDuration = isFinite(duration) && duration > AUDIO_CONFIG.MIN_DURATION

        console.log('✅ Audio metadata loaded successfully:', {
          duration,
          isFinite: isFinite(duration),
          currentSrc: testAudio.currentSrc,
          isValidDuration,
        })

        if (!isValidDuration) {
          resolve({
            isValid: false,
            error: `Invalid audio duration: ${duration}`,
          })
        } else {
          resolve({ isValid: true })
        }
      })

      testAudio.addEventListener('error', (e) => {
        clearTimeout(timeout)
        console.error('❌ Audio load error:', e)
        resolve({ isValid: false, error: 'Audio load error' })
      })
    })
  }
}

/**
 * Audio processor class following Single Responsibility Principle
 * Handles all audio processing and upload logic
 */
export class AudioProcessor {
  /**
   * Processes a blob URL for upload to storage
   * @param blobUrl - The blob URL to process
   * @param userId - The user ID for file naming
   * @returns Upload result with audio URL and file path
   */
  static async processBlobForUpload(blobUrl: string, userId: string): Promise<AudioUploadResult> {
    try {
      console.log('🎵 Processing audio blob for upload...')

      // Fetch and validate blob
      const response = await fetch(blobUrl)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const blob = await response.blob()

      // Validate audio blob
      const validation = AudioValidator.validateBlob(blob)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      // Get format information
      const { contentType, extension } = AudioValidator.getSupportedFormat(blob.type)

      console.log('🔍 Audio format detected:', {
        contentType,
        extension,
        blobSize: blob.size,
        originalType: blob.type,
      })

      // Generate file path
      const timestamp = Date.now()
      const fileName = `audio_${timestamp}_${userId}.${extension}`
      const filePath = `${userId}/${fileName}`

      return { audioUrl: '', filePath } // Placeholder - will be filled by caller
    } catch (error) {
      console.error('❌ Error processing audio for upload:', error)
      throw error
    }
  }

  /**
   * Cleans up blob URLs to prevent memory leaks
   * @param blobUrl - The blob URL to clean up
   */
  static cleanupBlobUrl(blobUrl: string): void {
    try {
      URL.revokeObjectURL(blobUrl)
      console.log('🧹 Blob URL cleaned up:', blobUrl)
    } catch (error) {
      console.warn('⚠️ Error cleaning up blob URL:', error)
    }
  }

  /**
   * Generates a unique filename for audio uploads
   * @param userId - The user ID
   * @param extension - The file extension
   * @returns Unique filename with timestamp
   */
  static generateFileName(userId: string, extension: AudioExtension): string {
    const timestamp = Date.now()
    return `audio_${timestamp}_${userId}.${extension}`
  }

  /**
   * Gets the file path for storage
   * @param userId - The user ID
   * @param fileName - The filename
   * @returns Full file path for storage
   */
  static getFilePath(userId: string, fileName: string): string {
    return `${userId}/${fileName}`
  }
}

/**
 * Audio format utilities for common operations
 */
export class AudioFormatUtils {
  /**
   * Checks if a MIME type is supported
   * @param mimeType - The MIME type to check
   * @returns True if supported, false otherwise
   */
  static isSupported(mimeType: string): boolean {
    return mimeType in AUDIO_CONFIG.SUPPORTED_FORMATS
  }

  /**
   * Gets the file extension for a MIME type
   * @param mimeType - The MIME type
   * @returns The file extension or default
   */
  static getExtension(mimeType: string): AudioExtension {
    return (
      AUDIO_CONFIG.SUPPORTED_FORMATS[mimeType as SupportedAudioFormat] ||
      AUDIO_CONFIG.DEFAULT_EXTENSION
    )
  }

  /**
   * Formats file size in human-readable format
   * @param bytes - Size in bytes
   * @returns Formatted size string
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}
