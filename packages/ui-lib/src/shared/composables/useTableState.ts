/**
 * ============================================
 * USE TABLE STATE - Composable que combina search + sort + pagination
 * ============================================
 * 
 * Composable de alto nível que integra busca, ordenação e paginação.
 * Ideal para uso em tabelas e listas complexas.
 * 
 * @example
 * ```ts
 * const {
 *   displayedItems,
 *   searchTerm,
 *   sortBy,
 *   currentPage,
 *   totalPages,
 *   toggleSort,
 *   goToPage
 * } = useTableState(users, {
 *   searchFields: ['name', 'email'],
 *   itemsPerPage: 20
 * })
 * ```
 */

import { computed, type Ref } from 'vue'
import { useSearch, type SearchOptions } from './useSearch'
import { useSorting, type SortingOptions } from './useSorting'
import { usePagination, type PaginationOptions } from './usePagination'

// ============================================
// TYPES
// ============================================
export interface TableStateOptions<T> extends PaginationOptions, SortingOptions<T> {
  searchFields?: (keyof T)[]
  caseSensitive?: boolean
  debounceMs?: number
}

// ============================================
// COMPOSABLE
// ============================================
export function useTableState<T extends Record<string, any>>(
  items: Ref<T[]> | T[],
  options: TableStateOptions<T> = {}
) {
  const {
    searchFields,
    caseSensitive = false,
    debounceMs = 300,
    itemsPerPage = 10,
    initialPage = 1,
    initialSortBy = null,
    initialDirection = null
  } = options

  // ============================================
  // COMPOSABLES
  // ============================================

  // 1. Search
  const searchOptions: SearchOptions<T> = {
    fields: searchFields,
    caseSensitive,
    debounceMs
  }
  const search = useSearch(items, searchOptions)

  // 2. Sorting (aplicado aos resultados da busca)
  const sortingOptions: SortingOptions<T> = {
    initialSortBy,
    initialDirection,
    caseSensitive
  }
  const sorting = useSorting(search.results, sortingOptions)

  // 3. Pagination (aplicada aos resultados ordenados)
  const paginationOptions: PaginationOptions = {
    itemsPerPage,
    initialPage
  }
  const pagination = usePagination(sorting.sortedItems, paginationOptions)

  // ============================================
  // COMPUTED
  // ============================================

  /**
   * Itens finais para exibição (após search + sort + pagination)
   */
  const displayedItems = computed(() => pagination.paginatedItems.value)

  /**
   * Total de itens após a busca (antes da paginação)
   */
  const filteredTotal = computed(() => search.results.value.length)

  /**
   * Informações completas do estado da tabela
   */
  const tableInfo = computed(() => ({
    searchTerm: search.searchTerm.value,
    hasSearch: search.searchTerm.value.trim() !== '',
    sortBy: sorting.sortBy.value,
    sortDirection: sorting.sortDirection.value,
    isSorted: sorting.isSorted.value,
    currentPage: pagination.currentPage.value,
    itemsPerPage: pagination.itemsPerPage.value,
    totalPages: pagination.totalPages.value,
    totalItems: pagination.totalItems.value,
    filteredTotal: filteredTotal.value,
    pageInfo: pagination.pageInfo.value
  }))

  // ============================================
  // METHODS
  // ============================================

  /**
   * Reseta todos os filtros e volta para o estado inicial
   */
  function reset(): void {
    search.clear()
    sorting.clearSort()
    pagination.reset()
  }

  // ============================================
  // RETURN
  // ============================================
  return {
    // Items
    displayedItems,
    filteredTotal,
    tableInfo,

    // Search
    searchTerm: search.searchTerm,
    hasSearchResults: search.hasResults,
    isSearchEmpty: search.isEmpty,
    searchItems: search.search,
    clearSearch: search.clear,

    // Sorting
    sortBy: sorting.sortBy,
    sortDirection: sorting.sortDirection,
    isSorted: sorting.isSorted,
    toggleSort: sorting.toggleSort,
    setSort: sorting.setSort,
    clearSort: sorting.clearSort,
    getSortDirection: sorting.getSortDirection,
    isSortedBy: sorting.isSortedBy,

    // Pagination
    currentPage: pagination.currentPage,
    itemsPerPage: pagination.itemsPerPage,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    hasPreviousPage: pagination.hasPreviousPage,
    hasNextPage: pagination.hasNextPage,
    isFirstPage: pagination.isFirstPage,
    isLastPage: pagination.isLastPage,
    pageInfo: pagination.pageInfo,
    goToPage: pagination.goToPage,
    nextPage: pagination.nextPage,
    previousPage: pagination.previousPage,
    firstPage: pagination.firstPage,
    lastPage: pagination.lastPage,
    setItemsPerPage: pagination.setItemsPerPage,

    // Global
    reset
  }
}
