/**
 * Low-Code Engine - Component Types
 *
 * Define o contrato de registro de componentes no motor low-code.
 * Qualquer componente (primitivo, complexo, customizado) que queira
 * aparecer na paleta dos builders deve ter um ComponentDefinition.
 *
 * MIGRAÇÃO:
 * - Substitui: EditableProp (component-registry/types.ts) → PropDefinition
 * - Substitui: WidgetDefinition (widget-system/widget-registry.ts)
 * - Substitui: ComponentCategory (component-registry/types.ts) → ComponentCategory (unificado)
 * - Unifica: widget-registry + component-registry em um único sistema
 *
 * REGRA:
 * Um componente da lib (ex: Button.vue) + um ComponentDefinition
 * = Componente disponível nos builders.
 *
 * @module core/low-code-engine/types/component
 */

import type { Component } from 'vue'
import type { BuilderContextType, SchemaNode } from './schema.types'

// ============================================================
// COMPONENT CATEGORY
// Unifica WidgetCategory + ComponentCategory existentes
// ============================================================

/**
 * Categoria do componente na paleta do builder.
 * Determina em qual grupo/seção o componente aparece.
 *
 * Ordem de exibição sugerida na paleta:
 * layout → primitives → form → data → visualization → navigation → feedback → media → custom
 */
export type ComponentCategory =
  | 'layout'         // Container, Section, Grid, Flex, Spacer, Divider
  | 'primitives'     // Button, Icon, Badge, Avatar, Text, Heading
  | 'form'           // Input, Select, Checkbox, Radio, Switch, DateInput
  | 'data'           // DataTable, List, Card, StatCard, Timeline
  | 'visualization'  // Charts (Bar, Line, Pie, Area, Scatter)
  | 'navigation'     // Tabs, Accordion, Breadcrumb, Pagination, Drawer
  | 'feedback'       // Alert, Spinner, Skeleton, EmptyState, Toast
  | 'media'          // Image, Video, Carousel, QRCode
  | 'document'       // Heading (doc), Paragraph, Table (doc), Signature
  | 'custom'         // Componentes registrados pelo cliente da lib

// ============================================================
// PROP DEFINITION - Descreve props editáveis no Properties Panel
// ============================================================

/**
 * Definição base de uma propriedade editável.
 * Cada tipo adiciona campos específicos.
 */
interface BasePropDefinition {
  /** Chave da prop (deve corresponder ao nome da prop no componente Vue) */
  key: string

  /** Label legível para exibição no Properties Panel */
  label: string

  /**
   * Grupo do Properties Panel onde esta prop aparece.
   * - basic: Propriedades principais (sempre visível)
   * - style: Aparência visual
   * - responsive: Configurações por breakpoint
   * - data: Vinculação de dados / DataSource
   * - advanced: Configurações avançadas (colapsado por padrão)
   */
  group: 'basic' | 'style' | 'responsive' | 'data' | 'advanced'

  /** Tooltip de ajuda para o usuário */
  description?: string

  /** Se a prop é obrigatória */
  required?: boolean

  /** Ordem de exibição dentro do grupo (menor = primeiro) */
  order?: number
}

/** Prop de texto simples ou multilinha */
export interface StringPropDefinition extends BasePropDefinition {
  type: 'string'
  defaultValue: string
  placeholder?: string
  multiline?: boolean
  maxLength?: number
}

/** Prop numérica com range opcional */
export interface NumberPropDefinition extends BasePropDefinition {
  type: 'number'
  defaultValue: number
  min?: number
  max?: number
  step?: number
  unit?: string  // 'px', '%', 'rem'
}

/** Prop booleana (toggle) */
export interface BooleanPropDefinition extends BasePropDefinition {
  type: 'boolean'
  defaultValue: boolean
}

/** Prop de seleção única */
export interface SelectPropDefinition extends BasePropDefinition {
  type: 'select'
  defaultValue: string
  options: Array<{
    label: string
    value: string
    icon?: string
    description?: string
  }>
}

/** Prop de seleção múltipla */
export interface MultiSelectPropDefinition extends BasePropDefinition {
  type: 'multiselect'
  defaultValue: string[]
  options: Array<{
    label: string
    value: string
  }>
}

