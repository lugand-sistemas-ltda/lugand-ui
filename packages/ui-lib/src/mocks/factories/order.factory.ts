/**
 * ============================================
 * ORDER FACTORY - Gerador de pedidos mockados
 * ============================================
 */

import type { Order, OrderItem } from '../types'
import { generateId, randomItem, randomNumber, randomDate } from '../helpers'
import { createAddress } from './address.factory'

// ============================================
// CONSTANTS
// ============================================
const PRODUCT_NAMES = [
  'Smartphone Galaxy', 'Notebook Pro', 'Tablet Air', 'Smartwatch Ultra',
  'Camiseta Básica', 'Calça Jeans', 'Tênis Esportivo', 'Moletom',
  'Café Premium', 'Chocolate', 'Livro Técnico', 'Bola de Futebol'
]

const STATUSES: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_METHODS: Order['paymentMethod'][] = ['credit_card', 'debit_card', 'pix', 'boleto']

const USER_NAMES = [
  'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Souza',
  'Lucas Rodrigues', 'Juliana Ferreira', 'Carlos Alves', 'Fernanda Pereira'
]

// ============================================
// FACTORY
// ============================================

/**
 * Cria um item de pedido mockado
 */
export function createOrderItem(overrides?: Partial<OrderItem>): OrderItem {
  const productName = randomItem(PRODUCT_NAMES)
  const price = randomNumber(20, 500)
  const quantity = randomNumber(1, 5)

  return {
    productId: generateId(),
    productName,
    quantity,
    price,
    total: price * quantity,
    ...overrides
  }
}

/**
 * Cria um pedido mockado
 */
export function createOrder(overrides?: Partial<Order>): Order {
  const itemCount = randomNumber(1, 4)
  const items = Array.from({ length: itemCount }, () => createOrderItem())
  const total = items.reduce((sum, item) => sum + item.total, 0)

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const userName = randomItem(USER_NAMES)

  return {
    id: generateId(),
    userId: generateId(),
    userName,
    items,
    total,
    status: randomItem(STATUSES),
    paymentMethod: randomItem(PAYMENT_METHODS),
    shippingAddress: createAddress(),
    createdAt: randomDate(thirtyDaysAgo, now),
    updatedAt: new Date(),
    ...overrides
  }
}

/**
 * Cria múltiplos pedidos mockados
 */
export function createOrders(count: number, overrides?: Partial<Order>): Order[] {
  return Array.from({ length: count }, () => createOrder(overrides))
}
