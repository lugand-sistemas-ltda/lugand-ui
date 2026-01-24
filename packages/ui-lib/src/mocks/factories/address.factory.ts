/**
 * ============================================
 * ADDRESS FACTORY - Gerador de endereços mockados
 * ============================================
 */

import type { Address } from '../types'
import { randomItem, randomNumber, generateZipCode } from '../helpers'

// ============================================
// CONSTANTS
// ============================================
const STREETS = [
  'Rua das Flores', 'Avenida Paulista', 'Rua Augusta', 'Alameda Santos',
  'Rua Oscar Freire', 'Rua Consolação', 'Avenida Brigadeiro', 'Rua Haddock Lobo',
  'Rua Bela Cintra', 'Rua Estados Unidos', 'Avenida Angélica', 'Rua Pamplona'
]

const NEIGHBORHOODS = [
  'Centro', 'Jardins', 'Vila Mariana', 'Pinheiros', 'Moema',
  'Ipanema', 'Copacabana', 'Leblon', 'Botafogo', 'Tijuca',
  'Savassi', 'Lourdes', 'Funcionários', 'Santo Agostinho'
]

const CITIES = [
  { name: 'São Paulo', state: 'SP' },
  { name: 'Rio de Janeiro', state: 'RJ' },
  { name: 'Belo Horizonte', state: 'MG' },
  { name: 'Curitiba', state: 'PR' },
  { name: 'Porto Alegre', state: 'RS' },
  { name: 'Brasília', state: 'DF' },
  { name: 'Salvador', state: 'BA' },
  { name: 'Fortaleza', state: 'CE' }
]

// ============================================
// FACTORY
// ============================================

/**
 * Cria um endereço mockado
 */
export function createAddress(overrides?: Partial<Address>): Address {
  const city = randomItem(CITIES)

  return {
    street: randomItem(STREETS),
    number: String(randomNumber(1, 9999)),
    complement: Math.random() > 0.6 ? `Apto ${randomNumber(1, 200)}` : undefined,
    neighborhood: randomItem(NEIGHBORHOODS),
    city: city.name,
    state: city.state,
    zipCode: generateZipCode(),
    country: 'Brasil',
    ...overrides
  }
}

/**
 * Cria múltiplos endereços mockados
 */
export function createAddresses(count: number, overrides?: Partial<Address>): Address[] {
  return Array.from({ length: count }, () => createAddress(overrides))
}
