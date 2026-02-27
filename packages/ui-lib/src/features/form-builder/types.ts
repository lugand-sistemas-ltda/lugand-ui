/**
 * Form Builder - Type Definitions
 * 
 * Tipos específicos do Form Builder que extendem BaseSchema
 */

import type { BaseSchema, BaseSchemaItem } from '@/core/schema-builder'
import type { FieldValidationRule } from '../form-renderer/types'

/**
 * ==========================================
 * FORM FIELD
 * ==========================================
 */

/**
 * Tipo de campo do formulário
 */
export type FieldType =
  // Text inputs
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'
  // Select/Options
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  // Date/Time
  | 'date'
  | 'time'
  | 'datetime'
  // Special
  | 'file'
  | 'color'
  | 'range'
  | 'rating'
  | 'hidden' // Campo oculto
  // Campos brasileiros
  | 'cpf'
  | 'cnpj'
  | 'cep'
  | 'phone-br'
  | 'currency-br'

/**
 * Props de campo de formulário
 */
export interface FormFieldProps {
  // Básico
  label?: string
  placeholder?: string
  helperText?: string
  defaultValue?: any
  
  // Validação
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  
  // Visual
  size?: 'small' | 'medium' | 'large'
  variant?: 'outlined' | 'filled' | 'underlined'
  icon?: string
  iconPosition?: 'left' | 'right'
  
  // Grid layout
  gridColumn?: string // Ex: 'span 2', '1 / 3'
  gridRow?: string
  
  // Validação customizada (suporta ambos formatos para compatibilidade)
  validation?: FieldValidationRule[] | {
    rules?: FieldValidationRule[]
    trigger?: 'blur' | 'change' | 'submit'
  }
  
  // Condicional
  conditional?: {
    field: string // ID do campo que controla visibilidade
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan'
    value: any
  }
  
  // Options para select/radio/checkbox
  options?: Array<{
    label: string
    value: any
    disabled?: boolean
    icon?: string
  }>
  
  // Props específicas de tipo (extensível)
  [key: string]: any
}

/**
 * Campo do formulário (extends BaseSchemaItem)
 */
export interface FormField extends BaseSchemaItem {
  type: FieldType
  props?: FormFieldProps
}

/**
 * ==========================================
 * FORM SCHEMA
 * ==========================================
 */

/**
 * Metadados específicos do formulário
 */
export interface FormMetadata {
  title: string
  description?: string
  
  // Submissão
  submitUrl?: string
  submitMethod?: 'POST' | 'PUT' | 'PATCH'
  submitHeaders?: Record<string, string>
  
  // Comportamento
  validateOnChange?: boolean
  validateOnBlur?: boolean
  showRequiredMarker?: boolean
  
  // Multi-step
  steps?: Array<{
    id: string
    title: string
    description?: string
    fieldIds: string[] // IDs dos campos neste step
  }>
  
  // Mensagens
  successMessage?: string
  errorMessage?: string
  loadingMessage?: string
  
  // Ações pós-submit
  redirectOnSuccess?: string
  resetOnSuccess?: boolean
  
  // Layout
  layout?: 'single-column' | 'two-columns' | 'grid'
  gridColumns?: number
  gridGap?: string
  
  // Tags
  tags?: string[]
  category?: string
}

/**
 * Schema do formulário (extends BaseSchema)
 */
export interface FormSchema extends BaseSchema<FormField, FormMetadata> {
  // items já vem de BaseSchema (são FormField[])
  // metadata já vem de BaseSchema (é FormMetadata)
}

/**
 * ==========================================
 * BUILDER SETTINGS
 * ==========================================
 */

/**
 * Configurações do Form Builder
 */
export interface BuilderSettings {
  showGrid: boolean
  snapToGrid: boolean
  showLabels: boolean
  autoSaveInterval: number // ms
  liveValidation: boolean
  theme: 'light' | 'dark' | 'auto'
}

/**
 * ==========================================
 * VALIDATION
 * ==========================================
 */

/**
 * Resultado da validação de formulário
 */
export interface FormValidationResult {
  valid: boolean
  errors: Record<string, string> // fieldId -> error message
  warnings?: Record<string, string>
}

/**
 * ==========================================
 * EXPORT
 * ==========================================
 */

/**
 * Opções de export
 */
export interface ExportOptions {
  format: 'json' | 'yaml' | 'vue' | 'html'
  minify?: boolean
  includeMetadata?: boolean
  prettify?: boolean
}

/**
 * ==========================================
 * EVENTS
 * ==========================================
 */

/**
 * Event de drag de campo
 */
export interface FieldDragEvent {
  fieldId: string
  fromIndex: number
  toIndex: number
}

/**
 * ==========================================
 * HELPER FUNCTIONS
 * ==========================================
 */

/**
 * Cria um FormSchema vazio
 */
