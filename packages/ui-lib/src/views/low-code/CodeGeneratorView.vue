<template>
  <div class="code-generator-view fullscreen-view">
    <!-- Header -->
    <div class="view-header">
      <div class="view-header__content">
        <div class="view-header__title-section">
          <h1 class="view-header__title">
            <span class="view-header__icon">⚡</span>
            Code Generator
          </h1>
          <p class="view-header__description">
            Transforme schemas JSON em código Vue production-ready com validação e otimização automática
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
          <button class="action-button action-button--primary" @click="generateCode" :disabled="!schemaInput.trim()"
            title="Gerar código a partir do schema">
            ⚡ Gerar Código
          </button>
        </div>
      </div>
    </div>

    <!-- Content: Split View (Schema Input | Generated Code) -->
    <div class="view-content">
      <!-- Left Panel: Schema Input -->
      <div class="panel panel--input">
        <div class="panel__header">
          <h2 class="panel__title">📄 Schema JSON</h2>
          <div class="panel__actions">
            <label class="file-upload">
              📁 Carregar Arquivo
              <input type="file" accept=".json" @change="handleFileUpload" hidden />
            </label>
            <button class="action-button action-button--sm" @click="formatSchema" title="Formatar JSON">
              🎨 Formatar
            </button>
          </div>
        </div>

        <textarea v-model="schemaInput" class="schema-editor" placeholder="Cole ou digite seu PageSchema JSON aqui...

Exemplo:
{
  &quot;id&quot;: &quot;my-page&quot;,
  &quot;description&quot;: &quot;Minha página&quot;,
  &quot;widgets&quot;: [
    {
      &quot;id&quot;: &quot;card-1&quot;,
      &quot;type&quot;: &quot;card&quot;,
      &quot;config&quot;: {
        &quot;title&quot;: &quot;Welcome&quot;,
        &quot;content&quot;: &quot;Hello World&quot;
      },
      &quot;layout&quot;: {
        &quot;x&quot;: 0,
        &quot;y&quot;: 0,
        &quot;width&quot;: 12,
        &quot;height&quot;: 4
      }
    }
  ]
}" spellcheck="false"></textarea>

        <!-- Validation Status -->
        <div v-if="validationResult" class="validation-status">
          <div v-if="validationResult.isValid" class="validation-status__success">
            ✅ Schema válido
          </div>
          <div v-else class="validation-status__errors">
            <strong>❌ Erros no schema:</strong>
            <ul>
              <li v-for="(error, index) in validationResult.errors" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
          <div v-if="validationResult.warnings && validationResult.warnings.length > 0"
            class="validation-status__warnings">
            <strong>⚠️ Avisos:</strong>
            <ul>
              <li v-for="(warning, index) in validationResult.warnings" :key="index">
                {{ warning }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Panel: Generated Code -->
      <div class="panel panel--output">
        <div class="panel__header">
          <h2 class="panel__title">💻 Código Gerado (Vue SFC)</h2>
          <div class="panel__actions">
            <button class="action-button action-button--sm" @click="copyGeneratedCode" :disabled="!generatedCode"
              title="Copiar código">
              📋 Copiar
            </button>
            <button class="action-button action-button--sm" @click="downloadGeneratedCode" :disabled="!generatedCode"
              title="Download arquivo">
              💾 Download
            </button>
          </div>
        </div>

        <div v-if="isGenerating" class="loading-state">
          <div class="spinner"></div>
          <p>Gerando código...</p>
        </div>

        <pre v-else-if="generatedCode" class="code-output"><code>{{ generatedCode }}</code></pre>

        <div v-else class="empty-state">
          <div class="empty-state__icon">⚡</div>
          <p class="empty-state__text">Nenhum código gerado ainda</p>
          <p class="empty-state__hint">
            Cole um schema JSON válido e clique em "Gerar Código"
          </p>
        </div>

        <!-- Code Stats -->
        <div v-if="codeStats" class="code-stats">
          <span>📊 {{ codeStats.lines }} linhas</span>
          <span>🧩 {{ codeStats.components }} componentes</span>
          <span>📦 {{ formatBytes(codeStats.size) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCodeGenerator } from '@/features/code-generator'
import type { PageSchema } from '@/core/schema-system/types'
import { createSchemaMetadata, createGridLayout } from '@/core/schema-system/types'

// ============================================
// STATE
// ============================================

const schemaInput = ref('')
const isGenerating = ref(false)
const validationResult = ref<any>(null)

// Code Generator Instance
const codeGenerator = useCodeGenerator({
  typescript: true,
  importStrategy: 'named',
  namingConvention: 'PascalCase',
  scopedStyles: true
})

// ============================================
// COMPUTED
// ============================================

const generatedCode = computed(() => {
  return codeGenerator.generatedCode.value?.content || null
})

const codeStats = computed(() => {
  const code = codeGenerator.generatedCode.value
  if (!code) return null

  return {
    lines: code.content.split('\n').length,
    components: code.components?.length || 0,
    size: new Blob([code.content]).size
  }
})

// ============================================
// METHODS
// ============================================

/**
 * Carrega schema de exemplo
 */
function loadExampleSchema() {
  const exampleSchema: PageSchema = {
    id: 'dashboard-example',
    type: 'page',
    metadata: createSchemaMetadata('Dashboard Exemplo', 'Dashboard de exemplo com múltiplos widgets'),
    layout: createGridLayout(12, 16),
    widgets: [
      {
        id: 'header-card',
        type: 'card',
        config: {
          title: 'Dashboard Overview',
          content: 'Bem-vindo ao sistema de gestão',
          variant: 'elevated'
        },
        position: {
          x: 0,
          y: 0,
          w: 12,
          h: 3
        }
      },
      {
        id: 'stats-total',
        type: 'card',
        config: {
          title: 'Total de Itens',
          content: '1,234',
          variant: 'outlined'
        },
        position: {
          x: 0,
          y: 3,
          w: 4,
          h: 4
        }
      },
      {
        id: 'stats-active',
        type: 'card',
        config: {
          title: 'Ativos',
          content: '856',
          variant: 'outlined'
        },
        position: {
          x: 4,
          y: 3,
          w: 4,
          h: 4
        }
      },
      {
        id: 'stats-pending',
        type: 'card',
        config: {
          title: 'Pendentes',
          content: '378',
          variant: 'outlined'
        },
        position: {
          x: 8,
          y: 3,
          w: 4,
          h: 4
        }
      },
      {
        id: 'info-alert',
        type: 'alert',
        config: {
          message: 'Sistema em operação normal',
          type: 'info'
        },
        position: {
          x: 0,
          y: 7,
          w: 12,
          h: 2
        }
      }
    ]
  }

  schemaInput.value = JSON.stringify(exampleSchema, null, 2)
  validationResult.value = null
}

/**
 * Limpa editor
 */
function clearSchema() {
  if (confirm('Tem certeza que deseja limpar o editor?')) {
    schemaInput.value = ''
    validationResult.value = null
    codeGenerator.generatedCode.value = null
  }
}

/**
 * Formata JSON no editor
 */
function formatSchema() {
  try {
    const parsed = JSON.parse(schemaInput.value)
    schemaInput.value = JSON.stringify(parsed, null, 2)
  } catch (error) {
    alert('JSON inválido. Não é possível formatar.')
  }
}

/**
 * Handle file upload
 */
function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    schemaInput.value = e.target?.result as string
    validationResult.value = null
  }
  reader.readAsText(file)
}

