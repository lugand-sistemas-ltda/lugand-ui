/**
 * Utilitários para serialização/desserialização de schemas
 * 
 * Funções para exportar/importar schemas em JSON
 */

import type { BaseSchema } from './types'

/**
 * Serializar schema para JSON (formatado)
 * 
 * @param schema - Schema a ser serializado
 * @param pretty - Se true, formata com indentação (padrão: true)
 * @returns String JSON
 * 
 * @example
 * ```ts
 * const json = serializeSchema(mySchema)
 * console.log(json) // JSON formatado
 * ```
 */
export function serializeSchema<T extends BaseSchema>(
  schema: T,
  pretty = true
): string {
  if (pretty) {
    return JSON.stringify(schema, null, 2)
  }
  return JSON.stringify(schema)
}

/**
 * Desserializar JSON para schema
 * 
 * @param json - String JSON
 * @returns Schema parseado
 * @throws Error se JSON for inválido
 * 
 * @example
 * ```ts
 * const schema = deserializeSchema<MySchema>(jsonString)
 * ```
 */
export function deserializeSchema<T extends BaseSchema>(json: string): T {
  try {
    return JSON.parse(json)
  } catch (error) {
    throw new Error(`Erro ao parsear JSON: ${error instanceof Error ? error.message : 'Desconhecido'}`)
  }
}

/**
 * Clonar schema profundamente
 * 
 * @param schema - Schema a ser clonado
 * @returns Cópia profunda do schema
 * 
 * @example
 * ```ts
 * const copy = cloneSchema(original)
 * copy.name = 'Novo nome' // Não afeta o original
 * ```
 */
export function cloneSchema<T extends BaseSchema>(schema: T): T {
  return JSON.parse(JSON.stringify(schema))
}

/**
 * Validar estrutura básica de um schema
 * 
 * @param data - Dados a serem validados
 * @returns true se possui estrutura básica válida
 */
export function isValidSchemaStructure(data: any): data is BaseSchema {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.version === 'string' &&
    Array.isArray(data.items) &&
    typeof data.createdAt === 'string' &&
    typeof data.updatedAt === 'string'
  )
}

/**
 * Migrar schema de versão antiga para nova
 * 
 * @param schema - Schema a ser migrado
 * @param fromVersion - Versão atual do schema
 * @param toVersion - Versão alvo
 * @param migrations - Mapa de funções de migração
 * @returns Schema migrado
 * 
 * @example
 * ```ts
 * const migrations = {
 *   '1.0.0': (schema) => ({ ...schema, newField: 'default' })
 * }
 * const migrated = migrateSchema(oldSchema, '0.9.0', '1.0.0', migrations)
 * ```
 */
export function migrateSchema<T extends BaseSchema>(
  schema: T,
  fromVersion: string,
  toVersion: string,
  migrations: Record<string, (schema: any) => any>
): T {
  let migrated = cloneSchema(schema)
  
  // Aplicar migrações em sequência
  const versions = Object.keys(migrations).sort((a, b) => {
    return compareVersions(a, b)
  })
  
  for (const version of versions) {
    if (compareVersions(version, fromVersion) > 0 && compareVersions(version, toVersion) <= 0) {
      const migration = migrations[version]
      if (migration) {
        migrated = migration(migrated)
      }
    }
  }
  
  migrated.version = toVersion
  migrated.updatedAt = new Date().toISOString()
  
  return migrated
}

/**
 * Comparar versões semver
 * 
 * @param a - Primeira versão
 * @param b - Segunda versão
 * @returns -1 se a < b, 0 se a === b, 1 se a > b
 */
function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number)
  const bParts = b.split('.').map(Number)
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0
    const bPart = bParts[i] || 0
    
    if (aPart < bPart) return -1
    if (aPart > bPart) return 1
  }
  
  return 0
}

/**
 * Gerar ID único
 * 
 * @returns ID único baseado em timestamp + random
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Gerar timestamp ISO 8601
 * 
 * @returns String de data/hora atual
 */
export function generateTimestamp(): string {
  return new Date().toISOString()
}
