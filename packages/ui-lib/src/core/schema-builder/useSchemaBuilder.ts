/**
 * Composable genérico para builders baseados em schema
 * 
 * Fornece funcionalidade CRUD padrão para todos os builders
 * (form-builder, page-builder, doc-builder, etc.)
 */

import { ref, computed, readonly, watch } from 'vue'
import type { Ref } from 'vue'
import { useSchemaHistory } from './history'
import {
  serializeSchema,
  deserializeSchema,
  cloneSchema,
  generateId,
  generateTimestamp,
  isValidSchemaStructure
} from './serializers'
import { validateBaseSchema } from './validators'
import type {
  BaseSchema,
  BaseSchemaItem,
  UseSchemaBuilderOptions,
  ValidationResult
} from './types'

/**
 * Composable genérico para construção de schemas
 * 
 * @template TSchema - Tipo do schema (deve estender BaseSchema)
 * @template TItem - Tipo dos items do schema (deve estender BaseSchemaItem)
 * @param options - Opções de configuração
 * @returns API completa do builder
 * 
 * @example
 * ```ts
 * const builder = useSchemaBuilder<FormSchema, FormField>({
 *   initialSchema: mySchema,
 *   storageKey: 'my-forms',
 *   validator: validateFormSchema,
 *   enableHistory: true
 * })
 * 
 * builder.addItem(newField)
 * builder.save()
 * ```
 */
export function useSchemaBuilder<
  TSchema extends BaseSchema<TItem>,
  TItem extends BaseSchemaItem
