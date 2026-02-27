<template>
  <div class="form-builder" :style="{ height }">
    <!-- Toolbar -->
    <div class="builder-toolbar">
      <div class="toolbar-section">
        <Button size="sm" variant="ghost" @click="undo" :disabled="!canUndo" title="Undo (Ctrl+Z)">
          ↶
        </Button>
        <Button size="sm" variant="ghost" @click="redo" :disabled="!canRedo" title="Redo (Ctrl+Y)">
          ↷
        </Button>
      </div>

      <div class="toolbar-section">
        <Button size="sm" variant="ghost" :class="{ active: mode === 'design' }" @click="mode = 'design'">
          🎨 Design
        </Button>
        <Button size="sm" variant="ghost" :class="{ active: mode === 'preview' }" @click="mode = 'preview'">
          👁️ Preview
        </Button>
        <Button size="sm" variant="ghost" :class="{ active: mode === 'code' }" @click="mode = 'code'">
          💻 Code
        </Button>
      </div>

      <div class="toolbar-section">
        <span class="field-count">{{ fieldCount }} fields</span>
        <Button size="sm" @click="handleExport">Export</Button>
        <Button size="sm" variant="secondary" @click="handleSave" :disabled="!hasChanges">
          {{ hasChanges ? 'Save *' : 'Saved' }}
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="builder-content">
      <!-- Left Sidebar - Field Palette -->
      <div v-if="mode === 'design'" class="builder-sidebar">
        <FieldPalette :custom-fields="customFields" @field-drag-start="handleFieldDragStart"
          @field-drag-end="handleFieldDragEnd" />
      </div>

      <!-- Canvas -->
      <div class="builder-canvas">
        <!-- Design Mode -->
        <div v-if="mode === 'design'" class="canvas-design">
          <DesignCanvas v-model:schema="schema" v-model:selected-field-id="selectedFieldId" :settings="settings"
            @field-add="handleFieldAdd" @field-remove="handleFieldRemove" @field-update="handleFieldUpdate"
            @field-move="handleFieldMove" />
        </div>

        <!-- Preview Mode -->
        <div v-else-if="mode === 'preview'" class="canvas-preview">
          <FormRenderer :schema="schema" @submit="handlePreviewSubmit" />
        </div>

        <!-- Code Mode -->
        <div v-else-if="mode === 'code'" class="canvas-code">
          <CodeEditor :schema="schema" @update:schema="handleCodeUpdate" />
        </div>
      </div>

      <!-- Right Sidebar - Properties Panel -->
      <div v-if="mode === 'design' && selectedField" class="builder-properties">
        <PropertiesPanel :field="selectedField" @update:field="handleFieldPropsUpdate"
          @close="selectedFieldId = null" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { Button } from '../../../shared/components'
import { FormRenderer } from '../../form-renderer'
import type { FormSchema, FormField } from '../types'
import type {
  FieldTypePalette,
  FormTemplate,
  BuilderSettings
} from '../types'
import { useFormBuilder } from '../useFormBuilder'
import FieldPalette from './FieldPalette.vue'
import DesignCanvas from './DesignCanvas.vue'
import PropertiesPanel from './PropertiesPanel.vue'
import CodeEditor from './CodeEditor.vue'

// ============================================
// PROPS & EMITS
// ============================================

const props = withDefaults(defineProps<{
  modelValue?: FormSchema
  initialMode?: 'design' | 'preview' | 'code'
  templates?: FormTemplate[]
  customFields?: FieldTypePalette[]
  readonly?: boolean
  onAutoSave?: (schema: FormSchema) => void
  height?: string
  settings?: Partial<BuilderSettings>
}>(), {
  initialMode: 'design',
  readonly: false,
  height: '600px'
})

