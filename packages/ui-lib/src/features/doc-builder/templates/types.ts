/**
 * Tipos para templates de documentos
 */

import type { DocumentSchema } from '../core/types'

/**
 * Template de documento pré-configurado
 */
export interface DocumentTemplate {
  /** ID único do template */
  id: string
  
  /** Nome do template */
  name: string
  
  /** Descrição */
  description: string
  
  /** Categoria */
  category: TemplateCategory
  
  /** Tags para busca */
  tags: string[]
  
  /** Schema do documento */
  schema: DocumentSchema
  
  /** Preview (base64 ou URL) */
  preview?: string
}

/**
 * Categorias de templates
 */
export type TemplateCategory = 
  | 'contract'      // Contratos
  | 'invoice'       // Notas fiscais
  | 'report'        // Relatórios
  | 'certificate'   // Certificados
  | 'letter'        // Cartas/Ofícios
  | 'custom'        // Customizados

/**
 * Registro de templates disponíveis
 */
export interface TemplateRegistry {
  [key: string]: DocumentTemplate
}
