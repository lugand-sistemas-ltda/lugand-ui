<template>
  <div class="code-generator-view fullscreen-view">
    <!-- Header -->
    <div class="view-header">
      <div class="view-header__content">
        <div class="view-header__title-section">
          <h1 class="view-header__title">
            <span class="view-header__icon">⚡</span>
            Schema Inspector
          </h1>
          <p class="view-header__description">
            Validador e inspetor de SchemaTree JSON — analise a estrutura da árvore e exporte o schema formatado
          </p>
        </div>

        <div class="view-header__actions">
          <button class="action-button action-button--secondary" @click="loadExampleSchema"
            title="Carregar schema de exemplo">
            📝 Carregar Exemplo
          </button>
          <button class="action-button action-button--secondary" @click="clearSchema" title="Limpar editor">
            🗑️ Limpar
          </button>
          <button class="action-button action-button--primary" @click="formatSchema" :disabled="!schemaInput.trim()"
            title="Formatar JSON">
            🎨 Formatar JSON
          </button>
        </div>
      </div>
    </div>

    <!-- Content: Split View (JSON Input | Inspector) -->
    <div class="view-content">
      <!-- Left Panel: Schema Input -->
      <div class="panel panel--input">
        <div class="panel__header">
          <h2 class="panel__title">📄 SchemaTree JSON</h2>
          <div class="panel__actions">
            <label class="file-upload">
              📁 Carregar Arquivo
              <input type="file" accept=".json" @change="handleFileUpload" hidden />
            </label>
            <button class="action-button action-button--sm" @click="validateSchema" :disabled="!schemaInput.trim()"
              title="Validar schema">
              🔍 Validar
            </button>
          </div>
        </div>

        <textarea
          v-model="schemaInput"
          class="schema-editor"
          placeholder="Cole ou digite seu SchemaTree JSON aqui...

Exemplo:
{
  &quot;version&quot;: &quot;2.0&quot;,
  &quot;context&quot;: &quot;page&quot;,
  &quot;root&quot;: {
    &quot;id&quot;: &quot;root-1&quot;,
    &quot;type&quot;: &quot;page-root&quot;,
    &quot;props&quot;: {},
    &quot;style&quot;: {},
    &quot;children&quot;: []
  },
  &quot;breakpoints&quot;: {},
  &quot;metadata&quot;: {
    &quot;name&quot;: &quot;My Page&quot;,
    &quot;status&quot;: &quot;draft&quot;
  }
}"
          spellcheck="false"
        ></textarea>

        <!-- Validation Status -->
        <div v-if="validationResult" class="validation-status">
          <div v-if="validationResult.isValid" class="validation-status__success">
            ✅ SchemaTree válido
          </div>
          <div v-else class="validation-status__errors">
            <strong>❌ Erros no schema:</strong>
            <ul>
              <li v-for="(error, index) in validationResult.errors" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Panel: Tree Inspector -->
      <div class="panel panel--output">
        <div class="panel__header">
          <h2 class="panel__title">🌳 Tree Inspector</h2>
          <div class="panel__actions">
            <button class="action-button action-button--sm" @click="copyFormatted" :disabled="!parsedTree"
              title="Copiar JSON formatado">
              📋 Copiar
            </button>
            <button class="action-button action-button--sm" @click="downloadFormatted" :disabled="!parsedTree"
              title="Download JSON">
              💾 Download
            </button>
          </div>
        </div>

        <!-- Stats (when valid) -->
        <div v-if="parsedTree" class="tree-stats">
          <div class="stat-card">
            <span class="stat-card__icon">🌿</span>
            <span class="stat-card__value">{{ treeStats.nodeCount }}</span>
            <span class="stat-card__label">nós</span>
          </div>
          <div class="stat-card">
            <span class="stat-card__icon">📐</span>
            <span class="stat-card__value">{{ treeStats.depth }}</span>
            <span class="stat-card__label">profundidade</span>
          </div>
          <div class="stat-card">
            <span class="stat-card__icon">📱</span>
            <span class="stat-card__value">{{ treeStats.breakpointCount }}</span>
            <span class="stat-card__label">breakpoints</span>
          </div>
          <div class="stat-card">
            <span class="stat-card__icon">📦</span>
            <span class="stat-card__value">{{ formatBytes(schemaSize) }}</span>
            <span class="stat-card__label">tamanho</span>
          </div>
        </div>

        <!-- Context badge -->
        <div v-if="parsedTree" class="context-badge">
          <span class="context-badge__label">Contexto:</span>
          <span class="context-badge__value">{{ parsedTree.context }}</span>
          <span class="context-badge__label" style="margin-left: 1rem">Versão:</span>
          <span class="context-badge__value">{{ parsedTree.version }}</span>
        </div>

        <!-- Formatted JSON Output -->
        <pre v-if="parsedTree" class="code-output"><code>{{ formattedOutput }}</code></pre>

        <!-- Empty state -->
        <div v-else class="empty-state">
          <div class="empty-state__icon">🌳</div>
          <p class="empty-state__text">Nenhum schema inspecionado</p>
          <p class="empty-state__hint">Cole um SchemaTree JSON e clique em "Validar"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  flattenTree,
  getTreeDepth,
} from '@/core/low-code-engine'
import type { SchemaTree } from '@/core/low-code-engine'

