/**
 * ============================================
 * USERS DATA - Datasets estáticos de usuários
 * ============================================
 */

import { createUsers } from '../factories'
import type { User } from '../types'

// ============================================
// STATIC DATASETS
// ============================================

/**
 * Dataset pequeno (5 usuários) para testes rápidos
 */
export const USERS_SMALL: User[] = createUsers(5)

/**
 * Dataset médio (20 usuários) para tabelas
 */
export const USERS_MEDIUM: User[] = createUsers(20)

/**
 * Dataset grande (50 usuários) para paginação
 */
export const USERS_LARGE: User[] = createUsers(50)

/**
 * Dataset extra grande (100 usuários) para testes de paginação avançada
 */
export const USERS_EXTRA_LARGE: User[] = createUsers(100)

/**
 * Dataset padrão (usado nos exemplos)
 */
export const USERS_DEFAULT = USERS_EXTRA_LARGE
