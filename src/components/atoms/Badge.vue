<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { defineComponent, useAttrs, useSlots, cloneVNode, computed } from 'vue'
import { badgeVariants } from './badgeVariants.ts'
import { cn } from '../../utils'

type Props = {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false,
})

const attrs = useAttrs()
const slots = useSlots()

// Emula Radix Slot: clona el primer hijo y le inyecta attrs/clases del Badge
const RenderAsChild = defineComponent({
  name: 'RenderAsChild',
  setup(_, { slots, attrs }) {
    return () => {
      const vnode = slots.default?.()?.[0]
      if (!vnode) return null
      return cloneVNode(vnode, {
        ...attrs,
        class: cn((vnode.props as { class: string })?.class, (attrs as { class: string })?.class),
      })
    }
  },
})

const classes = computed(() =>
  cn(badgeVariants({ variant: props.variant }), (attrs as { class: string }).class),
)
</script>

<template>
  <RenderAsChild v-if="asChild" data-slot="badge" :class="classes" v-bind="attrs">
    <slot />
  </RenderAsChild>

  <span v-else data-slot="badge" :class="classes" v-bind="attrs">
    <slot />
  </span>
</template>
