/**
 * Core Systems
 * 
 * Sistemas fundamentais da biblioteca low-code.
 * Fornece infraestrutura para Widget System, Schema System e Component Registry.
 * 
 * @module core
 */

// Widget System
export * from './widget-system'

// Schema System
export * from './schema-system'

// Component Registry
export * from './component-registry'

// Config (já existente)
export * from './config'

// Schema Builder (sistema genérico de builders)
// Evitar conflitos com schema-system usando exports explícitos
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
