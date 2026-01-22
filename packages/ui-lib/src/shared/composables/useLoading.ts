/**
 * useLoading - Composable para gerenciar estados de loading
 * 
 * Simplifica o controle de estados de carregamento em operações assíncronas
 * 
 * @example
 * ```vue
 * <script setup>
 * const { isLoading, withLoading } = useLoading()
 * 
 * const submit = () => withLoading(async () => {
 *   await api.post('/data', form)
 * })
 * </script>
 * 
 * <template>
 *   <Button @click="submit" :disabled="isLoading">
 *     Submit
 *   </Button>
 *   <Spinner v-if="isLoading" text="Saving..." />
 * </template>
 * ```
 */
import { ref } from 'vue'

export interface UseLoadingOptions {
    /** Estado inicial de loading */
    initialState?: boolean
    /** Callback executado quando loading inicia */
    onStart?: () => void
    /** Callback executado quando loading finaliza */
    onFinish?: () => void
    /** Callback executado em caso de erro */
    onError?: (error: unknown) => void
}

export interface UseLoadingReturn {
    /** Estado de loading (readonly para uso no template) */
    isLoading: Readonly<ReturnType<typeof ref<boolean>>>
    /** Inicia loading manualmente */
    start: () => void
    /** Para loading manualmente */
    stop: () => void
    /** Executa função assíncrona com loading automático */
    withLoading: <T>(fn: () => Promise<T>) => Promise<T>
}

export const useLoading = (options: UseLoadingOptions = {}): UseLoadingReturn => {
    const {
        initialState = false,
        onStart,
        onFinish,
        onError
    } = options

    const isLoading = ref(initialState)

    const start = () => {
        isLoading.value = true
        onStart?.()
    }

    const stop = () => {
        isLoading.value = false
        onFinish?.()
    }

    /**
     * Executa função assíncrona com loading automático
     * Garante que loading seja desativado mesmo em caso de erro
     */
    const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
        start()
        try {
            const result = await fn()
            return result
        } catch (error) {
            onError?.(error)
            throw error // Re-throw para não quebrar error handling do caller
        } finally {
            stop()
        }
    }

    return {
        isLoading,
        start,
        stop,
        withLoading
    }
}
