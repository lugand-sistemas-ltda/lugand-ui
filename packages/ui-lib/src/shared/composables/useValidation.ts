/**
 * ============================================
 * USE VALIDATION - Composable para validação
 * ============================================
 * 
 * Sistema de validação customizado sem dependências externas.
 * Suporta validações síncronas e assíncronas.
 * 
 * @example
 * ```ts
 * const { validate, errors, isValid } = useValidation()
 * 
 * const rules = {
 *   name: [required(), minLength(3)],
 *   email: [required(), email()],
 *   age: [required(), min(18), max(100)]
 * }
 * 
 * const data = { name: 'Jo', email: 'invalid', age: 15 }
 * validate(data, rules)
 * 
 * console.log(errors.value) 
 * // { 
 * //   name: 'Deve ter no mínimo 3 caracteres',
 * //   email: 'Email inválido',
 * //   age: 'Deve ser no mínimo 18'
 * // }
 * ```
 */

import { ref, computed, type Ref } from 'vue'

// ============================================
// TYPES
// ============================================
export type ValidationRule<T = any> = (value: T, data?: any) => string | null | Promise<string | null>

export type ValidationRules<T = any> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

export type ValidationErrors<T = any> = {
  [K in keyof T]?: string
}

// ============================================
// COMPOSABLE
// ============================================
export function useValidation<T extends Record<string, any>>() {
  const errors: Ref<ValidationErrors<T>> = ref({})
  const isValidating = ref(false)

  const isValid = computed(() => Object.keys(errors.value).length === 0)
  const hasErrors = computed(() => !isValid.value)

  /**
   * Valida um conjunto de dados contra regras
   */
  async function validate(data: T, rules: ValidationRules<T>): Promise<boolean> {
    isValidating.value = true
    errors.value = {}

    try {
      for (const field in rules) {
        const fieldRules = rules[field]
        if (!fieldRules) continue

        const value = data[field]

        for (const rule of fieldRules) {
          const error = await rule(value, data)
          if (error) {
            errors.value[field] = error
            break // Para no primeiro erro do campo
          }
        }
      }

      return isValid.value
    } finally {
      isValidating.value = false
    }
  }

  /**
   * Valida um campo específico
   */
  async function validateField(
    field: keyof T,
    value: any,
    rules: ValidationRule[],
    data?: T
  ): Promise<string | null> {
    for (const rule of rules) {
      const error = await rule(value, data)
      if (error) {
        errors.value[field] = error
        return error
      }
    }

    delete errors.value[field]
    return null
  }

  /**
   * Limpa os erros
   */
  function clearErrors(): void {
    errors.value = {}
  }

  /**
   * Limpa erro de um campo específico
   */
  function clearFieldError(field: keyof T): void {
    delete errors.value[field]
  }

  /**
   * Define um erro manualmente
   */
  function setFieldError(field: keyof T, error: string): void {
    errors.value[field] = error
  }

  return {
    errors,
    isValid,
    hasErrors,
    isValidating,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError
  }
}

// ============================================
// BUILT-IN VALIDATION RULES
// ============================================

/**
 * Campo obrigatório
 */
export function required(message = 'Campo obrigatório'): ValidationRule {
  return (value: any) => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    if (Array.isArray(value) && value.length === 0) {
      return message
    }
    return null
  }
}

/**
 * Comprimento mínimo (string ou array)
 */
export function minLength(min: number, message?: string): ValidationRule {
  return (value: any) => {
    if (!value) return null
    const length = Array.isArray(value) ? value.length : String(value).length
    if (length < min) {
      return message || `Deve ter no mínimo ${min} caracteres`
    }
    return null
  }
}

/**
 * Comprimento máximo (string ou array)
 */
export function maxLength(max: number, message?: string): ValidationRule {
  return (value: any) => {
    if (!value) return null
    const length = Array.isArray(value) ? value.length : String(value).length
    if (length > max) {
      return message || `Deve ter no máximo ${max} caracteres`
    }
    return null
  }
}

/**
 * Valor mínimo (número)
 */
export function min(minValue: number, message?: string): ValidationRule {
  return (value: any) => {
    if (value === null || value === undefined) return null
    const num = Number(value)
    if (isNaN(num) || num < minValue) {
      return message || `Deve ser no mínimo ${minValue}`
    }
    return null
  }
}

/**
 * Valor máximo (número)
 */
export function max(maxValue: number, message?: string): ValidationRule {
  return (value: any) => {
    if (value === null || value === undefined) return null
    const num = Number(value)
    if (isNaN(num) || num > maxValue) {
      return message || `Deve ser no máximo ${maxValue}`
    }
    return null
  }
}

/**
 * Email válido
 */
export function email(message = 'Email inválido'): ValidationRule {
  return (value: any) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(value))) {
      return message
    }
    return null
  }
}

/**
 * URL válida
 */
export function url(message = 'URL inválida'): ValidationRule {
  return (value: any) => {
    if (!value) return null
    try {
      new URL(String(value))
      return null
    } catch {
      return message
    }
  }
}

/**
 * Padrão regex
 */
export function pattern(regex: RegExp, message = 'Formato inválido'): ValidationRule {
  return (value: any) => {
    if (!value) return null
    if (!regex.test(String(value))) {
      return message
    }
    return null
  }
}

/**
 * Valores devem ser iguais (ex: confirmação de senha)
 */
export function matches(field: string, message?: string): ValidationRule {
  return (value: any, data?: any) => {
    if (!data) return null
    if (value !== data[field]) {
      return message || `Deve ser igual a ${field}`
    }
    return null
  }
}

/**
 * Valor deve estar em uma lista
 */
export function oneOf(options: any[], message?: string): ValidationRule {
  return (value: any) => {
    if (value === null || value === undefined) return null
    if (!options.includes(value)) {
      return message || `Deve ser um dos valores: ${options.join(', ')}`
    }
    return null
  }
}
