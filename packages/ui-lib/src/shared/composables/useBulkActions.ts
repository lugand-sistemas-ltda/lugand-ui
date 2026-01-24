/**
 * useBulkActions - Composable para gerenciar ações em lote
 * 
 * Abstração genérica para executar ações em múltiplos itens selecionados.
 * Suporta confirmação, loading states, callbacks de sucesso/erro, e desfazer.
 * 
 * @example
 * ```ts
 * const selection = useSelection<User>()
 * const bulkActions = useBulkActions({
 *   selection: selection.selected,
 *   onClear: selection.clear
 * })
 * 
 * // Register actions
 * bulkActions.register({
 *   id: 'delete',
 *   label: 'Delete',
 *   icon: '🗑️',
 *   variant: 'danger',
 *   requireConfirm: true,
 *   confirmMessage: (items) => `Delete ${items.length} items?`,
 *   execute: async (items) => {
 *     await api.deleteMany(items.map(i => i.id))
 *   }
 * })
 * ```
 */

import { ref, computed, type Ref } from 'vue'

export type BulkActionVariant = 'primary' | 'danger' | 'warning' | 'success' | 'outline' | 'ghost'

export interface BulkActionDefinition<T = any> {
    /** Unique action identifier */
    id: string

    /** Display label */
    label: string

    /** Optional icon (emoji or icon name) */
    icon?: string

    /** Button variant */
    variant?: BulkActionVariant

    /** Whether action requires confirmation */
    requireConfirm?: boolean

    /** Confirmation message (can be function for dynamic message) */
    confirmMessage?: string | ((items: T[]) => string)

    /** Confirm button text */
    confirmText?: string

    /** Whether action is destructive (affects styling) */
    destructive?: boolean

    /** Function to execute the action */
    execute: (items: T[]) => Promise<void> | void

    /** Callback on success */
    onSuccess?: (items: T[]) => void

    /** Callback on error */
    onError?: (error: Error, items: T[]) => void

    /** Whether to clear selection after execution */
    clearAfter?: boolean

    /** Disabled state (can be function) */
    disabled?: boolean | ((items: T[]) => boolean)

    /** Show only when specific number of items selected */
    minSelection?: number
    maxSelection?: number
}

export interface BulkActionsState {
    /** Currently executing action */
    executing: string | null

    /** Whether any action is executing */
    isExecuting: boolean

    /** Last executed action */
    lastAction: string | null

    /** Last error */
    lastError: Error | null
}

export interface UseBulkActionsOptions<T = any> {
    /** Selected items ref from useSelection */
    selection: Ref<T[]>

    /** Callback to clear selection */
    onClear?: () => void

    /** Global loading state callback */
    onLoadingChange?: (loading: boolean) => void
}

export interface UseBulkActionsReturn<T = any> {
    /** Registered actions */
    actions: Ref<Map<string, BulkActionDefinition<T>>>

    /** State */
    state: Ref<BulkActionsState>

    /** Available actions (filtered by conditions) */
    availableActions: Ref<BulkActionDefinition<T>[]>

    /** Register a bulk action */
    register: (action: BulkActionDefinition<T>) => void

    /** Unregister a bulk action */
    unregister: (actionId: string) => void

    /** Execute an action */
    execute: (actionId: string, skipConfirm?: boolean) => Promise<void>

    /** Check if action can be executed */
    canExecute: (actionId: string) => boolean

    /** Get action by ID */
    getAction: (actionId: string) => BulkActionDefinition<T> | undefined
}

export function useBulkActions<T = any>(
    options: UseBulkActionsOptions<T>
): UseBulkActionsReturn<T> {
    const { selection, onClear, onLoadingChange } = options

    // State
    const actions = ref(new Map<string, BulkActionDefinition<T>>()) as Ref<Map<string, BulkActionDefinition<T>>>
    const state = ref<BulkActionsState>({
        executing: null,
        isExecuting: false,
        lastAction: null,
        lastError: null
    })

    // Computed
    const availableActions = computed(() => {
        const result: BulkActionDefinition<T>[] = []
        const count = selection.value.length

        for (const action of actions.value.values()) {
            // Check min/max selection
            if (action.minSelection && count < action.minSelection) continue
            if (action.maxSelection && count > action.maxSelection) continue

            // Check disabled
            if (typeof action.disabled === 'function') {
                if (action.disabled(selection.value)) continue
            } else if (action.disabled) {
                continue
            }

            result.push(action)
        }

        return result
    })

    // Helpers
    const setExecuting = (actionId: string | null) => {
        state.value.executing = actionId
        state.value.isExecuting = actionId !== null
        onLoadingChange?.(actionId !== null)
    }

    const getConfirmMessage = (action: BulkActionDefinition<T>): string => {
        if (typeof action.confirmMessage === 'function') {
            return action.confirmMessage(selection.value)
        }
        return action.confirmMessage || `Execute action on ${selection.value.length} items?`
    }

    // Actions
    const register = (action: BulkActionDefinition<T>): void => {
        actions.value.set(action.id, {
            variant: 'primary',
            requireConfirm: false,
            clearAfter: true,
            ...action
        })
    }

    const unregister = (actionId: string): void => {
        actions.value.delete(actionId)
    }

    const getAction = (actionId: string): BulkActionDefinition<T> | undefined => {
        return actions.value.get(actionId)
    }

    const canExecute = (actionId: string): boolean => {
        const action = getAction(actionId)
        if (!action) return false
        if (selection.value.length === 0) return false

        return availableActions.value.includes(action)
    }

    const execute = async (actionId: string, skipConfirm = false): Promise<void> => {
        const action = getAction(actionId)
        if (!action) {
            console.error(`[useBulkActions] Action '${actionId}' not found`)
            return
        }

        if (!canExecute(actionId)) {
            console.warn(`[useBulkActions] Cannot execute action '${actionId}'`)
            return
        }

        // Confirmation
        if (action.requireConfirm && !skipConfirm) {
            const confirmed = window.confirm(getConfirmMessage(action))
            if (!confirmed) return
        }

        // Execute
        setExecuting(actionId)
        state.value.lastError = null

        try {
            await action.execute(selection.value)

            state.value.lastAction = actionId
            action.onSuccess?.(selection.value)

            // Clear selection if configured
            if (action.clearAfter) {
                onClear?.()
            }
        } catch (error) {
            const err = error as Error
            state.value.lastError = err
            action.onError?.(err, selection.value)
            throw err
        } finally {
            setExecuting(null)
        }
    }

    return {
        actions,
        state,
        availableActions,
        register,
        unregister,
        execute,
        canExecute,
        getAction
    }
}
