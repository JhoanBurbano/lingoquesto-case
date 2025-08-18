<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { ALERT_DIALOG_CTX } from './alertDialogContext'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
  }>(),
  {
    modelValue: false,
  },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const open = ref<boolean>(props.modelValue)
watch(
  () => props.modelValue,
  (v) => (open.value = !!v),
)
const setOpen = (v: boolean) => {
  open.value = v
  emit('update:modelValue', v)
}
const close = () => setOpen(false)

provide(ALERT_DIALOG_CTX, { open, setOpen, close })
</script>

<template>
  <div data-slot="alert-dialog">
    <slot />
  </div>
</template>
