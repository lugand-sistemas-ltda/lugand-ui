/**
 * Low-Code Engine - Builder Context Types
 *
 * Define o contrato dos contextos de builder — os "filtros" que transformam
 * o motor genérico em builders especializados.
 *
 * CONCEITO:
 * O LowCodeEngine.vue é o MOTOR. Os builders (PageBuilder, FormBuilder, DocBuilder)
 * são INSTÂNCIAS do motor com um BuilderContext específico.
 *
 * Um BuilderContext define:
 * - Quais componentes aparecem na paleta
 * - Como a paleta está organizada
 * - Qual é o schema vazio padrão
 * - Quais ações são permitidas no canvas
 * - Configurações visuais do editor
 *
 * MIGRAÇÃO:
 * - Substitui: configurações hardcoded no FormBuilderView.vue, PageBuilderView.vue
 * - Substitui: listas hardcoded de widgets em widget-system/widget-registry.ts
 *
 * @module core/low-code-engine/types/context
 */

import type { BuilderContextType, SchemaTree, SchemaBreakpoints } from './schema.types'
import type { ComponentCategory, ComponentDefinition } from './component.types'

// ============================================================
// PALETTE CONFIGURATION - Como a paleta lateral é organizada
// ============================================================

/**
 * Item de componente na paleta (já resolvido do registry).
 * Agrupa informações mínimas para renderizar o item arrastável.
 */
export interface PaletteItem {
  /** ComponentDefinition.type */
  type: string
  label: string
  icon: string
  description?: string
  category: ComponentCategory
  /** Indica se é um container (exibe ícone diferente na paleta) */
  isContainer: boolean
}

/**
 * Grupo de componentes na paleta.
 * A paleta exibe esses grupos como seções com título e ícone.
 */
export interface PaletteGroup {
  /** Identificador único do grupo */
  id: string

  /** Título exibido na paleta */
  label: string

  /** Ícone do grupo (sistema Icon.vue) */
  icon?: string

  /** Categoria de componentes deste grupo (filtra pelo registry) */
  categories: ComponentCategory[]

  /**
   * Componentes específicos para incluir/excluir do grupo.
   * - include: Lista explícita de tipos a incluir (sobreposição ao category filter)
   * - exclude: Tipos a remover mesmo que passem no category filter
   */
  include?: string[]
  exclude?: string[]

  /** Se o grupo começa colapsado na paleta */
  collapsed?: boolean

  /** Ordem de exibição (menor = primeiro) */
  order?: number
}

// ============================================================
// CANVAS CAPABILITIES - O que é possível fazer no canvas deste contexto
// ============================================================

/**
 * Define quais interações são possíveis no canvas para este builder.
 * Permite criar builders read-only, ou builders com restrições específicas.
 */
export interface CanvasCapabilities {
  /** Se o usuário pode arrastar e soltar componentes */
  canDrop: boolean

  /** Se o usuário pode reordenar componentes existentes */
  canReorder: boolean

  /** Se o usuário pode deletar componentes */
  canDelete: boolean

  /** Se o usuário pode duplicar componentes */
  canDuplicate: boolean

  /** Se o usuário pode configurar breakpoints responsivos */
  canUseBreakpoints: boolean

  /** Se o usuário pode agrupar componentes em containers */
  canWrap: boolean

  /**
   * Componentes que NÃO podem ser deletados (protection).
   * @example ['form-root'] — root do form não pode ser deletado
   */
  lockedTypes?: string[]

  /** Se permite multi-seleção de nós para operações em grupo */
  multiSelect?: boolean
}

// ============================================================
// TOOLBAR ACTIONS - Ações disponíveis na toolbar do builder
// ============================================================

/**
 * Ação customizada na toolbar do builder.
 * Além das ações padrão (undo/redo/preview/save), cada contexto pode ter as suas.
 */
export interface ToolbarAction {
  id: string
  label: string
  icon: string
  tooltip?: string
  group?: 'left' | 'center' | 'right'
  disabled?: boolean
}

// ============================================================
// BUILDER CONTEXT - O filtro que configura o motor
// ============================================================

/**
 * Contexto de um builder. Define TUDO que o motor low-code precisa saber
 * para se comportar como um builder específico.
 *
 * @example
 * ```typescript
 * // FormBuilderContext:
 * const formContext: BuilderContext = {
 *   type: 'form',
 *   label: 'Form Builder',
 *   icon: 'dynamic_form',
 *   description: 'Criador de formulários dinâmicos',
 *
 *   palette: {
 *     groups: [
 *       { id: 'fields', label: 'Campos', icon: 'input', categories: ['form'] },
 *       { id: 'layout', label: 'Layout', icon: 'grid_view', categories: ['layout'] },
 *       { id: 'feedback', label: 'Feedback', icon: 'notifications', categories: ['feedback'] },
 *     ]
 *   },
 *
 *   canvas: {
 *     canDrop: true,
 *     canReorder: true,
 *     canDelete: true,
 *     canDuplicate: true,
 *     canUseBreakpoints: true,
 *     canWrap: true,
 *     lockedTypes: ['form-root']
 *   },
 *
 *   defaultSchema: () => createDefaultFormSchema(),
 * }
 * ```
 */
