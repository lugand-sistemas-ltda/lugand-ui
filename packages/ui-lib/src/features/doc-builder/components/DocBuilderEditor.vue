<template>
  <div class="doc-builder-editor">
    <!-- Palette -->
    <DocBlockPalette @block-select="handleBlockAdd" />
    
    <!-- Canvas -->
    <main class="editor-canvas">
      <header class="canvas-header">
        <div class="header-left">
          <h2>{{ schema.name }}</h2>
          <span class="document-info">{{ schema.items.length }} blocos</span>
        </div>
        
        <div class="header-actions">
          <button class="btn-action" @click="showVariablesModal = true">
            🔤 Variáveis ({{ schema.variables.length }})
          </button>
          <button class="btn-action" @click="handlePreview">
            👁️ Pré-visualizar
          </button>
          <button class="btn-action btn-save" :disabled="!isDirty" @click="handleSave">
            💾 Salvar
          </button>
        </div>
      </header>
      
      <div class="canvas-content">
        <div v-if="schema.items.length === 0" class="canvas-empty">
          <div class="empty-icon">📄</div>
          <h3>Documento Vazio</h3>
          <p>Adicione blocos da paleta à esquerda para começar</p>
        </div>
        
        <div v-else class="canvas-blocks">
          <div
            v-for="(block, index) in schema.items"
            :key="block.id"
            :class="['canvas-block', { 'is-selected': selectedBlockId === block.id }]"
            @click="selectBlock(block.id)"
          >
            <div class="block-toolbar">
              <span class="block-number">{{ index + 1 }}</span>
              <span class="block-type">{{ getBlockLabel(block.type) }}</span>
              
              <div class="block-actions">
                <button
                  class="btn-icon"
                  :disabled="index === 0"
                  title="Mover para cima"
                  @click.stop="moveBlock(block.id, 'up')"
                >
                  ↑
                </button>
                <button
                  class="btn-icon"
                  :disabled="index === schema.items.length - 1"
                  title="Mover para baixo"
                  @click.stop="moveBlock(block.id, 'down')"
                >
                  ↓
                </button>
                <button
                  class="btn-icon"
                  title="Duplicar"
                  @click.stop="duplicateBlock(block.id)"
                >
                  📋
                </button>
                <button
                  class="btn-icon btn-delete"
                  title="Remover"
                  @click.stop="removeBlock(block.id)"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div class="block-preview">
              <component
                :is="getBlockComponent(block.type)"
                :content="block.content"
                :data="previewData"
                :style="block.style"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Inspector -->
    <DocBlockInspector
      :block="selectedBlock"
      @update:block="handleBlockUpdate"
      @delete="handleBlockDelete"
      @close="selectedBlockId = null"
    />
    
    <!-- Preview Modal -->
    <DocPreview
      :is-open="showPreview"
      :schema="schema as any"
      :initial-data="previewData"
      @close="showPreview = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDocBuilder } from '../composables'
import type { UseDocBuilderOptions } from '../composables'
import type { DocumentBlock, BlockType, DocumentData } from '../core/types'
import DocBlockPalette from './DocBlockPalette.vue'
import DocBlockInspector from './DocBlockInspector.vue'
import DocPreview from './DocPreview.vue'
import {
  DocBlockText,
  DocBlockHeading,
  DocBlockVariable,
  DocBlockQRCode,
  DocBlockImage
} from '../blocks'

export interface DocBuilderEditorProps {
  /** Opções do builder */
  options?: UseDocBuilderOptions
}

const props = withDefaults(defineProps<DocBuilderEditorProps>(), {
  options: () => ({})
})

// Builder
const builder = useDocBuilder(props.options)
const { schema, isDirty, save, updateBlock, removeBlock, moveBlock, duplicateBlock } = builder

// Estado local
const selectedBlockId = ref<string | null>(null)
const showPreview = ref(false)
const showVariablesModal = ref(false)
const previewData = ref<DocumentData>({})

/**
 * Bloco selecionado
 */
const selectedBlock = computed((): DocumentBlock | null => {
  if (!selectedBlockId.value) return null
  return schema.value.items.find(b => b.id === selectedBlockId.value) || null
})

/**
 * Handler para adicionar bloco
 */
function handleBlockAdd(blockType: BlockType) {
  const defaultContent = getDefaultContent(blockType)
  
  // Criar novo bloco
  const newBlock: DocumentBlock = {
    id: `block-${Date.now()}`,
    type: blockType,
    content: defaultContent,
    props: {}
  }
  
  builder.addBlock(newBlock)
  
  // Selecionar o novo bloco
  selectedBlockId.value = newBlock.id
}

/**
 * Handler para atualizar bloco
 */
