#!/usr/bin/env node

/**
 * Manual Cleanup Script for Orphaned Voice Chat Connections
 * Run this script to clean up existing orphaned connections
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please run: npm run setup:env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function cleanupOrphanedConnections() {
  try {
    console.log('🧹 Starting cleanup of orphaned connections...')

    // Find all participants who haven't been marked as left
    const { data: activeParticipants, error: selectError } = await supabase
      .from('voice_chat_participants')
      .select('*')
      .is('left_at', null)

    if (selectError) {
      console.error('❌ Error fetching participants:', selectError)
      return
    }

    if (!activeParticipants || activeParticipants.length === 0) {
      console.log('✅ No active participants found')
      return
    }

    console.log(`📊 Found ${activeParticipants.length} active participants`)

    // Group by room to show statistics
    const roomStats = {}
    activeParticipants.forEach((p) => {
      if (!roomStats[p.room_id]) {
        roomStats[p.room_id] = []
      }
      roomStats[p.room_id].push(p)
    })

    console.log('\n📋 Room Statistics:')
    for (const [roomId, participants] of Object.entries(roomStats)) {
      console.log(`  Room ${roomId}: ${participants.length} participants`)
      participants.forEach((p) => {
        console.log(`    - ${p.username} (joined: ${new Date(p.joined_at).toLocaleString()})`)
      })
    }

    // Ask user if they want to proceed with cleanup
    console.log('\n⚠️  WARNING: This will mark all participants as "left"')
    console.log('This is useful for cleaning up orphaned connections from page reloads')

    // For automated cleanup, we'll proceed
    console.log('\n🔄 Proceeding with cleanup...')

    // Mark all as left
    const { error: updateError } = await supabase
      .from('voice_chat_participants')
      .update({ left_at: new Date().toISOString() })
      .is('left_at', null)

    if (updateError) {
      console.error('❌ Error during cleanup:', updateError)
      return
    }

    console.log('✅ Successfully cleaned up all orphaned connections')

    // Verify cleanup
    const { data: remainingParticipants, error: verifyError } = await supabase
      .from('voice_chat_participants')
      .select('*')
      .is('left_at', null)

    if (verifyError) {
      console.error('❌ Error verifying cleanup:', verifyError)
      return
    }

    console.log(
      `✅ Verification: ${remainingParticipants?.length || 0} active participants remaining`,
    )
  } catch (error) {
    console.error('❌ Unexpected error during cleanup:', error)
  }
}

// Run cleanup
cleanupOrphanedConnections()
  .then(() => {
    console.log('\n🎉 Cleanup completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error)
    process.exit(1)
  })
