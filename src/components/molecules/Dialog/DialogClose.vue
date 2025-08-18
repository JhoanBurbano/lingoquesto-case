<script setup lang="ts">
import { inject } from 'vue'
import { DIALOG_CTX } from './context'
const ctx = inject(DIALOG_CTX)!
</script>
<template>
  <button data-slot="dialog-close" type="button" @click="ctx.setOpen(false)">
    <slot />
  </button>
</template>
