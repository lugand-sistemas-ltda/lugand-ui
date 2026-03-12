/**
 * Low-Code Engine - useDragDrop
 *
 * Gerencia o estado global de drag-and-drop do canvas do editor.
 * Coordena:
 *  - Qual nó está sendo arrastado (sourceId)
 *  - Qual DropZone está ativa (dropTargetParentId + dropIndex)
 *  - Comunicação entre NodeRenderer (draggable) e DropZone (droppable)
 *  - Chamada ao useSchemaTree.moveNode / insertNode no momento do drop
 *
 * TECNOLOGIA:
 * HTML5 Drag & Drop API (nativa do browser).
 * dataTransfer carrega o payload do drag como JSON:
 *   { kind: 'move', nodeId: string }        — mover nó existente
 *   { kind: 'palette', nodeType: string }   — inserir novo nó da paleta
 *
 * ARQUITETURA:
 * Este composable é instanciado uma vez pelo LowCodeEngine.vue (Sprint 5)
 * e provido via provide/inject para NodeRenderer e DropZone.
 * Isso evita passar dezenas de props pela árvore de renderização.
 *
 * PROVIDE/INJECT KEY:
 * export const DRAG_DROP_KEY: InjectionKey<UseDragDropReturn>
 *
 * @module core/low-code-engine/composables/useDragDrop
 */

