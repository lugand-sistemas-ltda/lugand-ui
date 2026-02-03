import type { InjectionKey, Ref, VNode } from 'vue'

export type AccordionVariant = 'default' | 'bordered' | 'separated' | 'filled'
export type AccordionSize = 'sm' | 'md' | 'lg'

export interface RegisteredAccordionItem {
    id: string | number
    title: string
    icon?: string
    disabled: boolean
    order: number
    renderHeader: () => VNode
    renderContent: () => VNode | null
}

export interface AccordionContext {
    // Estado
    activeItems: Ref<(string | number)[]>
    disabled: Ref<boolean>
    variant: AccordionVariant
    size: AccordionSize
    multiple: boolean
    collapsible: boolean

    // Métodos de controle
    toggle: (itemId: string | number) => void
    open: (itemId: string | number) => void
    close: (itemId: string | number) => void
    isOpen: (itemId: string | number) => boolean

    // Registro de items (Slot Collection Pattern)
    registerAccordionItem: (item: RegisteredAccordionItem) => void
    unregisterAccordionItem: (itemId: string | number) => void
    registeredItems: Ref<RegisteredAccordionItem[]>
}

export const ACCORDION_INJECTION_KEY: InjectionKey<AccordionContext> = Symbol('accordion')
