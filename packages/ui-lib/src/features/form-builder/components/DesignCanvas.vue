<template>
  <div class="design-canvas">
    <div class="canvas-header">
      <Input :model-value="schema.metadata?.title || ''" @update:model-value="updateSchemaTitle" placeholder="Form Title"
        class="title-input" />
      <Input :model-value="schema.metadata?.description || ''" @update:model-value="updateSchemaDescription"
        placeholder="Form Description" class="description-input" />
    </div>

    <div class="canvas-drop-zone" @drop="handleDrop" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave"
      :class="{ 'drag-over': isDragOver }">
      <!-- Fields List -->
      <div v-if="schema.items && schema.items.length > 0" class="fields-list">
        <div v-for="(field, index) in schema.items" :key="field.id"
          :class="['field-item', { selected: isSelected(field) }]" :draggable="true" @click="selectField(field)"
          @dragstart="handleFieldDragStart(field, index, $event)" @dragover.prevent="handleFieldDragOver(index)"
          @drop.stop="handleFieldDrop(index, $event)">
          <div class="field-header">
            <div class="field-icon">{{ getFieldIcon(field.type) }}</div>
            <div class="field-info">
              <div class="field-name">{{ field.id }}</div>
              <div class="field-label">{{ field.props?.label }}</div>
            </div>
            <Button size="sm" variant="ghost" @click.stop="duplicateField(field)">📋</Button>
            <Button size="sm" variant="ghost" @click.stop="removeFieldAtIndex(index)">🗑️</Button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="canvas-empty">
        <div class="empty-icon">📝</div>
        <div class="empty-title">No fields yet</div>
        <div class="empty-subtitle">Drag fields from the left palette to start building</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from '../../../shared/components'
import type { FormSchema, FormField } from '../types'

interface Props {
  schema: FormSchema
  selectedFieldId: string | null
  settings: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:schema': [schema: FormSchema]
  'update:selectedFieldId': [id: string | null]
  'field-add': [field: FormField, index: number]
  'field-remove': [field: FormField, index: number]
  'field-update': [field: FormField, changes: Partial<FormField>]
  'field-move': [fieldName: string, newIndex: number]
}>()

const isDragOver = ref(false)
const dragOverIndex = ref<number | null>(null)
const draggedField = ref<{ field: FormField; index: number } | null>(null)

function isSelected(field: FormField) {
  return props.selectedFieldId === field.id
}

function selectField(field: FormField) {
  emit('update:selectedFieldId', field.id || null)
}

function updateSchemaTitle(title: string | number) {
  const currentMetadata = props.schema.metadata || { title: '' }
  emit('update:schema', { 
    ...props.schema, 
    metadata: { 
      ...currentMetadata,
      title: String(title)
    }
  })
}

function updateSchemaDescription(description: string | number) {
  const currentMetadata = props.schema.metadata || { title: '' }
  emit('update:schema', { 
    ...props.schema, 
    metadata: { 
      ...currentMetadata,
      description: String(description)
    }
  })
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false

  const data = event.dataTransfer?.getData('application/json')
  if (!data) return

  try {
    const parsed = JSON.parse(data)
    if (parsed.type === 'palette-field' && parsed.field) {
      emit('field-add', parsed.field as FormField, props.schema.items?.length || 0)
    }
  } catch (error) {
    console.error('Failed to parse drag data:', error)
  }
}

function handleFieldDragStart(field: FormField, index: number, event: DragEvent) {
  draggedField.value = { field, index }
  event.dataTransfer!.effectAllowed = 'move'
}

function handleFieldDragOver(index: number) {
  dragOverIndex.value = index
}

function handleFieldDrop(targetIndex: number, event: DragEvent) {
  event.preventDefault()

  if (draggedField.value) {
    // Internal move
    const fieldId = draggedField.value.field.id
    if (fieldId) {
      emit('field-move', fieldId, targetIndex)
    }
    draggedField.value = null
  } else {
    // External drop from palette
    const data = event.dataTransfer?.getData('application/json')
    if (data) {
      try {
        const parsed = JSON.parse(data)
        if (parsed.type === 'palette-field' && parsed.field) {
          emit('field-add', parsed.field as FormField, targetIndex)
        }
      } catch (error) {
        console.error('Failed to parse drag data:', error)
      }
    }
  }

  dragOverIndex.value = null
}

function removeFieldAtIndex(index: number) {
  if (!props.schema.items) return
  const field = props.schema.items[index]
  if (!field) return // Guard: field pode ser undefined

  emit('field-remove', field, index)
}

function duplicateField(field: FormField) {
  const duplicate: FormField = {
    ...field,
    id: `${field.id}_copy_${Date.now()}`,
    props: {
      ...field.props,
      label: `${field.props?.label || field.id} (Copy)`
    }
  }
  const index = props.schema.items?.findIndex(f => f.id === field.id) ?? -1
  emit('field-add', duplicate, index + 1)
}

function getFieldIcon(type: string): string {
  const icons: Record<string, string> = {
    text: '📝',
    email: '✉️',
    password: '🔒',
    number: '🔢',
    textarea: '📄',
    select: '📋',
    radio: '🔘',
    checkbox: '☑️',
    switch: '🎚️',
    date: '📅',
    time: '🕐',
    file: '📎',
    color: '🎨',
    range: '🎚️',
    tel: '📞',
    url: '🔗'
  }
  return icons[type] || '❓'
}
</script>

<style scoped>
.design-canvas {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.canvas-header {
  margin-bottom: 1.5rem;
}

.title-input {
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.description-input {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.canvas-drop-zone {
  flex: 1;
  min-height: 300px;
  border: 2px dashed var(--color-border-base);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.canvas-drop-zone.drag-over {
  border-color: var(--color-primary);
  background: var(--color-primary-alpha);
}

.fields-list {
  padding: var(--spacing-lg);
}

.field-item {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--color-bg-elevated);
  border: 2px solid var(--color-border-base);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.field-item:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.field-item.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-alpha);
}

.field-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.field-icon {
  font-size: 1.5rem;
}

.field-info {
  flex: 1;
}

.field-name {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-family: var(--editor-font-family);
}

.field-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-top: var(--spacing-2xs);
}

.canvas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-xl);
  text-align: center;
}

.empty-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-lg);
  opacity: 0.3;
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.empty-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
