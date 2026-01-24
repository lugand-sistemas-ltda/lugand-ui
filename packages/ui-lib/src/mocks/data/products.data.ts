/**
 * ============================================
 * PRODUCTS DATA - Datasets estáticos de produtos
 * ============================================
 */

import { createProducts } from '../factories'
import type { Product } from '../types'

// ============================================
// STATIC DATASETS
// ============================================

/**
 * Dataset pequeno (8 produtos) para cards/grids
 */
export const PRODUCTS_SMALL: Product[] = createProducts(8)

/**
 * Dataset médio (24 produtos) para catálogos
 */
export const PRODUCTS_MEDIUM: Product[] = createProducts(24)

/**
 * Dataset grande (60 produtos) para paginação
 */
export const PRODUCTS_LARGE: Product[] = createProducts(60)

/**
 * Dataset padrão (usado nos exemplos)
 */
export const PRODUCTS_DEFAULT = PRODUCTS_MEDIUM