export interface BuilderContext {
  // --- Identidade ---

  /** Tipo do contexto — corresponde a BuilderContextType no schema */
  type: BuilderContextType

  /** Nome legível do builder (ex: 'Form Builder', 'Page Builder') */
  label: string

  /** Ícone do builder para uso em menus e abas */
  icon: string

  /** Descrição breve do propósito deste builder */
  description?: string

  // --- Paleta ---

  /** Configuração da paleta lateral de componentes */
  palette: {
    /**
     * Grupos de componentes exibidos na paleta.
     * Os componentes listados em cada grupo são filtrados do unified-registry
     * combinando category filter + include/exclude + contexts filter.
     */
    groups: PaletteGroup[]

    /** Texto do campo de busca da paleta */
    searchPlaceholder?: string
  }

  // --- Canvas ---

  /** O que pode ser feito no canvas deste builder */
  canvas: CanvasCapabilities

  // --- Schema Padrão ---

  /**
   * Função que retorna um SchemaTree vazio para inicializar o builder.
   * É chamada quando o usuário cria um novo item.
   *
   * @returns SchemaTree com root já configurado para o contexto
   */
  defaultSchema: () => SchemaTree

  // --- Breakpoints ---

  /**
   * Breakpoints disponíveis neste contexto.
   * Undefined = usa DEFAULT_BREAKPOINTS do schema.types.
   * - FormBuilder: pode omitir breakpoints (forms raramente são responsivos)
   * - PageBuilder: deve ter todos os breakpoints
   */
  breakpoints?: Partial<SchemaBreakpoints>

  // --- Toolbar ---

  /**
   * Ações extras na toolbar além das padrão (undo/redo/preview/save/export).
   * Útil para ações específicas do contexto.
   *
   * @example FormBuilder pode ter um botão "Validar Schema"
   */
  extraToolbarActions?: ToolbarAction[]

  // --- Metadados ---

  /**
   * Tags usadas para categorizar o artefato criado neste builder.
   * @example ['page', 'landing'] para o PageBuilder
   */
  defaultTags?: string[]
}

// ============================================================
// BUILDER CONTEXT REGISTRY - Gerencia os contextos disponíveis
// ============================================================

/**
 * Mapeamento de todos os contextos de builder registrados.
 * O motor LowCodeEngine busca o contexto pelo tipo.
 */
export type BuilderContextMap = {
  [K in BuilderContextType]?: BuilderContext
}

/**
 * Resolve componentes disponíveis em um contexto.
 * Usado pelo motor para filtrar o registry pelo contexto atual.
 */
export interface ContextComponentResolver {
  /**
   * Retorna os tipos de componentes disponíveis no contexto dado.
   * Combinação de: registry.getByContext(ctx) + palette.groups include/exclude
   */
  resolveForContext(
    contextType: BuilderContextType,
    context: BuilderContext
  ): ComponentDefinition[]

  /**
   * Retorna os grupos da paleta com os componentes já resolvidos.
   * Pronto para renderizar a paleta.
   */
  resolvePaletteGroups(
    contextType: BuilderContextType,
    context: BuilderContext
  ): Array<PaletteGroup & { items: PaletteItem[] }>
}

// ============================================================
// EDITOR STATE - Estado da UI do editor
// ============================================================

/**
 * Estado da UI do editor low-code.
 * Separado do SchemaTree (que é o documento) — este é estado de edição.
 *
 * Gerenciado pelo motor, não persistido no schema.
 */
export interface EditorUIState {
  /** Painel esquerdo (paleta) visível */
  paletteVisible: boolean

  /** Painel direito (properties) visível */
  propertiesVisible: boolean

  /** Breakpoint ativo no Properties Panel */
  activeBreakpoint: 'sm' | 'md' | 'lg' | 'xl' | 'base'

  /** Id do nó atualmente selecionado no canvas */
  selectedNodeId: string | null

  /** Id do nó com hover no canvas */
  hoveredNodeId: string | null

  /** Se o modo preview está ativo (sem handles de edição) */
  previewMode: boolean

  /** Zoom do canvas (1 = 100%) */
  canvasZoom: number

  /** Se o breadcrumb de navegação de nós está visível */
  nodeBreadcrumbVisible: boolean
}
