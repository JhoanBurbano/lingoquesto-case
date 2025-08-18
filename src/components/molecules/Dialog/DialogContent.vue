<script setup lang="ts">
import { inject } from 'vue'
import { DIALOG_CTX } from './context'
import { cn } from '@/utils'
import DialogPortal from './DialogPortal.vue'
import DialogOverlay from './DialogOverlay.vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{ class?: string }>()
const ctx = inject(DIALOG_CTX)!
</script>

<template>
  <DialogPortal>
    <DialogOverlay />
    <div
      v-if="ctx.open"
      data-slot="dialog-content"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          props.class,
        )
      "
      data-state="open"
      role="dialog"
      aria-modal="true"
    >
      <slot />
      <button
        class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        type="button"
        @click="ctx.setOpen(false)"
      >
        <X />
        <span class="sr-only">Close</span>
      </button>
    </div>
  </DialogPortal>
</template>
