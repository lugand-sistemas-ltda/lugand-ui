/**
 * ============================================
 * USE SORTING - Composable para ordenação genérica
 * ============================================
 * 
 * Sistema de ordenação client-side reutilizável.
 * Suporta ordenação por múltiplos campos e direções.
 * 
 * @example
 * ```ts
 * const { sortedItems, sortBy, sortDirection, toggleSort } = useSorting(users)
 * 
 * // Ordena por nome (ascendente)
 * toggleSort('name')
 * 
 * // Ordena por nome (descendente)
 * toggleSort('name')
 * 
 * // Ordena por email (ascendente)
 * toggleSort('email')
 * ```
 */

import { ref, computed, type Ref } from 'vue'

// ============================================
// TYPES
// ============================================
export type SortDirection = 'asc' | 'desc' | null

export interface SortingOptions<T> {
  initialSortBy?: keyof T | null
  initialDirection?: SortDirection
  caseSensitive?: boolean
}

// ============================================
// COMPOSABLE
// ============================================
export function useSorting<T extends Record<string, any>>(
  items: Ref<T[]> | T[],
  options: SortingOptions<T> = {}
) {
  const {
    initialSortBy = null,
    initialDirection = null,
    caseSensitive = false
  } = options

  // ============================================
  // STATE
  // ============================================
  const sortBy = ref<keyof T | null>(initialSortBy)
  const sortDirection = ref<SortDirection>(initialDirection)

  // ============================================
  // COMPUTED
  // ============================================
  const itemsArray = computed(() => Array.isArray(items) ? items : items.value)

  const sortedItems = computed(() => {
    if (!sortBy.value || !sortDirection.value) {
      return itemsArray.value
    }

    const field = sortBy.value
    const direction = sortDirection.value

    return [...itemsArray.value].sort((a, b) => {
      let aVal = a[field]
      let bVal = b[field]

      // Tratamento de valores null/undefined
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      // Tratamento de strings (case-insensitive por padrão)
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        if (!caseSensitive) {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
      }

      // Tratamento de datas
      if (aVal instanceof Date && bVal instanceof Date) {
        aVal = aVal.getTime()
        bVal = bVal.getTime()
      }

      // Comparação
      let comparison = 0
      if (aVal > bVal) {
        comparison = 1
      } else if (aVal < bVal) {
        comparison = -1
      }

      return direction === 'asc' ? comparison : -comparison
    })
  })

  const isSorted = computed(() => sortBy.value !== null && sortDirection.value !== null)

  // ============================================
  // METHODS
  // ============================================

  /**
   * Alterna a ordenação de um campo.
   * Ciclo: null -> asc -> desc -> null
   */
  function toggleSort(field: keyof T): void {
    if (sortBy.value !== field) {
      // Novo campo: começa com asc
      sortBy.value = field
      sortDirection.value = 'asc'
    } else {
      // Mesmo campo: cicla através das direções
      if (sortDirection.value === 'asc') {
        sortDirection.value = 'desc'
      } else if (sortDirection.value === 'desc') {
        sortDirection.value = null
        sortBy.value = null
      } else {
        sortDirection.value = 'asc'
      }
    }
  }

  /**
   * Define a ordenação explicitamente
   */
  function setSort(field: keyof T | null, direction: SortDirection = 'asc'): void {
    sortBy.value = field
    sortDirection.value = direction
  }

  /**
   * Limpa a ordenação
   */
  function clearSort(): void {
    sortBy.value = null
    sortDirection.value = null
  }

  /**
   * Retorna a direção de ordenação para um campo
   */
  function getSortDirection(field: keyof T): SortDirection {
    return sortBy.value === field ? sortDirection.value : null
  }

  /**
   * Verifica se um campo está sendo ordenado
   */
  function isSortedBy(field: keyof T): boolean {
    return sortBy.value === field && sortDirection.value !== null
  }

  // ============================================
  // RETURN
  // ============================================
  return {
    // State
    sortBy,
    sortDirection,

    // Computed
    sortedItems,
    isSorted,

    // Methods
    toggleSort,
    setSort,
    clearSort,
    getSortDirection,
    isSortedBy
  }
}
