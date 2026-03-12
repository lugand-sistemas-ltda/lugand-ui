/**
 * Low-Code Engine - useSchemaTree
 *
 * Composable central do motor low-code.
 * Gerencia o estado reativo de um SchemaTree e expõe todas as
 * operações CRUD sobre a árvore de nós, com undo/redo.
 *
 * SPRINT 1: Implementação das operações de árvore (sem UI).
 *
 * RELAÇÃO COM O PASSADO:
 * - Substitui useSchemaBuilder (que operava numa lista plana BaseSchema.items[])
 * - Usa os mesmos padrões de history.ts (reaproveitado)
 * - Inspirado no findWidgetById recursivo de usePageBuilder, mas generalizado
 *
 * @module core/low-code-engine/composables/useSchemaTree
 */

import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { useSchemaHistory } from '@/core/schema-builder/history'
import type {
  ActiveBreakpoint,
  InsertPosition,
  NodePath,
  SchemaBreakpoints,
  SchemaEditorState,
  SchemaMetadata,
  SchemaNode,
  SchemaNodeStyle,
  SchemaTree,
  SchemaTreeResult,
} from '../types'
import { DEFAULT_BREAKPOINTS } from '../types'

// ============================================================
// INTERNAL PURE HELPERS (exportados para testes unitários)
// ============================================================

/**
 * Gera um ID único para um SchemaNode.
 * Usa crypto.randomUUID() quando disponível (browsers modernos + Node 19+),
 * com fallback para timestamp + random.
 */
export function generateNodeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Cria um nó de schema com ID gerado automaticamente.
 *
 * @param partial - Campos do nó (sem id). children padrão = [].
 */
export function createNode(partial: Omit<SchemaNode, 'id'>): SchemaNode {
  return { ...partial, id: generateNodeId() }
}

/**
 * Cria um SchemaTree mínimo/vazio para um dado contexto.
 * Útil para inicializar um builder zerado.
 */
