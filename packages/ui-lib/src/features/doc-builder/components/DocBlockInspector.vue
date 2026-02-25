<template>
  <aside class="doc-block-inspector">
    <header class="inspector-header">
      <h3>Propriedades</h3>
      <button
        v-if="block"
        class="inspector-close"
        title="Fechar"
        @click="$emit('close')"
      >
        ✕
      </button>
    </header>
    
    <div v-if="!block" class="inspector-empty">
      <div class="empty-icon">📋</div>
      <p>Selecione um bloco para editar</p>
    </div>
    
    <div v-else class="inspector-content">
      <!-- Block Info -->
      <div class="block-info">
        <div class="block-type">
          <span class="type-icon">{{ getBlockIcon(block.type) }}</span>
          <span class="type-label">{{ getBlockLabel(block.type) }}</span>
        </div>
      </div>
      
      <!-- Content Properties -->
      <section class="property-section">
        <h4 class="section-title">Conteúdo</h4>
        <DynamicForm
          :schema="contentFields"
          :model-value="block.content"
          :hide-submit="true"
          @update:model-value="updateContent"
        />
      </section>
      
      <!-- Style Properties -->
      <section class="property-section">
        <h4 class="section-title">Estilo</h4>
        <DynamicForm
          :schema="styleFields"
          :model-value="block.style || {}"
          :hide-submit="true"
          @update:model-value="updateStyle"
        />
      </section>
      
      <!-- Conditions -->
      <section v-if="showConditions" class="property-section">
        <h4 class="section-title">Condições</h4>
        <DynamicForm
          :schema="conditionFields"
          :model-value="block.conditions || {}"
          :hide-submit="true"
          @update:model-value="updateConditions"
        />
      </section>
      
      <!-- Actions -->
      <div class="inspector-actions">
        <button class="btn-delete" @click="$emit('delete')">
          🗑️ Remover Bloco
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DynamicForm from '@/modules/DynamicForm/DynamicForm.vue'
import type { FormField } from '@/modules/DynamicForm/DynamicForm.vue'
import type { DocumentBlock, BlockType } from '../core/types'

export interface DocBlockInspectorProps {
  /** Bloco selecionado */
  block: DocumentBlock | null
  
  /** Mostrar seção de condições */
  showConditions?: boolean
}

export interface DocBlockInspectorEmits {
  (e: 'update:block', block: DocumentBlock): void
  (e: 'delete'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<DocBlockInspectorProps>(), {
  showConditions: true
})

const emit = defineEmits<DocBlockInspectorEmits>()

/**
 * Campos de conteúdo baseados no tipo de bloco
 */
const contentFields = computed((): FormField[] => {
  if (!props.block) return []
  
  switch (props.block.type) {
    case 'text':
      return [
        { name: 'text', label: 'Texto', type: 'textarea', required: true },
        {
          name: 'format',
          label: 'Formato',
          type: 'select',
          options: [
            { value: 'plain', label: 'Texto Simples' },
            { value: 'markdown', label: 'Markdown' },
            { value: 'html', label: 'HTML' }
          ]
        }
      ]
    
    case 'heading':
      return [
        { name: 'text', label: 'Texto', type: 'text', required: true },
        {
          name: 'level',
          label: 'Nível',
          type: 'select',
          options: [
            { value: 1, label: 'H1' },
            { value: 2, label: 'H2' },
            { value: 3, label: 'H3' },
            { value: 4, label: 'H4' },
            { value: 5, label: 'H5' },
            { value: 6, label: 'H6' }
          ]
        }
      ]
    
    case 'variable':
      return [
        { name: 'variableName', label: 'Nome da Variável', type: 'text', required: true },
        {
          name: 'format',
          label: 'Formato',
          type: 'select',
          options: [
            { value: '', label: 'Padrão' },
            { value: 'currency', label: 'Moeda' },
            { value: 'date', label: 'Data' },
            { value: 'datetime', label: 'Data e Hora' },
            { value: 'cpf', label: 'CPF' },
            { value: 'cnpj', label: 'CNPJ' },
            { value: 'phone', label: 'Telefone' },
            { value: 'cep', label: 'CEP' },
            { value: 'uppercase', label: 'MAIÚSCULAS' },
            { value: 'lowercase', label: 'minúsculas' },
            { value: 'capitalize', label: 'Capitalizar' }
          ]
        },
        { name: 'fallback', label: 'Valor Padrão', type: 'text' }
      ]
    
    case 'image':
      return [
        { name: 'src', label: 'URL da Imagem', type: 'text', required: true },
        { name: 'alt', label: 'Texto Alternativo', type: 'text' },
        { name: 'width', label: 'Largura (px)', type: 'number' },
        { name: 'height', label: 'Altura (px)', type: 'number' },
        {
          name: 'fit',
          label: 'Ajuste',
          type: 'select',
          options: [
            { value: 'contain', label: 'Conter' },
            { value: 'cover', label: 'Cobrir' },
            { value: 'fill', label: 'Preencher' },
            { value: 'none', label: 'Nenhum' }
          ]
        }
      ]
    
    case 'qrcode':
      return [
        { name: 'data', label: 'Dados do QR Code', type: 'text', required: true },
        { name: 'size', label: 'Tamanho (px)', type: 'number', placeholder: '150' },
        {
          name: 'errorCorrectionLevel',
          label: 'Correção de Erro',
          type: 'select',
          options: [
            { value: 'L', label: 'Baixo (L)' },
            { value: 'M', label: 'Médio (M)' },
            { value: 'Q', label: 'Alto (Q)' },
            { value: 'H', label: 'Muito Alto (H)' }
          ]
        }
      ]
    
    case 'spacer':
      return [
        { name: 'height', label: 'Altura (mm)', type: 'number', required: true, placeholder: '10' }
      ]
    
    case 'line':
      return [
        { name: 'color', label: 'Cor', type: 'text', placeholder: '#000000' },
        { name: 'width', label: 'Espessura (px)', type: 'number', placeholder: '1' },
        {
          name: 'style',
          label: 'Estilo',
          type: 'select',
          options: [
            { value: 'solid', label: 'Sólido' },
            { value: 'dashed', label: 'Tracejado' },
            { value: 'dotted', label: 'Pontilhado' }
          ]
        }
      ]
    
    default:
      return []
  }
})

/**
 * Campos de estilo (comuns a todos os blocos)
 */
const styleFields = computed((): FormField[] => [
  { name: 'fontSize', label: 'Tamanho da Fonte (px)', type: 'number' },
  {
    name: 'fontWeight',
    label: 'Peso da Fonte',
    type: 'select',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'bold', label: 'Negrito' }
    ]
  },
  {
    name: 'align',
    label: 'Alinhamento',
    type: 'select',
    options: [
      { value: 'left', label: 'Esquerda' },
      { value: 'center', label: 'Centro' },
      { value: 'right', label: 'Direita' },
      { value: 'justify', label: 'Justificar' }
    ]
  },
  { name: 'color', label: 'Cor do Texto', type: 'text', placeholder: '#000000' },
  { name: 'backgroundColor', label: 'Cor de Fundo', type: 'text', placeholder: '#ffffff' },
  { name: 'marginTop', label: 'Margem Superior (px)', type: 'number' },
  { name: 'marginBottom', label: 'Margem Inferior (px)', type: 'number' },
  { name: 'paddingTop', label: 'Padding Superior (px)', type: 'number' },
  { name: 'paddingBottom', label: 'Padding Inferior (px)', type: 'number' }
])

