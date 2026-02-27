/**
 * Core types for schema-based builders
 * 
 * Este módulo fornece tipos genéricos que servem como base para todos os builders
 * (form-builder, page-builder, doc-builder, etc.)
 */

/**
 * Schema base que TODOS os builders devem estender
 * 
 * @template TItem - Tipo do item do schema (field, block, component, etc)
 * @template TMetadata - Tipo dos metadados customizados
 */
export interface BaseSchema<TItem = any, TMetadata = Record<string, any>> {
  /** Identificador único do schema */
  id?: string
  
  /** Nome amigável do schema */
  name?: string
  
  /** Versão do schema (semver: 1.0.0) */
  version?: string
  
  /** Metadados customizados específicos do builder */
  metadata?: TMetadata
  
  /** Items do schema (fields, blocks, components, etc) */
  items?: TItem[]
  
  /** Timestamp de criação (ISO 8601) */
  createdAt: string
  
  /** Timestamp de última atualização (ISO 8601) */
  updatedAt: string
}

/**
 * Item base do schema (field, block, component, etc)
 */
export interface BaseSchemaItem {
  /** Identificador único do item */
  id: string
  
  /** Tipo do item (depende do builder: 'text', 'number', 'button', etc) */
  type: string
  
  /** Label visível (opcional) */
  label?: string
  
  /** Propriedades customizadas do item */
  props?: Record<string, any>
}

/**
 * Operações padrão do builder
 */
export interface SchemaBuilderOperations<TItem> {
  /** Adicionar item ao schema */
  addItem: (item: TItem, position?: number) => void
  
  /** Remover item do schema */
  removeItem: (id: string) => void
  
  /** Atualizar item existente */
  updateItem: (id: string, updates: Partial<TItem>) => void
  
  /** Mover item para cima/baixo */
  moveItem: (id: string, direction: 'up' | 'down') => void
  
  /** Duplicar item */
  duplicateItem: (id: string) => void
  
  /** Limpar todos os items */
  clearItems: () => void
}

/**
 * Estado do builder
 */
export interface SchemaBuilderState<TSchema, _TItem = any> {
  /** Schema atual (readonly) */
  schema: Readonly<Ref<TSchema>>
  
  /** Item selecionado no momento */
  selectedItem: Readonly<Ref<string | null>>
  
  /** Indica se há alterações não salvas */
  isDirty: Readonly<Ref<boolean>>
  
  /** Indica se o schema está válido */
  isValid: Readonly<Ref<boolean>>
  
  /** Resultado da validação */
  validation: Readonly<Ref<ValidationResult>>
}

/**
 * Funcionalidades de histórico (undo/redo)
 */
export interface SchemaBuilderHistory {
  /** Desfazer última ação */
  undo: () => void
  
  /** Refazer ação desfeita */
  redo: () => void
  
  /** Indica se pode desfazer */
  canUndo: Readonly<Ref<boolean>>
  
  /** Indica se pode refazer */
  canRedo: Readonly<Ref<boolean>>
  
  /** Limpar histórico */
  clearHistory: () => void
}

/**
 * Funcionalidades de persistência
 */
export interface SchemaBuilderPersistence<TSchema> {
  /** Salvar schema (localStorage ou backend) */
  save: () => Promise<void>
  
  /** Carregar schema por ID */
  load: (id: string) => Promise<void>
  
  /** Deletar schema */
  delete: (id: string) => Promise<void>
  
  /** Listar todos os schemas */
  list: () => Promise<TSchema[]>
  
  /** Exportar para JSON */
  export: () => string
  
  /** Importar de JSON */
  import: (json: string) => void
}

/**
 * Resultado de validação
 */
export interface ValidationResult {
  /** Indica se a validação passou */
  valid: boolean
  
  /** Lista de erros encontrados */
  errors: ValidationError[]
}

/**
 * Erro de validação
 */
export interface ValidationError {
  /** Caminho do campo com erro (ex: 'items[0].name') */
  path: string
  
  /** Mensagem de erro amigável */
  message: string
  
  /** Código do erro (para i18n) */
  code: string
  
  /** Valor que causou o erro (opcional) */
  value?: any
}

/**
 * Opções de configuração do useSchemaBuilder
 */
export interface UseSchemaBuilderOptions<TSchema, TItem> {
  /** Schema inicial (ou factory function) */
  initialSchema?: TSchema | (() => TSchema)
  
  /** Chave para localStorage (se usar persistência local) */
  storageKey?: string
  
  /** Função de validação customizada */
  validator?: (schema: TSchema) => ValidationResult
  
  /** Factory para criar novos items */
  itemFactory?: (type: string) => TItem
  
  /** Habilitar histórico de undo/redo */
  enableHistory?: boolean
  
  /** Tamanho máximo do histórico */
  historySize?: number
  
  /** Auto-salvar após mudanças (delay em ms, 0 = desabilitado) */
  autoSaveDelay?: number
}

/**
 * Import necessário do Vue (para type checking)
 */
import type { Ref } from 'vue'
