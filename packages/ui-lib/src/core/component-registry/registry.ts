/**
 * Component Registry
 * 
 * Sistema central de registro de componentes customizados.
 * Permite auto-descoberta e integração com Page Builder.
 * 
 * @module core/component-registry
 */

import type { Component } from 'vue'
import type {
  ComponentMetadata,
  ComponentRegistryEntry,
  ComponentSearchOptions,
  ComponentSearchResult,
  ComponentRegistryStats,
  ComponentCategory
} from './types'

/**
 * Store global do Component Registry.
 * Map de name → ComponentRegistryEntry
 */
const COMPONENT_REGISTRY = new Map<string, ComponentRegistryEntry>()

/**
 * Registra um componente no registry.
 * 
 * @param component - Componente Vue
 * @param metadata - Metadata do componente
 * @throws Error se name já estiver registrado
 * 
 * @example
 * ```typescript
 * registerComponent(MyCustomCard, {
 *   name: 'my-custom-card',
 *   label: 'Custom Card',
 *   category: 'data-display',
 *   props: [
 *     { name: 'title', label: 'Title', type: 'string' },
 *     { name: 'color', label: 'Color', type: 'color' }
 *   ]
 * })
 * ```
 */
export function registerComponent(
  component: Component,
  metadata: ComponentMetadata
): void {
  // Validação básica
  if (!metadata.name || typeof metadata.name !== 'string') {
    throw new Error('[Component Registry] Component name must be a non-empty string')
  }

  // Warn se já existe (mas permite override)
  if (COMPONENT_REGISTRY.has(metadata.name)) {
    console.warn(
      `[Component Registry] Component "${metadata.name}" is already registered. Overwriting.`
    )
  }

  if (!component) {
    throw new Error(
      `[Component Registry] Component "${metadata.name}" cannot be null or undefined`
    )
  }

  // Normaliza name para kebab-case
  const normalizedName = metadata.name.toLowerCase().replace(/\s+/g, '-')

  const entry: ComponentRegistryEntry = {
    metadata: {
      ...metadata,
      name: normalizedName
    },
    component,
    registeredAt: new Date().toISOString()
  }

  COMPONENT_REGISTRY.set(normalizedName, entry)

  console.info(
    `[Component Registry] ✅ Registered component: ${normalizedName} (${metadata.label})`
  )
}

/**
 * Remove um componente do registry.
 * 
 * @param name - Nome do componente
 * @returns true se removeu, false se não existia
 */
export function unregisterComponent(name: string): boolean {
  const removed = COMPONENT_REGISTRY.delete(name)

  if (removed) {
    console.info(`[Component Registry] ❌ Unregistered component: ${name}`)
  }

  return removed
}

/**
 * Busca um componente pelo name.
 * 
 * @param name - Nome do componente (kebab-case)
 * @returns Entry do componente ou undefined
 */
export function getComponent(name: string): ComponentRegistryEntry | undefined {
  return COMPONENT_REGISTRY.get(name)
}

/**
 * Lista todos os componentes registrados.
 * 
 * @returns Array de entries
 */
export function getAllComponents(): ComponentRegistryEntry[] {
  return Array.from(COMPONENT_REGISTRY.values())
}

/**
 * Filtra componentes por categoria.
 * 
 * @param category - Categoria desejada
 * @returns Array de componentes da categoria
 */
export function getComponentsByCategory(
  category: ComponentCategory
): ComponentRegistryEntry[] {
  return getAllComponents().filter((entry) => entry.metadata.category === category)
}

/**
 * Busca avançada de componentes.
 * Suporta filtros, ordenação e paginação.
 * 
 * @param options - Opções de busca
 * @returns Resultado da busca
 * 
 * @example
 * ```typescript
 * const result = searchComponents({
 *   category: 'form-control',
 *   tags: ['input'],
 *   query: 'text',
 *   sortBy: 'label',
 *   limit: 10
 * })
 * ```
 */
export function searchComponents(
  options: ComponentSearchOptions = {}
): ComponentSearchResult {
  const startTime = performance.now()

  let results = getAllComponents()

  // Filtro: categoria
  if (options.category) {
    results = results.filter((entry) => entry.metadata.category === options.category)
  }

  // Filtro: tags (AND - todas as tags devem estar presentes)
  if (options.tags && options.tags.length > 0) {
    results = results.filter((entry) => {
      const componentTags = entry.metadata.tags || []
      return options.tags!.every((tag) => componentTags.includes(tag))
    })
  }

  // Filtro: experimental
  if (options.experimental !== undefined) {
    results = results.filter(
      (entry) => entry.metadata.experimental === options.experimental
    )
  }

  // Filtro: query (fuzzy search)
  if (options.query) {
    const lowerQuery = options.query.toLowerCase()

    results = results.filter((entry) => {
      const searchableText = [
        entry.metadata.name,
        entry.metadata.label,
        entry.metadata.description,
        ...(entry.metadata.tags || []),
        ...(entry.metadata.props?.map((p) => p.label) || [])
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(lowerQuery)
    })
  }

  // Ordenação
  if (options.sortBy) {
    results.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (options.sortBy) {
        case 'name':
          aValue = a.metadata.name
          bValue = b.metadata.name
          break
        case 'label':
          aValue = a.metadata.label
          bValue = b.metadata.label
          break
        case 'category':
          aValue = a.metadata.category
          bValue = b.metadata.category
          break
        case 'registeredAt':
          aValue = a.registeredAt
          bValue = b.registeredAt
          break
        default:
          return 0
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return options.sortOrder === 'desc' ? -comparison : comparison
    })
  }

  // Paginação (limit)
  const total = results.length
  if (options.limit && options.limit > 0) {
    results = results.slice(0, options.limit)
  }

  const searchTime = performance.now() - startTime

  return {
    components: results,
    total,
    searchTime
  }
}

