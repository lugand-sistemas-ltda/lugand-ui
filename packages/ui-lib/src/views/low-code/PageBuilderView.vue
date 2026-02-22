<template>
  <div class="page-builder-view fullscreen-view">
    <!-- Header -->
    <div class="view-header">
      <div class="view-header__content">
        <div class="view-header__title-section">
          <h1 class="view-header__title">
            <span class="view-header__icon">🏗️</span>
            Page Builder
          </h1>
          <p class="view-header__description">
            Design páginas visualmente com drag-drop de widgets e exporte código Vue production-ready
          </p>
        </div>

        <div class="view-header__actions">
          <button class="action-button action-button--secondary" @click="loadExample"
            title="Carregar exemplo pré-configurado">
            📝 Carregar Exemplo
          </button>
          <button class="action-button action-button--secondary" @click="clearSchema" title="Limpar e começar do zero">
            🗑️ Limpar
          </button>
          <button class="action-button action-button--primary" @click="generateCode"
            :disabled="!currentSchema || currentSchema.widgets.length === 0"
            title="Gerar código Vue a partir do schema">
            ⚡ Gerar Código
          </button>
        </div>
      </div>
    </div>

    <!-- Page Builder Component (full-screen) -->
    <div class="view-content">
      <PageBuilder v-model="currentSchema" :height="builderHeight" @save="handleSave" @export="handleExport" />
    </div>

    <!-- Code Preview Modal (quando gerar código) -->
    <Modal v-model="showCodePreview" size="xl" title="Código Gerado">
      <div class="code-preview">
        <div class="code-preview__header">
          <div class="code-preview__tabs">
            <button class="tab-button tab-button--active">
              VUE SFC
            </button>
          </div>

          <div class="code-preview__actions">
            <button class="action-button action-button--sm" @click="copyCode">
              📋 Copiar
            </button>
            <button class="action-button action-button--sm" @click="downloadCode">
              💾 Download
            </button>
          </div>
        </div>

        <div class="code-preview__content">
          <pre><code>{{ generatedCode }}</code></pre>
        </div>

        <div v-if="codeStats" class="code-preview__stats">
          <span>📊 {{ codeStats.totalLines }} linhas</span>
          <span>🧩 {{ codeStats.componentCount }} componentes</span>
          <span>📦 {{ formatBytes(codeStats.estimatedSize) }}</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PageBuilder } from '@/features/page-builder'
import { useCodeGenerator } from '@/features/code-generator'
import { Modal } from '@/modules/modal'
import type { PageSchema } from '@/core/schema-system/types'

// ============================================
// STATE
// ============================================

const currentSchema = ref<PageSchema>(createEmptySchema())
const showCodePreview = ref(false)
const builderHeight = ref('calc(100vh - 180px)')

// Code Generator
const codeGenerator = useCodeGenerator({
  typescript: true,
  includeComments: true,
  formatCode: true,
  scopedStyles: true,
  namingConvention: 'PascalCase'
})

// ============================================
// COMPUTED
// ============================================

const generatedCode = computed(() => {
  return codeGenerator.generatedCode.value?.content || ''
})

const codeStats = computed(() => codeGenerator.generatedCode.value?.stats)

// ============================================
// METHODS
// ============================================

/**
 * Cria schema vazio inicial
 */
