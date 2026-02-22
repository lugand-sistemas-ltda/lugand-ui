<!--
  @file FASE 5 - Widget Properties Panel
  @description Painel lateral direito para editar propriedades do widget selecionado
-->

<template>
  <div class="widget-properties-panel">
    <!-- Header -->
    <div class="panel-header">
      <h3 class="panel-title">Widget Properties</h3>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <!-- No Selection -->
    <div v-if="!widget" class="no-selection">
      <div class="no-selection-icon">👆</div>
      <div class="no-selection-text">Select a widget to edit its properties</div>
    </div>

    <!-- Widget Properties -->
    <div v-else class="panel-content">
      <!-- Widget Info -->
      <div class="property-section">
        <div class="section-title">Widget Info</div>
        
        <div class="property-group">
          <label class="property-label">ID</label>
          <input
            :value="widget.id"
            type="text"
            class="property-input"
            disabled
          />
        </div>

        <div class="property-group">
          <label class="property-label">Type</label>
          <input
            :value="widget.type"
            type="text"
            class="property-input"
            disabled
          />
        </div>
      </div>

      <!-- Editable Properties -->
      <div v-if="editableProps.length > 0" class="property-section">
        <div class="section-title">Properties</div>

        <div
          v-for="prop in editableProps"
          :key="prop.name"
          class="property-group"
        >
          <label class="property-label">
            {{ prop.label }}
            <span v-if="prop.required" class="required">*</span>
          </label>

          <!-- Text Input -->
          <input
            v-if="prop.inputType === 'text'"
            :value="getPropertyValue(prop.name)"
            type="text"
            class="property-input"
            :placeholder="prop.helpText"
            @input="updateProperty(prop.name, ($event.target as HTMLInputElement).value)"
          />

          <!-- Number Input -->
          <input
            v-else-if="prop.inputType === 'number'"
            :value="getPropertyValue(prop.name)"
            type="number"
            class="property-input"
            :placeholder="prop.helpText"
            @input="updateProperty(prop.name, Number(($event.target as HTMLInputElement).value))"
          />

          <!-- Boolean (Checkbox) -->
          <label
            v-else-if="prop.inputType === 'boolean'"
            class="checkbox-label"
          >
            <input
              :checked="getPropertyValue(prop.name)"
              type="checkbox"
              @change="updateProperty(prop.name, ($event.target as HTMLInputElement).checked)"
            />
            <span>{{ prop.helpText || 'Enable' }}</span>
          </label>

          <!-- Select -->
          <select
            v-else-if="prop.inputType === 'select'"
            :value="getPropertyValue(prop.name)"
            class="property-select"
            @change="updateProperty(prop.name, ($event.target as HTMLSelectElement).value)"
          >
            <option
              v-for="option in prop.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- Color -->
          <input
            v-else-if="prop.inputType === 'color'"
            :value="getPropertyValue(prop.name)"
            type="color"
            class="property-color"
            @input="updateProperty(prop.name, ($event.target as HTMLInputElement).value)"
          />

          <!-- JSON Editor -->
          <textarea
            v-else-if="prop.inputType === 'json'"
            :value="JSON.stringify(getPropertyValue(prop.name), null, 2)"
            class="property-textarea"
            rows="6"
            :placeholder="prop.helpText"
            @input="updateJsonProperty(prop.name, ($event.target as HTMLTextAreaElement).value)"
          />

          <!-- Help Text -->
          <div v-if="prop.helpText && prop.inputType !== 'boolean'" class="property-help">
            {{ prop.helpText }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="property-section">
        <div class="section-title">Actions</div>
        <div class="action-buttons">
          <button class="action-btn secondary" @click="$emit('duplicate', widget.id)">
            📋 Duplicate
          </button>
          <button class="action-btn danger" @click="$emit('remove', widget.id)">
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WidgetSchema, EditableWidgetProperty } from '../types'
import { getPaletteItem } from '../widget-palette-config'

// ============================================
// PROPS
// ============================================

interface Props {
  widget: WidgetSchema | null
}

const props = defineProps<Props>()

// ============================================
// EMITS
// ============================================

const emit = defineEmits<{
  'update:widget': [updates: Partial<WidgetSchema>]
  close: []
  remove: [widgetId: string]
  duplicate: [widgetId: string]
}>()

// ============================================
// COMPUTED
// ============================================

const editableProps = computed((): EditableWidgetProperty[] => {
  if (!props.widget) return []
  
  const paletteItem = getPaletteItem(props.widget.type)
  return paletteItem?.editableProps || []
})

// ============================================
// METHODS
// ============================================

function getPropertyValue(propName: string): any {
  if (!props.widget?.config) return undefined
  return props.widget.config[propName]
}

function updateProperty(propName: string, value: any) {
  if (!props.widget) return
  
  emit('update:widget', {
    config: {
      ...props.widget.config,
      [propName]: value
    }
  })
}

function updateJsonProperty(propName: string, jsonString: string) {
  try {
    const value = JSON.parse(jsonString)
    updateProperty(propName, value)
  } catch (err) {
    // Invalid JSON, don't update
    console.warn('Invalid JSON:', err)
  }
}
</script>

<style scoped>
.widget-properties-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
  border-left: 1px solid var(--color-outline-variant);
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-outline-variant);
  background: var(--color-surface-variant);
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-on-surface);
}

.close-btn {
  padding: 4px 8px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-on-surface-variant);
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--color-error);
}

/* No Selection */
.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 20px;
  text-align: center;
  color: var(--color-on-surface-variant);
}

.no-selection-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-selection-text {
  font-size: 14px;
  line-height: 1.5;
}

/* Content */
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.property-section {
  margin-bottom: 24px;
}

.property-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-on-surface);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.property-group {
  margin-bottom: 16px;
}

.property-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-on-surface);
  margin-bottom: 6px;
}

.required {
  color: var(--color-error);
}

.property-input,
.property-select,
.property-textarea {
  width: 100%;
  padding: 8px 12px;
  background: var(--color-background);
  border: 1px solid var(--color-outline);
  border-radius: 6px;
  font-size: 14px;
  color: var(--color-on-surface);
  transition: border-color 0.2s;
}

.property-input:focus,
.property-select:focus,
.property-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.property-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.property-color {
  width: 100%;
  height: 40px;
  padding: 4px;
  background: var(--color-background);
  border: 1px solid var(--color-outline);
  border-radius: 6px;
  cursor: pointer;
}

.property-textarea {
  font-family: 'Courier New', monospace;
  resize: vertical;
  min-height: 100px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.property-help {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-on-surface-variant);
  line-height: 1.4;
}

.children-count {
  padding: 12px;
  background: var(--color-surface-variant);
  border-radius: 6px;
  font-size: 14px;
  color: var(--color-on-surface-variant);
}

/* Actions */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  padding: 10px 16px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--color-secondary-container);
  color: var(--color-on-secondary-container);
}

.action-btn.danger {
  background: var(--color-error-container);
  color: var(--color-on-error-container);
}

.action-btn.danger:hover {
  background: var(--color-error);
  color: var(--color-on-error);
}
</style>
