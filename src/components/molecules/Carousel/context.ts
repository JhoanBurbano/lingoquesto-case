import type { InjectionKey, Ref } from 'vue'
import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import type { CarouselApi } from '@/composables/useEmbla'

export interface CarouselCtx {
  viewportRef: Ref<HTMLElement | null>
  api: Ref<CarouselApi | null>
  orientation: 'horizontal' | 'vertical'
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: Ref<boolean>
  canScrollNext: Ref<boolean>
  opts?: EmblaOptionsType
  plugins?: EmblaPluginType[]
}

export const CAROUSEL_CTX: InjectionKey<CarouselCtx> = Symbol('CAROUSEL_CTX')
