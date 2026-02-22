/**
 * useFormValidation Composable
 * 
 * Gerencia validação reativa de formulários.
 * 
 * @module features/form-renderer
 */

import { ref, computed, type Ref } from 'vue'
import type {
  FormField,
  FieldValidationRule,
  FieldValidationResult,
  FormErrors
} from './types'

/**
 * Composable para validação de formulários.
 * 
 * @param fields - Campos do formulário
 * @param formData - Ref com dados do form
 * @returns Métodos e estado de validação
 */
export function useFormValidation(
  fields: FormField[],
  formData: Ref<Record<string, any>>
) {
  const errors = ref<FormErrors>({ fields: {} })
  const touched = ref<Set<string>>(new Set())
  const validating = ref(false)

  /**
   * Valida um campo individual.
   */
  async function validateField(fieldName: string): Promise<FieldValidationResult> {
    const field = fields.find((f) => f.name === fieldName)

    if (!field) {
      return { valid: true, errors: [] }
    }

    const value = formData.value[fieldName]
    const fieldErrors: string[] = []

    // 1. Required validation
    if (field.required && (value === undefined || value === null || value === '')) {
      fieldErrors.push(field.label ? `${field.label} é obrigatório` : 'Campo obrigatório')
    }

    // 2. Custom validations
    if (field.validation && value !== undefined && value !== null && value !== '') {
      for (const rule of field.validation) {
        const error = await validateRule(rule, value, field)
        if (error) {
          fieldErrors.push(error)
        }
      }
    }

    // 3. Type-specific validations
    if (value !== undefined && value !== null && value !== '') {
      const typeError = validateFieldType(field, value)
      if (typeError) {
        fieldErrors.push(typeError)
      }
    }

    return {
      valid: fieldErrors.length === 0,
      errors: fieldErrors
    }
  }

  /**
   * Valida uma regra individual.
   */
  async function validateRule(
    rule: FieldValidationRule,
    value: any,
    _field: FormField
  ): Promise<string | null> {
    switch (rule.type) {
      case 'required':
        // Already handled above
        return null

      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return rule.message || 'Email inválido'
        }
        return null

      case 'min':
        if (typeof value === 'number' && value < rule.value) {
          return rule.message || `Valor mínimo: ${rule.value}`
        }
        return null

      case 'max':
        if (typeof value === 'number' && value > rule.value) {
          return rule.message || `Valor máximo: ${rule.value}`
        }
        return null

      case 'minLength':
        if (typeof value === 'string' && value.length < rule.value) {
          return rule.message || `Mínimo ${rule.value} caracteres`
        }
        return null

      case 'maxLength':
        if (typeof value === 'string' && value.length > rule.value) {
          return rule.message || `Máximo ${rule.value} caracteres`
        }
        return null

      case 'pattern':
        if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
          return rule.message || 'Formato inválido'
        }
        return null

      case 'custom':
        if (rule.validator) {
          try {
            const isValid = await rule.validator(value, formData.value)
            if (!isValid) {
              return rule.message || 'Validação falhou'
            }
          } catch (error) {
            console.error('[Form Validation] Custom validator error:', error)
            return rule.message || 'Erro na validação'
          }
        }
        return null

      default:
        return null
    }
  }

  /**
   * Validação específica por tipo de campo.
   */
  function validateFieldType(field: FormField, value: any): string | null {
    switch (field.type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Email inválido'
        }
        break

      case 'url':
        try {
          new URL(value)
        } catch {
          return 'URL inválida'
        }
        break

      case 'number':
        if (typeof value !== 'number' || Number.isNaN(value)) {
          return 'Deve ser um número válido'
        }
        if (field.min !== undefined && value < field.min) {
          return `Valor mínimo: ${field.min}`
        }
        if (field.max !== undefined && value > field.max) {
          return `Valor máximo: ${field.max}`
        }
        break

      case 'tel':
        // Validação básica de telefone (pode ser customizada)
        if (!/^[\d\s()+-]+$/.test(value)) {
          return 'Telefone inválido'
        }
        break
    }

    return null
  }

  /**
   * Valida todo o formulário.
   */
  async function validateForm(): Promise<boolean> {
    validating.value = true
    const newErrors: FormErrors = { fields: {} }

    for (const field of fields) {
      // Skip hidden fields
      if (field.type === 'hidden') continue

      // Check showIf condition
      if (field.showIf) {
        const shouldShow = typeof field.showIf === 'function'
          ? field.showIf(formData.value)
          : evaluateExpression(field.showIf, formData.value)

        if (!shouldShow) continue
      }

      const result = await validateField(field.name)

      if (!result.valid) {
        newErrors.fields[field.name] = result.errors
      }
    }

    errors.value = newErrors
    validating.value = false

    return Object.keys(newErrors.fields).length === 0
  }

  /**
   * Marca campo como tocado.
   */
  function touchField(fieldName: string) {
    touched.value.add(fieldName)
  }

  /**
   * Limpa erros de um campo.
   */
  function clearFieldError(fieldName: string) {
    if (errors.value.fields[fieldName]) {
      delete errors.value.fields[fieldName]
    }
  }

  /**
   * Limpa todos os erros.
   */
  function clearErrors() {
    errors.value = { fields: {} }
  }

  /**
   * Reseta estado de validação.
   */
  function reset() {
    errors.value = { fields: {} }
    touched.value.clear()
    validating.value = false
  }

  /**
   * Avalia expressão showIf.
   * Suporta expressões simples como: "field1 === 'value'"
   */
  function evaluateExpression(expression: string, data: Record<string, any>): boolean {
    try {
      // Simple evaluation (pode ser expandido com parser mais robusto)
      const func = new Function(...Object.keys(data), `return ${expression}`)
      return func(...Object.values(data))
    } catch (error) {
      console.warn('[Form Validation] Failed to evaluate expression:', expression, error)
      return true // Default to showing field
    }
  }

  /**
   * Se form é válido (computed).
   */
  const isValid = computed(() => {
    return Object.keys(errors.value.fields).length === 0
  })

  /**
   * Se há erros (computed).
   */
  const hasErrors = computed(() => {
    return Object.keys(errors.value.fields).length > 0
  })

  /**
   * Obtém erros de um campo específico.
   */
  function getFieldErrors(fieldName: string): string[] {
    return errors.value.fields[fieldName] || []
  }

  /**
   * Verifica se campo foi tocado.
   */
  function isFieldTouched(fieldName: string): boolean {
    return touched.value.has(fieldName)
  }

  return {
    // State
    errors,
    touched,
    validating,
    isValid,
    hasErrors,

    // Methods
    validateField,
    validateForm,
    touchField,
    clearFieldError,
    clearErrors,
    reset,
    getFieldErrors,
    isFieldTouched
  }
}
