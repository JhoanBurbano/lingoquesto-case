import type { InjectionKey, Ref } from 'vue'

export type AccordionType = 'single' | 'multiple'

export interface AccordionCtx {
  type: AccordionType
  collapsible: boolean
  openValues: Ref<Set<string>>
  toggle: (value: string) => void
  isOpen: (value: string) => boolean
}

export const ACCORDION_CTX: InjectionKey<AccordionCtx> = Symbol('ACCORDION_CTX')

export interface AccordionItemCtx {
  value: string
}
export const ACCORDION_ITEM_CTX: InjectionKey<AccordionItemCtx> = Symbol('ACCORDION_ITEM_CTX')
