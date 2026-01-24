/**
 * useSelection - Composable para gerenciar seleção de itens
 * 
 * Gerencia seleção múltipla de itens em listas/tabelas de forma reativa.
 * Suporta select all, toggle individual, clear, e queries úteis.
 * 
 * @example
 * ```ts
 * const { 
 *   selected, 
 *   isSelected, 
 *   toggle, 
 *   selectAll, 
 *   clear,
 *   hasSelection 
 * } = useSelection<User>()
 * 
 * // Toggle selection
 * toggle(user)
 * 
 * // Select all items
 * selectAll(users)
 * 
 * // Check if item is selected
 * if (isSelected(user)) { ... }
 * ```
 */

import { ref, computed, type Ref } from 'vue'

export interface UseSelectionOptions<T = any> {
    /**
     * Function to get unique identifier from item
     * Default: (item) => item.id
     */
    getKey?: (item: T) => string | number

    /**
     * Maximum number of items that can be selected
     * Default: undefined (no limit)
     */
    maxSelection?: number

    /**
     * Callback when selection changes
     */
    onChange?: (selected: T[]) => void
}

export interface UseSelectionReturn<T = any> {
    /** Currently selected items */
    selected: Ref<T[]>

    /** Number of selected items */
    count: Ref<number>

    /** Whether any items are selected */
    hasSelection: Ref<boolean>

    /** Whether all items are selected */
    allSelected: Ref<boolean>

    /** Check if item is selected */
    isSelected: (item: T) => boolean

    /** Toggle item selection */
    toggle: (item: T) => void

    /** Select single item (replaces current selection) */
    select: (item: T) => void

    /** Add item to selection */
    add: (item: T) => void

    /** Remove item from selection */
    remove: (item: T) => void

    /** Select all items */
    selectAll: (items: T[]) => void

    /** Clear all selections */
    clear: () => void

    /** Set selection to specific items */
    setSelection: (items: T[]) => void
}

export function useSelection<T = any>(
    options: UseSelectionOptions<T> = {}
): UseSelectionReturn<T> {
    const {
        getKey = (item: any) => item.id,
        maxSelection,
        onChange
    } = options

    // State
    const selected = ref<T[]>([]) as Ref<T[]>

    // Computed
    const count = computed(() => selected.value.length)
    const hasSelection = computed(() => count.value > 0)
    const allSelected = computed(() => false) // Updated by selectAll

    // Helpers
    const getItemKey = (item: T): string | number => {
        return getKey(item)
    }

    const findIndex = (item: T): number => {
        const key = getItemKey(item)
        return selected.value.findIndex(s => getItemKey(s) === key)
    }

    const isSelected = (item: T): boolean => {
        return findIndex(item) !== -1
    }

    const canAddMore = (): boolean => {
        if (!maxSelection) return true
        return count.value < maxSelection
    }

    const emitChange = () => {
        onChange?.(selected.value)
    }

    // Actions
    const toggle = (item: T): void => {
        if (isSelected(item)) {
            remove(item)
        } else {
            add(item)
        }
    }

    const select = (item: T): void => {
        selected.value = [item]
        emitChange()
    }

    const add = (item: T): void => {
        if (isSelected(item)) return
        if (!canAddMore()) {
            console.warn('[useSelection] Maximum selection limit reached')
            return
        }

        selected.value = [...selected.value, item]
        emitChange()
    }

    const remove = (item: T): void => {
        const index = findIndex(item)
        if (index === -1) return

        selected.value = selected.value.filter((_, i) => i !== index)
        emitChange()
    }

    const selectAll = (items: T[]): void => {
        if (maxSelection && items.length > maxSelection) {
            console.warn('[useSelection] Cannot select all: exceeds maximum limit')
            selected.value = items.slice(0, maxSelection)
        } else {
            selected.value = [...items]
        }
        emitChange()
    }

    const clear = (): void => {
        selected.value = []
        emitChange()
    }

    const setSelection = (items: T[]): void => {
        if (maxSelection && items.length > maxSelection) {
            console.warn('[useSelection] Selection exceeds maximum limit, truncating')
            selected.value = items.slice(0, maxSelection)
        } else {
            selected.value = [...items]
        }
        emitChange()
    }

    return {
        selected,
        count,
        hasSelection,
        allSelected,
        isSelected,
        toggle,
        select,
        add,
        remove,
        selectAll,
        clear,
        setSelection
    }
}
