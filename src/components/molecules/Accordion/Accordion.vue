<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { ACCORDION_CTX, type AccordionType } from './accordionContext'

const props = withDefaults(
  defineProps<{
    type?: AccordionType
    collapsible?: boolean
    /** v-model para single: string | null; multiple: string[] */
    modelValue?: string | string[] | null
  }>(),
  {
    type: 'single',
    collapsible: false,
    modelValue: null,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | string[] | null): void
}>()

const openValues = ref<Set<string>>(new Set())

// Sync inicial con modelValue
const syncFromModel = (val: typeof props.modelValue) => {
  if (props.type === 'multiple') {
    openValues.value = new Set((val as string[]) ?? [])
  } else {
    openValues.value = new Set(val ? [val as string] : [])
  }
}
syncFromModel(props.modelValue)

watch(
  () => props.modelValue,
  (v) => syncFromModel(v),
)

const isOpen = (value: string) => openValues.value.has(value)

const toggle = (value: string) => {
  if (props.type === 'multiple') {
    const next = new Set(openValues.value)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    openValues.value = next
    emit('update:modelValue', Array.from(next))
  } else {
    const currentlyOpen = isOpen(value)
    if (currentlyOpen) {
      if (props.collapsible) {
        openValues.value = new Set()
        emit('update:modelValue', null)
      } // si no es colapsible, se mantiene abierto
    } else {
      openValues.value = new Set([value])
      emit('update:modelValue', value)
    }
  }
}

provide(ACCORDION_CTX, {
  type: props.type,
  collapsible: props.collapsible,
  openValues,
  toggle,
  isOpen,
})
</script>

<template>
  <div data-slot="accordion">
    <slot />
  </div>
</template>
