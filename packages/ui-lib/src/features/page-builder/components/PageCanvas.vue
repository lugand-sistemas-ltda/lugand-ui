<!--
  @file FASE 5 - Page Canvas
  @description Área central de design com drag-drop de widgets
-->

<template>
  <div class="page-canvas">
    <!-- Page Header -->
    <div class="page-header">
      <input :value="schema.metadata.title" type="text" class="page-title-input" placeholder="Page Title"
        @input="updatePageTitle" />
      <input :value="schema.id" type="text" class="page-route-input" placeholder="page-id" @input="updatePageId" />
    </div>

    <!-- Canvas Area -->
    <div :class="['canvas-area', { 'drag-over': isDragOver }]" @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave" @drop.prevent="handleDrop">
      <!-- Widgets -->
      <div v-if="schema.widgets.length > 0" class="widget-tree">
        <WidgetTreeItem v-for="(widget, index) in schema.widgets" :key="widget.id" :widget="widget" :index="index"
          :parent-id="null" :selected-id="selectedWidgetId" :hovered-id="hoveredWidgetId" @select="handleSelect"
          @hover="handleHover" @remove="handleRemove" @duplicate="handleDuplicate" @drag-start="handleWidgetDragStart"
          @drag-end="handleWidgetDragEnd" @drop="handleWidgetDrop" />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-canvas">
        <div class="empty-icon">📝</div>
        <div class="empty-title">No widgets yet</div>
        <div class="empty-text">
          Drag widgets from the left palette to start building your page
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PageSchema, WidgetSchema } from '../types'
import WidgetTreeItem from './WidgetTreeItem.vue'

// ============================================
// PROPS
// ============================================

interface Props {
  schema: PageSchema
  selectedWidgetId: string | null
  hoveredWidgetId: string | null
}

const props = defineProps<Props>()

// ============================================
// EMITS
// ============================================

const emit = defineEmits<{
  'update:schema': [schema: Partial<PageSchema>]
  'update:selectedWidgetId': [id: string | null]
  'update:hoveredWidgetId': [id: string | null]
  'widget-add': [widget: Omit<WidgetSchema, 'id'>, parentId: string | null, index: number]
  'widget-remove': [widgetId: string]
  'widget-duplicate': [widgetId: string]
  'widget-move': [widgetId: string, newParentId: string | null, newIndex: number]
}>()

// ============================================
// STATE
// ============================================

const isDragOver = ref(false)
const draggedWidget = ref<{ widget: WidgetSchema; parentId: string | null; index: number } | null>(null)

// ============================================
// METHODS
// ============================================

function updatePageTitle(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:schema', {
    metadata: {
      ...props.schema.metadata,
      title: target.value
    }
  })
}

function updatePageId(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:schema', {
    id: target.value
  })
}

function handleDragOver(e: DragEvent) {
  isDragOver.value = true
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleDrop(e: DragEvent) {
  isDragOver.value = false

  if (!e.dataTransfer) return

  try {
    const data = JSON.parse(e.dataTransfer.getData('application/json'))

    if (data.type === 'palette-widget') {
      // Widget from palette
      emit('widget-add', data.widget, null, props.schema.widgets.length)
    }
  } catch (err) {
    console.error('Failed to parse drop data:', err)
  }
}

function handleSelect(widgetId: string | null) {
  emit('update:selectedWidgetId', widgetId)
}

function handleHover(widgetId: string | null) {
  emit('update:hoveredWidgetId', widgetId)
}

function handleRemove(widgetId: string) {
  emit('widget-remove', widgetId)
}

function handleDuplicate(widgetId: string) {
  emit('widget-duplicate', widgetId)
}

function handleWidgetDragStart(widget: WidgetSchema, parentId: string | null, index: number) {
  draggedWidget.value = { widget, parentId, index }
}

function handleWidgetDragEnd() {
  draggedWidget.value = null
}

function handleWidgetDrop(targetParentId: string | null, targetIndex: number) {
  if (!draggedWidget.value) return

  const { widget, parentId: sourceParentId, index: sourceIndex } = draggedWidget.value

  // Don't move if same position
  if (sourceParentId === targetParentId && sourceIndex === targetIndex) {
    return
  }

  emit('widget-move', widget.id, targetParentId, targetIndex)
  draggedWidget.value = null
}
</script>

<style scoped>
.page-canvas {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background);
  overflow: hidden;
}

/* Page Header */
.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.page-title-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1.25rem;
  font-weight: 600;
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.2s;
}

.page-title-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.page-route-input {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  background: var(--color-background);
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.page-route-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

/* Canvas Area */
.canvas-area {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  min-height: 400px;
  transition: all 0.2s;
}

.canvas-area.drag-over {
  background: var(--color-primary-alpha);
  border: 2px dashed var(--color-primary);
}

/* Widget Tree */
.widget-tree {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Empty Canvas */
.empty-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: var(--spacing-xl);
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.3;
  margin-bottom: var(--spacing-lg);
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.empty-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  max-width: 400px;
  line-height: 1.6;
}

/* Scrollbar */
.canvas-area::-webkit-scrollbar {
  width: 8px;
}

.canvas-area::-webkit-scrollbar-track {
  background: transparent;
}

.canvas-area::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

.canvas-area::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}
</style>
