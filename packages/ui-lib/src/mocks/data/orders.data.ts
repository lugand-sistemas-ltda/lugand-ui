/**
 * ============================================
 * ORDERS DATA - Datasets estáticos de pedidos
 * ============================================
 */

import { createOrders } from '../factories'
import type { Order } from '../types'

// ============================================
// STATIC DATASETS
// ============================================

/**
 * Dataset pequeno (5 pedidos) para dashboards
 */
export const ORDERS_SMALL: Order[] = createOrders(5)

/**
 * Dataset médio (15 pedidos) para tabelas
 */
export const ORDERS_MEDIUM: Order[] = createOrders(15)

/**
 * Dataset grande (40 pedidos) para relatórios
 */
export const ORDERS_LARGE: Order[] = createOrders(40)

/**
 * Dataset padrão (usado nos exemplos)
 */
export const ORDERS_DEFAULT = ORDERS_MEDIUM
