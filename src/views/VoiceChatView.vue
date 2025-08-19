<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">LingoQuesto Voice Chat</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Join voice chat rooms to practice languages with other learners in real-time. Connect with
          up to 20 participants simultaneously.
        </p>
      </div>

      <VoiceChatRoom />
    </div>
  </div>
</template>

<script setup lang="ts">
import VoiceChatRoom from '@/components/VoiceChat/VoiceChatRoom.vue'
</script>

<style scoped></style>
