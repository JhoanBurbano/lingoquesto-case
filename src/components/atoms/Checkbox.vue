<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { cn } from '@/utils'
import { Check } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    class?: string
    modelValue?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    disabled: false,
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="props.modelValue"
    :data-state="props.modelValue ? 'checked' : 'unchecked'"
    :disabled="props.disabled"
    data-slot="checkbox"
    @click="toggle"
    :class="
      cn(
        'peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  >
    <span
      data-slot="checkbox-indicator"
      class="flex items-center justify-center text-current transition-none"
    >
      <Check v-if="props.modelValue" class="size-3.5" />
    </span>
  </button>
</template>
