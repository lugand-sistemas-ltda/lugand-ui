import { ref, computed } from 'vue'
import type { ToastOptions, ToastInstance, ToastPosition } from '../components/types'

// Singleton State - Persists across navigation
const toasts = ref<ToastInstance[]>([])
let counter = 0

// Default configuration
const defaultOptions: Partial<ToastOptions> = {
    type: 'default',
    duration: 5000,
    dismissible: true,
    position: 'top-right'
}

export function useToast() {
    /**
     * Adiciona um novo Toast à fila
     */
    function add(options: ToastOptions) {
        const id = options.id || `toast-${Date.now()}-${counter++}`

        const instance: ToastInstance = {
            ...defaultOptions,
            ...options,
            id,
            createdAt: Date.now()
        }

        toasts.value.push(instance)

        // Auto-dismiss logic if duration > 0
        if (instance.duration && instance.duration > 0) {
            setTimeout(() => {
                remove(id)
            }, instance.duration)
        }

        return id
    }

    /**
     * Remove um Toast pelo ID
     */
    function remove(id: string) {
        const index = toasts.value.findIndex((t: ToastInstance) => t.id === id)
        if (index !== -1) {
            toasts.value.splice(index, 1)
        }
    }

    /**
     * Limpa todos os Toasts
     */
    function clear() {
        toasts.value = []
    }

    /**
     * Helpers específicos para tipos comuns
     */
    const success = (options: Omit<ToastOptions, 'type'> | string) => {
        const opts = typeof options === 'string' ? { message: options } : options
        return add({ ...opts, type: 'success' })
    }

    const error = (options: Omit<ToastOptions, 'type'> | string) => {
        const opts = typeof options === 'string' ? { message: options } : options
        return add({ ...opts, type: 'error' })
    }

    const warning = (options: Omit<ToastOptions, 'type'> | string) => {
        const opts = typeof options === 'string' ? { message: options } : options
        return add({ ...opts, type: 'warning' })
    }

    const info = (options: Omit<ToastOptions, 'type'> | string) => {
        const opts = typeof options === 'string' ? { message: options } : options
        return add({ ...opts, type: 'info' })
    }

    const custom = (options: ToastOptions) => add(options)

    /**
     * Computed helpers para filtrar toasts por posição (usado pelo Provider)
     */
    function getToastsByPosition(pos: ToastPosition) {
        return toasts.value.filter((t: ToastInstance) => (t.position || defaultOptions.position) === pos)
    }

    return {
        toasts: computed(() => toasts.value),
        add,
        remove,
        clear,
        success,
        error,
        warning,
        info,
        custom,
        getToastsByPosition
    }
}