export function createEmptyFormSchema(): FormSchema {
  const now = new Date().toISOString()
  
  return {
    id: `form-${Date.now()}`,
    name: 'Novo Formulário',
    version: '2.0.0',
    items: [],
    metadata: {
      title: 'Novo Formulário',
      validateOnChange: true,
      validateOnBlur: true,
      showRequiredMarker: true,
      layout: 'single-column',
      gridColumns: 1
    },
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Cria um FormField padrão
 */
export function createFormField(
  type: FieldType,
  props?: Partial<FormFieldProps>
): FormField {
  return {
    id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    props: {
      label: props?.label || getDefaultFieldLabel(type),
      placeholder: props?.placeholder,
      helperText: props?.helperText,
      required: props?.required ?? false,
      disabled: props?.disabled ?? false,
      readonly: props?.readonly ?? false,
      size: props?.size ?? 'medium',
      variant: props?.variant ?? 'outlined',
      ...getDefaultFieldProps(type),
      ...props
    }
  }
}

/**
 * Retorna label padrão para cada tipo de campo
 */
function getDefaultFieldLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: 'Campo de Texto',
    email: 'Email',
    password: 'Senha',
    number: 'Número',
    tel: 'Telefone',
    hidden: 'Campo Oculto',
    url: 'URL',
    search: 'Buscar',
    textarea: 'Texto Longo',
    select: 'Seleção',
    multiselect: 'Seleção Múltipla',
    radio: 'Opção Única',
    checkbox: 'Múltipla Escolha',
    switch: 'Ativar/Desativar',
    date: 'Data',
    time: 'Hora',
    datetime: 'Data e Hora',
    file: 'Arquivo',
    color: 'Cor',
    range: 'Intervalo',
    rating: 'Avaliação',
    cpf: 'CPF',
    cnpj: 'CNPJ',
    cep: 'CEP',
    'phone-br': 'Telefone',
    'currency-br': 'Valor (R$)'
  }
  
  return labels[type] || 'Campo'
}

/**
 * Retorna props padrão para tipos específicos
 */
function getDefaultFieldProps(type: FieldType): Partial<FormFieldProps> {
  const defaults: Partial<Record<FieldType, Partial<FormFieldProps>>> = {
    cpf: {
      validation: {
        rules: [{ type: 'pattern', value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: 'CPF inválido' }]
      }
    },
    cnpj: {
      validation: {
        rules: [{ type: 'pattern', value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, message: 'CNPJ inválido' }]
      }
    },
    cep: {
      validation: {
        rules: [{ type: 'pattern', value: /^\d{5}-\d{3}$/, message: 'CEP inválido' }]
      }
    },
    'phone-br': {
      validation: {
        rules: [{ type: 'pattern', value: /^\(\d{2}\) \d{4,5}-\d{4}$/, message: 'Telefone inválido' }]
      }
    },
    email: {
      validation: {
        rules: [{ type: 'email', message: 'Email inválido' }]
      }
    },
    textarea: {
      rows: 4
    },
    rating: {
      max: 5,
      icon: '⭐'
    }
  }
  
  return defaults[type] || {}
}

/**
 * ==========================================
 * UI TYPES (para componentes)
 * ==========================================
 */

/**
 * Categoria de campo na paleta
 */
export type FieldCategory = 
  | 'basic'
  | 'input'
  | 'selection'
  | 'date-time'
  | 'special'
  | 'brazilian'
  | 'advanced'  // Campos avançados
  | 'layout'    // Campos de layout (hidden, etc)

/**
 * Item da paleta de campos
 */
export interface FieldTypePalette {
  type: FieldType
  label: string
  icon?: string
  category: FieldCategory
  description?: string
  isPro?: boolean // Indica se é campo PRO
  defaultField?: Partial<FormField> // Campo padrão ao arrastar
}

/**
 * Template de formulário pré-definido
 */
export interface FormTemplate {
  id: string
  name: string
  description?: string
  category?: string
  schema: FormSchema
  thumbnail?: string
}

/**
 * Propriedade editável de um campo
 */
export interface EditableProperty {
  key: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea'
  options?: Array<{ label: string; value: any }>
  group?: string
}

/**
 * Estado do Form Builder
 */
export interface FormBuilderState {
  selectedFieldId: string | null
  mode: 'design' | 'preview' | 'code'
  isDirty: boolean
  hoveredFieldId?: string | null
}

/**
 * Ação do histórico (re-export do core)
 */
export interface HistoryAction {
  type: 'add' | 'remove' | 'update' | 'move' | 'replace'
  timestamp: number
  description?: string
}

/**
 * Props do componente FormBuilder
 */
export interface FormBuilderProps {
  modelValue?: FormSchema
  settings?: Partial<BuilderSettings>
  autoSave?: boolean
  autoSaveDelay?: number
}

/**
 * Eventos emitidos pelo FormBuilder
 */
export interface FormBuilderEmits {
  'update:modelValue': (schema: FormSchema) => void
  'field-select': (fieldId: string | null) => void
  'field-add': (field: FormField, index?: number) => void
  'field-update': (fieldId: string, updates: Partial<FormField>) => void
  'field-remove': (fieldId: string) => void
  'field-move': (fieldId: string, newIndex: number) => void
  'mode-change': (mode: FormBuilderState['mode']) => void
  'export': (schema: FormSchema, format: ExportOptions['format']) => void
  'save': (schema: FormSchema) => void
}

/**
 * Alias para compatibilidade com código legado
 */
export type SchemaValidationResult = FormValidationResult
