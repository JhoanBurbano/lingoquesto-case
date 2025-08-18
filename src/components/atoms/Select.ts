/* eslint-disable vue/multi-word-component-names */
/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, h, type PropType } from 'vue'
import {
  SelectRoot,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue as SelectValuePrimitive,
  SelectIcon as SelectIconPrimitive,
  SelectPortal,
  SelectContent as SelectContentPrimitive,
  SelectViewport as SelectViewportPrimitive,
  SelectGroup as SelectGroupPrimitive,
  SelectLabel as SelectLabelPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectItemText as SelectItemTextPrimitive,
  SelectItemIndicator as SelectItemIndicatorPrimitive,
  SelectSeparator as SelectSeparatorPrimitive,
  SelectScrollUpButton as SelectScrollUpButtonPrimitive,
  SelectScrollDownButton as SelectScrollDownButtonPrimitive,
} from 'radix-vue'
import { Check, ChevronDown, ChevronUp } from 'lucide-vue-next'

/**
 * Wrapper API equivalente al de shadcn/react pero para Vue 3 con radix-vue.
 * Exporta: Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectSeparator,
 *          SelectScrollUpButton, SelectScrollDownButton
 */

export const Select = defineComponent({
  name: 'Select',
  props: {
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    value: { type: String as PropType<string | undefined>, default: undefined },
    defaultValue: { type: String as PropType<string | undefined>, default: undefined },
    dir: { type: String as PropType<'ltr' | 'rtl' | undefined>, default: undefined },
    name: { type: String as PropType<string | undefined>, default: undefined },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
  },
  emits: ['update:open', 'update:value'],
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        SelectRoot,
        {
          ...attrs,
          open: props.open,
          defaultOpen: props.defaultOpen,
          value: props.value,
          defaultValue: props.defaultValue,
          dir: props.dir,
          name: props.name,
          disabled: props.disabled,
          required: props.required,
          'onUpdate:open': (v: boolean) => emit('update:open', v),
          'onUpdate:value': (v: string) => emit('update:value', v),
          'data-slot': 'select',
        },
        slots,
      )
  },
})

export const SelectGroup = defineComponent({
  name: 'SelectGroup',
  setup(_, { slots, attrs }) {
    return () => h(SelectGroupPrimitive, { ...attrs, 'data-slot': 'select-group' }, slots)
  },
})

export const SelectValue = defineComponent({
  name: 'SelectValue',
  setup(_, { slots, attrs }) {
    return () => h(SelectValuePrimitive, { ...attrs, 'data-slot': 'select-value' }, slots)
  },
})

export const SelectTrigger = defineComponent({
  name: 'SelectTrigger',
  props: {
    size: { type: String as PropType<'sm' | 'default'>, default: 'default' },
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const base =
      "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

    return () =>
      h(
        SelectTriggerPrimitive,
        {
          ...attrs,
          asChild: props.asChild,
          'data-size': props.size,
          class: [base, (attrs as any).class],
          'data-slot': 'select-trigger',
        },
        {
          default: () => [
            slots.default?.(),
            h(
              SelectIconPrimitive,
              { asChild: true },
              {
                default: () => h(ChevronDown, { class: 'size-4 opacity-50' }),
              },
            ),
          ],
        },
      )
  },
})

export const SelectContent = defineComponent({
  name: 'SelectContent',
  props: {
    position: { type: String as PropType<'item-aligned' | 'popper'>, default: 'popper' },
  },
  setup(props, { slots, attrs }) {
    const base =
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border shadow-md'

    return () =>
      h(SelectPortal, null, {
        default: () =>
          h(
            SelectContentPrimitive,
            {
              ...attrs,
              position: props.position,
              class: [
                base,
                props.position === 'popper' &&
                  'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                (attrs as any).class,
              ],
              'data-slot': 'select-content',
            },
            {
              default: () => [
                h(SelectScrollUpButton),
                h(
                  SelectViewportPrimitive,
                  {
                    class: [
                      'p-1',
                      props.position === 'popper' &&
                        'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
                    ],
                  },
                  { default: () => slots.default?.() },
                ),
                h(SelectScrollDownButton),
              ],
            },
          ),
      })
  },
})

export const SelectLabel = defineComponent({
  name: 'SelectLabel',
  setup(_, { slots, attrs }) {
    return () =>
      h(
        SelectLabelPrimitive,
        {
          ...attrs,
          class: ['text-muted-foreground px-2 py-1.5 text-xs', (attrs as any).class],
          'data-slot': 'select-label',
        },
        slots,
      )
  },
})

export const SelectItem = defineComponent({
  name: 'SelectItem',
  props: {
    value: { type: String as PropType<string>, required: true },
    disabled: { type: Boolean, default: false },
    textValue: { type: String as PropType<string | undefined>, default: undefined },
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const base =
      "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"

    return () =>
      h(
        SelectItemPrimitive,
        {
          ...attrs,
          value: props.value,
          disabled: props.disabled,
          textValue: props.textValue,
          asChild: props.asChild,
          class: [base, (attrs as any).class],
          'data-slot': 'select-item',
        },
        {
          default: () => [
            h('span', { class: 'absolute right-2 flex size-3.5 items-center justify-center' }, [
              h(SelectItemIndicatorPrimitive, null, {
                default: () => h(Check, { class: 'size-4' }),
              }),
            ]),
            h(SelectItemTextPrimitive, null, { default: () => slots.default?.() }),
          ],
        },
      )
  },
})

export const SelectSeparator = defineComponent({
  name: 'SelectSeparator',
  setup(_, { slots, attrs }) {
    return () =>
      h(
        SelectSeparatorPrimitive,
        {
          ...attrs,
          class: ['bg-border pointer-events-none -mx-1 my-1 h-px', (attrs as any).class],
          'data-slot': 'select-separator',
        },
        slots,
      )
  },
})

export const SelectScrollUpButton = defineComponent({
  name: 'SelectScrollUpButton',
  setup(_, { slots, attrs }) {
    return () =>
      h(
        SelectScrollUpButtonPrimitive,
        {
          ...attrs,
          class: ['flex cursor-default items-center justify-center py-1', (attrs as any).class],
          'data-slot': 'select-scroll-up-button',
        },
        { default: () => h(ChevronUp, { class: 'size-4' }) },
      )
  },
})

export const SelectScrollDownButton = defineComponent({
  name: 'SelectScrollDownButton',
  setup(_, { slots, attrs }) {
    return () =>
      h(
        SelectScrollDownButtonPrimitive,
        {
          ...attrs,
          class: ['flex cursor-default items-center justify-center py-1', (attrs as any).class],
          'data-slot': 'select-scroll-down-button',
        },
        { default: () => h(ChevronDown, { class: 'size-4' }) },
      )
  },
})

export default {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