>(options: UseSchemaBuilderOptions<TSchema, TItem> = {}) {
  
  // === SETUP ===
  
  const {
    initialSchema,
    storageKey,
    validator,
    itemFactory,
    enableHistory = false,
    historySize = 50,
    autoSaveDelay = 0
  } = options
  
  // === STATE ===
  
  const schema = ref<TSchema>(
    typeof initialSchema === 'function'
      ? initialSchema()
      : initialSchema || createEmptySchema()
  ) as Ref<TSchema>
  
  const selectedItem = ref<string | null>(null)
  const isDirty = ref(false)
  
  // === HISTORY ===
  
  const history = enableHistory
    ? useSchemaHistory(schema, { maxSize: historySize })
    : null
  
  // === VALIDATION ===
  
  const validation = computed<ValidationResult>(() => {
    // Validar estrutura base
    const baseValidation = validateBaseSchema(schema.value)
    
    if (!baseValidation.valid) {
      return baseValidation
    }
    
    // Validar com validador customizado
    if (validator) {
      return validator(schema.value)
    }
    
    return { valid: true, errors: [] }
  })
  
  const isValid = computed(() => validation.value.valid)
  
  // === AUTO SAVE ===
  
  if (autoSaveDelay > 0 && storageKey) {
    let autoSaveTimeout: NodeJS.Timeout | null = null
    
    watch(
      schema,
      () => {
        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout)
        }
        
        autoSaveTimeout = setTimeout(() => {
          save().catch(console.error)
        }, autoSaveDelay)
      },
      { deep: true }
    )
  }
  
  // === ITEM OPERATIONS ===
  
  /**
   * Adicionar item ao schema
   */
  function addItem(item: TItem, position?: number): void {
    if (position !== undefined && position >= 0 && position <= schema.value.items.length) {
      schema.value.items.splice(position, 0, item)
    } else {
      schema.value.items.push(item)
    }
    selectedItem.value = item.id
    markDirty()
  }
  
  /**
   * Remover item do schema
   */
  function removeItem(id: string): void {
    const index = schema.value.items.findIndex(item => item.id === id)
    if (index !== -1) {
      schema.value.items.splice(index, 1)
      if (selectedItem.value === id) {
        selectedItem.value = null
      }
      markDirty()
    }
  }
  
  /**
   * Atualizar item existente
   */
  function updateItem(id: string, updates: Partial<TItem>): void {
    const item = schema.value.items.find(item => item.id === id)
    if (item) {
      Object.assign(item, updates)
      markDirty()
    }
  }
  
  /**
   * Mover item para cima ou baixo
   */
  function moveItem(id: string, direction: 'up' | 'down'): void {
    const index = schema.value.items.findIndex(item => item.id === id)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= schema.value.items.length) return
    
    const [item] = schema.value.items.splice(index, 1)
    if (item) {
      schema.value.items.splice(newIndex, 0, item)
    }
    markDirty()
  }
  
  /**
   * Duplicar item
   */
  function duplicateItem(id: string): void {
    const item = schema.value.items.find(item => item.id === id)
    if (item) {
      const duplicate = {
        ...cloneSchema(item as any),
        id: generateId(),
        label: item.label ? `${item.label} (cópia)` : undefined
      } as TItem
      
      const index = schema.value.items.findIndex(item => item.id === id)
      schema.value.items.splice(index + 1, 0, duplicate)
      selectedItem.value = duplicate.id
      markDirty()
    }
  }
  
  /**
   * Limpar todos os items
   */
  function clearItems(): void {
    schema.value.items = []
    selectedItem.value = null
    markDirty()
  }
  
  // === SCHEMA OPERATIONS ===
  
  /**
   * Atualizar metadados do schema
   */
  function updateMetadata(updates: Partial<TSchema['metadata']>): void {
    Object.assign(schema.value.metadata, updates)
    markDirty()
  }
  
  /**
   * Resetar schema
   */
  function resetSchema(newSchema?: TSchema): void {
    schema.value = newSchema || createEmptySchema()
    selectedItem.value = null
    isDirty.value = false
    history?.clearHistory()
  }
  
  // === PERSISTENCE ===
  
  /**
   * Salvar schema no storage
   */
  async function save(): Promise<void> {
    if (!storageKey) {
      throw new Error('storageKey não configurado. Não é possível salvar.')
    }
    
    if (!isValid.value) {
      throw new Error('Schema inválido. Corrija os erros antes de salvar.')
    }
    
    schema.value.updatedAt = generateTimestamp()
    
    // Obter schemas existentes
    const storage = localStorage.getItem(storageKey) || '[]'
    const items: TSchema[] = JSON.parse(storage)
    
    // Atualizar ou adicionar
    const index = items.findIndex((s: TSchema) => s.id === schema.value.id)
    if (index !== -1) {
      items[index] = schema.value
    } else {
      items.push(schema.value)
    }
    
    // Salvar
    localStorage.setItem(storageKey, JSON.stringify(items))
    isDirty.value = false
  }
  
  /**
   * Carregar schema do storage
   */
  async function load(id: string): Promise<void> {
    if (!storageKey) {
      throw new Error('storageKey não configurado. Não é possível carregar.')
    }
    
    const storage = localStorage.getItem(storageKey) || '[]'
    const items: TSchema[] = JSON.parse(storage)
    const found = items.find((s: TSchema) => s.id === id)
    
    if (found) {
      resetSchema(found)
    } else {
      throw new Error(`Schema com ID ${id} não encontrado`)
    }
  }
  
  /**
   * Deletar schema do storage
   */
  async function deleteSchema(id: string): Promise<void> {
    if (!storageKey) {
      throw new Error('storageKey não configurado. Não é possível deletar.')
    }
    
    const storage = localStorage.getItem(storageKey) || '[]'
    const items: TSchema[] = JSON.parse(storage)
    const filtered = items.filter((s: TSchema) => s.id !== id)
    
    localStorage.setItem(storageKey, JSON.stringify(filtered))
    
    // Se deletamos o schema atual, criar novo
    if (schema.value.id === id) {
      resetSchema()
    }
  }
  
  /**
   * Listar todos os schemas do storage
   */
  async function listSchemas(): Promise<TSchema[]> {
    if (!storageKey) {
      throw new Error('storageKey não configurado. Não é possível listar.')
    }
    
    const storage = localStorage.getItem(storageKey) || '[]'
    return JSON.parse(storage)
  }
  
  /**
   * Exportar schema para JSON
   */
  function exportJSON(): string {
    return serializeSchema(schema.value)
  }
  
  /**
   * Importar schema de JSON
   */
  function importJSON(json: string): void {
    try {
      const parsed = deserializeSchema<TSchema>(json)
      
      // Validar estrutura básica
      if (!isValidSchemaStructure(parsed)) {
        throw new Error('JSON não possui estrutura de schema válida')
      }
      
      // Validar com validador customizado
      if (validator) {
        const result = validator(parsed)
        if (!result.valid) {
          const errorMessages = result.errors.map(e => e.message).join(', ')
          throw new Error(`Schema inválido: ${errorMessages}`)
        }
      }
      
      resetSchema(parsed)
    } catch (error) {
      throw new Error(
        `Erro ao importar JSON: ${error instanceof Error ? error.message : 'Desconhecido'}`
      )
    }
  }
  
  // === SELECTION ===
  
  /**
   * Selecionar item
   */
  function selectItem(id: string | null): void {
    selectedItem.value = id
  }
  
  /**
   * Obter item selecionado
   */
  function getSelectedItem(): TItem | undefined {
    if (!selectedItem.value) return undefined
    return schema.value.items.find(item => item.id === selectedItem.value)
  }
  
  // === HELPERS ===
  
  /**
   * Marcar como dirty (alterado)
   */
  function markDirty(): void {
    isDirty.value = true
    schema.value.updatedAt = generateTimestamp()
  }
  
  /**
   * Criar schema vazio
   */
  function createEmptySchema(): TSchema {
    return ({
      id: generateId(),
      name: 'Novo Schema',
      version: '1.0.0',
      metadata: {} as TSchema['metadata'],
      items: [],
      createdAt: generateTimestamp(),
      updatedAt: generateTimestamp()
    } as unknown) as TSchema
  }
  
  /**
   * Criar item usando factory
   */
  function createItem(type: string): TItem {
    if (itemFactory) {
      return itemFactory(type)
    }
    
    return {
      id: generateId(),
      type,
      label: `${type} item`,
      props: {}
    } as TItem
  }
  
  // === RETURN API ===
  
  return {
    // State
    schema: readonly(schema),
    selectedItem: readonly(selectedItem),
    isDirty: readonly(isDirty),
    isValid,
    validation: readonly(validation),
    
    // Item operations
    addItem,
    removeItem,
    updateItem,
    moveItem,
    duplicateItem,
    clearItems,
    createItem,
    
    // Schema operations
    updateMetadata,
    resetSchema,
    
    // Selection
    selectItem,
    getSelectedItem,
    
    // Persistence
    save,
    load,
    delete: deleteSchema,
    list: listSchemas,
    exportJSON,
    importJSON,
    
    // History
    undo: history?.undo || (() => {}),
    redo: history?.redo || (() => {}),
    canUndo: history?.canUndo || readonly(ref(false)),
    canRedo: history?.canRedo || readonly(ref(false)),
    
    // Utilities
    generateId,
    generateTimestamp
  }
}
