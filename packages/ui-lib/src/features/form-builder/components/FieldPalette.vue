<template>
  <div class="field-palette">
    <!-- Header -->
    <div class="palette-header">
      <h3 class="palette-title">Fields</h3>
      <Input v-model="searchQuery" type="search" placeholder="Search fields..." class="palette-search" />
    </div>

    <!-- Categories -->
    <div class="palette-categories">
      <button v-for="cat in categories" :key="cat.value"
        :class="['category-tab', { active: activeCategory === cat.value }]" @click="activeCategory = cat.value">
        {{ cat.label }}
      </button>
    </div>

    <!-- Field List -->
    <div class="palette-fields">
      <div v-for="field in filteredFields" :key="field.type" :class="['palette-field', { pro: field.isPro }]"
        :draggable="true" @dragstart="handleDragStart(field, $event)" @dragend="handleDragEnd">
        <div class="field-icon">{{ field.icon }}</div>
        <div class="field-info">
          <div class="field-label">{{ field.label }}</div>
          <div class="field-type">{{ field.type }}</div>
        </div>
        <div v-if="field.isPro" class="field-badge">PRO</div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredFields.length === 0" class="palette-empty">
        <div class="empty-icon">🔍</div>
        <div class="empty-message">No fields found</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input } from '../../../shared/components'
import type { FieldTypePalette, FieldCategory } from '../types'
import { FIELD_PALETTE } from '../field-palette-config'

// ============================================
// PROPS & EMITS
// ============================================

interface Props {
  /** Campos customizados */
  customFields?: FieldTypePalette[]
}

interface Emits {
  (e: 'field-drag-start', field: FieldTypePalette): void
  (e: 'field-drag-end'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ============================================
// STATE
// ============================================

const searchQuery = ref('')
const activeCategory = ref<FieldCategory | 'all'>('all')

const categories = [
  { label: 'All', value: 'all' as const },
  { label: 'Basic', value: 'basic' as const },
  { label: 'Selection', value: 'selection' as const },
  { label: 'Advanced', value: 'advanced' as const },
  { label: 'Layout', value: 'layout' as const }
]

// ============================================
// COMPUTED
// ============================================

const allFields = computed(() => {
  return [...FIELD_PALETTE, ...(props.customFields || [])]
})

const filteredFields = computed(() => {
  let fields = allFields.value

  // Filtrar por categoria
  if (activeCategory.value !== 'all') {
    fields = fields.filter(f => f.category === activeCategory.value)
  }

  // Filtrar por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    fields = fields.filter(f =>
      f.label.toLowerCase().includes(query) ||
      f.type.toLowerCase().includes(query)
    )
  }

  return fields
})

// ============================================
// METHODS
// ============================================

function handleDragStart(field: FieldTypePalette, event: DragEvent) {
  if (!event.dataTransfer) return

  // Configurar dados do drag
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('application/json', JSON.stringify({
    type: 'palette-field',
    field: field.defaultField
  }))

  emit('field-drag-start', field)
}

function handleDragEnd() {
  emit('field-drag-end')
}
</script>

<style scoped>
.field-palette {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-elevated);
  border-right: 1px solid var(--color-border-base);
}

.palette-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-base);
}

.palette-title {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.palette-search {
  width: 100%;
}

.palette-categories {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border-base);
  overflow-x: auto;
}

.category-tab {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.category-tab:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.category-tab.active {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  border-color: var(--color-primary);
}

.palette-fields {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}

.palette-field {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-md);
  cursor: grab;
  transition: all var(--transition-fast);
}

.palette-field:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.palette-field:active {
  cursor: grabbing;
}

.palette-field.pro {
  border-color: var(--color-warning);
}

.field-icon {
  font-size: var(--font-size-xl);
  line-height: 1;
}

.field-info {
  flex: 1;
  min-width: 0;
}

.field-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.field-type {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-2xs);
}

.field-badge {
  padding: var(--spacing-2xs) var(--spacing-xs);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-warning);
  background: var(--color-warning-light);
  border-radius: var(--radius-sm);
}

.palette-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
}

.empty-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-sm);
  opacity: 0.5;
}

.empty-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
