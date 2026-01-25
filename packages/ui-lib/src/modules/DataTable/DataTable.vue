<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TableColumn, SortState } from './types'
import { Checkbox, Btn, Input } from '@/shared/components'

interface Props {
    data: any[]
    columns: TableColumn[]
    loading?: boolean
    selectable?: boolean
    pagination?: boolean
    itemsPerPageOptions?: number[]
    /** Disable internal search (when managed externally) */
    disableSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    columns: () => [],
    loading: false,
    selectable: false,
    pagination: false,
    itemsPerPageOptions: () => [5, 10, 25, 50],
    disableSearch: false
})

const emit = defineEmits<{
    'update:selection': [selected: any[]]
    'sort': [sort: SortState]
    'page-change': [page: number]
}>()

// --- State ---
const searchQuery = ref('')
const sortState = ref<SortState>({ key: '', order: null })
const currentPage = ref(1)
const itemsPerPage = ref(props.itemsPerPageOptions[0] || 10)
const selectedRows = ref<any[]>([])

// --- Sorting ---
const handleSort = (key: string) => {
    const column = props.columns.find(c => c.key === key)
    if (!column?.sortable) return

    if (sortState.value.key === key) {
        // Cycle: asc -> desc -> null
        if (sortState.value.order === 'asc') sortState.value.order = 'desc'
        else if (sortState.value.order === 'desc') sortState.value.order = null
        else sortState.value.order = 'asc'

        if (sortState.value.order === null) sortState.value.key = ''
    } else {
        sortState.value = { key, order: 'asc' }
    }

    emit('sort', sortState.value)
}

// --- Filtering ---
// Simple client-side search across all fields (if not disabled)
const filteredData = computed(() => {
    let result = [...props.data]

    // Only apply internal search if not disabled
    if (!props.disableSearch && searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(row => {
            return Object.values(row).some(val =>
                String(val).toLowerCase().includes(query)
            )
        })
    }

    // Client-side sorting if needed (optional, assuming data might be pre-sorted or server-side)
    // For now, let's implement client-side sorting for robustness
    if (sortState.value.key && sortState.value.order) {
        result.sort((a, b) => {
            const valA = a[sortState.value.key]
            const valB = b[sortState.value.key]

            if (valA < valB) return sortState.value.order === 'asc' ? -1 : 1
            if (valA > valB) return sortState.value.order === 'asc' ? 1 : -1
            return 0
        })
    }

    return result
})

// --- Pagination ---
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

const paginatedData = computed(() => {
    if (!props.pagination) return filteredData.value

    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredData.value.slice(start, end)
})

watch(itemsPerPage, () => {
    currentPage.value = 1
})

// --- Selection ---
const allSelected = computed(() => {
    return paginatedData.value.length > 0 && paginatedData.value.every(row => selectedRows.value.includes(row))
})

const toggleAll = () => {
    if (allSelected.value) {
        selectedRows.value = []
    } else {
        selectedRows.value = [...paginatedData.value]
    }
    emit('update:selection', selectedRows.value)
}

const toggleRow = (row: any) => {
    const index = selectedRows.value.indexOf(row)
    if (index === -1) {
        selectedRows.value.push(row)
    } else {
        selectedRows.value.splice(index, 1)
    }
    emit('update:selection', selectedRows.value)
}

const isSelected = (row: any) => selectedRows.value.includes(row)

</script>