/** Prop de cor */
export interface ColorPropDefinition extends BasePropDefinition {
  type: 'color'
  defaultValue: string  // Hex, CSS var, ou token da lib: 'var(--color-primary)'
  allowTokens?: boolean // Se permite tokens CSS do design system
}

/** Prop de ícone (usa o sistema Icon.vue da lib) */
export interface IconPropDefinition extends BasePropDefinition {
  type: 'icon'
  defaultValue: string
  iconType?: 'ui' | 'brand' | 'emoji' | 'all'
}

/**
 * Prop responsiva — permite configurar valores diferentes por breakpoint.
 * Exibe tabs de breakpoint no Properties Panel: [📱 SM] [💻 MD] [🖥️ LG] [📺 XL]
 */
export interface ResponsivePropDefinition extends BasePropDefinition {
  type: 'responsive'
  /** Subtipo do valor responsivo */
  valueType: 'string' | 'number' | 'select'
  defaultValue: string
  /** Opções disponíveis (se valueType === 'select') */
  options?: Array<{ label: string; value: string }>
  /** Unidade (se valueType === 'number') */
  unit?: string
}

/**
 * Prop de vinculação de dados.
 * Exibe um seletor de DataSources e variáveis registradas.
 * É o ponto de integração com o backend do cliente.
 *
 * @example
 * // DataTable recebe uma lista de produtos da API:
 * {
 *   key: 'dataSource',
 *   type: 'data-binding',
 *   label: 'Fonte de Dados',
 *   acceptedTypes: ['array']
 * }
 */
export interface DataBindingPropDefinition extends BasePropDefinition {
  type: 'data-binding'
  defaultValue: null
  /** Quais tipos de dados esta prop aceita */
  acceptedTypes: Array<'string' | 'number' | 'boolean' | 'array' | 'object'>
  /** Se permite vinculação a campos individuais de um DataSource */
  allowFieldBinding?: boolean
}

/**
 * Prop de configuração de colunas (para DataTable).
 * Quando um DataSource é selecionado, as colunas são inferidas automaticamente.
 */
export interface ColumnsPropDefinition extends BasePropDefinition {
  type: 'columns-config'
  defaultValue: ColumnConfig[]
}

export interface ColumnConfig {
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'currency'
  visible: boolean
  sortable?: boolean
  width?: string
  format?: string
}

/**
 * Union de todos os tipos de PropDefinition.
 * Usado em ComponentDefinition.propsSchema.
 */
export type PropDefinition =
  | StringPropDefinition
  | NumberPropDefinition
  | BooleanPropDefinition
  | SelectPropDefinition
  | MultiSelectPropDefinition
  | ColorPropDefinition
  | IconPropDefinition
  | ResponsivePropDefinition
  | DataBindingPropDefinition
  | ColumnsPropDefinition

// ============================================================
// COMPONENT DEFINITION - O contrato de registro
// ============================================================

/**
 * Definição completa de um componente registrável no motor low-code.
 *
 * Para registrar um componente da lib (ou customizado) no builder:
 * 1. Criar um ComponentDefinition
 * 2. Registrar no unified-registry: registry.register(definition)
 * 3. O componente aparece automaticamente na paleta dos builders corretos
 *
 * @example
 * ```typescript
 * // Registrando o Button da lib:
 * const buttonDefinition: ComponentDefinition = {
 *   type: 'button',
 *   label: 'Button',
 *   icon: 'smart_button',
 *   category: 'primitives',
 *   contexts: ['page', 'form', 'doc'],
 *   isContainer: false,
 *   accepts: 'none',
 *   propsSchema: [
 *     { key: 'label', type: 'string', label: 'Texto', defaultValue: 'Button', group: 'basic' },
 *     { key: 'variant', type: 'select', label: 'Estilo', group: 'basic',
 *       defaultValue: 'primary',
 *       options: [{ label: 'Primary', value: 'primary' }, ...] },
 *   ],
 *   defaultProps: { label: 'Button', variant: 'primary', size: 'md' },
 *   component: Button,
 * }
 * ```
 */
export interface ComponentDefinition {
  // --- Identidade ---

