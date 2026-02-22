<!--
  @file FASE 5 - Widget Palette
  @description Paleta lateral com widgets disponíveis para drag-drop
-->

<template>
  <div class="widget-palette">
    <!-- Search -->
    <div class="palette-search">
      <input v-model="searchQuery" type="text" placeholder="Search widgets..." class="search-input" />
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs">
      <button v-for="cat in WIDGET_CATEGORIES" :key="cat.id"
        :class="['category-tab', { active: activeCategory === cat.id }]" @click="activeCategory = cat.id">
        <span class="category-icon">{{ cat.icon }}</span>
        <span class="category-label">{{ cat.label }}</span>
      </button>
    </div>

    <!-- Widget List -->
    <div class="widget-list">
      <div v-for="widget in filteredWidgets" :key="widget.type" :class="['widget-item', { pro: widget.isPro }]"
        draggable="true" @dragstart="handleDragStart(widget)" @dragend="handleDragEnd">
        <span class="widget-icon">{{ widget.icon }}</span>
        <div class="widget-info">
          <div class="widget-label">
            {{ widget.label }}
            <span v-if="widget.isPro" class="pro-badge">PRO</span>
          </div>
          <div v-if="widget.description" class="widget-description">
            {{ widget.description }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredWidgets.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">No widgets found</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { WIDGET_CATEGORIES, getPaletteItemsByCategory } from '../widget-palette-config'
import type { WidgetTypePalette } from '../types'

// ============================================
// EMITS
// ============================================

const emit = defineEmits<{
  'widget-drag-start': [widget: WidgetTypePalette]
  'widget-drag-end': []
}>()

// ============================================
// STATE
// ============================================

const searchQuery = ref('')
const activeCategory = ref('all')

// ============================================
// COMPUTED
// ============================================

const filteredWidgets = computed(() => {
  let widgets = getPaletteItemsByCategory(activeCategory.value)

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    widgets = widgets.filter(w =>
      w.label.toLowerCase().includes(query) ||
      w.type.toLowerCase().includes(query) ||
      w.description?.toLowerCase().includes(query)
    )
  }

  return widgets
})

// ============================================
// METHODS
// ============================================

function handleDragStart(widget: WidgetTypePalette) {
  emit('widget-drag-start', widget)

  // Set drag data
  if (event && event instanceof DragEvent && event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/json', JSON.stringify({
      type: 'palette-widget',
      widgetType: widget.type,
      widget: widget.defaultWidget
    }))
  }
}

function handleDragEnd() {
  emit('widget-drag-end')
}
</script>

<style scoped>
.widget-palette {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
}

/* Search */
.palette-search {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

/* Category Tabs */
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tab:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.category-tab.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.category-icon {
  font-size: 1rem;
}

.category-label {
  font-weight: 500;
}

/* Widget List */
.widget-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.widget-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: grab;
  transition: all 0.2s;
}

.widget-item:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px var(--shadow-sm);
}

.widget-item:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.widget-item.pro {
  border-color: var(--color-warning);
}

.widget-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.widget-info {
  flex: 1;
  min-width: 0;
}

.widget-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.pro-badge {
  display: inline-block;
  padding: 2px 6px;
  background: var(--color-warning);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.widget-description {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.3;
  margin-bottom: var(--spacing-md);
}

.empty-text {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* Scrollbar */
.widget-list::-webkit-scrollbar {
  width: 6px;
}

.widget-list::-webkit-scrollbar-track {
  background: transparent;
}

.widget-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.widget-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}
</style>
