/**
 * Composable para Document Builder
 * 
 * Estende useSchemaBuilder com funcionalidades específicas de documentos
 */

import { computed } from 'vue'
import { useSchemaBuilder } from '@/core/schema-builder'
import { getAdapter } from '@/core/adapters'
import type { PDFContent, PDFPage, PDFElement, PDFAdapter } from '@/core/adapters'
import type {
  DocumentSchema,
  DocumentBlock,
  DocumentVariable,
  DocumentLayout,
  DocumentData,
  DocumentMetadata
} from '../core/types'
import { validateDocumentSchema, validateDocumentData } from '../core/validators'
import { generateId, generateTimestamp } from '@/core/schema-builder'

/**
 * Opções do useDocBuilder
 */
export interface UseDocBuilderOptions {
  initialSchema?: DocumentSchema
  storageKey?: string
  enableHistory?: boolean
  historySize?: number
  autoSaveDelay?: number
}

/**
 * Composable principal do Document Builder
 * 
 * @param options - Opções de configuração
 * @returns API completa do document builder
 * 
 * @example
 * ```ts
 * const builder = useDocBuilder({
 *   storageKey: 'my-documents',
 *   enableHistory: true
 * })
 * 
 * builder.addBlock('text', { text: 'Olá Mundo' })
 * builder.addVariable({ name: 'nome', label: 'Nome', type: 'text' })
 * await builder.exportToPDF({ nome: 'João' })
 * ```
 */
