import type { ChartConfig } from './useChart'
const THEMES = { light: '', dark: '.dark' } as const

export function buildChartStyle(id: string, config: ChartConfig) {
  const colorConfig = Object.entries(config).filter(([, c]) => c.theme || c.color)
  if (!colorConfig.length) return ''
  return Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const lines = colorConfig
        .map(([key, item]) => {
          const color = (item.theme && item.theme[theme as 'light' | 'dark']) || item.color
          return color ? `  --color-${key}: ${color};` : null
        })
        .filter(Boolean)
        .join('\n')
      return `${prefix} [data-chart=${id}] {\n${lines}\n}`
    })
    .join('\n')
}
