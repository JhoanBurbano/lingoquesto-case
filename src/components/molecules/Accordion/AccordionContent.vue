<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { inject, computed } from 'vue'
import { ACCORDION_CTX, ACCORDION_ITEM_CTX } from './accordionContext'

const props = defineProps<{ class?: string }>()
const root = inject(ACCORDION_CTX)
const item = inject(ACCORDION_ITEM_CTX)
if (!root || !item) throw new Error('AccordionContent must be inside AccordionItem')

const isOpen = computed(() => root.isOpen(item.value))
</script>

<template>
  <div
    data-slot="accordion-content"
    :data-state="isOpen ? 'open' : 'closed'"
    :class="[
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm',
      $props.class,
    ]"
  >
    <div :class="['pt-0 pb-4', $props.class]">
      <slot />
    </div>
  </div>
</template>
