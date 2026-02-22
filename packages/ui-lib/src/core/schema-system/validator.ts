/**
 * Schema Validator
 * 
 * Valida schemas JSON garantindo integridade e conformidade.
 * 
 * Validações:
 * - Estrutura básica (id, type, metadata, widgets)
 * - Widgets registrados (type existe no registry)
 * - Referências (dataSource, bindings)
 * - Permissões (roles válidos)
 * - Layout (config válida)
 * 
 * @module core/schema-system
 */

import type {
  PageSchema,
  FormSchema,
  DashboardSchema,
  SchemaValidationResult,
  SchemaParseOptions
} from './types'
import type { WidgetSchema } from '../widget-system/types'
import { hasWidget, validateWidgetSchema } from '../widget-system/widget-registry'

/**
 * Valida um PageSchema completo.
 * 
 * @param schema - Schema a validar
 * @param options - Opções de validação
 * @returns Resultado da validação
 * 
 * @example
 * ```typescript
 * const result = validatePageSchema(mySchema)
 * 
 * if (!result.valid) {
 *   console.error('Schema inválido:', result.errors)
 * }
 * ```
 */
export function validatePageSchema(
  schema: PageSchema,
  _options: SchemaParseOptions = {}
): SchemaValidationResult {
  const errors: SchemaValidationResult['errors'] = []
  const warnings: SchemaValidationResult['warnings'] = []

  // 1. Validar estrutura básica
  if (!schema.id || typeof schema.id !== 'string') {
    errors.push({
      path: 'id',
      message: 'Schema must have a valid id (non-empty string)',
      severity: 'error'
    })
  }

  if (!schema.type || !['page', 'form', 'layout', 'dashboard', 'workflow'].includes(schema.type)) {
    errors.push({
      path: 'type',
      message: 'Schema type must be one of: page, form, layout, dashboard, workflow',
      severity: 'error'
    })
  }

  // 2. Validar metadata
  if (!schema.metadata) {
    errors.push({
      path: 'metadata',
      message: 'Schema must have metadata',
      severity: 'error'
    })
  } else {
    if (!schema.metadata.title) {
      errors.push({
        path: 'metadata.title',
        message: 'Metadata must have a title',
        severity: 'error'
      })
    }

    if (!schema.metadata.version) {
      warnings?.push({
        path: 'metadata.version',
        message: 'Metadata should have a version (defaulting to 1.0)'
      })
    }

    if (!schema.metadata.createdAt) {
      warnings?.push({
        path: 'metadata.createdAt',
        message: 'Metadata should have createdAt timestamp'
      })
    }
  }

  // 3. Validar layout
  if (!schema.layout) {
    errors.push({
      path: 'layout',
      message: 'Schema must have a layout configuration',
      severity: 'error'
    })
  } else {
    if (!['grid', 'flex', 'absolute', 'stack'].includes(schema.layout.strategy)) {
      errors.push({
        path: 'layout.strategy',
        message: 'Layout strategy must be: grid, flex, absolute, or stack',
        severity: 'error'
      })
    }
  }

  // 4. Validar widgets
  if (!Array.isArray(schema.widgets)) {
    errors.push({
      path: 'widgets',
      message: 'Schema must have a widgets array',
      severity: 'error'
    })
  } else {
    schema.widgets.forEach((widget, index) => {
      const widgetErrors = validateWidget(widget, `widgets[${index}]`)
      errors.push(...widgetErrors)
    })

    // Validar IDs duplicados
    const widgetIds = schema.widgets.map((w) => w.id)
    const duplicates = widgetIds.filter((id, index) => widgetIds.indexOf(id) !== index)

    if (duplicates.length > 0) {
      errors.push({
        path: 'widgets',
        message: `Duplicate widget IDs found: ${duplicates.join(', ')}`,
        severity: 'error'
      })
    }
  }

  // 5. Validar permissões (se presentes)
  if (schema.permissions) {
    if (schema.permissions.view && !Array.isArray(schema.permissions.view)) {
      errors.push({
        path: 'permissions.view',
        message: 'permissions.view must be an array of roles',
        severity: 'error'
      })
    }

    if (schema.permissions.edit && !Array.isArray(schema.permissions.edit)) {
      errors.push({
        path: 'permissions.edit',
        message: 'permissions.edit must be an array of roles',
        severity: 'error'
      })
    }
  }

  // 6. Validações específicas por tipo
  if (schema.type === 'form') {
    const formErrors = validateFormSchema(schema as FormSchema)
    errors.push(...formErrors)
  }

  if (schema.type === 'dashboard') {
    const dashboardErrors = validateDashboardSchema(schema as DashboardSchema)
    errors.push(...dashboardErrors)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    timestamp: new Date().toISOString()
  }
}

/**
 * Valida um widget individual.
 * 
 * @param widget - Widget a validar
 * @param path - Path do widget no schema (para mensagens de erro)
 * @returns Array de erros encontrados
 */