export function useDocBuilder(options: UseDocBuilderOptions = {}) {
  // Usar base schema builder
  const builder = useSchemaBuilder<DocumentSchema, DocumentBlock>({
    initialSchema: options.initialSchema || createEmptyDocumentSchema(),
    storageKey: options.storageKey || 'lugand-doc-schemas',
    validator: validateDocumentSchema,
    itemFactory: createDocumentBlock,
    enableHistory: options.enableHistory !== false,
    historySize: options.historySize || 50,
    autoSaveDelay: options.autoSaveDelay || 0
  })
  
  // === ALIASES (para melhor semântica) ===
  
  const addBlock = builder.addItem
  const removeBlock = builder.removeItem
  const updateBlock = builder.updateItem
  const moveBlock = builder.moveItem
  const duplicateBlock = builder.duplicateItem
  const clearBlocks = builder.clearItems
  const createBlock = builder.createItem
  
  // === VARIABLE OPERATIONS ===
  
  /**
   * Adicionar variável ao documento
   */
  function addVariable(variable: DocumentVariable): void {
    const vars = builder.schema.value.variables as DocumentVariable[]
    if (!vars|| vars.length === 0) {
      // Usar type assertion para permitir edição interna
      (builder.schema.value as any).variables = []
    }
    
    // Verificar duplicação
    const exists = builder.schema.value.variables.some(v => v.name === variable.name)
    if (exists) {
      throw new Error(`Variável '${variable.name}' já existe`)
    }
    
    ;(builder.schema.value.variables as DocumentVariable[]).push(variable)
    builder.updateMetadata({})
  }
  
  /**
   * Remover variável do documento
   */
  function removeVariable(name: string): void {
    if (!builder.schema.value.variables) return
    
    const index = builder.schema.value.variables.findIndex(v => v.name === name)
    if (index !== -1) {
      ;(builder.schema.value.variables as DocumentVariable[]).splice(index, 1)
      builder.updateMetadata({})
    }
  }
  
  /**
   * Atualizar variável existente
   */
  function updateVariable(name: string, updates: Partial<DocumentVariable>): void {
    if (!builder.schema.value.variables) return
    
    const variable = builder.schema.value.variables.find(v => v.name === name)
    if (variable) {
      Object.assign(variable, updates)
      builder.updateMetadata({})
    }
  }
  
  /**
   * Obter variável por nome
   */
  function getVariable(name: string): DocumentVariable | undefined {
    return builder.schema.value.variables?.find(v => v.name === name) as DocumentVariable | undefined
  }
  
  /**
   * Listar todas as variáveis
   */
  const variables = computed(() => builder.schema.value.variables || [])
  
  // === LAYOUT OPERATIONS ===
  
  /**
   * Atualizar layout do documento
   */
  function updateLayout(updates: Partial<DocumentLayout>): void {
    Object.assign(builder.schema.value.layout, updates)
    builder.updateMetadata({})
  }
  
  /**
   * Atualizar margens
   */
  function updateMargins(margins: Partial<DocumentLayout['margins']>): void {
    Object.assign(builder.schema.value.layout.margins, margins)
    builder.updateMetadata({})
  }
  
  // === METADATA OPERATIONS ===
  
  /**
   * Atualizar metadados do documento
   */
  function updateDocMetadata(updates: Partial<DocumentMetadata>): void {
    builder.updateMetadata(updates)
  }
  
  // === EXPORT OPERATIONS ===
  
  /**
   * Exportar documento para PDF
   * 
   * @param data - Dados das variáveis
   * @param pdfAdapterName - Nome do adapter PDF (opcional)
   * @returns Blob do PDF
   */
  async function exportToPDF(data: DocumentData, pdfAdapterName?: string): Promise<Blob> {
    // Validar dados
    const dataValidation = validateDocumentData(builder.schema.value as any, data)
    if (!dataValidation.valid) {
      const errorMessages = dataValidation.errors.map((e: any) => e.message).join('\n')
      throw new Error(`Dados inválidos:\n${errorMessages}`)
    }
    
    // Obter adapter PDF
    const pdfAdapter = getAdapter('pdf', pdfAdapterName)
    if (!pdfAdapter) {
      throw new Error(
        'Nenhum adapter de PDF registrado.\n\n' +
        'Registre um adapter:\n' +
        '  import { registerAdapter, JSPDFAdapter } from "@lugand/vue-ui-lib"\n' +
        '  registerAdapter("pdf", new JSPDFAdapter())'
      )
    }
    
    // Converter schema para PDFContent
    const content = documentSchemaToPDFContent(builder.schema.value as any, data, pdfAdapter as any)
    
    // Gerar PDF
    return pdfAdapter.generate(content)
  }
  
  /**
   * Exportar documento para HTML
   * 
   * @param data - Dados das variáveis
   * @returns HTML string
   */
  function exportToHTML(data: DocumentData): string {
    // Validar dados
    const dataValidation = validateDocumentData(builder.schema.value as any, data)
    if (!dataValidation.valid) {
      const errorMessages = dataValidation.errors.map((e: any) => e.message).join('\n')
      throw new Error(`Dados inválidos:\n${errorMessages}`)
    }
    
    return documentSchemaToHTML(builder.schema.value as any, data)
  }
  
  // === PREVIEW ===
  
  /**
   * Gerar preview do documento com dados de exemplo
   */
  function generatePreviewData(): DocumentData {
    const data: DocumentData = {}
    
    builder.schema.value.variables?.forEach(variable => {
      switch (variable.type) {
        case 'text':
          data[variable.name] = variable.defaultValue || 'Texto de exemplo'
          break
        case 'number':
          data[variable.name] = variable.defaultValue || 123
          break
        case 'date':
          data[variable.name] = variable.defaultValue || new Date().toISOString().split('T')[0]
          break
        case 'currency':
          data[variable.name] = variable.defaultValue || '1.234,56'
          break
        case 'boolean':
          data[variable.name] = variable.defaultValue !== undefined ? variable.defaultValue : true
          break
        case 'array':
          data[variable.name] = variable.defaultValue || []
          break
        case 'object':
          data[variable.name] = variable.defaultValue || {}
          break
        default:
          data[variable.name] = variable.defaultValue || ''
      }
    })
    
    return data
  }
  
  // === RETURN API ===
  
  return {
    // State herdado
    schema: builder.schema,
    selectedItem: builder.selectedItem,
    isDirty: builder.isDirty,
    isValid: builder.isValid,
    validation: builder.validation,
    
    // Block operations (alias semântico)
    addBlock,
    removeBlock,
    updateBlock,
    moveBlock,
    duplicateBlock,
    clearBlocks,
    createBlock,
    
    // Variable operations
    addVariable,
    removeVariable,
    updateVariable,
    getVariable,
    variables,
    
    // Layout operations
    updateLayout,
    updateMargins,
    
    // Metadata operations
    updateDocMetadata,
    
    // Schema operations herdadas
    updateMetadata: builder.updateMetadata,
    resetSchema: builder.resetSchema,
    
    // Selection herdada
    selectItem: builder.selectItem,
    getSelectedItem: builder.getSelectedItem,
    
    // Persistence herdada
    save: builder.save,
    load: builder.load,
    delete: builder.delete,
    list: builder.list,
    exportJSON: builder.exportJSON,
    importJSON: builder.importJSON,
    
    // Export specific
    exportToPDF,
    exportToHTML,
    generatePreviewData,
    
    // History herdada
    undo: builder.undo,
    redo: builder.redo,
    canUndo: builder.canUndo,
    canRedo: builder.canRedo,
    
    // Utilities herdadas
    generateId: builder.generateId,
    generateTimestamp: builder.generateTimestamp
  }
}

/**
 * ==========================================
 * HELPER FUNCTIONS
 * ==========================================
 */

/**
 * Criar schema de documento vazio
 */
