<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    ratio?: number
  }>(),
  {
    ratio: 1,
  },
)

const attrs = useAttrs()
const styleObj = computed(() => ({ aspectRatio: String(props.ratio) }))
</script>

<template>
  <div data-slot="aspect-ratio" :style="styleObj" v-bind="attrs">
    <slot />
  </div>
</template>
