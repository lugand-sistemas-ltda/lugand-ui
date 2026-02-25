<template>
  <teleport to="body">
    <div v-if="isOpen" class="doc-preview-overlay" @click="handleOverlayClick">
      <div class="doc-preview-modal" @click.stop>
        <header class="preview-header">
          <h2>Pré-visualização do Documento</h2>
          <button class="btn-close" @click="$emit('close')">✕</button>
        </header>
        
        <div class="preview-toolbar">
          <div class="toolbar-section">
            <label for="preview-data">Dados de Teste:</label>
            <button class="btn-auto-fill" @click="fillSampleData">
              ⚡ Preencher Automaticamente
            </button>
          </div>
          
          <div class="toolbar-section">
            <button class="btn-export" :disabled="isExporting" @click="exportToPDF">
              📄 Exportar PDF
            </button>
            <button class="btn-export" @click="exportToHTML">
              🌐 Exportar HTML
            </button>
          </div>
        </div>
        
        <div class="preview-content">
          <div class="preview-document">
            <component
              :is="getBlockComponent(block.type)"
              v-for="block in schema.items"
              :key="block.id"
              :content="block.content"
              :data="previewData"
              :style="block.style"
              class="preview-block"
            />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/modules/toast'
import type { DocumentSchema, DocumentData, BlockType } from '../core/types'
import {
  DocBlockText,
  DocBlockHeading,
  DocBlockVariable,
  DocBlockQRCode,
  DocBlockImage
} from '../blocks'

export interface DocPreviewProps {
  /** Se o modal está aberto */
  isOpen: boolean
  
  /** Schema do documento */
  schema: DocumentSchema
  
  /** Dados iniciais para preview */
  initialData?: DocumentData
}

export interface DocPreviewEmits {
  (e: 'close'): void
  (e: 'export-pdf', blob: Blob): void
  (e: 'export-html', html: string): void
}

const props = withDefaults(defineProps<DocPreviewProps>(), {
  initialData: () => ({})
})

const emit = defineEmits<DocPreviewEmits>()

const { success, error, info } = useToast()

const previewData = ref<DocumentData>({ ...props.initialData })
const isExporting = ref(false)

/**
 * Preencher com dados de exemplo
 */
function fillSampleData() {
  const sampleData: DocumentData = {}
  
  props.schema.variables.forEach(variable => {
    switch (variable.type) {
      case 'text':
        sampleData[variable.name] = 'Texto de exemplo'
        break
      case 'number':
        sampleData[variable.name] = 123.45
        break
      case 'date':
        sampleData[variable.name] = new Date().toISOString().split('T')[0]
        break
      case 'boolean':
        sampleData[variable.name] = true
        break
      default:
        sampleData[variable.name] = variable.defaultValue || ''
    }
  })
  
  previewData.value = sampleData
  success('Dados preenchidos automaticamente')
}

/**
 * Exportar para PDF
 */
async function exportToPDF() {
  isExporting.value = true
  
  try {
    info('Exportando PDF...')
    
    // Simular exportação (em produção, usar o builder real)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    success('PDF exportado com sucesso')
  } catch (err) {
    error('Erro ao exportar PDF')
  } finally {
    isExporting.value = false
  }
}

/**
 * Exportar para HTML
 */
function exportToHTML() {
  try {
    info('Exportando HTML...')
    
    setTimeout(() => {
      success('HTML exportado com sucesso')
    }, 500)
  } catch (err) {
    error('Erro ao exportar HTML')
  }
}

/**
 * Obter componente do bloco
 */
function getBlockComponent(type: BlockType) {
  const components: Record<string, any> = {
    text: DocBlockText,
    heading: DocBlockHeading,
    variable: DocBlockVariable,
    qrcode: DocBlockQRCode,
    image: DocBlockImage
  }
  
  return components[type] || DocBlockText
}

/**
 * Handler para clique no overlay
 */
function handleOverlayClick() {
  emit('close')
}
</script>

<style scoped lang="scss">
.doc-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.doc-preview-modal {
  background-color: var(--theme-background);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  
  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--theme-border);
    
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--theme-foreground);
    }
    
    .btn-close {
      padding: 4px 8px;
      border: none;
      background: none;
      color: var(--theme-muted-foreground);
      cursor: pointer;
      font-size: 24px;
      
      &:hover {
        color: var(--theme-foreground);
      }
    }
  }
  
  .preview-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 24px;
    border-bottom: 1px solid var(--theme-border);
    background-color: var(--theme-muted);
    
    .toolbar-section {
      display: flex;
      align-items: center;
      gap: 12px;
      
      label {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-foreground);
      }
    }
    
    .btn-auto-fill,
    .btn-export {
      padding: 8px 16px;
      border: 1px solid var(--theme-border);
      border-radius: 6px;
      background-color: var(--theme-background);
      color: var(--theme-foreground);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover:not(:disabled) {
        border-color: var(--theme-primary);
        background-color: var(--theme-primary);
        color: var(--theme-primary-foreground);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
  
  .preview-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background-color: var(--theme-muted);
  }
  
  .preview-document {
    max-width: 800px;
    margin: 0 auto;
    padding: 48px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-height: 400px;
    
    .preview-block {
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
