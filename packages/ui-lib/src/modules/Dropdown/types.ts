import type { Ref } from 'vue'

/**
 * Posicionamento do dropdown em relação ao trigger
 */
export type DropdownPlacement =
    | 'top' | 'top-start' | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
    | 'right' | 'right-start' | 'right-end'

/**
 * Modo de ativação do dropdown
 */
export type DropdownTrigger = 'click' | 'hover' | 'manual'

/**
 * Variantes visuais do dropdown
 */
export type DropdownVariant = 'default' | 'menu' | 'card' | 'minimal'

/**
 * Props do componente Dropdown
 */
export interface DropdownProps {
    modelValue?: boolean
    placement?: DropdownPlacement
    trigger?: DropdownTrigger
    variant?: DropdownVariant
    disabled?: boolean
    closeOnClickOutside?: boolean
    closeOnItemClick?: boolean
    offset?: number
    arrow?: boolean
    maxWidth?: string
    maxHeight?: string
}

/**
 * Emits do componente Dropdown
 */
export interface DropdownEmits {
    'update:modelValue': [value: boolean]
    'open': []
    'close': []
}

/**
 * Context compartilhado entre Dropdown e DropdownItem
 */
export interface DropdownContext {
    isOpen: Ref<boolean>
    close: () => void
}
