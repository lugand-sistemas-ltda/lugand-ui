/**
 * dto-analyzer.ts
 * 
 * Parser que analisa código TypeScript (interfaces, types, classes)
 * e extrai DTOMetadata completo para inferência de schemas.
 * 
 * Usa regex simples para parsing (zero deps). Em produção, considerar
 * usar TypeScript Compiler API ou ts-morph para análise robusta.
 * 
 * @module features/schema-inference/dto-analyzer
 * @created 2025-01-XX
 */

import type { DTOMetadata, PropertyMetadata, PrimitiveType, ComplexType } from './types'

/**
 * Resultado da análise de código TypeScript
 */
export interface AnalysisResult {
  /** DTOs encontrados */
  dtos: DTOMetadata[]
  /** Erros durante parsing */
  errors: string[]
  /** Warnings (ex: tipos complexos não suportados) */
  warnings: string[]
}

/**
 * Analisa código TypeScript e extrai DTOMetadata
 * 
 * @param sourceCode - Código TypeScript (.ts ou .vue <script lang="ts">)
 * @param options - Opções de análise
 * @returns DTOs extraídos com erros/warnings
 * 
 * @example
 * const code = `
 *   interface User {
 *     / ** User email * /
 *     email: string
 *     age?: number
 *   }
 * `
 * 
 * const result = analyzeTypeScriptCode(code)
 * // result.dtos[0] = {
 * //   name: 'User',
 * //   kind: 'interface',
 * //   properties: [
 * //     { name: 'email', type: 'string', optional: false, description: 'User email' },
 * //     { name: 'age', type: 'number', optional: true }
 * //   ]
 * // }
 */
export function analyzeTypeScriptCode(
  sourceCode: string,
  options: {
    /** Tipos a analisar (default: ['interface', 'type', 'class']) */
    kinds?: Array<'interface' | 'type' | 'class'>
    /** Ignorar tipos que começam com _ */
    ignorePrivate?: boolean
  } = {}
): AnalysisResult {
  const { kinds = ['interface', 'type', 'class'], ignorePrivate = true } = options
  const dtos: DTOMetadata[] = []
  const errors: string[] = []
  const warnings: string[] = []

  // Remover comentários de bloco para evitar falsos positivos
  // (mantém JSDoc para extrair descriptions)
  const codeWithoutComments = removeNonJSDocComments(sourceCode)

  // 1. Extrair interfaces
  if (kinds.includes('interface')) {
    const interfaces = extractInterfaces(codeWithoutComments)
    dtos.push(...interfaces)
  }

  // 2. Extrair types
  if (kinds.includes('type')) {
    const types = extractTypes(codeWithoutComments)
    dtos.push(...types)
  }

  // 3. Extrair classes
  if (kinds.includes('class')) {
    const classes = extractClasses(codeWithoutComments)
    dtos.push(...classes)
  }

  // 4. Filtrar privados
  const filteredDtos = ignorePrivate
    ? dtos.filter(dto => !dto.name.startsWith('_'))
    : dtos

  return {
    dtos: filteredDtos,
    errors,
    warnings
  }
}

/**
 * Remove comentários não-JSDoc (// e /* sem **)
 */
function removeNonJSDocComments(code: string): string {
  // Remove single-line comments
  let result = code.replace(/\/\/.*$/gm, '')

  // Remove multi-line comments (mas não JSDoc /** */)
  result = result.replace(/\/\*(?!\*)[\s\S]*?\*\//g, '')

  return result
}

/**
 * Extrai interfaces do código
 */
function extractInterfaces(code: string): DTOMetadata[] {
  const interfaces: DTOMetadata[] = []

  // Regex: interface Name { ... }
  const interfaceRegex = /interface\s+(\w+)(?:\s+extends\s+([\w\s,]+))?\s*\{([^}]*)\}/g

  let match: RegExpExecArray | null
  while ((match = interfaceRegex.exec(code)) !== null) {
    const [, name, extendsClause, body] = match

    // Skip if missing critical parts
    if (!name || !body) continue

    const dto: DTOMetadata = {
      name,
      kind: 'interface',
      properties: extractProperties(body),
      extends: extendsClause?.split(',').map(e => e.trim())
    }

    interfaces.push(dto)
  }

  return interfaces
}

/**
 * Extrai types do código
 */
function extractTypes(code: string): DTOMetadata[] {
  const types: DTOMetadata[] = []

  // Regex: type Name = { ... }
  const typeRegex = /type\s+(\w+)\s*=\s*\{([^}]*)\}/g

  let match: RegExpExecArray | null
  while ((match = typeRegex.exec(code)) !== null) {
    const [, name, body] = match

    // Skip if missing critical parts
    if (!name || !body) continue

    const dto: DTOMetadata = {
      name,
      kind: 'type',
      properties: extractProperties(body)
    }

    types.push(dto)
  }

  return types
}

