/**
 * ============================================
 * MODEL TYPES - Interfaces de dados/modelos
 * ============================================
 */

/**
 * Usuário (exemplo de mock)
 */
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

/**
 * Produto (exemplo de mock)
 */
export interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    inStock: boolean
    imageUrl?: string
    createdAt: Date
}

/**
 * Pedido (exemplo de mock)
 */
export interface Order {
    id: string
    userId: string
    productId: string
    quantity: number
    total: number
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    createdAt: Date
    updatedAt: Date
}

/**
 * Resposta de API genérica
 */
export interface ApiResponse<T = any> {
    data: T
    message?: string
    success: boolean
    errors?: string[]
}

/**
 * Resposta paginada de API
 */
export interface PaginatedResponse<T = any> {
    data: T[]
    total: number
    page: number
    perPage: number
    totalPages: number
}

/**
 * Filtros genéricos para listagens
 */
export interface Filters {
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: number
    perPage?: number
    [key: string]: any
}