// ============================================
// STATE
// ============================================

const schemaInput = ref('')
const parsedTree = ref<SchemaTree | null>(null)
const validationResult = ref<{ isValid: boolean; errors: string[] } | null>(null)

// ============================================
// COMPUTED
// ============================================

const formattedOutput = computed(() =>
  parsedTree.value ? JSON.stringify(parsedTree.value, null, 2) : '',
)

const schemaSize = computed(() =>
  new Blob([formattedOutput.value]).size,
)

const treeStats = computed(() => {
  if (!parsedTree.value) return { nodeCount: 0, depth: 0, breakpointCount: 0 }
  const nodeCount = Math.max(0, flattenTree(parsedTree.value.root).length - 1)
  const depth = getTreeDepth(parsedTree.value.root)
  const breakpointCount = Object.keys(parsedTree.value.breakpoints ?? {}).length
  return { nodeCount, depth, breakpointCount }
})

// ============================================
// METHODS
// ============================================

function loadExampleSchema() {
  const example: SchemaTree = {
    version: '2.0',
    context: 'page',
    root: {
      id: 'root-example',
      type: 'page-root',
      props: {},
      style: {},
      children: [
        {
          id: 'card-1',
          type: 'card',
          props: { title: 'Dashboard Header', variant: 'elevated' },
          style: { padding: '1rem' },
          children: [],
          meta: { label: 'Dashboard Header', droppable: false, draggable: true, accepts: 'none' },
        },
        {
          id: 'table-1',
          type: 'data-table',
          props: { columns: [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }], paginated: true },
          style: {},
          children: [],
          meta: { label: 'Data Table', droppable: false, draggable: true, accepts: 'none' },
        },
        {
          id: 'alert-1',
          type: 'alert',
          props: { message: 'System operational', variant: 'info' },
          style: {},
          children: [],
          meta: { label: 'System Alert', droppable: false, draggable: true, accepts: 'none' },
        },
      ],
      meta: { label: 'Root', locked: true, droppable: true, draggable: false, accepts: 'all' },
    },
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    metadata: {
      name: 'Dashboard Example',
      description: 'Example SchemaTree for inspection',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['example', 'dashboard'],
    },
  }
  schemaInput.value = JSON.stringify(example, null, 2)
  parsedTree.value = example
  validationResult.value = { isValid: true, errors: [] }
}

function clearSchema() {
  if (confirm('Tem certeza que deseja limpar o editor?')) {
    schemaInput.value = ''
    parsedTree.value = null
    validationResult.value = null
  }
}

function formatSchema() {
  try {
    const parsed = JSON.parse(schemaInput.value)
    schemaInput.value = JSON.stringify(parsed, null, 2)
  } catch {
    alert('JSON inválido. Não é possível formatar.')
  }
}

