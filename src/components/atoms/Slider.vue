<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <SliderRoot
    data-slot="slider"
    v-bind="$attrs"
    :model-value="modelValue"
    :default-value="defaultValue"
    :min="min"
    :max="max"
    :step="step"
    :orientation="orientation"
    :disabled="disabled"
    @update:model-value="onUpdate"
    :class="[
      'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
      ($attrs as any)?.class,
    ]"
  >
    <SliderTrack
      data-slot="slider-track"
      class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
    >
      <SliderRange
        data-slot="slider-range"
        class="bg-gradient-to-r from-[#967AFE] to-[#48D19C] absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
      />
    </SliderTrack>

    <SliderThumb
      v-for="(_, index) in thumbCount"
      :key="index"
      data-slot="slider-thumb"
      class="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'radix-vue'

const props = withDefaults(
  defineProps<{
    /** v-model */
    modelValue?: number[]
    /** valor inicial si no se controla por v-model */
    defaultValue?: number[]
    min?: number
    max?: number
    step?: number
    orientation?: 'horizontal' | 'vertical'
    disabled?: boolean
  }>(),
  {
    modelValue: undefined,
    defaultValue: undefined,
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[] | undefined): void
}>()

const effectiveValues = computed<number[]>(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue
  if (Array.isArray(props.defaultValue)) return props.defaultValue
  // por defecto: rango completo [min, max] (útil para sliders de rango)
  return [props.min, props.max]
})

const thumbCount = computed(() => effectiveValues.value.length || 1)

function onUpdate(v: number[] | undefined) {
  // Radix can emit undefined while initializing; guard or forward as-is
  emit('update:modelValue', v)
}
</script>

<!--
  Uso (rango):

  <script setup lang="ts">
  import Slider from '@/ui/Slider.vue'
  import { ref } from 'vue'
  const range = ref<[number, number]>([10, 80])
  </script>

  <template>
    <Slider v-model="(range as unknown as number[])" :min="0" :max="100" :step="5" />
  </template>

  Uso (simple):

  <script setup lang="ts">
  import Slider from '@/ui/Slider.vue'
  import { ref } from 'vue'
  const value = ref<number[]>([40])
  </script>

  <template>
    <Slider v-model="value" :min="0" :max="100" />
  </template>
  -->
