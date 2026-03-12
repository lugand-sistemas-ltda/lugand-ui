<!--
  PropertiesPanel.vue — Low-Code Engine Sprint 6

  Painel de Propriedades lateral do editor.
  Exibe campos de edição auto-gerados a partir de ComponentDefinition.propsSchema.

  ESTRUTURA:
  ┌─────────────────────┐
  │  Header             │  tipo + label + quick actions
  ├─────────────────────┤
  │  [BASIC] [STYLE]    │  abas de grupo
  │  [ADVANCED] [DATA]  │
  ├─────────────────────┤
  │  PropEditor x N     │  campos filtrados pelo grupo ativo
  └─────────────────────┘

  GRUPOS (tabs):
  - basic     — Propriedades principais, sempre visíveis
  - style     — Aparência visual
  - responsive — Configurações responsivas (breakpoint)
  - data      — DataSource / data binding (Sprint 8)
  - advanced  — Configurações avançadas (colapsado por padrão)

  Tabs são exibidas apenas se houver pelo menos um campo no grupo.

  INTEGRAÇÃO COM O MOTOR:
  Recebe o nó selecionado + a definição do componente + callbacks de update.
  Chama updateProps / updateStyle do useSchemaTree via emit.

  USO:
  ```vue
  <PropertiesPanel
    :node="selectedNode"
    :definition="registry.get(selectedNode.type)"
    :active-breakpoint="activeBreakpoint"
    @update-props="(id, patch) => updateProps(id, patch)"
    @update-style="(id, style) => updateStyle(id, style)"
    @delete="removeNode(id)"
    @duplicate="duplicateNode(id)"
    @move-up="moveUp(id)"
    @move-down="moveDown(id)"
  />
  ```
-->
<template>
  <div class="lg-props-panel">

    <!-- ── Vazio ──────────────────────────────────── -->
    <div v-if="!node" class="lg-props-panel__empty">
      <div class="lg-props-panel__empty-icon">☞</div>
      <p class="lg-props-panel__empty-text">Select a component to edit its properties</p>
    </div>

    <!-- ── Nó selecionado ─────────────────────────── -->
    <template v-else>

      <!-- Header: tipo + label do nó -->
      <div class="lg-props-panel__header">
        <div class="lg-props-panel__header-meta">
          <code class="lg-props-panel__type">{{ node.type }}</code>
          <span class="lg-props-panel__node-label">
            {{ node.meta.label ?? node.id.slice(0, 8) }}
          </span>
        </div>
        <!-- Lock indicator -->
        <span
          v-if="node.meta.locked"
          class="lg-props-panel__lock"
          title="This component is locked"
        >🔒</span>
      </div>

      <!-- Quick actions -->
      <div class="lg-props-panel__actions">
        <button
          v-if="capabilities.canReorder"
          class="lg-props-panel__action-btn"
          title="Move up"
          :disabled="node.meta.locked"
          @click="emit('move-up', node!.id)"
        >↑</button>
        <button
          v-if="capabilities.canReorder"
          class="lg-props-panel__action-btn"
          title="Move down"
          :disabled="node.meta.locked"
          @click="emit('move-down', node!.id)"
        >↓</button>
        <button
          v-if="capabilities.canDuplicate"
          class="lg-props-panel__action-btn"
          title="Duplicate"
          @click="emit('duplicate', node!.id)"
        >⊕ Dup</button>
        <button
          v-if="capabilities.canDelete && !node.meta.locked"
          class="lg-props-panel__action-btn lg-props-panel__action-btn--danger"
          title="Delete"
          @click="emit('delete', node!.id)"
        >🗑</button>
      </div>

      <!-- ── Group tabs ─────────────────────────── -->
      <div v-if="availableTabs.length > 1" class="lg-props-panel__tabs">
        <button
          v-for="tab in availableTabs"
          :key="tab.key"
          class="lg-props-panel__tab"
          :class="{ 'lg-props-panel__tab--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- ── Fields for active tab ──────────────── -->
      <div class="lg-props-panel__fields">

        <!-- Unknown component (no propsSchema) -->
        <div v-if="!definition" class="lg-props-panel__unknown">
          <em class="lg-props-panel__unknown-text">
            "{{ node.type }}" is not registered in the registry.
            No properties available.
          </em>
        </div>

        <!-- No fields in this group -->
        <div v-else-if="activeFields.length === 0" class="lg-props-panel__no-fields">
          <em>No properties in this group</em>
        </div>

        <!-- Auto-generated PropEditors -->
        <PropEditor
          v-for="field in activeFields"
          :key="field.key"
          :definition="field"
          :model-value="propsValues[field.key]"
          :active-breakpoint="activeBreakpoint"
          @update:model-value="(val) => handlePropChange(field, val)"
        />

      </div>

      <!-- ── Node meta editable section ─────────── -->
      <details class="lg-props-panel__meta-section">
        <summary class="lg-props-panel__meta-summary">Node meta</summary>
        <div class="lg-props-panel__meta-fields">
          <div class="lg-props-panel__meta-field">
            <label class="lg-props-panel__meta-label">Label</label>
            <input
              type="text"
              class="lg-props-panel__meta-input"
              :value="node.meta.label ?? ''"
              placeholder="Node label…"
              @input="emit('update-meta', node!.id, { label: ($event.target as HTMLInputElement).value })"
            />
          </div>
          <div class="lg-props-panel__meta-field">
            <label class="lg-props-panel__meta-label">CSS Classes</label>
            <input
              type="text"
              class="lg-props-panel__meta-input"
              :value="(node.classes ?? []).join(' ')"
              placeholder="class1 class2…"
              @input="emit('update-classes', node!.id, ($event.target as HTMLInputElement).value.split(' ').filter(Boolean))"
            />
          </div>
        </div>
      </details>

    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ActiveBreakpoint, SchemaNode, SchemaNodeStyle } from '../types'
