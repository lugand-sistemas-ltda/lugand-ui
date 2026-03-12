<!--
  NodeRenderer.vue — Low-Code Engine Sprint 4
  
  Renderiza um SchemaNode (e sua sub-árvore recursivamente) usando o
  componente Vue registrado no UnifiedRegistry para node.type.

  MODO PREVIEW (previewMode = true):
  - Monta o componente real da lib com node.props + estilos aplicados
  - Passa os filhos via slot padrão (container nesting)
  - Sem handles de edição

  MODO EDITOR (previewMode = false):
  - Igual ao preview + overlay de seleção/hover
  - Emite eventos de seleção, hover para o motor
  - Handle de drag (gripper) aparece ao selecionar
  - DropZones intercaladas entre filhos (before/after cada filho)
  - DropZone 'inside' para containers vazios
  
  NOTA SOBRE SLOTS:
  Componentes com múltiplos slots nomeados (Card, AppShell) usam
  node.slots: Record<string, SchemaNode[]>. Para o Sprint 3 apenas
  o slot "default" (children) é suportado. Slots nomeados serão
  adicionados no Sprint 5 com LowCodeEngine.vue.

  RESPONSIVIDADE:
  O estilo responsivo é resolvido pelo computado `resolvedStyle` que
  mescla node.style com node.style.responsive[activeBreakpoint].
  Isso garante preview correto por breakpoint no editor.
-->
<template>
  <!-- Nó não encontrado no registry — renderiza placeholder -->
  <div
    v-if="!definition"
    :data-node-id="node.id"
    :data-node-type="node.type"
    class="lg-node-unknown"
    :style="resolvedStyle"
    :class="nodeClasses"
    @click.stop="handleClick"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
  >
    <span class="lg-node-unknown__label">[{{ node.type }}]</span>
    <template v-if="node.children.length > 0">
      <NodeRenderer
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :registry="registry"
        :selected-id="selectedId"
        :hovered-id="hoveredId"
        :preview-mode="previewMode"
        :active-breakpoint="activeBreakpoint"
        @select="(id) => emit('select', id)"
        @hover="(id) => emit('hover', id)"
      />
    </template>
  </div>

  <!-- Wrapper editável para nó leaf -->
  <div
    v-else-if="!definition.isContainer"
    class="lg-node-wrapper"
    :class="nodeClasses"
    :data-node-id="node.id"
    :data-node-type="node.type"
    :draggable="!previewMode && !node.meta.locked"
    @click.stop="handleClick"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
    @dragstart.stop="handleDragStart"
    @dragend.stop="handleDragEnd"
  >
    <!-- Handle de drag (apenas no editor, ao selecionar) -->
    <div
      v-if="!previewMode && isSelected && !node.meta.locked"
      class="lg-drag-handle"
      title="Drag to reorder"
    >
      ⠿
    </div>
    <component
      :is="definition.component"
      v-bind="boundProps"
      :style="resolvedStyle"
      :class="node.classes"
    />
  </div>

  <!-- Wrapper editável para nó container -->
  <div
    v-else
    class="lg-node-wrapper lg-node-wrapper--container"
    :class="nodeClasses"
    :data-node-id="node.id"
    :data-node-type="node.type"
    :draggable="!previewMode && !node.meta.locked"
    @click.stop="handleClick"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
    @dragstart.stop="handleDragStart"
    @dragend.stop="handleDragEnd"
  >
    <!-- Handle de drag (apenas no editor, ao selecionar) -->
    <div
      v-if="!previewMode && isSelected && !node.meta.locked"
      class="lg-drag-handle"
      title="Drag to reorder"
    >
      ⠿
    </div>

    <component
      :is="definition.component"
      v-bind="boundProps"
      :style="resolvedStyle"
      :class="node.classes"
    >
      <template #default>
        <!-- DropZone antes do primeiro filho -->
        <DropZone
          v-if="!previewMode && node.children.length > 0"
          :parent-id="node.id"
          :index="0"
          position="before"
          :drag-active="isDragging"
          @drop="handleDropZoneDrop"
        />

        <!-- Filhos recursivos intercalados com DropZones -->
        <template v-for="(child, idx) in node.children" :key="child.id">
          <NodeRenderer
            :node="child"
            :registry="registry"
            :selected-id="selectedId"
            :hovered-id="hoveredId"
            :preview-mode="previewMode"
            :active-breakpoint="activeBreakpoint"
            @select="(id) => emit('select', id)"
            @hover="(id) => emit('hover', id)"
          />
          <!-- DropZone após cada filho -->
          <DropZone
            v-if="!previewMode"
            :parent-id="node.id"
            :index="idx + 1"
            position="after"
            :drag-active="isDragging"
            @drop="handleDropZoneDrop"
          />
        </template>

        <!-- DropZone 'inside' para container vazio -->
        <DropZone
          v-if="!previewMode && node.children.length === 0"
          :parent-id="node.id"
          :index="0"
          position="inside"
          :drag-active="isDragging"
          @drop="handleDropZoneDrop"
        />
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ActiveBreakpoint, InsertPosition, SchemaNode, SchemaNodeStyle } from '../types'
import type { UnifiedRegistry } from '../registry/unified-registry'
import { DRAG_DROP_KEY } from '../composables/useDragDrop'
import DropZone from './DropZone.vue'

