/**
 * form-builder/index.ts
 * 
 * Barrel export para Form Builder feature.
 * Visual form designer com drag-and-drop, property editor, e export.
 * 
 * @module features/form-builder
 * @created 2025-01-XX
 */

// Main Component
export { default as FormBuilder } from './components/FormBuilder.vue'

// Sub-components (exportar para uso avançado)
export { default as FieldPalette } from './components/FieldPalette.vue'
export { default as DesignCanvas } from './components/DesignCanvas.vue'
export { default as PropertiesPanel } from './components/PropertiesPanel.vue'
export { default as CodeEditor } from './components/CodeEditor.vue'

// Composable
export { useFormBuilder } from './useFormBuilder'

// Config & Utils
export { FIELD_PALETTE, getPaletteItem, getPaletteItemsByCategory } from './field-palette-config'

// Types
export type {
  FieldTypePalette,
  FieldCategory,
  FormBuilderState,
  BuilderSettings,
  FieldDragEvent,
  EditableProperty,
  SchemaValidationResult,
  FormTemplate,
  HistoryAction,
  ExportOptions,
  FormBuilderProps,
  FormBuilderEmits
} from './types'
