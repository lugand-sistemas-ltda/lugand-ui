/**
 * Widget Registry
 * 
 * Sistema central de registro de widgets disponíveis na aplicação.
 * Permite descoberta automática de widgets e extensibilidade.
 * 
 * Funcionamento:
 * 1. Widgets se auto-registram via decorator @RegisterWidget
 * 2. Page Builder consulta registry para listar widgets disponíveis
 * 3. WidgetRenderer consulta registry para renderizar widget pelo type
 * 
 * @module core/widget-system
 */

import type { WidgetDefinition, WidgetCategory } from './types'

/**
 * Store global do Widget Registry.
 * Map de type → WidgetDefinition
 */
const WIDGET_REGISTRY = new Map<string, WidgetDefinition>()

/**
 * Registra um widget no registry.
 * 
 * @param definition - Definição completa do widget
 * @throws Error se type já estiver registrado
 * 
 * @example
 * ```typescript
 * registerWidget({
 *   type: 'form',
 *   category: 'data-entry',
 *   label: 'Form Builder',
 *   icon: '📝',
 *   component: FormBuilderWidget,
 *   defaultConfig: { fields: [] },
 *   capabilities: { ... }
 * })
 * ```
 */
export function registerWidget(definition: WidgetDefinition): void {
  if (WIDGET_REGISTRY.has(definition.type)) {
    console.warn(
      `[Widget Registry] Widget type "${definition.type}" is already registered. Overwriting.`
    )
  }

  // Validação básica
  if (!definition.type || typeof definition.type !== 'string') {
    throw new Error('[Widget Registry] Widget type must be a non-empty string')
  }

  if (!definition.component && !definition.renderer) {
    throw new Error(
      `[Widget Registry] Widget "${definition.type}" must have either component or renderer`
    )
  }

  WIDGET_REGISTRY.set(definition.type, definition)

  console.info(
    `[Widget Registry] ✅ Registered widget: ${definition.type} (${definition.label})`
  )
}

/**
 * Remove um widget do registry.
 * Útil para hot reload durante desenvolvimento.
 * 
 * @param type - Tipo do widget a remover
 * @returns true se removeu, false se não existia
 */
export function unregisterWidget(type: string): boolean {
  const removed = WIDGET_REGISTRY.delete(type)

  if (removed) {
    console.info(`[Widget Registry] ❌ Unregistered widget: ${type}`)
  }

  return removed
}

/**
 * Busca um widget pelo type.
 * 
 * @param type - Tipo do widget
 * @returns Definição do widget ou undefined
 * 
 * @example
 * ```typescript
 * const formWidget = getWidget('form')
 * if (formWidget) {
 *   console.log(formWidget.label) // "Form Builder"
 * }
 * ```
 */
export function getWidget(type: string): WidgetDefinition | undefined {
  return WIDGET_REGISTRY.get(type)
}

/**
 * Lista todos os widgets registrados.
 * 
 * @returns Array de todas as definições
 */
export function getAllWidgets(): WidgetDefinition[] {
  return Array.from(WIDGET_REGISTRY.values())
}

/**
 * Filtra widgets por categoria.
 * 
 * @param category - Categoria desejada
 * @returns Array de widgets da categoria
 * 
 * @example
 * ```typescript
 * const dataEntryWidgets = getWidgetsByCategory('data-entry')
 * // [FormWidget, InputWidget, SelectWidget, ...]
 * ```
 */
export function getWidgetsByCategory(category: WidgetCategory): WidgetDefinition[] {
  return getAllWidgets().filter((widget) => widget.category === category)
}

/**
 * Busca widgets por texto (fuzzy search).
 * Pesquisa em: type, label, description, tags.
 * 
 * @param query - Texto de busca
 * @returns Array de widgets que correspondem à busca
 * 
 * @example
 * ```typescript
 * const results = searchWidgets('form')
 * // [FormWidget, FormBuilderWidget, ...]
 * ```
 */
export function searchWidgets(query: string): WidgetDefinition[] {
  const lowerQuery = query.toLowerCase()

  return getAllWidgets().filter((widget) => {
    const searchableText = [
      widget.type,
      widget.label,
      widget.description,
      ...(widget.editableProps?.map((p) => p.label) || [])
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(lowerQuery)
  })
}

/**
 * Verifica se um widget type está registrado.
 * 
 * @param type - Tipo do widget
 * @returns true se existe, false caso contrário
 */
export function hasWidget(type: string): boolean {
  return WIDGET_REGISTRY.has(type)
}

/**
 * Limpa todo o registry.
 * ⚠️ CUIDADO: Use apenas em testes!
 */
export function clearRegistry(): void {
  WIDGET_REGISTRY.clear()
  console.warn('[Widget Registry] ⚠️  Registry cleared (all widgets unregistered)')
}

/**
 * Obtém estatísticas do registry.
 * Útil para debugging e monitoramento.
 * 
 * @returns Estatísticas do registry
 */
export function getRegistryStats() {
  const widgets = getAllWidgets()

  const byCategory = widgets.reduce(
    (acc, widget) => {
      acc[widget.category] = (acc[widget.category] || 0) + 1
      return acc
    },
    {} as Record<WidgetCategory, number>
  )

  return {
    total: widgets.length,
    byCategory,
    types: widgets.map((w) => w.type)
  }
}

/**
 * Exporta registry como JSON.
 * Útil para inspeção e documentação.
 * 
 * @returns JSON representation do registry
 */
export function exportRegistry(): Record<string, Omit<WidgetDefinition, 'component' | 'editor' | 'renderer'>> {
  const exported: Record<string, any> = {}

  WIDGET_REGISTRY.forEach((definition, type) => {
    exported[type] = {
      type: definition.type,
      category: definition.category,
      label: definition.label,
      icon: definition.icon,
      description: definition.description,
      defaultConfig: definition.defaultConfig,
      capabilities: definition.capabilities,
      editableProps: definition.editableProps,
      events: definition.events
    }
  })

  return exported
}

/**
 * Valida se um WidgetSchema é válido.
 * Verifica se o type existe no registry e se config está correto.
 * 
 * @param schema - Schema do widget a validar
 * @returns Objeto com resultado da validação
 * 
 * @example
 * ```typescript
 * const result = validateWidgetSchema({
 *   id: 'my-form',
 *   type: 'form',
 *   config: { fields: [] }
 * })
 * 
 * if (!result.valid) {
 *   console.error(result.errors)
 * }
 * ```
 */
export function validateWidgetSchema(schema: { type: string; config?: any }): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Verifica se type existe
  if (!hasWidget(schema.type)) {
    errors.push(`Widget type "${schema.type}" is not registered`)
    return { valid: false, errors }
  }

  const definition = getWidget(schema.type)!

  // Verifica se config existe (se widget precisa)
  if (!schema.config && Object.keys(definition.defaultConfig).length > 0) {
    errors.push(`Widget "${schema.type}" requires a config object`)
  }

  // Validações adicionais podem ser adicionadas aqui
  // Ex: validar props obrigatórias, tipos, etc.

  return {
    valid: errors.length === 0,
    errors
  }
}
