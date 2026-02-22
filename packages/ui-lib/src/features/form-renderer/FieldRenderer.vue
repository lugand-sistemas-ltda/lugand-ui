<template>
  <div v-if="shouldShow" :class="[
    'field-renderer',
    `field-renderer--${field.type}`,
    field.className,
    { 'field-renderer--error': hasError }
  ]" :style="fieldStyle">
    <!-- Label -->
    <label v-if="field.label && field.type !== 'checkbox' && field.type !== 'switch'" :for="fieldId"
      class="field-renderer__label">
      {{ field.label }}
      <span v-if="field.required" class="field-renderer__required">*</span>
    </label>

    <!-- Text inputs -->
    <Input v-if="isTextInput" :id="fieldId" :model-value="modelValue" :type="inputType" :placeholder="field.placeholder"
      :disabled="field.disabled" :readonly="field.readonly" :min="field.min" :max="field.max" :step="field.step"
      :pattern="field.pattern" :accept="field.accept" @update:model-value="handleInput" @blur="handleBlur" />

    <!-- Textarea -->
    <Textarea v-else-if="field.type === 'textarea'" :id="fieldId" :model-value="modelValue"
      :placeholder="field.placeholder" :disabled="field.disabled" :readonly="field.readonly" :rows="field.rows || 3"
      @update:model-value="handleInput" @blur="handleBlur" />

    <!-- Select -->
    <Select v-else-if="field.type === 'select'" :id="fieldId" :model-value="modelValue" :options="selectOptions"
      :disabled="field.disabled" :placeholder="field.placeholder || 'Selecione...'" @update:model-value="handleInput"
      @blur="handleBlur" />

    <!-- Checkbox -->
    <Checkbox v-else-if="field.type === 'checkbox'" :id="fieldId" :model-value="modelValue" :label="field.label"
      :disabled="field.disabled" @update:model-value="handleInput" @blur="handleBlur" />

    <!-- Radio Group -->
    <div v-else-if="field.type === 'radio'" class="field-renderer__radio-group">
      <div v-for="option in field.options" :key="option.value" class="field-renderer__radio-option">
        <input :id="`${fieldId}-${option.value}`" type="radio" :name="field.name" :value="option.value"
          :checked="modelValue === option.value" :disabled="field.disabled || option.disabled"
          @change="handleRadioChange(option.value)" @blur="handleBlur" />
        <label :for="`${fieldId}-${option.value}`">
          {{ option.label }}
        </label>
      </div>
    </div>

    <!-- Switch (usando Checkbox com aparência de switch) -->
    <div v-else-if="field.type === 'switch'" class="field-renderer__switch">
      <Checkbox :id="fieldId" :model-value="modelValue" :label="field.label" :disabled="field.disabled"
        @update:model-value="handleInput" @blur="handleBlur" />
    </div>

    <!-- Hidden -->
    <input v-else-if="field.type === 'hidden'" :id="fieldId" type="hidden" :value="modelValue" />

    <!-- Help text -->
    <p v-if="field.helpText && !hasError" class="field-renderer__help">
      {{ field.helpText }}
    </p>

    <!-- Errors -->
    <div v-if="hasError && showErrors" class="field-renderer__errors">
      <p v-for="(error, index) in errors" :key="index" class="field-renderer__error-message">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * FieldRenderer
 * 
 * Renderiza um campo individual de formulário baseado em FormField.
 * 
 * @component FieldRenderer
 */

import { computed } from 'vue'
import type { FormField } from './types'
import { Input, Textarea, Select, Checkbox } from '../../shared/components'

/**
 * Props
 */
interface Props {
  /** Definição do campo */
  field: FormField

  /** Valor atual do campo */
  modelValue: any

  /** Erros de validação */
  errors?: string[]

  /** Se deve mostrar erros */
  showErrors?: boolean

  /** Dados completos do form (para showIf) */
  formData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => [],
  showErrors: true,
  formData: () => ({})
})

/**
 * Emits
 */
const emit = defineEmits<{
  'update:modelValue': [value: any]
  blur: [fieldName: string]
}>()

/**
 * ID único do campo.
 */
const fieldId = computed(() => `field-${props.field.name}`)

/**
 * Tipos de input text.
 */
const isTextInput = computed(() => {
  return [
    'text',
    'email',
    'password',
    'number',
    'tel',
    'url',
    'date',
    'time',
    'datetime',
    'color',
    'range',
    'file'
  ].includes(props.field.type)
})

/**
 * Tipo do input (mapeado para tipos válidos do Input component).
 */
const inputType = computed(() => {
  const validTypes = ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local', 'month', 'week']
  return validTypes.includes(props.field.type) ? props.field.type as any : 'text'
})

/**
 * Opções do select (mapeadas para formato do Select component).
 */
const selectOptions = computed(() => {
  return (props.field.options || []).map((opt) => ({
    label: opt.label,
    value: opt.value
  }))
})

/**
 * Se campo tem erros.
 */
const hasError = computed(() => {
  return props.errors && props.errors.length > 0
})

/**
 * Se campo deve ser exibido (showIf condition).
 */
const shouldShow = computed(() => {
  if (!props.field.showIf) return true

  if (typeof props.field.showIf === 'function') {
    return props.field.showIf(props.formData)
  }

  // Simple expression evaluation
  try {
    const func = new Function(...Object.keys(props.formData), `return ${props.field.showIf}`)
    return func(...Object.values(props.formData))
  } catch (error) {
    console.warn('[FieldRenderer] Failed to evaluate showIf:', error)
    return true
  }
})

/**
 * Estilo do campo (grid col span).
 */
const fieldStyle = computed(() => {
  if (props.field.colSpan) {
    return {
      gridColumn: `span ${props.field.colSpan}`
    }
  }
  return {}
})

/**
 * Handler de input.
 */
function handleInput(value: any) {
  emit('update:modelValue', value)
}

/**
 * Handler de blur.
 */
function handleBlur() {
  emit('blur', props.field.name)
}

/**
 * Handler de radio change.
 */
function handleRadioChange(value: any) {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.field-renderer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);

  &--hidden {
    display: none;
  }

  &--error {
    .field-renderer__label {
      color: var(--color-danger);
    }
  }
}

.field-renderer__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.field-renderer__required {
  color: var(--color-danger);
  margin-left: 2px;
}

.field-renderer__radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.field-renderer__radio-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  input[type="radio"] {
    margin: 0;
    cursor: pointer;
  }

  label {
    cursor: pointer;
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
  }
}

.field-renderer__switch {
  display: flex;
  align-items: center;
}

.field-renderer__help {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.field-renderer__errors {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.field-renderer__error-message {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  margin: 0;
}
</style>
