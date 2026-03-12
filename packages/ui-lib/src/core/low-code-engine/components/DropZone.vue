<!--
  DropZone.vue — Low-Code Engine Sprint 4

  Zona de drop entre nós no canvas do editor.
  Renderizada pelo NodeRenderer entre cada par de filhos adjacentes
  e antes do primeiro / após o último filho.

  COMPORTAMENTO:
  - Estado 'idle': invisível por padrão (0 height), apenas hover detectável
  - Estado 'drag-active': expande e exibe linha de indicação quando um drag
    está em andamento no canvas pai
  - Estado 'drag-over': highlight de destino quando o drag está sobre esta zona

  POSIÇÕES:
  - position="before": zona acima do nó de referência
  - position="after":  zona abaixo do nó de referência
  - position="inside": zona ao final dos filhos de um container (container vazio)
-->
<template>
  <div
    :class="[
      'lg-drop-zone',
      `lg-drop-zone--${position}`,
      {
        'lg-drop-zone--active': dragActive,
        'lg-drop-zone--over': isOver,
      },
    ]"
    :data-drop-target-id="parentId"
    :data-drop-position="position"
    :data-drop-index="index"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div class="lg-drop-zone__line" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { InsertPosition } from '../types'
import { DRAG_DROP_KEY } from '../composables/useDragDrop'

// ============================================================
// PROPS
// ============================================================

interface Props {
  /** ID do nó pai onde o item será inserido */
  parentId: string | null

  /** Índice de inserção dentro do array de filhos do pai */
  index: number

  /** Posição relativa (visual) desta drop zone */
  position: InsertPosition

  /**
   * Se um drag está ativo no canvas (propagado pelo motor pai).
   * Quando true, a drop zone expande visualmente para facilitar o drop.
   */
  dragActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dragActive: false,
})

// ============================================================
// EMITS
// ============================================================

const emit = defineEmits<{
  /**
   * Emitido quando um drag é solto nesta zona.
   * Permite ao consumidor observar o drop sem depender do inject.
   */
  drop: [parentId: string | null, index: number, position: InsertPosition]
}>()

// ============================================================
// DRAG-DROP INJECT (fornecido por LowCodeEngine.vue via provide)
// ============================================================

const dragDrop = inject(DRAG_DROP_KEY, null)

// ============================================================
// STATE
// ============================================================

/**
 * isOver: true quando o cursor está sobre esta drop zone durante um drag.
 * Derivado do estado global de dragDrop para sincronização entre zonas.
 * Fallback para false quando dragDrop não está disponível.
 */
const isOver = computed(() => {
  if (!dragDrop) return false
  const target = dragDrop.dropTarget.value
  return (
    target !== null &&
    target.parentId === props.parentId &&
    target.index === props.index &&
    target.position === props.position
  )
})

// ============================================================
// HANDLERS
// ============================================================

function handleDragEnter(event: DragEvent) {
  if (dragDrop) {
    dragDrop.onDropZoneEnter(event, {
      parentId: props.parentId,
      index: props.index,
      position: props.position,
    })
  }
}

function handleDragOver(event: DragEvent) {
  // Necessário para permitir o drop (previne comportamento padrão)
  event.preventDefault()
}

function handleDragLeave(event: DragEvent) {
  if (dragDrop) {
    dragDrop.onDropZoneLeave(event)
  }
}

function handleDrop(event: DragEvent) {
  if (dragDrop) {
    dragDrop.onDropZoneDrop(event, {
      parentId: props.parentId,
      index: props.index,
      position: props.position,
    })
  }
  // Emit mantido para consumidores que não usam o inject
  emit('drop', props.parentId, props.index, props.position)
}
</script>

<style scoped>
.lg-drop-zone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Invisível por padrão — altura mínima para ser "dropável" */
  min-height: 4px;
  transition: min-height 0.15s ease, opacity 0.15s ease;
  opacity: 0;
  z-index: 10;
}

/* Quando um drag está ativo, a zona expande e aparece */
.lg-drop-zone--active {
  opacity: 1;
  min-height: 16px;
}

/* Hover da zona de drop */
.lg-drop-zone--over {
  opacity: 1;
  min-height: 20px;
}

/* Linha de indicação de inserção */
.lg-drop-zone__line {
  width: 100%;
  height: 2px;
  background-color: transparent;
  border-radius: 2px;
  transition: background-color 0.1s ease;
}

.lg-drop-zone--active .lg-drop-zone__line {
  background-color: color-mix(in srgb, var(--color-primary, #3b82f6) 30%, transparent);
}

.lg-drop-zone--over .lg-drop-zone__line {
  background-color: var(--color-primary, #3b82f6);
  height: 3px;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary, #3b82f6) 25%, transparent);
}
</style>
