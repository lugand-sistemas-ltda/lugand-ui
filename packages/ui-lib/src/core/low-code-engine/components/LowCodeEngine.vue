<!--
  LowCodeEngine.vue — Low-Code Engine Sprint 5

  Motor principal do Low-Code Engine.
  Orquestra useSchemaTree + useDragDrop e fornece o contexto via provide/inject
  para toda a sub-árvore (NodeRenderer, DropZone).

  LAYOUT:
  ┌─────────────────────────────────────────────────┐
  │  Toolbar  (undo/redo | breakpoints | save/preview) │
  ├───────────┬─────────────────────┬───────────────┤
  │  Palette  │       Canvas        │  Properties   │
  │  (aside)  │  (NodeRenderer)     │  (Sprint 6)   │
  └───────────┴─────────────────────┴───────────────┘

  PROVIDE/INJECT:
  - DRAG_DROP_KEY  → NodeRenderer e DropZone consomem automaticamente
  - ENGINE_KEY     → Slot padrão e consumidores externos podem acessar o motor

  RESPONSIVIDADE:
  O breakpoint ativo é gerenciado pelo state do useSchemaTree e passado como
  prop para o NodeRenderer, que ajusta os estilos inline do canvas.

  USO:
  ```vue
  <LowCodeEngine
    :context="formBuilderContext"
    :registry="myRegistry"
    v-model="schema"
    @save="handleSave"
  />
  ```

  MIGRAÇÃO:
  - Substitui: FormBuilderView.vue, PageBuilderView.vue (o wrapper com usePageBuilder)
  - Mantém: os componentes de UI existentes (podem ser usados nos slots)
