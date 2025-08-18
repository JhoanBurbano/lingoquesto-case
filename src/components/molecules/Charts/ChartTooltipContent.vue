<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils'
import { useChart } from './useChart'

type PayloadItem = any

const props = withDefaults(
  defineProps<{
    active?: boolean
    payload?: PayloadItem[]
    class?: string
    indicator?: 'line' | 'dot' | 'dashed'
    hideLabel?: boolean
    hideIndicator?: boolean
    label?: any
    labelFormatter?: (value: any, payload?: any[]) => any
    labelClassName?: string
    formatter?: (value: any, name: string, item: any, index: number, raw: any) => any
    color?: string
    nameKey?: string
    labelKey?: string
  }>(),
  {
    active: false,
    payload: () => [],
    indicator: 'dot',
    hideLabel: false,
    hideIndicator: false,
  },
)
const { config } = useChart()

function getPayloadConfigFromPayload(cfg: any, payload: any, key: string) {
  if (typeof payload !== 'object' || payload === null) return undefined
  const pp =
    'payload' in payload && typeof payload.payload === 'object' ? payload.payload : undefined
  let configLabelKey: string = key
  if (key in payload && typeof payload[key] === 'string') configLabelKey = payload[key]
  else if (pp && key in pp && typeof pp[key] === 'string') configLabelKey = pp[key]
  return configLabelKey in cfg ? cfg[configLabelKey] : cfg[key]
}

const tooltipLabel = computed(() => {
  if (props.hideLabel || !props.payload?.length) return null
  const item = props.payload[0]
  const key = `${props.labelKey || item?.dataKey || item?.name || 'value'}`
  const itemCfg = getPayloadConfigFromPayload(config, item, key)
  const value =
    !props.labelKey && typeof props.label === 'string'
      ? (config as any)[props.label]?.label || props.label
      : itemCfg?.label
  if (props.labelFormatter) return props.labelFormatter(value, props.payload)
  return value ?? null
})

const nestLabel = computed(() => props.payload?.length === 1 && props.indicator !== 'dot')
</script>

<template>
  <div
    v-if="active && payload && payload.length"
    :class="
      cn(
        'border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
        props.class,
      )
    "
  >
    <div v-if="!nestLabel" class="font-medium" :class="props.labelClassName">
      {{ tooltipLabel }}
    </div>

    <div class="grid gap-1.5">
      <div
        v-for="(item, index) in payload"
        :key="item.dataKey ?? index"
        :class="
          cn(
            '[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
            indicator === 'dot' ? 'items-center' : '',
          )
        "
      >
        <template v-if="formatter && item?.value !== undefined && item.name">
          {{ formatter(item.value, item.name, item, index, item.payload) }}
        </template>
        <template v-else>
          <div
            v-if="!hideIndicator"
            :class="
              cn('shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)', {
                'h-2.5 w-2.5': indicator === 'dot',
                'w-1': indicator === 'line',
                'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
                'my-0.5': nestLabel && indicator === 'dashed',
              })
            "
            :style="{
              '--color-bg': color || item.payload?.fill || item.color,
              '--color-border': color || item.payload?.fill || item.color,
            }"
          />
          <div
            :class="
              cn(
                'flex flex-1 justify-between leading-none',
                nestLabel ? 'items-end' : 'items-center',
              )
            "
          >
            <div class="grid gap-1.5">
              <div v-if="nestLabel" class="font-medium" :class="props.labelClassName">
                {{ tooltipLabel }}
              </div>
              <span class="text-muted-foreground">{{
                (config[(props.nameKey || item.name || item.dataKey || 'value') as string] || {})
                  .label || item.name
              }}</span>
            </div>
            <span
              v-if="item.value !== undefined"
              class="text-foreground font-mono font-medium tabular-nums"
            >
              {{ typeof item.value === 'number' ? item.value.toLocaleString() : item.value }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
