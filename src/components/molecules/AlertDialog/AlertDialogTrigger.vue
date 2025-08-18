<script setup lang="ts">
import { inject } from 'vue'
import { ALERT_DIALOG_CTX } from './alertDialogContext'

const ctx = inject(ALERT_DIALOG_CTX)
if (!ctx) throw new Error('AlertDialogTrigger must be used within AlertDialog')

const onClick = (e: MouseEvent) => {
  e.stopPropagation()
  ctx.setOpen(true)
}
</script>

<template>
  <button data-slot="alert-dialog-trigger" type="button" @click="onClick">
    <slot />
  </button>
</template>
