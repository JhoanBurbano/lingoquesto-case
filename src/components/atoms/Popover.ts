/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable vue/multi-word-component-names */
import { defineComponent, h, type PropType } from 'vue'
import {
  PopoverRoot,
  PopoverTrigger as PopoverTriggerPrimitive,
  PopoverContent as PopoverContentPrimitive,
  PopoverAnchor as PopoverAnchorPrimitive,
  PopoverPortal,
} from 'radix-vue'

/**
 * Wrapper API inspirado en shadcn/react pero para Vue 3.
 * Soporta <Popover v-model:open> y <PopoverTrigger as-child>.
 */

export const Popover = defineComponent({
  name: 'Popover',
  props: {
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    modal: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  setup(props, { slots, attrs, emit }) {
    const onUpdateOpen = (v: boolean) => emit('update:open', v)
    return () =>
      h(
        PopoverRoot,
        {
          ...attrs,
          open: props.open,
          defaultOpen: props.defaultOpen,
          modal: props.modal,
          'onUpdate:open': onUpdateOpen,
          'data-slot': 'popover',
        },
        slots,
      )
  },
})

export const PopoverTrigger = defineComponent({
  name: 'PopoverTrigger',
  props: { asChild: { type: Boolean, default: false } },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        PopoverTriggerPrimitive,
        { ...attrs, asChild: props.asChild, 'data-slot': 'popover-trigger' },
        slots,
      )
  },
})

export const PopoverContent = defineComponent({
  name: 'PopoverContent',
  props: {
    align: { type: String as PropType<'start' | 'center' | 'end'>, default: 'center' },
    sideOffset: { type: Number, default: 4 },
  },
  setup(props, { slots, attrs }) {
    const base =
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border p-4 shadow-md outline-hidden'

    return () =>
      h(PopoverPortal, null, {
        default: () =>
          h(
            PopoverContentPrimitive,
            {
              ...attrs,
              align: props.align,
              sideOffset: props.sideOffset,
              'data-slot': 'popover-content',
              class: [base, (attrs as any).class],
            },
            slots,
          ),
      })
  },
})

export const PopoverAnchor = defineComponent({
  name: 'PopoverAnchor',
  setup(_, { slots, attrs }) {
    return () => h(PopoverAnchorPrimitive, { ...attrs, 'data-slot': 'popover-anchor' }, slots)
  },
})

export default {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
}
