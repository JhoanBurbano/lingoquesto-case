<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { inject } from 'vue'
import { ALERT_DIALOG_CTX } from './alertDialogContext'
import { buttonVariants } from '@/components/atoms/buttonVariants'
import { cn } from '@/utils'

const props = defineProps<{ class?: string }>()
const ctx = inject(ALERT_DIALOG_CTX)
if (!ctx) throw new Error('AlertDialogCancel must be used within AlertDialog')

const onClick = () => ctx.close()
</script>

<template>
  <button
    :class="cn(buttonVariants({ variant: 'outline' }), $props.class)"
    type="button"
    @click="onClick"
  >
    <slot />
  </button>
</template>
