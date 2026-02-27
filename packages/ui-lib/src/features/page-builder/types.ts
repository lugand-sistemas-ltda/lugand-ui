/**
 * Page Builder - Type Definitions
 * 
 * Tipos específicos do Page Builder que extendem BaseSchema
 */

import type { BaseSchema, BaseSchemaItem } from '@/core/schema-builder'

/**
 * ==========================================
 * PAGE WIDGET
 * ==========================================
 */

/**
 * Tipo de widget da página
 */
export type WidgetType =
  // Text
  | 'heading'
  | 'paragraph'
  | 'text'      // Widget de texto genérico
  | 'quote'
  | 'code'
  // Media
  | 'image'
  | 'video'
  | 'audio'
  | 'embed'
  // Interactive
  | 'button'
  | 'link'
  | 'form'
  // Layout
  | 'container'
  | 'section'   // Seção de página
  | 'grid'
  | 'flex'
  | 'stack'
  | 'spacer'
  | 'divider'
  // Data
  | 'table'
  | 'datatable' // Data table com features avançadas
  | 'list'
  | 'card'
  // Charts
  | 'chart-line'
  | 'chart-bar'
  | 'chart-pie'
  // Form components
  | 'formrenderer'  // Form renderer (exibe formulário)
  | 'formbuilder'   // Form builder (editor de form)
  // Navigation
  | 'tabs'
  | 'breadcrumb'
  // Feedback
  | 'alert'
  | 'badge'
  // Custom
  | 'custom'

/**
 * Props de widget
 */
export interface WidgetProps {
  // Comum
  label?: string
  className?: string
  
  // Layout
  layout?: {
    position?: 'relative' | 'absolute' | 'fixed' | 'sticky'
    display?: 'block' | 'inline' | 'flex' | 'grid'
    
    // Flexbox
    flexDirection?: 'row' | 'column'
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
    alignItems?: 'start' | 'center' | 'end' | 'stretch'
    gap?: string
    
    // Grid
    gridColumns?: number
    gridRows?: number
    gridGap?: string
    
    // Spacing
    padding?: string
    margin?: string
    
    // Size
    width?: string
    height?: string
    minWidth?: string
    maxWidth?: string
  }
  
  // Style
  style?: {
    background?: string
    color?: string
    border?: string
    borderRadius?: string
    boxShadow?: string
    [key: string]: any
  }
  
  // Content (específico por tipo)
  content?: any
  
  // Props específicas de tipo (extensível)
  [key: string]: any
}

/**
 * Widget da página (extends BaseSchemaItem)
 */
export interface PageWidget extends BaseSchemaItem {
  type: WidgetType
  props?: WidgetProps
  children?: PageWidget[] // Suporta aninhamento
  
  // Compatibilidade: alguns configs legados usam 'config'
  config?: Record<string, any>
}

/**
 * ==========================================
 * PAGE SCHEMA
 * ==========================================
 */

/**
 * Metadados específicos da página
 */
export interface PageMetadata {
  title: string
  description?: string
  
  // SEO
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
    canonicalUrl?: string
  }
  
  // Layout
  layout?: 'full' | 'sidebar-left' | 'sidebar-right' | 'three-column'
  pageWidth?: 'contained' | 'full-width' | 'wide'
  
  // Tema
  theme?: {
    mode?: 'light' | 'dark' | 'auto'
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
  }
  
  // Scripts
  scripts?: {
    head?: string[]
    body?: string[]
    onMount?: string
    onUnmount?: string
  }
  
  // Tags
  tags?: string[]
  category?: string
  status?: 'draft' | 'published' | 'archived'
}

/**
 * Schema da página (extends BaseSchema)
 */
export interface PageSchema extends BaseSchema<PageWidget, PageMetadata> {
  // items já vem de BaseSchema (são PageWidget[])
  // metadata já vem de BaseSchema (é PageMetadata)
  
  // Propriedades adicionais para compatib ilidade com code-generator (opcionais)
  /** Layout configuration (opcional) */
  layout?: {
    strategy?: 'grid' | 'flex' | 'stack'
    config?: Record<string, any>
  }
  
  /** Theme configuration (opcional) */
  theme?: {
    colors?: Record<string, string>
    spacing?: Record<string, string | number>
    [key: string]: any
  }
  
  /** Event handlers (opcional) */
  eventHandlers?: Record<string, {
    event: string
    handler: Function
    [key: string]: any
  }>
  
