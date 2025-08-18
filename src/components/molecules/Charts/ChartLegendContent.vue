<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { cn } from '@/utils'
import { useChart } from './useChart'

const props = withDefaults(
  defineProps<{
    class?: string
    hideIcon?: boolean
    payload?: any[]
    verticalAlign?: 'top' | 'bottom'
    nameKey?: string
  }>(),
  {
    hideIcon: false,
    payload: () => [],
    verticalAlign: 'bottom',
  },
)
const { config } = useChart()
</script>

<template>
  <div
    v-if="props.payload?.length"
    :class="
      cn(
        'flex items-center justify-center gap-4',
        props.verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        props.class,
      )
    "
  >
    <div
      v-for="item in props.payload"
      :key="item.value"
      class="[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
    >
      <div
        v-if="props.hideIcon === false"
        class="h-2 w-2 shrink-0 rounded-[2px]"
        :style="{ backgroundColor: item.color }"
      />
      {{ (config[(props.nameKey || item.dataKey || 'value') as string] || {}).label }}
    </div>
  </div>
</template>
