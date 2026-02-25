/**
 * Validadores específicos para Document Schema
 */

import type { DocumentSchema } from './types'
import type { ValidationResult, ValidationError } from '@/core/schema-builder/types'
import { validateBaseSchema, createValidationError } from '@/core/schema-builder'

/**
 * Validar schema de documento
 * 
 * @param schema - Schema do documento a ser validado
 * @returns Resultado da validação
 */
export function validateDocumentSchema(schema: DocumentSchema): ValidationResult {
  const errors: ValidationError[] = []
  
  // Validar schema base
  const baseValidation = validateBaseSchema(schema)
  if (!baseValidation.valid) {
    errors.push(...baseValidation.errors)
  }
  
  // Validar layout
  if (!schema.layout) {
    errors.push(createValidationError('layout', 'Layout é obrigatório', 'required'))
  } else {
    // Validar page size
    const validPageSizes = ['a4', 'letter', 'legal', 'a3', 'a5']
    if (!validPageSizes.includes(schema.layout.pageSize)) {
      errors.push(
        createValidationError(
          'layout.pageSize',
          `Tamanho de página inválido. Use: ${validPageSizes.join(', ')}`,
          'invalid_value',
          schema.layout.pageSize
        )
      )
    }
    
    // Validar orientation
    const validOrientations = ['portrait', 'landscape']
    if (!validOrientations.includes(schema.layout.orientation)) {
      errors.push(
        createValidationError(
          'layout.orientation',
          `Orientação inválida. Use: ${validOrientations.join(', ')}`,
          'invalid_value',
          schema.layout.orientation
        )
      )
    }
    
    // Validar margins
    if (!schema.layout.margins) {
      errors.push(createValidationError('layout.margins', 'Margens são obrigatórias', 'required'))
    } else {
      const { top, right, bottom, left } = schema.layout.margins
      if (top < 0 || right < 0 || bottom < 0 || left < 0) {
        errors.push(
          createValidationError(
            'layout.margins',
            'Margens devem ser valores positivos',
            'invalid_value'
          )
        )
      }
    }
  }
  
  // Validar variáveis
  if (schema.variables) {
    schema.variables.forEach((variable, index) => {
      // Nome obrigatório
      if (!variable.name || variable.name.trim() === '') {
        errors.push(
          createValidationError(
            `variables[${index}].name`,
            'Nome da variável é obrigatório',
            'required'
          )
        )
      }
      
      // Nome deve ser alfanumérico
      if (variable.name && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable.name)) {
        errors.push(
          createValidationError(
            `variables[${index}].name`,
            'Nome da variável deve começar com letra e conter apenas letras, números e underscore',
            'invalid_format',
            variable.name
          )
        )
      }
      
      // Label obrigatório
      if (!variable.label || variable.label.trim() === '') {
        errors.push(
          createValidationError(
            `variables[${index}].label`,
            'Label da variável é obrigatório',
            'required'
          )
        )
      }
      
      // Tipo válido
      const validTypes = ['text', 'number', 'date', 'datetime', 'time', 'currency', 'boolean', 'select', 'array', 'object']
      if (!validTypes.includes(variable.type)) {
        errors.push(
          createValidationError(
            `variables[${index}].type`,
            `Tipo de variável inválido. Use: ${validTypes.join(', ')}`,
            'invalid_value',
            variable.type
          )
        )
      }
      
      // Se tipo select, deve ter options
      if (variable.type === 'select' && (!variable.options || variable.options.length === 0)) {
        errors.push(
          createValidationError(
            `variables[${index}].options`,
            'Variável do tipo select deve ter opções',
            'required'
          )
        )
      }
    })
    
    // Verificar nomes duplicados
    const names = schema.variables.map(v => v.name)
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
    if (duplicates.length > 0) {
      errors.push(
        createValidationError(
          'variables',
          `Nomes de variáveis duplicados: ${duplicates.join(', ')}`,
          'duplicate_names',
          duplicates
        )
      )
    }
  }
  
  // Validar blocos
  if (schema.items) {
    schema.items.forEach((block, index) => {
      // Tipo válido
      const validBlockTypes = [
        'text', 'heading', 'variable', 'qrcode', 'signature',
        'image', 'table', 'spacer', 'line', 'group', 'repeater'
      ]
      if (!validBlockTypes.includes(block.type)) {
        errors.push(
          createValidationError(
            `items[${index}].type`,
            `Tipo de bloco inválido. Use: ${validBlockTypes.join(', ')}`,
            'invalid_value',
            block.type
          )
        )
      }
      
      // Validar conteúdo baseado no tipo
      if (block.type === 'variable' && block.content) {
        const variableName = block.content.variableName
        if (!variableName) {
          errors.push(
            createValidationError(
              `items[${index}].content.variableName`,
              'Bloco de variável deve ter variableName',
              'required'
            )
          )
        } else if (schema.variables) {
          // Verificar se variável existe
          const variableExists = schema.variables.some(v => v.name === variableName)
          if (!variableExists) {
            errors.push(
              createValidationError(
                `items[${index}].content.variableName`,
                `Variável '${variableName}' não está definida`,
                'undefined_variable',
                variableName
              )
            )
          }
        }
      }
      
      if (block.type === 'repeater' && block.content) {
        const dataSource = block.content.dataSource
        const itemVariable = block.content.itemVariable
        
        if (!dataSource) {
          errors.push(
            createValidationError(
              `items[${index}].content.dataSource`,
              'Bloco repeater deve ter dataSource',
              'required'
            )
          )
        }
        
        if (!itemVariable) {
          errors.push(
            createValidationError(
              `items[${index}].content.itemVariable`,
              'Bloco repeater deve ter itemVariable',
              'required'
            )
          )
        }
        
        if (!block.content.template || block.content.template.length === 0) {
          errors.push(
            createValidationError(
              `items[${index}].content.template`,
              'Bloco repeater deve ter template',
              'required'
            )
          )
        }
      }
    })
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validar dados do documento
 * 
 * Valida se os dados fornecidos são compatíveis com as variáveis definidas
 * 
 * @param schema - Schema do documento
 * @param data - Dados a serem validados
 * @returns Resultado da validação
 */
export function validateDocumentData(
  schema: DocumentSchema,
  data: Record<string, any>
): ValidationResult {
  const errors: ValidationError[] = []
  
  // Verificar variáveis obrigatórias
  schema.variables?.forEach(variable => {
    if (variable.required && (data[variable.name] === undefined || data[variable.name] === null)) {
      errors.push(
        createValidationError(
          variable.name,
          `${variable.label} é obrigatório`,
          'required'
        )
      )
    }
    
    // Validar tipo
    const value = data[variable.name]
    if (value !== undefined && value !== null) {
      switch (variable.type) {
        case 'number':
          if (typeof value !== 'number') {
            errors.push(
              createValidationError(
                variable.name,
                `${variable.label} deve ser um número`,
                'invalid_type',
                value
              )
            )
          }
          break
        
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(
              createValidationError(
                variable.name,
                `${variable.label} deve ser verdadeiro ou falso`,
                'invalid_type',
                value
              )
            )
          }
          break
        
        case 'array':
          if (!Array.isArray(value)) {
            errors.push(
              createValidationError(
                variable.name,
                `${variable.label} deve ser uma lista`,
                'invalid_type',
                value
              )
            )
          }
          break
        
        case 'object':
          if (typeof value !== 'object' || Array.isArray(value)) {
            errors.push(
              createValidationError(
                variable.name,
                `${variable.label} deve ser um objeto`,
                'invalid_type',
                value
              )
            )
          }
          break
      }
      
      // Validações customizadas
      if (variable.validation) {
        const { min, max, minLength, maxLength, pattern } = variable.validation
        
        if (typeof value === 'number') {
          if (min !== undefined && value < min) {
            errors.push(
              createValidationError(
                variable.name,
                `${variable.label} deve ser no mínimo ${min}`,
                'min_value',
                value
              )
            )
          }
          if (max !== undefined && value > max) {
            errors.push(
              createValidationError(
                variable.name,
                `${variable.label} deve ser no máximo ${max}`,
                'max_value',
                value
              )
            )
          }
        }
        
        if (typeof value === 'string') {
          if (minLength !== undefined && value.length < minLength) {
            errors.push(
              createValidationError(
                variable.name,
                `${variable.label} deve ter no mínimo ${minLength} caracteres`,
                'min_length',
                value
              )
            )
          }
          if (maxLength !== undefined && value.length > maxLength) {
            errors.push(
              createValidationError(
                variable.name,
                `${variable.label} deve ter no máximo ${maxLength} caracteres`,
                'max_length',
                value
              )
            )
          }
          if (pattern && !new RegExp(pattern).test(value)) {
            errors.push(
              createValidationError(
                variable.name,
                `${variable.label} não corresponde ao formato esperado`,
                'invalid_pattern',
                value
              )
            )
          }
        }
      }
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}