  /** Data sources (opcional) */
  dataSources?: Record<string, {
    type: string
    config?: Record<string, any>
    [key: string]: any
  }>
}

/**
 * ==========================================
 * BUILDER SETTINGS
 * ==========================================
 */

/**
 * Configurações do Page Builder
 */
export interface BuilderSettings {
  showGrid: boolean
  snapToGrid: boolean
  showOutlines: boolean
  autoSaveInterval: number // ms
  liveValidation: boolean
  theme: 'light' | 'dark' | 'auto'
  showBreadcrumb: boolean
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
  format: 'json' | 'yaml' | 'vue' | 'html' | 'react'
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
 * Event de drag de widget
 */
export interface WidgetDragEvent {
  widgetId: string
  fromIndex: number
  toIndex: number
  fromParentId?: string
  toParentId?: string
}

/**
 * ==========================================
 * HELPER FUNCTIONS
 * ==========================================
 */

/**
 * Cria um PageSchema vazio
 */
export function createEmptyPageSchema(): PageSchema {
  const now = new Date().toISOString()
  
  return {
    id: `page-${Date.now()}`,
    name: 'Nova Página',
    version: '2.0.0',
    items: [],
    metadata: {
      title: 'Nova Página',
      layout: 'full',
      pageWidth: 'contained',
      status: 'draft'
    },
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Cria um PageWidget padrão
 */
export function createPageWidget(
  type: WidgetType,
  props?: Partial<WidgetProps>
): PageWidget {
  return {
    id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    props: {
      label: props?.label || getDefaultWidgetLabel(type),
      ...getDefaultWidgetProps(type),
      ...props
    },
    children: type === 'container' || type === 'grid' || type === 'flex' || type === 'stack' ? [] : undefined
  }
}

/**
 * Retorna label padrão para cada tipo de widget
 */
function getDefaultWidgetLabel(type: WidgetType): string {
  const labels: Record<WidgetType, string> = {
    heading: 'Título',
    paragraph: 'Parágrafo',
    text: 'Texto',
    quote: 'Citação',
    code: 'Código',
    image: 'Imagem',
    video: 'Vídeo',
    audio: 'Áudio',
    embed: 'Embed',
    button: 'Botão',
    link: 'Link',
    form: 'Formulário',
    container: 'Container',
    section: 'Seção',
    grid: 'Grid',
    flex: 'Flex',
    stack: 'Stack',
    spacer: 'Espaçador',
    divider: 'Divisor',
    table: 'Tabela',
    list: 'Lista',
    card: 'Card',
    'chart-line': 'Gráfico de Linha',
    'chart-bar': 'Gráfico de Barras',
    'chart-pie': 'Gráfico de Pizza',
    datatable: 'Tabela de Dados',
    formrenderer: 'Formulário',
    formbuilder: 'Construtor de Formulário',
    tabs: 'Abas',
    breadcrumb: 'Breadcrumb',
    alert: 'Alerta',
    badge: 'Badge',
    custom: 'Widget Customizado'
  }
  
  return labels[type] || 'Widget'
}

/**
 * Retorna props padrão para tipos específicos
 */
function getDefaultWidgetProps(type: WidgetType): Partial<WidgetProps> {
  const defaults: Partial<Record<WidgetType, Partial<WidgetProps>>> = {
    heading: {
      content: 'Novo Título',
      level: 2,
      style: {
        fontSize: '2rem',
        fontWeight: 'bold'
      }
    },
    paragraph: {
      content: 'Novo parágrafo...',
      style: {
        lineHeight: '1.6'
      }
    },
    button: {
      content: 'Clique aqui',
      variant: 'primary',
      size: 'medium'
    },
    container: {
      layout: {
        padding: '1rem',
        display: 'block'
      }
    },
    grid: {
      layout: {
        display: 'grid',
        gridColumns: 2,
        gridGap: '1rem'
      }
    },
    flex: {
      layout: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem'
      }
    },
    stack: {
      layout: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }
    },
    spacer: {
      layout: {
        height: '2rem'
      }
    },
    divider: {
      style: {
        border: '1px solid #e0e0e0'
      }
    }
  }
  
  return defaults[type] || {}
}

/**
 * Busca widget recursivamente por ID (suporta aninhamento)
 */
export function findWidgetById(
  widgets: PageWidget[],
  id: string
): PageWidget | null {
  for (const widget of widgets) {
    if (widget.id === id) return widget
    
    if (widget.children) {
      const found = findWidgetById(widget.children, id)
      if (found) return found
    }
  }
  
  return null
}

/**
 * Remove widget recursivamente por ID
 */
export function removeWidgetById(
  widgets: PageWidget[],
  id: string
): PageWidget | null {
  for (let i = 0; i < widgets.length; i++) {
    const widget = widgets[i]
    if (!widget) continue
    
    if (widget.id === id) {
      return widgets.splice(i, 1)[0] || null
    }
    
    if (widget.children) {
      const removed = removeWidgetById(widget.children, id)
      if (removed) return removed
    }
  }
  
  return null
}

/**
 * Achata árvore de widgets (recursivo → flat)
 */
export function flattenWidgets(widgets: PageWidget[]): PageWidget[] {
  const result: PageWidget[] = []
  
  function traverse(widgets: PageWidget[]) {
    for (const widget of widgets) {
      result.push(widget)
      if (widget.children) {
        traverse(widget.children)
      }
    }
  }
  
  traverse(widgets)
  return result
}

/**
 * Conta total de widgets (com filhos)
 */
export function countWidgets(widgets: PageWidget[]): number {
  return flattenWidgets(widgets).length
}

/**
 * ==========================================
 * UI TYPES (para componentes)
 * ==========================================
 */

/**
 * Alias para compatibilidade (WidgetSchema = PageWidget)
 */
export type WidgetSchema = PageWidget

/**
 * Categoria de widget na paleta
 */
export type WidgetCategory = 
  | 'layout'
  | 'content'
  | 'form'
  | 'data'
  | 'media'
  | 'navigation'
  | 'advanced'
  | 'feedback' // Alerts, badges, etc

/**
 * Item da paleta de widgets
 */
export interface WidgetTypePalette {
  type: WidgetType
  label: string
  icon?: string
  category: WidgetCategory
  description?: string
  allowChildren?: boolean
  defaultWidget?: Partial<PageWidget> // Widget padrão ao arrastar
  isPro?: boolean // Marca widget como PRO
  editableProps?: EditableWidgetProperty[] // Props editáveis no painel
}

/**
 * Propriedade editável de um widget
 */
export interface EditableWidgetProperty {
  name?: string // Nome da propriedade (compatibilidade legado)
  key?: string  // Chave primária (recom endado para novo código)
  label: string
  type?: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'color' | 'image' | 'json'
  inputType?: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'json' // Alias para type
  options?: Array<{ label: string; value: any }>
  group?: string
  condition?: (widget: PageWidget) => boolean
  helpText?: string
  required?: boolean
}

/**
 * Estado do drag & drop
 */
export interface DragState {
  isDragging: boolean
  draggedWidgetId: string | null
  dropTargetId: string | null
  dropPosition?: 'before' | 'after' | 'inside'
}

/**
 * Estado do Page Builder
 */
export interface PageBuilderState {
  selectedWidgetId: string | null
  mode: 'design' | 'preview' | 'code'
  isDirty: boolean
  hoveredWidgetId?: string | null
  dragState?: DragState
}

/**
 * Template de página pré-definido
 */
export interface PageTemplate {
  id: string
  name: string
  description?: string
  category?: string
  schema: PageSchema
  thumbnail?: string
}

/**
 * Resultado de validação de schema de página
 */
export interface PageSchemaValidationResult {
  valid: boolean
  errors: Array<{
    path: string
    message: string
    severity: 'error' | 'warning'
  }>
  warnings: string[]
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
 * Props do componente PageBuilder
 */
export interface PageBuilderProps {
  modelValue?: PageSchema
  settings?: Partial<BuilderSettings>
  autoSave?: boolean
  autoSaveDelay?: number
}

/**
 * Eventos emitidos pelo PageBuilder
 */
export interface PageBuilderEmits {
  'update:modelValue': (schema: PageSchema) => void
  'widget-select': (widgetId: string | null) => void
  'widget-add': (widget: PageWidget, parentId?: string, index?: number) => void
  'widget-update': (widgetId: string, updates: Partial<PageWidget>) => void
  'widget-remove': (widgetId: string) => void
  'widget-move': (widgetId: string, parentId?: string, index?: number) => void
  'mode-change': (mode: PageBuilderState['mode']) => void
  'export': (schema: PageSchema, format: ExportOptions['format']) => void
  'save': (schema: PageSchema) => void
}