-->
<template>
  <div class="lg-engine" :class="engineClasses">

    <!-- ── Toolbar ────────────────────────────────────── -->
    <header v-if="!isPreview" class="lg-engine__toolbar">
      <!-- Undo / Redo -->
      <div class="lg-engine__toolbar-group">
        <button
          class="lg-engine__toolbar-btn"
          :disabled="!canUndo"
          title="Undo (Ctrl+Z)"
          @click="undo"
        >
          ↩
        </button>
        <button
          class="lg-engine__toolbar-btn"
          :disabled="!canRedo"
          title="Redo (Ctrl+Shift+Z)"
          @click="redo"
        >
          ↪
        </button>
      </div>

      <!-- Breakpoint selector -->
      <div v-if="context.canvas.canUseBreakpoints" class="lg-engine__toolbar-group lg-engine__toolbar-group--breakpoints">
        <button
          v-for="bp in BREAKPOINT_LIST"
          :key="bp.key"
          class="lg-engine__toolbar-btn"
          :class="{ 'lg-engine__toolbar-btn--active': activeBreakpoint === bp.key }"
          :title="bp.label"
          @click="setBreakpoint(bp.key as ActiveBreakpoint)"
        >
          {{ bp.icon }}
        </button>
      </div>

      <!-- Extra actions from context -->
      <div v-if="context.extraToolbarActions?.length" class="lg-engine__toolbar-group">
        <button
          v-for="action in context.extraToolbarActions"
          :key="action.id"
          class="lg-engine__toolbar-btn"
          :disabled="action.disabled"
          :title="action.tooltip ?? action.label"
          @click="handleToolbarAction(action.id)"
        >
          {{ action.label }}
        </button>
      </div>

      <!-- Right: save + preview -->
      <div class="lg-engine__toolbar-group lg-engine__toolbar-group--right">
        <button class="lg-engine__toolbar-btn" title="Save" @click="handleSave">
          💾
        </button>
        <button class="lg-engine__toolbar-btn lg-engine__toolbar-btn--primary" title="Preview" @click="enterPreview">
          👁 Preview
        </button>
      </div>
    </header>

    <!-- Preview mode banner -->
    <div v-else class="lg-engine__preview-banner">
      <span class="lg-engine__preview-label">Preview</span>
      <button class="lg-engine__toolbar-btn" @click="exitPreview">
        ← Back to editor
      </button>
    </div>

    <!-- ── Body ───────────────────────────────────────── -->
    <div class="lg-engine__body">

      <!-- Palette sidebar -->
      <aside v-if="!isPreview" class="lg-engine__palette">
        <!-- Search -->
        <div class="lg-engine__palette-search">
          <input
            v-model="paletteSearch"
            type="text"
            class="lg-engine__palette-search-input"
            :placeholder="context.palette.searchPlaceholder ?? 'Search components…'"
          />
        </div>

        <!-- Groups -->
        <div class="lg-engine__palette-groups">
          <div
            v-for="group in resolvedPaletteGroups"
            :key="group.id"
            class="lg-engine__palette-group"
          >
            <!-- Group header (toggle collapse) -->
            <button
              class="lg-engine__palette-group-header"
              @click="togglePaletteGroup(group.id)"
            >
              <span class="lg-engine__palette-group-label">{{ group.label }}</span>
              <span class="lg-engine__palette-group-chevron">
                {{ collapsedGroups.has(group.id) ? '▶' : '▼' }}
              </span>
            </button>

            <!-- Items -->
            <div v-if="!collapsedGroups.has(group.id)" class="lg-engine__palette-group-items">
              <div
                v-for="item in group.items"
                :key="item.type"
                class="lg-engine__palette-item"
                draggable="true"
                :title="item.description ?? item.label"
                @dragstart="(e: DragEvent) => dragDrop.onPaletteDragStart(e, item.type)"
              >
                <span class="lg-engine__palette-item-icon">{{ item.icon }}</span>
                <span class="lg-engine__palette-item-label">{{ item.label }}</span>
              </div>

              <div v-if="group.items.length === 0" class="lg-engine__palette-empty">
                No components match
              </div>
            </div>
          </div>

          <!-- Global empty state (search returned nothing) -->
          <div v-if="resolvedPaletteGroups.length === 0" class="lg-engine__palette-empty">
            No results for "{{ paletteSearch }}"
          </div>
        </div>
      </aside>

      <!-- ── Canvas ──────────────────────────────────── -->
      <main
        class="lg-engine__canvas"
        :class="{ 'lg-engine__canvas--dragging': isDragging }"
        @click.self="selectNode(null)"
      >
        <div class="lg-engine__canvas-scroll">
          <div
            class="lg-engine__canvas-frame"
            :style="canvasFrameStyle"
            @click.self="selectNode(null)"
          >
            <NodeRenderer
              :node="tree.root"
              :registry="resolvedRegistry"
              :selected-id="selectedId"
              :hovered-id="hoveredId"
              :preview-mode="isPreview"
              :active-breakpoint="activeBreakpoint"
              @select="selectNode"
              @hover="setHovered"
            />
          </div>
        </div>
      </main>

      <!-- ── Properties panel ────────────────────────── -->
      <aside v-if="!isPreview" class="lg-engine__properties">
        <PropertiesPanel
          :node="selectedNode"
          :definition="selectedNode ? resolvedRegistry.get(selectedNode.type) : undefined"
          :active-breakpoint="activeBreakpoint"
          :capabilities="context.canvas"
          @update-props="(id, patch) => updateProps(id, patch)"
          @update-style="(id, style) => updateStyle(id, style)"
          @update-meta="(id, meta) => updateMeta(id, meta)"
          @update-classes="(id, classes) => patchNode(id, { classes })"
          @delete="handleDeleteNode"
          @duplicate="(id) => duplicateNode(id)"
          @move-up="(id) => moveUp(id)"
          @move-down="(id) => moveDown(id)"
        />
      </aside>

    </div><!-- /.lg-engine__body -->
  </div><!-- /.lg-engine -->
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import type { ActiveBreakpoint, SchemaTree } from '../types'
import type { BuilderContext, PaletteItem } from '../types/context.types'
import type { UnifiedRegistry } from '../registry/unified-registry'
import type { DataSource } from '../types/datasource.types'
import { defaultRegistry } from '../registry/unified-registry'
import { useSchemaTree } from '../composables/useSchemaTree'
import { useDragDrop, DRAG_DROP_KEY } from '../composables/useDragDrop'
import { DATA_SOURCE_KEY } from '../composables/useDataSource'
import PropertiesPanel from './PropertiesPanel.vue'
import NodeRenderer from './NodeRenderer.vue'

