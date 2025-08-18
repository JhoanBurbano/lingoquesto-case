import { onMounted, onBeforeUnmount, ref } from 'vue'
import EmblaCarousel, {
  type EmblaOptionsType,
  type EmblaPluginType,
  type EmblaCarouselType,
} from 'embla-carousel'

export type CarouselApi = EmblaCarouselType

export function useEmbla(options?: EmblaOptionsType, plugins?: EmblaPluginType[]) {
  const viewportRef = ref<HTMLElement | null>(null)
  const api = ref<EmblaCarouselType | null>(null)

  onMounted(() => {
    if (viewportRef.value) {
      api.value = EmblaCarousel(viewportRef.value, options, plugins)
    }
  })

  onBeforeUnmount(() => {
    api.value?.destroy()
    api.value = null
  })

  return { viewportRef, api }
}