<template>
    <div class="data-table-wrapper">
        <!-- Toolbar -->
        <div class="data-table-toolbar" v-if="!disableSearch || $slots.actions">
            <div class="data-table-toolbar__search" v-if="!disableSearch">
                <Input v-model="searchQuery" placeholder="Search..." class="search-input" />
            </div>
            <div class="data-table-toolbar__actions">
                <slot name="actions"></slot>
            </div>
        </div>

        <!-- Table Container -->
        <div class="data-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th v-if="selectable" class="col-checkbox">
                            <Checkbox :model-value="allSelected" @update:model-value="toggleAll" />
                        </th>
                        <th v-for="col in columns" :key="col.key" :class="[
                            'col-header',
                            `text-${col.align || 'left'}`,
                            { 'sortable': col.sortable }
                        ]" :style="{ width: col.width }" @click="handleSort(col.key)">
                            <div class="th-content">
                                {{ col.label }}
                                <span v-if="col.sortable" class="sort-icon">
                                    <template v-if="sortState.key === col.key">
                                        {{ sortState.order === 'asc' ? '↑' : '↓' }}
                                    </template>
                                    <template v-else>↕</template>
                                </span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading" class="tr-loading">
                        <td :colspan="columns.length + (selectable ? 1 : 0)">
                            <div class="loading-state">Loading...</div>
                        </td>
                    </tr>

                    <tr v-else-if="paginatedData.length === 0" class="tr-empty">
                        <td :colspan="columns.length + (selectable ? 1 : 0)">
                            <div class="empty-state">No data found</div>
                        </td>
                    </tr>

                    <tr v-for="(row, i) in paginatedData" :key="i" :class="{ 'tr-selected': isSelected(row) }">
                        <td v-if="selectable" class="td-checkbox" @click="toggleRow(row)">
                            <Checkbox :model-value="isSelected(row)" @click.stop="toggleRow(row)" />
                        </td>
                        <td v-for="col in columns" :key="col.key" :class="[`text-${col.align || 'left'}`]">
                            <slot :name="col.key" :row="row" :value="row[col.key]">
                                {{ row[col.key] }}
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination" class="data-table-pagination">
            <div class="pagination-info">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage,
                    filteredData.length) }} of {{ filteredData.length }} entries
            </div>

            <div class="pagination-controls">
                <div class="rows-per-page">
                    <span>Rows per page:</span>
                    <select v-model="itemsPerPage" class="local-select">
                        <option v-for="opt in itemsPerPageOptions" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                </div>

                <div class="page-nav">
                    <Btn size="sm" variant="ghost" :disabled="currentPage === 1" @click="currentPage--">
                        Prev
                    </Btn>
                    <span class="page-current">{{ currentPage }} / {{ totalPages }}</span>
                    <Btn size="sm" variant="ghost" :disabled="currentPage === totalPages" @click="currentPage++">
                        Next
                    </Btn>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.data-table-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-base);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.data-table-toolbar {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border-base);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;

    &__search {
        flex: 1;
        max-width: 300px;
    }

    &__actions {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
        flex: 1;
        justify-content: space-between;
    }
}

.data-table-container {
    width: 100%;
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);

    th,
    td {
        padding: var(--spacing-md);
        text-align: left;
        border-bottom: 1px solid var(--color-border-base);
        color: var(--color-text-primary);
        white-space: nowrap;
    }

    th {
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-secondary);
        background: var(--color-bg-secondary);
        user-select: none;

        &.sortable {
            cursor: pointer;

            &:hover {
                background: var(--color-bg-tertiary);
            }
        }
    }

    // Align utility classes
    .text-right {
        text-align: right;
    }

    .text-center {
        text-align: center;
    }

    .col-checkbox,
    .td-checkbox {
        width: 40px;
        text-align: center;
    }

    tbody tr {
        transition: background var(--transition-fast);

        &:hover {
            background: var(--color-bg-secondary);
        }

        &.tr-selected {
            background: hsla(var(--hsl-primary), 0.05);
        }
    }
}

.th-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);

    .sort-icon {
        font-size: 0.8em;
        opacity: 0.5;
    }
}

.tr-empty,
.tr-loading {
    td {
        text-align: center;
        padding: var(--spacing-xl);
        color: var(--color-text-tertiary);
    }
}

.data-table-pagination {
    padding: var(--spacing-md);
    border-top: 1px solid var(--color-border-base);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);

    .pagination-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
    }

    .rows-per-page {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);

        .local-select {
            padding: 2px 5px;
            border-radius: var(--radius-sm);
            border: 1px solid var(--color-border-base);
            background: var(--color-bg-primary);
            color: var(--color-text-primary);
        }
    }

    .page-nav {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }
}
</style>
