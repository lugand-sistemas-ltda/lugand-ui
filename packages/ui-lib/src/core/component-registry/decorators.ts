/**
 * Component Registry Decorators
 * 
 * Helpers para facilitar registro de componentes.
 * Permite usar decorator @Registrable ou função withMetadata().
 * 
 * Nota: TypeScript decorators são experimentais.
 * Por isso fornecemos também a função withMetadata() como alternativa.
 * 
 * @module core/component-registry
 */

import type { Component } from 'vue'
import type { ComponentMetadata } from './types'
import { registerComponent } from './registry'

/**
 * Symbol para armazenar metadata no componente.
 * @internal
 */
const COMPONENT_METADATA_KEY = Symbol('component-metadata')

/**
 * Adiciona metadata a um componente Vue.
 * Alternativa ao decorator para quem não usa decorators.
 * 
 * @param component - Componente Vue
 * @param metadata - Metadata do componente
 * @returns Componente com metadata anexada
 * 
 * @example
 * ```typescript
 * import MyCard from './MyCard.vue'
 * 
 * export default withMetadata(MyCard, {
 *   name: 'my-card',
 *   label: 'My Custom Card',
 *   category: 'data-display',
 *   props: [
 *     { name: 'title', label: 'Title', type: 'string' }
 *   ]
 * })
 * ```
 */
export function withMetadata<T extends Component>(
  component: T,
  metadata: ComponentMetadata
): T {
  // Anexa metadata ao componente
  ; (component as any)[COMPONENT_METADATA_KEY] = metadata

  // Auto-registra se não estiver em modo build
  if (typeof window !== 'undefined' && import.meta.env?.DEV) {
    registerComponent(component, metadata)
  }

  return component
}

/**
 * Extrai metadata de um componente (se presente).
 * 
 * @param component - Componente Vue
 * @returns Metadata ou undefined
 */
export function getComponentMetadata(component: Component): ComponentMetadata | undefined {
  return (component as any)[COMPONENT_METADATA_KEY]
}

/**
 * Verifica se um componente tem metadata anexada.
 * 
 * @param component - Componente Vue
 * @returns true se tem metadata
 */
export function hasComponentMetadata(component: Component): boolean {
  return COMPONENT_METADATA_KEY in (component as any)
}

/**
 * Decorator para marcar componente como registrável.
 * 
 * ⚠️ EXPERIMENTAL: Requer experimentalDecorators: true no tsconfig.json
 * 
 * @param metadata - Metadata do componente
 * 
 * @example
 * ```typescript
 * @Registrable({
 *   name: 'my-card',
 *   label: 'My Custom Card',
 *   category: 'data-display'
 * })
 * export default class MyCard extends Vue {
 *   // ...
 * }
 * ```
 */
export function Registrable(metadata: ComponentMetadata) {
  return function <T extends { new(...args: any[]): any }>(target: T) {
    // Anexa metadata à classe
    ; (target as any)[COMPONENT_METADATA_KEY] = metadata

    // Auto-registra em dev mode
    if (typeof window !== 'undefined' && import.meta.env?.DEV) {
      registerComponent(target as any, metadata)
    }

    return target
  }
}

/**
 * Helper para criar metadata de forma type-safe.
 * 
 * @param metadata - Metadata parcial
 * @returns Metadata completa
 * 
 * @example
 * ```typescript
 * const metadata = defineComponentMetadata({
 *   name: 'my-card',
 *   label: 'My Card',
 *   category: 'data-display',
 *   props: [
 *     { name: 'title', label: 'Title', type: 'string', required: true }
 *   ]
 * })
 * ```
 */
export function defineComponentMetadata(
  metadata: ComponentMetadata
): ComponentMetadata {
  return metadata
}

/**
 * Auto-discovery: varre um objeto e registra todos os componentes com metadata.
 * Útil para registrar múltiplos componentes de uma vez.
 * 
 * @param components - Objeto com componentes (ex: import.meta.glob)
 * 
 * @example
 * ```typescript
 * // Registra todos os componentes de uma pasta
 * const components = import.meta.glob('./components/*.vue', { eager: true })
 * autoRegisterComponents(components)
 * ```
 */
export function autoRegisterComponents(
  components: Record<string, any>
): void {
  Object.values(components).forEach((module) => {
    const component = module.default || module

    if (hasComponentMetadata(component)) {
      const metadata = getComponentMetadata(component)!
      registerComponent(component, metadata)
    }
  })
}

/**
 * Cria um plugin Vue para auto-registro.
 * Registra componentes globalmente no app.
 * 
 * @param components - Array de [component, metadata]
 * @returns Plugin Vue
 * 
 * @example
 * ```typescript
 * import { createApp } from 'vue'
 * import { createComponentRegistryPlugin } from '@lugand/ui-lib'
 * import MyCard from './MyCard.vue'
 * 
 * const app = createApp(App)
 * 
 * app.use(createComponentRegistryPlugin([
 *   [MyCard, { name: 'my-card', label: 'My Card', category: 'data-display' }]
 * ]))
 * ```
 */
export function createComponentRegistryPlugin(
  components: Array<[Component, ComponentMetadata]>
) {
  return {
    install(app: any) {
      components.forEach(([component, metadata]) => {
        // Registra no Component Registry
        registerComponent(component, metadata)

        // Registra globalmente no Vue
        app.component(metadata.name, component)

        console.info(
          `[Component Registry Plugin] Registered ${metadata.name} globally`
        )
      })
    }
  }
}

/**
 * Valida metadata de componente.
 * Verifica se todas as propriedades obrigatórias estão presentes.
 * 
 * @param metadata - Metadata a validar
 * @returns Objeto com resultado da validação
 */
export function validateComponentMetadata(metadata: ComponentMetadata): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!metadata.name) {
    errors.push('Component metadata must have a name')
  }

  if (!metadata.label) {
    errors.push('Component metadata must have a label')
  }

  if (!metadata.category) {
    errors.push('Component metadata must have a category')
  }

  // Valida props (se presentes)
  if (metadata.props) {
    metadata.props.forEach((prop, index) => {
      if (!prop.name) {
        errors.push(`Prop at index ${index} must have a name`)
      }

      if (!prop.label) {
        errors.push(`Prop "${prop.name}" must have a label`)
      }

      if (!prop.type) {
        errors.push(`Prop "${prop.name}" must have a type`)
      }

      // Valida options (para select/multiselect)
      if (['select', 'multiselect'].includes(prop.type) && !prop.options) {
        errors.push(`Prop "${prop.name}" of type ${prop.type} must have options`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