/**
 * Gera código a partir do schema
 */
async function generateCode() {
  try {
    isGenerating.value = true
    validationResult.value = null

    // Parse JSON
    let schema: PageSchema
    try {
      schema = JSON.parse(schemaInput.value)
    } catch (error) {
      validationResult.value = {
        isValid: false,
        errors: ['JSON inválido: ' + (error as Error).message]
      }
      return
    }

    // Valida schema
    const validation = codeGenerator.validateSchema(schema)
    validationResult.value = validation

    if (!validation.isValid) {
      return
    }

    // Gera código
    await codeGenerator.generate(schema)

  } catch (error) {
    console.error('Erro ao gerar código:', error)
    validationResult.value = {
      isValid: false,
      errors: ['Erro ao gerar código: ' + (error as Error).message]
    }
  } finally {
    isGenerating.value = false
  }
}

/**
 * Copia código gerado
 */
async function copyGeneratedCode() {
  if (!generatedCode.value) return

  try {
    await codeGenerator.copyToClipboard()
    alert('Código copiado para clipboard!')
  } catch (error) {
    console.error('Erro ao copiar:', error)
    alert('Erro ao copiar código')
  }
}

/**
 * Download código gerado
 */
function downloadGeneratedCode() {
  if (!generatedCode.value) return

  try {
    codeGenerator.downloadCode()
  } catch (error) {
    console.error('Erro ao fazer download:', error)
    alert('Erro ao fazer download do código')
  }
}

/**
 * Formata bytes
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
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
// CODE GENERATOR VIEW
// ============================================

.code-generator-view {
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
  flex-shrink: 0;

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
// VIEW CONTENT (Split View)
// ============================================

.view-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  overflow: hidden;

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
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

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }
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

  &__errors,
  &__warnings {
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

  &__errors {
    color: var(--color-danger);
  }

  &__warnings {
    color: var(--color-warning);
    margin-top: var(--spacing-sm);
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
// LOADING STATE
// ============================================

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border-base);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  p {
    margin: 0;
    font-size: var(--font-size-sm);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// ============================================
// CODE STATS
// ============================================

.code-stats {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--color-border-base);
  background: var(--color-bg-tertiary);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  flex-shrink: 0;

  span {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
}

// ============================================
// FORMAT SELECTOR
// ============================================

.format-selector {
  display: flex;
  gap: var(--spacing-xs);
  padding: 2px;
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
}

.format-button {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  border-radius: calc(var(--radius-md) - 2px);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  &--active {
    background: var(--color-primary);
    color: white;

    &:hover {
      background: var(--color-primary-hover);
    }
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
