/**
 * field-inferrer.ts
 * 
 * Motor de inferência que transforma PropertyMetadata em FormField completo.
 * Aplica regras de mapeamento de tipos, gera labels/placeholders, detecta validações.
 * 
 * @module features/schema-inference/field-inferrer
 * @created 2025-01-XX
 */

import type { FormField } from '../form-renderer/types'
import type {
  PropertyMetadata,
  InferenceConfig,
  InferenceContext
  // TypeMappingRule - Usado em type-mappings.ts, re-exportado para conveniência
} from './types'
import { getFieldTypeFromProperty, detectFieldTypeFromName } from './type-mappings'

/**
 * Resultado da inferência de um campo
 */
export interface InferredFieldResult {
  /** Campo FormField gerado */
  field: FormField
  /** Nível de confiança (0-1) */
  confidence: number
  /** Avisos durante a inferência */
  warnings: string[]
  /** Metadata usada para geração */
  sourceProperty: PropertyMetadata
}

/**
 * Transforma PropertyMetadata em FormField completo
 * 
 * @param property - Propriedade do DTO/interface
 * @param context - Contexto de inferência
 * @returns Campo FormField inferido com confiança e warnings
 * 
 * @example
 * const prop: PropertyMetadata = {
 *   name: 'email',
 *   type: 'string',
 *   optional: false,
 *   description: 'User email address'
 * }
 * 
 * const result = inferFormField(prop, context)
 * // result.field = {
 * //   name: 'email',
 * //   label: 'Email',
 * //   type: 'email',
 * //   required: true,
 * //   validations: [{ type: 'email' }, { type: 'required' }]
 * // }
 */
export function inferFormField(
  property: PropertyMetadata,
  context: InferenceContext
): InferredFieldResult {
  const warnings: string[] = []
  const config = context.config

  // 1. Inferir tipo do campo (text, email, number, etc)
  const typeInference = inferFieldType(property, config)

  // 2. Gerar label
  const label = generateLabel(property, config)

  // 3. Gerar placeholder
  const placeholder = generatePlaceholder(property, config)

  // 4. Detectar se é required
  const required = !property.optional && !property.nullable

  // 5. Gerar options (se select/radio)
  const options = generateOptions(property, typeInference.fieldType)

  // 6. Construir FormField base
  const field: FormField = {
    name: property.name,
    label,
    type: typeInference.fieldType,
    required,
    ...(placeholder && { placeholder }),
    ...(options && { options })
  }

  // 7. Aplicar validations (se generateValidations = true)
  if (config.generateValidations) {
    field.validation = inferValidations(property, typeInference.fieldType, config)
  }

  // 8. Aplicar customizações via hooks (remover context.hooks)
  let finalField = field

  // 9. Calcular confiança geral
  let confidence = typeInference.confidence

  // Reduz confiança se tipo genérico (text, textarea)
  if (typeInference.fieldType === 'text' || typeInference.fieldType === 'textarea') {
    confidence *= 0.8
  }

  // Aumenta confiança se tem possibleValues
  if (property.possibleValues && property.possibleValues.length > 0) {
    confidence = Math.min(1.0, confidence + 0.1)
  }

  return {
    field: finalField,
    confidence,
    warnings,
    sourceProperty: property
  }
}

/**
 * Infere o tipo de campo (FieldType) baseado no tipo TypeScript
 * 
 * @param property - Propriedade a analisar
 * @param config - Configuração de inferência
 * @returns Tipo inferido com confiança
 */
function inferFieldType(
  property: PropertyMetadata,
  config: InferenceConfig
): { fieldType: FormField['type']; confidence: number } {
  // 1. Aplicar mapeamentos customizados (maior prioridade)
  if (config.typeMappings) {
    const result = getFieldTypeFromProperty(property, config.typeMappings)
    if (result) return result
  }

  // 2. Detectar por nome do campo (email, password, etc)
  const nameDetection = detectFieldTypeFromName(property.name)
  if (nameDetection) {
    return { fieldType: nameDetection as FormField['type'], confidence: 0.85 }
  }

  // 3. Aplicar mapeamentos padrão
  const defaultMapping = getFieldTypeFromProperty(property)
  if (defaultMapping) return defaultMapping

  // 4. Fallback genérico
  return { fieldType: 'text' as FormField['type'], confidence: 0.5 }
}

/**
 * Gera label legível a partir do nome da propriedade
 * 
 * @param property - Propriedade
 * @param config - Configuração
 * @returns Label formatado
 * 
 * @example
 * generateLabel({ name: 'firstName' }) // → "First Name"
 * generateLabel({ name: 'email' })     // → "Email"
 * generateLabel({ name: 'user_id' })   // → "User Id"
 */
function generateLabel(property: PropertyMetadata, config: InferenceConfig): string {
  if (!config.generateLabels) {
    return property.name
  }

  // Se property tem description, pode usar como base
  let label = property.name

  // Transformações:
  // camelCase → Title Case
  // snake_case → Title Case
  // kebab-case → Title Case

  label = label
    // Separar camelCase: firstName → first Name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Separar snake_case: user_id → user id
    .replace(/_/g, ' ')
    // Separar kebab-case: first-name → first name
    .replace(/-/g, ' ')
    // Title Case: first name → First Name
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim()

  // Aplicar labelTransform customizada
  if (config.labelTransform) {
    label = config.labelTransform(property.name)
  }

  return label
}

