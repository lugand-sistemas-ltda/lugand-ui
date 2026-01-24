<script setup lang="ts">
/**
 * ============================================
 * PAGINATION - Componente de paginação genérico
 * ============================================
 * 
 * Componente reutilizável para paginação de dados.
 * Pode ser usado em tabelas, cards, galerias, etc.
 * 
 * Features:
 * - Navegação entre páginas (Prev/Next, First/Last)
 * - Seleção de itens por página
 * - Informações de contagem (from/to/total)
 * - Estados desabilitados (primeira/última página)
 * - Customizável via props e slots
 * 
 * @example
 * ```vue
 * <Pagination
 *   :current-page="currentPage"
 *   :total-items="100"
 *   :items-per-page="10"
 *   @update:current-page="currentPage = $event"
 *   @update:items-per-page="itemsPerPage = $event"
 * />
 * ```
 */
import { computed } from 'vue'
import { Btn, Select } from '@/shared/components'

interface Props {
  currentPage: number
  totalItems: number
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  showItemsPerPage?: boolean
  showInfo?: boolean
  showFirstLast?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 10,
  itemsPerPageOptions: () => [5, 10, 25, 50, 100],
  showItemsPerPage: true,
  showInfo: true,
  showFirstLast: false,
  disabled: false
})

const emit = defineEmits<{
  'update:current-page': [page: number]
  'update:items-per-page': [itemsPerPage: number]
}>()

// ============================================
// COMPUTED
// ============================================
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage) || 1)

const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)

const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

const isFirstPage = computed(() => props.currentPage === 1)

const isLastPage = computed(() => props.currentPage === totalPages.value)

const perPageOptions = computed(() =>
  props.itemsPerPageOptions.map(value => ({
    value: String(value),
    label: String(value)
  }))
)

// ============================================
// METHODS
// ============================================
function goToPage(page: number): void {
  if (props.disabled) return
  if (page < 1 || page > totalPages.value) return
  emit('update:current-page', page)
}

function nextPage(): void {
  if (!isLastPage.value) {
    goToPage(props.currentPage + 1)
  }
}

function previousPage(): void {
  if (!isFirstPage.value) {
    goToPage(props.currentPage - 1)
  }
}

function firstPage(): void {
  goToPage(1)
}

function lastPage(): void {
  goToPage(totalPages.value)
}

function handlePerPageChange(value: string | number): void {
  if (props.disabled) return
  const newValue = typeof value === 'string' ? Number(value) : value
  emit('update:items-per-page', newValue)
  // Se a página atual ficar inválida após mudar items-per-page, volta pra primeira
  const newTotalPages = Math.ceil(props.totalItems / newValue) || 1
  if (props.currentPage > newTotalPages) {
    emit('update:current-page', 1)
  }
}
</script>

<template>
  <div class="pagination" :class="{ 'pagination--disabled': disabled }">
    <!-- Info: "Showing X to Y of Z entries" -->
    <div v-if="showInfo" class="pagination__info">
      <slot name="info" :start="startItem" :end="endItem" :total="totalItems">
        Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} entries
      </slot>
    </div>

    <!-- Controls -->
    <div class="pagination__controls">
      <!-- Items Per Page -->
      <div v-if="showItemsPerPage" class="pagination__per-page">
        <span class="pagination__label">Rows per page:</span>
        <Select :model-value="String(itemsPerPage)" :options="perPageOptions" size="sm" :disabled="disabled"
          @update:model-value="handlePerPageChange" />
      </div>

      <!-- Navigation -->
      <div class="pagination__nav">
        <!-- First -->
        <Btn v-if="showFirstLast" size="sm" variant="ghost" :disabled="isFirstPage || disabled" @click="firstPage">
          <slot name="first-icon">
            «
          </slot>
        </Btn>

        <!-- Previous -->
        <Btn size="sm" variant="ghost" :disabled="isFirstPage || disabled" @click="previousPage">
          <slot name="prev-icon">
            ‹
          </slot>
          <slot name="prev-text">
            Prev
          </slot>
        </Btn>

        <!-- Current Page Indicator -->
        <span class="pagination__current">
          <slot name="current" :current="currentPage" :total="totalPages">
            {{ currentPage }} / {{ totalPages }}
          </slot>
        </span>

        <!-- Next -->
        <Btn size="sm" variant="ghost" :disabled="isLastPage || disabled" @click="nextPage">
          <slot name="next-text">
            Next
          </slot>
          <slot name="next-icon">
            ›
          </slot>
        </Btn>

        <!-- Last -->
        <Btn v-if="showFirstLast" size="sm" variant="ghost" :disabled="isLastPage || disabled" @click="lastPage">
          <slot name="last-icon">
            »
          </slot>
        </Btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border-base);
  background: var(--color-bg-primary);
  flex-wrap: wrap;

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__info {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
  }

  &__per-page {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  &__label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__current {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    font-weight: 500;
    min-width: 60px;
    text-align: center;
  }
}
</style>
