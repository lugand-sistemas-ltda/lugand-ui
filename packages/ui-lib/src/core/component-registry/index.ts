/**
 * Component Registry - Core Module
 * 
 * Sistema de auto-descoberta e registro de componentes customizados.
 * 
 * @module core/component-registry
 */

// Types
export * from './types'

// Registry
export {
  registerComponent,
  unregisterComponent,
  getComponent,
  getAllComponents,
  getComponentsByCategory,
  searchComponents,
  hasComponent,
  clearComponentRegistry,
  getComponentStats,
  exportComponentRegistry,
  componentToWidgetDefinition,
  registerComponents,
  getComponentsWithSlot,
  getComponentsWithEvent
} from './registry'

// Decorators & Helpers
export {
  withMetadata,
  getComponentMetadata,
  hasComponentMetadata,
  Registrable,
  defineComponentMetadata,
  autoRegisterComponents,
  createComponentRegistryPlugin,
  validateComponentMetadata
} from './decorators'