// ============================================================
// PROPS
// ============================================================

interface Props {
  /** O nó a ser renderizado */
  node: SchemaNode

  /** Registry de componentes — fornecido pelo motor parent */
  registry: UnifiedRegistry

  /** ID do nó selecionado no editor (null = nenhum) */
  selectedId?: string | null

  /** ID do nó com hover no editor (null = nenhum) */
  hoveredId?: string | null

  /**
   * Modo preview: true = sem handles de edição, false = modo editor.
   * @default false
   */
  previewMode?: boolean

  /**
   * Breakpoint ativo para resolução de estilos responsivos.
   * 'base' = sem override de breakpoint.
   * @default 'base'
   */
  activeBreakpoint?: ActiveBreakpoint
}

const props = withDefaults(defineProps<Props>(), {
  selectedId: null,
  hoveredId: null,
  previewMode: false,
  activeBreakpoint: 'base',
})

// ============================================================
// EMITS
// ============================================================

const emit = defineEmits<{
  /** Emitido quando o nó é clicado (seleção) */
  select: [nodeId: string]
  /** Emitido no mouseenter/mouseleave do nó */
  hover: [nodeId: string | null]
}>()

// ============================================================
// DRAG-DROP INJECT (opcional — fornecido por LowCodeEngine.vue)
// ============================================================

const dragDrop = inject(DRAG_DROP_KEY, null)

// ============================================================
// COMPUTED
// ============================================================

/** ComponentDefinition do tipo do nó, ou undefined se não registrado */
const definition = computed(() => props.registry.get(props.node.type))

/** True quando há um drag em curso (para exibir DropZones) */
const isDragging = computed(() => dragDrop?.isDragging.value ?? false)

/** Nó está selecionado no editor */
const isSelected = computed(() => props.selectedId === props.node.id)

/**
 * Props a passar ao componente Vue.
 * Remove data-* e class que passamos diretamente via :data-node-id etc.
 * Não passamos style — usamos o :style separado para poder mesclar breakpoints.
 */
const boundProps = computed(() => props.node.props)

/**
 * Estilo final resolvido:
 * - base: node.style (sem responsive)
 * - breakpoint ativo: mescla base + node.style.responsive[bp]
 *
 * CSS properties são passados como camelCase para o Vue.
 */
const resolvedStyle = computed((): Record<string, string | number | undefined> => {
  const { style } = props.node
  const { activeBreakpoint } = props

  // Base styles (sem o campo 'responsive')
  const { responsive, ...base } = style

  if (activeBreakpoint === 'base' || !responsive) {
    return styleToCSS(base)
  }

  const override = responsive[activeBreakpoint]
  if (!override) return styleToCSS(base)

  return styleToCSS({ ...base, ...override })
})

/**
 * Classes CSS para os overlays do editor (seleção, hover, locked).
 * No modo preview, nenhuma classe de editor é aplicada.
 */
const nodeClasses = computed(() => {
  if (props.previewMode) return {}

  return {
    'lg-node': true,
    'lg-node--selected': props.selectedId === props.node.id,
    'lg-node--hovered':
      props.hoveredId === props.node.id && props.selectedId !== props.node.id,
    'lg-node--locked': props.node.meta.locked === true,
    'lg-node--container': definition.value?.isContainer === true,
  }
})

// ============================================================
// HANDLERS
// ============================================================

function handleClick() {
  if (!props.previewMode) {
    emit('select', props.node.id)
  }
}

function handleMouseEnter() {
  if (!props.previewMode) {
    emit('hover', props.node.id)
  }
}

function handleMouseLeave() {
  if (!props.previewMode) {
    emit('hover', null)
  }
}

function handleDragStart(event: DragEvent) {
  dragDrop?.onNodeDragStart(event, props.node)
}

function handleDragEnd() {
  dragDrop?.onNodeDragEnd()
}

/**
 * Relay do evento drop emitido por componentes DropZone filhos.
 * Garante que o drop seja tratado mesmo sem inject de dragDrop.
 */
function handleDropZoneDrop(
  _parentId: string | null,
  _index: number,
  _position: InsertPosition,
) {
  // dragDrop.onDropZoneDrop é chamado diretamente no DropZone via inject.
  // Este handler existe para permitir que o consumidor ouça o evento via @drop.
}

// ============================================================
// STYLE HELPERS
// ============================================================

/**
 * Converte SchemaNodeStyle (sem 'responsive') para objeto CSS inline.
 * Vue aceita camelCase para inline styles.
 */
