/**
 * useFormBuilder - Composable para Form Builder
 * 
 * Composable para gerenciar estado e lógica do Form Builder.
 * Herda funcionalidade CRUD, history e validação de useSchemaBuilder.
 */

import { computed, ref } from 'vue'
import { useSchemaBuilder } from '@/core/schema-builder'
import type {
  FormSchema,
  FormField,
  FieldType,
  FormValidationResult,
  BuilderSettings
} from './types'
import { createEmptyFormSchema, createFormField } from './types'

/**
 * Opções do useFormBuilder
 */
export interface UseFormBuilderOptions {
  /** Schema inicial */
  initialSchema?: FormSchema
  
  /** Auto-save ativo */
  autoSave?: boolean
  
  /** Delay do auto-save (ms) */
  autoSaveDelay?: number
  
  /** Storage key para persistência */
  storageKey?: string
  
  /** Habilitar undo/redo */
  enableHistory?: boolean
  
  /** Tamanho do histórico */
  historySize?: number
  
  /** Configurações do builder */
  settings?: Partial<BuilderSettings>
}

/**
 * Composable para Form Builder
 * Herda CRUD, history, validation de useSchemaBuilder
 */
export function useFormBuilder(options: UseFormBuilderOptions = {}) {
  // ============================================
  // CORE - Herda TUDO do useSchemaBuilder
  // ============================================
  
  const core = useSchemaBuilder<FormSchema, FormField>({
    initialSchema: options.initialSchema || createEmptyFormSchema(),
    storageKey: options.storageKey || 'form-builder-state',
    enableHistory: options.enableHistory ?? true,
    historySize: options.historySize ?? 50,
    autoSaveDelay: options.autoSaveDelay ?? 30000
  })
  
  // ============================================
  // COMPATIBILIDADE (para componentes Vue legados)
  // ============================================
  
  /**
   * Modo do builder (design/preview/code)
   */
  const mode = ref<'design' | 'preview' | 'code'>('design')
  
  /**
   * ID do campo selecionado (alias de selectedItem)
   */
  const selectedFieldId = core.selectedItem
  
  /**
   * Settings (expõe para componentes)
   */
  const settings = options.settings || {}
  
  // ============================================
  // COMPUTED
  // ============================================
  
  /**
   * Lista de campos (alias de items)
   */
  const fields = computed(() => core.schema.value.items || [])
  
  /**
   * Quantidade de campos
   */
  const fieldCount = computed(() => fields.value.length)
  
  /**
   * Campo selecionado
   */
  const selectedField = computed(() => {
    if (!core.selectedItem.value) return null
    return fields.value.find(f => f.id === core.selectedItem.value) || null
  })
  
  // ============================================
  // FORM-SPECIFIC METHODS
  // ============================================
  
  /**
   * Adiciona um campo ao formulário
   * 
   * @param type - Tipo do campo
   * @param props - Propriedades customizadas
   * @param position - Posição (opcional, default: final)
   * @returns Campo criado
   */
  function addField(
    type: FieldType,
    props?: Partial<FormField['props']>,
    position?: number
  ): FormField {
    const field = createFormField(type, props)
    core.addItem(field, position)
    return field
  }
  
  /**
   * Remove um campo
   */
  function removeField(fieldId: string): void {
    core.removeItem(fieldId)
  }
  
  /**
   * Atualiza um campo
   */
  function updateField(
    fieldId: string,
    updates: Partial<FormField>
  ): void {
    core.updateItem(fieldId, updates)
  }
  
  /**
   * Move um campo para cima
   */
  function moveFieldUp(fieldId: string): void {
    core.moveItem(fieldId, 'up')
  }
  
  /**
   * Move um campo para baixo
   */
  function moveFieldDown(fieldId: string): void {
    core.moveItem(fieldId, 'down')
  }
  
  /**
   * Duplica um campo
   */
  function duplicateField(fieldId: string): void {
    core.duplicateItem(fieldId)
  }
  
  /**
   * Valida dados do formulário contra o schema
   * 
   * @param formData - Dados do formulário
   * @returns Resultado da validação
   */
  async function validateFormData(
    formData: Record<string, any>
  ): Promise<FormValidationResult> {
    const errors: Record<string, string> = {}
    const warnings: Record<string, string> = {}
    
    for (const field of fields.value) {
      const value = formData[field.id]
      
      // Skip campos condicionais não visíveis
      if (field.props?.conditional && !isFieldVisible(field as any, formData)) {
        continue
      }
      
      // Validação required
      if (field.props?.required && isEmpty(value)) {
        errors[field.id] = `${field.props.label || field.id} é obrigatório`
        continue
      }
      
      // Validação de tipo
      const typeValidation = validateFieldType(field.type, value)
      if (!typeValidation.valid) {
        errors[field.id] = typeValidation.message
        continue
      }
      
      // Validações customizadas
      if (field.props?.validation) {
        const rules = Array.isArray(field.props.validation) 
          ? field.props.validation 
          : field.props.validation.rules || []
        
        for (const rule of rules) {
          const result = await validateRule(rule, value, formData)
          if (!result.valid) {
            errors[field.id] = result.message
            break
          }
        }
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors,
      warnings
    }
  }
  
  /**
   * Verifica se campo está visível (baseado em conditional)
   */
  function isFieldVisible(
    field: FormField,
    formData: Record<string, any>
  ): boolean {
    if (!field.props?.conditional) return true
    
    const { field: condField, operator, value } = field.props.conditional
    const condValue = formData[condField]
    
    switch (operator) {
      case 'equals':
        return condValue === value
      case 'notEquals':
        return condValue !== value
      case 'contains':
        return String(condValue).includes(String(value))
      case 'greaterThan':
        return Number(condValue) > Number(value)
      case 'lessThan':
        return Number(condValue) < Number(value)
      default:
        return true
    }
  }
  
  /**
   * Define condição de visibilidade para um campo
   */
  function setFieldCondition(
    fieldId: string,
    condition: NonNullable<FormField['props']>['conditional']
  ): void {
    const field = fields.value.find(f => f.id === fieldId)
    if (field && field.props) {
      // Cast para any para permitir mutação
      (field.props as any).conditional = condition
    }
  }
  
  /**
   * Adiciona um step (multi-step form)
   */
  function addStep(title: string, fieldIds: string[] = []): void {
    const metadata = core.schema.value.metadata as any
    
    if (!metadata.steps) {
      metadata.steps = []
    }
    
    metadata.steps.push({
      id: `step-${Date.now()}`,
      title,
      fieldIds
    })
  }
  
  /**
   * Move field para um step específico
   */
  function moveFieldToStep(fieldId: string, stepId: string): void {
    const metadata = core.schema.value.metadata as any
    const steps = metadata.steps
    
    if (!steps) return
    
    // Remove de outros steps
    steps.forEach((step: any) => {
      step.fieldIds = step.fieldIds.filter((id: string) => id !== fieldId)
    })
    
    // Adiciona ao novo step
    const step = steps.find((s: any) => s.id === stepId)
    if (step) {
      step.fieldIds.push(fieldId)
    }
  }
  
  /**
   * Gera componente Vue do formulário
   */
  function generateVueComponent(): {
    template: string
    script: string
    style: string
  } {
    // TODO: Implementar geração de componente Vue
    return {
      template: '<!-- Generated form template -->',
      script: '// Generated form script',
      style: '/* Generated form styles */'
    }
  }
  
  // ============================================
  // MÉTODOS DE COMPATIBILIDADE
  // ============================================
  
  /**
   * Move field (alias para moveFieldUp/Down)
   */
  function moveField(fieldId: string, direction: 'up' | 'down' | number): void {
    if (direction === 'up') {
      moveFieldUp(fieldId)
    } else if (direction === 'down') {
      moveFieldDown(fieldId)
    } else {
      // direction é o novo índice
      const currentIndex = fields.value.findIndex(f => f.id === fieldId)
      if (currentIndex !== -1 && typeof direction === 'number') {
        const items = [...fields.value]
        const [item] = items.splice(currentIndex, 1)
        if (item) {
          items.splice(direction, 0, item)
          // Directly update schema instead of calling load()
          if (core.schema.value.items) {
            Object.assign(core.schema.value, { ...core.schema.value, items })
          }
        }
      }
    }
  }
  
  /**
   * Export schema (alias para exportJSON)
   */
  function exportSchema(_format?: 'json' | 'yaml'): string {
    return core.exportJSON()
  }
  
  /**
   * Load schema (alias para importJSON)
   */
  function loadSchema(data: string | FormSchema): void {
    if (typeof data === 'string') {
      core.importJSON(data)
    } else {
      // Directly update schema by assigning each property
      Object.assign(core.schema.value, data)
    }
  }
  
  // ============================================
  // RETURN API
  // ============================================
  
  return {
    // Core (herdado)
    schema: core.schema,
    selectedItem: core.selectedItem,
    isDirty: core.isDirty,
    isValid: core.isValid,
    validation: core.validation,
    
    // History (herdado)
    undo: core.undo,
    redo: core.redo,
    canUndo: core.canUndo,
    canRedo: core.canRedo,
    
    // CRUD (herdado)
    addItem: core.addItem,
    removeItem: core.removeItem,
    updateItem: core.updateItem,
    duplicateItem: core.duplicateItem,
    clearItems: core.clearItems,
    
    // Save/Load (herdado)
    save: core.save,
    load: core.load,
    exportJSON: core.exportJSON,
    importJSON: core.importJSON,
    
    // Computed
    fields,
    fieldCount,
    selectedField,
    
    // Compatibilidade
    mode,
    selectedFieldId,
    settings,
    hasChanges: core.isDirty, // Alias
    
    // Form-specific methods
    addField,
    removeField,
    updateField,
    moveFieldUp,
    moveFieldDown,
    duplicateField,
    validateFormData,
    isFieldVisible,
    setFieldCondition,
    addStep,
    moveFieldToStep,
    generateVueComponent,
    
    // Métodos de compatibilidade
    moveField,
    exportSchema,
    loadSchema
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verifica se valor está vazio
 */
function isEmpty(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

/**
 * Valida tipo do campo
 */
function validateFieldType(
  type: FieldType,
  value: any
): { valid: boolean; message: string } {
  // Email
  if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(value))) {
      return { valid: false, message: 'Email inválido' }
    }
  }
  
  // Number
  if (type === 'number') {
    if (isNaN(Number(value))) {
      return { valid: false, message: 'Deve ser um número' }
    }
  }
  
  // URL
  if (type === 'url') {
    try {
      new URL(String(value))
    } catch {
      return { valid: false, message: 'URL inválida' }
    }
  }
  
  return { valid: true, message: '' }
}

/**
 * Valida regra customizada
 */
async function validateRule(
  rule: any,
  value: any,
  formData: Record<string, any>
): Promise<{ valid: boolean; message: string }> {
  switch (rule.type) {
    case 'required':
      return {
        valid: !isEmpty(value),
        message: rule.message || 'Campo obrigatório'
      }
    
    case 'email':
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
      return {
        valid: emailValid,
        message: rule.message || 'Email inválido'
      }
    
    case 'min':
      const minValid = String(value).length >= rule.value
      return {
        valid: minValid,
        message: rule.message || `Mínimo ${rule.value} caracteres`
      }
    
    case 'max':
      const maxValid = String(value).length <= rule.value
      return {
        valid: maxValid,
        message: rule.message || `Máximo ${rule.value} caracteres`
      }
    
    case 'pattern':
      const patternValid = rule.value.test(String(value))
      return {
        valid: patternValid,
        message: rule.message || 'Formato inválido'
      }
    
    case 'custom':
      if (rule.validator) {
        const result = await rule.validator(value, formData)
        return {
          valid: result,
          message: rule.message || 'Validação falhou'
        }
      }
      return { valid: true, message: '' }
    
    default:
      return { valid: true, message: '' }
  }
}