export function createEmptyTree(
  context: SchemaTree['context'] = 'page',
  metadata?: Partial<SchemaMetadata>,
): SchemaTree {
  return {
    version: '2.0',
    context,
    root: {
      id: generateNodeId(),
      type: `${context}-root`,
      props: {},
      style: {},
      children: [],
      meta: { label: 'Root', locked: true, droppable: true, draggable: false, accepts: 'all' },
    },
    breakpoints: { ...DEFAULT_BREAKPOINTS },
    metadata: {
      name: `New ${context}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...metadata,
    },
  }
}

/**
 * Busca um nó na árvore por ID — recursivo, depth-first.
 * Retorna null se não encontrado.
 *
 * @param root - Nó raiz onde iniciar a busca
 * @param id - ID do nó a buscar
 */
export function findNode(root: SchemaNode, id: string): SchemaNode | null {
  if (root.id === id) return root
  for (const child of root.children) {
    const found = findNode(child, id)
    if (found) return found
  }
  if (root.slots) {
    for (const slotChildren of Object.values(root.slots)) {
      for (const slotChild of slotChildren) {
        const found = findNode(slotChild, id)
        if (found) return found
      }
    }
  }
  return null
}

/**
 * Busca o pai direto de um nó por ID.
 * Retorna null se o nó é o root ou não está na árvore.
 */
export function findParent(root: SchemaNode, targetId: string): SchemaNode | null {
  for (const child of root.children) {
    if (child.id === targetId) return root
    const found = findParent(child, targetId)
    if (found) return found
  }
  if (root.slots) {
    for (const [, slotChildren] of Object.entries(root.slots)) {
      for (const slotChild of slotChildren) {
        if (slotChild.id === targetId) return root
        const found = findParent(slotChild, targetId)
        if (found) return found
      }
    }
  }
  return null
}

/**
 * Obtém o caminho do root até um nó como array de IDs.
 * @returns [] se não encontrado, ou array terminando com o id do nó.
 */
export function getNodePath(root: SchemaNode, targetId: string): NodePath {
  function traverse(node: SchemaNode, path: string[]): string[] | null {
    const current = [...path, node.id]
    if (node.id === targetId) return current
    for (const child of node.children) {
      const result = traverse(child, current)
      if (result) return result
    }
    if (node.slots) {
      for (const slotChildren of Object.values(node.slots)) {
        for (const slotChild of slotChildren) {
          const result = traverse(slotChild, current)
          if (result) return result
        }
      }
    }
    return null
  }
  return traverse(root, []) ?? []
}

/**
 * Verifica se `ancestorId` é antepassado de `descendantId` na árvore.
 * Impede que um nó seja movido para dentro de si mesmo.
 */
export function isAncestor(
  root: SchemaNode,
  ancestorId: string,
  descendantId: string,
): boolean {
  const ancestorNode = findNode(root, ancestorId)
  if (!ancestorNode) return false
  return findNode(ancestorNode, descendantId) !== null
}

/**
 * Retorna todos os nós da árvore em ordem depth-first (preorder).
 * Útil para selects de seleção de nó, contagem, etc.
 */
export function flattenTree(root: SchemaNode): SchemaNode[] {
  const result: SchemaNode[] = []
  function traverse(node: SchemaNode) {
    result.push(node)
    for (const child of node.children) traverse(child)
    if (node.slots) {
      for (const slotChildren of Object.values(node.slots)) {
        for (const slotChild of slotChildren) traverse(slotChild)
      }
    }
  }
  traverse(root)
  return result
}

/**
 * Profundidade máxima da árvore (root = 0).
 */
export function getTreeDepth(root: SchemaNode): number {
  if (root.children.length === 0) return 0
  return 1 + Math.max(...root.children.map(getTreeDepth))
}

/**
 * Deep clone de um SchemaNode usando structuredClone (ou fallback JSON).
 * Garante que a cópia não compartilha referências com o original.
 */
export function cloneNode(node: SchemaNode): SchemaNode {
  if (typeof structuredClone === 'function') return structuredClone(node)
  return JSON.parse(JSON.stringify(node))
}

/**
 * Regera IDs de todos os nós de uma sub-árvore.
 * Usado ao duplicar para garantir unicidade de IDs.
 */
export function regenerateIds(node: SchemaNode): SchemaNode {
  const cloned = cloneNode(node)
  function regenRecursive(n: SchemaNode): void {
    n.id = generateNodeId()
    for (const child of n.children) regenRecursive(child)
    if (n.slots) {
      for (const slotChildren of Object.values(n.slots)) {
        for (const slotChild of slotChildren) regenRecursive(slotChild)
      }
    }
  }
  regenRecursive(cloned)
  return cloned
}

// ============================================================
// RESULTADO HELPERS
// ============================================================

function ok<T>(value: T): SchemaTreeResult<T> {
  return { ok: true, value }
}

function fail(error: string): SchemaTreeResult<never> {
  return { ok: false, error }
}

// ============================================================
// OPTIONS
// ============================================================

export interface UseSchemaTreeOptions {
  /**
   * Schema inicial.
   * - Pode ser um SchemaTree completo (ao carregar dados existentes)
   * - Pode ser um BuilderContextType (cria schema vazio para o contexto)
   * - Se omitido, cria schema vazio de tipo 'page'
   */
  initialTree?: SchemaTree | SchemaTree['context']

  /** Habilitar undo/redo (padrão: true) */
  enableHistory?: boolean

  /** Máximo de estados no histórico (padrão: 50) */
  historySize?: number

  /** Delay de debounce do histórico em ms (padrão: 300) */
  historyDebounce?: number
}

// ============================================================
// RETURN TYPE
// ============================================================

export interface UseSchemaTreeReturn {
  // --- Estado reativo ---

  /** O schema reativo. Readonly para evitar mutações diretas externas. */
  tree: Readonly<Ref<SchemaTree>>

  /** Estado do editor (seleção, hover, breakpoint ativo) */
  state: Ref<SchemaEditorState>

  // --- Computed ---

  /** Current selected node (or null) */
  selectedNode: Ref<SchemaNode | null>

  /** All nodes in depth-first order (flat) */
  allNodes: Ref<SchemaNode[]>

  /** Maximum depth of the tree */
  treeDepth: Ref<number>

  // --- Busca ---

  /** Busca um nó por ID */
  findNode: (id: string) => SchemaNode | null

  /** Busca o pai de um nó por ID */
  findParent: (id: string) => SchemaNode | null

  /** Retorna o caminho do root até o nó */
  getPath: (id: string) => NodePath

  // --- Seleção / UI ---

  /** Seleciona um nó no editor */
  selectNode: (id: string | null) => void

  /** Muda o breakpoint ativo no editor */
  setBreakpoint: (bp: ActiveBreakpoint) => void

  // --- Insert ---

  /**
   * Insere um novo nó em relação a um nó de referência.
   *
   * @param partial - Dados do nó a criar (sem id)
   * @param referenceId - ID do nó de referência
   * @param position - 'inside' (filho), 'before' (irmão anterior), 'after' (irmão seguinte)
   */
  insertNode: (
    partial: Omit<SchemaNode, 'id'>,
    referenceId: string,
    position: InsertPosition,
  ) => SchemaTreeResult<SchemaNode>

  /**
   * Insere um novo nó em uma posição específica do array de filhos.
   *
   * @param partial - Dados do nó a criar (sem id)
   * @param parentId - ID do pai (null = root.children)
   * @param index - Índice de inserção (append se omitido)
   */
  insertAt: (
    partial: Omit<SchemaNode, 'id'>,
    parentId: string | null,
    index?: number,
  ) => SchemaTreeResult<SchemaNode>

  // --- Update ---

  /**
   * Atualiza props de um nó (merge shallow).
   * Não afeta style, children ou meta.
   */
  updateProps: (
    id: string,
    props: Record<string, any>,
  ) => SchemaTreeResult

  /**
   * Atualiza o estilo de um nó.
   *
   * @param id - ID do nó
   * @param style - Estilos a aplicar (merge)
   * @param breakpoint - Se fornecido, aplica no responsive[breakpoint]
   */
  updateStyle: (
    id: string,
    style: Partial<SchemaNodeStyle>,
    breakpoint?: Exclude<ActiveBreakpoint, 'base'>,
  ) => SchemaTreeResult

  /**
   * Atualiza metadados do nó (label, locked, etc.).
   */
  updateMeta: (
    id: string,
    meta: Partial<SchemaNode['meta']>,
  ) => SchemaTreeResult

  /**
   * Atualiza campos gerais do nó (patch genérico).
   * Não permite alterar id, type ou children diretamente.
   */
  patchNode: (
    id: string,
    patch: Partial<Omit<SchemaNode, 'id' | 'type' | 'children'>>,
  ) => SchemaTreeResult

  // --- Remove ---

  /**
   * Remove um nó e todos os seus filhos.
   * O nó root nunca pode ser removido.
   */
  removeNode: (id: string) => SchemaTreeResult<SchemaNode>

  // --- Move / Reorder ---

  /**
   * Move um nó para uma nova posição em relação a outro nó.
   * Impede mover um nó para dentro de si mesmo.
   *
   * @param nodeId - ID do nó a mover
   * @param referenceId - ID do nó de referência
   * @param position - 'inside' | 'before' | 'after'
   */
  moveNode: (
    nodeId: string,
    referenceId: string,
    position: InsertPosition,
  ) => SchemaTreeResult

  /**
   * Move um nó para cima entre seus irmãos.
   */
  moveUp: (id: string) => SchemaTreeResult

  /**
   * Move um nó para baixo entre seus irmãos.
   */
  moveDown: (id: string) => SchemaTreeResult

  // --- Duplicate ---

  /**
   * Duplica um nó (e toda sua sub-árvore) inserindo-o após o original.
   * Todos os IDs da cópia são regenerados.
   */
  duplicateNode: (id: string) => SchemaTreeResult<SchemaNode>

  // --- Tree-level ---

  /**
   * Atualiza os metadados do schema (nome, tags, status).
   */
  updateMetadata: (
    meta: Partial<SchemaMetadata>,
  ) => void

  /**
   * Atualiza os breakpoints do schema.
   */
  updateBreakpoints: (bp: Partial<SchemaBreakpoints>) => void

  /**
   * Reseta o schema para um estado vazio (preserva contexto e breakpoints).
   */
  resetTree: () => void

  /**
   * Substitui o schema inteiro (ex: ao carregar dados do backend).
   */
  importTree: (tree: SchemaTree) => void

  /**
   * Retorna um snapshot do schema atual (deep clone).
   */
  exportTree: () => SchemaTree

  // --- History ---

  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  undo: () => void
  redo: () => void
}

// ============================================================
// COMPOSABLE IMPLEMENTATION
// ============================================================

/**
 * Composable central do motor low-code.
 *
 * Gerencia um SchemaTree reativo com operações CRUD completas sobre
 * a árvore de nós, seleção no editor, breakpoints e undo/redo.
 *
 * @example
 * ```typescript
 * // Inicializar com schema vazio (page):
 * const engine = useSchemaTree({ initialTree: 'page' })
 *
 * // Inicializar com schema salvo:
 * const engine = useSchemaTree({ initialTree: savedSchema })
 *
 * // Inserir um botão dentro de um container:
 * engine.insertNode(
 *   { type: 'button', props: { label: 'Click me' }, style: {}, children: [], meta: {} },
 *   containerId,
 *   'inside'
 * )
 *
 * // Desfazer:
 * engine.undo()
 * ```
 */
export function useSchemaTree(
  options: UseSchemaTreeOptions = {},
): UseSchemaTreeReturn {
  const {
    initialTree = 'page',
    enableHistory = true,
    historySize = 50,
    historyDebounce = 300,
  } = options

  // ---- Estado interno ----

  const tree: Ref<SchemaTree> = ref(
    typeof initialTree === 'string'
      ? createEmptyTree(initialTree)
      : (JSON.parse(JSON.stringify(initialTree)) as SchemaTree),
  )

  const state: Ref<SchemaEditorState> = ref({
    selectedNodeId: null,
    hoveredNodeId: null,
    activeBreakpoint: 'base',
    paletteVisible: true,
    propertiesVisible: true,
    previewMode: false,
    isDragging: false,
    dragSourceId: null,
    dropTargetId: null,
    dropPosition: null,
  })

  // ---- History (reusa o existente de schema-builder) ----

  const history = enableHistory
    ? useSchemaHistory(tree, { maxSize: historySize, debounceDelay: historyDebounce })
    : null

  // ---- Computed ----

  const selectedNode = computed<SchemaNode | null>(() => {
    const id = state.value.selectedNodeId
    if (!id) return null
    return findNode(tree.value.root, id)
  })

  const allNodes = computed(() => flattenTree(tree.value.root))

  const treeDepth = computed(() => getTreeDepth(tree.value.root))

  // ---- Helpers internos ----

  function touchUpdatedAt(): void {
    tree.value.metadata.updatedAt = new Date().toISOString()
  }

  // ---- Seleção / UI ----

  function selectNode(id: string | null): void {
    state.value.selectedNodeId = id
  }

  function setBreakpoint(bp: ActiveBreakpoint): void {
    state.value.activeBreakpoint = bp
  }

  // ---- Busca ----

  function _findNode(id: string): SchemaNode | null {
    return findNode(tree.value.root, id)
  }

  function _findParent(id: string): SchemaNode | null {
    return findParent(tree.value.root, id)
  }

  function getPath(id: string): NodePath {
    return getNodePath(tree.value.root, id)
  }

  // ---- Insert ----

  function insertAt(
    partial: Omit<SchemaNode, 'id'>,
    parentId: string | null,
    index?: number,
  ): SchemaTreeResult<SchemaNode> {
    const node = createNode(partial)

    const parent =
      parentId === null ? tree.value.root : findNode(tree.value.root, parentId)

    if (!parent) {
      return fail(`Parent node "${parentId}" not found`)
    }

    const i = index ?? parent.children.length
    parent.children.splice(i, 0, node)
    touchUpdatedAt()
    return ok(node)
  }

  function insertNode(
    partial: Omit<SchemaNode, 'id'>,
    referenceId: string,
    position: InsertPosition,
  ): SchemaTreeResult<SchemaNode> {
    const reference = findNode(tree.value.root, referenceId)
    if (!reference) {
      return fail(`Reference node "${referenceId}" not found`)
    }

    if (position === 'inside') {
      return insertAt(partial, referenceId)
    }

    // 'before' or 'after' — needs parent
    const parent = findParent(tree.value.root, referenceId)
    if (!parent) {
      return fail(`Cannot insert ${position} root node`)
    }

    const siblingIndex = parent.children.findIndex(c => c.id === referenceId)
    if (siblingIndex === -1) {
      return fail(`Node "${referenceId}" not found in parent's children`)
    }

    const targetIndex = position === 'before' ? siblingIndex : siblingIndex + 1
    return insertAt(partial, parent.id, targetIndex)
  }

  // ---- Update ----

  function updateProps(
    id: string,
    props: Record<string, any>,
  ): SchemaTreeResult {
    const node = findNode(tree.value.root, id)
    if (!node) return fail(`Node "${id}" not found`)
    node.props = { ...node.props, ...props }
    touchUpdatedAt()
    return ok(undefined)
  }

  function updateStyle(
    id: string,
    style: Partial<SchemaNodeStyle>,
    breakpoint?: Exclude<ActiveBreakpoint, 'base'>,
  ): SchemaTreeResult {
    const node = findNode(tree.value.root, id)
    if (!node) return fail(`Node "${id}" not found`)

    if (breakpoint) {
      if (!node.style.responsive) node.style.responsive = {}
      node.style.responsive[breakpoint] = {
        ...node.style.responsive[breakpoint],
        ...style,
      }
    } else {
      node.style = { ...node.style, ...style }
    }

    touchUpdatedAt()
    return ok(undefined)
  }

  function updateMeta(
    id: string,
    meta: Partial<SchemaNode['meta']>,
  ): SchemaTreeResult {
    const node = findNode(tree.value.root, id)
    if (!node) return fail(`Node "${id}" not found`)
    node.meta = { ...node.meta, ...meta }
    return ok(undefined)
  }

  function patchNode(
    id: string,
    patch: Partial<Omit<SchemaNode, 'id' | 'type' | 'children'>>,
  ): SchemaTreeResult {
    const node = findNode(tree.value.root, id)
    if (!node) return fail(`Node "${id}" not found`)
    if (patch.props !== undefined) node.props = { ...node.props, ...patch.props }
    if (patch.style !== undefined) node.style = { ...node.style, ...patch.style }
    if (patch.meta !== undefined) node.meta = { ...node.meta, ...patch.meta }
    if (patch.classes !== undefined) node.classes = patch.classes
    if (patch.slots !== undefined) node.slots = patch.slots
    touchUpdatedAt()
    return ok(undefined)
  }

  // ---- Remove ----

  function removeNode(id: string): SchemaTreeResult<SchemaNode> {
    if (id === tree.value.root.id) {
      return fail('Cannot remove root node')
    }

    const parent = findParent(tree.value.root, id)
    if (!parent) return fail(`Node "${id}" not found or has no parent`)

    const idx = parent.children.findIndex(c => c.id === id)
    if (idx === -1) return fail(`Node "${id}" not found in parent's children`)

    const [removed] = parent.children.splice(idx, 1)

    // Deselect if removed
    if (state.value.selectedNodeId === id) {
      state.value.selectedNodeId = null
    }

    touchUpdatedAt()
    return ok(removed!)
  }

  // ---- Move ----

  function _movePrepared(
    node: SchemaNode,
    referenceId: string,
    position: InsertPosition,
  ): SchemaTreeResult {
    const reference = findNode(tree.value.root, referenceId)
    if (!reference) return fail(`Reference node "${referenceId}" not found`)

    if (position === 'inside') {
      reference.children.push(node)
      touchUpdatedAt()
      return ok(undefined)
    }

    const parent = findParent(tree.value.root, referenceId)
    if (!parent) return fail(`Cannot insert ${position} root node`)

    const siblingIndex = parent.children.findIndex(c => c.id === referenceId)
    if (siblingIndex === -1) return fail(`Sibling "${referenceId}" not found`)

    const targetIndex = position === 'before' ? siblingIndex : siblingIndex + 1
    parent.children.splice(targetIndex, 0, node)
    touchUpdatedAt()
    return ok(undefined)
  }

  function moveNode(
    nodeId: string,
    referenceId: string,
    position: InsertPosition,
  ): SchemaTreeResult {
    if (nodeId === referenceId) {
      return fail('Cannot move a node to itself')
    }

    if (position === 'inside' && isAncestor(tree.value.root, nodeId, referenceId)) {
      return fail('Cannot move a node inside its own descendant')
    }

    // Extract the original node object
    const parent = findParent(tree.value.root, nodeId)
    if (!parent) return fail(`Node "${nodeId}" not found or is root`)

    const idx = parent.children.findIndex(c => c.id === nodeId)
    if (idx === -1) return fail(`Node "${nodeId}" not found in parent's children`)

    const [node] = parent.children.splice(idx, 1)

    // Clear selection temporarily
    const wasSelected = state.value.selectedNodeId === nodeId

    const result = _movePrepared(node!, referenceId, position)
    if (!result.ok) {
      // Rollback: restore to original parent
      parent.children.splice(idx, 0, node!)
    } else if (wasSelected) {
      state.value.selectedNodeId = nodeId
    }

    return result
  }

  function moveUp(id: string): SchemaTreeResult {
    const parent = findParent(tree.value.root, id)
    if (!parent) return fail(`Node "${id}" not found or is root`)

    const idx = parent.children.findIndex(c => c.id === id)
    if (idx === -1) return fail(`Node "${id}" not found in parent's children`)
    if (idx === 0) return fail('Node is already first')

    const node = parent.children.splice(idx, 1)[0]!
    parent.children.splice(idx - 1, 0, node)
    touchUpdatedAt()
    return ok(undefined)
  }

  function moveDown(id: string): SchemaTreeResult {
    const parent = findParent(tree.value.root, id)
    if (!parent) return fail(`Node "${id}" not found or is root`)

    const idx = parent.children.findIndex(c => c.id === id)
    if (idx === -1) return fail(`Node "${id}" not found in parent's children`)
    if (idx >= parent.children.length - 1) return fail('Node is already last')

    const node = parent.children.splice(idx, 1)[0]!
    parent.children.splice(idx + 1, 0, node)
    touchUpdatedAt()
    return ok(undefined)
  }

  // ---- Duplicate ----

  function duplicateNode(id: string): SchemaTreeResult<SchemaNode> {
    if (id === tree.value.root.id) {
      return fail('Cannot duplicate root node')
    }

    const source = findNode(tree.value.root, id)
    if (!source) return fail(`Node "${id}" not found`)

    const parent = findParent(tree.value.root, id)
    if (!parent) return fail(`Node "${id}" has no parent`)

    const duplicate = regenerateIds(source)

    const idx = parent.children.findIndex(c => c.id === id)
    parent.children.splice(idx + 1, 0, duplicate)
    touchUpdatedAt()
    return ok(duplicate)
  }

  // ---- Tree-level ----

  function updateMetadata(meta: Partial<SchemaMetadata>): void {
    tree.value.metadata = { ...tree.value.metadata, ...meta }
    touchUpdatedAt()
  }

  function updateBreakpoints(bp: Partial<SchemaBreakpoints>): void {
    tree.value.breakpoints = {
      ...(tree.value.breakpoints ?? DEFAULT_BREAKPOINTS),
      ...bp,
    }
  }

  function resetTree(): void {
    const fresh = createEmptyTree(tree.value.context)
    // Preserve name and breakpoints
    fresh.metadata.name = tree.value.metadata.name
    fresh.breakpoints = { ...(tree.value.breakpoints ?? DEFAULT_BREAKPOINTS) }
    tree.value = fresh
  }

  function importTree(newTree: SchemaTree): void {
    tree.value = JSON.parse(JSON.stringify(newTree))
    state.value.selectedNodeId = null
  }

  function exportTree(): SchemaTree {
    return JSON.parse(JSON.stringify(tree.value))
  }

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // Estado
    tree,
    state,

    // Computed
    selectedNode,
    allNodes,
    treeDepth,

    // Busca
    findNode: _findNode,
    findParent: _findParent,
    getPath,

    // UI
    selectNode,
    setBreakpoint,

    // Insert
    insertNode,
    insertAt,

    // Update
    updateProps,
    updateStyle,
    updateMeta,
    patchNode,

    // Remove
    removeNode,

    // Move
    moveNode,
    moveUp,
    moveDown,

    // Duplicate
    duplicateNode,

    // Tree-level
    updateMetadata,
    updateBreakpoints,
    resetTree,
    importTree,
    exportTree,

    // History
    canUndo: history?.canUndo ?? ref(false),
    canRedo: history?.canRedo ?? ref(false),
    undo: history?.undo ?? (() => {}),
    redo: history?.redo ?? (() => {}),
  }
}
