/**
 * PDF Generation Utils (Optional)
 * 
 * Este módulo contém utilitários para geração de PDF.
 * Para usar, você precisa instalar as dependências:
 * 
 * ```bash
 * npm install jspdf qrcode
 * npm install --save-dev @types/qrcode
 * ```
 * 
 * Uso:
 * ```typescript
 * import { generatePDFFromHTML } from '@lugand-sistemas-ltda/vue-ui-lib/pdf'
 * 
 * await generatePDFFromHTML('<h1>Hello PDF</h1>', {}, {
 *   filename: 'document.pdf'
 * })
 * ```
 */

export {
  generatePDFFromHTML,
  generatePDFFromTemplate,
  exportPDFAsBlob,
  exportPDFAsBase64
} from './src/utils/pdf'

export type {
  PageSize,
  PageOrientation,
  PDFMargins,
  PDFOptions,
  PDFMetadata,
  DocumentBlock,
  DocumentBlockStyle,
  DocumentTemplate,
  TemplateVariable,
  DocumentData,
  PDFGenerationResult
} from './src/utils/pdf'
