/**
 * Doc Builder Components
 * 
 * Componentes de interface para construção de documentos
 */

export { default as DocBuilderEditor } from './DocBuilderEditor.vue'
export { default as DocBlockPalette } from './DocBlockPalette.vue'
export { default as DocBlockInspector } from './DocBlockInspector.vue'
export { default as DocPreview } from './DocPreview.vue'

// Re-exportar tipos
export type {
  DocBlockPaletteProps,
  DocBlockPaletteEmits,
  BlockDefinition,
  BlockCategory
} from './DocBlockPalette.vue'

export type {
  DocBlockInspectorProps,
  DocBlockInspectorEmits
} from './DocBlockInspector.vue'

export type {
  DocPreviewProps,
  DocPreviewEmits
} from './DocPreview.vue'

export type {
  DocBuilderEditorProps
} from './DocBuilderEditor.vue'
