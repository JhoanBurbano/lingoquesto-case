<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { inject, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { ACCORDION_CTX, ACCORDION_ITEM_CTX } from './accordionContext'

const props = defineProps<{ class?: string }>()
const root = inject(ACCORDION_CTX)
const item = inject(ACCORDION_ITEM_CTX)

if (!root || !item) throw new Error('AccordionTrigger must be inside AccordionItem')

const isOpen = computed(() => root.isOpen(item.value))

const onClick = () => root.toggle(item.value)
</script>

<template>
  <div class="flex">
    <button
      data-slot="accordion-trigger"
      type="button"
      :data-state="isOpen ? 'open' : 'closed'"
      @click="onClick"
      :class="[
        'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
        $props.class,
      ]"
    >
      <slot />
      <ChevronDown
        class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
      />
    </button>
  </div>
</template>
