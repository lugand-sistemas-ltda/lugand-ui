/**
 * Document Builder Feature
 * 
 * Sistema completo para criação e geração de documentos dinâmicos.
 * Suporta exportação para PDF e HTML com variáveis e templates.
 * 
 * @module features/doc-builder
 * 
 * @example
 * ```ts
 * import { useDocBuilder, registerAdapter, JSPDFAdapter } from '@lugand/vue-ui-lib'
 * 
 * // Registrar adapter PDF
 * registerAdapter('pdf', new JSPDFAdapter())
 * 
 * // Criar documento
 * const builder = useDocBuilder()
 * 
 * // Adicionar variável
 * builder.addVariable({
 *   name: 'nomeCliente',
 *   label: 'Nome do Cliente',
 *   type: 'text',
 *   required: true
 * })
 * 
 * // Adicionar bloco de texto
 * builder.addBlock('text', {
 *   text: 'Olá {{nomeCliente}}, seja bem-vindo!'
 * })
 * 
 * // Exportar para PDF
 * const pdfBlob = await builder.exportToPDF({
 *   nomeCliente: 'João Silva'
 * })
 * ```
 */

// Core (tipos e validadores)
export * from './core'

// Composables
export * from './composables'

// Blocks
export * from './blocks'

// Components
export * from './components'

// Templates
export * from './templates'
