/**
 * Core Validation Module
 * 
 * Sistema de validação customizado sem dependências externas.
 * Inclui validadores genéricos e específicos brasileiros.
 * 
 * @module core/validation
 * 
 * @example
 * ```ts
 * import { validateCPF, validateCNPJ, validateCEP } from '@lugand/vue-ui-lib'
 * 
 * if (validateCPF('123.456.789-09')) {
 *   console.log('CPF válido')
 * }
 * ```
 */

// Exportar validadores do schema-builder (genéricos)
export * from '../schema-builder/validators'

// Validadores brasileiros
export * from './brazilian'
