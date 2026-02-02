/**
 * ============================================
 * USE TABS - Composable para controle de abas
 * ============================================
 * 
 * Gerencia o estado de tabs/abas com suporte a:
 * - Seleção de aba ativa
 * - Navegação por teclado (setas)
 * - Lazy loading de conteúdo
 * - Callbacks de mudança
 * - Controle programático
 * 
 * @example
 * ```ts
 * const tabs = useTabs({
 *   defaultTab: 'profile',
 *   onTabChange: (tabId) => console.log('Active tab:', tabId)
 * })
 * 
 * // Mudar aba
 * tabs.selectTab('settings')
 * 
 * // Verificar se está ativa
 * tabs.isActive('profile') // false
 * ```
 */

import { ref, computed, type Ref } from 'vue'

// ============================================
// TYPES
// ============================================

/**
 * Orientação das tabs
 */
export type TabOrientation = 'horizontal' | 'vertical'

/**
 * Variantes visuais das tabs
 */
export type TabVariant = 'line' | 'enclosed' | 'pills' | 'soft'

/**
 * Opções de configuração do useTabs
 */
export interface UseTabsOptions {
    /**
     * ID da aba inicial (padrão: primeira aba registrada)
     */
    defaultTab?: string | number

    /**
     * Orientação das tabs (padrão: 'horizontal')
     */
    orientation?: TabOrientation

    /**
     * Variante visual (padrão: 'line')
     */
    variant?: TabVariant

    /**
     * Habilitar navegação por teclado (padrão: true)
     */
    keyboardNavigation?: boolean

    /**
     * Lazy loading - só renderiza conteúdo quando aba é ativada (padrão: false)
     */
    lazy?: boolean

    /**
     * Manter conteúdo montado após primeira ativação (padrão: true)
     * Só tem efeito se lazy = true
     */
    keepAlive?: boolean

    /**
     * Callback executado quando aba muda
     */
    onTabChange?: (tabId: string | number) => void

    /**
     * Desabilitar todas as tabs (padrão: false)
     */
    disabled?: boolean
}

/**
 * Retorno do useTabs
 */
export interface UseTabsReturn {
    /**
     * ID da aba ativa atual
     */
    activeTab: Ref<string | number>

    /**
     * IDs de todas as tabs registradas
     */
    tabs: Ref<Array<string | number>>

    /**
     * Tabs que já foram visitadas (para lazy loading + keepAlive)
     */
    visitedTabs: Ref<Set<string | number>>

    /**
     * Seleciona uma aba
     */
    selectTab: (tabId: string | number) => void

    /**
     * Verifica se uma aba está ativa
     */
    isActive: (tabId: string | number) => boolean

    /**
     * Verifica se uma aba já foi visitada
     */
    hasBeenVisited: (tabId: string | number) => boolean

    /**
     * Navega para próxima aba
     */
    nextTab: () => void

    /**
     * Navega para aba anterior
     */
    prevTab: () => void

    /**
     * Registra uma nova aba
     */
    registerTab: (tabId: string | number) => void

    /**
     * Remove uma aba
     */
    unregisterTab: (tabId: string | number) => void

    /**
     * Índice da aba ativa (para navegação)
     */
    activeIndex: Ref<number>

    /**
     * Total de tabs
     */
    tabCount: Ref<number>
}

// ============================================
// COMPOSABLE
// ============================================

/**
 * Composable para gerenciar estado de tabs
 * 
 * @param options - Opções de configuração
 * @returns Interface de controle das tabs
 */
export function useTabs(options: UseTabsOptions = {}): UseTabsReturn {
    const {
        defaultTab,
        onTabChange,
        lazy = false,
        keepAlive = true,
        disabled = false
    } = options

    // ============================================
    // STATE
    // ============================================

    /** IDs das tabs registradas */
    const tabs = ref<Array<string | number>>([])

    /** ID da aba ativa */
    const activeTab = ref<string | number>(defaultTab ?? '')

    /** Set de tabs que já foram visitadas (para lazy + keepAlive) */
    const visitedTabs = ref<Set<string | number>>(new Set())

    // ============================================
    // COMPUTED
    // ============================================

    /** Índice da aba ativa */
    const activeIndex = computed(() =>
        tabs.value.indexOf(activeTab.value)
    )

    /** Total de tabs */
    const tabCount = computed(() => tabs.value.length)

    // ============================================
    // METHODS
    // ============================================

    /**
     * Registra uma nova aba
     */
    const registerTab = (tabId: string | number) => {
        if (!tabs.value.includes(tabId)) {
            tabs.value.push(tabId)

            // Se é a primeira aba e não tem default, ativa ela
            if (tabs.value.length === 1 && !activeTab.value) {
                activeTab.value = tabId
                visitedTabs.value.add(tabId)
            }

            // Se é a aba default, ativa ela
            if (tabId === defaultTab) {
                activeTab.value = tabId
                visitedTabs.value.add(tabId)
            }
        }
    }

    /**
     * Remove uma aba
     */
    const unregisterTab = (tabId: string | number) => {
        const index = tabs.value.indexOf(tabId)
        if (index > -1) {
            tabs.value.splice(index, 1)
            visitedTabs.value.delete(tabId)

            // Se removeu a aba ativa, ativa a próxima ou anterior
            if (tabId === activeTab.value && tabs.value.length > 0) {
                const newIndex = Math.min(index, tabs.value.length - 1)
                activeTab.value = tabs.value[newIndex] ?? ''
            }
        }
    }

    /**
     * Seleciona uma aba
     */
    const selectTab = (tabId: string | number) => {
        if (disabled || !tabs.value.includes(tabId)) return

        if (activeTab.value !== tabId) {
            activeTab.value = tabId

            // Marca como visitada
            if (lazy && keepAlive) {
                visitedTabs.value.add(tabId)
            }

            // Callback
            onTabChange?.(tabId)
        }
    }

    /**
     * Verifica se uma aba está ativa
     */
    const isActive = (tabId: string | number): boolean => {
        return activeTab.value === tabId
    }

    /**
     * Verifica se uma aba já foi visitada
     */
    const hasBeenVisited = (tabId: string | number): boolean => {
        return visitedTabs.value.has(tabId)
    }

    /**
     * Navega para próxima aba
     */
    const nextTab = () => {
        if (disabled || tabCount.value === 0) return

        const currentIndex = activeIndex.value
        const nextIndex = (currentIndex + 1) % tabCount.value
        selectTab(tabs.value[nextIndex] ?? '')
    }

    /**
     * Navega para aba anterior
     */
    const prevTab = () => {
        if (disabled || tabCount.value === 0) return

        const currentIndex = activeIndex.value
        const prevIndex = currentIndex === 0 ? tabCount.value - 1 : currentIndex - 1
        selectTab(tabs.value[prevIndex] ?? '')
    }

    // ============================================
    // RETURN
    // ============================================

    return {
        activeTab,
        tabs,
        visitedTabs,
        selectTab,
        isActive,
        hasBeenVisited,
        nextTab,
        prevTab,
        registerTab,
        unregisterTab,
        activeIndex,
        tabCount
    }
}