import type { CanvasCapabilities } from '../types/context.types'
import type { ComponentDefinition, PropDefinition } from '../types/component.types'
import PropEditor from './PropEditor.vue'

// ============================================================
// PROPS
// ============================================================

interface Props {
  /** Nó selecionado no canvas. null = painel vazio */
  node: SchemaNode | null

  /**
   * ComponentDefinition do tipo do nó.
   * Undefined se o nó não estiver registrado no registry.
   */
  definition: ComponentDefinition | undefined

  /** Breakpoint ativo para campos responsivos */
  activeBreakpoint?: ActiveBreakpoint

  /** Capacidades do builder para controlar quais ações exibir */
  capabilities: CanvasCapabilities
}

const props = withDefaults(defineProps<Props>(), {
  activeBreakpoint: 'base',
})

// ============================================================
// EMITS
// ============================================================

const emit = defineEmits<{
  /** Atualiza props do nó (shallow merge) */
  'update-props': [nodeId: string, patch: Record<string, unknown>]
  /** Atualiza estilo do nó */
  'update-style': [nodeId: string, style: Partial<SchemaNodeStyle>]
  /** Atualiza meta do nó */
  'update-meta': [nodeId: string, meta: Partial<SchemaNode['meta']>]
  /** Atualiza classes CSS do nó */
  'update-classes': [nodeId: string, classes: string[]]
  /** Deleta o nó */
  delete: [nodeId: string]
  /** Duplica o nó */
  duplicate: [nodeId: string]
  /** Move o nó para cima */
  'move-up': [nodeId: string]
  /** Move o nó para baixo */
  'move-down': [nodeId: string]
}>()

// ============================================================
// TABS
// ============================================================

const GROUP_LABELS: Record<string, string> = {
  basic:      'Basic',
  style:      'Style',
  responsive: 'Responsive',
  data:       'Data',
  advanced:   'Advanced',
}

const GROUP_ORDER = ['basic', 'style', 'responsive', 'data', 'advanced']

/** Tabs disponíveis: apenas groups que têm pelo menos um campo */
const availableTabs = computed(() => {
  if (!props.definition) return [{ key: 'basic', label: 'Basic' }]

  const groups = new Set(props.definition.propsSchema.map(f => f.group))

  return GROUP_ORDER
    .filter(g => groups.has(g as PropDefinition['group']))
    .map(g => ({ key: g, label: GROUP_LABELS[g] ?? g }))
})

const activeTab = ref<string>('basic')

// Se o nó muda e o tab ativo não existe no novo set, volta para 'basic'
watch(availableTabs, (tabs) => {
  if (!tabs.some(t => t.key === activeTab.value)) {
    activeTab.value = tabs[0]?.key ?? 'basic'
  }
})

// ============================================================
// FIELDS
// ============================================================

/** Campos do grupo ativo, ordenados por .order */
const activeFields = computed<PropDefinition[]>(() => {
  if (!props.definition) return []
  return props.definition.propsSchema
    .filter(f => f.group === activeTab.value)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
})

