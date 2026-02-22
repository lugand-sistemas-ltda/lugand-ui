/**
 * validation-inferrer.ts
 * 
 * Inferência avançada de validações baseadas em JSDoc tags, decorators e convenções.
 * Extrai regras de validação de comentários, tipos e metadata TypeScript.
 * 
 * @module features/schema-inference/validation-inferrer
 * @created 2025-01-XX
 */

import type { FormField } from '../form-renderer/types'
import type { PropertyMetadata, InferenceConfig } from './types'

/**
 * Tags JSDoc reconhecidas para validação
 * 
 * @example
 * ```typescript
 * interface User {
 *   / ** @minLength 3 @maxLength 50 * /
 *   name: string
 *   
 *   / ** @min 18 @max 120 * /
 *   age: number
 *   
 *   / ** @pattern /^[A-Z]{2}\d{4}$/ * /
 *   code: string
 * }
 * ```
 */
export const VALIDATION_TAGS = {
  REQUIRED: '@required',
  MIN: '@min',
  MAX: '@max',
  MIN_LENGTH: '@minLength',
  MAX_LENGTH: '@maxLength',
  PATTERN: '@pattern',
  EMAIL: '@email',
  URL: '@url',
  CUSTOM: '@validate',
  MATCH: '@match', // Deve ser igual a outro campo
  UNIQUE: '@unique', // Validação no backend (apenas hint)
  ASYNC: '@async' // Validação assíncrona
} as const

/**
 * Padrões regex comuns para validação
 */
export const COMMON_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE_BR: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  CEP: /^\d{5}-?\d{3}$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  IPV4: /^(\d{1,3}\.){3}\d{1,3}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
} as const

/**
 * Infere validações avançadas de PropertyMetadata
 * 
 * @param property - Propriedade a analisar
 * @param config - Configuração de inferência (será usado para regras customizáveis)
 * @returns Array de validações inferidas
 */
export function inferAdvancedValidations(
  property: PropertyMetadata,
  // @ts-expect-error - config será usado para customizar regras de validação
  config: InferenceConfig
): NonNullable<FormField['validation']> {
  const validations: NonNullable<FormField['validation']> = []

  // 1. Extrair validações de JSDoc tags (se description contém tags)
  if (property.description) {
    const jsdocValidations = parseJSDocValidations(property.description)
    validations.push(...jsdocValidations)
  }

  // 2. Validações baseadas em nome de campo (convenções)
  const nameValidations = inferValidationsByName(property.name)
  validations.push(...nameValidations)

  // 3. Validações baseadas em tipo TypeScript
  const typeValidations = inferValidationsByType(property)
  validations.push(...typeValidations)

  // 4. Remover duplicatas (manter primeiro)
  const uniqueValidations = deduplicateValidations(validations)

  return uniqueValidations
}

/**
 * Extrai validações de tags JSDoc na description
 * 
 * @param description - Comentário JSDoc
 * @returns Validações extraídas
 * 
 * @example
 * parseJSDocValidations('@minLength 3 @maxLength 50 @pattern /^[A-Z]/')
 * // → [
 * //   { type: 'minLength', value: 3 },
 * //   { type: 'maxLength', value: 50 },
 * //   { type: 'pattern', value: /^[A-Z]/ }
 * // ]
 */
