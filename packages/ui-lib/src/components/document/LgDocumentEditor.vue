<template>
  <div class="lg-document-editor" :class="{ disabled: disabled }">
    <!-- Toolbar -->
    <div v-if="!hideToolbar" class="editor-toolbar">
      <!-- Text formatting -->
      <div class="toolbar-group">
        <button
          type="button"
          class="toolbar-btn"
          :class="{ active: formatState.bold }"
          @click="execCommand('bold')"
          title="Negrito (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        
        <button
          type="button"
          class="toolbar-btn"
          :class="{ active: formatState.italic }"
          @click="execCommand('italic')"
          title="Itálico (Ctrl+I)"
        >
          <em>I</em>
        </button>
        
        <button
          type="button"
          class="toolbar-btn"
          :class="{ active: formatState.underline }"
          @click="execCommand('underline')"
          title="Sublinhado (Ctrl+U)"
        >
          <u>U</u>
        </button>
      </div>
      
      <!-- Alignment -->
      <div class="toolbar-separator"></div>
      <div class="toolbar-group">
        <button
          type="button"
          class="toolbar-btn"
          @click="execCommand('justifyLeft')"
          title="Alinhar à esquerda"
        >
          ≡
        </button>
        
        <button
          type="button"
          class="toolbar-btn"
          @click="execCommand('justifyCenter')"
          title="Centralizar"
        >
          ≡
        </button>
        
        <button
          type="button"
          class="toolbar-btn"
          @click="execCommand('justifyRight')"
          title="Alinhar à direita"
        >
          ≡
        </button>
      </div>
      
      <!-- Lists -->
      <div class="toolbar-separator"></div>
      <div class="toolbar-group">
        <button
          type="button"
          class="toolbar-btn"
          @click="execCommand('insertUnorderedList')"
          title="Lista com marcadores"
        >
          •
        </button>
        
        <button
          type="button"
          class="toolbar-btn"
          @click="execCommand('insertOrderedList')"
          title="Lista numerada"
        >
          1.
        </button>
      </div>
      
      <!-- Variables -->
      <div v-if="variables && variables.length > 0" class="toolbar-separator"></div>
      <div v-if="variables && variables.length > 0" class="toolbar-group">
        <select
          class="variable-select"
          @change="insertVariableFromSelect"
          title="Inserir variável"
        >
          <option value="">Inserir Variável</option>
          <option
            v-for="variable in variables"
            :key="variable.name"
            :value="variable.name"
          >
            {{ variable.label || variable.name }}
          </option>
        </select>
      </div>
      
      <!-- Undo/Redo -->
      <div class="toolbar-separator"></div>
      <div class="toolbar-group">
        <button
          type="button"
          class="toolbar-btn"
          @click="undo"
          title="Desfazer (Ctrl+Z)"
        >
          ↶
        </button>
        
        <button
          type="button"
          class="toolbar-btn"
          @click="redo"
          title="Refazer (Ctrl+Y)"
        >
          ↷
        </button>
      </div>
      
      <!-- Clear formatting -->
      <div class="toolbar-separator"></div>
      <div class="toolbar-group">
        <button
          type="button"
          class="toolbar-btn"
          @click="execCommand('removeFormat')"
          title="Limpar formatação"
        >
          ✕
        </button>
      </div>
    </div>
    
    <!-- Editor content -->
    <div
      ref="editorRef"
      class="editor-content"
      contenteditable="true"
      :style="editorStyle"
      @input="handleInput"
      @keydown="handleKeydown"
      @mouseup="updateFormatState"
      @keyup="updateFormatState"
      @paste="handlePaste"
    ></div>
    
    <!-- Footer -->
    <div v-if="showFooter" class="editor-footer">
      <span class="char-count">
        {{ characterCount }}{{ maxLength ? ` / ${maxLength}` : '' }} caracteres
      </span>
      
      <span v-if="error" class="error-message">
        {{ error }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

export interface DocumentVariable {
  name: string
  label?: string
  defaultValue?: string
}

interface Props {
  /** Conteúdo HTML do editor */
  modelValue?: string
  
  /** Variáveis disponíveis para inserção */
  variables?: DocumentVariable[]
  
  /** Placeholder quando vazio */
  placeholder?: string
  
  /** Altura mínima do editor */
  minHeight?: string
  
  /** Altura máxima do editor */
  maxHeight?: string
  
  /** Máximo de caracteres */
  maxLength?: number
  
  /** Desabilitar edição */
  disabled?: boolean
  
  /** Ocultar toolbar */
  hideToolbar?: boolean
  
  /** Mostrar rodapé com contador */
  showFooter?: boolean
  
  /** Mensagem de erro */
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Digite aqui...',
  minHeight: '200px',
  maxHeight: '600px',
  showFooter: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'blur': []
  'focus': []
}>()

const editorRef = ref<HTMLElement>()
const formatState = ref({
  bold: false,
  italic: false,
  underline: false
})

const editorStyle = computed(() => ({
  'min-height': props.minHeight,
  'max-height': props.maxHeight
}))

const characterCount = computed(() => {
  if (!editorRef.value) return 0
  return editorRef.value.innerText.length
})

// Execute formatting command
function execCommand(command: string, value?: string) {
  document.execCommand(command, false, value)
  editorRef.value?.focus()
  updateFormatState()
  handleInput()
}

// Undo/Redo
function undo() {
  document.execCommand('undo')
  handleInput()
}

function redo() {
  document.execCommand('redo')
  handleInput()
}

// Insert variable as a non-editable span
function insertVariable(variable: DocumentVariable) {
  const selection = window.getSelection()
  if (!selection?.rangeCount) return
  
  const range = selection.getRangeAt(0)
  range.deleteContents()
  
  // Create variable node
  const variableNode = document.createElement('span')
  variableNode.className = 'doc-variable'
  variableNode.contentEditable = 'false'
  variableNode.dataset.variableName = variable.name
  variableNode.textContent = `{{${variable.label || variable.name}}}`
  
  // Insert variable
  range.insertNode(variableNode)
  
  // Add space after variable
  const space = document.createTextNode(' ')
  range.insertNode(space)
  
  // Move cursor after space
  range.setStartAfter(space)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
  
  handleInput()
}

// Insert variable from select dropdown
function insertVariableFromSelect(event: Event) {
  const select = event.target as HTMLSelectElement
  const variableName = select.value
  
  if (!variableName) return
  
  const variable = props.variables?.find(v => v.name === variableName)
  if (variable) {
    insertVariable(variable)
  }
  
  // Reset select
  select.value = ''
  editorRef.value?.focus()
}

// Update toolbar button states
function updateFormatState() {
  formatState.value = {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline')
  }
}

// Handle content changes
function handleInput() {
  if (!editorRef.value) return
  
  const html = editorRef.value.innerHTML
  emit('update:modelValue', html)
  emit('change', html)
}

// Handle paste - clean up formatting
function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  
  const text = event.clipboardData?.getData('text/plain')
  if (!text) return
  
  // Insert as plain text
  document.execCommand('insertText', false, text)
}

