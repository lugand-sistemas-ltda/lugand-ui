<!--
  DataBindingEditor.vue — Low-Code Engine Sprint 8

  Editor para props do tipo 'data-binding'.
  Permite ao usuário vincular uma prop de um SchemaNode a:
  - Um DataSource inteiro (resultado completo) → { __binding: true, sourceId: 'x', fieldKey: null }
  - Um campo específico de um DataSource → { __binding: true, sourceId: 'x', fieldKey: 'price' }
  - Nenhum binding (literal) → null

  FLUXO:
  1. Usuário abre o modo "Binding"
  2. Seleciona um DataSource da lista (injetada via DATA_SOURCE_KEY)
  3. (Opcional) Seleciona um campo específico do DataSource
  4. O valor emitido é um DataBinding object

  INJEÇÃO:
  Os DataSources disponíveis são injetados automaticamente via useDataSource(),
  que consome o provide feito pelo LowCodeEngine.vue ancestral.

  USO:
  ```vue
  <DataBindingEditor v-model="node.props.dataSource" />
  ```
-->
<template>
  <div class="lg-db-editor">
    <!-- ── Mode tabs ──────────────────────────────── -->
    <div class="lg-db-editor__tabs">
      <button
        class="lg-db-editor__tab"
        :class="{ 'lg-db-editor__tab--active': !isBinding }"
        type="button"
        @click="clearBinding"
      >
        Literal
      </button>
      <button
        class="lg-db-editor__tab"
        :class="{ 'lg-db-editor__tab--active': isBinding }"
        type="button"
        @click="activateBinding"
      >
        ⛓ Binding
      </button>
    </div>

    <!-- ── Binding active ─────────────────────────── -->
    <template v-if="isBinding">
      <!-- No data sources registered -->
      <div v-if="sources.length === 0" class="lg-db-editor__status">
        Nenhum DataSource registrado no motor.
      </div>

      <template v-else>
        <!-- Source selector -->
        <select
          class="lg-db-editor__select"
          :value="currentSourceId"
          @change="selectSource(($event.target as HTMLSelectElement).value)"
        >
          <option value="">-- Selecione uma fonte --</option>
          <option
            v-for="src in sources"
            :key="src.id"
            :value="src.id"
          >
            {{ src.icon ? `${src.icon} ` : '' }}{{ src.label }}
          </option>
        </select>

        <!-- Field selector (shown once source is picked) -->
        <select
          v-if="currentSourceId"
          class="lg-db-editor__select"
          :value="currentFieldKey ?? ''"
          @change="selectField(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Resultado completo</option>
          <option
            v-for="field in fields"
            :key="field.key"
            :value="field.key"
          >
            {{ field.label }}
            <template v-if="field.type !== 'unknown'"> ({{ field.type }})</template>
          </option>
        </select>

        <!-- Summary badge -->
        <div v-if="currentSourceId" class="lg-db-editor__badge">
          <span class="lg-db-editor__badge-source">{{ currentSource?.label }}</span>
          <span v-if="currentFieldKey" class="lg-db-editor__badge-sep">›</span>
          <span v-if="currentFieldKey" class="lg-db-editor__badge-field">{{ currentFieldKey }}</span>
          <span v-else class="lg-db-editor__badge-all">[todos]</span>
        </div>
      </template>
    </template>

    <!-- ── Literal mode ───────────────────────────── -->
    <div v-else class="lg-db-editor__status">
      Sem binding — valor literal
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDataSource } from '../composables/useDataSource'
import { isDataBinding } from '../types/datasource.types'
import type { DataBinding } from '../types/datasource.types'

// ============================================================
// PROPS / EMITS
// ============================================================

const props = defineProps<{
  modelValue: unknown
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DataBinding | null]
}>()

// ============================================================
// DATA SOURCES
// ============================================================

const { sources, getSource, getFields, createBinding } = useDataSource()

// ============================================================
// DERIVED STATE
// ============================================================

const isBinding = computed(() => isDataBinding(props.modelValue))

const currentSourceId = computed<string>(() =>
  isDataBinding(props.modelValue) ? props.modelValue.sourceId : '',
)

const currentFieldKey = computed<string | null>(() =>
  isDataBinding(props.modelValue) ? props.modelValue.fieldKey : null,
)

const currentSource = computed(() =>
  currentSourceId.value ? getSource(currentSourceId.value) : undefined,
)

const fields = computed(() =>
  currentSourceId.value ? getFields(currentSourceId.value) : [],
)

// ============================================================
// ACTIONS
// ============================================================

function clearBinding() {
  emit('update:modelValue', null)
}

function activateBinding() {
  if (!isBinding.value) {
    const first = sources.value[0]
    emit('update:modelValue', createBinding(first?.id ?? '', null))
  }
}

function selectSource(sourceId: string) {
  emit('update:modelValue', createBinding(sourceId, null))
}

function selectField(fieldKey: string) {
  emit('update:modelValue', createBinding(currentSourceId.value, fieldKey || null))
}
</script>

<style scoped>
/* ── Root ─────────────────────────────────────────── */
.lg-db-editor {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ── Mode tabs ────────────────────────────────────── */
.lg-db-editor__tabs {
  display: flex;
  gap: 2px;
  background: var(--lg-toolbar-hover-bg, #f3f4f6);
  border-radius: 6px;
  padding: 2px;
}

.lg-db-editor__tab {
  flex: 1;
  padding: 4px 6px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 11px;
  cursor: pointer;
  color: var(--lg-muted, #6b7280);
  transition: background 0.12s, color 0.12s;
}

.lg-db-editor__tab--active {
  background: #fff;
  color: var(--lg-accent, #3b82f6);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

/* ── Selects ──────────────────────────────────────── */
.lg-db-editor__select {
  width: 100%;
  padding: 5px 8px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  font-size: 12px;
  background: #fff;
  outline: none;
  cursor: pointer;
}

.lg-db-editor__select:focus {
  border-color: var(--lg-accent, #3b82f6);
  box-shadow: 0 0 0 2px var(--lg-accent-light, #dbeafe);
}

/* ── Status / empty texts ─────────────────────────── */
.lg-db-editor__status {
  font-size: 11px;
  color: var(--lg-muted, #9ca3af);
  font-style: italic;
  padding: 2px 0;
}

/* ── Badge ────────────────────────────────────────── */
.lg-db-editor__badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--lg-accent-light, #eff6ff);
  border: 1px solid var(--lg-accent, #bfdbfe);
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 11px;
  font-family: monospace;
  flex-wrap: wrap;
}

.lg-db-editor__badge-source {
  color: var(--lg-accent, #3b82f6);
  font-weight: 600;
}

.lg-db-editor__badge-sep {
  color: var(--lg-muted, #9ca3af);
}

.lg-db-editor__badge-field {
  color: var(--lg-prop-label-color, #374151);
}

.lg-db-editor__badge-all {
  color: var(--lg-muted, #9ca3af);
  font-style: italic;
}
</style>
