// Test Supabase Connection and Tables
console.log('🧪 Testing Supabase connection and tables...')

// Test basic connection
async function testSupabaseConnection() {
  try {
    console.log('🔗 Testing basic connection...')

    // Import Supabase client
    const { supabase } = await import('@/lib/supabase')

    // Test connection
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('❌ Connection test failed:', error)
      return false
    }

    console.log('✅ Basic connection successful')
    return true
  } catch (error) {
    console.error('❌ Import error:', error)
    return false
  }
}

// Test tables existence
async function testTables() {
  try {
    console.log('🗄️ Testing tables...')

    const { supabase } = await import('@/lib/supabase')

    // Test voice_chat_rooms table
    const { data: rooms, error: roomsError } = await supabase
      .from('voice_chat_rooms')
      .select('count')
      .limit(1)

    if (roomsError) {
      console.error('❌ voice_chat_rooms table error:', roomsError)
      return false
    }

    console.log('✅ voice_chat_rooms table accessible')

    // Test voice_chat_participants table
    const { data: participants, error: participantsError } = await supabase
      .from('voice_chat_participants')
      .select('count')
      .limit(1)

    if (participantsError) {
      console.error('❌ voice_chat_participants table error:', participantsError)
      return false
    }

    console.log('✅ voice_chat_participants table accessible')

    // Test voice_messages table
    const { data: messages, error: messagesError } = await supabase
      .from('voice_messages')
      .select('count')
      .limit(1)

    if (messagesError) {
      console.error('❌ voice_messages table error:', messagesError)
      return false
    }

    console.log('✅ voice_messages table accessible')

    return true
  } catch (error) {
    console.error('❌ Tables test error:', error)
    return false
  }
}

// Test realtime subscriptions
async function testRealtime() {
  try {
    console.log('📡 Testing realtime subscriptions...')

    const { supabase } = await import('@/lib/supabase')

    // Test subscription to voice_chat_rooms
    const channel = supabase
      .channel('test-rooms')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voice_chat_rooms',
        },
        (payload) => {
          console.log('🔄 Realtime test received:', payload)
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime subscription successful')
        } else {
          console.error('❌ Realtime subscription failed:', status)
        }
      })

    // Cleanup after 5 seconds
    setTimeout(() => {
      channel.unsubscribe()
      console.log('🧹 Realtime test cleanup completed')
    }, 5000)

    return true
  } catch (error) {
    console.error('❌ Realtime test error:', error)
    return false
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive Supabase tests...')

  const connectionTest = await testSupabaseConnection()
  const tablesTest = await testTables()
  const realtimeTest = await testRealtime()

  console.log('\n📊 Test Results:')
  console.log('🔗 Connection:', connectionTest ? '✅ PASS' : '❌ FAIL')
  console.log('🗄️ Tables:', tablesTest ? '✅ PASS' : '❌ FAIL')
  console.log('📡 Realtime:', realtimeTest ? '✅ PASS' : '❌ FAIL')

  if (connectionTest && tablesTest && realtimeTest) {
    console.log('\n🎉 All tests passed! Supabase is ready for voice chat.')
  } else {
    console.log('\n⚠️ Some tests failed. Check the configuration.')
  }
}

// Auto-run tests
runAllTests()
