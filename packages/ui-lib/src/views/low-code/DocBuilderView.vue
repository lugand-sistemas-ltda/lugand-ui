<template>
  <div class="doc-builder-view fullscreen-view">
    <!-- Header -->
    <div class="view-header">
      <div class="view-header__content">
        <div class="view-header__title-section">
          <h1 class="view-header__title">
            <span class="view-header__icon">📄</span>
            Doc Builder
          </h1>
          <p class="view-header__description">
            Crie documentos dinâmicos com templates, variáveis e exporte para PDF ou JSON
          </p>
        </div>

        <div class="view-header__actions">
          <button
            class="action-button action-button--secondary"
            @click="loadTemplate"
            title="Carregar template pré-configurado"
          >
            📝 Carregar Template
          </button>
          <button
            class="action-button action-button--secondary"
            @click="clearDocument"
            title="Limpar documento"
          >
            🗑️ Limpar
          </button>
          <button
            class="action-button action-button--primary"
            @click="exportDocument"
            :disabled="!hasBlocks"
            title="Exportar documento"
          >
            💾 Exportar
          </button>
        </div>
      </div>
    </div>

    <!-- Doc Builder Component (full-screen) -->
    <div class="view-content">
      <LowCodeEngine
        :context="docBuilderContext"
        v-model="currentSchema"
        @save="handleSave"
        @toolbar-action="handleToolbarAction"
      />
    </div>

    <!-- Template Selection Modal -->
    <Modal
      v-model="showTemplateModal"
      size="lg"
      title="Selecionar Template"
    >
      <div class="template-gallery">
        <div class="template-gallery__grid">
          <div
            v-for="template in BUILT_IN_TEMPLATES"
            :key="template.id"
            class="template-card"
            @click="selectTemplate(template)"
          >
            <div class="template-card__icon">{{ template.icon }}</div>
            <h3 class="template-card__title">{{ template.name }}</h3>
            <p class="template-card__description">{{ template.description }}</p>
            <div class="template-card__tags">
              <span
                v-for="tag in template.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Export Options Modal -->
    <Modal
      v-model="showExportModal"
      size="md"
      title="Exportar Documento"
    >
      <div class="export-options">
        <div class="export-options__format">
          <h3>Formato:</h3>
          <div class="format-buttons">
            <button
              class="format-button"
              :class="{ 'format-button--active': exportFormat === 'pdf' }"
              @click="exportFormat = 'pdf'"
            >
              📄 PDF
            </button>
            <button
              class="format-button"
              :class="{ 'format-button--active': exportFormat === 'html' }"
              @click="exportFormat = 'html'"
            >
              🌐 HTML
            </button>
            <button
              class="format-button"
              :class="{ 'format-button--active': exportFormat === 'json' }"
              @click="exportFormat = 'json'"
            >
              📋 JSON
            </button>
          </div>
        </div>

        <div class="export-options__actions">
          <button
            class="action-button action-button--secondary"
            @click="showExportModal = false"
          >
            Cancelar
          </button>
          <button
            class="action-button action-button--primary"
            @click="performExport"
          >
            Exportar {{ exportFormat.toUpperCase() }}
          </button>
        </div>
      </div>
    </Modal>

    <!-- Schema Preview Modal (JSON export) -->
    <Modal v-model="showSchemaPreview" size="lg" title="Document Schema JSON">
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
          <span>📊 {{ nodeCount }} blocos</span>
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
  docBuilderContext,
  createEmptyTree,
  createNode,
  flattenTree,
} from '@/core/low-code-engine'
import { Modal } from '@/modules/modal'
import { useToast } from '@/modules/toast'
import type { SchemaTree } from '@/core/low-code-engine'

// ============================================
// BUILT-IN TEMPLATES
// ============================================

interface BuiltInTemplate {
  id: string
  name: string
  description: string
  icon: string
  tags: string[]
  nodeTypes: string[]
}

