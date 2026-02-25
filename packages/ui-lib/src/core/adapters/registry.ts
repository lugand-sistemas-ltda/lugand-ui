/**
 * Registro global de adaptadores
 * 
 * Sistema centralizado para registrar e obter adapters plugáveis
 */

import type {
  PDFAdapter,
  QRCodeAdapter,
  StorageAdapter,
  SignatureAdapter
} from './types'

/**
 * Tipos de adapters suportados
 */
export type AdapterType = 'pdf' | 'qrcode' | 'storage' | 'signature'

/**
 * Classe singleton para gerenciar adapters
 */
class AdapterRegistry {
  private pdfAdapters = new Map<string, PDFAdapter>()
  private qrAdapters = new Map<string, QRCodeAdapter>()
  private storageAdapters = new Map<string, StorageAdapter>()
  private signatureAdapters = new Map<string, SignatureAdapter>()
  
  // ==========================================
  // PDF ADAPTERS
  // ==========================================
  
  /**
   * Registrar adapter de PDF
   */
  registerPDF(adapter: PDFAdapter): void {
    this.pdfAdapters.set(adapter.name, adapter)
  }
  
  /**
   * Obter adapter de PDF
   * 
   * @param name - Nome do adapter (opcional, retorna o primeiro se omitido)
   */
  getPDF(name?: string): PDFAdapter | undefined {
    if (name) {
      return this.pdfAdapters.get(name)
    }
    // Retornar o primeiro registrado
    return this.pdfAdapters.values().next().value
  }
  
  /**
   * Listar adapters de PDF registrados
   */
  listPDF(): string[] {
    return Array.from(this.pdfAdapters.keys())
  }
  
  /**
   * Remover adapter de PDF
   */
  unregisterPDF(name: string): boolean {
    return this.pdfAdapters.delete(name)
  }
  
  // ==========================================
  // QR CODE ADAPTERS
  // ==========================================
  
  /**
   * Registrar adapter de QR Code
   */
  registerQRCode(adapter: QRCodeAdapter): void {
    this.qrAdapters.set(adapter.name, adapter)
  }
  
  /**
   * Obter adapter de QR Code
   */
  getQRCode(name?: string): QRCodeAdapter | undefined {
    if (name) {
      return this.qrAdapters.get(name)
    }
    return this.qrAdapters.values().next().value
  }
  
  /**
   * Listar adapters de QR Code registrados
   */
  listQRCode(): string[] {
    return Array.from(this.qrAdapters.keys())
  }
  
  /**
   * Remover adapter de QR Code
   */
  unregisterQRCode(name: string): boolean {
    return this.qrAdapters.delete(name)
  }
  
  // ==========================================
  // STORAGE ADAPTERS
  // ==========================================
  
  /**
   * Registrar adapter de Storage
   */
  registerStorage(adapter: StorageAdapter): void {
    this.storageAdapters.set(adapter.name, adapter)
  }
  
  /**
   * Obter adapter de Storage
   */
  getStorage(name?: string): StorageAdapter | undefined {
    if (name) {
      return this.storageAdapters.get(name)
    }
    return this.storageAdapters.values().next().value
  }
  
  /**
   * Listar adapters de Storage registrados
   */
  listStorage(): string[] {
    return Array.from(this.storageAdapters.keys())
  }
  
  /**
   * Remover adapter de Storage
   */
  unregisterStorage(name: string): boolean {
    return this.storageAdapters.delete(name)
  }
  
  // ==========================================
  // SIGNATURE ADAPTERS
  // ==========================================
  
  /**
   * Registrar adapter de Assinatura
   */
  registerSignature(adapter: SignatureAdapter): void {
    this.signatureAdapters.set(adapter.name, adapter)
  }
  
  /**
   * Obter adapter de Assinatura
   */
  getSignature(name?: string): SignatureAdapter | undefined {
    if (name) {
      return this.signatureAdapters.get(name)
    }
    return this.signatureAdapters.values().next().value
  }
  
  /**
   * Listar adapters de Assinatura registrados
   */
  listSignature(): string[] {
    return Array.from(this.signatureAdapters.keys())
  }
  
  /**
   * Remover adapter de Assinatura
   */
  unregisterSignature(name: string): boolean {
    return this.signatureAdapters.delete(name)
  }
  
  // ==========================================
  // UTILITIES
  // ==========================================
  
