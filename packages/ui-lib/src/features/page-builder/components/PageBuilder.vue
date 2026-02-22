<template>
  <div class="page-builder" :style="{ height }">
    <!-- Toolbar -->
    <div class="page-builder__toolbar">
      <div class="toolbar__left">
        <!-- Undo/Redo -->
        <Button variant="ghost" size="sm" :disabled="!canUndo" @click="undo" title="Undo (Ctrl+Z)">
          ↶
        </Button>
        <Button variant="ghost" size="sm" :disabled="!canRedo" @click="redo" title="Redo (Ctrl+Y)">
          ↷
        </Button>

        <div class="toolbar__separator" />

        <!-- Mode Switcher -->
        <div class="toolbar__mode-switcher">
          <button :class="['mode-btn', { active: mode === 'design' }]" @click="mode = 'design'">
            🎨 Design
          </button>
          <button :class="['mode-btn', { active: mode === 'preview' }]" @click="mode = 'preview'">
            👁️ Preview
          </button>
          <button :class="['mode-btn', { active: mode === 'code' }]" @click="mode = 'code'">
            💻 Code
          </button>
        </div>
      </div>

      <div class="toolbar__right">
        <!-- Widget Count -->
        <span class="toolbar__info">
          {{ widgetCount }} widgets
        </span>

        <div class="toolbar__separator" />

        <!-- Save Button -->
        <Button variant="primary" size="sm" @click="handleSave" :disabled="!isDirty">
          💾 Save{{ isDirty ? ' *' : '' }}
        </Button>

        <!-- Export Button -->
        <Button variant="secondary" size="sm" @click="handleExport">
          📤 Export
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-builder__content">
      <!-- Left Sidebar - Widget Palette (design mode only) -->
      <div v-if="mode === 'design'" class="page-builder__sidebar page-builder__sidebar--left">
        <WidgetPalette @widget-drag-start="handleWidgetDragStart" @widget-drag-end="handleWidgetDragEnd" />
      </div>

      <!-- Canvas Area -->
      <div class="page-builder__canvas">
        <PageCanvas v-if="mode === 'design'" :schema="schema" :selected-widget-id="selectedWidgetId"
          :hovered-widget-id="hoveredWidgetId" @update:schema="handleSchemaUpdate"
          @update:selected-widget-id="selectWidget" @widget-add="handleWidgetAdd" @widget-remove="handleWidgetRemove"
          @widget-move="handleWidgetMove" />

        <!-- Preview Mode (TODO: Implementar PageRenderer) -->
        <div v-else-if="mode === 'preview'" class="preview-mode">
          <div class="preview-placeholder">
            <h3>Preview Mode</h3>
            <p>Preview mode will be available when PageRenderer is implemented.</p>
            <p>For now, use Code mode to see the generated schema.</p>
          </div>
        </div>

        <!-- Code Mode -->
        <CodeEditor v-else-if="mode === 'code'" :schema="schema" @update:schema="handleCodeUpdate" />
      </div>

      <!-- Right Sidebar - Properties Panel (design mode, widget selected) -->
      <div v-if="mode === 'design' && selectedWidget" class="page-builder__sidebar page-builder__sidebar--right">
        <WidgetPropertiesPanel :widget="selectedWidget" @update:widget="handleWidgetPropsUpdate"
          @close="selectWidget(null)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, toRef } from 'vue'
import { Button } from '../../../shared/components'
import type { PageSchema, WidgetSchema } from '../../../core/schema-system/types'
import type { WidgetTypePalette } from '../types'
import { usePageBuilder } from '../usePageBuilder'
import WidgetPalette from './WidgetPalette.vue'
import PageCanvas from './PageCanvas.vue'
import WidgetPropertiesPanel from './WidgetPropertiesPanel.vue'
import CodeEditor from './CodeEditor.vue'
// TODO: PageRenderer será criado quando houver necessidade
// import PageRenderer from '../../../core/widget-system/components/PageRenderer.vue'

// ============================================
// PROPS & EMITS
// ============================================

const props = withDefaults(defineProps<{
  modelValue?: PageSchema
  initialMode?: 'design' | 'preview' | 'code'
  templates?: any[]
  customWidgets?: WidgetTypePalette[]
  readonly?: boolean
  onAutoSave?: (schema: PageSchema) => void
  height?: string
  settings?: any
}>(), {
  initialMode: 'design',
  readonly: false,
  height: '800px'
})