const BUILT_IN_TEMPLATES: BuiltInTemplate[] = [
  {
    id: 'contract',
    name: 'Contrato Simples',
    description: 'Template de contrato com cláusulas e assinatura',
    icon: '📋',
    tags: ['contrato', 'legal', 'assinatura'],
    nodeTypes: ['heading', 'paragraph', 'clause', 'signature'],
  },
  {
    id: 'invoice',
    name: 'Nota Fiscal',
    description: 'Template de nota fiscal com itens e valores',
    icon: '🧾',
    tags: ['fiscal', 'financeiro', 'nfe'],
    nodeTypes: ['heading', 'table', 'paragraph', 'qrcode'],
  },
  {
    id: 'report',
    name: 'Relatório',
    description: 'Template de relatório gerencial com gráficos e tabelas',
    icon: '📊',
    tags: ['relatório', 'analytics', 'dados'],
    nodeTypes: ['heading', 'paragraph', 'chart', 'table'],
  },
  {
    id: 'letter',
    name: 'Carta Formal',
    description: 'Template de carta formal com cabeçalho e rodapé',
    icon: '✉️',
    tags: ['carta', 'comunicado', 'formal'],
    nodeTypes: ['heading', 'paragraph', 'signature'],
  },
]

// ============================================
// STATE
// ============================================

const currentSchema = ref<SchemaTree>(docBuilderContext.defaultSchema())
const showTemplateModal = ref(false)
const showExportModal = ref(false)
const showSchemaPreview = ref(false)
const exportFormat = ref<'pdf' | 'html' | 'json'>('pdf')
const toast = useToast()

// ============================================
// COMPUTED
// ============================================

const formattedSchema = computed(() => JSON.stringify(currentSchema.value, null, 2))

const schemaSize = computed(() => new Blob([formattedSchema.value]).size)

const nodeCount = computed(() => {
  const all = flattenTree(currentSchema.value.root)
  return Math.max(0, all.length - 1)
})

const hasBlocks = computed(() => nodeCount.value > 0)

// ============================================
// METHODS
// ============================================

function loadTemplate() {
  showTemplateModal.value = true
}

function selectTemplate(template: BuiltInTemplate) {
  try {
    const tree = createEmptyTree('doc', { name: template.name, description: template.description })
    tree.root.children = template.nodeTypes.map(type =>
      createNode({ type, props: { label: type }, style: {}, children: [], meta: { label: type, droppable: false, draggable: true, accepts: 'none' } }),
    )
    currentSchema.value = tree
    toast.success(`Template "${template.name}" carregado com sucesso!`)
    showTemplateModal.value = false
  } catch (error) {
    toast.error('Erro ao carregar template')
    console.error(error)
  }
}

function clearDocument() {
  if (confirm('Tem certeza que deseja limpar o documento?')) {
    currentSchema.value = docBuilderContext.defaultSchema()
    toast.info('Documento limpo')
  }
}

function exportDocument() {
  showExportModal.value = true
}

function performExport() {
  if (exportFormat.value === 'json') {
    showExportModal.value = false
    showSchemaPreview.value = true
    return
  }
  toast.info(`Exportação ${exportFormat.value.toUpperCase()} em breve`)
  showExportModal.value = false
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
    a.download = `${currentSchema.value.metadata?.name ?? 'doc-schema'}.json`
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
  localStorage.setItem('last-doc-schema', JSON.stringify(tree))
  toast.success('Documento salvo!')
}

function handleToolbarAction(actionId: string) {
  if (actionId === 'export-pdf') {
    exportFormat.value = 'pdf'
    showExportModal.value = true
  } else if (actionId === 'export-json') {
    showSchemaPreview.value = true
  } else if (actionId === 'page-settings') {
    toast.info('Configurações de página em breve')
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
  const savedSchema = localStorage.getItem('last-doc-schema')
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
// DOC BUILDER VIEW (usa tokens e mixins da lib)
// ============================================

.doc-builder-view {
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
// TEMPLATE GALLERY
// ============================================

.template-gallery {
  padding: var(--spacing-md);

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }
}

.template-card {
  padding: var(--spacing-lg);
  border: 2px solid var(--color-border-base);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  &__icon {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-md);
  }

  &__title {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  &__description {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

// ============================================
// EXPORT OPTIONS
// ============================================

.export-options {
  padding: var(--spacing-md);

  &__format h3 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border-base);
  }
}

.format-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.format-button {
  flex: 1;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border-base);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--color-primary);
  }

  &--active {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: white;
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
