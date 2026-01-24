/**
 * ============================================
 * PRODUCT FACTORY - Gerador de produtos mockados
 * ============================================
 */

import type { Product } from '../types'
import { generateId, randomItem, randomNumber, randomDate } from '../helpers'

// ============================================
// CONSTANTS
// ============================================
const PRODUCT_NAMES = {
  electronics: [
    'Smartphone Galaxy', 'Notebook Pro', 'Tablet Air', 'Smartwatch Ultra',
    'Fone Bluetooth', 'Mouse Gamer', 'Teclado Mecânico', 'Monitor 4K',
    'Webcam HD', 'Microfone USB', 'Carregador Wireless', 'Pen Drive 128GB'
  ],
  clothing: [
    'Camiseta Básica', 'Calça Jeans', 'Jaqueta Corta-Vento', 'Tênis Esportivo',
    'Moletom com Capuz', 'Bermuda Cargo', 'Vestido Floral', 'Camisa Social',
    'Saia Midi', 'Blazer Slim', 'Sapato Social', 'Chinelo Confort'
  ],
  food: [
    'Café Premium 500g', 'Chocolate 70% Cacau', 'Barra de Cereal', 'Whey Protein',
    'Granola Integral', 'Azeite Extra Virgem', 'Mel Orgânico', 'Pasta de Amendoim',
    'Chá Verde', 'Açúcar Mascavo', 'Farinha Integral', 'Quinoa Real'
  ],
  books: [
    'Código Limpo', 'Algoritmos Iluminados', 'Design Patterns', 'Domain-Driven Design',
    'Refatoração', 'Arquitetura Limpa', 'O Programador Pragmático', 'Estruturas de Dados',
    'Inteligência Artificial', 'Machine Learning', 'DevOps Handbook', 'Agile Scrum'
  ],
  sports: [
    'Bola de Futebol', 'Raquete de Tênis', 'Luvas de Boxe', 'Skate Profissional',
    'Bicicleta Mountain', 'Kit Natação', 'Halteres 5kg', 'Colchonete Yoga',
    'Corda de Pular', 'Protetor Bucal', 'Munhequeira', 'Joelheira Esportiva'
  ]
}

const CATEGORIES: Product['category'][] = ['electronics', 'clothing', 'food', 'books', 'sports']

// ============================================
// FACTORY
// ============================================

/**
 * Cria um produto mockado
 */
export function createProduct(overrides?: Partial<Product>): Product {
  const category = overrides?.category || randomItem(CATEGORIES)
  const name = randomItem(PRODUCT_NAMES[category])
  const price = randomNumber(20, 5000)

  const now = new Date()
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  return {
    id: generateId(),
    name,
    description: `Descrição detalhada do produto ${name}. Produto de alta qualidade com excelente custo-benefício.`,
    price,
    stock: randomNumber(0, 100),
    category,
    sku: `SKU-${randomNumber(10000, 99999)}`,
    createdAt: randomDate(sixtyDaysAgo, now),
    updatedAt: new Date(),
    ...overrides
  }
}

/**
 * Cria múltiplos produtos mockados
 */
export function createProducts(count: number, overrides?: Partial<Product>): Product[] {
  return Array.from({ length: count }, () => createProduct(overrides))
}
