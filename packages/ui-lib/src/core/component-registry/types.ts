/**
 * Component Registry - Type Definitions
 * 
 * Sistema de auto-descoberta e registro de componentes.
 * Permite que componentes customizados sejam editáveis no Page Builder.
 * 
 * Funcionamento:
 * 1. Developer cria componente custom
 * 2. Adiciona decorator @Registrable com metadata
 * 3. Component Registry descobre automaticamente
 * 4. Page Builder lista componente como widget disponível
 * 
 * @module core/component-registry
 */

import type { Component } from 'vue'
import type { WidgetCapabilities } from '../widget-system/types'

/**
 * Categoria de componente.
 * Similar a WidgetCategory, mas focado em componentes customizados.
 */
export type ComponentCategory =
  | 'form-control'      // Input, Select, Checkbox, etc
  | 'data-display'      // Table, List, Grid, etc
  | 'feedback'          // Alert, Toast, Modal, etc
  | 'navigation'        // Menu, Tabs, Breadcrumb, etc
  | 'layout'            // Container, Grid, Stack, etc
  | 'media'             // Image, Video, Audio, etc
  | 'chart'             // Bar, Line, Pie, etc
  | 'custom'            // Componentes totalmente customizados

/**
 * Tipo de propriedade editável.
 */
export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'color'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'icon'
  | 'image'
  | 'code'

/**
 * Definição de propriedade editável.
 * Descreve como uma prop pode ser editada no Page Builder.
 */
export interface EditableProp {
  /** Nome da prop (deve corresponder à prop do componente) */
  name: string

  /** Label legível */
  label: string

  /** Tipo da prop */
  type: PropType

  /** Valor padrão */
  defaultValue?: any

  /** Descrição/tooltip */
  description?: string

  /** Se prop é obrigatória */
  required?: boolean

  /** Validação customizada */
  validation?: {
    /** Função de validação */
    validator?: (value: any) => boolean
    /** Mensagem de erro */
    message?: string
  }

  /** Opções (para select/multiselect) */
  options?: Array<{
    label: string
    value: any
  }>

  /** Min/max (para number) */
  min?: number
  max?: number

  /** Pattern (para string) */
  pattern?: string

  /** Placeholder */
  placeholder?: string

  /** Grupo (para organização no editor) */
  group?: string

  /** Ordem de exibição */
  order?: number

  /** Se deve ser exibido como avançado */
  advanced?: boolean

  /** Condição para exibir (expressão) */
  condition?: string
}

/**
 * Definição de evento emitido.
 */
export interface ComponentEvent {
  /** Nome do evento */
  name: string

  /** Descrição do evento */
  description?: string

  /** Payload do evento */
  payload?: {
    /** Nome do parâmetro */
    name: string
    /** Tipo do parâmetro */
    type: string
    /** Descrição */
    description?: string
  }[]
}

/**
 * Definição de slot disponível.
 */
export interface ComponentSlot {
  /** Nome do slot */
  name: string

  /** Descrição do slot */
  description?: string

  /** Props do scoped slot */
  props?: Record<string, {
    type: string
    description?: string
  }>

  /** Se aceita múltiplos elementos */
  multiple?: boolean
}

/**
 * Metadata de componente registrável.
 * Anotado via decorator @Registrable.
 */
export interface ComponentMetadata {
  /** Nome único do componente (kebab-case) */
  name: string

  /** Label legível */
  label: string

  /** Categoria */
  category: ComponentCategory

  /** Descrição */
  description?: string

  /** Ícone/emoji */
  icon?: string

  /** Thumbnail/preview */
  thumbnail?: string

  /** Tags para busca */
  tags?: string[]

  /** Propriedades editáveis */
  props?: EditableProp[]

  /** Eventos emitidos */
  events?: ComponentEvent[]

  /** Slots disponíveis */
  slots?: ComponentSlot[]

  /** Capabilities (herda de Widget) */
  capabilities?: WidgetCapabilities

  /** Template padrão (HTML para preview) */
  defaultTemplate?: string

  /** Exemplos de uso */
  examples?: Array<{
    title: string
    description?: string
    code: string
  }>

  /** Se componente é experimental */
  experimental?: boolean

  /** Versão mínima da lib */
  minVersion?: string

  /** Autor */
  author?: string
}

/**
 * Entrada no Component Registry.
 */
export interface ComponentRegistryEntry {
  /** Metadata do componente */
  metadata: ComponentMetadata

  /** Componente Vue */
  component: Component

  /** Timestamp de registro */
  registeredAt: string

  /** Versão do componente (se disponível) */
  version?: string
}

/**
 * Opções de busca no registry.
 */
export interface ComponentSearchOptions {
  /** Categoria para filtrar */
  category?: ComponentCategory

  /** Tags para filtrar (AND) */
  tags?: string[]

  /** Texto de busca (fuzzy) */
  query?: string

  /** Apenas experimentais */
  experimental?: boolean

  /** Ordenação */
  sortBy?: 'name' | 'label' | 'category' | 'registeredAt'

  /** Ordem */
  sortOrder?: 'asc' | 'desc'

  /** Limite de resultados */
  limit?: number
}

/**
 * Resultado de busca no registry.
 */
export interface ComponentSearchResult {
  /** Componentes encontrados */
  components: ComponentRegistryEntry[]

  /** Total de resultados */
  total: number

  /** Tempo de busca (ms) */
  searchTime: number
}

/**
 * Estatísticas do Component Registry.
 */
export interface ComponentRegistryStats {
  /** Total de componentes registrados */
  total: number

  /** Por categoria */
  byCategory: Record<ComponentCategory, number>

  /** Experimentais */
  experimental: number

  /** Com capabilities */
  withCapabilities: number

  /** Com exemplos */
  withExamples: number
}

/**
 * Opções de validação de componente.
 */
export interface ComponentValidationOptions {
  /** Validar props */
  validateProps?: boolean

  /** Validar eventos */
  validateEvents?: boolean

  /** Validar slots */
  validateSlots?: boolean

  /** Strict mode */
  strict?: boolean
}

/**
 * Resultado de validação de componente.
 */
export interface ComponentValidationResult {
  /** Se componente é válido */
  valid: boolean

  /** Erros encontrados */
  errors: Array<{
    path: string
    message: string
    severity: 'error' | 'warning'
  }>

  /** Warnings */
  warnings?: Array<{
    path: string
    message: string
  }>
}
