/**
 * Schema Inference - Type Definitions
 * 
 * Sistema de inferência automática de schemas a partir de DTOs/Types.
 * Permite gerar forms/UIs automaticamente sem definir manualmente cada campo.
 * 
 * @module features/schema-inference
 */

import type { FormField, FieldType, FormSchema } from '../form-renderer/types'

/**
 * Tipo primitivo TypeScript.
 */
export type PrimitiveType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'Date'
  | 'null'
  | 'undefined'
  | 'unknown'
  | 'any'

/**
 * Tipo complexo TypeScript.
 */
export type ComplexType =
  | 'object'
  | 'array'
  | 'union'
  | 'intersection'
  | 'enum'
  | 'tuple'
  | 'literal'

/**
 * Metadata de propriedade TypeScript.
 */
export interface PropertyMetadata {
  /** Nome da propriedade */
  name: string

  /** Tipo da propriedade */
  type: PrimitiveType | ComplexType

  /** Tipo original (string raw do TS) */
  rawType: string

  /** Se é opcional */
  optional: boolean

  /** Se é readonly */
  readonly: boolean

  /** Se é nullable */
  nullable: boolean

  /** Valores possíveis (para enum/union literal) */
  possibleValues?: any[]

  /** Tipo do array (se type === 'array') */
  arrayType?: string

  /** Propriedades filhas (se type === 'object') */
  properties?: PropertyMetadata[]

  /** JSDoc comments */
  description?: string

  /** Decorators/anotações */
  decorators?: string[]
}

/**
 * Metadata de DTO analisado.
 */
export interface DTOMetadata {
  /** Nome do DTO/Type */
  name: string

  /** Tipo (interface, type, class) */
  kind: 'interface' | 'type' | 'class'

  /** Propriedades */
  properties: PropertyMetadata[]

  /** Descrição (JSDoc) */
  description?: string

  /** Herda de (extends) */
  extends?: string[]

  /** Source code original */
  source?: string
}

/**
 * Regra de mapeamento de tipo → field type.
 */
export interface TypeMappingRule {
  /** Pattern do tipo (regex ou string exata) */
  pattern: string | RegExp

  /** Field type resultante */
  fieldType: FieldType

  /** Prioridade (maior = primeira) */
  priority?: number

  /** Condição adicional */
  condition?: (prop: PropertyMetadata) => boolean
}

/**
 * Regra de inferência de campo.
 */
export interface FieldInferenceRule {
  /** Pattern do nome da propriedade */
  namePattern: string | RegExp

  /** Field type sugerido */
  fieldType?: FieldType

  /** Validações sugeridas */
  validations?: Array<{
    type: string
    value?: any
    message?: string
  }>

  /** Placeholder sugerido */
  placeholder?: string

  /** Help text sugerido */
  helpText?: string

  /** Opções sugeridas (para select) */
  options?: Array<{ label: string; value: any }>
}

/**
 * Configuração de inferência.
 */
export interface InferenceConfig {
  /** Mapeamentos de tipo customizados */
  typeMappings?: TypeMappingRule[]

  /** Regras de campo customizadas */
  fieldRules?: FieldInferenceRule[]

  /** Se deve gerar labels a partir do nome */
  generateLabels?: boolean

  /** Se deve gerar placeholders */
  generatePlaceholders?: boolean

  /** Se deve gerar validações automáticas */
  generateValidations?: boolean

  /** Se deve inferir required (de optional) */
  inferRequired?: boolean

  /** Se deve inferir readonly */
  inferReadonly?: boolean

  /** Prefixo para remover dos labels */
  labelPrefixToRemove?: string

  /** Sufixo para remover dos labels */
  labelSuffixToRemove?: string

  /** Campos a ignorar */
  ignoreFields?: string[]

  /** Campos a incluir explicitamente */
  includeFields?: string[]

  /** Transformação de label customizada */
  labelTransform?: (name: string) => string
}

/**
 * Resultado da inferência de schema.
 */
export interface InferenceResult {
  /** Schema inferido */
  schema: FormSchema

  /** Metadata do DTO analisado */
  metadata: DTOMetadata

  /** Warnings/avisos */
  warnings: Array<{
    property: string
    message: string
  }>

  /** Campos ignorados */
  ignoredFields: string[]

  /** Confiança da inferência (0-1) */
  confidence: number
}

/**
 * Opções de análise de DTO.
 */
export interface AnalyzeOptions {
  /** Source code do DTO */
  source: string

  /** Nome do type/interface a analisar */
  typeName?: string

  /** Configuração de inferência */
  config?: InferenceConfig
}

/**
 * Estratégia de inferência para propriedades complexas.
 */
export type ComplexPropertyStrategy =
  | 'flatten'       // Achata propriedades aninhadas
  | 'nested'        // Mantém estrutura aninhada
  | 'ignore'        // Ignora propriedades complexas
  | 'json-editor'   // Usa editor JSON

/**
 * Contexto de inferência.
 */
export interface InferenceContext {
  /** DTO sendo analisado */
  dto: DTOMetadata

  /** Configuração */
  config: InferenceConfig

  /** Estratégia para complexos */
  complexStrategy: ComplexPropertyStrategy

  /** Depth atual (para nested) */
  depth: number

  /** Max depth permitido */
  maxDepth: number

  /** Path atual (ex: 'user.address.street') */
  path: string[]
}

/**
 * Hook de customização de inferência.
 */
export interface InferenceHook {
  /** Antes de analisar DTO */
  beforeAnalyze?: (source: string) => string

  /** Após analisar DTO */
  afterAnalyze?: (metadata: DTOMetadata) => DTOMetadata

  /** Antes de inferir campo */
  beforeInferField?: (prop: PropertyMetadata, context: InferenceContext) => PropertyMetadata

  /** Após inferir campo */
  afterInferField?: (field: FormField, prop: PropertyMetadata, context: InferenceContext) => FormField

  /** Antes de retornar resultado */
  beforeReturn?: (result: InferenceResult) => InferenceResult
}
