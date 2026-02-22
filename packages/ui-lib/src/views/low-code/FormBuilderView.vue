<template>
  <div class="form-builder-view fullscreen-view">
    <!-- Header -->
    <div class="view-header">
      <div class="view-header__content">
        <div class="view-header__title-section">
          <h1 class="view-header__title">
            <span class="view-header__icon">📝</span>
            Form Builder
          </h1>
          <p class="view-header__description">
            Design formulários visualmente com validação automática e preview em tempo real
          </p>
        </div>

        <div class="view-header__actions">
          <button class="action-button action-button--secondary" @click="loadExample"
            title="Carregar exemplo de formulário">
            📝 Carregar Exemplo
          </button>
          <button class="action-button action-button--secondary" @click="clearForm" title="Limpar formulário">
            🗑️ Limpar
          </button>
          <button class="action-button action-button--primary" @click="exportSchema"
            :disabled="!currentSchema || currentSchema.fields.length === 0" title="Exportar schema JSON">
            💾 Exportar Schema
          </button>
        </div>
      </div>
    </div>

    <!-- Form Builder Component (full-screen) -->
    <div class="view-content">
      <FormBuilder v-model="currentSchema" :height="builderHeight" :initial-mode="builderMode" @save="handleSave"
        @field-add="handleFieldAdd" @field-remove="handleFieldRemove" />
    </div>

    <!-- Schema Preview Modal -->
    <Modal v-model="showSchemaPreview" size="lg" title="Form Schema JSON">
      <div class="schema-preview">
        <div class="schema-preview__actions">
          <button class="action-button action-button--sm" @click="copySchema">
            📋 Copiar JSON
          </button>
          <button class="action-button action-button--sm" @click="downloadSchema">
            💾 Download JSON
          </button>
        </div>

        <div class="schema-preview__content">
          <pre><code>{{ formattedSchema }}</code></pre>
        </div>

        <div class="schema-preview__stats">
          <span>📊 {{ currentSchema?.fields.length || 0 }} campos</span>
          <span>🔍 {{ validationCount }} validações</span>
          <span>📦 {{ formatBytes(schemaSize) }}</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FormBuilder } from '@/features/form-builder'
import { Modal } from '@/modules/modal'
import type { FormSchema } from '@/features/form-renderer/types'
import type { FormField } from '@/features/form-renderer/types'

// ============================================
// STATE
// ============================================

const currentSchema = ref<FormSchema>(createEmptySchema())
const showSchemaPreview = ref(false)
const builderMode = ref<'design' | 'preview' | 'code'>('design')
const builderHeight = ref('calc(100vh - 180px)')

// ============================================
// COMPUTED
// ============================================

const formattedSchema = computed(() => {
  return JSON.stringify(currentSchema.value, null, 2)
})

const schemaSize = computed(() => {
  return new Blob([formattedSchema.value]).size
})

const validationCount = computed(() => {
  if (!currentSchema.value?.fields) return 0
  return currentSchema.value.fields.reduce((count: number, field: FormField) => {
    return count + (field.validation?.length || 0)
  }, 0)
})

// ============================================
// METHODS
// ============================================

/**
 * Cria schema vazio inicial
 */
function createEmptySchema(): FormSchema {
  return {
    id: 'new-form',
    description: 'Design your form here',
    fields: []
  }
}

/**
 * Carrega exemplo pré-configurado
 */
function loadExample() {
  currentSchema.value = {
    id: 'contact-form',
    description: 'Formulário de contato completo com validações',
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your full name',
        required: true,
        validation: [
          { type: 'required', message: 'Name is required' },
          { type: 'minLength', value: 3, message: 'Name must be at least 3 characters' }
        ]
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'your.email@example.com',
        required: true,
        validation: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Invalid email format' }
        ]
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '(00) 00000-0000',
        required: false,
        validation: [
          { type: 'pattern', value: '^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$', message: 'Invalid phone format' }
        ]
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'select',
        required: true,
        options: [
          { value: '', label: 'Select a subject' },
          { value: 'support', label: 'Technical Support' },
          { value: 'sales', label: 'Sales Inquiry' },
          { value: 'feedback', label: 'Feedback' },
          { value: 'other', label: 'Other' }
        ],
        validation: [
          { type: 'required', message: 'Please select a subject' }
        ]
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        placeholder: 'Enter your message here...',
        required: true,
        rows: 5,
        validation: [
          { type: 'required', message: 'Message is required' },
          { type: 'minLength', value: 10, message: 'Message must be at least 10 characters' },
          { type: 'maxLength', value: 500, message: 'Message must not exceed 500 characters' }
        ]
      },
      {
        name: 'newsletter',
        label: 'Subscribe to newsletter',
        type: 'checkbox',
        required: false
      },
      {
        name: 'termsAccepted',
        label: 'I accept the terms and conditions',
        type: 'checkbox',
        required: true,
        validation: [
          { type: 'required', message: 'You must accept the terms' }
        ]
      }
    ]
  }
}

