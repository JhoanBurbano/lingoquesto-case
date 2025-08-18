<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { inject } from 'vue'
import { ALERT_DIALOG_CTX } from './alertDialogContext'
import { cn } from '@/utils'

const props = defineProps<{ class?: string }>()
const ctx = inject(ALERT_DIALOG_CTX)
if (!ctx) throw new Error('AlertDialogOverlay must be used within AlertDialog')
</script>

<template>
  <div
    v-if="ctx.open.value"
    data-slot="alert-dialog-overlay"
    :class="
      cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        $props.class,
      )
    "
    data-state="open"
  />
</template>
