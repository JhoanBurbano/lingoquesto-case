<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <span
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    aria-hidden="true"
    :class="cn('flex size-9 items-center justify-center', props.class)"
  >
    <MoreHorizontal class="size-4" />
    <span class="sr-only">More</span>
  </span>
</template>