/**
 * Limpa formulário atual
 */
function clearForm() {
  if (confirm('Tem certeza que deseja limpar o formulário atual?')) {
    currentSchema.value = createEmptySchema()
  }
}

/**
 * Exporta schema JSON
 */
function exportSchema() {
  showSchemaPreview.value = true
}

/**
 * Copia schema para clipboard
 */
async function copySchema() {
  try {
    await navigator.clipboard.writeText(formattedSchema.value)
    alert('Schema JSON copiado para clipboard!')
  } catch (error) {
    console.error('Erro ao copiar:', error)
    alert('Erro ao copiar schema')
  }
}

/**
 * Download do schema JSON
 */
function downloadSchema() {
  try {
    const blob = new Blob([formattedSchema.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentSchema.value.id || 'form-schema'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao fazer download:', error)
    alert('Erro ao fazer download do schema')
  }
}

/**
 * Handler para save do Form Builder
 */
function handleSave(schema: FormSchema) {
  console.log('Form schema salvo:', schema)
  localStorage.setItem('last-form-schema', JSON.stringify(schema))
}

/**
 * Handler para adição de campo
 */
function handleFieldAdd(field: any) {
  console.log('Campo adicionado:', field)
}

/**
 * Handler para remoção de campo
 */
function handleFieldRemove(fieldName: string) {
  console.log('Campo removido:', fieldName)
}

/**
 * Formata bytes para formato legível
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// ============================================
// LIFECYCLE
// ============================================

onMounted(() => {
  // Tenta carregar último schema salvo
  const savedSchema = localStorage.getItem('last-form-schema')
  if (savedSchema) {
    try {
      currentSchema.value = JSON.parse(savedSchema)
    } catch (error) {
      console.error('Erro ao carregar schema salvo:', error)
    }
  }
})
</script>

<style lang="scss" scoped>
// ============================================
// FULLSCREEN LAYOUT (respects navbar/header/footer)
// ============================================

.fullscreen-view {
  // Remove padding/margin padrão das views
  margin: 0;
  padding: 0;
  
  // Ocupa toda a altura disponível
  min-height: 100vh;
  height: 100vh;
  
  // Evita overflow horizontal
  overflow-x: hidden;
}

// ============================================
// FORM BUILDER VIEW
// ============================================

.form-builder-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg-primary);
}

// ============================================
// VIEW HEADER
// ============================================

.view-header {
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-base);
  padding: var(--spacing-lg) var(--spacing-xl);

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-lg);

    @media (max-width: 1024px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__title-section {
    flex: 1;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
  }

  &__icon {
    font-size: var(--font-size-3xl);
  }

  &__description {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    max-width: 600px;
  }

  &__actions {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }
}

// ============================================
// VIEW CONTENT
// ============================================

.view-content {
  flex: 1;
  overflow: hidden;
  padding: var(--spacing-md);
}

// ============================================
// ACTION BUTTONS
// ============================================

.action-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover:not(:disabled) {
    background: var(--color-bg-tertiary);
    border-color: var(--color-primary);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--primary {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);

    &:hover:not(:disabled) {
      background: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
    }
  }

  &--secondary {
    background: var(--color-bg-secondary);
  }

  &--sm {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
}

// ============================================
// SCHEMA PREVIEW MODAL
// ============================================

.schema-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-height: 70vh;

  &__actions {
    display: flex;
    gap: var(--spacing-xs);
    justify-content: flex-end;
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--color-border-base);
  }

  &__content {
    flex: 1;
    overflow: auto;
    background: #1e1e1e;
    border-radius: var(--radius-md);
    padding: var(--spacing-md);

    pre {
      margin: 0;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: var(--font-size-sm);
      line-height: 1.5;
      color: #d4d4d4;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    code {
      font-family: inherit;
    }
  }

  &__stats {
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);

    span {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }
  }
}
</style>