  /**
   * Identificador único do tipo de componente.
   * Usado em SchemaNode.type e para busca no registry.
   * Usar kebab-case: 'data-table', 'chart-bar', 'form-input'
   */
  type: string

  /** Nome legível para exibição na paleta e no editor */
  label: string

  /**
   * Nome do ícone para exibição na paleta.
   * Usa o sistema Icon.vue da lib (type: 'ui').
   */
  icon: string

  /** Categoria para agrupamento na paleta */
  category: ComponentCategory

  /** Descrição/tooltip do componente na paleta */
  description?: string

  // --- Contextos (filtros dos builders) ---

  /**
   * Em quais contextos de builder este componente aparece na paleta.
   *
   * @example
   * // Input aparece apenas em forms:
   * contexts: ['form']
   *
   * // Container aparece em page, form e doc:
   * contexts: ['page', 'form', 'doc']
   *
   * // Button aparece em todos os contextos:
   * contexts: ['page', 'form', 'doc']
   */
  contexts: BuilderContextType[]

  // --- Aninhamento ---

  /**
   * Se este componente é um container (aceita filhos como drop zone).
   * - true: exibe drop zone interna no canvas, children pode ser populado
   * - false: é um leaf node, children permanece sempre vazio
   */
  isContainer: boolean

  /**
   * Quais tipos de componentes este nó aceita como filhos diretos.
   * Só relevante se isContainer === true.
   * - 'all': aceita qualquer componente registrado
   * - 'none': não aceita filhos (equivalente a isContainer: false)
   * - string[]: lista de ComponentDefinition.type aceitos
   *
   * @example
   * // Form aceita apenas campos de formulário:
   * accepts: ['text-input', 'select', 'checkbox', 'radio', 'button']
   *
   * // Container aceita qualquer coisa:
   * accepts: 'all'
   */
  accepts: string[] | 'all' | 'none'

  /** Número máximo de filhos diretos. undefined = sem limite. */
  maxChildren?: number

  /**
   * Tipos de nó que este componente DEVE estar dentro.
   * Se vazio/undefined, pode estar em qualquer lugar.
   * @example ['form'] — só pode ser filho de um nó 'form'
   */
  requiresParent?: string[]

  /**
   * Se pode existir apenas uma instância por schema.
   * @example true para 'page-root', 'form-root'
   */
  singleton?: boolean

  // --- Properties Panel ---

  /**
   * Schema das props editáveis.
   * O Properties Panel é gerado AUTOMATICAMENTE a partir deste array.
   * Ordem dos itens define ordem no painel (combinada com .order).
   */
  propsSchema: PropDefinition[]

  // --- Defaults ---

  /**
   * Valores padrão das props ao dropar o componente no canvas.
   * Todas as keys do propsSchema com required: true devem ter default aqui.
   */
  defaultProps: Record<string, any>

  /** Estilo padrão ao dropar no canvas */
  defaultStyle?: Record<string, any>

  /**
   * Filhos padrão ao dropar no canvas.
   * Útil para componentes que já vêm com estrutura interna.
   *
   * @example
   * // Card já vem com header e body:
   * defaultChildren: [
   *   { type: 'card-header', props: { title: 'Título' }, children: [], ... },
   *   { type: 'card-body', props: {}, children: [], ... }
   * ]
   */
  defaultChildren?: Omit<SchemaNode, 'id'>[]

  // --- Componentes Vue ---

  /**
   * Componente Vue que renderiza este nó.
   * É o componente real da lib (ex: Button.vue, DataTable.vue).
   */
  component: Component

  /**
   * Componente Vue para preview na paleta (opcional).
   * Se não fornecido, usa uma versão simplificada do componente.
   */
  previewComponent?: Component
}

// ============================================================
// COMPONENT REGISTRATION - Para uso no unified-registry
// ============================================================

/**
 * Resultado de busca no registry.
 */
export type ComponentLookupResult =
  | { found: true; definition: ComponentDefinition }
  | { found: false; type: string }

/**
 * Filtros para listar componentes do registry.
 */
export interface ComponentListFilter {
  context?: BuilderContextType
  category?: ComponentCategory
  search?: string
  isContainer?: boolean
}
