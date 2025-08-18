/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, h, type PropType } from 'vue'
import {
  TabsRoot,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
  TabsContent as TabsContentPrimitive,
} from 'radix-vue'

/**
 * Wrapper API equivalente al de shadcn/react pero para Vue 3 con radix-vue.
 * Exporta: Tabs, TabsList, TabsTrigger, TabsContent.
 */

export const Tabs = defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Tabs',
  props: {
    modelValue: { type: [String, Number] as PropType<string | number | undefined>, default: undefined },
    defaultValue: { type: String as PropType<string | undefined>, default: undefined },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical' | undefined>,
      default: undefined,
    },
    dir: { type: String as PropType<'ltr' | 'rtl' | undefined>, default: undefined },
    activationMode: {
      type: String as PropType<'automatic' | 'manual' | undefined>,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const base = 'flex flex-col gap-2'
    return () =>
      h(
        TabsRoot,
        {
          ...attrs,
          modelValue: props.modelValue,
          defaultValue: props.defaultValue,
          orientation: props.orientation,
          dir: props.dir,
          activationMode: props.activationMode,
          'onUpdate:modelValue': (v: string | number) => emit('update:modelValue', v),
          class: [base, (attrs as any).class],
          'data-slot': 'tabs',
        },
        {
          default: (slotProps: { modelValue: string | number | undefined }) =>
            slots.default?.(slotProps),
        },
      )
  },
})

export const TabsList = defineComponent({
  name: 'TabsList',
  setup(_, { slots, attrs }) {
    const base =
      'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex'
    return () =>
      h(
        TabsListPrimitive,
        { ...attrs, class: [base, (attrs as any).class], 'data-slot': 'tabs-list' },
        slots,
      )
  },
})

export const TabsTrigger = defineComponent({
  name: 'TabsTrigger',
  props: {
    value: { type: [String, Number] as PropType<string | number>, required: true },
    asChild: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const base =
      "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    return () =>
      h(
        TabsTriggerPrimitive,
        {
          ...attrs,
          value: props.value,
          asChild: props.asChild,
          disabled: props.disabled,
          class: [base, (attrs as any).class],
          'data-slot': 'tabs-trigger',
        },
        slots,
      )
  },
})

export const TabsContent = defineComponent({
  name: 'TabsContent',
  props: {
    value: { type: [String, Number] as PropType<string | number>, required: true },
    forceMount: { type: Boolean, default: false },
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const base = 'flex-1 outline-none'
    return () =>
      h(
        TabsContentPrimitive,
        {
          ...attrs,
          value: props.value,
          forceMount: props.forceMount,
          asChild: props.asChild,
          class: [base, (attrs as any).class],
          'data-slot': 'tabs-content',
        },
        slots,
      )
  },
})

export default {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
}
