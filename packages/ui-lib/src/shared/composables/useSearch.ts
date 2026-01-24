/**
 * ============================================
 * USE SEARCH - Composable para busca genérica
 * ============================================
 * 
 * Sistema de busca client-side que funciona com qualquer tipo de dados.
 * Suporta busca em múltiplos campos.
 * 
 * @example
 * ```ts
 * const { search, results, searchTerm } = useSearch(users, {
 *   fields: ['name', 'email', 'role'],
 *   caseSensitive: false
 * })
 * 
 * searchTerm.value = 'joão'
 * console.log(results.value) // Usuários com 'joão' em name, email ou role
 * ```
 */

import { ref, computed, watch, type Ref } from 'vue'

// ============================================
// TYPES
// ============================================
export interface SearchOptions<T> {
  fields?: (keyof T)[] // Campos onde buscar (se vazio, busca em todos)
  caseSensitive?: boolean // Case sensitive (padrão: false)
  debounceMs?: number // Debounce em ms (padrão: 0)
}

// ============================================
// COMPOSABLE
// ============================================
export function useSearch<T extends Record<string, any>>(
  items: Ref<T[]> | T[],
  options: SearchOptions<T> = {}
) {
  const {
    fields,
    caseSensitive = false,
    debounceMs = 0
  } = options

  // ============================================
  // STATE
  // ============================================
  const searchTerm = ref('')
  const debouncedSearchTerm = ref('')
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // ============================================
  // COMPUTED
  // ============================================
  const itemsArray = computed(() => Array.isArray(items) ? items : items.value)

  const results = computed(() => {
    const term = debouncedSearchTerm.value.trim()
    if (!term) return itemsArray.value

    const normalizedTerm = caseSensitive ? term : term.toLowerCase()

    return itemsArray.value.filter(item => {
      // Se fields especificado, busca apenas nesses campos
      const fieldsToSearch = fields || (Object.keys(item) as (keyof T)[])

      return fieldsToSearch.some(field => {
        const value = item[field]
        if (value === null || value === undefined) return false

        const stringValue = String(value)
        const normalizedValue = caseSensitive ? stringValue : stringValue.toLowerCase()

        return normalizedValue.includes(normalizedTerm)
      })
    })
  })

  const hasResults = computed(() => results.value.length > 0)
  const isEmpty = computed(() => !hasResults.value && debouncedSearchTerm.value.trim() !== '')

  // ============================================
  // METHODS
  // ============================================

  /**
   * Define o termo de busca
   */
  function search(term: string): void {
    searchTerm.value = term
  }

  /**
   * Limpa a busca
   */
  function clear(): void {
    searchTerm.value = ''
    debouncedSearchTerm.value = ''
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  // ============================================
  // WATCHERS
  // ============================================
  watch(searchTerm, (newTerm) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (debounceMs > 0) {
      debounceTimer = setTimeout(() => {
        debouncedSearchTerm.value = newTerm
      }, debounceMs)
    } else {
      debouncedSearchTerm.value = newTerm
    }
  })

  // ============================================
  // RETURN
  // ============================================
  return {
    searchTerm,
    results,
    hasResults,
    isEmpty,
    search,
    clear
  }
}
