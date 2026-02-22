/**
 * useFormBuilder.ts
 * 
 * Composable para gerenciar estado e lógica do Form Builder.
 * Responsável por add/remove/update fields, undo/redo, validação, export.
 * 
 * @module features/form-builder
 * @created 2025-01-XX
 */

import { ref, computed, watch, type Ref } from 'vue'
import type { FormSchema, FormField } from '../form-renderer/types'
import type {
  BuilderSettings,
  FieldDragEvent,
  SchemaValidationResult,
  HistoryAction,
  ExportOptions
} from './types'

/**
 * Configurações padrão do builder
 */
const DEFAULT_SETTINGS: BuilderSettings = {
  showGrid: true,
  snapToGrid: false,
  showLabels: true,
  autoSaveInterval: 30000, // 30s
  liveValidation: true,
  theme: 'auto'
}

/**
 * Composable para Form Builder
 * 
 * @param initialSchema - Schema inicial
 * @param settings - Configurações customizadas
 * @returns Estado e métodos do builder
 * 
 * @example
 * const {
 *   schema,
 *   selectedField,
 *   addField,
 *   removeField,
 *   updateField,
 *   undo,
 *   redo,
 *   exportSchema
 * } = useFormBuilder()
 */
export function useFormBuilder(
  initialSchema?: Ref<FormSchema | undefined>,
  settings?: Partial<BuilderSettings>
) {
  // ============================================
  // STATE
  // ============================================

  const schema = ref<FormSchema>(initialSchema?.value || createEmptySchema())
  const selectedFieldId = ref<string | null>(null)
  const mode = ref<'design' | 'preview' | 'code'>('design')
  const history = ref<HistoryAction[]>([])
  const historyIndex = ref(-1)
  const isDirty = ref(false)
  const builderSettings = ref<BuilderSettings>({
    ...DEFAULT_SETTINGS,
    ...settings
  })

  // ============================================
  // COMPUTED
  // ============================================

  const selectedField = computed(() => {
    if (!selectedFieldId.value) return null
    return schema.value.fields.find(f => f.name === selectedFieldId.value) || null
  })

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  const fieldCount = computed(() => schema.value.fields.length)

  const hasChanges = computed(() => isDirty.value)

  // ============================================
  // METHODS - FIELD MANAGEMENT
  // ============================================

  /**
   * Adiciona um campo ao formulário
   */
  function addField(field: Partial<FormField>, index?: number) {
    const newField: FormField = {
      name: field.name || `field_${Date.now()}`,
      label: field.label || 'New Field',
      type: field.type || 'text',
      required: field.required || false,
      ...field
    }

    const targetIndex = index !== undefined ? index : schema.value.fields.length

    const before = cloneSchema(schema.value)
    schema.value.fields.splice(targetIndex, 0, newField)
    const after = cloneSchema(schema.value)

    addToHistory({
      type: 'add',
      fieldName: newField.name,
      before,
      after,
      timestamp: Date.now()
    })

    selectedFieldId.value = newField.name
    isDirty.value = true

    return newField
  }

  /**
   * Remove um campo do formulário
   */
  function removeField(fieldName: string) {
    const fieldIndex = schema.value.fields.findIndex(f => f.name === fieldName)
    if (fieldIndex === -1) return false

    const before = cloneSchema(schema.value)
    const [removedField] = schema.value.fields.splice(fieldIndex, 1)
    const after = cloneSchema(schema.value)

    addToHistory({
      type: 'remove',
      fieldName,
      before,
      after,
      timestamp: Date.now()
    })

    if (selectedFieldId.value === fieldName) {
      selectedFieldId.value = null
    }

    isDirty.value = true
    return removedField
  }

  /**
   * Atualiza propriedades de um campo
   */
  function updateField(fieldName: string, updates: Partial<FormField>) {
    const fieldIndex = schema.value.fields.findIndex(f => f.name === fieldName)
    if (fieldIndex === -1) return false

    const before = cloneSchema(schema.value)

    // Merge updates mantendo required fields
    const currentField = schema.value.fields[fieldIndex]
    if (!currentField) {
      console.warn(`Field ${fieldName} not found at index ${fieldIndex}`)
      return
    }

    schema.value.fields[fieldIndex] = {
      ...currentField,
      ...updates,
      // Garantir campos obrigatórios
      name: updates.name ?? currentField.name,
      type: updates.type ?? currentField.type,
      label: updates.label ?? currentField.label
    }

    const after = cloneSchema(schema.value)

    addToHistory({
      type: 'update',
      fieldName,
      before,
      after,
      timestamp: Date.now()
    })

    isDirty.value = true
    return true
  }

  /**
   * Move um campo para nova posição
   */
  function moveField(fieldName: string, newIndex: number) {
    const currentIndex = schema.value.fields.findIndex(f => f.name === fieldName)
    if (currentIndex === -1) return false

    const before = cloneSchema(schema.value)

    const [field] = schema.value.fields.splice(currentIndex, 1)
    if (!field) return false // Guard: field pode ser undefined

    schema.value.fields.splice(newIndex, 0, field)

    const after = cloneSchema(schema.value)

    addToHistory({
      type: 'move',
      fieldName,
      before,
      after,
      timestamp: Date.now()
    })

    isDirty.value = true
    return true
  }

  /**
   * Duplica um campo
   */
  function duplicateField(fieldName: string) {
    const field = schema.value.fields.find(f => f.name === fieldName)
    if (!field) return null

    const duplicate = {
      ...field,
      name: `${field.name}_copy_${Date.now()}`,
      label: `${field.label} (Copy)`
    }

    const fieldIndex = schema.value.fields.findIndex(f => f.name === fieldName)
    return addField(duplicate, fieldIndex + 1)
  }

  /**
   * Processa evento de drag and drop
   */
  function handleDragEvent(event: FieldDragEvent) {
    switch (event.action) {
      case 'add':
        if (event.field) {
          addField(event.field, event.targetIndex)
        }
        break

      case 'move':
        if (event.field && event.sourceIndex !== undefined) {
          moveField(event.field.name, event.targetIndex)
        }
        break

      case 'copy':
        if (event.field) {
          const copy = { ...event.field, name: `${event.field.name}_copy` }
          addField(copy, event.targetIndex)
        }
        break
    }
  }

  // ============================================
  // METHODS - SCHEMA MANAGEMENT
  // ============================================

  /**
   * Atualiza propriedades do schema
   */
  function updateSchema(updates: Partial<FormSchema>) {
    const before = cloneSchema(schema.value)

    schema.value = {
      ...schema.value,
      ...updates
    }

    const after = cloneSchema(schema.value)

    addToHistory({
      type: 'update',
      before,
      after,
      timestamp: Date.now()
    })

    isDirty.value = true
  }

  /**
   * Reseta schema para vazio
   */
  function resetSchema() {
    const before = cloneSchema(schema.value)
    schema.value = createEmptySchema()
    const after = cloneSchema(schema.value)

    addToHistory({
      type: 'update',
      before,
      after,
      timestamp: Date.now()
    })

    selectedFieldId.value = null
    isDirty.value = false
  }

  /**
   * Carrega schema externo
   */
  function loadSchema(newSchema: FormSchema) {
    const before = cloneSchema(schema.value)
    schema.value = cloneSchema(newSchema)
    const after = cloneSchema(schema.value)

    addToHistory({
      type: 'update',
      before,
      after,
      timestamp: Date.now()
    })

    selectedFieldId.value = null
    isDirty.value = false
  }

  // ============================================
  // METHODS - HISTORY (UNDO/REDO)
  // ============================================

  function addToHistory(action: HistoryAction) {
    // Remover histórico futuro se não estamos no final
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    history.value.push(action)
    historyIndex.value++

    // Limitar histórico a 50 ações
    if (history.value.length > 50) {
      history.value.shift()
      historyIndex.value--
    }
  }

  function undo() {
    if (!canUndo.value) return

    const action = history.value[historyIndex.value]
    if (!action) return // Guard: action pode ser undefined

    schema.value = cloneSchema(action.before)
    historyIndex.value--
    isDirty.value = true
  }

  function redo() {
    if (!canRedo.value) return

    historyIndex.value++
    const action = history.value[historyIndex.value]
    if (!action) return // Guard: action pode ser undefined

    schema.value = cloneSchema(action.after)
    isDirty.value = true
  }

  function clearHistory() {
    history.value = []
    historyIndex.value = -1
  }

  // ============================================
  // METHODS - VALIDATION
  // ============================================

  function validateSchema(): SchemaValidationResult {
    const errors: SchemaValidationResult['errors'] = []
    const warnings: SchemaValidationResult['warnings'] = []

    // Validar ID
    if (!schema.value.id) {
      errors.push({
        field: '_schema',
        property: 'id',
        message: 'Schema must have an ID'
      })
    }

    // Validar campos
    const fieldNames = new Set<string>()

    for (const field of schema.value.fields) {
      // Nome único
      if (fieldNames.has(field.name)) {
        errors.push({
          field: field.name,
          property: 'name',
          message: `Duplicate field name: ${field.name}`
        })
      }
      fieldNames.add(field.name)

      // Nome válido (sem espaços, caracteres especiais)
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
        errors.push({
          field: field.name,
          property: 'name',
          message: 'Field name must start with letter/underscore and contain only alphanumeric/underscore'
        })
      }

      // Label presente
      if (!field.label) {
        warnings.push({
          field: field.name,
          message: 'Field has no label'
        })
      }

      // Select/Radio precisa de options
      if (['select', 'radio'].includes(field.type) && (!field.options || field.options.length === 0)) {
        errors.push({
          field: field.name,
          property: 'options',
          message: `${field.type} field requires options`
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // ============================================
  // METHODS - EXPORT
  // ============================================

  function exportSchema(options: Partial<ExportOptions> = {}): string {
    const opts: ExportOptions = {
      format: 'json',
      includeDefaults: false,
      minify: false,
      includeComments: true,
      validate: true,
      ...options
    }

    // Validar se solicitado
    if (opts.validate) {
      const validation = validateSchema()
      if (!validation.isValid) {
        throw new Error(`Schema validation failed: ${validation.errors.map(e => e.message).join(', ')}`)
      }
    }

    switch (opts.format) {
      case 'json':
        return exportAsJSON(opts)

      case 'typescript':
        return exportAsTypeScript(opts)

      case 'vue':
        return exportAsVue(opts)

      case 'html':
        return exportAsHTML(opts)

      default:
        return exportAsJSON(opts)
    }
  }

  function exportAsJSON(opts: ExportOptions): string {
    const data = opts.includeDefaults ? schema.value : removeDefaults(schema.value)
    return opts.minify ? JSON.stringify(data) : JSON.stringify(data, null, 2)
  }

  function exportAsTypeScript(opts: ExportOptions): string {
    const json = exportAsJSON({ ...opts, minify: false })
    return `import type { FormSchema } from '@lugand-sistemas-ltda/vue-ui-lib'\n\nexport const formSchema: FormSchema = ${json}`
  }

  function exportAsVue(opts: ExportOptions): string {
    const json = exportAsJSON({ ...opts, minify: false })
    return `<template>
  <FormRenderer
    :schema="schema"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { FormRenderer } from '@lugand-sistemas-ltda/vue-ui-lib'
import type { FormSchema } from '@lugand-sistemas-ltda/vue-ui-lib'

const schema: FormSchema = ${json}

function handleSubmit(data: Record<string, any>) {
  console.log('Form submitted:', data)
}
</script>`
  }

  function exportAsHTML(_opts: ExportOptions): string {
    // Gerar HTML nativo do form
    let html = `<form id="${schema.value.id}">\n`

    for (const field of schema.value.fields) {
      html += `  <div class="form-field">\n`
      html += `    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>\n`
      html += `    <input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} />\n`
      html += `  </div>\n`
    }

    html += `  <button type="submit">Submit</button>\n`
    html += `</form>`

    return html
  }

  // ============================================
  // METHODS - SELECTION
  // ============================================

  function selectField(fieldName: string | null) {
    selectedFieldId.value = fieldName
  }

  function selectNext() {
    if (!selectedFieldId.value) {
      if (schema.value.fields.length > 0) {
        const firstField = schema.value.fields[0]
        if (firstField) {
          selectedFieldId.value = firstField.name
        }
      }
      return
    }

    const currentIndex = schema.value.fields.findIndex(f => f.name === selectedFieldId.value)
    if (currentIndex < schema.value.fields.length - 1) {
      const nextField = schema.value.fields[currentIndex + 1]
      if (nextField) {
        selectedFieldId.value = nextField.name
      }
    }
  }

  function selectPrevious() {
    if (!selectedFieldId.value) return

    const currentIndex = schema.value.fields.findIndex(f => f.name === selectedFieldId.value)
    if (currentIndex > 0) {
      const prevField = schema.value.fields[currentIndex - 1]
      if (prevField) {
        selectedFieldId.value = prevField.name
      }
    }
  }

  // ============================================
  // WATCHERS
  // ============================================

  // Sync com initialSchema prop
  watch(
    () => initialSchema?.value,
    (newSchema) => {
      if (newSchema && !isDirty.value) {
        schema.value = cloneSchema(newSchema)
      }
    },
    { deep: true }
  )

  // ============================================
  // HELPERS
  // ============================================

  function createEmptySchema(): FormSchema {
    return {
      id: `form_${Date.now()}`,
      fields: []
    }
  }

  function cloneSchema(s: FormSchema): FormSchema {
    return JSON.parse(JSON.stringify(s))
  }

  function removeDefaults(s: FormSchema): FormSchema {
    // Remove propriedades com valores padrão
    const clone = cloneSchema(s)

    clone.fields = clone.fields.map(field => {
      const cleaned: any = { ...field }

      // Remove false booleans
      if (cleaned.required === false) delete cleaned.required
      if (cleaned.disabled === false) delete cleaned.disabled
      if (cleaned.readonly === false) delete cleaned.readonly

      return cleaned
    })

    return clone
  }

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    schema,
    selectedFieldId,
    selectedField,
    mode,
    isDirty,
    settings: builderSettings,

    // Computed
    canUndo,
    canRedo,
    fieldCount,
    hasChanges,

    // Field Methods
    addField,
    removeField,
    updateField,
    moveField,
    duplicateField,
    handleDragEvent,

    // Schema Methods
    updateSchema,
    resetSchema,
    loadSchema,

    // History Methods
    undo,
    redo,
    clearHistory,

    // Validation
    validateSchema,

    // Export
    exportSchema,

    // Selection
    selectField,
    selectNext,
    selectPrevious
  }
}
