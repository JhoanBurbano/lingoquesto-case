<script setup lang="ts">
import { inject } from 'vue'
import { DIALOG_CTX } from './context'
const ctx = inject(DIALOG_CTX)!
</script>

<template>
  <button data-slot="dialog-trigger" type="button" @click="ctx.setOpen(true)">
    <slot />
  </button>
</template>
