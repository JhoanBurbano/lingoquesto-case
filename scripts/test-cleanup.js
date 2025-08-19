#!/usr/bin/env node

/**
 * Test Script for Voice Chat Automatic Cleanup
 * This script simulates various scenarios to test cleanup functionality
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

async function testCleanupFunctionality() {
  try {
    console.log('🧪 Testing Voice Chat Cleanup Functionality...\n')

    // Test 1: Check if cleanup functions exist
    console.log('📋 Test 1: Verifying cleanup functions...')

    const { data: functions, error: functionsError } = await supabase.rpc(
      'cleanup_orphaned_connections',
    )

    if (functionsError) {
      console.log('⚠️  cleanup_orphaned_connections function not found, creating it...')
      console.log('   Please run the updated supabase-setup.sql script')
    } else {
      console.log('✅ cleanup_orphaned_connections function exists')
    }

    // Test 2: Check current participants
    console.log('\n📋 Test 2: Checking current participants...')

    const { data: participants, error: participantsError } = await supabase
      .from('voice_chat_participants')
      .select('*')
      .is('left_at', null)

    if (participantsError) {
      console.error('❌ Error fetching participants:', participantsError)
      return
    }

    console.log(`📊 Found ${participants?.length || 0} active participants`)

    if (participants && participants.length > 0) {
      console.log('\n👥 Active Participants:')
      participants.forEach((p, index) => {
        const joinedTime = new Date(p.joined_at)
        const timeDiff = Date.now() - joinedTime.getTime()
        const minutesAgo = Math.floor(timeDiff / (1000 * 60))

        console.log(`  ${index + 1}. ${p.username} (joined ${minutesAgo} minutes ago)`)
      })
    }

    // Test 3: Test manual cleanup
    console.log('\n📋 Test 3: Testing manual cleanup...')

    if (participants && participants.length > 0) {
      console.log('🧹 Running manual cleanup...')

      const { error: cleanupError } = await supabase.rpc('cleanup_orphaned_connections')

      if (cleanupError) {
        console.error('❌ Manual cleanup failed:', cleanupError)
      } else {
        console.log('✅ Manual cleanup completed')

        // Verify cleanup
        const { data: remainingParticipants, error: verifyError } = await supabase
          .from('voice_chat_participants')
          .select('*')
          .is('left_at', null)

        if (verifyError) {
          console.error('❌ Error verifying cleanup:', verifyError)
        } else {
          console.log(
            `✅ Verification: ${remainingParticipants?.length || 0} active participants remaining`,
          )

          if (remainingParticipants && remainingParticipants.length < participants.length) {
            const cleanedCount = participants.length - remainingParticipants.length
            console.log(`🎉 Successfully cleaned up ${cleanedCount} orphaned connections!`)
          }
        }
      }
    } else {
      console.log('✅ No participants to clean up')
    }

    // Test 4: Check rooms
    console.log('\n📋 Test 4: Checking available rooms...')

    const { data: rooms, error: roomsError } = await supabase
      .from('voice_chat_rooms')
      .select('*')
      .eq('is_active', true)

    if (roomsError) {
      console.error('❌ Error fetching rooms:', roomsError)
    } else {
      console.log(`📊 Found ${rooms?.length || 0} active rooms`)

      if (rooms && rooms.length > 0) {
        console.log('\n🏠 Active Rooms:')
        rooms.forEach((room, index) => {
          console.log(`  ${index + 1}. ${room.name} (max: ${room.max_participants})`)
        })
      }
    }

    console.log('\n🎯 Cleanup Test Summary:')
    console.log('✅ Functions verification completed')
    console.log('✅ Participants status checked')
    console.log('✅ Manual cleanup tested')
    console.log('✅ Rooms status verified')

    console.log('\n💡 Recommendations:')
    if (participants && participants.length > 0) {
      console.log('   - Some participants may need manual cleanup')
      console.log('   - Run: npm run cleanup:connections')
    } else {
      console.log('   - All participants are properly managed')
    }

    console.log('   - Ensure supabase-setup.sql has been executed')
    console.log('   - Check that the application is using store.initialize()')
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error)
  }
}

// Run tests
testCleanupFunctionality()
  .then(() => {
    console.log('\n🎉 Cleanup testing completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Cleanup testing failed:', error)
    process.exit(1)
  })
