<!--
  @file FASE 5 - Widget Tree Item
  @description Item da árvore de widgets com drag-drop, seleção e ações
-->

<template>
  <div :class="[
    'widget-tree-item',
    {
      'is-selected': isSelected,
      'is-hovered': isHovered,
      'has-children': hasChildren
    }
  ]" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- Widget Card -->
    <div class="widget-card" draggable="true" @click.stop="handleClick" @dragstart="handleDragStart"
      @dragend="handleDragEnd" @dragover.prevent="handleDragOver" @drop.prevent="handleDrop">
      <!-- Icon & Info -->
      <div class="widget-info">
        <span class="widget-icon">{{ getWidgetIcon(widget.type) }}</span>
        <div class="widget-details">
          <span class="widget-type">{{ widget.type }}</span>
          <span v-if="widget.id" class="widget-id">{{ widget.id }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="isSelected" class="widget-actions">
        <button class="action-btn" title="Duplicate" @click.stop="handleDuplicateClick">
          📋
        </button>
        <button class="action-btn danger" title="Remove" @click.stop="handleRemoveClick">
          🗑️
        </button>
      </div>
    </div>

    <!-- Children (recursive) -->
    <div v-if="hasChildren" class="widget-children">
      <WidgetTreeItem v-for="(child, childIndex) in widget.children" :key="child.id" :widget="child" :index="childIndex"
        :parent-id="widget.id" :selected-id="selectedId" :hovered-id="hoveredId" @select="(id) => $emit('select', id)"
        @hover="(id) => $emit('hover', id)" @remove="(id) => $emit('remove', id)"
        @duplicate="(id) => $emit('duplicate', id)" @drag-start="(w, pId, idx) => $emit('drag-start', w, pId, idx)"
        @drag-end="$emit('drag-end')" @drop="(pId, idx) => $emit('drop', pId, idx)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WidgetSchema } from '../types'

// ============================================
// PROPS
// ============================================

interface Props {
  widget: WidgetSchema
  index: number
  parentId: string | null
  selectedId: string | null
  hoveredId: string | null
}

const props = defineProps<Props>()

// ============================================
// EMITS
// ============================================

const emit = defineEmits<{
  select: [widgetId: string | null]
  hover: [widgetId: string | null]
  remove: [widgetId: string]
  duplicate: [widgetId: string]
  'drag-start': [widget: WidgetSchema, parentId: string | null, index: number]
  'drag-end': []
  drop: [parentId: string | null, index: number]
}>()

// ============================================
// COMPUTED
// ============================================

const isSelected = computed(() => props.selectedId === props.widget.id)
const isHovered = computed(() => props.hoveredId === props.widget.id)
const hasChildren = computed(() =>
  props.widget.children && props.widget.children.length > 0
)

// ============================================
// METHODS
// ============================================

function getWidgetIcon(type: string): string {
  const icons: Record<string, string> = {
    Container: '📦',
    Grid: '▦',
    Section: '📄',
    Text: '📝',
    Image: '🖼️',
    DataTable: '📊',
    Card: '🃏',
    FormRenderer: '📋',
    FormBuilder: '🏗️',
    Tabs: '📑',
    Breadcrumb: '🍞',
    Alert: '⚠️',
    Badge: '🏷️'
  }
  return icons[type] || '🔲'
}

function handleClick() {
  emit('select', props.widget.id)
}

function handleMouseEnter() {
  emit('hover', props.widget.id)
}

function handleMouseLeave() {
  emit('hover', null)
}

function handleRemoveClick() {
  emit('remove', props.widget.id)
}

function handleDuplicateClick() {
  emit('duplicate', props.widget.id)
}

function handleDragStart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'widget-move',
      widgetId: props.widget.id
    }))
  }

  emit('drag-start', props.widget, props.parentId, props.index)
}

function handleDragEnd() {
  emit('drag-end')
}

function handleDragOver(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

function handleDrop(e: DragEvent) {
  if (!e.dataTransfer) return

  try {
    const data = JSON.parse(e.dataTransfer.getData('application/json'))

    if (data.type === 'palette-widget') {
      // Add to this widget's children
      emit('drop', props.widget.id, 0)
    } else if (data.type === 'widget-move') {
      // Move widget to this position
      emit('drop', props.parentId, props.index)
    }
  } catch (err) {
    console.error('Failed to parse drop data:', err)
  }
}
</script>

<style scoped>
.widget-tree-item {
  position: relative;
  margin-bottom: 8px;
}

.widget-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-surface);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: move;
  transition: all 0.2s;
}

.widget-card:hover {
  background: var(--color-surface-variant);
  border-color: var(--color-primary);
}

.is-selected .widget-card {
  background: var(--color-primary-container);
  border-color: var(--color-primary);
}

.is-hovered .widget-card {
  outline: 2px dashed var(--color-secondary);
  outline-offset: 2px;
}

.widget-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.widget-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.widget-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.widget-type {
  font-weight: 600;
  color: var(--color-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.widget-id {
  font-size: 12px;
  font-family: 'Courier New', monospace;
  color: var(--color-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.widget-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 6px 10px;
  background: var(--color-surface-variant);
  border: 1px solid var(--color-outline);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--color-secondary-container);
  border-color: var(--color-secondary);
}

.action-btn.danger:hover {
  background: var(--color-error-container);
  border-color: var(--color-error);
}

.widget-children {
  margin-left: 24px;
  margin-top: 8px;
  padding-left: 16px;
  border-left: 2px solid var(--color-outline-variant);
}

.has-children>.widget-card {
  font-weight: 600;
}
</style>
