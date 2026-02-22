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
  background: var(--surface-color, #fff);
  border-right: 1px solid var(--border-color, #e0e0e0);
}

.palette-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.palette-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color, #1a1a1a);
}

.palette-search {
  width: 100%;
}

.palette-categories {
  display: flex;
  gap: 0.25rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  overflow-x: auto;
}

.category-tab {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #666);
  background: transparent;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tab:hover {
  background: var(--hover-color, #f5f5f5);
  color: var(--text-color, #1a1a1a);
}

.category-tab.active {
  background: var(--primary-color, #2563eb);
  color: white;
  border-color: var(--primary-color, #2563eb);
}

.palette-fields {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}

.palette-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--surface-color, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 0.5rem;
  cursor: grab;
  transition: all 0.2s;
}

.palette-field:hover {
  background: var(--hover-color, #f5f5f5);
  border-color: var(--primary-color, #2563eb);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.palette-field:active {
  cursor: grabbing;
}

.palette-field.pro {
  border-color: #f59e0b;
}

.field-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.field-info {
  flex: 1;
  min-width: 0;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color, #1a1a1a);
}

.field-type {
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
  margin-top: 0.125rem;
}

.field-badge {
  padding: 0.125rem 0.375rem;
  font-size: 0.625rem;
  font-weight: 700;
  color: #f59e0b;
  background: #fef3c7;
  border-radius: 0.25rem;
}

.palette-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.empty-message {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
}
</style>
