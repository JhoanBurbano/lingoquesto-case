<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { inject } from 'vue'
import { ALERT_DIALOG_CTX } from './alertDialogContext'
import { cn } from '@/utils'
import AlertDialogPortal from './AlertDialogPortal.vue'
import AlertDialogOverlay from './AlertDialogOverlay.vue'

const props = defineProps<{ class?: string }>()
const ctx = inject(ALERT_DIALOG_CTX)
if (!ctx) throw new Error('AlertDialogContent must be used within AlertDialog')
</script>

<template>
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <div
      v-if="ctx.open.value"
      data-slot="alert-dialog-content"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          $props.class,
        )
      "
      data-state="open"
      role="alertdialog"
      aria-modal="true"
    >
      <slot />
    </div>
  </AlertDialogPortal>
</template>