/**
 * Extrai classes do código
 */
function extractClasses(code: string): DTOMetadata[] {
  const classes: DTOMetadata[] = []

  // Regex: class Name { ... }
  const classRegex = /class\s+(\w+)(?:\s+extends\s+([\w\s,]+))?\s*\{([^}]*)\}/g

  let match: RegExpExecArray | null
  while ((match = classRegex.exec(code)) !== null) {
    const [, name, extendsClause, body] = match

    // Skip if missing critical parts
    if (!name || !body) continue

    // Extrair propriedades públicas (ignora métodos)
    const properties = extractClassProperties(body)

    const dto: DTOMetadata = {
      name,
      kind: 'class',
      properties,
      extends: extendsClause?.split(',').map(e => e.trim())
    }

    classes.push(dto)
  }

  return classes
}

/**
 * Extrai propriedades de interface/type body
 */
function extractProperties(body: string): PropertyMetadata[] {
  const properties: PropertyMetadata[] = []

  // Regex: propertyName?: Type | Type
  // Captura: (JSDoc?) (name) (optional?) : (type) (default?)
  const lines = body.split('\n')

  let currentJSDoc = ''

  for (const line of lines) {
    const trimmed = line.trim()

    // Detectar JSDoc
    if (trimmed.startsWith('/**')) {
      currentJSDoc = trimmed
      continue
    }
    if (currentJSDoc && !trimmed.startsWith('*/')) {
      currentJSDoc += ' ' + trimmed
      continue
    }
    if (currentJSDoc && trimmed.startsWith('*/')) {
      currentJSDoc += ' ' + trimmed
    }

    // Detectar propriedade
    const propMatch = trimmed.match(/^(\w+)(\?)?:\s*([^;=]+)(?:\s*=\s*(.+))?/)
    if (propMatch) {
      const [, name, optional, typeStr, _defaultValue] = propMatch

      // Skip if missing name or type
      if (!name || !typeStr) {
        currentJSDoc = ''
        continue
      }

      const property: PropertyMetadata = {
        name,
        type: parseTypeString(typeStr.trim()) as PrimitiveType | ComplexType,
        rawType: typeStr.trim(),
        optional: !!optional,
        readonly: line.trim().startsWith('readonly'),
        nullable: typeStr.includes('null'),
        description: extractJSDocDescription(currentJSDoc)
      }

      // Possible values (se enum/union)
      if (typeStr.includes('|')) {
        property.possibleValues = extractUnionValues(typeStr)
      }

      // Array type
      if (typeStr.includes('[]') || typeStr.includes('Array<')) {
        property.arrayType = extractArrayType(typeStr)
      }

      properties.push(property)
      currentJSDoc = ''
    }
  }

  return properties
}

/**
 * Extrai propriedades de classe (ignora métodos)
 */
