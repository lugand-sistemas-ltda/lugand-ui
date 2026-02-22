<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3 class="panel-title">Field Properties</h3>
      <Button size="sm" variant="ghost" @click="emit('close')">✕</Button>
    </div>

    <div class="panel-content">
      <!-- Field Name -->
      <div class="prop-group">
        <label class="prop-label">Name</label>
        <Input :model-value="field.name" @update:model-value="updateProp('name', $event)" placeholder="field_name" />
      </div>

      <!-- Field Label -->
      <div class="prop-group">
        <label class="prop-label">Label</label>
        <Input :model-value="field.label" @update:model-value="updateProp('label', $event)" placeholder="Field Label" />
      </div>

      <!-- Field Type (readonly) -->
      <div class="prop-group">
        <label class="prop-label">Type</label>
        <Input :model-value="field.type" readonly disabled />
      </div>

      <!-- Placeholder -->
      <div class="prop-group">
        <label class="prop-label">Placeholder</label>
        <Input :model-value="field.placeholder || ''" @update:model-value="updateProp('placeholder', $event)"
          placeholder="Enter placeholder..." />
      </div>

      <!-- Required -->
      <div class="prop-group">
        <label class="prop-label checkbox-label">
          <Checkbox :model-value="field.required || false" @update:model-value="updateProp('required', $event)" />
          <span>Required</span>
        </label>
      </div>

      <!-- Disabled -->
      <div class="prop-group">
        <label class="prop-label checkbox-label">
          <Checkbox :model-value="field.disabled || false" @update:model-value="updateProp('disabled', $event)" />
          <span>Disabled</span>
        </label>
      </div>

      <!-- Readonly -->
      <div class="prop-group">
        <label class="prop-label checkbox-label">
          <Checkbox :model-value="field.readonly || false" @update:model-value="updateProp('readonly', $event)" />
          <span>Read-only</span>
        </label>
      </div>

      <!-- Options (for select/radio) -->
      <div v-if="['select', 'radio'].includes(field.type)" class="prop-group">
        <label class="prop-label">Options</label>
        <div class="options-editor">
          <div v-for="(option, index) in (field.options || [])" :key="index" class="option-row">
            <Input :model-value="option.label" @update:model-value="updateOptionLabel(index, $event)"
              placeholder="Label" size="sm" />
            <Input :model-value="option.value" @update:model-value="updateOptionValue(index, $event)"
              placeholder="Value" size="sm" />
            <Button size="sm" variant="ghost" @click="removeOption(index)">×</Button>
          </div>
          <Button size="sm" variant="secondary" @click="addOption">+ Add Option</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Input, Checkbox } from '../../../shared/components'
import type { FormField } from '../../form-renderer/types'

interface Props {
  field: FormField
}

interface Emits {
  (e: 'update:field', updates: Partial<FormField>): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function updateProp(key: string, value: any) {
  emit('update:field', { [key]: value })
}

function updateOptionLabel(index: number, label: string | number) {
  const options = [...(props.field.options || [])]
  if (options[index]) {
    options[index] = { ...options[index], label: String(label), value: options[index].value || '' }
    emit('update:field', { options })
  }
}

function updateOptionValue(index: number, value: string | number) {
  const options = [...(props.field.options || [])]
  if (options[index]) {
    options[index] = { ...options[index], value, label: options[index].label || '' }
    emit('update:field', { options })
  }
}

function addOption() {
  const options = [
    ...(props.field.options || []),
    { label: 'New Option', value: `option_${Date.now()}` }
  ]
  emit('update:field', { options })
}

function removeOption(index: number) {
  const options = [...(props.field.options || [])]
  options.splice(index, 1)
  emit('update:field', { options })
}
</script>

<style scoped>
.properties-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--surface-color, #fff);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.panel-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color, #1a1a1a);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.prop-group {
  margin-bottom: 1rem;
}

.prop-label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color, #1a1a1a);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.options-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  align-items: center;
}
</style>
