/**
 * Widget System - Core Types
 * 
 * Define os tipos fundamentais para o sistema de widgets da @lugand-ui.
 * Widgets são componentes plugáveis que podem ser usados em aplicações low-code.
 * 
 * Arquitetura:
 * - WidgetDefinition: Metadados de um tipo de widget (ex: 'form', 'card', 'chart')
 * - WidgetSchema: Instância configurada de um widget em uma página
 * - WidgetSlotProps: Props disponíveis para slots customizados
 * 
 * @module core/widget-system
 */

import type { Component } from 'vue'

/**
 * Categorias de widgets disponíveis.
 * Usado para organizar a palette de componentes no Page Builder.
 */
export type WidgetCategory =
  | 'data-entry'      // Forms, inputs, selects
  | 'data-display'    // Tables, cards, lists
  | 'visualization'   // Charts, graphs, maps
  | 'layout'          // Containers, grids, dividers
  | 'navigation'      // Menus, breadcrumbs, tabs
  | 'feedback'        // Alerts, toasts, modals
  | 'media'           // Images, videos, carousels
  | 'custom'          // Widgets customizados do cliente

/**
 * Posição e dimensões de um widget em um layout grid.
 * Usado pelo Page Builder para posicionar widgets na tela.
 */
export interface WidgetPosition {
  /** Posição X (coluna) no grid */
  x: number
  /** Posição Y (linha) no grid */
  y: number
  /** Largura em unidades de grid */
  w: number
  /** Altura em unidades de grid */
  h: number
}

/**
 * Configuração de data source para widgets que consomem APIs.
 * 
 * @example
 * ```typescript
 * {
 *   type: 'api',
 *   endpoint: '/api/products',
 *   method: 'GET',
 *   params: { category: 'electronics' }
 * }
 * ```
 */
export interface DataSourceConfig {
  /** Tipo de data source */
  type: 'api' | 'store' | 'static'

  /** Endpoint da API (se type === 'api') */
  endpoint?: string

  /** Método HTTP (se type === 'api') */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'

  /** Parâmetros da request */
  params?: Record<string, any>

  /** Nome do Pinia store (se type === 'store') */
  store?: string

  /** Método do store para chamar */
  storeMethod?: string

  /** Dados estáticos (se type === 'static') */
  data?: any[]

  /** Transformação dos dados antes de usar */
  transform?: string // Expressão JavaScript
}

/**
 * Capacidades de um widget.
 * Define o que um widget pode fazer (usado pelo Page Builder).
 */
export interface WidgetCapabilities {
  /** Widget pode conectar a data sources? */
  hasDataSource: boolean

  /** Widget emite eventos que outros podem escutar? */
  emitsEvents: boolean

  /** Widget aceita filtros/parâmetros externos? */
  acceptsFilters: boolean

  /** Widget pode ser editado visualmente? */
  isEditable: boolean

  /** Widget suporta slots customizados? */
  hasSlots: boolean
}

/**
 * Schema de um widget (instância configurada).
 * Este é o JSON que descreve um widget específico em uma página.
 * 
 * @example
 * ```json
 * {
 *   "id": "form-cadastro-produto",
 *   "type": "form",
 *   "position": { "x": 0, "y": 0, "w": 6, "h": 4 },
 *   "config": {
 *     "fields": [...]
 *   }
 * }
 * ```
 */
export interface WidgetSchema<TConfig = Record<string, any>> {
  /** ID único do widget na página */
  id: string

  /** Tipo do widget (deve existir no registry) */
  type: string

  /** Posição no layout (usado pelo Page Builder) */
  position?: WidgetPosition

  /** Configuração específica do widget */
  config?: TConfig

  /** Widgets filhos (para containers/layouts) */
  children?: WidgetSchema[]

  /** Data source (opcional) */
  dataSource?: DataSourceConfig

  /** Bindings de dados externos */
  bindings?: Record<string, string> // Ex: { "filter": "{{ formFiltros.estado }}" }

  /** Visibilidade condicional */
  visible?: boolean | string // Ex: "{{ user.isAdmin }}"

  /** Metadados (não afetam renderização) */
  metadata?: {
    /** Nome amigável para exibir no editor */
    label?: string

    /** Descrição */
    description?: string

    /** Tags */
    tags?: string[]

    /** Criado por */
    createdBy?: string

    /** Data de criação */
    createdAt?: string
  }
}

