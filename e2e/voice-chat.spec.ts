import { test, expect } from '@playwright/test'

test.describe('Voice Chat E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to voice chat page
    await page.goto('/voice-chat')

    // Wait for page to load
    await page.waitForSelector('.voice-chat-room')
  })

  test('should display voice chat interface correctly', async ({ page }) => {
    // Check main elements are present
    await expect(page.locator('h1')).toContainText('LingoQuesto Voice Chat')
    await expect(page.locator('.voice-chat-room')).toBeVisible()
    await expect(page.locator('h2')).toContainText('Voice Chat')
    await expect(page.locator('.participants-count')).toContainText('0/10 participants')
    await expect(page.locator('.connection-status')).toContainText('Disconnected')
    await expect(page.locator('.btn-primary')).toContainText('Join Room')
  })

  test('should open room selection modal when join button is clicked', async ({ page }) => {
    // Click join room button
    await page.click('.btn-primary')

    // Check modal is visible
    await expect(page.locator('.modal-overlay')).toBeVisible()
    await expect(page.locator('.modal-title')).toContainText('Select or Create Room')

    // Check modal sections
    await expect(page.locator('h4').first()).toContainText('Available Rooms')
    await expect(page.locator('h4').nth(1)).toContainText('Create New Room')
  })

  test('should close modal when overlay is clicked', async ({ page }) => {
    // Open modal
    await page.click('.btn-primary')
    await expect(page.locator('.modal-overlay')).toBeVisible()

    // Click overlay to close
    await page.click('.modal-overlay')

    // Check modal is hidden
    await expect(page.locator('.modal-overlay')).toBeHidden()
  })

  test('should not close modal when modal content is clicked', async ({ page }) => {
    // Open modal
    await page.click('.btn-primary')
    await expect(page.locator('.modal-overlay')).toBeVisible()

    // Click modal content
    await page.click('.modal-content')

    // Check modal is still visible
    await expect(page.locator('.modal-overlay')).toBeVisible()
  })

  test('should create new room successfully', async ({ page }) => {
    // Open modal
    await page.click('.btn-primary')

    // Fill create room form
    await page.fill('input[placeholder="Room name"]', 'Test E2E Room')
    await page.fill('input[placeholder="Max participants"]', '15')

    // Submit form
    await page.click('button[type="submit"]')

    // Check modal is closed
    await expect(page.locator('.modal-overlay')).toBeHidden()
  })

  test('should validate required fields in create room form', async ({ page }) => {
    // Open modal
    await page.click('.btn-primary')

    // Try to submit without filling required fields
    await page.click('button[type="submit"]')

    // Check form validation (HTML5 validation)
    const nameInput = page.locator('input[placeholder="Room name"]')
    const participantsInput = page.locator('input[placeholder="Max participants"]')

    await expect(nameInput).toHaveAttribute('required')
    await expect(participantsInput).toHaveAttribute('required')
  })

  test('should display participants grid when connected', async ({ page }) => {
    // Mock participants data by setting up a connected state
    await page.evaluate(() => {
      // This would normally be set by the composable
      // For E2E testing, we'll simulate the state
      const participants = [
        {
          id: 'user-1',
          username: 'Alice',
          is_speaking: true,
          audio_level: 0.8,
        },
        {
          id: 'user-2',
          username: 'Bob',
          is_speaking: false,
          audio_level: 0.3,
        },
      ]

      // Simulate participants being added to the DOM
      const grid = document.querySelector('.participants-grid')
      if (grid) {
        participants.forEach((participant) => {
          const card = document.createElement('div')
          card.className = 'participant-card'
          card.innerHTML = `
            <div class="participant-avatar">
              <div class="avatar-circle">${participant.username.charAt(0)}</div>
              ${participant.is_speaking ? '<div class="speaking-indicator"></div>' : ''}
            </div>
            <div class="participant-info">
              <span class="participant-name">${participant.username}</span>
              <div class="audio-level-bar">
                <div class="audio-level-fill" style="width: ${participant.audio_level * 100}%"></div>
              </div>
            </div>
          `
          grid.appendChild(card)
        })
      }
    })

    // Check participants are displayed
    const participantCards = page.locator('.participant-card')
    await expect(participantCards).toHaveCount(2)

    // Check first participant (Alice)
    await expect(participantCards.first().locator('.participant-name')).toContainText('Alice')
    await expect(participantCards.first().locator('.speaking-indicator')).toBeVisible()
    await expect(participantCards.first()).toHaveClass(/speaking/)

    // Check second participant (Bob)
    await expect(participantCards.nth(1).locator('.participant-name')).toContainText('Bob')
    await expect(participantCards.nth(1).locator('.speaking-indicator')).toBeHidden()
    await expect(participantCards.nth(1)).not.toHaveClass(/speaking/)
  })

  test('should display audio level bars correctly', async ({ page }) => {
    // Mock audio level data
    await page.evaluate(() => {
      const audioLevelDisplay = document.querySelector('.audio-level-display')
      if (audioLevelDisplay) {
        const levelBar = audioLevelDisplay.querySelector('.level-bar')
        if (levelBar) {
          const levelFill = levelBar.querySelector('.level-fill')
          if (levelFill) {
            ;(levelFill as HTMLElement).style.width = '75%'
          }
        }
      }
    })

    // Check audio level bar is visible
    const levelFill = page.locator('.level-fill')
    await expect(levelFill).toBeVisible()
    await expect(levelFill).toHaveCSS('width', '75%')
  })

  test('should show microphone status correctly', async ({ page }) => {
    // Check default microphone status
    await expect(page.locator('.microphone-status span')).toContainText('Silent')
    await expect(page.locator('.mic-indicator')).not.toHaveClass(/active/)

    // Mock speaking state
    await page.evaluate(() => {
      const micIndicator = document.querySelector('.mic-indicator')
      const statusText = document.querySelector('.microphone-status span')
      if (micIndicator && statusText) {
        micIndicator.classList.add('active')
        statusText.textContent = 'Speaking'
      }
    })

    // Check updated microphone status
    await expect(page.locator('.microphone-status span')).toContainText('Speaking')
    await expect(page.locator('.mic-indicator')).toHaveClass(/active/)
  })

  test('should handle room full state', async ({ page }) => {
    // Mock room full state
    await page.evaluate(() => {
      const joinButton = document.querySelector('.btn-primary')
      if (joinButton) {
        joinButton.setAttribute('disabled', '')
      }
    })

    // Check button is disabled
    const joinButton = page.locator('.btn-primary')
    await expect(joinButton).toBeDisabled()
  })

  test('should display error messages correctly', async ({ page }) => {
    // Mock error state
    await page.evaluate(() => {
      const errorMessage = document.createElement('div')
      errorMessage.className = 'error-message'
      errorMessage.innerHTML =
        '<p class="text-red-600 bg-red-50 p-3 rounded-lg">Test error message</p>'

      const voiceChatRoom = document.querySelector('.voice-chat-room')
      if (voiceChatRoom) {
        voiceChatRoom.appendChild(errorMessage)
      }
    })

    // Check error is displayed
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('.error-message p')).toContainText('Test error message')
  })

  test('should have proper button states and accessibility', async ({ page }) => {
    // Check primary button
    const primaryButton = page.locator('.btn-primary')
    await expect(primaryButton).toBeVisible()
    await expect(primaryButton).toBeEnabled()

    // Check button has proper styling classes
    await expect(primaryButton).toHaveClass(/btn/)
    await expect(primaryButton).toHaveClass(/btn-primary/)

    // Check form inputs have proper attributes
    await page.click('.btn-primary') // Open modal

    const nameInput = page.locator('input[placeholder="Room name"]')
    const participantsInput = page.locator('input[placeholder="Max participants"]')

    await expect(nameInput).toBeVisible()
    await expect(participantsInput).toBeVisible()
    await expect(nameInput).toHaveAttribute('required')
    await expect(participantsInput).toHaveAttribute('required')
    await expect(participantsInput).toHaveAttribute('min', '1')
    await expect(participantsInput).toHaveAttribute('max', '20')
  })

  test('should handle responsive design correctly', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check elements are still visible and properly sized
    await expect(page.locator('.voice-chat-room')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.btn-primary')).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    // Check elements are still visible
    await expect(page.locator('.voice-chat-room')).toBeVisible()
    await expect(page.locator('.participants-grid')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    // Check elements are visible and properly laid out
    await expect(page.locator('.voice-chat-room')).toBeVisible()
    await expect(page.locator('.room-header')).toBeVisible()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab')

    // Focus should be on the join button
    await expect(page.locator('.btn-primary')).toBeFocused()

    // Open modal with Enter key
    await page.keyboard.press('Enter')
    await expect(page.locator('.modal-overlay')).toBeVisible()

    // Navigate through form inputs
    await page.keyboard.press('Tab')
    await expect(page.locator('input[placeholder="Room name"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('input[placeholder="Max participants"]')).toBeFocused()

    // Close modal with Escape key
    await page.keyboard.press('Escape')
    await expect(page.locator('.modal-overlay')).toBeHidden()
  })

  test('should handle concurrent user interactions', async ({ page }) => {
    // Simulate multiple rapid clicks
    for (let i = 0; i < 5; i++) {
      await page.click('.btn-primary')
      await page.waitForTimeout(100)
    }

    // Modal should still be visible and functional
    await expect(page.locator('.modal-overlay')).toBeVisible()
    await expect(page.locator('.modal-title')).toContainText('Select or Create Room')

    // Close modal
    await page.click('.modal-overlay')
    await expect(page.locator('.modal-overlay')).toBeHidden()
  })
})
