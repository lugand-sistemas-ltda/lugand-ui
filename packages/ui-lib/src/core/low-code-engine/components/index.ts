/**
 * Low-Code Engine — Vue Components
 *
 * Re-exporta os componentes Vue do motor.
 * Use este arquivo para importar os componentes em outros .vue files:
 *
 * ```typescript
 * import { NodeRenderer, DropZone } from '@/core/low-code-engine/components'
 * ```
 *
 * @module core/low-code-engine/components
 */

export { default as NodeRenderer } from './NodeRenderer.vue'
export { default as DropZone } from './DropZone.vue'
export { default as LowCodeEngine } from './LowCodeEngine.vue'
export { default as PropEditor } from './PropEditor.vue'
export { default as PropertiesPanel } from './PropertiesPanel.vue'
export { default as DataBindingEditor } from './DataBindingEditor.vue'
export { default as ColumnsConfigEditor } from './ColumnsConfigEditor.vue'
