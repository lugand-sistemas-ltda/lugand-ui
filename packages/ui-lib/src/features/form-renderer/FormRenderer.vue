<template>
  <form :class="['form-renderer', formClass]" :style="formStyle" @submit.prevent="handleSubmit">
    <!-- Header -->
    <div v-if="schema.title || schema.description" class="form-renderer__header">
      <h2 v-if="schema.title" class="form-renderer__title">
        {{ schema.title }}
      </h2>
      <p v-if="schema.description" class="form-renderer__description">
        {{ schema.description }}
      </p>
    </div>

    <!-- Fields Grid -->
    <div class="form-renderer__fields" :style="gridStyle">
      <FieldRenderer v-for="field in schema.fields" :key="field.name" :field="field" :model-value="formData[field.name]"
        :errors="getFieldErrors(field.name)" :show-errors="shouldShowFieldErrors(field.name)" :form-data="formData"
        @update:model-value="(value) => updateField(field.name, value)" @blur="handleFieldBlur(field.name)" />
    </div>

    <!-- Global Errors -->
    <div v-if="formErrors.global && formErrors.global.length > 0" class="form-renderer__global-errors">
      <p v-for="(error, index) in formErrors.global" :key="index" class="form-renderer__global-error">
        {{ error }}
      </p>
    </div>

    <!-- Actions -->
    <div class="form-renderer__actions">
      <Button type="submit" variant="primary" :loading="submitting" :disabled="submitting || (submitted && !isValid)">
        {{ schema.submitText || 'Enviar' }}
      </Button>

      <Button v-if="schema.cancelText" type="button" variant="ghost" :disabled="submitting" @click="handleCancel">
        {{ schema.cancelText }}
      </Button>

      <Button v-if="schema.showReset" type="button" variant="ghost" :disabled="submitting" @click="handleReset">
        Limpar
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
/**
 * FormRenderer
 * 
 * Renderiza formulário completo a partir de JSON schema.
 * 
 * @component FormRenderer
 */

import { ref, computed, onMounted, watch } from 'vue'
import type { FormSchema, FormErrors, FormSubmitEvent, FieldChangeEvent } from './types'
import { useFormValidation } from './useFormValidation'
import FieldRenderer from './FieldRenderer.vue'
import { Button } from '../../shared/components'

/**
 * Props
 */
interface Props {
  /** Schema do formulário */
  schema: FormSchema

  /** Valores iniciais */
  initialValues?: Record<string, any>

  /** Classe CSS customizada */
  formClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({}),
  formClass: ''
})

/**
 * Emits
 */
const emit = defineEmits<{
  submit: [event: FormSubmitEvent]
  cancel: []
  reset: []
  change: [event: FieldChangeEvent]
  error: [errors: FormErrors]
}>()

/**
 * Estado do formulário.
 */
const formData = ref<Record<string, any>>({})
const submitted = ref(false)
const submitting = ref(false)

/**
 * Validação.
 */
const {
  errors: formErrors,
  isValid,
  hasErrors,
  validateField,
  validateForm,
  touchField,
  reset: resetValidation,
  getFieldErrors: getErrors,
  isFieldTouched
} = useFormValidation(props.schema.fields, formData)

/**
 * Estilo do grid.
 */
const gridStyle = computed(() => {
  const columns = props.schema.columns || 1
  const gap = props.schema.gap || 'var(--spacing-md)'

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap
  }
})

/**
 * Estilo do form.
 */
const formStyle = computed(() => {
  return {}
})

/**
 * Inicializa form data com default values.
 */
function initializeFormData() {
  const data: Record<string, any> = { ...props.initialValues }

  props.schema.fields.forEach((field) => {
    if (!(field.name in data)) {
      data[field.name] = field.defaultValue !== undefined ? field.defaultValue : null
    }
  })

  formData.value = data
}

/**
 * Atualiza valor de um campo.
 */
