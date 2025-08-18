<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { cloneVNode, useAttrs, defineComponent, computed, type Component, useSlots } from 'vue'
import { buttonVariants } from './buttonVariants.ts'
import { cn } from '../../utils'

type Props = {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
  as?: string | Component
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false,
  as: 'button',
})

const attrs = useAttrs()
const _slots = useSlots()

// Componente interno para emular "asChild" (estilo Radix Slot)
// Clona el primer hijo del slot y le inyecta props/clases del botón.
const RenderAsChild = defineComponent({
  name: 'RenderAsChild',
  setup(_, { slots: _slots, attrs }) {
    return () => {
      const children = _slots.default?.()
      const vnode = children?.[0]
      if (!vnode) return null
      // fusionar class y demás attrs en el hijo
      return cloneVNode(vnode, {
        ...attrs,
        class: cn((vnode.props as { class: string })?.class, (attrs as { class: string })?.class),
        'data-slot': 'button',
      })
    }
  },
})

const classes = computed(() =>
  cn(
    buttonVariants({ variant: props.variant, size: props.size }),
    (attrs as { class: string }).class,
  ),
)
</script>

<template>
  <RenderAsChild v-if="asChild" :class="classes" v-bind="attrs">
    <slot />
  </RenderAsChild>

  <component v-else :is="as" data-slot="button" :class="classes" v-bind="attrs" type="button">
    <slot />
  </component>
</template>
