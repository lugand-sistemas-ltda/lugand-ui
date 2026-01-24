/**
 * ============================================
 * MOCK HELPERS - Funções auxiliares
 * ============================================
 * 
 * Funções utilitárias para geração de dados aleatórios
 * sem dependências externas (sem Faker).
 */

// ============================================
// RANDOM GENERATORS
// ============================================

/**
 * Retorna um item aleatório de um array
 */
export function randomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error('Array cannot be empty')
  }
  return items[Math.floor(Math.random() * items.length)]!
}

/**
 * Retorna um número aleatório entre min e max (inclusive)
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Retorna uma data aleatória entre start e end
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

/**
 * Retorna um booleano aleatório
 */
export function randomBoolean(): boolean {
  return Math.random() > 0.5
}

/**
 * Retorna uma string aleatória com comprimento específico
 */
export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Gera um UUID simples (v4 mock)
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (c) => {
    const r = Math.trunc(Math.random() * 16)
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Retorna um email aleatório baseado em um nome
 */
export function generateEmail(name: string): string {
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'empresa.com.br']
  const normalized = name.toLowerCase().replaceAll(/\s+/g, '.')
  return `${normalized}@${randomItem(domains)}`
}

/**
 * Retorna um CPF formatado (mock, não válido)
 */
export function generateCPF(): string {
  const n = () => randomNumber(0, 9)
  return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`
}

/**
 * Retorna um CEP formatado (mock)
 */
export function generateZipCode(): string {
  return `${randomNumber(10000, 99999)}-${randomNumber(100, 999)}`
}

/**
 * Retorna um telefone brasileiro formatado (mock)
 */
export function generatePhone(): string {
  return `(${randomNumber(11, 99)}) ${randomNumber(90000, 99999)}-${randomNumber(1000, 9999)}`
}