/**
 * Gera placeholder dinâmico baseado no tipo e nome
 * 
 * @param property - Propriedade
 * @param config - Configuração
 * @returns Placeholder sugerido ou undefined
 */
function generatePlaceholder(
  property: PropertyMetadata,
  config: InferenceConfig
): string | undefined {
  if (!config.generatePlaceholders) {
    return undefined
  }

  const name = property.name.toLowerCase()

  // Placeholders comuns por padrão de nome
  const placeholderMap: Record<string, string> = {
    email: 'exemplo@email.com',
    password: '••••••••',
    phone: '(11) 99999-9999',
    tel: '(11) 99999-9999',
    url: 'https://exemplo.com',
    website: 'https://exemplo.com',
    color: '#000000',
    date: 'DD/MM/AAAA',
    time: 'HH:MM',
    search: 'Buscar...',
    name: 'Digite o nome',
    firstname: 'Digite o primeiro nome',
    lastname: 'Digite o sobrenome',
    username: 'Digite o nome de usuário',
    address: 'Digite o endereço',
    city: 'Digite a cidade',
    state: 'Digite o estado',
    zipcode: 'Digite o CEP',
    cep: 'Digite o CEP',
    cpf: 'Digite o CPF',
    cnpj: 'Digite o CNPJ'
  }

  for (const [key, placeholder] of Object.entries(placeholderMap)) {
    if (name.includes(key)) {
      return placeholder
    }
  }

  // Placeholder genérico baseado no label
  const label = generateLabel(property, config)
  return `Digite ${label.toLowerCase()}`
}

/**
 * Gera opções para campos select/radio baseado em possibleValues
 * 
 * @param property - Propriedade com possibleValues
 * @param fieldType - Tipo do campo (select/radio)
 * @returns Array de opções ou undefined
 */
function generateOptions(
  property: PropertyMetadata,
  fieldType: FormField['type']
): Array<{ label: string; value: string | number | boolean }> | undefined {
  // Só gera options para select/radio/checkbox-group
  if (!['select', 'radio'].includes(fieldType)) {
    return undefined
  }

  if (!property.possibleValues || property.possibleValues.length === 0) {
    return undefined
  }

  return property.possibleValues.map(value => ({
    label: String(value),
    value
  }))
}

/**
 * Infere validações baseadas no tipo TypeScript
 * 
 * @param property - Propriedade
 * @param fieldType - Tipo do campo inferido
 * @param config - Configuração
 * @returns Array de validações
 */
function inferValidations(
  property: PropertyMetadata,
  fieldType: FormField['type'],
  config: InferenceConfig
): FormField['validation'] {
  const validations: NonNullable<FormField['validation']> = []

  // 1. Required (se não é optional e não é nullable)
  if (!property.optional && !property.nullable) {
    validations.push({
      type: 'required',
      message: `${generateLabel(property, config)} é obrigatório`
    })
  }

  // 2. Validações específicas por tipo
  switch (fieldType) {
    case 'email':
      validations.push({
        type: 'email',
        message: 'Email inválido'
      })
      break

    case 'url':
      validations.push({
        type: 'pattern',
        value: /^https?:\/\/.+/,
        message: 'URL inválida'
      })
      break

    case 'tel':
      validations.push({
        type: 'pattern',
        value: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
        message: 'Telefone inválido'
      })
      break

    case 'number':
      if (property.type === 'number') {
        // Pode adicionar min/max se existir metadata
        if (property.description?.includes('min:')) {
          const match = property.description.match(/min:\s*(\d+)/)
          if (match) {
            validations.push({
              type: 'min',
              value: Number(match[1]),
              message: `Valor mínimo: ${match[1]}`
            })
          }
        }
        if (property.description?.includes('max:')) {
          const match = property.description.match(/max:\s*(\d+)/)
          if (match) {
            validations.push({
              type: 'max',
              value: Number(match[1]),
              message: `Valor máximo: ${match[1]}`
            })
          }
        }
      }
      break

    case 'text':
    case 'textarea':
      // MinLength/MaxLength se especificado em description
      if (property.description?.includes('minLength:')) {
        const match = property.description.match(/minLength:\s*(\d+)/)
        if (match) {
          validations.push({
            type: 'minLength',
            value: Number(match[1]),
            message: `Mínimo ${match[1]} caracteres`
          })
        }
      }
      if (property.description?.includes('maxLength:')) {
        const match = property.description.match(/maxLength:\s*(\d+)/)
        if (match) {
          validations.push({
            type: 'maxLength',
            value: Number(match[1]),
            message: `Máximo ${match[1]} caracteres`
          })
        }
      }
      break
  }

  return validations.length > 0 ? validations : undefined
}

/**
 * Infere múltiplos campos de um array de propriedades
 * 
 * @param properties - Array de propriedades
 * @param context - Contexto de inferência
 * @returns Array de campos inferidos
 */
export function inferFormFields(
  properties: PropertyMetadata[],
  context: InferenceContext
): InferredFieldResult[] {
  return properties
    .filter(prop => {
      // Filtrar campos ignorados
      if (context.config.ignoreFields?.includes(prop.name)) {
        return false
      }
      return true
    })
    .map(prop => inferFormField(prop, context))
}