/** Valores atuais das props do nó */
const propsValues = computed<Record<string, unknown>>(() => props.node?.props ?? {})

// ============================================================
// PROP CHANGE HANDLER
// ============================================================

/**
 * Despacha para o emit correto dependendo do grupo da prop.
 * - group 'style' / 'responsive' → update-style
 * - demais → update-props
 */
function handlePropChange(field: PropDefinition, value: unknown) {
  if (!props.node) return

  if (field.group === 'style' || field.group === 'responsive') {
    emit('update-style', props.node.id, { [field.key]: value } as Partial<SchemaNodeStyle>)
  } else {
    emit('update-props', props.node.id, { [field.key]: value })
  }
}
</script>

<style scoped>
/* ── Root ─────────────────────────────────────────── */
.lg-props-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background: var(--lg-props-bg, #fafafa);
}

/* ── Empty ────────────────────────────────────────── */
.lg-props-panel__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px 16px;
  text-align: center;
  color: var(--lg-muted, #9ca3af);
  gap: 8px;
}

.lg-props-panel__empty-icon {
  font-size: 24px;
  opacity: 0.5;
}

.lg-props-panel__empty-text {
  font-size: 13px;
  margin: 0;
}

/* ── Header ───────────────────────────────────────── */
.lg-props-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--lg-border, #e5e7eb);
  flex-shrink: 0;
}

.lg-props-panel__header-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.lg-props-panel__type {
  font-size: 10px;
  font-family: monospace;
  color: var(--lg-accent, #3b82f6);
  background: var(--lg-accent-light, #eff6ff);
  padding: 1px 4px;
  border-radius: 3px;
  width: fit-content;
}

.lg-props-panel__node-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--lg-text, #111827);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lg-props-panel__lock {
  font-size: 14px;
  opacity: 0.7;
}

/* ── Actions ──────────────────────────────────────── */
.lg-props-panel__actions {
  display: flex;
  gap: 4px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--lg-border, #e5e7eb);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.lg-props-panel__action-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  background: #fff;
  font-size: 11px;
  cursor: pointer;
  color: var(--lg-text, #374151);
  transition: background 0.15s;
}

.lg-props-panel__action-btn:hover:not(:disabled) {
  background: var(--lg-toolbar-hover-bg, #f3f4f6);
}

.lg-props-panel__action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lg-props-panel__action-btn--danger {
  color: var(--lg-danger, #ef4444);
  border-color: var(--lg-danger-light, #fecaca);
}

.lg-props-panel__action-btn--danger:hover {
  background: var(--lg-danger-light, #fef2f2);
}

/* ── Tabs ─────────────────────────────────────────── */
.lg-props-panel__tabs {
  display: flex;
  flex-shrink: 0;
  border-bottom: 1px solid var(--lg-border, #e5e7eb);
  overflow-x: auto;
}

.lg-props-panel__tab {
  flex: 1;
  padding: 7px 4px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  font-size: 11px;
  font-weight: 500;
  color: var(--lg-muted, #9ca3af);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}

.lg-props-panel__tab:hover {
  color: var(--lg-text, #374151);
}

.lg-props-panel__tab--active {
  color: var(--lg-accent, #3b82f6);
  border-bottom-color: var(--lg-accent, #3b82f6);
}

/* ── Fields ───────────────────────────────────────── */
.lg-props-panel__fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  flex: 1;
}

.lg-props-panel__unknown,
.lg-props-panel__no-fields {
  padding: 12px;
  font-size: 12px;
  color: var(--lg-muted, #9ca3af);
  font-style: italic;
}

/* ── Node meta section ────────────────────────────── */
.lg-props-panel__meta-section {
  border-top: 1px solid var(--lg-border, #e5e7eb);
  flex-shrink: 0;
}

.lg-props-panel__meta-summary {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--lg-prop-label-color, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.lg-props-panel__meta-summary::-webkit-details-marker {
  display: none;
}

.lg-props-panel__meta-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px 12px;
}

.lg-props-panel__meta-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lg-props-panel__meta-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--lg-prop-label-color, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lg-props-panel__meta-input {
  width: 100%;
  padding: 5px 8px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.lg-props-panel__meta-input:focus {
  border-color: var(--lg-accent, #3b82f6);
  box-shadow: 0 0 0 2px var(--lg-accent-light, #dbeafe);
}
</style>