/**
 * Campos de condições
 */
const conditionFields = computed((): FormField[] => [
  { name: 'if', label: 'Condição (JavaScript)', type: 'text', placeholder: 'idade >= 18' },
  { name: 'show', label: 'Mostrar se variável', type: 'text', placeholder: 'mostrarSecao' },
  { name: 'hide', label: 'Ocultar se variável', type: 'text', placeholder: 'ocultarSecao' }
])

/**
 * Atualizar conteúdo do bloco
 */
function updateContent(newContent: any) {
  if (!props.block) return
  
  emit('update:block', {
    ...props.block,
    content: { ...props.block.content, ...newContent }
  })
}

/**
 * Atualizar estilo do bloco
 */
function updateStyle(newStyle: any) {
  if (!props.block) return
  
  emit('update:block', {
    ...props.block,
    style: { ...props.block.style, ...newStyle }
  })
}

/**
 * Atualizar condições do bloco
 */
function updateConditions(newConditions: any) {
  if (!props.block) return
  
  emit('update:block', {
    ...props.block,
    conditions: { ...props.block.conditions, ...newConditions }
  })
}

/**
 * Obter ícone do bloco
 */
function getBlockIcon(type: BlockType): string {
  const icons: Record<BlockType, string> = {
    text: '📝',
    heading: '📌',
    variable: '🔤',
    image: '🖼️',
    qrcode: '⬛',
    signature: '✍️',
    spacer: '↕️',
    line: '─',
    group: '📦',
    table: '📊',
    repeater: '🔁'
  }
  return icons[type] || '📄'
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
.doc-block-inspector {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--theme-background);
  border-left: 1px solid var(--theme-border);
  width: 320px;
  
  .inspector-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--theme-border);
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--theme-foreground);
    }
    
    .inspector-close {
      padding: 4px 8px;
      border: none;
      background: none;
      color: var(--theme-muted-foreground);
      cursor: pointer;
      font-size: 18px;
      
      &:hover {
        color: var(--theme-foreground);
      }
    }
  }
  
  .inspector-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    color: var(--theme-muted-foreground);
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    p {
      margin: 0;
      font-size: 14px;
    }
  }
  
  .inspector-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
  
  .block-info {
    margin-bottom: 24px;
    padding: 12px;
    background-color: var(--theme-muted);
    border-radius: 8px;
    
    .block-type {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .type-icon {
        font-size: 20px;
      }
      
      .type-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--theme-foreground);
      }
    }
  }
  
  .property-section {
    margin-bottom: 24px;
    
    &:last-of-type {
      margin-bottom: 32px;
    }
    
    .section-title {
      margin: 0 0 12px 0;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--theme-muted-foreground);
      letter-spacing: 0.5px;
    }
  }
  
  .inspector-actions {
    padding: 16px 0;
    border-top: 1px solid var(--theme-border);
    
    .btn-delete {
      width: 100%;
      padding: 10px 16px;
      border: 1px solid var(--theme-destructive);
      border-radius: 6px;
      background-color: var(--theme-background);
      color: var(--theme-destructive);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background-color: var(--theme-destructive);
        color: var(--theme-destructive-foreground);
      }
    }
  }
}
</style>
