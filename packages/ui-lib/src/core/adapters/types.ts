/**
 * Interfaces de adaptadores plugáveis
 * 
 * Define contratos para implementações customizáveis (PDF, QRCode, Storage, etc.)
 * Permite que o cliente substitua implementações padrão sem modificar a lib.
 */

/**
 * ========================================
 * PDF ADAPTER
 * ========================================
 */

/**
 * Adapter para geração de PDF
 * 
 * Permite implementações customizadas (jsPDF, PDFMake, API backend, etc.)
 */
export interface PDFAdapter {
  /** Nome identificador do adapter */
  name: string
  
  /** Gerar PDF a partir de conteúdo estruturado */
  generate(content: PDFContent, options?: PDFOptions): Promise<Blob>
  
  /** Capacidades do adapter */
  capabilities: PDFCapabilities
}

/**
 * Capacidades de um adapter PDF
 */
export interface PDFCapabilities {
  supportsImages: boolean
  supportsVectorGraphics: boolean
  supportsDigitalSignature: boolean
  supportsEncryption: boolean
}

/**
 * Conteúdo estruturado para PDF (agnóstico de implementação)
 */
export interface PDFContent {
  /** Metadados do documento */
  metadata: PDFMetadata
  
  /** Páginas do documento */
  pages: PDFPage[]
}

/**
 * Metadados do PDF
 */
export interface PDFMetadata {
  title?: string
  author?: string
  subject?: string
  keywords?: string[]
  creator?: string
  creationDate?: Date
}

/**
 * Página do PDF
 */
export interface PDFPage {
  /** Tamanho da página */
  size: 'a4' | 'letter' | 'legal' | 'a3' | 'a5'
  
  /** Orientação */
  orientation: 'portrait' | 'landscape'
  
  /** Margens (em mm) */
  margins: { top: number; right: number; bottom: number; left: number }
  
  /** Elementos da página */
  elements: PDFElement[]
}

/**
 * Elemento de página PDF
 */
export type PDFElement = 
  | PDFTextElement
  | PDFImageElement
  | PDFQRCodeElement
  | PDFLineElement
  | PDFRectElement
  | PDFPathElement

/**
 * Elemento de texto
 */
export interface PDFTextElement {
  type: 'text'
  x: number
  y: number
  text: string
  style: {
    fontSize?: number
    fontWeight?: 'normal' | 'bold'
    fontStyle?: 'normal' | 'italic'
    fontFamily?: string
    color?: string
    align?: 'left' | 'center' | 'right' | 'justify'
    lineHeight?: number
  }
}

/**
 * Elemento de imagem
 */
export interface PDFImageElement {
  type: 'image'
  x: number
  y: number
  width: number
  height: number
  data: string // base64 ou URL
  format: 'png' | 'jpg' | 'jpeg' | 'svg'
  opacity?: number
}

/**
 * Elemento QR Code
 */
export interface PDFQRCodeElement {
  type: 'qrcode'
  x: number
  y: number
  size: number
  data: string
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

/**
 * Elemento de linha
 */
export interface PDFLineElement {
  type: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  width?: number
  dashPattern?: number[]
}

/**
 * Elemento de retângulo
 */
export interface PDFRectElement {
  type: 'rect'
  x: number
  y: number
  width: number
  height: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  cornerRadius?: number
}

/**
 * Elemento de path (formas customizadas)
 */
export interface PDFPathElement {
  type: 'path'
  path: string // SVG path string
  x: number
  y: number
  fill?: string
  stroke?: string
  strokeWidth?: number
}

/**
 * Opções de geração de PDF
 */
export interface PDFOptions {
  /** Compressão */
  compress?: boolean
  
  /** Senha de proteção */
  password?: string
  
  /** Permissões */
  permissions?: PDFPermissions
  
  /** Adicionar marcas d'água */
  watermark?: PDFWatermark
}

/**
 * Permissões do PDF
 */
export interface PDFPermissions {
  printing?: 'none' | 'lowResolution' | 'highResolution'
  modifying?: boolean
  copying?: boolean
  annotating?: boolean
  fillingForms?: boolean
  contentAccessibility?: boolean
  documentAssembly?: boolean
}

/**
 * Marca d'água
 */
export interface PDFWatermark {
  text: string
  opacity?: number
  angle?: number
  fontSize?: number
  color?: string
}

/**
 * ========================================
 * QR CODE ADAPTER
 * ========================================
 */

/**
 * Adapter para geração de QR Code
 */
export interface QRCodeAdapter {
  /** Nome identificador do adapter */
  name: string
  
  /** Gerar QR Code como Data URL */
  generateDataURL(data: string, options?: QRCodeOptions): Promise<string>
  
  /** Gerar QR Code como Buffer */
  generateBuffer(data: string, options?: QRCodeOptions): Promise<ArrayBuffer>
}

/**
 * Opções de geração de QR Code
 */
export interface QRCodeOptions {
  /** Tamanho em pixels */
  size?: number
  
  /** Margem em pixels */
  margin?: number
  
  /** Nível de correção de erros */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  
  /** Cores */
  color?: {
    dark?: string
    light?: string
  }
}

/**
 * ========================================
 * STORAGE ADAPTER
 * ========================================
 */

/**
 * Adapter para persistência de dados
 * 
 * Permite implementações customizadas (localStorage, IndexedDB, API backend, etc.)
 */
export interface StorageAdapter<T = any> {
  /** Nome identificador do adapter */
  name: string
  
  /** Salvar item */
  save(key: string, value: T): Promise<void>
  
  /** Carregar item */
  load(key: string): Promise<T | null>
  
  /** Deletar item */
  delete(key: string): Promise<void>
  
  /** Listar keys (com filtro opcional) */
  list(prefix?: string): Promise<string[]>
  
  /** Limpar tudo */
  clear(): Promise<void>
  
  /** Verificar se key existe */
  exists?(key: string): Promise<boolean>
  
  /** Obter tamanho usado */
  getSize?(): Promise<number>
}

/**
 * ========================================
 * SIGNATURE ADAPTER (Futuro)
 * ========================================
 */

/**
 * Adapter para assinatura digital
 * 
 * Para integração com ICP-Brasil, certificados A1/A3, etc.
 */
export interface SignatureAdapter {
  /** Nome identificador do adapter */
  name: string
  
  /** Assinar PDF */
  signPDF(pdfBlob: Blob, certificate: SignatureCertificate): Promise<Blob>
  
  /** Verificar assinatura */
  verifySignature(pdfBlob: Blob): Promise<SignatureVerificationResult>
  
  /** Listar certificados disponíveis */
  listCertificates?(): Promise<SignatureCertificate[]>
}

/**
 * Certificado para assinatura
 */
export interface SignatureCertificate {
  /** Tipo de certificado */
  type: 'pkcs12' | 'x509' | 'a1' | 'a3'
  
  /** Dados do certificado */
  data: ArrayBuffer
  
  /** Senha (se necessário) */
  password?: string
  
  /** Informações do proprietário */
  subject?: {
    commonName?: string
    organization?: string
    country?: string
  }
  
  /** Validade */
  validity?: {
    notBefore: Date
    notAfter: Date
  }
}

/**
 * Resultado de verificação de assinatura
 */
export interface SignatureVerificationResult {
  /** Assinatura é válida? */
  valid: boolean
  
  /** Assinante */
  signer?: string
  
  /** Data da assinatura */
  signedAt?: Date
  
  /** Certificado usado */
  certificate?: SignatureCertificate
  
  /** Erros (se inválida) */
  errors?: string[]
  
  /** Avisos */
  warnings?: string[]
}