// ============================================================
// PROPS
// ============================================================

interface Props {
  /**
   * BuilderContext — configura paleta, capacidades do canvas e schema padrão.
   * Obrigatório: define o "modo" do motor (form / page / doc).
   */
  context: BuilderContext

  /**
   * Registry de componentes a usar.
   * @default defaultRegistry (singleton global da lib)
   */
  registry?: UnifiedRegistry

  /**
   * Schema inicial (v-model).
   * Quando omitido, usa context.defaultSchema() para criar um schema vazio.
   */
  modelValue?: SchemaTree

  /**
   * Se true, não permite edição (equivale a previewMode inicial = true).
   * @default false
   */
  readOnly?: boolean

  /**
   * DataSources disponíveis para vinculação de dados nos componentes.
   * Injetados automaticamente em DataBindingEditor via DATA_SOURCE_KEY.
   * @default []
   */
  dataSources?: DataSource[]
}

const props = withDefaults(defineProps<Props>(), {
  registry: undefined,
  modelValue: undefined,
  readOnly: false,
  dataSources: undefined,
})

// ============================================================
// EMITS
// ============================================================

const emit = defineEmits<{
  /** v-model: emitido toda vez que o schema muda */
  'update:modelValue': [tree: SchemaTree]
  /** Emitido quando o usuário clica em "Save" na toolbar */
  save: [tree: SchemaTree]
  /** Emitido quando a ação extra da toolbar é clicada */
  'toolbar-action': [actionId: string, tree: SchemaTree]
}>()

// ============================================================
// REGISTRY
// ============================================================

/** Registry efetivo (prop ou singleton global) */
const resolvedRegistry = computed<UnifiedRegistry>(
  () => props.registry ?? defaultRegistry,
)

// ============================================================
// SCHEMA TREE
// ============================================================

const schemaTree = useSchemaTree({
  initialTree: props.modelValue ?? props.context.defaultSchema(),
})

const {
  tree,
  state,
  selectedNode,
  canUndo,
  canRedo,
  undo,
  redo,
  selectNode: _selectNode,
  setBreakpoint,
  removeNode,
  duplicateNode,
  moveUp,
  moveDown,
  importTree,
  updateProps,
  updateStyle,
  updateMeta,
  patchNode,
} = schemaTree

// Sync prop modelValue → tree (quando o pai troca o schema externamente)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal !== tree.value) {
      importTree(newVal)
    }
  },
)

// Sync tree → emit update:modelValue
watch(
  tree,
  (newTree) => {
    emit('update:modelValue', newTree)
  },
  { deep: true },
)

// ============================================================
// DRAG & DROP
// ============================================================

const dragDrop = useDragDrop(schemaTree)

// Provide para NodeRenderer e DropZone consumirem via inject
provide(DRAG_DROP_KEY, dragDrop)

// Sprint 8: Provide DataSources para DataBindingEditor via inject
provide(DATA_SOURCE_KEY, computed(() => props.dataSources ?? []))

const isDragging = computed(() => dragDrop.isDragging.value)

// ============================================================
// EDITOR STATE (derived from schemaTree.state)
// ============================================================

const selectedId = computed(() => state.value.selectedNodeId)
const hoveredId  = computed(() => state.value.hoveredNodeId)
const activeBreakpoint = computed(() => state.value.activeBreakpoint)

/** Flag de preview — pode vir da prop readOnly ou ser toggled internamente */
const isPreview = ref(props.readOnly)

function enterPreview() { isPreview.value = true  }
function exitPreview()  { isPreview.value = false }

// ============================================================
// ACTIONS
// ============================================================

function selectNode(id: string | null) {
  _selectNode(id)
}

function setHovered(id: string | null) {
  state.value.hoveredNodeId = id
}

function handleDeleteNode(id: string) {
  const node = schemaTree.findNode(id)
  if (!node || node.meta.locked) return
  removeNode(id)
  if (state.value.selectedNodeId === id) selectNode(null)
}

function handleSave() {
  emit('save', tree.value)
}