/**
 * Verifica se um componente está registrado.
 * 
 * @param name - Nome do componente
 * @returns true se existe
 */
export function hasComponent(name: string): boolean {
  return COMPONENT_REGISTRY.has(name)
}

/**
 * Limpa todo o registry.
 * ⚠️ CUIDADO: Use apenas em testes!
 */
export function clearComponentRegistry(): void {
  COMPONENT_REGISTRY.clear()
  console.warn(
    '[Component Registry] ⚠️  Registry cleared (all components unregistered)'
  )
}

/**
 * Obtém estatísticas do registry.
 * 
 * @returns Estatísticas
 */
export function getComponentStats(): ComponentRegistryStats {
  const components = getAllComponents()

  const byCategory = components.reduce(
    (acc, entry) => {
      acc[entry.metadata.category] = (acc[entry.metadata.category] || 0) + 1
      return acc
    },
    {} as Record<ComponentCategory, number>
  )

  return {
    total: components.length,
    byCategory,
    experimental: components.filter((c) => c.metadata.experimental).length,
    withCapabilities: components.filter((c) => c.metadata.capabilities).length,
    withExamples: components.filter(
      (c) => c.metadata.examples && c.metadata.examples.length > 0
    ).length
  }
}

/**
 * Exporta registry como JSON (sem componentes Vue).
 * Útil para inspeção e documentação.
 * 
 * @returns JSON do registry
 */
export function exportComponentRegistry(): Record<string, Omit<ComponentRegistryEntry, 'component'>> {
  const exported: Record<string, any> = {}

  COMPONENT_REGISTRY.forEach((entry, name) => {
    exported[name] = {
      metadata: entry.metadata,
      registeredAt: entry.registeredAt,
      version: entry.version
    }
  })

  return exported
}

/**
 * Converte um ComponentRegistryEntry em WidgetDefinition.
 * Permite usar componentes customizados como widgets.
 * 
 * @param entry - Entry do componente
 * @returns WidgetDefinition compatível
 */
export function componentToWidgetDefinition(entry: ComponentRegistryEntry) {
  return {
    type: entry.metadata.name,
    category: mapCategoryToWidgetCategory(entry.metadata.category),
    label: entry.metadata.label,
    icon: entry.metadata.icon,
    description: entry.metadata.description,
    component: entry.component,
    defaultConfig: extractDefaultConfig(entry.metadata),
    capabilities: entry.metadata.capabilities || {},
    editableProps: entry.metadata.props || []
  }
}

/**
 * Mapeia ComponentCategory → WidgetCategory.
 */
function mapCategoryToWidgetCategory(category: ComponentCategory): string {
  const mapping: Record<ComponentCategory, string> = {
    'form-control': 'data-entry',
    'data-display': 'data-display',
    'feedback': 'data-display',
    'navigation': 'navigation',
    'layout': 'layout',
    'media': 'data-display',
    'chart': 'visualization',
    'custom': 'data-display'
  }

  return mapping[category] || 'data-display'
}

/**
 * Extrai defaultConfig das props.
 */
function extractDefaultConfig(metadata: ComponentMetadata): Record<string, any> {
  const config: Record<string, any> = {}

  if (metadata.props) {
    metadata.props.forEach((prop) => {
      if (prop.defaultValue !== undefined) {
        config[prop.name] = prop.defaultValue
      }
    })
  }

  return config
}

/**
 * Registra múltiplos componentes de uma vez.
 * 
 * @param components - Array de [component, metadata]
 */
export function registerComponents(
  components: Array<[Component, ComponentMetadata]>
): void {
  components.forEach(([component, metadata]) => {
    registerComponent(component, metadata)
  })
}

/**
 * Obtém componentes que têm um slot específico.
 * 
 * @param slotName - Nome do slot
 * @returns Componentes com o slot
 */
export function getComponentsWithSlot(slotName: string): ComponentRegistryEntry[] {
  return getAllComponents().filter((entry) =>
    entry.metadata.slots?.some((slot) => slot.name === slotName)
  )
}

/**
 * Obtém componentes que emitem um evento específico.
 * 
 * @param eventName - Nome do evento
 * @returns Componentes que emitem o evento
 */
export function getComponentsWithEvent(eventName: string): ComponentRegistryEntry[] {
  return getAllComponents().filter((entry) =>
    entry.metadata.events?.some((event) => event.name === eventName)
  )
}