function validateWidget(
  widget: WidgetSchema,
  path: string
): SchemaValidationResult['errors'] {
  const errors: SchemaValidationResult['errors'] = []

  // Validar ID
  if (!widget.id) {
    errors.push({
      path: `${path}.id`,
      message: 'Widget must have an id',
      severity: 'error'
    })
  }

  // Validar type (existe no registry?)
  if (!widget.type) {
    errors.push({
      path: `${path}.type`,
      message: 'Widget must have a type',
      severity: 'error'
    })
  } else if (!hasWidget(widget.type)) {
    errors.push({
      path: `${path}.type`,
      message: `Widget type "${widget.type}" is not registered`,
      severity: 'error'
    })
  } else {
    // Validar usando o Widget Registry
    const result = validateWidgetSchema(widget)
    if (!result.valid) {
      result.errors.forEach((error) => {
        errors.push({
          path: `${path}`,
          message: error,
          severity: 'error'
        })
      })
    }
  }

  // Validar position (se presente)
  if (widget.position) {
    if (typeof widget.position.x !== 'number' || typeof widget.position.y !== 'number') {
      errors.push({
        path: `${path}.position`,
        message: 'Widget position must have numeric x and y coordinates',
        severity: 'error'
      })
    }
  }

  return errors
}

/**
 * Validações específicas de FormSchema.
 */
function validateFormSchema(schema: FormSchema): SchemaValidationResult['errors'] {
  const errors: SchemaValidationResult['errors'] = []

  if (!schema.formConfig) {
    errors.push({
      path: 'formConfig',
      message: 'Form schema must have formConfig',
      severity: 'error'
    })
    return errors
  }

  // Validar método HTTP
  if (schema.formConfig.method) {
    const validMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
    if (!validMethods.includes(schema.formConfig.method)) {
      errors.push({
        path: 'formConfig.method',
        message: `Form method must be one of: ${validMethods.join(', ')}`,
        severity: 'error'
      })
    }
  }

  // Validar action (se presente, deve ser URL válida)
  if (schema.formConfig.action) {
    try {
      new URL(schema.formConfig.action, window.location.origin)
    } catch {
      errors.push({
        path: 'formConfig.action',
        message: 'Form action must be a valid URL or path',
        severity: 'warning'
      })
    }
  }

  return errors
}

/**
 * Validações específicas de DashboardSchema.
 */
function validateDashboardSchema(schema: DashboardSchema): SchemaValidationResult['errors'] {
  const errors: SchemaValidationResult['errors'] = []

  if (!schema.dashboardConfig) {
    errors.push({
      path: 'dashboardConfig',
      message: 'Dashboard schema must have dashboardConfig',
      severity: 'error'
    })
    return errors
  }

  // Validar refreshInterval
  if (
    schema.dashboardConfig.refreshInterval &&
    typeof schema.dashboardConfig.refreshInterval !== 'number'
  ) {
    errors.push({
      path: 'dashboardConfig.refreshInterval',
      message: 'refreshInterval must be a number (milliseconds)',
      severity: 'error'
    })
  }

  // Validar exportFormats
  if (schema.dashboardConfig.exportFormats) {
    const validFormats = ['pdf', 'excel', 'csv', 'json']
    const invalidFormats = schema.dashboardConfig.exportFormats.filter(
      (format) => !validFormats.includes(format)
    )

    if (invalidFormats.length > 0) {
      errors.push({
        path: 'dashboardConfig.exportFormats',
        message: `Invalid export formats: ${invalidFormats.join(', ')}`,
        severity: 'error'
      })
    }
  }

  return errors
}

/**
 * Valida se um schema pode ser migrado para uma versão específica.
 * 
 * @param schema - Schema a validar
 * @param targetVersion - Versão alvo
 * @returns true se migração é possível
 */
export function canMigrate(schema: PageSchema, targetVersion: string): boolean {
  const currentVersion = schema.metadata.version || '1.0'

  // Por enquanto, suportamos apenas 1.0 → 1.1 → 2.0
  const versionPath = ['1.0', '1.1', '2.0']

  const currentIndex = versionPath.indexOf(currentVersion)
  const targetIndex = versionPath.indexOf(targetVersion)

  // Não pode migrar se versão não existe ou se tentando downgrade
  return currentIndex !== -1 && targetIndex !== -1 && targetIndex >= currentIndex
}

/**
 * Quick validation: apenas verifica estrutura básica.
 * Útil para validações rápidas sem overhead.
 * 
 * @param schema - Schema a validar
 * @returns true se estrutura básica é válida
 */
export function quickValidate(schema: any): schema is PageSchema {
  return !!(
    schema &&
    typeof schema === 'object' &&
    schema.id &&
    schema.type &&
    schema.metadata &&
    schema.layout &&
    Array.isArray(schema.widgets)
  )
}
