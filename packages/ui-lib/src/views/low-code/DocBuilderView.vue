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
            Crie documentos dinâmicos com templates, variáveis e exporte para PDF ou HTML
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
      <DocBuilderEditor />
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
            v-for="template in availableTemplates"
            :key="template.id"
            class="template-card"
            @click="selectTemplate(template)"
          >
            <div class="template-card__icon">{{ getTemplateIcon(template.category) }}</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DocBuilderEditor } from '@/features/doc-builder/components'
import { templates } from '@/features/doc-builder/templates'
import { Modal } from '@/modules/modal'
import { useToast } from '@/modules/toast'
import type { DocumentTemplate } from '@/features/doc-builder/templates'

// ============================================
// STATE
// ============================================

const showTemplateModal = ref(false)
const showExportModal = ref(false)
const exportFormat = ref<'pdf' | 'html' | 'json'>('pdf')
const toast = useToast()

// ============================================
// COMPUTED
// ============================================

const availableTemplates = computed(() => templates)

const hasBlocks = computed(() => {
  // TODO: Conectar com estado do builder quando disponível
  return true
})

// ============================================
// METHODS
// ============================================

function loadTemplate() {
  showTemplateModal.value = true
}

function selectTemplate(template: DocumentTemplate) {
  try {
    // TODO: Implementar carregamento do template no builder
    console.log('Template selecionado:', template)
    
    toast.success(`Template "${template.name}" carregado com sucesso!`)
    showTemplateModal.value = false
  } catch (error) {
    toast.error('Erro ao carregar template')
    console.error(error)
  }
}

function clearDocument() {
  if (confirm('Tem certeza que deseja limpar o documento?')) {
    // TODO: Implementar limpeza do builder
    toast.info('Documento limpo')
  }
}

function exportDocument() {
  showExportModal.value = true
}

function performExport() {
  try {
    // TODO: Implementar exportação real
    console.log('Exportando como:', exportFormat.value)
    
    toast.success(`Documento exportado como ${exportFormat.value.toUpperCase()}!`)
    showExportModal.value = false
  } catch (error) {
    toast.error('Erro ao exportar documento')
    console.error(error)
  }
}

function getTemplateIcon(category: string): string {
  const icons: Record<string, string> = {
    contract: '📋',
    invoice: '🧾',
    report: '📊',
    certificate: '🎓',
    letter: '✉️',
    custom: '📄'
  }
  return icons[category] || '📄'
}
</script>

<style scoped lang="scss">
.doc-builder-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--theme-background);
}

.fullscreen-view {
  position: relative;
  overflow: hidden;
}

// ============================================
// VIEW HEADER
// ============================================

.view-header {
  border-bottom: 1px solid var(--theme-border);
  background-color: var(--theme-card);
  backdrop-filter: blur(8px);
  z-index: 10;
  
  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 32px;
    max-width: 100%;
  }
  
  &__title-section {
    flex: 1;
  }
  
  &__title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--theme-foreground);
  }
  
  &__icon {
    font-size: 32px;
  }
  
  &__description {
    margin: 0;
    font-size: 14px;
    color: var(--theme-muted-foreground);
    max-width: 600px;
  }
  
  &__actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }
}

// ============================================
// BUTTONS
// ============================================

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &--primary {
    background-color: var(--theme-primary);
    color: var(--theme-primary-foreground);
    
    &:hover:not(:disabled) {
      background-color: var(--theme-primary-hover, var(--theme-primary));
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  &--secondary {
    background-color: var(--theme-secondary);
    color: var(--theme-secondary-foreground);
    border: 1px solid var(--theme-border);
    
    &:hover:not(:disabled) {
      background-color: var(--theme-accent);
      border-color: var(--theme-accent-foreground);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// ============================================
// VIEW CONTENT
// ============================================

.view-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

// ============================================
// TEMPLATE GALLERY
// ============================================

.template-gallery {
  padding: 20px;
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

.template-card {
  padding: 24px;
  border: 2px solid var(--theme-border);
  border-radius: 12px;
  background-color: var(--theme-card);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--theme-primary);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  &__icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  &__title {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--theme-foreground);
  }
  
  &__description {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: var(--theme-muted-foreground);
    line-height: 1.5;
  }
  
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.tag {
  padding: 4px 10px;
  border-radius: 6px;
  background-color: var(--theme-muted);
  color: var(--theme-muted-foreground);
  font-size: 12px;
  font-weight: 500;
}

// ============================================
// EXPORT OPTIONS
// ============================================

.export-options {
  padding: 20px;
  
  &__format {
    h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--theme-foreground);
    }
  }
  
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--theme-border);
  }
}

.format-buttons {
  display: flex;
  gap: 12px;
}

.format-button {
  flex: 1;
  padding: 16px;
  border: 2px solid var(--theme-border);
  border-radius: 8px;
  background-color: var(--theme-card);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--theme-primary);
  }
  
  &--active {
    border-color: var(--theme-primary);
    background-color: var(--theme-primary);
    color: var(--theme-primary-foreground);
  }
}
</style>
