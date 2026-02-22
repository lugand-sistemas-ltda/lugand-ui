/**
 * @file FASE 5 - Page Builder Barrel Exports
 * @description Exports públicos do Page Builder
 */

// Components
export { default as PageBuilder } from './components/PageBuilder.vue'
export { default as WidgetPalette } from './components/WidgetPalette.vue'
export { default as PageCanvas } from './components/PageCanvas.vue'
export { default as WidgetPropertiesPanel } from './components/WidgetPropertiesPanel.vue'
export { default as CodeEditor } from './components/CodeEditor.vue'
export { default as WidgetTreeItem } from './components/WidgetTreeItem.vue'

// Composables
export { usePageBuilder } from './usePageBuilder'

// Configuration
export { WIDGET_PALETTE, WIDGET_CATEGORIES, getPaletteItem, getPaletteItemsByCategory } from './widget-palette-config'

// Types
export type {
  WidgetCategory,
  WidgetTypePalette,
  EditableWidgetProperty,
  PageBuilderState,
  DragState,
  BuilderSettings,
  WidgetDragEvent,
  PageSchemaValidationResult,
  PageTemplate,
  HistoryAction,
  ExportOptions,
  PageBuilderProps,
  PageBuilderEmits
} from './types'

// Re-export core types for convenience
export type { PageSchema } from '../../core/schema-system/types'
export type { WidgetSchema } from '../../core/widget-system/types'
