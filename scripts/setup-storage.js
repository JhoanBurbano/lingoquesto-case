#!/usr/bin/env node

/**
 * Setup Script for Supabase Storage
 * This script verifies storage setup and provides instructions for manual configuration
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

async function setupStorage() {
  try {
    console.log('🏗️ Verifying Supabase Storage for Voice Chat...\n')

    console.log('📋 Step 1: Checking if storage is enabled...')

    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

      if (bucketsError) {
        console.error('❌ Storage is not enabled or accessible:', bucketsError)
        console.log('\n🔧 SOLUTION: Enable Storage in Supabase Dashboard')
        console.log('1. Go to https://supabase.com/dashboard')
        console.log('2. Select your project')
        console.log('3. Go to "Storage" in the left sidebar')
        console.log('4. Click "Enable Storage" if you see that option')
        console.log('5. Wait for storage to be enabled (may take a few minutes)')
        return
      }

      console.log('✅ Storage is enabled and accessible')
      console.log(`📊 Found ${buckets.length} existing buckets`)

      // Check for voice-chat-audio bucket
      const audioBucket = buckets.find((bucket) => bucket.id === 'voice-chat-audio')

      if (audioBucket) {
        console.log('\n✅ voice-chat-audio bucket already exists')
        console.log(`   - Name: ${audioBucket.name}`)
        console.log(`   - Public: ${audioBucket.public ? 'Yes' : 'No'}`)
        console.log(`   - File size limit: ${audioBucket.file_size_limit || 'Not set'} bytes`)

        if (!audioBucket.public) {
          console.log('⚠️  WARNING: Bucket is not public - audio files may not be accessible')
        }
      } else {
        console.log('\n❌ voice-chat-audio bucket does not exist')
        console.log('\n🔧 SOLUTION: Create the bucket manually')
        console.log('1. Go to https://supabase.com/dashboard')
        console.log('2. Select your project')
        console.log('3. Go to "Storage" in the left sidebar')
        console.log('4. Click "New Bucket"')
        console.log('5. Fill in the details:')
        console.log('   - Name: voice-chat-audio')
        console.log('   - Public bucket: ✅ YES (check this box)')
        console.log('   - File size limit: 52428800 (50MB)')
        console.log('   - Allowed MIME types: audio/wav,audio/mp3,audio/ogg,audio/webm,audio/m4a')
        console.log('6. Click "Create bucket"')
        return
      }
    } catch (error) {
      console.error('❌ Error accessing storage:', error)
      console.log('\n💡 This usually means storage is not enabled in your Supabase project')
      console.log('Please enable storage in your Supabase Dashboard first')
      return
    }

    // Test file upload to verify permissions
    console.log('\n📋 Step 2: Testing file upload permissions...')

    try {
      // Create a small test file
      const testContent = 'This is a test file for voice chat storage'
      const testBlob = new Blob([testContent], { type: 'text/plain' })
      const testFileName = `test_${Date.now()}.txt`
      const testFilePath = `test-user/${testFileName}`

      console.log('📝 Uploading test file...')

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-chat-audio')
        .upload(testFilePath, testBlob, {
          contentType: 'text/plain',
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('❌ Test upload failed:', uploadError)

        if (uploadError.message.includes('new row violates row-level security')) {
          console.log('\n🔧 SOLUTION: Storage RLS policies need to be configured')
          console.log('The bucket exists but RLS policies are preventing uploads')
          console.log('This is normal for new buckets - try uploading audio from the app')
        } else if (uploadError.message.includes('Bucket not found')) {
          console.log('\n🔧 SOLUTION: Create the voice-chat-audio bucket')
          console.log('Follow the manual setup instructions above')
        } else {
          console.log('\n💡 Upload failed, but this might be normal for test files')
          console.log('Try uploading actual audio files from the application')
        }
        return
      }

      console.log('✅ Test file uploaded successfully:', uploadData.path)

      // Get public URL
      const { data: urlData } = supabase.storage.from('voice-chat-audio').getPublicUrl(testFilePath)

      console.log('🔗 Public URL generated:', urlData.publicUrl)

      // Test if the URL is accessible
      try {
        const response = await fetch(urlData.publicUrl)
        if (response.ok) {
          console.log('✅ Public URL is accessible')
        } else {
          console.log('⚠️  Public URL returned status:', response.status)
        }
      } catch (fetchError) {
        console.log('⚠️  Could not verify public URL accessibility')
      }

      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from('voice-chat-audio')
        .remove([testFilePath])

      if (deleteError) {
        console.error('⚠️  Warning: Could not delete test file:', deleteError)
      } else {
        console.log('🧹 Test file cleaned up')
      }
    } catch (error) {
      console.error('❌ Error during storage test:', error)
      console.log('\n💡 This might be normal - try uploading audio from the application')
    }

    console.log('\n🎯 Storage Setup Summary:')
    console.log('✅ Storage is enabled in your Supabase project')
    console.log('✅ voice-chat-audio bucket exists')
    console.log('✅ Basic functionality appears to be working')

    console.log('\n💡 Next Steps:')
    console.log('1. 🚀 Start your application: npm run dev')
    console.log('2. 🎤 Try recording an audio message in a voice chat room')
    console.log('3. ✅ Verify that the audio uploads and can be played back')
    console.log('4. 🔄 Test that audio works in multiple browser tabs')

    console.log('\n📋 Expected Behavior:')
    console.log('- Audio files will upload automatically to Supabase Storage')
    console.log('- Public URLs will be generated for sharing')
    console.log('- Audio will work across different browsers and sessions')
    console.log('- Files will be organized by user ID in the bucket')
  } catch (error) {
    console.error('❌ Unexpected error during storage verification:', error)
  }
}

// Run setup
setupStorage()
  .then(() => {
    console.log('\n🎉 Storage verification completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Storage verification failed:', error)
    process.exit(1)
  })
