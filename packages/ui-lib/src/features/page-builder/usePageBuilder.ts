/**
 * @file FASE 5 - Page Builder Composable
 * @description Lógica central do editor visual de páginas
 * 
 * Gerencia estado, operações CRUD de widgets, histórico (undo/redo),
 * validação e export de PageSchema
 */

import { ref, computed, watch, type Ref } from 'vue'
import type { PageSchema, WidgetSchema } from '../../core/schema-system/types'
import { createSchemaMetadata, createGridLayout } from '../../core/schema-system/types'
import type {
  BuilderSettings,
  HistoryAction,
  WidgetDragEvent,
  PageSchemaValidationResult,
  ExportOptions,
  WidgetTreeNode
} from './types'

/**
 * Configurações default do Page Builder
 */
const DEFAULT_SETTINGS: BuilderSettings = {
  showGrid: true,
  snapToGrid: true,
  showOutlines: true,
  autoSaveInterval: 30000, // 30s
  liveValidation: true,
  theme: 'auto',
  showBreadcrumb: true
}

/**
 * Máximo de ações no histórico
 */
const MAX_HISTORY = 50

/**
 * Composable principal do Page Builder
 */
export function usePageBuilder(
  initialSchema?: Ref<PageSchema | undefined>,
  settings?: Partial<BuilderSettings>
) {
  // ============================================
  // STATE
  // ============================================

  const schema = ref<PageSchema>(initialSchema?.value || createEmptySchema())
  const selectedWidgetId = ref<string | null>(null)
  const mode = ref<'design' | 'preview' | 'code'>('design')
  const history = ref<HistoryAction[]>([])
  const historyIndex = ref(-1)
  const isDirty = ref(false)
  const hoveredWidgetId = ref<string | null>(null)

  const builderSettings = ref<BuilderSettings>({
    ...DEFAULT_SETTINGS,
    ...settings
  })

  // ============================================
  // COMPUTED
  // ============================================

  const selectedWidget = computed(() => {
    if (!selectedWidgetId.value) return null
    return findWidgetById(schema.value, selectedWidgetId.value)
  })

  const canUndo = computed(() => historyIndex.value >= 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  const widgetTree = computed(() => buildWidgetTree(schema.value))

  const widgetCount = computed(() => countWidgets(schema.value))

  // ============================================
  // WIDGET OPERATIONS
  // ============================================

  /**
   * Adiciona um widget
   */
  function addWidget(
    widget: Omit<WidgetSchema, 'id'>,
    parentId: string | null = null,
    index?: number
  ): string {
    const newWidget: WidgetSchema = {
      ...widget,
      id: generateWidgetId()
    }

    const before = cloneSchema(schema.value)

    if (parentId === null) {
      // Adicionar ao root
      if (index !== undefined) {
        schema.value.widgets.splice(index, 0, newWidget)
      } else {
        schema.value.widgets.push(newWidget)
      }
    } else {
      // Adicionar como filho
      const parent = findWidgetById(schema.value, parentId)
      if (parent && parent.children) {
        if (index !== undefined) {
          parent.children.splice(index, 0, newWidget)
        } else {
          parent.children.push(newWidget)
        }
      }
    }

    const after = cloneSchema(schema.value)
    addToHistory({ type: 'add', before, after, timestamp: Date.now() })

    isDirty.value = true
    return newWidget.id
  }

  /**
   * Remove um widget
   */
  function removeWidget(widgetId: string): boolean {
    const before = cloneSchema(schema.value)

    const removed = removeWidgetRecursive(schema.value.widgets, widgetId)

    if (removed) {
      const after = cloneSchema(schema.value)
      addToHistory({ type: 'remove', before, after, timestamp: Date.now() })

      if (selectedWidgetId.value === widgetId) {
        selectedWidgetId.value = null
      }

      isDirty.value = true
    }

    return removed
  }

  /**
   * Atualiza um widget
   */
  function updateWidget(widgetId: string, updates: Partial<WidgetSchema>): boolean {
    const widget = findWidgetById(schema.value, widgetId)
    if (!widget) return false

    const before = cloneSchema(schema.value)

    // Não permitir alterar ID
    const { id, ...safeUpdates } = updates
    Object.assign(widget, safeUpdates)

    const after = cloneSchema(schema.value)
    addToHistory({ type: 'update', before, after, timestamp: Date.now() })

    isDirty.value = true
    return true
  }

  /**
   * Move um widget para nova posição
   */
  function moveWidget(
    widgetId: string,
    newParentId: string | null,
    newIndex: number
  ): boolean {
    const before = cloneSchema(schema.value)

    // 1. Remover do local atual
    const widget = findWidgetById(schema.value, widgetId)
    if (!widget) return false

    const clonedWidget = { ...widget }
    const removed = removeWidgetRecursive(schema.value.widgets, widgetId)
    if (!removed) return false

    // 2. Inserir no novo local
    if (newParentId === null) {
      schema.value.widgets.splice(newIndex, 0, clonedWidget)
    } else {
      const newParent = findWidgetById(schema.value, newParentId)
      if (!newParent || !newParent.children) return false
      newParent.children.splice(newIndex, 0, clonedWidget)
    }

    const after = cloneSchema(schema.value)
    addToHistory({ type: 'move', before, after, timestamp: Date.now() })

    isDirty.value = true
    return true
  }

  /**
   * Duplica um widget
   */
  function duplicateWidget(widgetId: string): string | null {
    const widget = findWidgetById(schema.value, widgetId)
    if (!widget) return null

    const duplicate = cloneWidget(widget)
    const parent = findParentWidget(schema.value, widgetId)
    const parentId = parent?.id || null

    const widgets = parentId
      ? findWidgetById(schema.value, parentId)?.children || []
      : schema.value.widgets

    const index = widgets.findIndex(w => w.id === widgetId)

    return addWidget(duplicate, parentId, index + 1)
  }

  /**
   * Manipula evento de drag-drop
   */
  function handleDragEvent(event: WidgetDragEvent): void {
    if (event.action === 'add' && event.widgetType) {
      // Adicionar novo widget da paleta
      // Isso será implementado com base no widgetType
      console.log('Add widget from palette:', event.widgetType)
    } else if (event.action === 'move' && event.sourceId) {
      // Mover widget existente
      moveWidget(event.sourceId, event.targetParentId, event.targetIndex)
    } else if (event.action === 'copy' && event.widget) {
      // Copiar widget
      const newId = addWidget(event.widget, event.targetParentId, event.targetIndex)
      if (newId) {
        selectWidget(newId)
      }
    }
  }

  // ============================================
  // SCHEMA OPERATIONS
  // ============================================

  /**
   * Atualiza o schema completo
   */
  function updateSchema(updates: Partial<PageSchema>): void {
    const before = cloneSchema(schema.value)

    Object.assign(schema.value, updates)

    const after = cloneSchema(schema.value)
    addToHistory({ type: 'update', before, after, timestamp: Date.now() })

    isDirty.value = true
  }

  /**
   * Reseta o schema
   */
  function resetSchema(): void {
    const before = cloneSchema(schema.value)

    schema.value = createEmptySchema()
    selectedWidgetId.value = null

    const after = cloneSchema(schema.value)
    addToHistory({ type: 'update', before, after, timestamp: Date.now() })

    isDirty.value = true
  }

  /**
   * Carrega um schema novo
   */
  function loadSchema(newSchema: PageSchema): void {
    const before = cloneSchema(schema.value)

    schema.value = cloneSchema(newSchema)
    selectedWidgetId.value = null

    const after = cloneSchema(schema.value)
    addToHistory({ type: 'update', before, after, timestamp: Date.now() })

    isDirty.value = true
  }

  // ============================================
  // HISTORY (UNDO/REDO)
  // ============================================

  function addToHistory(action: HistoryAction): void {
    // Remover ações futuras se estamos no meio do histórico
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    // Adicionar nova ação
    history.value.push(action)

    // Limitar tamanho do histórico
    if (history.value.length > MAX_HISTORY) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }

  function undo(): void {
    if (!canUndo.value) return

    const action = history.value[historyIndex.value]
    if (action) {
      schema.value = cloneSchema(action.before)
      historyIndex.value--
      isDirty.value = true
    }
  }

  function redo(): void {
    if (!canRedo.value) return

    historyIndex.value++
    const action = history.value[historyIndex.value]
    if (action) {
      schema.value = cloneSchema(action.after)
      isDirty.value = true
    }
  }

  function clearHistory(): void {
    history.value = []
    historyIndex.value = -1
  }

  // ============================================
  // VALIDATION
  // ============================================

  function validateSchema(): PageSchemaValidationResult {
    const errors: Array<{ widgetId: string; property: string; message: string }> = []
    const warnings: Array<{ widgetId: string; property: string; message: string }> = []

    // Validar schema ID
    if (!schema.value.id) {
      errors.push({
        widgetId: 'root',
        property: 'id',
        message: 'Schema ID is required'
      })
    }

    // Validar widgets recursivamente (parentId será usado para validar hierarquia)
    function validateWidgets(widgets: WidgetSchema[], _parentId: string | null = null): void {
      const usedIds = new Set<string>()

      for (const widget of widgets) {
        // IDs únicos
        if (usedIds.has(widget.id)) {
          errors.push({
            widgetId: widget.id,
            property: 'id',
            message: `Duplicate widget ID: ${widget.id}`
          })
        }
        usedIds.add(widget.id)

        // Type obrigatório
        if (!widget.type) {
          errors.push({
            widgetId: widget.id,
            property: 'type',
            message: 'Widget type is required'
          })
        }

        // Validar filhos
        if (widget.children && widget.children.length > 0) {
          validateWidgets(widget.children, widget.id)
        }
      }
    }

    validateWidgets(schema.value.widgets)

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // ============================================
  // EXPORT
  // ============================================

  function exportSchema(options: Partial<ExportOptions> = {}): string {
    const opts: ExportOptions = {
      format: 'json',
      includeDefaults: false,
      minify: false,
      includeComments: false,
      validate: true,
      ...options
    }

    // Validar se requisitado
    if (opts.validate) {
      const validation = validateSchema()
      if (!validation.isValid) {
        throw new Error('Schema has validation errors')
      }
    }

    // Limpar defaults se requisitado
    const exportSchema = opts.includeDefaults
      ? schema.value
      : removeDefaults(schema.value)

    switch (opts.format) {
      case 'json':
        return opts.minify
          ? JSON.stringify(exportSchema)
          : JSON.stringify(exportSchema, null, 2)

      case 'typescript':
        return generateTypeScript(exportSchema, opts)

      case 'vue':
        return generateVue(exportSchema, opts)

      default:
        return JSON.stringify(exportSchema, null, 2)
    }
  }

  // ============================================
  // SELECTION
  // ============================================

  function selectWidget(widgetId: string | null): void {
    selectedWidgetId.value = widgetId
  }

  function selectParent(): void {
    if (!selectedWidgetId.value) return

    const parent = findParentWidget(schema.value, selectedWidgetId.value)
    selectedWidgetId.value = parent?.id || null
  }

  function selectFirstChild(): void {
    const widget = selectedWidget.value
    if (!widget || !widget.children || widget.children.length === 0) return

    const firstChild = widget.children[0]
    if (!firstChild) return

    selectedWidgetId.value = firstChild.id
  }

  // ============================================
  // HELPERS
  // ============================================

  function createEmptySchema(): PageSchema {
    return {
      id: `page-${Date.now()}`,
      type: 'page',
      metadata: createSchemaMetadata('New Page', 'Nova página criada no Page Builder'),
      layout: createGridLayout(12, 16),
      widgets: []
    }
  }

  function generateWidgetId(): string {
    return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function cloneSchema(schema: PageSchema): PageSchema {
    return JSON.parse(JSON.stringify(schema))
  }

  function cloneWidget(widget: WidgetSchema): Omit<WidgetSchema, 'id'> {
    const { id, ...rest } = JSON.parse(JSON.stringify(widget))

    // Recursivamente atualizar IDs dos filhos
    if (rest.children) {
      rest.children = rest.children.map((child: WidgetSchema) => ({
        ...cloneWidget(child),
        id: generateWidgetId()
      }))
    }

    return rest
  }

  function findWidgetById(schema: PageSchema, widgetId: string): WidgetSchema | null {
    function search(widgets: WidgetSchema[]): WidgetSchema | null {
      for (const widget of widgets) {
        if (widget.id === widgetId) return widget
        if (widget.children) {
          const found = search(widget.children)
          if (found) return found
        }
      }
      return null
    }

    return search(schema.widgets)
  }

  function findParentWidget(schema: PageSchema, widgetId: string): WidgetSchema | null {
    function search(widgets: WidgetSchema[], parent: WidgetSchema | null = null): WidgetSchema | null {
      for (const widget of widgets) {
        if (widget.id === widgetId) return parent
        if (widget.children) {
          const found = search(widget.children, widget)
          if (found !== null) return found
        }
      }
      return null
    }

    return search(schema.widgets)
  }

  function removeWidgetRecursive(widgets: WidgetSchema[], widgetId: string): boolean {
    const index = widgets.findIndex(w => w.id === widgetId)
    if (index !== -1) {
      widgets.splice(index, 1)
      return true
    }

    for (const widget of widgets) {
      if (widget.children && removeWidgetRecursive(widget.children, widgetId)) {
        return true
      }
    }

    return false
  }

  function countWidgets(schema: PageSchema): number {
    function count(widgets: WidgetSchema[]): number {
      return widgets.reduce((sum, widget) => {
        return sum + 1 + (widget.children ? count(widget.children) : 0)
      }, 0)
    }

    return count(schema.widgets)
  }

  function buildWidgetTree(schema: PageSchema): WidgetTreeNode[] {
    function build(widgets: WidgetSchema[], parentId: string | null = null, depth = 0): WidgetTreeNode[] {
      return widgets.map(widget => ({
        widget,
        children: widget.children ? build(widget.children, widget.id, depth + 1) : [],
        parentId,
        depth,
        expanded: true
      }))
    }

    return build(schema.widgets)
  }

  function removeDefaults(schema: PageSchema): PageSchema {
    // Implementação simplificada - limpar schema
    const cleaned = cloneSchema(schema)

    function cleanWidget(widget: WidgetSchema): void {
      // Limpar widgets filhos recursivamente
      if (widget.children) {
        widget.children.forEach(cleanWidget)
      }
    }

    cleaned.widgets.forEach(cleanWidget)

    return cleaned
  }

  function generateTypeScript(schema: PageSchema, _opts: ExportOptions): string {
    return `import type { PageSchema } from '@lugand-sistemas-ltda/vue-ui-lib'

export const pageSchema: PageSchema = ${JSON.stringify(schema, null, 2)}
`
  }

  function generateVue(schema: PageSchema, _opts: ExportOptions): string {
    return `<template>
  <PageRenderer :schema="pageSchema" />
</template>

<script setup lang="ts">
import { PageRenderer } from '@lugand-sistemas-ltda/vue-ui-lib'
import type { PageSchema } from '@lugand-sistemas-ltda/vue-ui-lib'

const pageSchema: PageSchema = ${JSON.stringify(schema, null, 2)}
</script>
`
  }

  // ============================================
  // WATCHERS
  // ============================================

  // Sincronizar com prop externa
  if (initialSchema) {
    watch(initialSchema, (newSchema) => {
      if (newSchema && !isDirty.value) {
        schema.value = cloneSchema(newSchema)
      }
    }, { deep: true })
  }

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    schema,
    selectedWidgetId,
    selectedWidget,
    mode,
    isDirty,
    hoveredWidgetId,
    settings: builderSettings,

    // Computed
    canUndo,
    canRedo,
    widgetTree,
    widgetCount,

    // Widget operations
    addWidget,
    removeWidget,
    updateWidget,
    moveWidget,
    duplicateWidget,
    handleDragEvent,

    // Schema operations
    updateSchema,
    resetSchema,
    loadSchema,

    // History
    undo,
    redo,
    clearHistory,

    // Validation
    validateSchema,

    // Export
    exportSchema,

    // Selection
    selectWidget,
    selectParent,
    selectFirstChild,

    // Helpers
    findWidgetById,
    findParentWidget
  }
}