const emit = defineEmits<{
  'update:modelValue': [schema: PageSchema]
  'widget-select': [widgetId: string | null]
  'widget-add': [widget: WidgetSchema]
  'widget-remove': [widgetId: string]
  'widget-update': [widgetId: string, updates: Partial<WidgetSchema>]
  'widget-move': [widgetId: string, newIndex: number]
  'validate': [result: any]
  'export': [schema: PageSchema, format: 'json' | 'typescript' | 'vue']
  'mode-change': [mode: 'design' | 'preview' | 'code']
}>()

// ============================================
// STATE
// ============================================

const {
  schema,
  selectedWidgetId,
  selectedWidget,
  mode,
  isDirty,
  hoveredWidgetId,
  canUndo,
  canRedo,
  widgetCount,
  addWidget,
  removeWidget,
  updateWidget,
  moveWidget,
  undo,
  redo,
  exportSchema,
  selectWidget,
  updateSchema
} = usePageBuilder(
  toRef(props, 'modelValue'),
  props.settings
)

// ============================================
// HANDLERS
// ============================================

function handleWidgetDragStart(_widget: WidgetTypePalette) {
  // Visual feedback pode ser adicionado aqui
}

function handleWidgetDragEnd() {
  // Limpar feedback visual
}

function handleSchemaUpdate(updates: Partial<PageSchema>) {
  updateSchema(updates)
}

function handleWidgetAdd(widget: Omit<WidgetSchema, 'id'>, parentId: string | null, index: number) {
  const id = addWidget(widget, parentId, index)
  emit('widget-add', { ...widget, id })
}

function handleWidgetRemove(widgetId: string) {
  removeWidget(widgetId)
  emit('widget-remove', widgetId)
}

function handleWidgetMove(widgetId: string, newParentId: string | null, newIndex: number) {
  moveWidget(widgetId, newParentId, newIndex)
  emit('widget-move', widgetId, newIndex)
}

function handleWidgetPropsUpdate(updates: Partial<WidgetSchema>) {
  if (selectedWidget.value) {
    updateWidget(selectedWidget.value.id, updates)
    emit('widget-update', selectedWidget.value.id, updates)
  }
}

function handleCodeUpdate(newSchema: PageSchema) {
  updateSchema(newSchema)
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
    a.download = `${schema.value.id || 'page'}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
  }
}

// ============================================
// WATCHERS
// ============================================

// Sync schema changes to parent
watch(schema, (newSchema) => {
  emit('update:modelValue', newSchema)
}, { deep: true })

// Emit widget selection
watch(selectedWidgetId, (id) => {
  emit('widget-select', id)
})

// Emit mode changes
watch(mode, (newMode) => {
  emit('mode-change', newMode)
})

// Load external schema changes
watch(() => props.modelValue, (newSchema) => {
  if (newSchema && !isDirty.value) {
    updateSchema(newSchema)
  }
}, { deep: true })
</script>

<style scoped>
.page-builder {
  display: flex;
  flex-direction: column;
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* ============================================
   TOOLBAR
   ============================================ */

.page-builder__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
  gap: var(--space-sm);
}

.toolbar__left,
.toolbar__right {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.toolbar__separator {
  width: 1px;
  height: 24px;
  background: var(--border);
}

.toolbar__mode-switcher {
  display: flex;
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.mode-btn {
  padding: var(--space-xs) var(--space-md);
  border: none;
  background: transparent;
  color: var(--text-2);
  cursor: pointer;
  transition: all 0.2s;
  font-size: var(--text-sm);
  font-weight: 500;
}

.mode-btn:hover {
  background: var(--surface-hover);
  color: var(--text-1);
}

.mode-btn.active {
  background: var(--primary);
  color: white;
}

.mode-btn:not(:last-child) {
  border-right: 1px solid var(--border);
}

.toolbar__info {
  font-size: var(--text-sm);
  color: var(--text-2);
  padding: var(--space-xs) var(--space-sm);
}

/* ============================================
   CONTENT
   ============================================ */

.page-builder__content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.page-builder__sidebar {
  width: 280px;
  background: var(--surface-2);
  border-right: 1px solid var(--border);
  overflow-y: auto;
}

.page-builder__sidebar--left {
  border-right: 1px solid var(--border);
}

.page-builder__sidebar--right {
  width: 320px;
  border-left: 1px solid var(--border);
  border-right: none;
}

.page-builder__canvas {
  flex: 1;
  background: var(--surface-1);
  overflow: auto;
}

/* ============================================
   PREVIEW MODE
   ============================================ */

.preview-mode {
  height: 100%;
  overflow: auto;
  background: white;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--space-xl);
  text-align: center;
  color: var(--text-2);
}

.preview-placeholder h3 {
  font-size: var(--text-xl);
  color: var(--text-1);
  margin-bottom: var(--space-md);
}

.preview-placeholder p {
  font-size: var(--text-md);
  margin: var(--space-xs) 0;
}
</style>