function styleToCSS(
  style: Omit<SchemaNodeStyle, 'responsive'>,
): Record<string, string | number | undefined> {
  const css: Record<string, string | number | undefined> = {}

  // Dimensões
  if (style.width !== undefined)     css.width = style.width
  if (style.height !== undefined)    css.height = style.height
  if (style.minWidth !== undefined)  css.minWidth = style.minWidth
  if (style.maxWidth !== undefined)  css.maxWidth = style.maxWidth
  if (style.minHeight !== undefined) css.minHeight = style.minHeight
  if (style.maxHeight !== undefined) css.maxHeight = style.maxHeight

  // Display / Flex
  if (style.display !== undefined)         css.display = style.display
  if (style.flexDirection !== undefined)   css.flexDirection = style.flexDirection
  if (style.flexWrap !== undefined)        css.flexWrap = style.flexWrap
  if (style.justifyContent !== undefined)  css.justifyContent = style.justifyContent
  if (style.alignItems !== undefined)      css.alignItems = style.alignItems
  if (style.gap !== undefined)             css.gap = style.gap
  if (style.flexGrow !== undefined)        css.flexGrow = style.flexGrow
  if (style.flexShrink !== undefined)      css.flexShrink = style.flexShrink
  if (style.flexBasis !== undefined)       css.flexBasis = style.flexBasis

  // Grid
  if (style.gridTemplateColumns !== undefined) css.gridTemplateColumns = style.gridTemplateColumns
  if (style.gridTemplateRows !== undefined)    css.gridTemplateRows = style.gridTemplateRows
  if (style.gridColumn !== undefined)          css.gridColumn = style.gridColumn
  if (style.gridRow !== undefined)             css.gridRow = style.gridRow

  // Espaçamento
  if (style.padding !== undefined)       css.padding = style.padding
  if (style.paddingTop !== undefined)    css.paddingTop = style.paddingTop
  if (style.paddingRight !== undefined)  css.paddingRight = style.paddingRight
  if (style.paddingBottom !== undefined) css.paddingBottom = style.paddingBottom
  if (style.paddingLeft !== undefined)   css.paddingLeft = style.paddingLeft
  if (style.margin !== undefined)        css.margin = style.margin
  if (style.marginTop !== undefined)     css.marginTop = style.marginTop
  if (style.marginRight !== undefined)   css.marginRight = style.marginRight
  if (style.marginBottom !== undefined)  css.marginBottom = style.marginBottom
  if (style.marginLeft !== undefined)    css.marginLeft = style.marginLeft

  // Visual
  if (style.background !== undefined)       css.background = style.background
  if (style.backgroundColor !== undefined)  css.backgroundColor = style.backgroundColor
  if (style.color !== undefined)            css.color = style.color
  if (style.border !== undefined)           css.border = style.border
  if (style.borderRadius !== undefined)     css.borderRadius = style.borderRadius
  if (style.boxShadow !== undefined)        css.boxShadow = style.boxShadow
  if (style.opacity !== undefined)          css.opacity = style.opacity
  if (style.overflow !== undefined)         css.overflow = style.overflow

  // Posição
  if (style.position !== undefined) css.position = style.position
  if (style.top !== undefined)      css.top = style.top
  if (style.right !== undefined)    css.right = style.right
  if (style.bottom !== undefined)   css.bottom = style.bottom
  if (style.left !== undefined)     css.left = style.left
  if (style.zIndex !== undefined)   css.zIndex = style.zIndex

  return css
}
</script>

<style scoped>
/* ==========================================================
   Editor overlays — só visíveis no modo editor (não preview)
   ========================================================== */

.lg-node {
  position: relative;
  box-sizing: border-box;
  outline: 1px solid transparent;
  outline-offset: 1px;
  transition: outline-color 0.1s ease;
}

.lg-node--hovered {
  outline-color: var(--color-primary, #3b82f6);
  outline-style: dashed;
}

.lg-node--selected {
  outline-color: var(--color-primary, #3b82f6);
  outline-style: solid;
  outline-width: 2px;
}

.lg-node--locked {
  cursor: not-allowed;
}

/* ==========================================================
   Nó desconhecido (não registrado no registry)
   ========================================================== */

.lg-node-unknown {
  border: 2px dashed var(--color-warning, #f59e0b);
  border-radius: 4px;
  padding: 8px;
  background-color: color-mix(in srgb, var(--color-warning, #f59e0b) 8%, transparent);
  min-height: 40px;
}

.lg-node-unknown__label {
  font-size: 11px;
  font-family: monospace;
  color: var(--color-warning, #f59e0b);
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

/* ==========================================================
   Drop hint para container vazio
   ========================================================== */

.lg-node-empty-drop {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  border: 2px dashed var(--color-border, #d1d5db);
  border-radius: 6px;
  color: var(--color-text-muted, #9ca3af);
  font-size: 13px;
  pointer-events: none;
}

.lg-node-empty-drop__text {
  user-select: none;
}
</style>