import { readonly, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import type { InsertPosition, SchemaNode } from '../types'
import type { UseSchemaTreeReturn } from './useSchemaTree'

// ============================================================
// DRAG PAYLOAD
// ============================================================

/**
 * Payload serializado no dataTransfer.
 * Discriminated union: mover nó existente | inserir da paleta.
 */
export type DragPayload =
  | {
      /** Mover um nó já existente na árvore */
      kind: 'move'
      nodeId: string
    }
  | {
      /** Inserir novo nó a partir da paleta */
      kind: 'palette'
      /** ComponentDefinition.type do componente a inserir */
      nodeType: string
    }

export const DRAG_TRANSFER_TYPE = 'application/lg-low-code'

// ============================================================
// DROP TARGET
// ============================================================

/**
 * Descreve onde o nó será inserido se o drop acontecer agora.
 */
export interface DropTarget {
  /** ID do nó pai de destino (null = root.children) */
  parentId: string | null
  /** Índice de inserção no array de filhos do pai */
  index: number
  /** Posição relativa para display na DropZone (before/after/inside) */
  position: InsertPosition
}

// ============================================================
// RETURN TYPE
// ============================================================

export interface UseDragDropReturn {
  // --- Estado reativo (readonly para consumidores) ---

  /** ID do nó sendo arrastado. null quando não há drag ativo. */
  dragSourceId: Readonly<Ref<string | null>>

  /** true enquanto um drag está em andamento no canvas */
  isDragging: Readonly<Ref<boolean>>

  /** Alvo atual do drop. null quando o cursor não está sobre uma DropZone válida. */
  dropTarget: Readonly<Ref<DropTarget | null>>

  /** Payload do drag atual (para decisão no drop handler) */
  dragPayload: Readonly<Ref<DragPayload | null>>

  // --- Handlers para NodeRenderer (nó draggable) ---

  /**
   * Chamado no @dragstart do nó.
   * Registra a fonte e serializa o payload no dataTransfer.
   */
  onNodeDragStart: (event: DragEvent, node: SchemaNode) => void

  /**
   * Chamado no @dragend do nó (drop concluído ou cancelado).
   * Limpa o estado de drag.
   */
  onNodeDragEnd: () => void

  // --- Handlers para DropZone ---

  /**
   * Chamado no @dragenter + @dragover da DropZone.
   * Registra o alvo e previne comportamento padrão do browser.
   */
  onDropZoneEnter: (
    event: DragEvent,
    target: DropTarget,
  ) => void

  /**
   * Chamado no @dragleave da DropZone.
   * Limpa o alvo atual se saiu da zona.
   */
  onDropZoneLeave: (event: DragEvent) => void

  /**
   * Chamado no @drop da DropZone.
   * Executa a operação sobre o SchemaTree e limpa o estado.
   */
  onDropZoneDrop: (
    event: DragEvent,
    target: DropTarget,
    /** Factory para criar um novo SchemaNode (usado no kind: 'palette') */
    createNode?: (nodeType: string) => Omit<SchemaNode, 'id'>,
  ) => void

  // --- Helpers para paleta ---

  /**
   * Inicia um drag de inserção da paleta.
   * Chamado no @dragstart do item da paleta (PaletteItem).
   */
  onPaletteDragStart: (event: DragEvent, nodeType: string) => void
}

// ============================================================
// INJECTION KEY
// ============================================================

/**
 * Chave de injeção para provide/inject via LowCodeEngine.vue.
 *
 * @example
 * // Em LowCodeEngine.vue:
 * provide(DRAG_DROP_KEY, dragDrop)
 *
 * // Em NodeRenderer.vue / DropZone.vue:
 * const dragDrop = inject(DRAG_DROP_KEY)
 */
export const DRAG_DROP_KEY: InjectionKey<UseDragDropReturn> =
  Symbol('lg-drag-drop')

// ============================================================
// IMPLEMENTATION
// ============================================================

/**
 * Composable que gerencia todo o drag-drop do canvas.
 *
 * @param tree - Instância do useSchemaTree para executar as operações
 *
 * @example
 * ```typescript
 * // Em LowCodeEngine.vue:
 * const engine = useSchemaTree({ initialTree: 'page' })
 * const dragDrop = useDragDrop(engine)
 * provide(DRAG_DROP_KEY, dragDrop)
 * ```
 */
export function useDragDrop(tree: UseSchemaTreeReturn): UseDragDropReturn {
  // ---- Estado ----

  const dragSourceId = ref<string | null>(null)
  const isDragging = ref(false)
  const dropTarget = ref<DropTarget | null>(null)
  const dragPayload = ref<DragPayload | null>(null)

  // ---- Helpers internos ----

  function buildPayload(payload: DragPayload): string {
    return JSON.stringify(payload)
  }

  function parsePayload(event: DragEvent): DragPayload | null {
    const raw = event.dataTransfer?.getData(DRAG_TRANSFER_TYPE)
    if (!raw) return null
    try {
      return JSON.parse(raw) as DragPayload
    } catch {
      return null
    }
  }

  function resetDragState(): void {
    isDragging.value = false
    dragSourceId.value = null
    dropTarget.value = null
    dragPayload.value = null
  }

  // ---- NodeRenderer handlers ----

  function onNodeDragStart(event: DragEvent, node: SchemaNode): void {
    if (node.meta.locked) {
      event.preventDefault()
      return
    }

    const payload: DragPayload = { kind: 'move', nodeId: node.id }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData(DRAG_TRANSFER_TYPE, buildPayload(payload))
    }

    // Atraso mínimo para o browser capturar o snapshot do elemento antes
    // de marcar o estado (evita piscar visual)
    setTimeout(() => {
      isDragging.value = true
      dragSourceId.value = node.id
      dragPayload.value = payload
    }, 0)
  }

  function onNodeDragEnd(): void {
    resetDragState()
  }

  // ---- DropZone handlers ----

  function onDropZoneEnter(event: DragEvent, target: DropTarget): void {
    // Verificar se o dataTransfer tem nosso tipo (evitar drops externos)
    if (!event.dataTransfer?.types.includes(DRAG_TRANSFER_TYPE)) return

    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
    dropTarget.value = target
  }

  function onDropZoneLeave(event: DragEvent): void {
    // relatedTarget é o elemento para onde o mouse foi.
    // Se for null (saiu da janela) ou um elemento fora da drop zone, limpar.
    const related = event.relatedTarget as Element | null
    if (!related || !related.closest?.('[data-drop-target-id]')) {
      dropTarget.value = null
    }
  }

  function onDropZoneDrop(
    event: DragEvent,
    target: DropTarget,
    createNode?: (nodeType: string) => Omit<SchemaNode, 'id'>,
  ): void {
    event.preventDefault()

    const payload = parsePayload(event)
    if (!payload) {
      resetDragState()
      return
    }

    if (payload.kind === 'move') {
      _executeMoveNode(payload.nodeId, target)
    } else if (payload.kind === 'palette') {
      _executeInsertFromPalette(payload.nodeType, target, createNode)
    }

    resetDragState()
  }

  // ---- Palette handler ----

  function onPaletteDragStart(event: DragEvent, nodeType: string): void {
    const payload: DragPayload = { kind: 'palette', nodeType }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.setData(DRAG_TRANSFER_TYPE, buildPayload(payload))
    }

    setTimeout(() => {
      isDragging.value = true
      dragPayload.value = payload
    }, 0)
  }

  // ---- Tree operations ----

  function _executeMoveNode(nodeId: string, target: DropTarget): void {
    const { parentId, index, position } = target

    if (position === 'inside') {
      // Mover para dentro de um container: parentId é o container
      if (parentId === null) return
      const result = tree.moveNode(nodeId, parentId, 'inside')
      if (!result.ok) {
        console.warn(`[useDragDrop] Move failed: ${result.error}`)
      }
      return
    }

    // before/after: precisamos do ID do irmão de referência
    // O irmão de referência é determinado pelo index dentro do pai
    const parentNode = parentId
      ? tree.findNode(parentId)
      : tree.tree.value.root

    if (!parentNode) {
      console.warn(`[useDragDrop] Parent node "${parentId}" not found`)
      return
    }

    const siblings = parentNode.children
    const referenceNode = siblings[index]

    if (!referenceNode) {
      // Nenhum irmão no index — inserir no final (append)
      // O nó de referência será o último filho ou o próprio pai (inside)
      const lastSibling = siblings[siblings.length - 1]
      if (lastSibling && lastSibling.id !== nodeId) {
        const result = tree.moveNode(nodeId, lastSibling.id, 'after')
        if (!result.ok) console.warn(`[useDragDrop] Move failed: ${result.error}`)
      } else if (parentId) {
        // Container vazio — mover para dentro
        const result = tree.moveNode(nodeId, parentId, 'inside')
        if (!result.ok) console.warn(`[useDragDrop] Move failed: ${result.error}`)
      }
      return
    }

    // O nó de referência pode ser o próprio nó sendo arrastado — ignorar
    if (referenceNode.id === nodeId) return

    const result = tree.moveNode(nodeId, referenceNode.id, position)
    if (!result.ok) {
      console.warn(`[useDragDrop] Move failed: ${result.error}`)
    }
  }

  function _executeInsertFromPalette(
    nodeType: string,
    target: DropTarget,
    createNode?: (nodeType: string) => Omit<SchemaNode, 'id'>,
  ): void {
    if (!createNode) {
      console.warn(
        `[useDragDrop] Cannot insert "${nodeType}" from palette: createNode factory not provided`,
      )
      return
    }

    const partial = createNode(nodeType)
    const { parentId, index, position } = target

    if (position === 'inside' && parentId !== null) {
      const result = tree.insertAt(partial, parentId)
      if (!result.ok) console.warn(`[useDragDrop] Insert failed: ${result.error}`)
      return
    }

    // before/after — precisamos do nó de referência
    const parentNode = parentId
      ? tree.findNode(parentId)
      : tree.tree.value.root

    if (!parentNode) {
      console.warn(`[useDragDrop] Parent "${parentId}" not found for palette insert`)
      return
    }

    const referenceNode = parentNode.children[index]

    if (!referenceNode) {
      // Append ao final do pai
      const result = tree.insertAt(partial, parentId)
      if (!result.ok) console.warn(`[useDragDrop] Insert failed: ${result.error}`)
      return
    }

    const result = tree.insertNode(partial, referenceNode.id, position)
    if (!result.ok) {
      console.warn(`[useDragDrop] Insert failed: ${result.error}`)
    }
  }

  // ---- Return ----

  return {
    dragSourceId: readonly(dragSourceId),
    isDragging: readonly(isDragging),
    dropTarget: readonly(dropTarget),
    dragPayload: readonly(dragPayload),

    onNodeDragStart,
    onNodeDragEnd,

    onDropZoneEnter,
    onDropZoneLeave,
    onDropZoneDrop,

    onPaletteDragStart,
  }
}
