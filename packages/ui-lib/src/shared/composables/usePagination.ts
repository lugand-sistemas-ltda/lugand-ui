/**
 * ============================================
 * USE PAGINATION - Composable para paginação genérica
 * ============================================
 * 
 * Sistema de paginação client-side reutilizável.
 * Funciona com qualquer array de dados.
 * 
 * @example
 * ```ts
 * const { 
 *   paginatedItems, 
 *   currentPage, 
 *   totalPages,
 *   goToPage,
 *   nextPage,
 *   previousPage 
 * } = usePagination(items, { itemsPerPage: 10 })
 * ```
 */

import { ref, computed, watch, type Ref } from 'vue'

// ============================================
// TYPES
// ============================================
export interface PaginationOptions {
  itemsPerPage?: number // Itens por página (padrão: 10)
  initialPage?: number // Página inicial (padrão: 1)
}

// ============================================
// COMPOSABLE
// ============================================
export function usePagination<T>(
  items: Ref<T[]> | T[],
  options: PaginationOptions = {}
) {
  const {
    itemsPerPage: initialItemsPerPage = 10,
    initialPage = 1
  } = options

  // ============================================
  // STATE
  // ============================================
  const currentPage = ref(initialPage)
  const itemsPerPage = ref(initialItemsPerPage)

  // ============================================
  // COMPUTED
  // ============================================
  const itemsArray = computed(() => Array.isArray(items) ? items : items.value)

  const totalItems = computed(() => itemsArray.value.length)

  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value) || 1)

  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value))

  const paginatedItems = computed(() => {
    return itemsArray.value.slice(startIndex.value, endIndex.value)
  })

  const hasPreviousPage = computed(() => currentPage.value > 1)

  const hasNextPage = computed(() => currentPage.value < totalPages.value)

  const isFirstPage = computed(() => currentPage.value === 1)

  const isLastPage = computed(() => currentPage.value === totalPages.value)

  const pageInfo = computed(() => {
    return {
      from: startIndex.value + 1,
      to: endIndex.value,
      total: totalItems.value
    }
  })

  // ============================================
  // METHODS
  // ============================================

  /**
   * Vai para uma página específica
   */
  function goToPage(page: number): void {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  /**
   * Vai para a próxima página
   */
  function nextPage(): void {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  /**
   * Vai para a página anterior
   */
  function previousPage(): void {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  /**
   * Vai para a primeira página
   */
  function firstPage(): void {
    currentPage.value = 1
  }

  /**
   * Vai para a última página
   */
  function lastPage(): void {
    currentPage.value = totalPages.value
  }

  /**
   * Define o número de itens por página
   */
  function setItemsPerPage(count: number): void {
    itemsPerPage.value = count
    // Ajusta a página atual se necessário
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  }

  /**
   * Reseta para a configuração inicial
   */
  function reset(): void {
    currentPage.value = initialPage
    itemsPerPage.value = initialItemsPerPage
  }

  // ============================================
  // WATCHERS
  // ============================================
  // Reseta para primeira página quando os itens mudam
  watch(
    () => itemsArray.value.length,
    () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1
      }
    }
  )

  // ============================================
  // RETURN
  // ============================================
  return {
    // State
    currentPage,
    itemsPerPage,

    // Computed
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    paginatedItems,
    hasPreviousPage,
    hasNextPage,
    isFirstPage,
    isLastPage,
    pageInfo,

    // Methods
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setItemsPerPage,
    reset
  }
}
