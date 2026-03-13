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
            :disabled="!hasNodes" title="Exportar schema JSON">
            💾 Exportar Schema
          </button>
        </div>
      </div>
    </div>

    <!-- Form Builder Component (full-screen) -->
    <div class="view-content">
      <LowCodeEngine
        :context="formBuilderContext"
        v-model="currentSchema"
        @save="handleSave"
        @toolbar-action="handleToolbarAction"
      />
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
          <span>📊 {{ nodeCount }} componentes</span>
          <span>📦 {{ formatBytes(schemaSize) }}</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LowCodeEngine } from '@/core/low-code-engine/components'
import {
  formBuilderContext,
  createEmptyTree,
  createNode,
  flattenTree,
} from '@/core/low-code-engine'
import { Modal } from '@/modules/modal'
import type { SchemaTree } from '@/core/low-code-engine'

// ============================================
// STATE
// ============================================

const currentSchema = ref<SchemaTree>(formBuilderContext.defaultSchema())
const showSchemaPreview = ref(false)

// ============================================
// COMPUTED
// ============================================

const formattedSchema = computed(() => JSON.stringify(currentSchema.value, null, 2))

const schemaSize = computed(() => new Blob([formattedSchema.value]).size)

const nodeCount = computed(() => {
  const all = flattenTree(currentSchema.value.root)
  return Math.max(0, all.length - 1) // exclude root node
})

const hasNodes = computed(() => nodeCount.value > 0)

// ============================================
// METHODS
// ============================================

function loadExample() {
  const tree = createEmptyTree('form', { name: 'Contact Form' })
  tree.root.children = [
    createNode({ type: 'text-input', props: { label: 'Full Name', placeholder: 'Enter your full name', required: true }, style: {}, children: [], meta: { label: 'Full Name', droppable: false, draggable: true, accepts: 'none' } }),
    createNode({ type: 'email-input', props: { label: 'Email Address', placeholder: 'your@email.com', required: true }, style: {}, children: [], meta: { label: 'Email Address', droppable: false, draggable: true, accepts: 'none' } }),
    createNode({ type: 'tel-input', props: { label: 'Phone', placeholder: '(00) 00000-0000' }, style: {}, children: [], meta: { label: 'Phone', droppable: false, draggable: true, accepts: 'none' } }),
    createNode({ type: 'select', props: { label: 'Subject', required: true, options: ['Support', 'Sales', 'Feedback', 'Other'] }, style: {}, children: [], meta: { label: 'Subject', droppable: false, draggable: true, accepts: 'none' } }),
    createNode({ type: 'textarea', props: { label: 'Message', placeholder: 'Type your message...', rows: 4, required: true }, style: {}, children: [], meta: { label: 'Message', droppable: false, draggable: true, accepts: 'none' } }),
    createNode({ type: 'checkbox', props: { label: 'I accept the terms and conditions', required: true }, style: {}, children: [], meta: { label: 'Terms Checkbox', droppable: false, draggable: true, accepts: 'none' } }),
    createNode({ type: 'button', props: { text: 'Submit', variant: 'primary' }, style: {}, children: [], meta: { label: 'Submit Button', droppable: false, draggable: true, accepts: 'none' } }),
  ]
  currentSchema.value = tree
}

function clearForm() {
  if (confirm('Tem certeza que deseja limpar o formulário atual?')) {
    currentSchema.value = formBuilderContext.defaultSchema()
  }
}

function exportSchema() {
  showSchemaPreview.value = true
}

async function copySchema() {
  try {
    await navigator.clipboard.writeText(formattedSchema.value)
    alert('Schema JSON copiado para clipboard!')
  } catch (error) {
    console.error('Erro ao copiar:', error)
    alert('Erro ao copiar schema')
  }
}

function downloadSchema() {
  try {
    const blob = new Blob([formattedSchema.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentSchema.value.metadata?.name ?? 'form-schema'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao fazer download:', error)
    alert('Erro ao fazer download do schema')
  }
}

function handleSave(tree: SchemaTree) {
  localStorage.setItem('last-form-schema', JSON.stringify(tree))
}

function handleToolbarAction(actionId: string) {
  if (actionId === 'export-json' || actionId === 'validate-schema') {
    showSchemaPreview.value = true
  }
}

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
  const savedSchema = localStorage.getItem('last-form-schema')
  if (savedSchema) {
    try {
      currentSchema.value = JSON.parse(savedSchema) as SchemaTree
    } catch (error) {
      console.error('Erro ao carregar schema salvo:', error)
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/utils/mixins' as *;

// ============================================
// FORM BUILDER VIEW (usa tokens e mixins da lib)
// ============================================

.form-builder-view {
  @include fullscreen-view-base;
  background: var(--canvas-bg);
}

// ============================================
// VIEW HEADER (usa toolbar tokens e mixins)
// ============================================

.view-header {
  @include panel-header;
  background: var(--toolbar-bg);
  border-bottom: var(--toolbar-border);
  padding: var(--toolbar-padding);
  min-height: var(--toolbar-height);

  &__content {
    @include flex-between;
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
  padding: var(--canvas-padding);
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
// SCHEMA PREVIEW MODAL (usa tokens de editor)
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
    background: var(--editor-bg);
    border-radius: var(--editor-border-radius);
    padding: var(--editor-padding);

    pre {
      margin: 0;
      font-family: var(--editor-font-family);
      font-size: var(--editor-font-size);
      line-height: var(--editor-line-height);
      color: var(--editor-fg);
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
