/**
 * Modal Types
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ModalVariant = 'default' | 'danger' | 'success' | 'warning'

export interface ModalProps {
    modelValue?: boolean
    title?: string
    size?: ModalSize
    variant?: ModalVariant
    closable?: boolean
    closeOnOverlay?: boolean
    closeOnEsc?: boolean
    persistent?: boolean // Se true, não fecha ao clicar fora ou ESC
    showHeader?: boolean
    showFooter?: boolean
    loading?: boolean
    fullscreen?: boolean
    zIndex?: number
}

export interface ModalEmits {
    'update:modelValue': [value: boolean]
    'open': []
    'close': []
    'confirm': []
    'cancel': []
}
