/**
 * ============================================
 * USE CRUD STORE - Composable para operações CRUD
 * ============================================
 * 
 * Gerencia operações CRUD com persistência em localStorage.
 * Funciona com qualquer tipo de entidade.
 * 
 * @example
 * ```ts
 * const userStore = useCrudStore<User>('users', USERS_DEFAULT)
 * 
 * // Buscar todos
 * const users = userStore.findAll()
 * 
 * // Buscar por ID
 * const user = userStore.findById('123')
 * 
 * // Criar
 * userStore.create({ name: 'João', email: 'joao@email.com' })
 * 
 * // Atualizar
 * userStore.update('123', { name: 'João Silva' })
 * 
 * // Deletar
 * userStore.remove('123')
 * ```
 */

import { ref, computed, type Ref } from 'vue'

export interface CrudEntity {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

export interface CrudStoreOptions {
  persist?: boolean // Se deve persistir no localStorage (padrão: true)
  initialData?: any[] // Dados iniciais (se localStorage estiver vazio)
}

export function useCrudStore<T extends CrudEntity>(
  storeName: string,
  initialData: T[] = [],
  options: CrudStoreOptions = {}
) {
  const { persist = true, initialData: optInitialData = initialData } = options

  // ============================================
  // STATE
  // ============================================
  const items: Ref<T[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============================================
  // COMPUTED
  // ============================================
  const count = computed(() => items.value.length)
  const isEmpty = computed(() => count.value === 0)

  // ============================================
  // STORAGE HELPERS
  // ============================================
  function getStorageKey(): string {
    return `lugand-ui:${storeName}`
  }

  function loadFromStorage(): T[] {
    if (!persist) return []

    try {
      const data = localStorage.getItem(getStorageKey())
      if (!data) return []

      const parsed = JSON.parse(data)
      // Reconverter strings de data para objetos Date
      return parsed.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
      }))
    } catch (err) {
      console.error(`[useCrudStore] Erro ao carregar ${storeName}:`, err)
      return []
    }
  }

  function saveToStorage(data: T[]): void {
    if (!persist) return

    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(data))
    } catch (err) {
      console.error(`[useCrudStore] Erro ao salvar ${storeName}:`, err)
      error.value = 'Erro ao salvar dados'
    }
  }

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  /**
   * Carrega os dados do localStorage ou usa dados iniciais
   */
  function load(): void {
    loading.value = true
    error.value = null

    try {
      const stored = loadFromStorage()
      items.value = stored.length > 0 ? stored : optInitialData

      // Se não havia dados no storage mas temos dados iniciais, salva
      if (stored.length === 0 && optInitialData.length > 0) {
        saveToStorage(items.value)
      }
    } catch (err) {
      error.value = 'Erro ao carregar dados'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca todos os itens
   */
  function findAll(): T[] {
    return items.value
  }

  /**
   * Busca um item por ID
   */
  function findById(id: string): T | undefined {
    return items.value.find(item => item.id === id)
  }

  /**
   * Busca itens que satisfazem uma condição
   */
  function findWhere(predicate: (item: T) => boolean): T[] {
    return items.value.filter(predicate)
  }

  /**
   * Cria um novo item
   */
  function create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const newItem = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as T

    items.value.push(newItem)
    saveToStorage(items.value)

    return newItem
  }

  /**
   * Atualiza um item existente
   */
  function update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): T | null {
    const index = items.value.findIndex(item => item.id === id)
    if (index === -1) {
      error.value = 'Item não encontrado'
      return null
    }

    const updated = {
      ...items.value[index],
      ...data,
      updatedAt: new Date()
    } as T

    items.value[index] = updated
    saveToStorage(items.value)

    return updated
  }

  /**
   * Remove um item
   */
  function remove(id: string): boolean {
    const index = items.value.findIndex(item => item.id === id)
    if (index === -1) {
      error.value = 'Item não encontrado'
      return false
    }

    items.value.splice(index, 1)
    saveToStorage(items.value)

    return true
  }

  /**
   * Remove múltiplos itens
   */
  function removeMany(ids: string[]): number {
    const initialCount = items.value.length
    items.value = items.value.filter(item => !ids.includes(item.id))
    saveToStorage(items.value)

    return initialCount - items.value.length
  }

  /**
   * Limpa todos os dados
   */
  function clear(): void {
    items.value = []
    saveToStorage([])
  }

  /**
   * Reseta para os dados iniciais
   */
  function reset(): void {
    items.value = [...optInitialData]
    saveToStorage(items.value)
  }

  // ============================================
  // LIFECYCLE
  // ============================================
  // Carrega automaticamente ao criar
  load()

  // ============================================
  // RETURN
  // ============================================
  return {
    // State
    items,
    loading,
    error,

    // Computed
    count,
    isEmpty,

    // Methods
    load,
    findAll,
    findById,
    findWhere,
    create,
    update,
    remove,
    removeMany,
    clear,
    reset
  }
}
