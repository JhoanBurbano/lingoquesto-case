<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { defineComponent, useSlots, useAttrs, cloneVNode } from 'vue'
import { cn } from '@/utils'

const props = withDefaults(defineProps<{ asChild?: boolean; class?: string }>(), {
  asChild: false,
})

const slots = useSlots()
const attrs = useAttrs()

const RenderAsChild = defineComponent({
  setup(_, { slots, attrs }) {
    const vnode = slots.default?.()?.[0]
    if (!vnode) return () => null
    return () =>
      cloneVNode(vnode, {
        ...attrs,
        'data-slot': 'breadcrumb-link',
        class: cn(
          'hover:text-foreground transition-colors',
          (vnode.props as { class?: string })?.class,
          (attrs as { class?: string })?.class,
        ),
      })
  },
})
</script>

<template>
  <RenderAsChild v-if="props.asChild" :class="props.class">
    <slot />
  </RenderAsChild>
  <a
    v-else
    data-slot="breadcrumb-link"
    :class="cn('hover:text-foreground transition-colors', props.class)"
  >
    <slot />
  </a>
</template>
