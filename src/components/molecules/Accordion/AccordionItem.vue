<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { ACCORDION_CTX, ACCORDION_ITEM_CTX } from './accordionContext'

const props = defineProps<{
  value: string
  class?: string
}>()

const ctx = inject(ACCORDION_CTX)
if (!ctx) throw new Error('AccordionItem must be used inside Accordion')

const open = computed(() => ctx.isOpen(props.value))

provide(ACCORDION_ITEM_CTX, { value: props.value })
</script>

<template>
  <div
    data-slot="accordion-item"
    :data-state="open ? 'open' : 'closed'"
    :class="['border-b last:border-b-0', $props.class]"
  >
    <slot />
  </div>
</template>