function updateField(fieldName: string, value: any) {
  const oldValue = formData.value[fieldName]

  formData.value[fieldName] = value

  // Emit change event
  emit('change', {
    fieldName,
    oldValue,
    newValue: value,
    timestamp: Date.now()
  })

  // Validate on input (se habilitado)
  if (props.schema.validateOnInput || props.schema.validateOnBlur) {
    validateField(fieldName)
  }
}

/**
 * Handler de blur do campo.
 */
async function handleFieldBlur(fieldName: string) {
  touchField(fieldName)

  // Validate on blur (se habilitado)
  if (props.schema.validateOnBlur) {
    await validateField(fieldName)
  }
}

/**
 * Handler de submit.
 */
async function handleSubmit() {
  submitted.value = true
  submitting.value = true

  // Validate all fields
  const isFormValid = await validateForm()

  if (!isFormValid) {
    submitting.value = false

    // Emit error event
    emit('error', formErrors.value)

    // Focus first error (se habilitado)
    // TODO: implementar scroll/focus para primeiro erro

    return
  }

  // Prepare submit event
  const submitEvent: FormSubmitEvent = {
    data: { ...formData.value },
    valid: isFormValid,
    errors: hasErrors.value ? formErrors.value : undefined
  }

  try {
    // Call onSubmit callback (se existir)
    if (props.schema.onSubmit) {
      await props.schema.onSubmit(formData.value)
    }

    // Emit submit event
    emit('submit', submitEvent)

  } catch (error) {
    console.error('[FormRenderer] Submit error:', error)

    // Add global error
    formErrors.value.global = formErrors.value.global || []
    formErrors.value.global.push(
      error instanceof Error ? error.message : 'Erro ao enviar formulário'
    )

    // Call onError callback (se existir)
    if (props.schema.onError) {
      props.schema.onError(formErrors.value)
    }

    emit('error', formErrors.value)

  } finally {
    submitting.value = false
  }
}

/**
 * Handler de cancel.
 */
function handleCancel() {
  emit('cancel')
}

/**
 * Handler de reset.
 */
function handleReset() {
  initializeFormData()
  resetValidation()
  submitted.value = false
  emit('reset')
}

/**
 * Obtém erros de um campo.
 */
function getFieldErrors(fieldName: string): string[] {
  return getErrors(fieldName)
}

/**
 * Se deve mostrar erros de um campo.
 */
function shouldShowFieldErrors(fieldName: string): boolean {
  if (!props.schema.showInlineErrors) return false

  // Mostra erros se:
  // 1. Campo foi tocado (blur) E
  // 2. (validateOnInput OU validateOnBlur) OU form foi submetido
  return (
    isFieldTouched(fieldName) &&
    (props.schema.validateOnInput || props.schema.validateOnBlur || submitted.value)
  )
}

/**
 * Lifecycle: inicializa form data.
 */
onMounted(() => {
  initializeFormData()
})

/**
 * Watch: reinicializa se initialValues mudar.
 */
watch(
  () => props.initialValues,
  () => {
    if (!submitted.value) {
      initializeFormData()
    }
  },
  { deep: true }
)

/**
 * Expõe métodos públicos.
 */
defineExpose({
  /** Valida form programaticamente */
  validate: validateForm,
  /** Reseta form */
  reset: handleReset,
  /** Dados atuais */
  getData: () => ({ ...formData.value }),
  /** Se form é válido */
  isValid,
  /** Erros atuais */
  errors: formErrors
})
</script>

<style lang="scss" scoped>
.form-renderer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-bg-primary);
  border-radius: var(--border-radius);
}

.form-renderer__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.form-renderer__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.form-renderer__description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.form-renderer__fields {
  /* Grid style é aplicado via :style */
}

.form-renderer__global-errors {
  padding: var(--spacing-md);
  background: var(--color-danger-bg);
  border: 1px solid var(--color-danger);
  border-radius: var(--border-radius);
}

.form-renderer__global-error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  margin: 0;

  &:not(:last-child) {
    margin-bottom: var(--spacing-xs);
  }
}

.form-renderer__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
</style>