function parseJSDocValidations(description: string): NonNullable<FormField['validation']> {
  const validations: NonNullable<FormField['validation']> = []

  // @required
  if (description.includes(VALIDATION_TAGS.REQUIRED)) {
    validations.push({
      type: 'required',
      message: 'Campo obrigatório'
    })
  }

  // @min <number>
  const minMatch = description.match(/@min\s+(\d+)/)
  if (minMatch) {
    validations.push({
      type: 'min',
      value: Number(minMatch[1]),
      message: `Valor mínimo: ${minMatch[1]}`
    })
  }

  // @max <number>
  const maxMatch = description.match(/@max\s+(\d+)/)
  if (maxMatch) {
    validations.push({
      type: 'max',
      value: Number(maxMatch[1]),
      message: `Valor máximo: ${maxMatch[1]}`
    })
  }

  // @minLength <number>
  const minLengthMatch = description.match(/@minLength\s+(\d+)/)
  if (minLengthMatch) {
    validations.push({
      type: 'minLength',
      value: Number(minLengthMatch[1]),
      message: `Mínimo ${minLengthMatch[1]} caracteres`
    })
  }

  // @maxLength <number>
  const maxLengthMatch = description.match(/@maxLength\s+(\d+)/)
  if (maxLengthMatch) {
    validations.push({
      type: 'maxLength',
      value: Number(maxLengthMatch[1]),
      message: `Máximo ${maxLengthMatch[1]} caracteres`
    })
  }

  // @pattern /regex/
  const patternMatch = description.match(/@pattern\s+\/(.+?)\//)
  if (patternMatch && patternMatch[1]) {
    validations.push({
      type: 'pattern',
      value: new RegExp(patternMatch[1]),
      message: 'Formato inválido'
    })
  }

  // @email
  if (description.includes(VALIDATION_TAGS.EMAIL)) {
    validations.push({
      type: 'email',
      message: 'Email inválido'
    })
  }

  // @url
  if (description.includes(VALIDATION_TAGS.URL)) {
    validations.push({
      type: 'pattern',
      value: COMMON_PATTERNS.URL,
      message: 'URL inválida'
    })
  }

  return validations
}

/**
 * Infere validações baseadas em convenções de nome
 * 
 * @param fieldName - Nome do campo
 * @returns Validações inferidas
 */
function inferValidationsByName(fieldName: string): NonNullable<FormField['validation']> {
  const validations: NonNullable<FormField['validation']> = []
  const name = fieldName.toLowerCase()

  // Email
  if (name.includes('email')) {
    validations.push({
      type: 'email',
      message: 'Email inválido'
    })
  }

  // URL
  if (name.includes('url') || name.includes('website') || name.includes('link')) {
    validations.push({
      type: 'pattern',
      value: COMMON_PATTERNS.URL,
      message: 'URL inválida'
    })
  }

  // Telefone
  if (name.includes('phone') || name.includes('tel') || name.includes('telefone')) {
    validations.push({
      type: 'pattern',
      value: COMMON_PATTERNS.PHONE_BR,
      message: 'Telefone inválido'
    })
  }

  // CPF
  if (name.includes('cpf')) {
    validations.push({
      type: 'pattern',
      value: COMMON_PATTERNS.CPF,
      message: 'CPF inválido'
    })
  }

  // CNPJ
  if (name.includes('cnpj')) {
    validations.push({
      type: 'pattern',
      value: COMMON_PATTERNS.CNPJ,
      message: 'CNPJ inválido'
    })
  }

  // CEP
  if (name.includes('cep') || name.includes('zipcode')) {
    validations.push({
      type: 'pattern',
      value: COMMON_PATTERNS.CEP,
      message: 'CEP inválido'
    })
  }

  // Color
  if (name.includes('color') || name.includes('cor')) {
    validations.push({
      type: 'pattern',
      value: COMMON_PATTERNS.HEX_COLOR,
      message: 'Cor inválida (use #RRGGBB)'
    })
  }

  // Slug
  if (name.includes('slug')) {
    validations.push({
      type: 'pattern',
      value: COMMON_PATTERNS.SLUG,
      message: 'Slug inválido (use apenas letras minúsculas, números e hífens)'
    })
  }

  // Username
  if (name.includes('username') || name === 'user') {
    validations.push({
      type: 'pattern',
      value: COMMON_PATTERNS.USERNAME,
      message: 'Username inválido (3-20 caracteres, apenas letras, números e _)'
    })
  }

  // Password (senha forte)
  if (name.includes('password') || name.includes('senha')) {
    validations.push({
      type: 'minLength',
      value: 8,
      message: 'Senha deve ter no mínimo 8 caracteres'
    })
    // Opcional: validar senha forte
    if (name.includes('strong') || name.includes('forte')) {
      validations.push({
        type: 'pattern',
        value: COMMON_PATTERNS.PASSWORD_STRONG,
        message: 'Senha deve conter maiúscula, minúscula, número e caractere especial'
      })
    }
  }

  return validations
}

/**
 * Infere validações baseadas no tipo TypeScript
 * 
 * @param property - Propriedade
 * @returns Validações inferidas
 */
function inferValidationsByType(property: PropertyMetadata): NonNullable<FormField['validation']> {
  const validations: NonNullable<FormField['validation']> = []

  // Required (se não é optional e não é nullable)
  if (!property.optional && !property.nullable) {
    validations.push({
      type: 'required',
      message: 'Campo obrigatório'
    })
  }

  // Number: adicionar validação de tipo
  if (property.type === 'number') {
    // TypeScript já garante type safety, mas podemos adicionar hints para UX
    // Ex: max safe integer
    validations.push({
      type: 'max',
      value: Number.MAX_SAFE_INTEGER,
      message: 'Número muito grande'
    })
  }

  // Enum/Union: validar se valor está nas possibleValues
  if (property.possibleValues && property.possibleValues.length > 0) {
    // FormRenderer já lida com isso via options
    // Não precisa adicionar validação extra
  }

  // Array: min/max items (se houver metadata futura)
  if (property.type === 'array') {
    // TODO: adicionar minItems/maxItems quando PropertyMetadata suportar
  }

  return validations
}

/**
 * Remove validações duplicadas, mantendo a primeira ocorrência
 * 
 * @param validations - Array de validações
 * @returns Array sem duplicatas
 */
function deduplicateValidations(
  validations: NonNullable<FormField['validation']>
): NonNullable<FormField['validation']> {
  const seen = new Set<string>()
  const unique: NonNullable<FormField['validation']> = []

  for (const validation of validations) {
    // Criar chave única baseada no tipo
    const key = `${validation.type}-${validation.value?.toString() || ''}`

    if (!seen.has(key)) {
      seen.add(key)
      unique.push(validation)
    }
  }

  return unique
}

/**
 * Cria validação customizada a partir de função
 * 
 * @param validator - Função de validação
 * @param message - Mensagem de erro
 * @returns Validação customizada
 * 
 * @example
 * const validation = createCustomValidation(
 *   (value) => value !== 'admin',
 *   'Username "admin" é reservado'
 * )
 */
export function createCustomValidation(
  validator: (value: unknown) => boolean | Promise<boolean>,
  message: string
): NonNullable<FormField['validation']>[number] {
  return {
    type: 'custom',
    validator,
    message
  }
}

/**
 * Cria validação de match (campo deve ser igual a outro)
 * 
 * @param fieldName - Nome do campo a comparar
 * @param message - Mensagem de erro
 * @returns Validação de match
 * 
 * @example
 * // Campo passwordConfirm deve ser igual a password
 * const validation = createMatchValidation('password', 'Senhas não conferem')
 */
export function createMatchValidation(
  fieldName: string,
  message: string
): NonNullable<FormField['validation']>[number] {
  return {
    type: 'custom',
    validator: (value: unknown, formData?: Record<string, unknown>) => {
      if (!formData) return true
      return value === formData[fieldName]
    },
    message
  }
}