function handleToolbarAction(actionId: string) {
  emit('toolbar-action', actionId, tree.value)
}

// ============================================================
// BREAKPOINT LIST (para botões de viewport na toolbar)
// ============================================================

const BREAKPOINT_LIST = [
  { key: 'base', icon: '🖥',  label: 'Desktop (base)'  },
  { key: 'lg',   icon: '💻',  label: 'Laptop (lg)'     },
  { key: 'md',   icon: '📱',  label: 'Tablet (md)'     },
  { key: 'sm',   icon: '📲',  label: 'Mobile (sm)'     },
] as const

/** Largura do canvas frame por breakpoint, para simular viewport no editor */
const CANVAS_WIDTHS: Record<string, string> = {
  base: '100%',
  xl:   '1280px',
  lg:   '1024px',
  md:   '768px',
  sm:   '375px',
}

const canvasFrameStyle = computed(() => ({
  width: CANVAS_WIDTHS[activeBreakpoint.value] ?? '100%',
}))

// ============================================================
// PALETTE
// ============================================================

const paletteSearch = ref('')

/** Grupos com estado de collapse. Inicialmente colapsados os que têm collapsed: true */
const collapsedGroups = ref<Set<string>>(
  new Set(
    props.context.palette.groups
      .filter(g => g.collapsed)
      .map(g => g.id),
  ),
)

function togglePaletteGroup(groupId: string) {
  if (collapsedGroups.value.has(groupId)) {
    collapsedGroups.value.delete(groupId)
  } else {
    collapsedGroups.value.add(groupId)
  }
}

/**
 * Resolve os grupos da paleta com seus itens filtrados do registry.
 * Aplica: category filter → include/exclude → paletteSearch.
 */
const resolvedPaletteGroups = computed(() => {
  const reg = resolvedRegistry.value
  const query = paletteSearch.value.toLowerCase().trim()

  const sorted = [...props.context.palette.groups].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999),
  )

  return sorted.flatMap(group => {
    // 1. Get all components for this context, then filter by the group's categories
    const allForContext = reg.listByContext(props.context.type)
    let pool = allForContext.filter(def =>
      group.categories.length === 0 || group.categories.includes(def.category),
    )
    if (group.include?.length) {
      const extra = group.include
        .map(t => reg.get(t))
        .filter((d): d is NonNullable<typeof d> => d !== undefined)
      const extraTypes = new Set(extra.map(d => d.type))
      const existing = pool.filter(d => !extraTypes.has(d.type))
      pool = [...existing, ...extra]
    }
    if (group.exclude?.length) {
      const excSet = new Set(group.exclude)
      pool = pool.filter(d => !excSet.has(d.type))
    }

    // 3. Aplicar busca de texto
    if (query) {
      pool = pool.filter(def =>
        def.type.toLowerCase().includes(query) ||
        def.label.toLowerCase().includes(query) ||
        (def.description?.toLowerCase().includes(query) ?? false),
      )
    }

    // 4. Mapear para PaletteItem
    const items: PaletteItem[] = pool.map(def => ({
      type: def.type,
      label: def.label,
      icon: def.icon,
      description: def.description,
      category: def.category,
      isContainer: def.isContainer,
    }))

    // Omitir grupo se busca ativa e sem resultados
    if (query && items.length === 0) return []

    return [{ ...group, items }]
  })
})

// ============================================================
// ENGINE CLASSES
// ============================================================

const engineClasses = computed(() => ({
  'lg-engine--preview': isPreview.value,
  'lg-engine--dragging': isDragging.value,
  [`lg-engine--context-${props.context.type}`]: true,
}))
</script>

<style scoped>
/* ── Root layout ─────────────────────────────────────── */
.lg-engine {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--lg-engine-bg, #f5f5f5);
  font-family: var(--lg-engine-font, inherit);
  overflow: hidden;
}

