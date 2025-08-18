<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
  }>(),
  { modelValue: false },
)

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
</script>

<template>
  <div data-slot="collapsible">
    <slot :open="open" :setOpen="setOpen" />
  </div>
</template>
