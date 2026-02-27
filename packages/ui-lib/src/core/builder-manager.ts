/**
 * Builder Manager
 * 
 * Gerenciador global de instâncias de builders (form, page, doc).
 * Rastreia todas as instâncias ativas, permite salvar em batch, debug, etc.
 */

import type { BaseSchema } from './schema-builder'

/**
 * Tipos de builder suportados
 */
export type BuilderType = 'form' | 'page' | 'document'

/**
 * Instância de builder registrada
 */
export interface BuilderInstance {
  /** ID único da instância */
  id: string
  
  /** Tipo do builder */
  type: BuilderType
  
  /** Schema atual */
  schema: BaseSchema
  
  /** Se tem alterações não salvas */
  isDirty: boolean
  
  /** Timestamp de criação */
  createdAt: Date
  
  /** Timestamp de última atualização */
  updatedAt: Date
  
  /** Callback para salvar */
  save?: () => Promise<void>
  
  /** Metadata adicional */
  metadata?: Record<string, any>
}

/**
 * Gerenciador global de builders
 */
class BuilderManager {
  private instances = new Map<string, BuilderInstance>()
  private listeners: Array<(instances: BuilderInstance[]) => void> = []
  
  /**
   * Registra uma instância de builder
   */
  register(instance: BuilderInstance): void {
    this.instances.set(instance.id, instance)
    this.notify()
    
    if (import.meta.env.DEV) {
      console.log(`[BuilderManager] Registered ${instance.type} builder:`, instance.id)
    }
  }
  
  /**
   * Atualiza instância existente
   */
  update(id: string, updates: Partial<BuilderInstance>): void {
    const instance = this.instances.get(id)
    if (instance) {
      Object.assign(instance, updates, { updatedAt: new Date() })
      this.notify()
    }
  }
  
  /**
   * Remove uma instância
   */
  unregister(id: string): void {
    const instance = this.instances.get(id)
    if (instance) {
      this.instances.delete(id)
      this.notify()
      
      if (import.meta.env.DEV) {
        console.log(`[BuilderManager] Unregistered ${instance.type} builder:`, id)
      }
    }
  }
  
  /**
   * Obtém uma instância por ID
   */
  get(id: string): BuilderInstance | undefined {
    return this.instances.get(id)
  }
  
  /**
   * Lista todas as instâncias ativas
   */
  listActive(): BuilderInstance[] {
    return Array.from(this.instances.values())
  }
  
  /**
   * Busca instâncias por tipo
   */
  getByType(type: BuilderType): BuilderInstance[] {
    return this.listActive().filter(b => b.type === type)
  }
  
  /**
   * Busca instâncias dirty (não salvas)
   */
  getDirty(): BuilderInstance[] {
    return this.listActive().filter(b => b.isDirty)
  }
  
  /**
   * Checa se há instâncias dirty
   */
  hasDirty(): boolean {
    return this.getDirty().length > 0
  }
  
  /**
   * Salva todas as instâncias dirty
   */
  async saveAll(): Promise<void> {
    const dirty = this.getDirty()
    
    if (dirty.length === 0) {
      if (import.meta.env.DEV) {
        console.log('[BuilderManager] Nada para salvar')
      }
      return
    }
    
    if (import.meta.env.DEV) {
      console.log(`[BuilderManager] Salvando ${dirty.length} instância(s)...`)
    }
    
    const promises = dirty
      .filter(instance => typeof instance.save === 'function')
      .map(instance => instance.save!())
    
    await Promise.all(promises)
    
    if (import.meta.env.DEV) {
      console.log('[BuilderManager] Todas as instâncias salvas')
    }
  }
  
  /**
   * Limpa todas as instâncias
   */
  clear(): void {
    this.instances.clear()
    this.notify()
    
    if (import.meta.env.DEV) {
      console.log('[BuilderManager] Todas as instâncias removidas')
    }
  }
  
  /**
   * Conta instâncias por tipo
   */
  countByType(): Record<BuilderType, number> {
    const counts = {
      form: 0,
      page: 0,
      document: 0
    }
    
    this.listActive().forEach(instance => {
      counts[instance.type]++
    })
    
    return counts
  }
  
  /**
   * Exporta estado completo (debug)
   */
  exportState(): Record<string, any> {
    return Object.fromEntries(
      Array.from(this.instances.entries()).map(([id, instance]) => [
        id,
        {
          type: instance.type,
          schemaName: instance.schema.name,
          isDirty: instance.isDirty,
          itemCount: instance.schema.items?.length || 0,
          createdAt: instance.createdAt.toISOString(),
          updatedAt: instance.updatedAt.toISOString()
        }
      ])
    )
  }
  
  /**
   * Exporta estatísticas
   */
  getStats() {
    const instances = this.listActive()
    const counts = this.countByType()
    const dirty = this.getDirty()
    
    return {
      total: instances.length,
      byType: counts,
      dirty: dirty.length,
      dirtyIds: dirty.map(i => i.id)
    }
  }
  
  /**
   * Adiciona listener de mudanças
   */
  onChange(callback: (instances: BuilderInstance[]) => void): () => void {
    this.listeners.push(callback)
    
    // Retorna função para remover listener
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index !== -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
  
  /**
   * Notifica listeners de mudanças
   */
  private notify(): void {
    const instances = this.listActive()
    this.listeners.forEach(callback => callback(instances))
  }
}

/**
 * Instância singleton global
 */
export const builderManager = new BuilderManager()

/**
 * Hook para integração com Vue (opcional)
 */
export function useBuilderManager() {
  return builderManager
}

// Expor globalmente em dev mode
if (import.meta.env.DEV) {
  // @ts-ignore
  window.__BUILDER_MANAGER__ = builderManager
  console.log('[BuilderManager] Disponível em window.__BUILDER_MANAGER__')
}
