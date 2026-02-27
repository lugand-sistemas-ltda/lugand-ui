/**
 * usePageBuilder - Composable para Page Builder
 * 
 * Composable para gerenciar estado e lógica do Page Builder.
 * Herda funcionalidade CRUD, history e validação de useSchemaBuilder.
 * Suporta aninhamento de widgets.
 */

import { computed, ref } from 'vue'
import { useSchemaBuilder } from '@/core/schema-builder'
import type {
  PageSchema,
  PageWidget,
  WidgetType,
  BuilderSettings
} from './types'
import {
  createEmptyPageSchema,
  createPageWidget,
  findWidgetById,
  removeWidgetById,
  flattenWidgets,
  countWidgets
} from './types'

/**
 * Opções do usePageBuilder
 */
export interface UsePageBuilderOptions {
  /** Schema inicial */
  initialSchema?: PageSchema
  
  /** Auto-save ativo */
  autoSave?: boolean
  
  /** Delay do auto-save (ms) */
  autoSaveDelay?: number
  
  /** Storage key para persistência */
  storageKey?: string
  
  /** Habilitar undo/redo */
  enableHistory?: boolean
  
  /** Tamanho do histórico */
  historySize?: number
  
  /** Configurações do builder */
  settings?: Partial<BuilderSettings>
}

/**
 * Composable para Page Builder
 * Herda CRUD, history, validation de useSchemaBuilder
 * Adiciona suporte a aninhamento de widgets
 */
