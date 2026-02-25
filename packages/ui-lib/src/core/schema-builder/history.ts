/**
 * Sistema de histórico para undo/redo
 * 
 * Implementa funcionalidade de desfazer/refazer para builders
 */

import { ref, watch, computed, readonly } from 'vue'
import type { Ref } from 'vue'

export interface UseSchemaHistoryOptions {
  /** Tamanho máximo do histórico (padrão: 50) */
  maxSize?: number
  
  /** Delay para debounce (ms, padrão: 500) */
  debounceDelay?: number
}

/**
 * Composable para histórico de undo/redo
 * 
 * @param schema - Ref do schema a ser monitorado
 * @param options - Opções de configuração
 * @returns Funções de controle do histórico
 * 
 * @example
 * ```ts
 * const schema = ref({ ... })
 * const history = useSchemaHistory(schema, { maxSize: 100 })
 * 
 * // Desfazer
 * history.undo()
 * 
 * // Refazer
 * history.redo()
 * ```
 */
export function useSchemaHistory<T>(
  schema: Ref<T>,
  options: UseSchemaHistoryOptions = {}
) {
  const { maxSize = 50, debounceDelay = 500 } = options
  
  // Estados internos
  const history = ref<T[]>([])
  const historyIndex = ref(-1)
  const isNavigating = ref(false)
  
  // Computed
  const canUndo = readonly(computed(() => historyIndex.value > 0))
  const canRedo = readonly(computed(() => historyIndex.value < history.value.length - 1))
  
  // Salvar estado inicial
  saveState()
  
  // Watch changes com debounce
  let timeoutId: NodeJS.Timeout | null = null
  
  watch(
    schema, 
    () => {
      // Não salvar no histórico se estamos navegando (undo/redo)
      if (isNavigating.value) {
        isNavigating.value = false
        return
      }
      
      // Debounce para evitar salvar a cada keystroke
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        saveState()
        timeoutId = null
      }, debounceDelay)
    }, 
    { deep: true }
  )
  
  /**
   * Salvar estado atual no histórico
   */
  function saveState(): void {
    // Remover estados futuros se estamos no meio do histórico
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }
    
    // Deep clone do schema
    const snapshot = JSON.parse(JSON.stringify(schema.value))
    history.value.push(snapshot)
    
    // Limitar tamanho do histórico (FIFO)
    if (history.value.length > maxSize) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }
  
  /**
   * Desfazer última ação
   */
  function undo(): void {
    if (!canUndo.value) return
    
    historyIndex.value--
    isNavigating.value = true
    
    // Restore from history
    schema.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }
  
  /**
   * Refazer ação desfeita
   */
  function redo(): void {
    if (!canRedo.value) return
    
    historyIndex.value++
    isNavigating.value = true
    
    // Restore from history
    schema.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }
  
  /**
   * Limpar todo o histórico
   */
  function clearHistory(): void {
    history.value = []
    historyIndex.value = -1
    saveState()
  }
  
  /**
   * Obter tamanho atual do histórico
   */
  function getHistorySize(): number {
    return history.value.length
  }
  
  /**
   * Obter posição atual no histórico
   */
  function getCurrentPosition(): number {
    return historyIndex.value
  }
  
  return {
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    getHistorySize,
    getCurrentPosition
  }
}
