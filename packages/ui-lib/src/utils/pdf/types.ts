/**
 * Types for PDF generation
 */

export type PageSize = 'a4' | 'letter' | 'legal'
export type PageOrientation = 'portrait' | 'landscape'

export interface PDFMargins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface PDFOptions {
  /** Nome do arquivo PDF */
  filename?: string
  
  /** Tamanho da página */
  pageSize?: PageSize
  
  /** Orientação da página */
  orientation?: PageOrientation
  
  /** Margens em mm */
  margins?: PDFMargins
  
  /** Metadata do documento */
  metadata?: PDFMetadata
  
  /** Abrir preview após gerar */
  preview?: boolean
}

export interface PDFMetadata {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
}

export interface DocumentBlock {
  id: string
  type: 'text' | 'heading' | 'variable' | 'qrcode' | 'signature' | 'image' | 'table' | 'spacer'
  content: any
  style?: DocumentBlockStyle
  position?: { x?: number; y?: number }
}

export interface DocumentBlockStyle {
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  align?: 'left' | 'center' | 'right' | 'justify'
  color?: string
  lineHeight?: number
  marginTop?: number
  marginBottom?: number
}

export interface DocumentTemplate {
  id: string
  name: string
  version: string
  layout: {
    pageSize: PageSize
    orientation: PageOrientation
    margins: PDFMargins
  }
  blocks: DocumentBlock[]
  variables: TemplateVariable[]
  metadata?: PDFMetadata
}

export interface TemplateVariable {
  name: string
  label?: string
  type: 'text' | 'number' | 'date' | 'currency' | 'array'
  required: boolean
  defaultValue?: any
  format?: string
}

export interface DocumentData {
  [key: string]: any
}

export interface PDFGenerationResult {
  success: boolean
  filename: string
  size?: number
  blob?: Blob
  error?: string
}
