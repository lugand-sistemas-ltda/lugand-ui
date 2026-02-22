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
import { watch, toRef } from 'vue'
import { Button } from '../../../shared/components'
import { FormRenderer } from '../../form-renderer'
import type { FormSchema, FormField } from '../../form-renderer/types'
import type {
  FieldTypePalette,
  FormTemplate,
  BuilderSettings,
  SchemaValidationResult
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
  'field-select': [fieldName: string | null]
  'field-add': [field: FormField]
  'field-remove': [fieldName: string]
  'field-update': [fieldName: string, updates: Partial<FormField>]
  'field-move': [fieldName: string, newIndex: number]
  'validate': [result: SchemaValidationResult]
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
} = useFormBuilder(
  toRef(props, 'modelValue'),
  props.settings
)

// Set initial mode
mode.value = props.initialMode

// ============================================
// WATCHERS
// ============================================

// Emit modelValue updates
watch(schema, (newSchema) => {
  emit('update:modelValue', newSchema)
}, { deep: true })

// Emit field selection
watch(selectedField, (field) => {
  emit('field-select', field?.name || null)
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
  addField(field, index)
  emit('field-add', field)
}

function handleFieldRemove(field: FormField, _index: number) {
  removeField(field.name)
  emit('field-remove', field.name)
}

function handleFieldUpdate(field: FormField, changes: Partial<FormField>) {
  updateField(field.name, changes)
  emit('field-update', field.name, changes)
}

function handleFieldMove(fieldName: string, newIndex: number) {
  moveField(fieldName, newIndex)
}

function handleFieldPropsUpdate(updates: Partial<FormField>) {
  if (selectedField.value) {
    updateField(selectedField.value.name, updates)
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
  isDirty.value = false
}

function handleExport() {
  try {
    const exported = exportSchema({ format: 'json', minify: false })
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
  background: var(--primary-color, #fafafa);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 0.5rem;
  overflow: hidden;
}

.builder-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--surface-color, #fff);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-section button.active {
  background: var(--primary-color, #2563eb);
  color: white;
}

.field-count {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
  padding: 0 0.5rem;
}

.builder-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.builder-sidebar {
  width: 280px;
  flex-shrink: 0;
  overflow: hidden;
}

.builder-canvas {
  flex: 1;
  overflow: auto;
  background: var(--surface-color, #fff);
}

.canvas-design,
.canvas-preview,
.canvas-code {
  height: 100%;
  padding: 2rem;
}

.canvas-preview {
  max-width: 800px;
  margin: 0 auto;
}

.builder-properties {
  width: 320px;
  flex-shrink: 0;
  overflow: hidden;
  border-left: 1px solid var(--border-color, #e0e0e0);
}
</style>