function createEmptyDocumentSchema(): DocumentSchema {
  return {
    id: generateId(),
    name: 'Novo Documento',
    version: '1.0.0',
    metadata: {
      title: 'Documento sem título'
    },
    layout: {
      pageSize: 'a4',
      orientation: 'portrait',
      margins: { top: 20, right: 20, bottom: 20, left: 20 }
    },
    items: [],
    variables: [],
    createdAt: generateTimestamp(),
    updatedAt: generateTimestamp()
  }
}

/**
 * Criar bloco de documento
 */
function createDocumentBlock(type: string): DocumentBlock {
  const block: DocumentBlock = {
    id: generateId(),
    type: type as any,
    label: `Bloco ${type}`,
    props: {},
    content: {}
  }
  
  // Conteúdo padrão baseado no tipo
  switch (type) {
    case 'text':
      block.content = { text: 'Digite seu texto aqui', format: 'plain' }
      break
    case 'heading':
      block.content = { text: 'Título', level: 1 }
      break
    case 'variable':
      block.content = { variableName: '', fallback: '' }
      break
    case 'qrcode':
      block.content = { data: '', size: 100 }
      break
    case 'signature':
      block.content = { label: 'Assinatura', showDate: true, width: 200, height: 100 }
      break
    case 'image':
      block.content = { src: '', width: 200, height: 200 }
      break
    case 'table':
      block.content = { headers: [], rows: [] }
      break
    case 'spacer':
      block.content = { height: 10 }
      break
    case 'line':
      block.content = { color: '#000000', width: 1, style: 'solid' }
      break
    case 'group':
      block.content = { blocks: [] }
      break
    case 'repeater':
      block.content = { dataSource: '', itemVariable: 'item', template: [] }
      break
  }
  
  return block
}

/**
 * Converter DocumentSchema para PDFContent
 */
function documentSchemaToPDFContent(
  schema: DocumentSchema,
  data: DocumentData,
  _pdfAdapter: PDFAdapter
): PDFContent {
  // Implementação básica - será expandida nas próximas etapas
  const content: PDFContent = {
    metadata: {
      title: schema.metadata.title,
      author: schema.metadata.author,
      subject: schema.metadata.subject,
      keywords: schema.metadata.keywords,
      creator: 'Lugand UI Lib - Doc Builder'
    },
    pages: []
  }
  
  // Criar página inicial
  const page: PDFPage = {
    size: schema.layout.pageSize,
    orientation: schema.layout.orientation,
    margins: schema.layout.margins,
    elements: []
  }
  
  // Converter blocos para elementos PDF
  let yPosition = 0
  for (const block of schema.items) {
    const elements = blockToPDFElements(block, data, yPosition, schema.layout.margins)
    page.elements.push(...elements)
    yPosition += 20 // Espaçamento básico
  }
  
  content.pages.push(page)
  
  return content
}

/**
 * Converter bloco para elementos PDF
 */
function blockToPDFElements(
  block: DocumentBlock,
  data: DocumentData,
  yPos: number,
  _margins: DocumentLayout['margins']
): PDFElement[] {
  const elements: PDFElement[] = []
  
  // Implementação simplificada - será expandida
  switch (block.type) {
    case 'text':
      if (block.content.text) {
        elements.push({
          type: 'text',
          x: 0,
          y: yPos,
          text: replaceVariables(block.content.text, data),
          style: {
            fontSize: block.style?.fontSize || 12,
            fontWeight: block.style?.fontWeight || 'normal',
            fontStyle: block.style?.fontStyle || 'normal',
            color: block.style?.color || '#000000',
            align: block.style?.align || 'left'
          }
        })
      }
      break
    
    // Outros tipos serão implementados
  }
  
  return elements
}

/**
 * Substituir variáveis no texto ({{var}})
 */
function replaceVariables(text: string, data: DocumentData): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    return data[varName] !== undefined ? String(data[varName]) : match
  })
}

/**
 * Converter DocumentSchema para HTML
 */
function documentSchemaToHTML(schema: DocumentSchema, data: DocumentData): string {
  let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${schema.metadata.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: ${schema.layout.margins.top}mm ${schema.layout.margins.right}mm ${schema.layout.margins.bottom}mm ${schema.layout.margins.left}mm;
    }
  </style>
</head>
<body>
`
  
  // Renderizar blocos
  for (const block of schema.items) {
    html += blockToHTML(block, data)
  }
  
  html += `
</body>
</html>`
  
  return html
}

/**
 * Converter bloco para HTML
 */
function blockToHTML(block: DocumentBlock, data: DocumentData): string {
  switch (block.type) {
    case 'text':
      return `<p>${replaceVariables(block.content.text || '', data)}</p>\n`
    
    case 'heading':
      const level = block.content.level || 1
      return `<h${level}>${replaceVariables(block.content.text || '', data)}</h${level}>\n`
    
    case 'spacer':
      return `<div style="height: ${block.content.height || 10}mm"></div>\n`
    
    // Outros tipos serão implementados
    default:
      return ''
  }
}