  /**
   * Limpar todos os adapters
   */
  clearAll(): void {
    this.pdfAdapters.clear()
    this.qrAdapters.clear()
    this.storageAdapters.clear()
    this.signatureAdapters.clear()
  }
  
  /**
   * Obter estatísticas de adapters registrados
   */
  getStats(): Record<AdapterType, number> {
    return {
      pdf: this.pdfAdapters.size,
      qrcode: this.qrAdapters.size,
      storage: this.storageAdapters.size,
      signature: this.signatureAdapters.size
    }
  }
}

/**
 * Instância singleton do registry
 */
export const adapterRegistry = new AdapterRegistry()

/**
 * ==========================================
 * HELPER FUNCTIONS
 * ==========================================
 */

/**
 * Registrar adapter de qualquer tipo
 * 
 * @param type - Tipo do adapter
 * @param adapter - Instância do adapter
 * 
 * @example
 * ```ts
 * registerAdapter('pdf', new MyPDFAdapter())
 * registerAdapter('storage', new MyStorageAdapter())
 * ```
 */
export function registerAdapter(
  type: 'pdf',
  adapter: PDFAdapter
): void
export function registerAdapter(
  type: 'qrcode',
  adapter: QRCodeAdapter
): void
export function registerAdapter(
  type: 'storage',
  adapter: StorageAdapter
): void
export function registerAdapter(
  type: 'signature',
  adapter: SignatureAdapter
): void
export function registerAdapter(type: AdapterType, adapter: any): void {
  switch (type) {
    case 'pdf':
      adapterRegistry.registerPDF(adapter)
      break
    case 'qrcode':
      adapterRegistry.registerQRCode(adapter)
      break
    case 'storage':
      adapterRegistry.registerStorage(adapter)
      break
    case 'signature':
      adapterRegistry.registerSignature(adapter)
      break
    default:
      throw new Error(`Tipo de adapter desconhecido: ${type}`)
  }
}

/**
 * Obter adapter de qualquer tipo
 * 
 * @param type - Tipo do adapter
 * @param name - Nome do adapter (opcional)
 * @returns Adapter ou undefined
 * 
 * @example
 * ```ts
 * const pdfAdapter = getAdapter('pdf')
 * const customStorage = getAdapter('storage', 'custom')
 * ```
 */
export function getAdapter(type: 'pdf', name?: string): PDFAdapter | undefined
export function getAdapter(type: 'qrcode', name?: string): QRCodeAdapter | undefined
export function getAdapter(type: 'storage', name?: string): StorageAdapter | undefined
export function getAdapter(type: 'signature', name?: string): SignatureAdapter | undefined
export function getAdapter(type: AdapterType, name?: string): any {
  switch (type) {
    case 'pdf':
      return adapterRegistry.getPDF(name)
    case 'qrcode':
      return adapterRegistry.getQRCode(name)
    case 'storage':
      return adapterRegistry.getStorage(name)
    case 'signature':
      return adapterRegistry.getSignature(name)
    default:
      return undefined
  }
}

/**
 * Verificar se adapter está registrado
 * 
 * @param type - Tipo do adapter
 * @param name - Nome do adapter (opcional)
 */
export function hasAdapter(type: AdapterType, name?: string): boolean {
  const adapter = getAdapter(type as any, name)
  return adapter !== undefined
}

/**
 * Listar adapters de um tipo
 * 
 * @param type - Tipo do adapter
 */
export function listAdapters(type: AdapterType): string[] {
  switch (type) {
    case 'pdf':
      return adapterRegistry.listPDF()
    case 'qrcode':
      return adapterRegistry.listQRCode()
    case 'storage':
      return adapterRegistry.listStorage()
    case 'signature':
      return adapterRegistry.listSignature()
    default:
      return []
  }
}

/**
 * Remover adapter
 * 
 * @param type - Tipo do adapter
 * @param name - Nome do adapter
 */
export function unregisterAdapter(type: AdapterType, name: string): boolean {
  switch (type) {
    case 'pdf':
      return adapterRegistry.unregisterPDF(name)
    case 'qrcode':
      return adapterRegistry.unregisterQRCode(name)
    case 'storage':
      return adapterRegistry.unregisterStorage(name)
    case 'signature':
      return adapterRegistry.unregisterSignature(name)
    default:
      return false
  }
}
