/**
 * Core Adapters Module
 * 
 * Sistema plugável de adaptadores para funcionalidades customizáveis.
 * Permite que clientes substituam implementações padrão sem modificar a lib.
 * 
 * @module core/adapters
 * 
 * @example
 * ```ts
 * // Usar adapters padrão
 * import { registerAdapter, JSPDFAdapter, QRCodeLibAdapter } from '@lugand/vue-ui-lib'
 * 
 * registerAdapter('pdf', new JSPDFAdapter())
 * registerAdapter('qrcode', new QRCodeLibAdapter())
 * 
 * // Ou criar adapter customizado
 * class MyPDFAdapter implements PDFAdapter {
 *   // ... implementação
 * }
 * 
 * registerAdapter('pdf', new MyPDFAdapter())
 * ```
 */

// Types
export * from './types'

// Registry
export * from './registry'

// Default adapters
export * from './defaults/storage.adapter'
export * from './defaults/pdf.adapter'
export * from './defaults/qr.adapter'
