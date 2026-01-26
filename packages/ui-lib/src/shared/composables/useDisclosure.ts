/**
 * ============================================
 * USE DISCLOSURE - Composable para controle de estado aberto/fechado
 * ============================================
 * 
 * Padrão genérico para componentes que podem ser abertos/fechados:
 * - Modals
 * - Drawers
 * - Dropdowns
 * - Popovers
 * - Collapsible panels
 * - Accordions
 * 
 * Inspirado no padrão do Chakra UI.
 * 
 * @example
 * ```ts
 * const modal = useDisclosure()
 * 
 * // Abrir modal
 * modal.open()
 * 
 * // Fechar modal
 * modal.close()
 * 
 * // Toggle
 * modal.toggle()
 * 
 * // Verificar estado
 * if (modal.isOpen.value) {
 *   console.log('Modal está aberto')
 * }
 * ```
 * 
 * @example Com callbacks
 * ```ts
 * const drawer = useDisclosure({
 *   defaultOpen: false,
 *   onOpen: () => console.log('Drawer aberto'),
 *   onClose: () => console.log('Drawer fechado')
 * })
 * ```
 */

import { ref, readonly, type Ref } from 'vue'

// ============================================
// TYPES
// ============================================

/**
 * Opções de configuração do useDisclosure
 */
export interface UseDisclosureOptions {
    /**
     * Estado inicial (padrão: false)
     */
    defaultOpen?: boolean

    /**
     * Callback executado quando abre
     */
    onOpen?: () => void

    /**
     * Callback executado quando fecha
     */
    onClose?: () => void

    /**
     * Callback executado quando toggle é acionado
     */
    onToggle?: (isOpen: boolean) => void

    /**
     * ID único para o disclosure (útil para acessibilidade)
     */
    id?: string
}

/**
 * Retorno do useDisclosure
 */
export interface UseDisclosureReturn {
    /**
     * Estado atual (readonly)
     */
    isOpen: Readonly<Ref<boolean>>

    /**
     * Se está fechado (computed inverso de isOpen)
     */
    isClosed: Readonly<Ref<boolean>>

    /**
     * Abre o disclosure
     */
    open: () => void

    /**
     * Fecha o disclosure
     */
    close: () => void

    /**
     * Alterna entre aberto/fechado
     */
    toggle: () => void

    /**
     * ID único (se fornecido)
     */
    id?: string
}

// ============================================
// COMPOSABLE
// ============================================

/**
 * Composable para gerenciar estado de disclosure (aberto/fechado)
 * 
 * @param options - Opções de configuração
 * @returns Interface de controle do disclosure
 */
export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
    const {
        defaultOpen = false,
        onOpen,
        onClose,
        onToggle,
        id
    } = options

    // ============================================
    // STATE
    // ============================================
    const isOpen = ref<boolean>(defaultOpen)

    // ============================================
    // COMPUTED
    // ============================================
    const isClosed = readonly(ref(!isOpen.value))

    // ============================================
    // METHODS
    // ============================================

    /**
     * Abre o disclosure
     */
    const open = (): void => {
        if (isOpen.value) return // Já está aberto

        isOpen.value = true
        onOpen?.()
    }

    /**
     * Fecha o disclosure
     */
    const close = (): void => {
        if (!isOpen.value) return // Já está fechado

        isOpen.value = false
        onClose?.()
    }

    /**
     * Alterna entre aberto/fechado
     */
    const toggle = (): void => {
        isOpen.value = !isOpen.value
        onToggle?.(isOpen.value)

        // Chama callback apropriado
        if (isOpen.value) {
            onOpen?.()
        } else {
            onClose?.()
        }
    }

    // ============================================
    // RETURN
    // ============================================
    return {
        isOpen: readonly(isOpen),
        isClosed,
        open,
        close,
        toggle,
        id
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Helper para criar múltiplos disclosures relacionados
 * Útil para accordions onde apenas um pode estar aberto por vez
 * 
 * @example
 * ```ts
 * const items = useDisclosureGroup(3) // 3 items
 * 
 * // Abrir o segundo item (fecha os outros)
 * items.openExclusive(1)
 * ```
 */
export function useDisclosureGroup(count: number): {
    items: UseDisclosureReturn[]
    openExclusive: (index: number) => void
    closeAll: () => void
    openAll: () => void
} {
    const items: UseDisclosureReturn[] = []

    // Criar N disclosures
    for (let i = 0; i < count; i++) {
        items.push(useDisclosure())
    }

    /**
     * Abre um item e fecha todos os outros
     */
    const openExclusive = (index: number): void => {
        items.forEach((item, i) => {
            if (i === index) {
                item.open()
            } else {
                item.close()
            }
        })
    }

    /**
     * Fecha todos os items
     */
    const closeAll = (): void => {
        items.forEach(item => item.close())
    }

    /**
     * Abre todos os items
     */
    const openAll = (): void => {
        items.forEach(item => item.open())
    }

    return {
        items,
        openExclusive,
        closeAll,
        openAll
    }
}

/**
 * Helper para criar disclosure controlado externamente
 * Útil quando o estado vem de props ou v-model
 * 
 * @example
 * ```ts
 * const props = defineProps<{ isOpen: boolean }>()
 * const emit = defineEmits<{ 'update:isOpen': [boolean] }>()
 * 
 * const disclosure = useControlledDisclosure(
 *   () => props.isOpen,
 *   (value) => emit('update:isOpen', value)
 * )
 * ```
 */
export function useControlledDisclosure(
    getter: () => boolean,
    setter: (value: boolean) => void
): UseDisclosureReturn {
    return {
        isOpen: readonly(ref(getter())),
        isClosed: readonly(ref(!getter())),
        open: () => setter(true),
        close: () => setter(false),
        toggle: () => setter(!getter())
    }
}