function createEmptySchema(): PageSchema {
  return {
    id: 'new-page',
    type: 'page',
    metadata: {
      title: 'New Page',
      description: 'Design your page here',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    layout: {
      strategy: 'grid',
      config: {
        columns: 12,
        gap: 16
      }
    },
    widgets: []
  }
}

/**
 * Carrega exemplo pré-configurado
 */
function loadExample() {
  currentSchema.value = {
    id: 'products-dashboard',
    type: 'page',
    metadata: {
      title: 'Products Dashboard',
      description: 'Painel de gerenciamento de produtos',
      version: '1.0',
      author: 'Low-Code Platform',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['dashboard', 'products', 'management']
    },
    layout: {
      strategy: 'grid',
      config: {
        columns: 12,
        gap: 16
      }
    },
    widgets: [
      {
        id: 'page-header',
        type: 'card',
        config: {
          title: 'Products Dashboard',
          content: 'Gerencie seus produtos de forma visual',
          variant: 'elevated',
          padding: 'lg'
        }
      },
      {
        id: 'stats-card-total',
        type: 'card',
        config: {
          title: 'Total Products',
          content: '1,234',
          variant: 'primary'
        }
      },
      {
        id: 'stats-card-active',
        type: 'card',
        config: {
          title: 'Active',
          content: '856',
          variant: 'success'
        }
      },
      {
        id: 'stats-card-pending',
        type: 'card',
        config: {
          title: 'Pending',
          content: '42',
          variant: 'warning'
        }
      },
      {
        id: 'products-table',
        type: 'data-table',
        config: {
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Product Name' },
            { key: 'category', label: 'Category' },
            { key: 'price', label: 'Price' },
            { key: 'stock', label: 'Stock' },
            { key: 'status', label: 'Status' }
          ],
          sortable: true,
          filterable: true,
          paginated: true,
          pageSize: 10
        }
      },
      {
        id: 'actions-alert',
        type: 'alert',
        config: {
          title: 'Quick Actions',
          message: 'Use os botões abaixo para adicionar ou exportar produtos',
          variant: 'info',
          dismissible: false
        }
      },
      {
        id: 'action-add',
        type: 'button',
        config: {
          text: 'Add New Product',
          variant: 'primary',
          size: 'lg',
          fullWidth: false
        }
      },
      {
        id: 'action-export',
        type: 'button',
        config: {
          text: 'Export to CSV',
          variant: 'secondary',
          size: 'lg',
          fullWidth: false
        }
      }
    ],
    dataSources: {
      products: {
        type: 'api',
        config: {
          endpoint: '/api/products',
          method: 'GET'
        }
      }
    }
  }
}

/**
 * Limpa schema atual
 */
function clearSchema() {
  if (confirm('Tem certeza que deseja limpar o schema atual?')) {
    currentSchema.value = createEmptySchema()
  }
}

/**
 * Gera código a partir do schema
 */
async function generateCode() {
  if (!currentSchema.value) return

  try {
    // Valida schema
    const validation = codeGenerator.validateSchema(currentSchema.value)

    if (!validation.isValid) {
      alert(`Schema inválido:\n${validation.errors.join('\n')}`)
      return
    }

    // Mostra warnings se houver
    if (validation.warnings.length > 0) {
      console.warn('Avisos:', validation.warnings)
    }

    // Gera código no formato atual
    await codeGenerator.generate(currentSchema.value)

    // Mostra preview
    showCodePreview.value = true

  } catch (error) {
    console.error('Erro ao gerar código:', error)
    alert('Erro ao gerar código. Verifique o console.')
  }
}

/**
 * Copia código para clipboard
 */
async function copyCode() {
  try {
    await codeGenerator.copyToClipboard()
    alert('Código copiado para clipboard!')
  } catch (error) {
    console.error('Erro ao copiar:', error)
    alert('Erro ao copiar código')
  }
}

/**
 * Download do código
 */
function downloadCode() {
  try {
    codeGenerator.downloadCode()
  } catch (error) {
    console.error('Erro ao fazer download:', error)
    alert('Erro ao fazer download do código')
  }
}

/**
 * Handler para save do Page Builder
 */
function handleSave(schema: PageSchema) {
  console.log('Schema salvo:', schema)
  // TODO: Salvar em localStorage ou backend
  localStorage.setItem('last-page-schema', JSON.stringify(schema))
}

/**
 * Handler para export do Page Builder
 */
function handleExport(exportData: any) {
  console.log('Export:', exportData)
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
  const savedSchema = localStorage.getItem('last-page-schema')
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
// PAGE BUILDER VIEW
// ============================================

.page-builder-view {
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
// CODE PREVIEW MODAL
// ============================================

.code-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-height: 70vh;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--color-border-base);
  }

  &__tabs {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-xs);
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

.tab-button {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  &--active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
}
</style>
