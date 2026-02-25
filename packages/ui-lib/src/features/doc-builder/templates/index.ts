/**
 * Templates de Documentos
 * 
 * Exporta todos os templates pré-configurados disponíveis
 */

export * from './types'
export { contractTemplate } from './contract'
export { invoiceTemplate } from './invoice'
export { reportTemplate } from './report'
export { certificateTemplate } from './certificate'

import { contractTemplate } from './contract'
import { invoiceTemplate } from './invoice'
import { reportTemplate } from './report'
import { certificateTemplate } from './certificate'
import type { DocumentTemplate, TemplateRegistry } from './types'

/**
 * Registro de todos os templates disponíveis
 */
export const templateRegistry: TemplateRegistry = {
  [contractTemplate.id]: contractTemplate,
  [invoiceTemplate.id]: invoiceTemplate,
  [reportTemplate.id]: reportTemplate,
  [certificateTemplate.id]: certificateTemplate
}

/**
 * Lista de templates (array)
 */
export const templates: DocumentTemplate[] = [
  contractTemplate,
  invoiceTemplate,
  reportTemplate,
  certificateTemplate
]

/**
 * Obter template por ID
 */
export function getTemplateById(id: string): DocumentTemplate | undefined {
  return templateRegistry[id]
}

/**
 * Obter templates por categoria
 */
export function getTemplatesByCategory(category: string): DocumentTemplate[] {
  return templates.filter(t => t.category === category)
}

/**
 * Buscar templates por tag
 */
export function searchTemplatesByTag(tag: string): DocumentTemplate[] {
  return templates.filter(t => t.tags.includes(tag))
}

/**
 * Buscar templates por texto
 */
export function searchTemplates(query: string): DocumentTemplate[] {
  const lowerQuery = query.toLowerCase()
  return templates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}
