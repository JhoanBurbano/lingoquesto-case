<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }>(),
  {
    orientation: 'horizontal',
    decorative: true,
  },
)

const attrs = useAttrs()
const role = computed(() => (props.decorative ? 'none' : 'separator'))
</script>

<template>
  <div
    data-slot="separator-root"
    :role="role"
    :aria-orientation="decorative ? undefined : orientation"
    :data-orientation="orientation"
    class="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
    v-bind="attrs"
  />
</template>