function validateSchema() {
  try {
    const parsed = JSON.parse(schemaInput.value)
    const errors: string[] = []

    if (!parsed.version) errors.push('Campo obrigatório ausente: version')
    if (!parsed.context) errors.push('Campo obrigatório ausente: context')
    if (!parsed.root) errors.push('Campo obrigatório ausente: root')
    else {
      if (!parsed.root.id) errors.push('root.id é obrigatório')
      if (!parsed.root.type) errors.push('root.type é obrigatório')
      if (!Array.isArray(parsed.root.children)) errors.push('root.children deve ser um array')
    }
    if (!parsed.breakpoints) errors.push('Campo obrigatório ausente: breakpoints')
    if (!parsed.metadata) errors.push('Campo obrigatório ausente: metadata')

    if (errors.length === 0) {
      parsedTree.value = parsed as SchemaTree
      validationResult.value = { isValid: true, errors: [] }
    } else {
      parsedTree.value = null
      validationResult.value = { isValid: false, errors }
    }
  } catch (error) {
    parsedTree.value = null
    validationResult.value = {
      isValid: false,
      errors: ['JSON inválido: ' + (error as Error).message],
    }
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    schemaInput.value = e.target?.result as string
    parsedTree.value = null
    validationResult.value = null
  }
  reader.readAsText(file)
}

async function copyFormatted() {
  try {
    await navigator.clipboard.writeText(formattedOutput.value)
    alert('SchemaTree JSON copiado para clipboard!')
  } catch (error) {
    console.error('Erro ao copiar:', error)
    alert('Erro ao copiar schema')
  }
}

function downloadFormatted() {
  if (!parsedTree.value) return
  try {
    const blob = new Blob([formattedOutput.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${parsedTree.value.metadata?.name ?? 'schema'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao fazer download:', error)
    alert('Erro ao fazer download')
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style lang="scss" scoped>
@use '@/styles/utils/mixins' as *;

// ============================================
// CODE GENERATOR VIEW (usa tokens e mixins da lib)
// ============================================

.code-generator-view {
  @include fullscreen-view-base;
  background: var(--canvas-bg);
}

// ============================================
// VIEW HEADER
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
// VIEW CONTENT (split panel)
// ============================================

.view-content {
  @include split-view-layout;
  flex: 1;
  padding: var(--spacing-md);
}

// ============================================
// PANELS
// ============================================

.panel {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-lg);
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border-base);
    background: var(--color-bg-tertiary);
    flex-shrink: 0;
  }

  &__title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }
}

// ============================================
// SCHEMA EDITOR
// ============================================

.schema-editor {
  flex: 1;
  width: 100%;
  padding: var(--spacing-md);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  resize: none;
  outline: none;

  &::placeholder {
    color: #666;
  }
}

// ============================================
// VALIDATION STATUS
// ============================================

.validation-status {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border-base);
  background: var(--color-bg-primary);
  flex-shrink: 0;

  &__success {
    color: var(--color-success);
    font-weight: var(--font-weight-medium);
  }

  &__errors {
    color: var(--color-danger);

    strong {
      display: block;
      margin-bottom: var(--spacing-xs);
    }

    ul {
      margin: 0;
      padding-left: var(--spacing-lg);
      font-size: var(--font-size-sm);
    }

    li {
      margin-bottom: var(--spacing-xs);
    }
  }
}

// ============================================
// TREE STATS
// ============================================

.tree-stats {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-base);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);

  &__icon {
    font-size: var(--font-size-base);
  }

  &__value {
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
  }

  &__label {
    color: var(--color-text-secondary);
  }
}

// ============================================
// CONTEXT BADGE
// ============================================

.context-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border-base);
  font-size: var(--font-size-sm);
  flex-shrink: 0;

  &__label {
    color: var(--color-text-secondary);
  }

  &__value {
    font-weight: var(--font-weight-semibold);
    color: var(--color-primary);
    font-family: 'Consolas', 'Monaco', monospace;
  }
}

// ============================================
// CODE OUTPUT
// ============================================

.code-output {
  flex: 1;
  margin: 0;
  padding: var(--spacing-md);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  background: #1e1e1e;
  color: #d4d4d4;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;

  code {
    font-family: inherit;
  }
}

// ============================================
// EMPTY STATE
// ============================================

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);

  &__icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-md);
    opacity: 0.3;
  }

  &__text {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
  }

  &__hint {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
  }
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
// FILE UPLOAD
// ============================================

.file-upload {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-primary);
  }
}
</style>
