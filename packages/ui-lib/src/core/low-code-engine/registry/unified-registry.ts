/**
 * Low-Code Engine - Unified Component Registry
 *
 * Registro único de todos os componentes disponíveis nos builders.
 * Substitui os dois registros anteriores:
 *  - core/widget-system/widget-registry.ts  (widgets de page builder)
 *  - core/component-registry/registry.ts    (componentes customizados)
 *
 * DESIGN:
 * - Instância única por aplicação (singleton criado via createUnifiedRegistry)
 * - Imutabilidade: após registrar, a definição não pode ser alterada acidentalmente
 * - Filtragem eficiente por contexto, categoria e busca de texto
 * - Sem dependências Vue — apenas TypeScript puro (testável sem setup de Vue)
 *
 * USO TÍPICO:
 * ```typescript
 * // 1. Criar a instância (uma vez, em main.ts ou plugin setup)
 * import { defaultRegistry } from '@/core/low-code-engine'
 *
 * // 2. Registrar componentes da lib
 * import { buttonDefinition } from '@/core/low-code-engine/definitions'
 * defaultRegistry.register(buttonDefinition)
 *
 * // 3. Criar um builder com o contexto filtered por 'form'
 * const formComponents = defaultRegistry.listByContext('form')
 * ```
 *
 * @module core/low-code-engine/registry/unified-registry
 */

import type {
  BuilderContextType,
  ComponentCategory,
  ComponentDefinition,
  ComponentListFilter,
  ComponentLookupResult,
} from '../types'

// ============================================================
// REGISTRY INTERFACE
// ============================================================

/**
 * Interface pública do Unified Registry.
 * O motor low-code depende desta abstração, não da implementação concreta.
 */
export interface UnifiedRegistry {
  // --- Registro ---

  /**
   * Registra um ComponentDefinition.
   * Warn + sobrescreve se o type já estiver registrado.
   *
   * @throws TypeError se definition.type for vazio
   * @throws TypeError se definition.component for nulo
   */
  register(definition: ComponentDefinition): void

  /**
   * Registra múltiplos ComponentDefinitions de uma vez.
   * Todos os erros são coletados e lançados ao final.
   */
  registerAll(definitions: ComponentDefinition[]): void

  /**
   * Remove um componente do registry.
   * Útil para hot reload durante desenvolvimento.
   * @returns true se removido, false se não existia
   */
  unregister(type: string): boolean

  /**
   * Remove todos os registros.
   * Principalmente para uso em testes.
   */
  clear(): void

  // --- Busca ---

  /**
   * Busca um único componente pelo type.
   * Retorna um discriminated union: found/not-found (sem throw).
   */
  lookup(type: string): ComponentLookupResult

  /**
   * Busca um único componente pelo type.
   * Retorna undefined se não encontrado.
   */
  get(type: string): ComponentDefinition | undefined

  /**
   * Verifica se um type está registrado.
   */
  has(type: string): boolean

  // --- Listagem / Filtragem ---

  /**
   * Retorna todos os componentes registrados.
   */
  listAll(): ComponentDefinition[]

  /**
   * Filtra componentes por contexto de builder.
   * O componente deve listar o contexto em ComponentDefinition.contexts[].
   */
  listByContext(context: BuilderContextType): ComponentDefinition[]

  /**
   * Filtra componentes por categoria.
   */
  listByCategory(category: ComponentCategory): ComponentDefinition[]

  /**
   * Filtra componentes por múltiplos critérios combinados.
   * Todos os filtros fornecidos são aplicados em conjunto (AND).
   */
  list(filter: ComponentListFilter): ComponentDefinition[]

  /**
   * Busca por texto nos campos: type, label, description.
   * Case-insensitive, busca parcial (contains).
   */
  search(query: string): ComponentDefinition[]

  // --- Metadados ---

  /**
   * Retorna estatísticas do registry.
   */
  stats(): RegistryStats

  /**
   * Retorna todas as categorias que têm pelo menos um componente registrado.
   */
  categories(): ComponentCategory[]

  /**
   * Retorna todos os contextos que têm pelo menos um componente registrado.
   */
  contexts(): BuilderContextType[]
}

// ============================================================
// STATS
// ============================================================

export interface RegistryStats {
  total: number
  byContext: Partial<Record<BuilderContextType, number>>
  byCategory: Partial<Record<ComponentCategory, number>>
  containers: number
  leafNodes: number
  registeredAt: string
}

// ============================================================
// IMPLEMENTATION
// ============================================================

class UnifiedRegistryImpl implements UnifiedRegistry {
  private readonly _store = new Map<string, ComponentDefinition>()
  private readonly _createdAt = new Date().toISOString()

  // ---- Registro ----

  register(definition: ComponentDefinition): void {
    this._validate(definition)

    if (this._store.has(definition.type)) {
      console.warn(
        `[UnifiedRegistry] Component type "${definition.type}" already registered — overwriting.`,
      )
    }

    // Freeze para evitar mutações acidentais após o registro
    const frozen = Object.freeze({ ...definition })
    this._store.set(definition.type, frozen)
  }