const emit = defineEmits<{
  'update:modelValue': [schema: FormSchema]
  'field-select': [fieldId: string | null]
  'field-add': [field: FormField]
  'field-remove': [fieldId: string]
  'field-update': [fieldId: string, updates: Partial<FormField>]
  'field-move': [fieldId: string, newIndex: number]
  'validate': [result: any]
  'export': [schema: FormSchema, format: 'json' | 'typescript' | 'vue' | 'html']
  'mode-change': [mode: 'design' | 'preview' | 'code']
}>()

// ============================================
// COMPOSABLE
// ============================================

const {
  schema,
  selectedFieldId,
  selectedField,
  mode,
  isDirty,
  settings,
  canUndo,
  canRedo,
  fieldCount,
  hasChanges,
  addField,
  removeField,
  updateField,
  moveField,
  undo,
  redo,
  exportSchema,
  loadSchema
} = useFormBuilder({
  initialSchema: props.modelValue,
  settings: props.settings
})

// Set initial mode
mode.value = props.initialMode

// ============================================
// WATCHERS
// ============================================

// Emit modelValue updates
watch(schema, (newSchema) => {
  // Cast para ajudar TypeScript com inferência de tipo
  emit('update:modelValue', newSchema as FormSchema)
}, { deep: true })

// Emit field selection
watch(selectedField, (field) => {
  emit('field-select', field?.id || null)
})

// Emit mode changes
watch(mode, (newMode) => {
  emit('mode-change', newMode)
})

// Load external schema changes
watch(() => props.modelValue, (newSchema) => {
  if (newSchema && !isDirty.value) {
    loadSchema(newSchema)
  }
}, { deep: true })

// ============================================
// METHODS
// ============================================

function handleFieldDragStart(_field: FieldTypePalette) {
  // Could add visual feedback
}

function handleFieldDragEnd() {
  // Clean up visual feedback
}

function handleFieldAdd(field: FormField, index: number) {
  addField(field.type, field.props || {}, index)
  emit('field-add', field)
}

function handleFieldRemove(field: FormField) {
  removeField(field.id!)
  emit('field-remove', field.id!)
}

function handleFieldUpdate(field: FormField, changes: Partial<FormField>) {
  updateField(field.id!, changes)
  emit('field-update', field.id!, changes)
}

function handleFieldMove(fieldName: string, newIndex: number) {
  moveField(fieldName, newIndex)
}

function handleFieldPropsUpdate(updates: Partial<FormField>) {
  if (selectedField.value) {
    updateField(selectedField.value.id!, { props: { ...selectedField.value.props, ...updates.props } })
  }
}

function handlePreviewSubmit(data: Record<string, any>) {
  console.log('Preview form submitted:', data)
}

function handleCodeUpdate(newSchema: FormSchema) {
  loadSchema(newSchema)
}

function handleSave() {
  if (props.onAutoSave) {
    props.onAutoSave(schema.value)
  }
  // isDirty é readonly computed, não pode ser setado diretamente
  // Seria necessário um método markAsClean() no composable
}

function handleExport() {
  try {
    const exported = exportSchema()
    emit('export', schema.value, 'json')

    // Download file
    const blob = new Blob([exported], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${schema.value.id || 'form'}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
  }
}
</script>

<style scoped>
.form-builder {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.builder-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-base);
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.toolbar-section button.active {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
}

.field-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding: 0 var(--spacing-sm);
}

.builder-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.builder-sidebar {
  width: var(--sidebar-width-md);
  flex-shrink: 0;
  overflow: hidden;
}

.builder-canvas {
  flex: 1;
  overflow: auto;
  background: var(--canvas-bg);
}

.canvas-design,
.canvas-preview,
.canvas-code {
  height: 100%;
  padding: var(--spacing-xl);
}

.canvas-preview {
  max-width: 800px;
  margin: 0 auto;
}

.builder-properties {
  width: var(--sidebar-width-lg);
  flex-shrink: 0;
  overflow: hidden;
  border-left: 1px solid var(--color-border-base);
}
</style>
