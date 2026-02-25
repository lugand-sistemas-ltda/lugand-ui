/**
 * Adapter de QR Code usando qrcode library (OPCIONAL)
 * 
 * Este adapter requer instalação manual de qrcode:
 * npm install qrcode
 * 
 * Se qrcode não estiver instalado, o adapter lançará erro com instruções
 */

import type { QRCodeAdapter, QRCodeOptions } from '../types'

/**
 * Adapter usando qrcode library
 * 
 * @example
 * ```ts
 * // Cliente instala qrcode manualmente
 * npm install qrcode
 * 
 * // Registra adapter
 * import { registerAdapter } from '@lugand/vue-ui-lib'
 * import { QRCodeLibAdapter } from '@lugand/vue-ui-lib/adapters'
 * 
 * registerAdapter('qrcode', new QRCodeLibAdapter())
 * ```
 */
export class QRCodeLibAdapter implements QRCodeAdapter {
  name = 'qrcode'
  
  /**
   * Gerar QR Code como Data URL (imagem base64)
   */
  async generateDataURL(data: string, options?: QRCodeOptions): Promise<string> {
    const QRCode = await this.loadQRCode()
    
    return QRCode.toDataURL(data, {
      width: options?.size || 200,
      margin: options?.margin || 1,
      errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
      color: options?.color
    })
  }
  
  /**
   * Gerar QR Code como Buffer (para uso server-side ou processing)
   */
  async generateBuffer(data: string, options?: QRCodeOptions): Promise<ArrayBuffer> {
    const QRCode = await this.loadQRCode()
    
    const buffer = await QRCode.toBuffer(data, {
      width: options?.size || 200,
      margin: options?.margin || 1,
      errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
      color: options?.color
    })
    
    return buffer.buffer as ArrayBuffer
  }
  
  /**
   * Lazy load qrcode library
   */
  private async loadQRCode(): Promise<any> {
    try {
      return await import('qrcode')
    } catch (error) {
      throw new Error(
        'qrcode não está instalado.\n\n' +
        'Para usar QRCodeLibAdapter, instale:\n' +
        '  npm install qrcode\n\n' +
        'Ou registre um adapter customizado:\n' +
        '  registerAdapter("qrcode", new MyCustomQRCodeAdapter())'
      )
    }
  }
}

/**
 * Adapter nativo usando Canvas API (sem dependências externas)
 * 
 * Implementação simples usando QR Code generator nativo.
 * Limitado a casos básicos.
 */
export class NativeQRCodeAdapter implements QRCodeAdapter {
  name = 'native'
  
  async generateDataURL(data: string, options?: QRCodeOptions): Promise<string> {
    // Implementação básica usando Canvas
    const size = options?.size || 200
    const margin = options?.margin || 1
    
    // Criar canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas context not available')
    }
    
    canvas.width = size
    canvas.height = size
    
    // Background
    ctx.fillStyle = options?.color?.light || '#FFFFFF'
    ctx.fillRect(0, 0, size, size)
    
    // Gerar QR Code usando algoritmo simples
    // NOTA: Esta é uma implementação simplificada
    // Para produção, use qrcode library ou similar
    
    const qrData = this.generateQRMatrix(data, options?.errorCorrectionLevel || 'M')
    const moduleSize = (size - margin * 2) / qrData.length
    
    ctx.fillStyle = options?.color?.dark || '#000000'
    
    for (let row = 0; row < qrData.length; row++) {
      const rowData = qrData[row]
      if (!rowData) continue
      
      for (let col = 0; col < rowData.length; col++) {
        if (rowData[col]) {
          ctx.fillRect(
            margin + col * moduleSize,
            margin + row * moduleSize,
            moduleSize,
            moduleSize
          )
        }
      }
    }
    
    return canvas.toDataURL('image/png')
  }
  
  async generateBuffer(data: string, options?: QRCodeOptions): Promise<ArrayBuffer> {
    const dataURL = await this.generateDataURL(data, options)
    
    // Converter Data URL para ArrayBuffer
    const base64 = dataURL.split(',')[1]
    if (!base64) {
      throw new Error('Invalid data URL format')
    }
    
    const binary = atob(base64)
    const buffer = new ArrayBuffer(binary.length)
    const view = new Uint8Array(buffer)
    
    for (let i = 0; i < binary.length; i++) {
      view[i] = binary.charCodeAt(i)
    }
    
    return buffer
  }
  
  /**
   * Gerar matriz QR Code (implementação simplificada)
   * 
   * AVISO: Esta é uma implementação básica apenas para demonstração.
   * Para produção, use uma library completa como 'qrcode'.
   */
  private generateQRMatrix(data: string, _errorLevel: string): boolean[][] {
    // Implementação muito simplificada
    // Apenas para demonstração - NÃO USAR EM PRODUÇÃO
    
    const size = 21 // QR Code versão 1
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false))
    
    // Finder patterns (cantos)
    this.drawFinderPattern(matrix, 0, 0)
    this.drawFinderPattern(matrix, size - 7, 0)
    this.drawFinderPattern(matrix, 0, size - 7)
    
    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      const row6 = matrix[6]
      const rowI = matrix[i]
      if (row6) row6[i] = i % 2 === 0
      if (rowI) rowI[6] = i % 2 === 0
    }
    
    // Dados (simplificado)
    const dataBytes = new TextEncoder().encode(data)
    let byteIndex = 0
    let bitIndex = 7
    
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col-- // Pular timing column
      
      for (let row = 0; row < size; row++) {
        const actualRow = (col > 6 && (col + 1) % 4 === 0) ? size - 1 - row : row
        
        if (!this.isReserved(actualRow, col, size)) {
          if (byteIndex < dataBytes.length) {
            const byte = dataBytes[byteIndex]
            const matrixRow = matrix[actualRow]
            if (byte !== undefined && matrixRow) {
              matrixRow[col] = (byte & (1 << bitIndex)) !== 0
            }
            bitIndex--
            if (bitIndex < 0) {
              byteIndex++
              bitIndex = 7
            }
          }
        }
      }
    }
    
    return matrix
  }
  
  /**
   * Desenhar finder pattern (quadrados nos cantos)
   */
  private drawFinderPattern(matrix: boolean[][], row: number, col: number): void {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6
        const isInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        const matrixRow = matrix[row + r]
        if (matrixRow) {
          matrixRow[col + c] = isOuter || isInner
        }
      }
    }
  }
  
  /**
   * Verificar se posição está reservada
   */
  private isReserved(row: number, col: number, size: number): boolean {
    // Finder patterns
    if (
      (row < 9 && col < 9) ||
      (row < 9 && col >= size - 8) ||
      (row >= size - 8 && col < 9)
    ) {
      return true
    }
    
    // Timing patterns
    if (row === 6 || col === 6) {
      return true
    }
    
    return false
  }
}