// Prevent exceeding max length
function handleKeydown(event: KeyboardEvent) {
  if (!props.maxLength) return
  
  if (characterCount.value >= props.maxLength) {
    // Allow: backspace, delete, arrows, ctrl+a, ctrl+c, ctrl+v, ctrl+x
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    const isCtrlKey = event.ctrlKey || event.metaKey
    const isAllowedCtrl = isCtrlKey && ['a', 'c', 'v', 'x', 'z', 'y'].includes(event.key.toLowerCase())
    
    if (!allowed.includes(event.key) && !isAllowedCtrl) {
      event.preventDefault()
    }
  }
}

// Get content as plain text
function getPlainText(): string {
  return editorRef.value?.innerText || ''
}

// Get content as HTML
function getHTML(): string {
  return editorRef.value?.innerHTML || ''
}

// Set content
function setContent(html: string) {
  if (editorRef.value) {
    editorRef.value.innerHTML = html
  }
}

// Clear content
function clear() {
  if (editorRef.value) {
    editorRef.value.innerHTML = ''
    handleInput()
  }
}

// Focus editor
function focus() {
  editorRef.value?.focus()
}

// Check if empty
function isEmpty(): boolean {
  return characterCount.value === 0
}

// Initialize content
onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue
  }
  
  // Add placeholder behavior
  if (editorRef.value && props.placeholder) {
    editorRef.value.dataset.placeholder = props.placeholder
  }
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && editorRef.value.innerHTML !== newValue) {
    editorRef.value.innerHTML = newValue || ''
  }
})

// Expose methods
defineExpose({
  getPlainText,
  getHTML,
  setContent,
  clear,
  focus,
  isEmpty,
  insertVariable
})
</script>

<style scoped lang="scss">
.lg-document-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: white;
  overflow: hidden;
  
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  .editor-toolbar {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
    background: var(--background-secondary);
    flex-wrap: wrap;
    
    .toolbar-group {
      display: flex;
      gap: 4px;
    }
    
    .toolbar-separator {
      width: 1px;
      height: 24px;
      background: var(--border-color);
      margin: 0 var(--spacing-xs);
    }
    
    .toolbar-btn {
      min-width: 32px;
      height: 32px;
      padding: 4px 8px;
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      
      &:hover {
        background: var(--background-hover);
        border-color: var(--border-color);
      }
      
      &.active {
        background: var(--primary-light);
        color: var(--primary);
        border-color: var(--primary);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .variable-select {
      height: 32px;
      padding: 4px 8px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      background: white;
      font-size: 14px;
      cursor: pointer;
      
      &:hover {
        border-color: var(--primary);
      }
      
      &:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-light);
      }
    }
  }
  
  .editor-content {
    flex: 1;
    padding: var(--spacing-lg);
    overflow-y: auto;
    outline: none;
    line-height: 1.6;
    font-size: 14px;
    color: var(--text-primary);
    
    // Placeholder
    &:empty:before {
      content: attr(data-placeholder);
      color: var(--text-secondary);
      opacity: 0.6;
    }
    
    // Variable styling
    :deep(.doc-variable) {
      display: inline-block;
      padding: 2px 8px;
      margin: 0 2px;
      background: var(--primary-light);
      color: var(--primary);
      border-radius: var(--radius-sm);
      font-weight: 500;
      font-size: 0.9em;
      cursor: default;
      user-select: none;
      white-space: nowrap;
    }
    
    // Lists
    :deep(ul),
    :deep(ol) {
      margin: 8px 0;
      padding-left: 24px;
    }
    
    // Paragraphs
    :deep(p) {
      margin: 8px 0;
    }
  }
  
  .editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    border-top: 1px solid var(--border-color);
    background: var(--background-secondary);
    font-size: 0.875rem;
    
    .char-count {
      color: var(--text-secondary);
    }
    
    .error-message {
      color: var(--danger);
    }
  }
}
</style>
