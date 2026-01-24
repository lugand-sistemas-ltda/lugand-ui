/**
 * ============================================
 * USER FACTORY - Gerador de usuários mockados
 * ============================================
 */

import type { User } from '../types'
import { generateId, randomItem, randomDate, generateEmail } from '../helpers'

// ============================================
// CONSTANTS
// ============================================
const FIRST_NAMES = [
  'João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Juliana', 'Carlos', 'Fernanda',
  'Rafael', 'Beatriz', 'Gabriel', 'Larissa', 'Felipe', 'Amanda', 'Rodrigo', 'Camila',
  'Bruno', 'Mariana', 'Thiago', 'Letícia', 'Gustavo', 'Isabela', 'Diego', 'Vitória'
]

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Rocha', 'Almeida',
  'Nascimento', 'Araújo', 'Melo', 'Barbosa', 'Cardoso', 'Cavalcanti', 'Monteiro'
]

const ROLES: User['role'][] = ['admin', 'editor', 'viewer']
const STATUSES: User['status'][] = ['active', 'inactive', 'pending']

// ============================================
// FACTORY
// ============================================

/**
 * Cria um usuário mockado
 */
export function createUser(overrides?: Partial<User>): User {
  const firstName = randomItem(FIRST_NAMES)
  const lastName = randomItem(LAST_NAMES)
  const fullName = `${firstName} ${lastName}`

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  return {
    id: generateId(),
    name: fullName,
    email: generateEmail(fullName),
    role: randomItem(ROLES),
    status: randomItem(STATUSES),
    createdAt: randomDate(thirtyDaysAgo, now),
    updatedAt: new Date(),
    ...overrides
  }
}

/**
 * Cria múltiplos usuários mockados
 */
export function createUsers(count: number, overrides?: Partial<User>): User[] {
  return Array.from({ length: count }, () => createUser(overrides))
}
