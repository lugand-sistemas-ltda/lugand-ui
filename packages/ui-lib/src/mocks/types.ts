/**
 * ============================================
 * MOCK TYPES - Tipos para estrutura de dados
 * ============================================
 * 
 * Define os tipos TypeScript para todas as entidades mockadas
 * usadas nos exemplos da biblioteca.
 */

// ============================================
// USER
// ============================================
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// ============================================
// PRODUCT
// ============================================
export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: 'electronics' | 'clothing' | 'food' | 'books' | 'sports'
  image?: string
  sku: string
  createdAt: Date
  updatedAt: Date
}

// ============================================
// ORDER
// ============================================
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id: string
  userId: string
  userName: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'boleto'
  shippingAddress: Address
  createdAt: Date
  updatedAt: Date
}

// ============================================
// ADDRESS
// ============================================
export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}

// ============================================
// LOG / ACTIVITY
// ============================================
export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  entity: string
  entityId: string
  description: string
  timestamp: Date
}
