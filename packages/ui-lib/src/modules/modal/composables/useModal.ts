/**
 * useModal - Composable para controle programático de modais
 * 
 * Permite abrir/fechar modais via código sem necessidade de v-model
 * Útil para confirmações, alertas, dialogs dinâmicos
 * 
 * @example
 * ```ts
 * const { isOpen, open, close, toggle } = useModal()
 * 
 * const handleDelete = async () => {
 *   if (await confirm('Deseja deletar?')) {
 *     // delete logic
 *   }
 * }
 * ```
 */

import { ref } from 'vue'

export interface UseModalOptions {
    defaultOpen?: boolean
    onOpen?: () => void
    onClose?: () => void
}

export interface UseModalReturn {
    isOpen: ReturnType<typeof ref<boolean>>
    open: () => void
    close: () => void
    toggle: () => void
}

export function useModal(options: UseModalOptions = {}): UseModalReturn {
    const { defaultOpen = false, onOpen, onClose } = options

    const isOpen = ref(defaultOpen)

    const open = () => {
        isOpen.value = true
        onOpen?.()
    }

    const close = () => {
        isOpen.value = false
        onClose?.()
    }

    const toggle = () => {
        if (isOpen.value) {
            close()
        } else {
            open()
        }
    }

    return {
        isOpen,
        open,
        close,
        toggle
    }
}

/**
 * useConfirmModal - Wrapper para modais de confirmação
 * 
 * @example
 * ```ts
 * const { confirm } = useConfirmModal()
 * 
 * const handleAction = async () => {
 *   const confirmed = await confirm({
 *     title: 'Confirmar ação',
 *     message: 'Tem certeza?'
 *   })
 *   
 *   if (confirmed) {
 *     // execute action
 *   }
 * }
 * ```
 */
export interface ConfirmModalOptions {
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
}

export function useConfirmModal() {
    const isOpen = ref(false)
    const options = ref<ConfirmModalOptions>({})
    let resolvePromise: ((value: boolean) => void) | null = null

    const confirm = (opts: ConfirmModalOptions = {}): Promise<boolean> => {
        options.value = opts
        isOpen.value = true

        return new Promise((resolve) => {
            resolvePromise = resolve
        })
    }

    const handleConfirm = () => {
        isOpen.value = false
        resolvePromise?.(true)
        resolvePromise = null
    }

    const handleCancel = () => {
        isOpen.value = false
        resolvePromise?.(false)
        resolvePromise = null
    }

    return {
        isOpen,
        options,
        confirm,
        handleConfirm,
        handleCancel
    }
}
