/**
 * Core Systems
 * 
 * Sistemas fundamentais da biblioteca low-code.
 * Fornece infraestrutura para Widget System, Schema Builder e Component Registry.
 * 
 * @module core
 */

// Widget System
export * from './widget-system'

// Component Registry
export * from './component-registry'

// Config (já existente)
export * from './config'

// Schema Builder (sistema genérico de builders)
export {
  useSchemaBuilder,
  useSchemaHistory,
  validateBaseSchema,
  createValidator,
  createValidationSuccess,
  createValidationError,
  isValidSchemaStructure,
  migrateSchema,
  generateId,
  generateTimestamp
} from './schema-builder'

export {
  serializeSchema as serializeGenericSchema,
  deserializeSchema,
  cloneSchema as cloneGenericSchema
} from './schema-builder'

// Builder Manager (gerenciador global de builders)
export { builderManager, useBuilderManager } from './builder-manager'
export type { BuilderInstance, BuilderType } from './builder-manager'

export type {
  BaseSchema,
  BaseSchemaItem,
  SchemaBuilderOperations,
  SchemaBuilderState,
  SchemaBuilderHistory,
  SchemaBuilderPersistence,
  ValidationResult,
  ValidationError,
  UseSchemaBuilderOptions
} from './schema-builder'

// Adapters (sistema plugável)
export * from './adapters'

// Validation (validadores customizados + brasileiros)
export * from './validation'