/**
 * Definição de um tipo de widget.
 * Registrado no Widget Registry para uso no Page Builder.
 * 
 * @example
 * ```typescript
 * const formWidgetDefinition: WidgetDefinition = {
 *   type: 'form',
 *   category: 'data-entry',
 *   label: 'Form Builder',
 *   icon: '📝',
 *   description: 'Formulários dinâmicos',
 *   component: FormBuilderWidget,
 *   editor: FormBuilderEditor,
 *   renderer: FormBuilderRenderer,
 *   defaultConfig: { fields: [], actions: [] },
 *   capabilities: {
 *     hasDataSource: false,
 *     emitsEvents: true,
 *     acceptsFilters: false,
 *     isEditable: true,
 *     hasSlots: true
 *   }
 * }
 * ```
 */
export interface WidgetDefinition<TConfig = Record<string, any>> {
  /** Tipo único do widget (ex: 'form', 'card', 'chart') */
  type: string

  /** Categoria do widget */
  category: WidgetCategory

  /** Nome amigável para exibir */
  label: string

  /** Ícone (emoji ou path) */
  icon: string

  /** Descrição curta */
  description: string

  /** Componente Vue do widget (runtime) */
  component: Component

  /** Componente Vue do editor (Page Builder) */
  editor?: Component

  /** Componente Vue do renderer (alternativo ao component) */
  renderer?: Component

  /** Configuração padrão ao criar widget */
  defaultConfig: TConfig

  /** Capacidades do widget */
  capabilities: WidgetCapabilities

  /** Props editáveis no Page Builder */
  editableProps?: PropDefinition[]

  /** Eventos emitidos pelo widget */
  events?: EventDefinition[]
}

/**
 * Definição de uma prop editável.
 * Usado pelo Page Builder para gerar UI de edição.
 */
export interface PropDefinition {
  /** Nome da prop */
  name: string

  /** Tipo da prop */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function'

  /** Label para exibir */
  label: string

  /** Descrição */
  description?: string

  /** Valor padrão */
  default?: any

  /** Obrigatório? */
  required?: boolean

  /** Como editar no Page Builder */
  control: ControlType

  /** Opções (se control === 'select' ou 'radio') */
  options?: Array<{ value: any; label: string }>

  /** Validação */
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: string // Expressão JavaScript
  }
}

/**
 * Tipos de controles de edição.
 */
export type ControlType =
  | 'text-input'        // Input de texto
  | 'number-input'      // Input numérico
  | 'textarea'          // Textarea
  | 'checkbox'          // Checkbox
  | 'switch'            // Switch (toggle)
  | 'select'            // Select dropdown
  | 'radio'             // Radio buttons
  | 'color-picker'      // Seletor de cor
  | 'date-picker'       // Seletor de data
  | 'code-editor'       // Editor de código
  | 'json-editor'       // Editor de JSON
  | 'options-editor'    // Editor de array de opções
  | 'binding-editor'    // Editor de bindings ({{ ... }})

/**
 * Definição de um evento emitido pelo widget.
 */
export interface EventDefinition {
  /** Nome do evento */
  name: string

  /** Descrição */
  description: string

  /** Payload do evento */
  payload?: {
    /** Tipo do payload */
    type: string

    /** Descrição do payload */
    description: string
  }
}

/**
 * Evento emitido por um widget em runtime.
 * Usado pelo WidgetRenderer para comunicar eventos ao parent.
 */
export interface WidgetEvent<TPayload = any> {
  /** ID do widget que emitiu */
  widgetId: string

  /** Tipo do widget */
  widgetType: string

  /** Nome do evento */
  eventName: string

  /** Dados do evento */
  payload: TPayload

  /** Timestamp */
  timestamp: number
}

/**
 * Schema de uma página completa.
 * Contém múltiplos widgets organizados em um layout.
 * 
 * @example
 * ```json
 * {
 *   "id": "dashboard-vendas",
 *   "path": "/vendas/dashboard",
 *   "title": "Dashboard de Vendas",
 *   "layout": "grid",
 *   "widgets": [...]
 * }
 * ```
 * 
 * NOTA: PageSchema completo está em schema-system/types.ts
 * Aqui no Widget System temos apenas WidgetSchema (instância de widget).
 */

/**
 * Mensagem de comunicação entre widgets.
 * Usado pelo Widget Event Bus para comunicação entre widgets.
 */
export interface WidgetMessage<TPayload = any> {
  /** ID do widget emissor */
  from: string

  /** ID do widget receptor (undefined = broadcast) */
  to?: string

  /** Tipo da mensagem */
  type: string

  /** Dados da mensagem */
  payload: TPayload

  /** Timestamp */
  timestamp?: number
}

/**
 * Options para renderizar um widget.
 */
export interface WidgetRenderOptions {
  /** Modo de renderização */
  mode: 'runtime' | 'editor' | 'preview'

  /** Tema */
  theme?: 'light' | 'dark'

  /** Callbacks */
  callbacks?: {
    onUpdate?: (widget: WidgetSchema) => void
    onDelete?: (widgetId: string) => void
    onError?: (error: Error) => void
  }
}
