export interface TableColumn {
    key: string
    label: string
    sortable?: boolean
    filterable?: boolean
    width?: string
    align?: 'left' | 'center' | 'right'
    // Se true, usa um slot com o nome da key para renderizar
    slot?: boolean
}

export interface PaginationState {
    currentPage: number
    itemsPerPage: number
    totalItems: number
}

export interface SortState {
    key: string
    order: 'asc' | 'desc' | null
}

export interface DataTableProps {
    data: any[]
    columns: TableColumn[]
    loading?: boolean
    selectable?: boolean
    pagination?: boolean
    itemsPerPage?: number
}