export function usePageBuilder(options: UsePageBuilderOptions = {}) {
  // ============================================
  // CORE - Herda TUDO do useSchemaBuilder
  // ============================================
  
  const core = useSchemaBuilder<PageSchema, PageWidget>({
    initialSchema: options.initialSchema || createEmptyPageSchema(),
    storageKey: options.storageKey || 'page-builder-state',
    enableHistory: options.enableHistory ?? true,
    historySize: options.historySize ?? 50,
    autoSaveDelay: options.autoSaveDelay ?? 30000
  })
  
  // ============================================
  // COMPATIBILIDADE (para componentes Vue legados)
  // ============================================
  
  /**
   * Modo do builder (design/preview/code)
   */
  const mode = ref<'design' | 'preview' | 'code'>('design')
  
  /**
   * ID do widget selecionado (alias de selectedItem)
   */
  const selectedWidgetId = core.selectedItem
  
  /**
   * ID do widget com hover
   */
  const hoveredWidgetId = ref<string | null>(null)
  
  /**
   * Settings (expõe para componentes)
   */
  const settings = options.settings || {}
  
  // ============================================
  // COMPUTED
  // ============================================
  
  /**
   * Lista de widgets (alias de items)
   */
  const widgets = computed(() => core.schema.value.items)
  
  /**
   * Quantidade total de widgets (incluindo filhos)
   */
  const widgetCount = computed(() => countWidgets(widgets.value as PageWidget[]))
  
  /**
   * Widgets em formato flat (árvore achatada)
   */
  const flatWidgets = computed(() => flattenWidgets(widgets.value as PageWidget[]))
  
  /**
   * Widget selecionado
   */
  const selectedWidget = computed(() => {
    if (!core.selectedItem.value) return null
    return findWidgetById(widgets.value as PageWidget[], core.selectedItem.value)
  })
  
  // ============================================
  // PAGE-SPECIFIC METHODS
  // ============================================
  
  /**
   * Adiciona um widget à página
   * 
   * @param type - Tipo do widget
   * @param props - Propriedades customizadas
   * @param parentId - ID do widget pai (para aninhamento)
   * @param position - Posição (opcional)
   * @returns Widget criado
   */
  function addWidget(
    type: WidgetType,
    props?: Partial<PageWidget['props']>,
    parentId?: string,
    position?: number
  ): PageWidget {
    const widget = createPageWidget(type, props)
    
    if (parentId) {
      // Adicionar como filho de outro widget
      const parent = findWidgetById(widgets.value as PageWidget[], parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        
        if (position !== undefined) {
          parent.children.splice(position, 0, widget)
        } else {
          parent.children.push(widget)
        }
      }
    } else {
      // Adicionar ao root
      core.addItem(widget, position)
    }
    
    return widget
  }
  
  /**
   * Remove um widget (e seus filhos)
   */
  function removeWidget(widgetId: string): void {
    if (!widgets.value) return
    
    // Tentar remover do root primeiro
    const rootIndex = widgets.value.findIndex(w => w.id === widgetId)
    if (rootIndex !== -1) {
      core.removeItem(widgetId)
      return
    }
    
    // Se não está no root, buscar recursivamente
    removeWidgetById(widgets.value as PageWidget[], widgetId)
  }
  
  /**
   * Atualiza um widget
   */
  function updateWidget(
    widgetId: string,
    updates: Partial<PageWidget>
  ): void {
    const widget = findWidgetById(widgets.value as PageWidget[], widgetId)
    if (widget) {
      Object.assign(widget, updates)
    }
  }
  
  /**
   * Move widget para cima
   */
  function moveWidgetUp(widgetId: string): void {
    // TODO: Implementar movimentação em widgets aninhados
    core.moveItem(widgetId, 'up')
  }
  
  /**
   * Move widget para baixo
   */
  function moveWidgetDown(widgetId: string): void {
    // TODO: Implementar movimentação em widgets aninhados
    core.moveItem(widgetId, 'down')
  }
  
  /**
   * Duplica um widget (e seus filhos)
   */
  function duplicateWidget(widgetId: string): void {
    const widget = findWidgetById(widgets.value as PageWidget[], widgetId)
    if (widget) {
      const duplicate = JSON.parse(JSON.stringify(widget))
      duplicate.id = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Gerar novos IDs para filhos recursivamente
      if (duplicate.children) {
        regenerateChildrenIds(duplicate.children)
      }
      
      // Adicionar duplicata após o original
      const parent = findParentWidget(widgets.value as PageWidget[], widgetId)
      if (parent) {
        const index = parent.children!.findIndex(w => w.id === widgetId)
        parent.children!.splice(index + 1, 0, duplicate)
      } else if (widgets.value) {
        const index = widgets.value.findIndex(w => w.id === widgetId)
        core.addItem(duplicate, index + 1)
      }
    }
  }
  
  /**
   * Aninha um widget dentro de outro (arrasta para container)
   */
  function nestWidget(widgetId: string, newParentId: string): void {
    // Remove do local atual
    const widget = removeWidgetById(widgets.value as PageWidget[], widgetId)
    if (!widget) return
    
    // Adiciona ao novo pai
    const newParent = findWidgetById(widgets.value as PageWidget[], newParentId)
    if (newParent) {
      if (!newParent.children) {
        newParent.children = []
      }
      newParent.children.push(widget)
    }
  }
  
  /**
   * Remove widget de container (move para root)
   */
  function unnestWidget(widgetId: string): void {
    const widget = removeWidgetById(widgets.value as PageWidget[], widgetId)
    if (widget) {
      core.addItem(widget)
    }
  }
  
  /**
   * Gera HTML da página
   */
  function generateHTML(): string {
    const { metadata } = core.schema.value
    const parts: string[] = []
    
    parts.push('<!DOCTYPE html>')
    parts.push('<html>')
    parts.push('<head>')
    parts.push(`  <title>${metadata?.title || 'Page'}</title>`)
    
    // SEO
    if (metadata?.seo) {
      const seo = metadata.seo
      if (seo.description) {
        parts.push(`  <meta name="description" content="${seo.description}">`)
      }
      if (seo.keywords) {
        const keywordsStr = Array.from(seo.keywords).join(', ')
        parts.push(`  <meta name="keywords" content="${keywordsStr}">`)
      }
    }
    
    parts.push('</head>');
    parts.push('<body>');
    
    // Renderizar widgets
    (widgets.value as PageWidget[]).forEach((widget: PageWidget) => {
      parts.push(renderWidgetToHTML(widget, 1))
    })
    
    parts.push('</body>')
    parts.push('</html>')
    
    return parts.join('\n')
  }
  
  /**
   * Gera componente Vue da página
   */
  function generateVueComponent(): {
    template: string
    script: string
    style: string
  } {
    // TODO: Implementar geração de componente Vue
    return {
      template: '<!-- Generated page template -->',
      script: '// Generated page script',
      style: '/* Generated page styles */'
    }
  }
  
  /**
   * Gera tags SEO
   */
  function generateSEOTags(): string {
    const seo = core.schema.value.metadata?.seo
    if (!seo) return ''
    
    let tags = ''
    
    if (seo.title) {
      tags += `<title>${seo.title}</title>\n`
      tags += `<meta property="og:title" content="${seo.title}">\n`
    }
    
    if (seo.description) {
      tags += `<meta name="description" content="${seo.description}">\n`
      tags += `<meta property="og:description" content="${seo.description}">\n`
    }
    
    if (seo.keywords) {
      tags += `<meta name="keywords" content="${seo.keywords.join(', ')}">\n`
    }
    
    if (seo.ogImage) {
      tags += `<meta property="og:image" content="${seo.ogImage}">\n`
    }
    
    if (seo.canonicalUrl) {
      tags += `<link rel="canonical" href="${seo.canonicalUrl}">\n`
    }
    
    return tags
  }
  
  // ============================================
  // MÉTODOS DE COMPATIBILIDADE
  // ============================================
  
  /**
   * Move widget (alias para moveWidgetUp/Down)
   */
  function moveWidget(widgetId: string, newParentId?: string, newIndex?: number): void {
    if (typeof newParentId === 'string') {
      // Move para novo parent (nesting)
      if (newIndex !== undefined) {
        nestWidget(widgetId, newParentId)
      } else {
        nestWidget(widgetId, newParentId)
      }
    } else {
      // newParentId é na verdade direction: 'up' | 'down'
      const direction = newParentId as any
      if (direction === 'up') {
        moveWidgetUp(widgetId)
      } else if (direction === 'down') {
        moveWidgetDown(widgetId)
      }
    }
  }
  
  /**
   * Export schema (alias para exportJSON)
   */
  function exportSchema(_format?: 'json' | 'yaml'): string {
    return core.exportJSON()
  }
  
  /**
   * Select widget (alias para selectedItem)
   */
  function selectWidget(widgetId: string | null): void {
    // selectedItem é um ref, pode atribuir diretamente
    if (core.selectedItem) {
      (core.selectedItem as any).value = widgetId
    }
  }
  
  /**
   * Update schema (alias para load)
   */
  function updateSchema(updates: Partial<PageSchema>): void {
    // Directly update schema instead of calling load()
    Object.assign(core.schema.value, {
      ...core.schema.value,
      ...updates
    })
  }
  
  // ============================================
  // RETURN API
  // ============================================
  
  return {
    // Core (herdado)
    schema: core.schema,
    selectedItem: core.selectedItem,
    isDirty: core.isDirty,
    isValid: core.isValid,
    validation: core.validation,
    
    // History (herdado)
    undo: core.undo,
    redo: core.redo,
    canUndo: core.canUndo,
    canRedo: core.canRedo,
    
    // CRUD (herdado)
    addItem: core.addItem,
    removeItem: core.removeItem,
    updateItem: core.updateItem,
    duplicateItem: core.duplicateItem,
    clearItems: core.clearItems,
    
    // Save/Load (herdado)
    save: core.save,
    load: core.load,
    exportJSON: core.exportJSON,
    importJSON: core.importJSON,
    
    // Computed
    widgets,
    widgetCount,
    flatWidgets,
    selectedWidget,
    
    // Compatibilidade
    mode,
    selectedWidgetId,
    hoveredWidgetId,
    settings,
    hasChanges: core.isDirty, // Alias
    
    // Page-specific methods
    addWidget,
    removeWidget,
    updateWidget,
    moveWidgetUp,
    moveWidgetDown,
    duplicateWidget,
    nestWidget,
    unnestWidget,
    generateHTML,
    generateVueComponent,
    generateSEOTags,
    
    // Métodos de compatibilidade
    moveWidget,
    exportSchema,
    selectWidget,
    updateSchema
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Encontra widget pai de um widget
 */
function findParentWidget(
  widgets: PageWidget[],
  childId: string
): PageWidget | null {
  for (const widget of widgets) {
    if (widget.children) {
      if (widget.children.some(w => w.id === childId)) {
        return widget
      }
      
      const found = findParentWidget(widget.children, childId)
      if (found) return found
    }
  }
  
  return null
}

/**
 * Regenera IDs de widgets filhos recursivamente
 */
function regenerateChildrenIds(widgets: PageWidget[]): void {
  widgets.forEach(widget => {
    widget.id = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    if (widget.children) {
      regenerateChildrenIds(widget.children)
    }
  })
}

/**
 * Renderiza widget para HTML
 */
function renderWidgetToHTML(widget: PageWidget, indent: number): string {
  const tabs = '  '.repeat(indent)
  let html = ''
  
  switch (widget.type) {
    case 'heading':
      const level = widget.props?.level || 2
      html = `${tabs}<h${level}>${widget.props?.content || ''}</h${level}>\n`
      break
    
    case 'paragraph':
      html = `${tabs}<p>${widget.props?.content || ''}</p>\n`
      break
    
    case 'button':
      html = `${tabs}<button>${widget.props?.content || 'Button'}</button>\n`
      break
    
    case 'container':
      html = `${tabs}<div class="container">\n`
      if (widget.children) {
        widget.children.forEach(child => {
          html += renderWidgetToHTML(child, indent + 1)
        })
      }
      html += `${tabs}</div>\n`
      break
    
    case 'grid':
      html = `${tabs}<div class="grid">\n`
      if (widget.children) {
        widget.children.forEach(child => {
          html += renderWidgetToHTML(child, indent + 1)
        })
      }
      html += `${tabs}</div>\n`
      break
    
    default:
      html = `${tabs}<!-- ${widget.type} widget -->\n`
  }
  
  return html
}
