/* eslint-disable @typescript-eslint/no-explicit-any */
import { type InjectionKey, inject, provide } from 'vue'

export type ChartConfig = {
  [k: string]: {
    label?: any
    icon?: any
    color?: string
    theme?: Record<'light' | 'dark', string>
  }
}

export interface ChartCtx {
  config: ChartConfig
}

const KEY: InjectionKey<ChartCtx> = Symbol('CHART_CTX')

export function provideChart(ctx: ChartCtx) {
  provide(KEY, ctx)
}
export function useChart() {
  const ctx = inject(KEY)
  if (!ctx) throw new Error('useChart must be used within a <ChartContainer />')
  return ctx
}
