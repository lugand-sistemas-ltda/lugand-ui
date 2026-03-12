<!--
  ColumnsConfigEditor.vue — Low-Code Engine Sprint 8

  Editor para props do tipo 'columns-config'.
  Permite ao usuário configurar as colunas de um DataTable (ou componente
  semelhante) de forma visual.

  CADA COLUNA TEM:
  - Toggle de visibilidade
  - Label (editável)
  - Tipo de dado (string | number | boolean | date | currency)
  - Toggle sortable
  - Botão de remoção

  O modelValue é um ColumnConfig[] (de component.types.ts).

  USO:
  ```vue
  <ColumnsConfigEditor v-model="node.props.columns" />
  ```
-->
<template>
  <div class="lg-cols-editor">
    <!-- Column header row -->
    <div v-if="columns.length > 0" class="lg-cols-editor__header">
      <span class="lg-cols-editor__header-vis">👁</span>
      <span class="lg-cols-editor__header-label">Rótulo</span>
      <span class="lg-cols-editor__header-type">Tipo</span>
      <span class="lg-cols-editor__header-sort">⇅</span>
      <span class="lg-cols-editor__header-remove" />
    </div>

    <!-- Column rows -->
    <div
      v-for="(col, idx) in columns"
      :key="col.key"
      class="lg-cols-editor__row"
      :class="{ 'lg-cols-editor__row--hidden': !col.visible }"
    >
      <!-- Visible toggle -->
      <input
        type="checkbox"
        class="lg-cols-editor__toggle"
        :checked="col.visible"
        title="Visível"
        @change="updateCol(idx, { visible: ($event.target as HTMLInputElement).checked })"
      />

      <!-- Label -->
      <input
        type="text"
        class="lg-cols-editor__label-input"
        :value="col.label"
        placeholder="Rótulo"
        @input="updateCol(idx, { label: ($event.target as HTMLInputElement).value })"
      />

      <!-- Type -->
      <select
        class="lg-cols-editor__type-select"
        :value="col.type"
        @change="updateCol(idx, { type: ($event.target as HTMLSelectElement).value as ColumnConfig['type'] })"
      >
        <option value="string">Texto</option>
        <option value="number">Número</option>
        <option value="boolean">Bool</option>
        <option value="date">Data</option>
        <option value="currency">Moeda</option>
      </select>

      <!-- Sortable -->
      <input
        type="checkbox"
        class="lg-cols-editor__toggle"
        :checked="col.sortable ?? false"
        title="Ordenável"
        @change="updateCol(idx, { sortable: ($event.target as HTMLInputElement).checked })"
      />

      <!-- Remove -->
      <button
        type="button"
        class="lg-cols-editor__remove-btn"
        title="Remover coluna"
        @click="removeCol(idx)"
      >
        ✕
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="columns.length === 0" class="lg-cols-editor__empty">
      Nenhuma coluna — clique em "+ Adicionar" para começar
    </div>

    <!-- Add button -->
    <button
      type="button"
      class="lg-cols-editor__add-btn"
      @click="addCol"
    >
      + Adicionar coluna
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ColumnConfig } from '../types/component.types'

// ============================================================
// PROPS / EMITS
// ============================================================

const props = defineProps<{
  modelValue: ColumnConfig[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ColumnConfig[]]
}>()

// ============================================================
// STATE
// ============================================================

const columns = computed<ColumnConfig[]>(() => props.modelValue ?? [])

// ============================================================
// ACTIONS
// ============================================================

function updateCol(idx: number, patch: Partial<ColumnConfig>) {
  emit(
    'update:modelValue',
    columns.value.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
  )
}

function removeCol(idx: number) {
  emit('update:modelValue', columns.value.filter((_, i) => i !== idx))
}

function addCol() {
  const next: ColumnConfig = {
    key: `col_${Date.now()}`,
    label: `Coluna ${columns.value.length + 1}`,
    type: 'string',
    visible: true,
    sortable: false,
  }
  emit('update:modelValue', [...columns.value, next])
}
</script>

<style scoped>
/* ── Root ─────────────────────────────────────────── */
.lg-cols-editor {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* ── Header ───────────────────────────────────────── */
.lg-cols-editor__header {
  display: grid;
  grid-template-columns: 18px 1fr 60px 18px 22px;
  gap: 4px;
  align-items: center;
  padding: 0 2px 2px;
  font-size: 10px;
  font-weight: 600;
  color: var(--lg-muted, #9ca3af);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--lg-border, #e5e7eb);
}

/* ── Row ──────────────────────────────────────────── */
.lg-cols-editor__row {
  display: grid;
  grid-template-columns: 18px 1fr 60px 18px 22px;
  gap: 4px;
  align-items: center;
  padding: 2px;
  border-radius: 4px;
  transition: background 0.12s;
}

.lg-cols-editor__row:hover {
  background: var(--lg-toolbar-hover-bg, #f9fafb);
}

.lg-cols-editor__row--hidden {
  opacity: 0.45;
}

/* ── Inputs ───────────────────────────────────────── */
.lg-cols-editor__toggle {
  justify-self: center;
  cursor: pointer;
  accent-color: var(--lg-accent, #3b82f6);
}

.lg-cols-editor__label-input {
  min-width: 0;
  padding: 3px 6px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  font-size: 11px;
  outline: none;
  background: #fff;
}

.lg-cols-editor__label-input:focus {
  border-color: var(--lg-accent, #3b82f6);
}

.lg-cols-editor__type-select {
  padding: 3px 2px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  font-size: 10px;
  background: #fff;
  outline: none;
  cursor: pointer;
}

/* ── Remove button ────────────────────────────────── */
.lg-cols-editor__remove-btn {
  justify-self: center;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 3px;
  background: transparent;
  cursor: pointer;
  font-size: 9px;
  color: var(--lg-muted, #9ca3af);
  transition: background 0.12s, color 0.12s;
}

.lg-cols-editor__remove-btn:hover {
  background: var(--lg-danger-light, #fee2e2);
  color: var(--lg-danger, #ef4444);
}

/* ── Add button ───────────────────────────────────── */
.lg-cols-editor__add-btn {
  margin-top: 4px;
  padding: 5px 8px;
  border: 1px dashed var(--lg-border, #d1d5db);
  border-radius: 4px;
  background: transparent;
  font-size: 11px;
  cursor: pointer;
  color: var(--lg-accent, #3b82f6);
  text-align: left;
  transition: background 0.12s, border-color 0.12s;
}

.lg-cols-editor__add-btn:hover {
  background: var(--lg-accent-light, #eff6ff);
  border-color: var(--lg-accent, #3b82f6);
}

/* ── Empty ────────────────────────────────────────── */
.lg-cols-editor__empty {
  font-size: 11px;
  color: var(--lg-muted, #9ca3af);
  font-style: italic;
  padding: 4px 2px;
  text-align: center;
}
</style>
