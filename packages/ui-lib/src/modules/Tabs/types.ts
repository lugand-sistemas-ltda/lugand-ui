import type { VNode, Ref } from 'vue'
import type { TabOrientation, TabVariant } from '@/shared/composables/useTabs'

export type { TabOrientation, TabVariant } from '@/shared/composables/useTabs'

export interface RegisteredTabPanel {
    id: string | number
    label: string
    icon?: string
    badge?: string | number
    disabled: boolean
    order: number
    renderButton: () => VNode
    renderContent: () => VNode | null
}

export interface TabsContext {
    activeTab: import('vue').ComputedRef<string | number>
    selectTab: (tabId: string | number) => void
    isActive: (tabId: string | number) => boolean
    hasBeenVisited: (tabId: string | number) => boolean
    registerTab: (tabId: string | number) => void
    unregisterTab: (tabId: string | number) => void
    registerTabPanel: (panel: RegisteredTabPanel) => void
    unregisterTabPanel: (tabId: string | number) => void
    orientation: TabOrientation
    variant: TabVariant
    lazy: boolean
    keepAlive: boolean
    disabled: boolean
    size: 'sm' | 'md' | 'lg'
    registeredPanels: Ref<RegisteredTabPanel[]>
}

export const TABS_INJECTION_KEY = Symbol('tabs-context')
