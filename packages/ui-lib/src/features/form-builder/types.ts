/**
 * Form Builder - Type Definitions
 * 
 * Sistema de construção visual de formulários com drag-and-drop.
 * Permite criar forms interativamente e exportar para FormSchema JSON.
 * 
 * @module features/form-builder
 * @created 2025-01-XX
 */

import type { FormSchema, FormField, FieldType } from '../form-renderer/types'

/**
 * Configuração de um field type disponível na palette
 */
export interface FieldTypePalette {
  /** Tipo do campo */
  type: FieldType

  /** Label exibido na palette */
  label: string

  /** Ícone do campo */
  icon: string

  /** Categoria (Basic, Advanced, Layout) */
  category: FieldCategory

  /** Template padrão ao arrastar */
  defaultField: Partial<FormField>

  /** Propriedades editáveis */
  editableProps: string[]

  /** Se é um campo Pro (requer upgrade) */
  isPro?: boolean
}

/**
 * Categoria de campos
 */
export type FieldCategory =
  | 'basic'      // Text, Email, Number, Textarea
  | 'selection'  // Select, Radio, Checkbox
  | 'advanced'   // Date, Time, File, Color
  | 'layout'     // Divider, HTML, Heading
  | 'custom'     // Campos customizados

/**
 * Estado do Form Builder
 */
export interface FormBuilderState {
  /** Schema sendo editado */
  schema: FormSchema

  /** Campo atualmente selecionado */
  selectedFieldId: string | null

  /** Modo de edição */
  mode: 'design' | 'preview' | 'code'

  /** Histórico para undo/redo */
  history: FormSchema[]

  /** Índice atual no histórico */
  historyIndex: number

  /** Se tem alterações não salvas */
  isDirty: boolean

  /** Configurações do builder */
  settings: BuilderSettings
}

/**
 * Configurações do Form Builder
 */
export interface BuilderSettings {
  /** Mostrar grid helper */
  showGrid: boolean

  /** Snap to grid */
  snapToGrid: boolean

  /** Mostrar labels inline */
  showLabels: boolean

  /** Auto-save intervalo (ms) */
  autoSaveInterval: number

  /** Validação em tempo real */
  liveValidation: boolean

  /** Tema do editor */
  theme: 'light' | 'dark' | 'auto'
}

/**
 * Evento de drag and drop
 */
export interface FieldDragEvent {
  /** Tipo do campo sendo arrastado */
  fieldType: FieldType

  /** Campo completo (se arrastar campo existente) */
  field?: FormField

  /** Índice de origem (se mover campo) */
  sourceIndex?: number

  /** Índice de destino */
  targetIndex: number

  /** Ação (add, move, copy) */
  action: 'add' | 'move' | 'copy'
}

/**
 * Propriedade editável de um campo
 */
export interface EditableProperty {
  /** Nome da propriedade */
  name: string

  /** Label exibido */
  label: string

  /** Tipo de input para editar */
  inputType: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'color' | 'json'

  /** Opções (se select) */
  options?: Array<{ label: string; value: any }>

  /** Valor padrão */
  defaultValue?: any

  /** Se é obrigatório */
  required?: boolean

  /** Validação customizada */
  validator?: (value: any) => boolean | string

  /** Help text */
  helpText?: string
}

/**
 * Resultado de validação do schema
 */
export interface SchemaValidationResult {
  /** Se é válido */
  isValid: boolean

  /** Erros encontrados */
  errors: Array<{
    field: string
    property: string
    message: string
  }>

  /** Warnings */
  warnings: Array<{
    field: string
    message: string
  }>
}

/**
 * Template de formulário pré-definido
 */
export interface FormTemplate {
  /** ID único */
  id: string

  /** Nome do template */
  name: string

  /** Descrição */
  description: string

  /** Categoria */
  category: 'auth' | 'contact' | 'profile' | 'survey' | 'checkout' | 'other'

  /** Schema do template */
  schema: FormSchema

  /** Preview image URL */
  thumbnail?: string

  /** Tags para busca */
  tags: string[]
}

/**
 * Ação do histórico (undo/redo)
 */
export interface HistoryAction {
  /** Tipo de ação */
  type: 'add' | 'remove' | 'update' | 'move' | 'reorder'

  /** Campo afetado */
  fieldName?: string

  /** Estado anterior */
  before: FormSchema

  /** Estado após */
  after: FormSchema

  /** Timestamp */
  timestamp: number
}

/**
 * Opções de exportação
 */
export interface ExportOptions {
  /** Formato de exportação */
  format: 'json' | 'typescript' | 'vue' | 'html'

  /** Incluir valores padrão */
  includeDefaults: boolean

  /** Minificar JSON */
  minify: boolean

  /** Incluir comentários */
  includeComments: boolean

  /** Validar antes de exportar */
  validate: boolean
}

/**
 * Props do FormBuilder
 */
export interface FormBuilderProps {
  /** Schema inicial */
  modelValue?: FormSchema

  /** Modo inicial */
  initialMode?: 'design' | 'preview' | 'code'

  /** Templates disponíveis */
  templates?: FormTemplate[]

  /** Campos customizados */
  customFields?: FieldTypePalette[]

  /** Se permite edição */
  readonly?: boolean

  /** Auto-save callback */
  onAutoSave?: (schema: FormSchema) => void

  /** Altura do builder */
  height?: string

  /** Configurações */
  settings?: Partial<BuilderSettings>
}

/**
 * Emits do FormBuilder
 */
export interface FormBuilderEmits {
  /** Atualiza v-model */
  'update:modelValue': [schema: FormSchema]

  /** Campo selecionado mudou */
  'field-select': [field: FormField | null]

  /** Campo adicionado */
  'field-add': [field: FormField, index: number]

  /** Campo removido */
  'field-remove': [field: FormField, index: number]

  /** Campo atualizado */
  'field-update': [field: FormField, changes: Partial<FormField>]

  /** Schema validado */
  'validate': [result: SchemaValidationResult]

  /** Schema exportado */
  'export': [data: string, format: ExportOptions['format']]

  /** Modo mudou */
  'mode-change': [mode: 'design' | 'preview' | 'code']
}
