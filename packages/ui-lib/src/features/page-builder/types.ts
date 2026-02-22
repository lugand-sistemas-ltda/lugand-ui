/**
 * @file FASE 5 - Page Builder Types
 * @description Sistema de tipos para o editor visual de páginas
 * 
 * Permite edição visual de layouts existentes em modo admin
 * Usa PageSchema e WidgetSchema do FASE 1 (Core Systems)
 */

import type { PageSchema } from '../../core/schema-system/types'
import type { WidgetSchema } from '../../core/widget-system/types'
import type { Component } from 'vue'

// Re-export para conveniência
export type { PageSchema } from '../../core/schema-system/types'
export type { WidgetSchema } from '../../core/widget-system/types'

// ============================================
// WIDGET PALETTE
// ============================================

/**
 * Categorias de widgets disponíveis
 */
export type WidgetCategory = 
  | 'layout'      // Grid, Container, Section
  | 'content'     // Text, Image, Video
  | 'data'        // Table, DataGrid, Chart
  | 'forms'       // FormRenderer (FASE 2)
  | 'navigation'  // Tabs, Menu, Breadcrumbs
  | 'feedback'    // Alert, Toast, Modal
  | 'custom'      // Widgets customizados

/**
 * Configuração de um tipo de widget na paleta
 */
export interface WidgetTypePalette {
  /** Tipo do widget (deve corresponder ao nome do componente) */
  type: string
  
  /** Nome exibido na paleta */
  label: string
  
  /** Ícone (emoji ou classe CSS) */
  icon: string
  
  /** Categoria */
  category: WidgetCategory
  
  /** Template padrão do widget */
  defaultWidget: Omit<WidgetSchema, 'id'>
  
  /** Propriedades editáveis no painel */
  editableProps: EditableWidgetProperty[]
  
  /** Se é um widget PRO (requer licença) */
  isPro?: boolean
  
  /** Descrição do widget */
  description?: string
  
  /** Preview do widget */
  previewComponent?: Component
}

/**
 * Propriedade editável de um widget
 */
export interface EditableWidgetProperty {
  /** Nome da propriedade */
  name: string
  
  /** Label exibido */
  label: string
  
  /** Tipo de input para edição */
  inputType: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'json' | 'layout'
  
  /** Opções (para select) */
  options?: Array<{ label: string; value: any }>
  
  /** Validador customizado */
  validator?: (value: any) => boolean | string
  
  /** Texto de ajuda */
  helpText?: string
  
  /** Se é obrigatória */
  required?: boolean
}

// ============================================
// PAGE BUILDER STATE
// ============================================

/**
 * Estado do Page Builder
 */
export interface PageBuilderState {
  /** Schema da página sendo editada */
  schema: PageSchema
  
  /** ID do widget selecionado */
  selectedWidgetId: string | null
  
  /** Modo de visualização */
  mode: 'design' | 'preview' | 'code'
  
  /** Histórico de ações (undo/redo) */
  history: HistoryAction[]
  
  /** Índice atual no histórico */
  historyIndex: number
  
  /** Se há mudanças não salvas */
  isDirty: boolean
  
  /** Configurações do builder */
  settings: BuilderSettings
  
  /** Caminho do widget hover (para highlight) */
  hoveredWidgetId: string | null
  
  /** Estado de drag */
  dragState: DragState | null
}

/**
 * Estado de drag-and-drop
 */
export interface DragState {
  /** Tipo de drag */
  type: 'palette' | 'reorder'
  
  /** Widget sendo arrastado (se reorder) */
  widgetId?: string
  
  /** Tipo do widget (se palette) */
  widgetType?: string
  
  /** Zona de drop ativa */
  dropZone?: {
    parentId: string | null
    index: number
  }
}

/**
 * Configurações do Page Builder
 */
export interface BuilderSettings {
  /** Mostrar grid de alinhamento */
  showGrid: boolean
  
  /** Snap to grid */
  snapToGrid: boolean
  
  /** Mostrar outlines dos widgets */
  showOutlines: boolean
  
  /** Intervalo de auto-save (ms) */
  autoSaveInterval: number
  
  /** Validação em tempo real */
  liveValidation: boolean
  
  /** Tema do editor */
  theme: 'light' | 'dark' | 'auto'
  
  /** Mostrar breadcrumb de seleção */
  showBreadcrumb: boolean
}

// ============================================
// DRAG & DROP
// ============================================

/**
 * Evento de drag de widget
 */
export interface WidgetDragEvent {
  /** Tipo do widget */
  widgetType?: string
  
  /** Widget completo (se drag interno) */
  widget?: WidgetSchema
  
