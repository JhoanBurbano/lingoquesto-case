/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InjectionKey } from 'vue'

export interface DialogCtx {
  open: boolean
  setOpen: (v: boolean) => void
}
export const DIALOG_CTX: InjectionKey<{ open: any; setOpen: (v: boolean) => void }> =
  Symbol('DIALOG_CTX')
