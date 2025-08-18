import type { InjectionKey, Ref } from 'vue'

export interface AlertDialogCtx {
  open: Ref<boolean>
  setOpen: (v: boolean) => void
  close: () => void
}

export const ALERT_DIALOG_CTX: InjectionKey<AlertDialogCtx> = Symbol('ALERT_DIALOG_CTX')