  /** ID do widget fonte */
  sourceId?: string
  
  /** ID do parent fonte */
  sourceParentId?: string | null
  
  /** Índice fonte */
  sourceIndex?: number
  
  /** ID do parent destino */
  targetParentId: string | null
  
  /** Índice destino */
  targetIndex: number
  
  /** Ação */
  action: 'add' | 'move' | 'copy'
}

// ============================================
// VALIDATION
// ============================================

/**
 * Resultado da validação do schema
 */
export interface PageSchemaValidationResult {
  /** Se o schema é válido */
  isValid: boolean
  
  /** Erros encontrados */
  errors: Array<{
    widgetId: string
    property: string
    message: string
  }>
  
  /** Avisos */
  warnings: Array<{
    widgetId: string
    property: string
    message: string
  }>
}

// ============================================
// TEMPLATES
// ============================================

/**
 * Template de página pré-definido
 */
export interface PageTemplate {
  /** ID único */
  id: string
  
  /** Nome do template */
  name: string
  
  /** Descrição */
  description: string
  
  /** Categoria */
  category: 'dashboard' | 'admin' | 'landing' | 'form' | 'list' | 'detail' | 'custom'
  
  /** Schema da página */
  schema: PageSchema
  
  /** Thumbnail (URL ou base64) */
  thumbnail?: string
  
  /** Tags para busca */
  tags?: string[]
}

// ============================================
// HISTORY
// ============================================

/**
 * Ação do histórico (undo/redo)
 */
export interface HistoryAction {
  /** Tipo de ação */
  type: 'add' | 'remove' | 'update' | 'move' | 'reorder'
  
  /** Estado antes da ação */
  before: PageSchema
  
  /** Estado depois da ação */
  after: PageSchema
  
  /** Timestamp */
  timestamp: number
  
  /** Descrição da ação */
  description?: string
}

// ============================================
// EXPORT
// ============================================

/**
 * Opções de export
 */
export interface ExportOptions {
  /** Formato de saída */
  format: 'json' | 'typescript' | 'vue'
  
  /** Incluir valores default */
  includeDefaults: boolean
  
  /** Minificar output */
  minify: boolean
  
  /** Incluir comentários */
  includeComments: boolean
  
  /** Validar antes de exportar */
  validate: boolean
}

// ============================================
// COMPONENT PROPS & EMITS
// ============================================

/**
 * Props do PageBuilder
 */
export interface PageBuilderProps {
  /** Schema da página (v-model) */
  modelValue?: PageSchema
  
  /** Modo inicial */
  initialMode?: 'design' | 'preview' | 'code'
  
  /** Templates disponíveis */
  templates?: PageTemplate[]
  
  /** Widgets customizados */
  customWidgets?: WidgetTypePalette[]
  
  /** Modo readonly */
  readonly?: boolean
  
  /** Callback de auto-save */
  onAutoSave?: (schema: PageSchema) => void
  
  /** Altura do editor */
  height?: string
  
  /** Configurações */
  settings?: Partial<BuilderSettings>
}

/**
 * Emits do PageBuilder
 */
export interface PageBuilderEmits {
  /** Emitido quando o schema muda */
  (e: 'update:modelValue', schema: PageSchema): void
  
  /** Emitido quando um widget é selecionado */
  (e: 'widget-select', widgetId: string | null): void
  
  /** Emitido quando um widget é adicionado */
  (e: 'widget-add', widget: WidgetSchema): void
  
  /** Emitido quando um widget é removido */
  (e: 'widget-remove', widgetId: string): void
  
  /** Emitido quando um widget é atualizado */
  (e: 'widget-update', widgetId: string, updates: Partial<WidgetSchema>): void
  
  /** Emitido quando um widget é movido */
  (e: 'widget-move', widgetId: string, newParentId: string | null, newIndex: number): void
  
  /** Emitido quando valida */
  (e: 'validate', result: PageSchemaValidationResult): void
  
  /** Emitido quando exporta */
  (e: 'export', schema: PageSchema, format: ExportOptions['format']): void
  
  /** Emitido quando muda de modo */
  (e: 'mode-change', mode: 'design' | 'preview' | 'code'): void
}

// ============================================
// WIDGET TREE
// ============================================

/**
 * Nó da árvore de widgets (para navegação hierárquica)
 */
export interface WidgetTreeNode {
  /** Widget */
  widget: WidgetSchema
  
  /** Filhos */
  children: WidgetTreeNode[]
  
  /** Parent ID */
  parentId: string | null
  
  /** Profundidade */
  depth: number
  
  /** Se está expandido */
  expanded: boolean
}
