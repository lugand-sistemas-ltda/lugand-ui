/**
 * Schema Parser
 * 
 * Parseia, serializa e transforma schemas JSON.
 * 
 * Funcionalidades:
 * - Parse: JSON string → PageSchema object
 * - Serialize: PageSchema → JSON string
 * - Clone: deep copy de schemas
 * - Merge: combinar schemas
 * - Diff: comparar schemas
 * 
 * @module core/schema-system
 */

import type {
  PageSchema,
  SchemaParseOptions,
  SchemaSerializeOptions,
  SchemaChangeEvent
} from './types'
import { validatePageSchema, quickValidate } from './validator'

/**
 * Parseia um JSON string em PageSchema.
 * 
 * @param json - JSON string ou objeto
 * @param options - Opções de parsing
 * @returns PageSchema parseado
 * @throws Error se JSON é inválido ou schema é inválido
 * 
 * @example
 * ```typescript
 * const schema = parseSchema(jsonString, {
 *   validate: true,
 *   strict: true
 * })
 * ```
 */
export function parseSchema(
  json: string | object,
  options: SchemaParseOptions = {}
): PageSchema {
  const {
    validate = true,
    strict = false,
    stripNullish = false
  } = options

  // 1. Parse JSON (se for string)
  let parsed: any

  try {
    parsed = typeof json === 'string' ? JSON.parse(json) : json
  } catch (error) {
    throw new Error(`Failed to parse schema JSON: ${(error as Error).message}`)
  }

  // 2. Quick validation (estrutura básica)
  if (!quickValidate(parsed)) {
    throw new Error('Invalid schema structure: missing required fields (id, type, metadata, layout, widgets)')
  }

  // 3. Strip nullish values (se solicitado)
  if (stripNullish) {
    parsed = stripNullishValues(parsed)
  }

  // 4. Validação completa (se solicitada)
  if (validate) {
    const result = validatePageSchema(parsed, options)

    if (!result.valid) {
      const errorMessages = result.errors.map((e) => `${e.path}: ${e.message}`).join('\n')
      throw new Error(`Schema validation failed:\n${errorMessages}`)
    }

    // Log warnings (se houver)
    if (result.warnings && result.warnings.length > 0) {
      console.warn('[Schema Parser] Warnings:', result.warnings)
    }
  }

  // 5. Strict mode (rejeita propriedades desconhecidas)
  if (strict) {
    // TODO: implementar validação strict de propriedades
    // Por enquanto, apenas aceita tudo
  }

  return parsed as PageSchema
}

/**
 * Serializa um PageSchema em JSON string.
 * 
 * @param schema - Schema a serializar
 * @param options - Opções de serialização
 * @returns JSON string
 * 
 * @example
 * ```typescript
 * const json = serializeSchema(mySchema, {
 *   indent: 2,
 *   minify: false
 * })
 * ```
 */
export function serializeSchema(
  schema: PageSchema,
  options: SchemaSerializeOptions = {}
): string {
  const {
    indent = 2,
    minify = false,
    includeMetadata = true
  } = options

  // 1. Clone schema (para não modificar original)
  let toSerialize = cloneSchema(schema)

  // 2. Remove metadata (se solicitado)
  if (!includeMetadata) {
    toSerialize = {
      ...toSerialize,
      metadata: {
        title: toSerialize.metadata.title,
        version: toSerialize.metadata.version,
        createdAt: toSerialize.metadata.createdAt,
        updatedAt: toSerialize.metadata.updatedAt
      }
    }
  }

  // 3. Stringify
  return JSON.stringify(
    toSerialize,
    null,
    minify ? 0 : (typeof indent === 'number' ? indent : 2)
  )
}

/**
 * Clona um schema (deep copy).
 * 
 * @param schema - Schema a clonar
 * @returns Clone do schema
 */
export function cloneSchema<T extends PageSchema>(schema: T): T {
  return JSON.parse(JSON.stringify(schema))
}

/**
 * Merge de dois schemas.
 * Target é modificado, source sobrescreve.
 * 
 * @param target - Schema base
 * @param source - Schema a mesclar
 * @returns Schema mesclado
 * 
 * @example
 * ```typescript
 * const merged = mergeSchemas(baseSchema, {
 *   widgets: [...newWidgets]
 * })
 * ```
 */
export function mergeSchemas(
  target: Partial<PageSchema>,
  source: Partial<PageSchema>
): PageSchema {
  return {
    ...target,
    ...source,
    metadata: {
      ...target.metadata,
      ...source.metadata,
      updatedAt: new Date().toISOString()
    } as any,
    widgets: source.widgets || target.widgets || [],
    layout: {
      ...target.layout,
      ...source.layout
    } as any
  } as PageSchema
}

