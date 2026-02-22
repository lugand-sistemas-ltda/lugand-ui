/**
 * Schema System - Core Module
 * 
 * Sistema de schemas JSON para descrever páginas, formulários e layouts.
 * 
 * @module core/schema-system
 */

// Types
export * from './types'

// Validator
export {
  validatePageSchema,
  canMigrate,
  quickValidate
} from './validator'

// Parser
export {
  parseSchema,
  serializeSchema,
  cloneSchema,
  mergeSchemas,
  diffSchemas,
  extractWidgetsByType,
  extractWidgetById,
  createEmptySchema,
  exportSchemaForDebug
} from './parser'
