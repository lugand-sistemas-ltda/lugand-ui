<template>
  <aside class="doc-block-palette">
    <header class="palette-header">
      <h3>Blocos</h3>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar bloco..."
        class="palette-search"
      />
    </header>
    
    <div class="palette-content">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="palette-category"
      >
        <h4 class="category-title">{{ category.label }}</h4>
        
        <div class="blocks-grid">
          <button
            v-for="block in category.blocks"
            :key="block.type"
            class="block-item"
            :title="block.description"
            @click="handleBlockClick(block)"
          >
            <span class="block-icon">{{ block.icon }}</span>
            <span class="block-label">{{ block.label }}</span>
          </button>
        </div>
      </div>
      
      <div v-if="filteredCategories.length === 0" class="palette-empty">
        <p>Nenhum bloco encontrado</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BlockType } from '../core/types'

export interface BlockDefinition {
  type: BlockType
  label: string
  icon: string
  description: string
  category: string
}

export interface BlockCategory {
  id: string
  label: string
  blocks: BlockDefinition[]
}

export interface DocBlockPaletteProps {
  /** Categorias e blocos disponíveis */
  categories?: BlockCategory[]
}

export interface DocBlockPaletteEmits {
  (e: 'block-select', blockType: BlockType): void
}

const props = withDefaults(defineProps<DocBlockPaletteProps>(), {
  categories: () => [
    {
      id: 'content',
      label: 'Conteúdo',
      blocks: [
        { type: 'text', label: 'Texto', icon: '📝', description: 'Bloco de texto simples', category: 'content' },
        { type: 'heading', label: 'Título', icon: '📌', description: 'Cabeçalho/título', category: 'content' },
        { type: 'variable', label: 'Variável', icon: '🔤', description: 'Variável dinâmica', category: 'content' }
      ]
    },
    {
      id: 'media',
      label: 'Mídia',
      blocks: [
        { type: 'image', label: 'Imagem', icon: '🖼️', description: 'Imagem ou foto', category: 'media' },
        { type: 'qrcode', label: 'QR Code', icon: '⬛', description: 'Código QR', category: 'media' },
        { type: 'signature', label: 'Assinatura', icon: '✍️', description: 'Campo de assinatura', category: 'media' }
      ]
    },
    {
      id: 'layout',
      label: 'Layout',
      blocks: [
        { type: 'spacer', label: 'Espaçador', icon: '↕️', description: 'Espaço vertical', category: 'layout' },
        { type: 'line', label: 'Linha', icon: '─', description: 'Linha horizontal', category: 'layout' },
        { type: 'group', label: 'Grupo', icon: '📦', description: 'Agrupar blocos', category: 'layout' }
      ]
    },
    {
      id: 'data',
      label: 'Dados',
      blocks: [
        { type: 'table', label: 'Tabela', icon: '📊', description: 'Tabela de dados', category: 'data' },
        { type: 'repeater', label: 'Repetidor', icon: '🔁', description: 'Loop sobre array', category: 'data' }
      ]
    }
  ]
})

const emit = defineEmits<DocBlockPaletteEmits>()

const searchQuery = ref('')

/**
 * Categorias filtradas pela busca
 */
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return props.categories
  }
  
  const query = searchQuery.value.toLowerCase()
  
  return props.categories
    .map(category => ({
      ...category,
      blocks: category.blocks.filter(
        block =>
          block.label.toLowerCase().includes(query) ||
          block.description.toLowerCase().includes(query) ||
          block.type.toLowerCase().includes(query)
      )
    }))
    .filter(category => category.blocks.length > 0)
})

/**
 * Handler para clique em bloco
 */
function handleBlockClick(block: BlockDefinition) {
  emit('block-select', block.type)
}
</script>

<style scoped lang="scss">
.doc-block-palette {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--theme-background);
  border-right: 1px solid var(--theme-border);
  width: 280px;
  
  .palette-header {
    padding: 16px;
    border-bottom: 1px solid var(--theme-border);
    
    h3 {
      margin: 0 0 12px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--theme-foreground);
    }
    
    .palette-search {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--theme-border);
      border-radius: 6px;
      font-size: 14px;
      background-color: var(--theme-background);
      color: var(--theme-foreground);
      
      &:focus {
        outline: none;
        border-color: var(--theme-primary);
      }
      
      &::placeholder {
        color: var(--theme-muted-foreground);
      }
    }
  }
  
  .palette-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
  
  .palette-category {
    margin-bottom: 24px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .category-title {
      margin: 0 0 12px 0;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--theme-muted-foreground);
      letter-spacing: 0.5px;
    }
  }
  
  .blocks-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .block-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    border: 1px solid var(--theme-border);
    border-radius: 8px;
    background-color: var(--theme-card);
    color: var(--theme-card-foreground);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--theme-primary);
      background-color: var(--theme-accent);
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    .block-icon {
      font-size: 24px;
    }
    
    .block-label {
      font-size: 12px;
      font-weight: 500;
      text-align: center;
    }
  }
  
  .palette-empty {
    text-align: center;
    padding: 48px 16px;
    color: var(--theme-muted-foreground);
    
    p {
      margin: 0;
      font-size: 14px;
    }
  }
}
</style>
