<template>
  <div class="design-canvas">
    <div class="canvas-header">
      <Input :model-value="schema.title || ''" @update:model-value="updateSchemaTitle" placeholder="Form Title"
        class="title-input" />
      <Input :model-value="schema.description || ''" @update:model-value="updateSchemaDescription"
        placeholder="Form Description" class="description-input" />
    </div>

    <div class="canvas-drop-zone" @drop="handleDrop" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave"
      :class="{ 'drag-over': isDragOver }">
      <!-- Fields List -->
      <div v-if="schema.fields.length > 0" class="fields-list">
        <div v-for="(field, index) in schema.fields" :key="field.name"
          :class="['field-item', { selected: isSelected(field) }]" :draggable="true" @click="selectField(field)"
          @dragstart="handleFieldDragStart(field, index, $event)" @dragover.prevent="handleFieldDragOver(index)"
          @drop.stop="handleFieldDrop(index, $event)">
          <div class="field-header">
            <div class="field-icon">{{ getFieldIcon(field.type) }}</div>
            <div class="field-info">
              <div class="field-name">{{ field.name }}</div>
              <div class="field-label">{{ field.label }}</div>
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
import type { FormSchema, FormField } from '../../form-renderer/types'

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
  return props.selectedFieldId === field.name
}

function selectField(field: FormField) {
  emit('update:selectedFieldId', field.name)
}

function updateSchemaTitle(title: string | number) {
  emit('update:schema', { ...props.schema, title: String(title) })
}

function updateSchemaDescription(description: string | number) {
  emit('update:schema', { ...props.schema, description: String(description) })
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
      emit('field-add', parsed.field as FormField, props.schema.fields.length)
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
    emit('field-move', draggedField.value.field.name, targetIndex)
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
  const field = props.schema.fields[index]
  if (!field) return // Guard: field pode ser undefined

  emit('field-remove', field, index)
}

function duplicateField(field: FormField) {
  const duplicate: FormField = {
    ...field,
    name: `${field.name}_copy_${Date.now()}`,
    label: `${field.label} (Copy)`
  }
  const index = props.schema.fields.findIndex(f => f.name === field.name)
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
  border: 2px dashed var(--border-color, #e0e0e0);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.canvas-drop-zone.drag-over {
  border-color: var(--primary-color, #2563eb);
  background: rgba(37, 99, 235, 0.05);
}

.fields-list {
  padding: 1rem;
}

.field-item {
  margin-bottom: 0.75rem;
  padding: 1rem;
  background: var(--surface-color, #fff);
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.field-item:hover {
  border-color: var(--primary-color, #2563eb);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.field-item.selected {
  border-color: var(--primary-color, #2563eb);
  background: rgba(37, 99, 235, 0.05);
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
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
  font-family: monospace;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color, #1a1a1a);
  margin-top: 0.125rem;
}

.canvas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color, #1a1a1a);
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
}
</style>