/**
 * Calcula diff entre dois schemas.
 * Retorna lista de mudanças.
 * 
 * @param oldSchema - Schema original
 * @param newSchema - Schema novo
 * @returns Array de mudanças
 * 
 * @example
 * ```typescript
 * const changes = diffSchemas(v1, v2)
 * changes.forEach(change => {
 *   console.log(`${change.type}: ${change.path}`)
 * })
 * ```
 */
export function diffSchemas(
  oldSchema: PageSchema,
  newSchema: PageSchema
): SchemaChangeEvent[] {
  const changes: SchemaChangeEvent[] = []

  // 1. Diff de metadata
  if (JSON.stringify(oldSchema.metadata) !== JSON.stringify(newSchema.metadata)) {
    changes.push({
      type: 'metadata-updated',
      path: 'metadata',
      oldValue: oldSchema.metadata,
      newValue: newSchema.metadata,
      timestamp: new Date().toISOString()
    })
  }

  // 2. Diff de layout
  if (JSON.stringify(oldSchema.layout) !== JSON.stringify(newSchema.layout)) {
    changes.push({
      type: 'layout-changed',
      path: 'layout',
      oldValue: oldSchema.layout,
      newValue: newSchema.layout,
      timestamp: new Date().toISOString()
    })
  }

  // 3. Diff de widgets
  const oldWidgetIds = new Set(oldSchema.widgets.map((w) => w.id))
  const newWidgetIds = new Set(newSchema.widgets.map((w) => w.id))

  // Widgets adicionados
  newSchema.widgets.forEach((widget) => {
    if (!oldWidgetIds.has(widget.id)) {
      changes.push({
        type: 'widget-added',
        path: `widgets.${widget.id}`,
        newValue: widget,
        timestamp: new Date().toISOString()
      })
    }
  })

  // Widgets removidos
  oldSchema.widgets.forEach((widget) => {
    if (!newWidgetIds.has(widget.id)) {
      changes.push({
        type: 'widget-removed',
        path: `widgets.${widget.id}`,
        oldValue: widget,
        timestamp: new Date().toISOString()
      })
    }
  })

  // Widgets modificados
  newSchema.widgets.forEach((newWidget) => {
    const oldWidget = oldSchema.widgets.find((w) => w.id === newWidget.id)

    if (oldWidget && JSON.stringify(oldWidget) !== JSON.stringify(newWidget)) {
      changes.push({
        type: 'widget-updated',
        path: `widgets.${newWidget.id}`,
        oldValue: oldWidget,
        newValue: newWidget,
        timestamp: new Date().toISOString()
      })
    }
  })

  return changes
}

/**
 * Extrai widgets de um schema por tipo.
 * 
 * @param schema - Schema a extrair
 * @param type - Tipo de widget
 * @returns Array de widgets do tipo
 */
export function extractWidgetsByType(schema: PageSchema, type: string) {
  return schema.widgets.filter((w) => w.type === type)
}

/**
 * Extrai widget por ID.
 * 
 * @param schema - Schema a buscar
 * @param widgetId - ID do widget
 * @returns Widget ou undefined
 */
export function extractWidgetById(schema: PageSchema, widgetId: string) {
  return schema.widgets.find((w) => w.id === widgetId)
}

/**
 * Remove valores null/undefined do objeto.
 * Deep cleaning recursivo.
 * 
 * @param obj - Objeto a limpar
 * @returns Objeto sem nullish values
 */
function stripNullishValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(stripNullishValues).filter((v) => v !== null && v !== undefined)
  }

  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleaned = stripNullishValues(value)

      if (cleaned !== null && cleaned !== undefined) {
        acc[key] = cleaned
      }

      return acc
    }, {} as any)
  }

  return obj
}

/**
 * Cria um schema vazio (template).
 * 
 * @param type - Tipo de schema
 * @param title - Título do schema
 * @returns Schema template
 */
export function createEmptySchema(
  type: PageSchema['type'] = 'page',
  title = 'Untitled Page'
): PageSchema {
  return {
    id: `schema-${Date.now()}`,
    type,
    metadata: {
      title,
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    layout: {
      strategy: 'grid',
      config: {
        columns: 12,
        gap: 16
      }
    },
    widgets: []
  }
}

/**
 * Exporta schema como objeto legível (para debug).
 * Remove componentes Vue e funções.
 * 
 * @param schema - Schema a exportar
 * @returns Objeto serializable
 */
export function exportSchemaForDebug(schema: PageSchema): Record<string, any> {
  return JSON.parse(JSON.stringify(schema, (_key, value) => {
    // Remove funções e componentes
    if (typeof value === 'function') return '[Function]'
    if (value && typeof value === 'object' && value.__v_isVNode) return '[VNode]'
    return value
  }))
}
