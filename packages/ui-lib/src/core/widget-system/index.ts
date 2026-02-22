/**
 * Widget System - Core Module
 * 
 * Sistema central de widgets da biblioteca.
 * Fornece infraestrutura para registro, renderização e gerenciamento de widgets.
 * 
 * @module core/widget-system
 */

// Types
export * from './types'

// Widget Registry
export {
  registerWidget,
  unregisterWidget,
  getWidget,
  getAllWidgets,
  getWidgetsByCategory,
  searchWidgets,
  hasWidget,
  clearRegistry,
  getRegistryStats,
  exportRegistry,
  validateWidgetSchema
} from './widget-registry'

// Components
export { default as WidgetRenderer } from './WidgetRenderer.vue'