function handleBlockUpdate(updatedBlock: DocumentBlock) {
  updateBlock(updatedBlock.id, updatedBlock)
}

/**
 * Handler para deletar bloco
 */
function handleBlockDelete() {
  if (selectedBlockId.value) {
    removeBlock(selectedBlockId.value)
    selectedBlockId.value = null
  }
}

/**
 * Selecionar bloco
 */
function selectBlock(blockId: string) {
  selectedBlockId.value = blockId
}

/**
 * Handler para preview
 */
function handlePreview() {
  // Gerar dados de exemplo
  previewData.value = builder.generatePreviewData()
  showPreview.value = true
}

/**
 * Handler para salvar
 */
async function handleSave() {
  try {
    await save()
    // Mostrar toast de sucesso (assumindo que useToast está disponível)
    console.log('Documento salvo com sucesso')
  } catch (error) {
    console.error('Erro ao salvar documento:', error)
  }
}

/**
 * Obter conteúdo padrão para novo bloco
 */
function getDefaultContent(blockType: BlockType): any {
  switch (blockType) {
    case 'text':
      return { text: 'Digite seu texto aqui...', format: 'plain' }
    
    case 'heading':
      return { text: 'Novo Título', level: 2 }
    
    case 'variable':
      return { variableName: 'variavel', format: '' }
    
    case 'image':
      return { src: '', alt: '', width: 200 }
    
    case 'qrcode':
      return { data: '{{codigo}}', size: 150, errorCorrectionLevel: 'M' }
    
    case 'signature':
      return { label: 'Assinatura', showDate: true, width: 200, height: 100 }
    
    case 'spacer':
      return { height: 10 }
    
    case 'line':
      return { color: '#000000', width: 1, style: 'solid' }
    
    case 'table':
      return { headers: ['Coluna 1', 'Coluna 2'], rows: [], dataSource: '' }
    
    case 'group':
      return { blocks: [] }
    
    case 'repeater':
      return { dataSource: '', template: [] }
    
    default:
      return {}
  }
}

/**
 * Obter componente do bloco para preview
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
 * Obter label do bloco
 */
function getBlockLabel(type: BlockType): string {
  const labels: Record<BlockType, string> = {
    text: 'Texto',
    heading: 'Título',
    variable: 'Variável',
    image: 'Imagem',
    qrcode: 'QR Code',
    signature: 'Assinatura',
    spacer: 'Espaçador',
    line: 'Linha',
    group: 'Grupo',
    table: 'Tabela',
    repeater: 'Repetidor'
  }
  return labels[type] || type
}
</script>

<style scoped lang="scss">
.doc-builder-editor {
  display: flex;
  height: 100vh;
  background-color: var(--theme-background);
  
  .editor-canvas {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .canvas-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid var(--theme-border);
      background-color: var(--theme-card);
      
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        
        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--theme-foreground);
        }
        
        .document-info {
          padding: 4px 8px;
          border-radius: 4px;
          background-color: var(--theme-muted);
          color: var(--theme-muted-foreground);
          font-size: 12px;
        }
      }
      
      .header-actions {
        display: flex;
        gap: 8px;
        
        .btn-action {
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
          
          &.btn-save {
            border-color: var(--theme-primary);
            background-color: var(--theme-primary);
            color: var(--theme-primary-foreground);
          }
        }
      }
    }
    
    .canvas-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background-color: var(--theme-muted);
    }
    
    .canvas-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: var(--theme-muted-foreground);
      
      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      
      h3 {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
      }
      
      p {
        margin: 0;
        font-size: 14px;
      }
    }
    
    .canvas-blocks {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .canvas-block {
      margin-bottom: 16px;
      border: 2px solid transparent;
      border-radius: 8px;
      background-color: white;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        border-color: var(--theme-border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      &.is-selected {
        border-color: var(--theme-primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      .block-toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background-color: var(--theme-muted);
        border-bottom: 1px solid var(--theme-border);
        
        .block-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--theme-primary);
          color: white;
          font-size: 12px;
          font-weight: 600;
        }
        
        .block-type {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-foreground);
        }
        
        .block-actions {
          display: flex;
          gap: 4px;
        }
        
        .btn-icon {
          padding: 4px 8px;
          border: 1px solid var(--theme-border);
          border-radius: 4px;
          background-color: white;
          color: var(--theme-foreground);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          
          &:hover:not(:disabled) {
            border-color: var(--theme-primary);
            background-color: var(--theme-primary);
            color: white;
          }
          
          &:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          
          &.btn-delete:hover:not(:disabled) {
            border-color: var(--theme-destructive);
            background-color: var(--theme-destructive);
          }
        }
      }
      
      .block-preview {
        padding: 16px;
      }
    }
  }
}
</style>