/* ── Toolbar ─────────────────────────────────────────── */
.lg-engine__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 44px;
  flex-shrink: 0;
  background: var(--lg-toolbar-bg, #ffffff);
  border-bottom: 1px solid var(--lg-toolbar-border, #e5e7eb);
}

.lg-engine__toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.lg-engine__toolbar-group--right {
  margin-left: auto;
}

.lg-engine__toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  color: var(--lg-toolbar-color, #374151);
  transition: background 0.15s, border-color 0.15s;
}

.lg-engine__toolbar-btn:hover:not(:disabled) {
  background: var(--lg-toolbar-hover-bg, #f3f4f6);
  border-color: var(--lg-toolbar-hover-border, #d1d5db);
}

.lg-engine__toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lg-engine__toolbar-btn--active {
  background: var(--lg-accent-light, #eff6ff);
  border-color: var(--lg-accent, #3b82f6);
  color: var(--lg-accent, #3b82f6);
}

.lg-engine__toolbar-btn--primary {
  background: var(--lg-accent, #3b82f6);
  color: #fff;
  border-color: transparent;
}

.lg-engine__toolbar-btn--primary:hover:not(:disabled) {
  background: var(--lg-accent-hover, #2563eb);
}

/* ── Preview banner ──────────────────────────────────── */
.lg-engine__preview-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px;
  background: var(--lg-accent, #3b82f6);
  color: #fff;
  font-size: 13px;
  flex-shrink: 0;
}

.lg-engine__preview-label {
  font-weight: 600;
}

/* ── Body (3-column grid) ────────────────────────────── */
.lg-engine__body {
  display: grid;
  grid-template-columns: 240px 1fr 260px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.lg-engine--preview .lg-engine__body {
  grid-template-columns: 1fr;
}

/* ── Palette ─────────────────────────────────────────── */
.lg-engine__palette {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--lg-border, #e5e7eb);
  background: var(--lg-palette-bg, #fafafa);
}

.lg-engine__palette-search {
  padding: 8px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--lg-border, #e5e7eb);
}

.lg-engine__palette-search-input {
  width: 100%;
  padding: 5px 8px;
  border: 1px solid var(--lg-border, #d1d5db);
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.lg-engine__palette-search-input:focus {
  border-color: var(--lg-accent, #3b82f6);
  box-shadow: 0 0 0 2px var(--lg-accent-light, #dbeafe);
}

.lg-engine__palette-groups {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 8px;
}

.lg-engine__palette-group {
  border-bottom: 1px solid var(--lg-border, #e5e7eb);
}

.lg-engine__palette-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--lg-palette-group-color, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
}

.lg-engine__palette-group-header:hover {
  background: var(--lg-toolbar-hover-bg, #f3f4f6);
}

.lg-engine__palette-group-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px 8px 8px;
}

.lg-engine__palette-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  border: 1px solid var(--lg-border, #e5e7eb);
  border-radius: 6px;
  background: #fff;
  cursor: grab;
  font-size: 11px;
  text-align: center;
  transition: border-color 0.15s, box-shadow 0.15s;
  user-select: none;
}

.lg-engine__palette-item:hover {
  border-color: var(--lg-accent, #3b82f6);
  box-shadow: 0 0 0 2px var(--lg-accent-light, #dbeafe);
}

.lg-engine__palette-item:active {
  cursor: grabbing;
}

.lg-engine__palette-item-icon {
  font-size: 18px;
  line-height: 1;
}

.lg-engine__palette-item-label {
  color: var(--lg-palette-item-color, #374151);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}

.lg-engine__palette-empty {
  padding: 8px 12px;
  font-size: 12px;
  color: var(--lg-muted, #9ca3af);
  font-style: italic;
}

/* ── Canvas ──────────────────────────────────────────── */
.lg-engine__canvas {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--lg-canvas-bg, #e5e7eb);
  position: relative;
}

.lg-engine__canvas--dragging {
  cursor: grabbing;
}

.lg-engine__canvas-scroll {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 24px;
}

.lg-engine__canvas-frame {
  background: var(--lg-canvas-frame-bg, #ffffff);
  min-height: 400px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.08);
  border-radius: 4px;
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;
}

/* ── Properties panel ────────────────────────────────── */
.lg-engine__properties {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--lg-border, #e5e7eb);
  background: var(--lg-props-bg, #fafafa);
  overflow-y: auto;
}
</style>