function extractClassProperties(body: string): PropertyMetadata[] {
  const properties: PropertyMetadata[] = []

  const lines = body.split('\n')

  let currentJSDoc = ''

  for (const line of lines) {
    const trimmed = line.trim()

    // JSDoc
    if (trimmed.startsWith('/**')) {
      currentJSDoc = trimmed
      continue
    }
    if (currentJSDoc && !trimmed.startsWith('*/')) {
      currentJSDoc += ' ' + trimmed
      continue
    }
    if (currentJSDoc && trimmed.startsWith('*/')) {
      currentJSDoc += ' ' + trimmed
    }

    // Detectar propriedade (não método)
    // Ex: public name: string = 'default'
    //     private _id?: number
    const propMatch = trimmed.match(/^(?:public|private|protected)?\s*(\w+)(\?)?:\s*([^;=\(]+)(?:\s*=\s*(.+))?/)
    if (propMatch && !trimmed.includes('(')) {
      const [, name, optional, typeStr, _defaultValue] = propMatch

      // Ignorar propriedades privadas/protegidas
      // Skip private/internal fields
      if (name?.startsWith('_')) continue

      // Skip if missing critical parts
      if (!name || !typeStr) {
        currentJSDoc = ''
        continue
      }

      const property: PropertyMetadata = {
        name,
        type: parseTypeString(typeStr.trim()) as PrimitiveType | ComplexType,
        rawType: typeStr.trim(),
        optional: !!optional,
        readonly: line.trim().startsWith('readonly'),
        nullable: typeStr.includes('null'),
        description: extractJSDocDescription(currentJSDoc)
      }

      if (typeStr.includes('|')) {
        property.possibleValues = extractUnionValues(typeStr)
      }

      if (typeStr.includes('[]') || typeStr.includes('Array<')) {
        property.arrayType = extractArrayType(typeStr)
      }

      properties.push(property)
      currentJSDoc = ''
    }
  }

  return properties
}

/**
 * Parseia string de tipo TypeScript para PrimitiveType ou string
 */
function parseTypeString(typeStr: string): PrimitiveType | ComplexType | string {
  const normalized = typeStr.trim().toLowerCase()

  // Tipos primitivos
  if (normalized === 'string') return 'string'
  if (normalized === 'number') return 'number'
  if (normalized === 'boolean') return 'boolean'
  if (normalized === 'date') return 'Date'
  if (normalized === 'any') return 'any'
  if (normalized === 'unknown') return 'unknown'
  if (normalized === 'null') return 'null'
  if (normalized === 'undefined') return 'undefined'

  // Array
  if (normalized.endsWith('[]') || normalized.startsWith('array<')) {
    return 'array'
  }

  // Union
  if (typeStr.includes('|')) {
    return 'union'
  }

  // Object
  if (typeStr.startsWith('{')) {
    return 'object'
  }

  // Default: retornar como string (pode ser enum, interface, etc)
  return typeStr.trim()
}

/**
 * Extrai description de JSDoc
 */
function extractJSDocDescription(jsdoc: string): string | undefined {
  if (!jsdoc) return undefined

  // Remove /** */ e extrai primeira linha
  const cleaned = jsdoc
    .replace(/\/\*\*|\*\//g, '')
    .replace(/\*/g, '')
    .trim()

  // Primeira linha antes de @tag
  const firstLine = cleaned.split('@')[0]?.trim()

  return firstLine || undefined
}

/**
 * Parseia valor default (não usado atualmente)
 */
// @ts-expect-error - Função preparada para parsing de valores default (feature futura)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseDefaultValue(value: string): string | number | boolean | null {
  if (value === 'null') return null
  if (value === 'true') return true
  if (value === 'false') return false
  if (!isNaN(Number(value))) return Number(value)

  // String: remover quotes
  return value.replace(/['"]/g, '')
}

/**
 * Extrai valores de union type
 * 
 * @example
 * extractUnionValues('string | number') → undefined (tipos, não valores)
 * extractUnionValues('"admin" | "user" | "guest"') → ['admin', 'user', 'guest']
 */
function extractUnionValues(typeStr: string): Array<string | number | boolean> | undefined {
  const parts = typeStr.split('|').map(p => p.trim())

  // Se todos são literais (entre aspas ou números), extrair valores
  const literals: Array<string | number | boolean> = []

  for (const part of parts) {
    // String literal
    if (part.startsWith('"') || part.startsWith("'")) {
      literals.push(part.replace(/['"]/g, ''))
    }
    // Number literal
    else if (!isNaN(Number(part))) {
      literals.push(Number(part))
    }
    // Boolean literal
    else if (part === 'true' || part === 'false') {
      literals.push(part === 'true')
    }
    // Se encontrar tipo (não literal), retornar undefined
    else {
      return undefined
    }
  }

  return literals.length > 0 ? literals : undefined
}

/**
 * Extrai tipo do array
 * 
 * @example
 * extractArrayType('string[]') → 'string'
 * extractArrayType('Array<User>') → 'User'
 */
function extractArrayType(typeStr: string): PrimitiveType | string | undefined {
  // string[]
  if (typeStr.endsWith('[]')) {
    return parseTypeString(typeStr.replace('[]', ''))
  }

  // Array<Type>
  const match = typeStr.match(/Array<(.+)>/)
  if (match && match[1]) {
    return parseTypeString(match[1])
  }

  return undefined
}

/**
 * Analisa arquivo .vue e extrai DTOs do <script lang="ts">
 */
export function analyzeVueFile(vueContent: string): AnalysisResult {
  // Extrair apenas o conteúdo do <script>
  const scriptMatch = vueContent.match(/<script[^>]*>([\s\S]*?)<\/script>/)

  if (!scriptMatch || !scriptMatch[1]) {
    return {
      dtos: [],
      errors: ['No <script> tag found in .vue file'],
      warnings: []
    }
  }

  const scriptContent = scriptMatch[1]
  return analyzeTypeScriptCode(scriptContent)
}

/**
 * Busca DTO por nome
 */
export function findDTOByName(dtos: DTOMetadata[], name: string): DTOMetadata | undefined {
  return dtos.find(dto => dto.name === name)
}
