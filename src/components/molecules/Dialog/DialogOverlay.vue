<script setup lang="ts">
import { inject } from 'vue'
import { DIALOG_CTX } from './context'
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
const ctx = inject(DIALOG_CTX)!
</script>

<template>
  <div
    v-if="ctx.open"
    data-slot="dialog-overlay"
    :class="
      cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        props.class,
      )
    "
    data-state="open"
  />
</template>
