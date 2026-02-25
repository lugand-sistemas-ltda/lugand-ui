/**
 * Sistema de validação customizado (sem dependências externas)
 * 
 * Fornece validadores reutilizáveis para schemas
 */

import type { BaseSchema, ValidationResult, ValidationError } from './types'

/**
 * Criar resultado de validação vazio (sucesso)
 */
export function createValidationSuccess(): ValidationResult {
  return {
    valid: true,
    errors: []
  }
}

/**
 * Criar erro de validação
 */
export function createValidationError(
  path: string,
  message: string,
  code: string,
  value?: any
): ValidationError {
  return { path, message, code, value }
}

/**
 * Validar schema base (campos obrigatórios)
 * 
 * @param schema - Schema a ser validado
 * @returns Resultado da validação
 */
export function validateBaseSchema<T extends BaseSchema>(schema: T): ValidationResult {
  const errors: ValidationError[] = []
  
  // Validar ID
  if (!schema.id || typeof schema.id !== 'string' || schema.id.trim() === '') {
    errors.push(createValidationError('id', 'ID é obrigatório', 'required', schema.id))
  }
  
  // Validar nome
  if (!schema.name || typeof schema.name !== 'string' || schema.name.trim() === '') {
    errors.push(createValidationError('name', 'Nome é obrigatório', 'required', schema.name))
  }
  
  // Validar versão
  if (!schema.version || typeof schema.version !== 'string') {
    errors.push(createValidationError('version', 'Versão é obrigatória', 'required', schema.version))
  } else if (!/^\d+\.\d+\.\d+$/.test(schema.version)) {
    errors.push(createValidationError('version', 'Versão deve seguir formato semver (ex: 1.0.0)', 'invalid_format', schema.version))
  }
  
  // Validar items
  if (!Array.isArray(schema.items)) {
    errors.push(createValidationError('items', 'Items deve ser um array', 'invalid_type', schema.items))
  } else {
    schema.items.forEach((item, index) => {
      if (!item.id || typeof item.id !== 'string') {
        errors.push(createValidationError(`items[${index}].id`, 'Item sem ID válido', 'required', item.id))
      }
      
      if (!item.type || typeof item.type !== 'string') {
        errors.push(createValidationError(`items[${index}].type`, 'Item sem tipo válido', 'required', item.type))
      }
    })
  }
  
  // Validar timestamps
  if (!schema.createdAt || !isValidISODate(schema.createdAt)) {
    errors.push(createValidationError('createdAt', 'createdAt deve ser ISO 8601', 'invalid_format', schema.createdAt))
  }
  
  if (!schema.updatedAt || !isValidISODate(schema.updatedAt)) {
    errors.push(createValidationError('updatedAt', 'updatedAt deve ser ISO 8601', 'invalid_format', schema.updatedAt))
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validar se string é data ISO 8601 válida
 */
function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime()) && date.toISOString() === dateString
}

/**
 * Builder de validação fluente
 * 
 * @example
 * ```ts
 * const validator = createValidator<MySchema>()
 *   .required('name', 'Nome é obrigatório')
 *   .minLength('name', 3, 'Nome deve ter no mínimo 3 caracteres')
 *   .custom((schema) => {
 *     if (schema.items.length === 0) {
 *       return createValidationError('items', 'Deve ter ao menos 1 item', 'min_items')
 *     }
 *   })
 * 
 * const result = validator.validate(mySchema)
 * ```
 */
export class ValidationBuilder<T> {
  private rules: Array<(data: T) => ValidationError | null> = []
  
  /**
   * Campo obrigatório
   */
  required(path: keyof T, message?: string): this {
    this.rules.push((data) => {
      const value = data[path]
      if (value === undefined || value === null || value === '') {
        return createValidationError(
          String(path),
          message || `${String(path)} é obrigatório`,
          'required',
          value
        )
      }
      return null
    })
    return this
  }
  
  /**
   * Comprimento mínimo (string ou array)
   */
  minLength(path: keyof T, length: number, message?: string): this {
    this.rules.push((data) => {
      const value = data[path]
      if (value && (typeof value === 'string' || Array.isArray(value))) {
        if (value.length < length) {
          return createValidationError(
            String(path),
            message || `${String(path)} deve ter no mínimo ${length} caracteres/items`,
            'min_length',
            value
          )
        }
      }
      return null
    })
    return this
  }
  
  /**
   * Comprimento máximo (string ou array)
   */
  maxLength(path: keyof T, length: number, message?: string): this {
    this.rules.push((data) => {
      const value = data[path]
      if (value && (typeof value === 'string' || Array.isArray(value))) {
        if (value.length > length) {
          return createValidationError(
            String(path),
            message || `${String(path)} deve ter no máximo ${length} caracteres/items`,
            'max_length',
            value
          )
        }
      }
      return null
    })
    return this
  }
  
  /**
   * Valor mínimo (number)
   */
  min(path: keyof T, min: number, message?: string): this {
    this.rules.push((data) => {
      const value = data[path]
      if (typeof value === 'number' && value < min) {
        return createValidationError(
          String(path),
          message || `${String(path)} deve ser no mínimo ${min}`,
          'min_value',
          value
        )
      }
      return null
    })
    return this
  }
  
  /**
   * Valor máximo (number)
   */
  max(path: keyof T, max: number, message?: string): this {
    this.rules.push((data) => {
      const value = data[path]
      if (typeof value === 'number' && value > max) {
        return createValidationError(
          String(path),
          message || `${String(path)} deve ser no máximo ${max}`,
          'max_value',
          value
        )
      }
      return null
    })
    return this
  }
  
  /**
   * Regex pattern
   */
  pattern(path: keyof T, regex: RegExp, message?: string): this {
    this.rules.push((data) => {
      const value = data[path]
      if (typeof value === 'string' && !regex.test(value)) {
        return createValidationError(
          String(path),
          message || `${String(path)} não corresponde ao padrão esperado`,
          'invalid_pattern',
          value
        )
      }
      return null
    })
    return this
  }
  
  /**
   * Email válido
   */
  email(path: keyof T, message?: string): this {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return this.pattern(
      path,
      emailRegex,
      message || `${String(path)} deve ser um email válido`
    )
  }
  
  /**
   * Validação customizada
   */
  custom(validator: (data: T) => ValidationError | null): this {
    this.rules.push(validator)
    return this
  }
  
  /**
   * Executar validação
   */
  validate(data: T): ValidationResult {
    const errors: ValidationError[] = []
    
    for (const rule of this.rules) {
      const error = rule(data)
      if (error) {
        errors.push(error)
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

/**
 * Criar novo builder de validação
 */
export function createValidator<T>(): ValidationBuilder<T> {
  return new ValidationBuilder<T>()
}
