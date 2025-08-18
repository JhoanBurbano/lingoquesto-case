<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string; src?: string; alt?: string }>()
</script>

<template>
  <img
    data-slot="avatar-image"
    :src="props.src"
    :alt="props.alt"
    :class="cn('aspect-square size-full', props.class)"
  />
</template>
