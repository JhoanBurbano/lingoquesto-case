<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, watch, provide } from 'vue'
import { DIALOG_CTX } from './context'

const props = withDefaults(defineProps<{ modelValue?: boolean }>(), { modelValue: false })
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const open = ref(!!props.modelValue)
watch(
  () => props.modelValue,
  (v) => (open.value = !!v),
)
function setOpen(v: boolean) {
  open.value = v
  emit('update:modelValue', v)
}

provide(DIALOG_CTX, { open, setOpen })
</script>

<template>
  <div data-slot="dialog">
    <slot />
  </div>
</template>
