/**
 * Tests for audio utilities module
 * Following testing best practices:
 * - Arrange-Act-Assert pattern
 * - Descriptive test names
 * - Edge case coverage
 * - Mock external dependencies
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  AudioValidator,
  AudioProcessor,
  AudioFormatUtils,
  AUDIO_CONFIG,
  type AudioValidationResult,
  type AudioFormatInfo,
} from '../audioUtils'

// Mock fetch for testing
global.fetch = vi.fn() as unknown as typeof fetch

// Mock Audio constructor
const createMockAudio = (duration: number) => ({
  duration,
  currentSrc: 'test.mp3',
  addEventListener: vi.fn((event: string, callback: () => void) => {
    if (event === 'loadedmetadata') {
      setTimeout(callback, 0)
    }
  }),
  src: '',
})

describe('AudioValidator', () => {
  describe('validateBlob', () => {
    it('should validate a valid audio blob', () => {
      // Arrange
      const validBlob = new Blob(['audio data'], { type: 'audio/wav' })

      // Act
      const result = AudioValidator.validateBlob(validBlob)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject empty blob', () => {
      // Arrange
      const emptyBlob = new Blob([], { type: 'audio/wav' })

      // Act
      const result = AudioValidator.validateBlob(emptyBlob)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Audio blob is empty')
    })

    it('should reject blob that is too large', () => {
      // Arrange
      const largeBlob = new Blob(['x'.repeat(AUDIO_CONFIG.MAX_FILE_SIZE + 1)], {
        type: 'audio/wav',
      })

      // Act
      const result = AudioValidator.validateBlob(largeBlob)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Audio file too large')
    })

    it('should reject non-audio blob', () => {
      // Arrange
      const nonAudioBlob = new Blob(['text data'], { type: 'text/plain' })

      // Act
      const result = AudioValidator.validateBlob(nonAudioBlob)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid audio format')
    })
  })

  describe('getSupportedFormat', () => {
    it('should return correct format for supported MIME types', () => {
      // Arrange & Act
      const wavResult = AudioValidator.getSupportedFormat('audio/wav')
      const mp3Result = AudioValidator.getSupportedFormat('audio/mp3')
      const oggResult = AudioValidator.getSupportedFormat('audio/ogg')

      // Assert
      expect(wavResult).toEqual({ contentType: 'audio/wav', extension: 'wav' })
      expect(mp3Result).toEqual({ contentType: 'audio/mp3', extension: 'mp3' })
      expect(oggResult).toEqual({ contentType: 'audio/ogg', extension: 'ogg' })
    })

    it('should default to wav for unsupported MIME types', () => {
      // Arrange
      const unsupportedType = 'audio/unsupported'

      // Act
      const result = AudioValidator.getSupportedFormat(unsupportedType)

      // Assert
      expect(result.contentType).toBe(AUDIO_CONFIG.DEFAULT_FORMAT)
      expect(result.extension).toBe(AUDIO_CONFIG.DEFAULT_EXTENSION)
    })
  })

  describe('validateAudioFile', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should validate a valid audio file', async () => {
      // Arrange
      const mockBlob = new Blob(['audio data'], { type: 'audio/wav' })
      const mockResponse = { ok: true, blob: () => Promise.resolve(mockBlob) }
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      // Mock Audio element
      const mockAudio = createMockAudio(10.5)
      global.Audio = vi.fn(() => mockAudio as unknown as HTMLAudioElement)

      // Act
      const result = await AudioValidator.validateAudioFile('test.mp3')

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject file with HTTP error', async () => {
      // Arrange
      const mockResponse = { ok: false, status: 404, statusText: 'Not Found' }
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      // Act
      const result = await AudioValidator.validateAudioFile('test.mp3')

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('HTTP error: 404')
    })

    it('should reject empty blob', async () => {
      // Arrange
      const mockBlob = new Blob([], { type: 'audio/wav' })
      const mockResponse = { ok: true, blob: () => Promise.resolve(mockBlob) }
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      // Act
      const result = await AudioValidator.validateAudioFile('test.mp3')

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Audio file is empty')
    })
  })
})

describe('AudioProcessor', () => {
  describe('processBlobForUpload', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should process valid blob for upload', async () => {
      // Arrange
      const mockBlob = new Blob(['audio data'], { type: 'audio/wav' })
      const mockResponse = { ok: true, blob: () => Promise.resolve(mockBlob) }
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      // Act
      const result = await AudioProcessor.processBlobForUpload('blob:test', 'user123')

      // Assert
      expect(result.filePath).toContain('user123')
      expect(result.filePath).toContain('.wav')
    })

    it('should throw error for invalid blob', async () => {
      // Arrange
      const mockBlob = new Blob([], { type: 'audio/wav' })
      const mockResponse = { ok: true, blob: () => Promise.resolve(mockBlob) }
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      // Act & Assert
      await expect(AudioProcessor.processBlobForUpload('blob:test', 'user123')).rejects.toThrow(
        'Audio blob is empty',
      )
    })
  })

  describe('cleanupBlobUrl', () => {
    it('should cleanup blob URL successfully', () => {
      // Arrange
      const mockRevokeObjectURL = vi.fn()
      global.URL.revokeObjectURL = mockRevokeObjectURL

      // Act
      AudioProcessor.cleanupBlobUrl('blob:test')

      // Assert
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test')
    })

    it('should handle cleanup errors gracefully', () => {
      // Arrange
      const mockRevokeObjectURL = vi.fn().mockImplementation(() => {
        throw new Error('Cleanup failed')
      })
      global.URL.revokeObjectURL = mockRevokeObjectURL

      // Act & Assert (should not throw)
      expect(() => AudioProcessor.cleanupBlobUrl('blob:test')).not.toThrow()
    })
  })

  describe('generateFileName', () => {
    it('should generate unique filename with timestamp', () => {
      // Arrange
      const userId = 'user123'
      const extension = 'wav'

      // Act
      const fileName = AudioProcessor.generateFileName(userId, extension)

      // Assert
      expect(fileName).toContain('audio_')
      expect(fileName).toContain('_user123')
      expect(fileName).toContain('.wav')
    })
  })
})

describe('AudioFormatUtils', () => {
  describe('isSupported', () => {
    it('should return true for supported formats', () => {
      // Act & Assert
      expect(AudioFormatUtils.isSupported('audio/wav')).toBe(true)
      expect(AudioFormatUtils.isSupported('audio/mp3')).toBe(true)
      expect(AudioFormatUtils.isSupported('audio/ogg')).toBe(true)
    })

    it('should return false for unsupported formats', () => {
      // Act & Assert
      expect(AudioFormatUtils.isSupported('audio/unsupported')).toBe(false)
      expect(AudioFormatUtils.isSupported('text/plain')).toBe(false)
    })
  })

  describe('getExtension', () => {
    it('should return correct extension for supported formats', () => {
      // Act & Assert
      expect(AudioFormatUtils.getExtension('audio/wav')).toBe('wav')
      expect(AudioFormatUtils.getExtension('audio/mp3')).toBe('mp3')
      expect(AudioFormatUtils.getExtension('audio/ogg')).toBe('ogg')
    })

    it('should return default extension for unsupported formats', () => {
      // Act & Assert
      expect(AudioFormatUtils.getExtension('audio/unsupported')).toBe('wav')
    })
  })

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      // Act & Assert
      expect(AudioFormatUtils.formatFileSize(0)).toBe('0 Bytes')
      expect(AudioFormatUtils.formatFileSize(1024)).toBe('1 KB')
      expect(AudioFormatUtils.formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(AudioFormatUtils.formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should handle decimal sizes correctly', () => {
      // Act & Assert
      expect(AudioFormatUtils.formatFileSize(1500)).toBe('1.46 KB')
      expect(AudioFormatUtils.formatFileSize(1500 * 1024)).toBe('1.46 MB')
    })
  })
})

describe('AUDIO_CONFIG', () => {
  it('should have correct configuration values', () => {
    // Assert
    expect(AUDIO_CONFIG.MAX_FILE_SIZE).toBe(10 * 1024 * 1024) // 10MB
    expect(AUDIO_CONFIG.DEFAULT_FORMAT).toBe('audio/wav')
    expect(AUDIO_CONFIG.DEFAULT_EXTENSION).toBe('wav')
    expect(AUDIO_CONFIG.LOAD_TIMEOUT).toBe(5000)
    expect(AUDIO_CONFIG.MIN_DURATION).toBe(0.1)
  })

  it('should have all supported formats', () => {
    // Assert
    expect(Object.keys(AUDIO_CONFIG.SUPPORTED_FORMATS)).toHaveLength(6)
    expect(AUDIO_CONFIG.SUPPORTED_FORMATS).toHaveProperty('audio/wav')
    expect(AUDIO_CONFIG.SUPPORTED_FORMATS).toHaveProperty('audio/mp3')
    expect(AUDIO_CONFIG.SUPPORTED_FORMATS).toHaveProperty('audio/ogg')
    expect(AUDIO_CONFIG.SUPPORTED_FORMATS).toHaveProperty('audio/webm')
    expect(AUDIO_CONFIG.SUPPORTED_FORMATS).toHaveProperty('audio/mp4')
    expect(AUDIO_CONFIG.SUPPORTED_FORMATS).toHaveProperty('audio/aac')
  })
})