  registerAll(definitions: ComponentDefinition[]): void {
    const errors: string[] = []

    for (const def of definitions) {
      try {
        this.register(def)
      } catch (e) {
        errors.push((e as Error).message)
      }
    }

    if (errors.length > 0) {
      throw new Error(
        `[UnifiedRegistry] registerAll failed with ${errors.length} error(s):\n${errors.join('\n')}`,
      )
    }
  }

  unregister(type: string): boolean {
    return this._store.delete(type)
  }

  clear(): void {
    this._store.clear()
  }

  // ---- Busca ----

  lookup(type: string): ComponentLookupResult {
    const definition = this._store.get(type)
    if (definition) {
      return { found: true, definition }
    }
    return { found: false, type }
  }

  get(type: string): ComponentDefinition | undefined {
    return this._store.get(type)
  }

  has(type: string): boolean {
    return this._store.has(type)
  }

  // ---- Listagem ----

  listAll(): ComponentDefinition[] {
    return Array.from(this._store.values())
  }

  listByContext(context: BuilderContextType): ComponentDefinition[] {
    return this.listAll().filter((d) => d.contexts.includes(context))
  }

  listByCategory(category: ComponentCategory): ComponentDefinition[] {
    return this.listAll().filter((d) => d.category === category)
  }

  list(filter: ComponentListFilter): ComponentDefinition[] {
    let results = this.listAll()

    if (filter.context !== undefined) {
      results = results.filter((d) => d.contexts.includes(filter.context!))
    }

    if (filter.category !== undefined) {
      results = results.filter((d) => d.category === filter.category)
    }

    if (filter.isContainer !== undefined) {
      results = results.filter((d) => d.isContainer === filter.isContainer)
    }

    if (filter.search !== undefined && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase()
      results = results.filter((d) => this._matchesText(d, q))
    }

    return results
  }

  search(query: string): ComponentDefinition[] {
    if (!query.trim()) return this.listAll()
    const q = query.toLowerCase()
    return this.listAll().filter((d) => this._matchesText(d, q))
  }

  // ---- Metadados ----

  stats(): RegistryStats {
    const all = this.listAll()

    const byContext: Partial<Record<BuilderContextType, number>> = {}
    const byCategory: Partial<Record<ComponentCategory, number>> = {}

    for (const def of all) {
      for (const ctx of def.contexts) {
        byContext[ctx] = (byContext[ctx] ?? 0) + 1
      }
      byCategory[def.category] = (byCategory[def.category] ?? 0) + 1
    }

    return {
      total: all.length,
      byContext,
      byCategory,
      containers: all.filter((d) => d.isContainer).length,
      leafNodes: all.filter((d) => !d.isContainer).length,
      registeredAt: this._createdAt,
    }
  }

  categories(): ComponentCategory[] {
    const seen = new Set<ComponentCategory>()
    for (const def of this._store.values()) seen.add(def.category)
    return Array.from(seen)
  }

  contexts(): BuilderContextType[] {
    const seen = new Set<BuilderContextType>()
    for (const def of this._store.values()) {
      for (const ctx of def.contexts) seen.add(ctx)
    }
    return Array.from(seen)
  }

  // ---- Helpers privados ----

  private _validate(definition: ComponentDefinition): void {
    if (!definition.type || typeof definition.type !== 'string') {
      throw new TypeError('[UnifiedRegistry] ComponentDefinition.type must be a non-empty string')
    }
    if (!definition.component) {
      throw new TypeError(
        `[UnifiedRegistry] ComponentDefinition "${definition.type}" must have a component`,
      )
    }
    if (!definition.contexts || definition.contexts.length === 0) {
      throw new TypeError(
        `[UnifiedRegistry] ComponentDefinition "${definition.type}" must declare at least one context`,
      )
    }
  }

  private _matchesText(def: ComponentDefinition, lowerQuery: string): boolean {
    return (
      def.type.includes(lowerQuery) ||
      def.label.toLowerCase().includes(lowerQuery) ||
      (def.description?.toLowerCase().includes(lowerQuery) ?? false)
    )
  }
}

// ============================================================
// FACTORY
// ============================================================

/**
 * Cria uma nova instância isolada do UnifiedRegistry.
 *
 * Útil para:
 * - Testes (cada teste com registry limpo)
 * - Múltiplos contextos de aplicação isolados
 *
 * @example
 * ```typescript
 * const registry = createUnifiedRegistry()
 * registry.register(buttonDefinition)
 * ```
 */
export function createUnifiedRegistry(): UnifiedRegistry {
  return new UnifiedRegistryImpl()
}

// ============================================================
// DEFAULT INSTANCE (singleton da aplicação)
// ============================================================

/**
 * Instância global padrão do registry.
 * É esta instância que o LowCodeEngine e builders usam por padrão.
 *
 * Para registrar os componentes da lib, use o plugin Vue:
 * ```typescript
 * import { LugandPlugin } from '@lugand-sistemas-ltda/vue-ui-lib'
 * app.use(LugandPlugin)  // <— registra todos os componentes no defaultRegistry
 * ```
 *
 * Para registrar componentes customizados:
 * ```typescript
 * import { defaultRegistry } from '@lugand-sistemas-ltda/vue-ui-lib'
 * defaultRegistry.register(myComponentDefinition)
 * ```
 */
export const defaultRegistry: UnifiedRegistry = createUnifiedRegistry()
