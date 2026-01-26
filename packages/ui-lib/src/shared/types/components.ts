/**
 * ============================================
 * COMPONENT TYPES - Interfaces específicas de componentes
 * ============================================
 */

import type { ComponentSize, ComponentVariant, Alignment, SortDirection } from './common'

/**
 * Props base para componentes com tamanho
 */
export interface SizeableProps {
    size?: ComponentSize
}

/**
 * Props base para componentes com variante
 */
export interface VariantProps {
    variant?: ComponentVariant
}

/**
 * Props base para componentes com estado de loading
 */
export interface LoadingProps {
    loading?: boolean
    loadingText?: string
}

/**
 * Props base para componentes com estado disabled
 */
export interface DisableableProps {
    disabled?: boolean
}

/**
 * Coluna de tabela (DataTable)
 */
export interface TableColumn<T = any> {
    /** Chave da propriedade no objeto de dados */
    key: keyof T | string
    /** Label exibido no header */
    label: string
    /** Se a coluna é ordenável */
    sortable?: boolean
    /** Largura fixa da coluna (ex: '100px', '20%') */
    width?: string
    /** Alinhamento do conteúdo */
    align?: Alignment
    /** Função para formatar o valor da célula */
    formatter?: (value: any, item: T) => string
    /** Classe CSS customizada para a coluna */
    class?: string
    /** Se a coluna deve ser ocultada em mobile */
    hideOnMobile?: boolean
}

/**
 * Estado de ordenação (DataTable, useSorting)
 */
export interface SortState<T = any> {
    /** Chave da coluna ordenada */
    key: keyof T | string
    /** Direção da ordenação */
    order: SortDirection
}

/**
 * Campo de formulário (DynamicForm)
 */
export interface FormField<T = any> {
    /** Nome do campo (deve corresponder à chave no objeto de dados) */
    name: keyof T | string
    /** Label exibido */
    label: string
    /** Tipo do input */
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date'
    /** Placeholder */
    placeholder?: string
    /** Se o campo é obrigatório */
    required?: boolean
    /** Regras de validação customizadas */
    validation?: ValidationRule[]
    /** Opções para select/radio */
    options?: SelectOption[]
    /** Número de colunas que o campo ocupa no grid (1-12) */
    cols?: number
    /** Valor padrão */
    defaultValue?: any
    /** Se o campo está desabilitado */
    disabled?: boolean
    /** Texto de ajuda */
    hint?: string
    /** Número de linhas (para textarea) */
    rows?: number
    /** Valor mínimo (para number/date) */
    min?: number | string
    /** Valor máximo (para number/date) */
    max?: number | string
    /** Dependências condicionais (outros campos que afetam este) */
    dependsOn?: string[]
    /** Função que determina se o campo deve ser exibido */
    showIf?: (formData: any) => boolean
}

/**
 * Opção de select/radio
 */
export interface SelectOption {
    label: string
    value: string | number | boolean
    disabled?: boolean
    icon?: string
}

/**
 * Regra de validação
 */
export interface ValidationRule {
    /** Tipo de regra (required, email, min, max, etc.) */
    type?: string
    /** Função de validação customizada */
    validator?: (value: any) => boolean | Promise<boolean>
    /** Mensagem de erro */
    message: string
    /** Parâmetros adicionais (ex: min: 3, max: 100) */
    params?: Record<string, any>
}

/**
 * Opções de paginação
 */
export interface PaginationOptions {
    /** Número de itens por página */
    itemsPerPage?: number
    /** Página inicial (1-based) */
    initialPage?: number
}

/**
 * Informações de página atual
 */
export interface PageInfo {
    /** Índice do primeiro item (1-based) */
    from: number
    /** Índice do último item (1-based) */
    to: number
    /** Total de itens */
    total: number
}

/**
 * Ação em lote (Bulk Actions)
 */
export interface BulkAction<T = any> {
    /** ID único da ação */
    id: string
    /** Label exibido */
    label: string
    /** Ícone */
    icon?: string
    /** Variante (cor) */
    variant?: ComponentVariant
    /** Função executada quando a ação é acionada */
    handler: (items: T[]) => void | Promise<void>
    /** Se a ação está desabilitada */
    disabled?: boolean | ((items: T[]) => boolean)
    /** Confirmação antes de executar */
    confirm?: {
        title: string
        message: string
    }
}
