/**
 * Low-Code Engine - Schema Types
 *
 * Define a estrutura de dados fundamental do motor low-code.
 * Todo builder (page, form, doc) opera sobre este schema hierárquico.
 *
 * MIGRAÇÃO:
 * - Substitui: BaseSchema<TItem>.items[] (lista plana)
 * - Substitui: PageWidget.children? (opcional), WidgetSchema.children? (opcional)
 * - Novo: SchemaNode.children[] é OBRIGATÓRIO (árvore, não lista)
 *
 * @module core/low-code-engine/types/schema
 */

// (No Vue imports needed — all types are plain TypeScript interfaces)

// ============================================================
// BUILDER CONTEXT TYPE
// Define qual "filtro" de builder está ativo
// ============================================================

/**
 * Tipos de contexto de builder disponíveis.
 *
 * Cada contexto define quais componentes aparecem na paleta
 * e quais regras de aninhamento se aplicam.
 *
 * Atualmente disponíveis: page, form, doc
 * Futuro: component, email, report
 */
export type BuilderContextType =
  | 'page'        // Para criar páginas/layouts completos
  | 'form'        // Para criar formulários
  | 'doc'         // Para criar documentos (PDF, relatórios)
  | 'component'   // [FUTURO] Para criar componentes reutilizáveis
  | 'email'       // [FUTURO] Para criar templates de e-mail
  | 'report'      // [FUTURO] Para criar relatórios

// ============================================================
// SCHEMA NODE - Unidade fundamental da árvore
// ============================================================

/**
 * Nó da árvore de schema.
 *
 * Representa um único componente instanciado na tela.
 * Pode conter filhos (children), formando uma árvore hierárquica.
 *
 * @example
 * ```typescript
 * // Antes (lista plana - NÃO USAR MAIS):
 * schema.items = [container, section, image]  // todos irmãos
 *
 * // Agora (árvore hierárquica):
 * schema.root = {
 *   type: 'page',
 *   children: [
 *     {
 *       type: 'container',
 *       children: [
 *         { type: 'section', children: [{ type: 'image', children: [] }] }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export interface SchemaNode {
  /** ID único do nó (gerado automaticamente ao criar) */
  id: string

  /**
   * Tipo do componente — deve corresponder a um ComponentDefinition.type
   * registrado no unified-registry.
   * @example 'button', 'container', 'input', 'data-table', 'chart-bar'
   */
  type: string

  /**
   * Propriedades do componente (passadas como props ao Vue component).
   * A estrutura específica depende do ComponentDefinition.propsSchema.
   */
  props: Record<string, any>

  /**
   * Estilos visuais e layout do nó.
   * Inclui suporte a responsividade por breakpoint.
   */
  style: SchemaNodeStyle

  /**
   * Classes CSS adicionais (além das geradas pelo style).
   * Geralmente para aplicar classes do tema da lib.
   */
  classes?: string[]

  /**
   * Filhos diretos deste nó na árvore.
   * Array VAZIO para leaf nodes (componentes sem filhos).
   * NUNCA null ou undefined — sempre array (vazio ou com itens).
   */
  children: SchemaNode[]

  /**
   * Slots nomeados para componentes que têm múltiplos slots.
   * @example { 'header': [SchemaNode], 'footer': [SchemaNode] }
   * Usado por componentes como Card, Modal, AppShell.
   */
  slots?: Record<string, SchemaNode[]>

  /**
   * Metadados do builder — NÃO afetam a renderização final.
   * Controlam o comportamento do editor (drag, drop, seleção, etc).
   */
  meta: SchemaNodeMeta
}

// ============================================================
// SCHEMA NODE STYLE - Layout e responsividade
// ============================================================

/**
 * Estilos e layout de um SchemaNode.
 *
 * Inclui suporte nativo a breakpoints responsivos.
 * Os valores de cada breakpoint SOBRESCREVEM os valores base.
 *
 * @example
 * ```typescript
 * // Container 50% no desktop, 100% no mobile:
 * style: {
 *   width: '50%',
 *   responsive: {
 *     sm: { width: '100%' }
 *   }
 * }
 * ```
 */
export interface SchemaNodeStyle {
  // --- Dimensões ---
  width?: string              // '100%', '50%', '300px', 'auto'
  height?: string
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string

  // --- Display / Layout ---
  display?: 'flex' | 'grid' | 'block' | 'inline-block' | 'none'
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  gap?: string
  flexGrow?: number
  flexShrink?: number
  flexBasis?: string

  // --- Grid ---
  gridTemplateColumns?: string  // 'repeat(3, 1fr)', '1fr 2fr'
  gridTemplateRows?: string
  gridColumn?: string           // 'span 2', '1 / 3'
  gridRow?: string

  // --- Espaçamento ---
  padding?: string
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  margin?: string
  marginTop?: string
  marginRight?: string
  marginBottom?: string
  marginLeft?: string

  // --- Visual ---
  background?: string
  backgroundColor?: string
  color?: string
  border?: string
  borderRadius?: string
  boxShadow?: string
  opacity?: number
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'

  // --- Posicionamento ---
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  top?: string
  right?: string
  bottom?: string
  left?: string
  zIndex?: number

  /**
   * Estilos responsivos por breakpoint.
   * Os valores SOBRESCREVEM os valores base para o breakpoint ativo.
   * Breakpoints configurados em SchemaTree.breakpoints.
   */
  responsive?: {
    /** Mobile (padrão: < 640px) */
    sm?: Omit<SchemaNodeStyle, 'responsive'>
    /** Tablet (padrão: < 768px) */
    md?: Omit<SchemaNodeStyle, 'responsive'>
    /** Desktop (padrão: >= 1024px) */
    lg?: Omit<SchemaNodeStyle, 'responsive'>
    /** Large Desktop (padrão: >= 1280px) */
    xl?: Omit<SchemaNodeStyle, 'responsive'>
  }
}

// ============================================================
// SCHEMA NODE META - Comportamento no editor
// ============================================================

/**
 * Metadados de comportamento do nó no editor.
 * NÃO são renderizados no output final.
 */
export interface SchemaNodeMeta {
  /**
   * Label legível para identificar o nó no editor e na árvore lateral.
   * @example 'Container Principal', 'Form de Cadastro'
   */
  label?: string

  /**
   * Se verdadeiro, o nó não pode ser movido no canvas.
   * Útil para estruturas fixas (header, footer).
   */
  locked?: boolean

  /**
   * Se verdadeiro, o nó está oculto no editor mas não no output.
   * @deprecated Usar style.display = 'none' para ocultar no output.
   * Este campo oculta apenas no editor, para debugging.
   */
  hiddenInEditor?: boolean

  /**
   * Se verdadeiro, o nó está colapsado na árvore lateral do editor.
   * Afeta apenas a UI do editor, não a renderização.
   */
  collapsedInTree?: boolean

  /**
   * Se o nó aceita filhos (é um container/drop zone).
   * Determinado pelo ComponentDefinition.isContainer ao criar o nó.
   */
  droppable: boolean

  /**
   * Se o nó pode ser arrastado para outra posição.
   * Nós como 'page-root' não podem ser movidos.
   */
  draggable: boolean

  /**
   * Quais tipos de componentes este nó aceita como filhos.
   * Determinado pelo ComponentDefinition.accepts ao criar o nó.
   * - 'all': aceita qualquer componente
   * - 'none': não aceita filhos (leaf node)
   * - string[]: lista de tipos aceitos
   */
  accepts: string[] | 'all' | 'none'

  /**
   * Número máximo de filhos diretos permitidos.
   * undefined = sem limite.
   */
  maxChildren?: number

  /**
   * Tipos de nó que este nó DEVE estar dentro.
   * Se vazio/undefined, pode estar em qualquer lugar.
   * @example ['form'] — só pode ser filho de um nó 'form'
   */
  requiresParent?: string[]
}

// ============================================================
// SCHEMA TREE - Documento completo
// ============================================================

/**
 * Schema completo de uma página/formulário/documento.
 *
 * É o "documento" salvo/carregado/exportado pelos builders.
 * Contém a árvore de nós (root), variáveis, breakpoints e metadados.
 *
 * @example
 * ```typescript
 * // Salvar:
 * const json = JSON.stringify(schemaTree)
 * localStorage.setItem('minha-pagina', json)
 *
 * // Carregar:
 * const schemaTree = JSON.parse(localStorage.getItem('minha-pagina'))
 * engine.loadSchema(schemaTree)
 * ```
 */
export interface SchemaTree {
  /**
   * Versão do formato de schema.
   * Usado para migração quando o formato muda.
   * Sempre '2.0' para schemas criados com o novo motor.
   */
  version: '2.0'

  /**
   * Tipo de builder que criou este schema.
   * Determina como interpretar e renderizar o conteúdo.
   */
  context: BuilderContextType

  /**
   * Nó raiz da árvore.
   * Geralmente do tipo 'page', 'form' ou 'doc' — nó especial não removível.
   */
  root: SchemaNode

  /**
   * Variáveis globais do schema.
   * Podem ser valores estáticos ou bindings para DataSources.
   * Disponíveis para todos os nós via expressões: {{ variavel }}
   */
  variables?: Record<string, SchemaVariable>

  /**
   * Configuração de breakpoints.
   * Valores em pixels — quando o viewport é menor que o breakpoint, aplica os estilos responsivos.
   * Defaults: sm=640, md=768, lg=1024, xl=1280
   */
  breakpoints?: SchemaBreakpoints

  /** Metadados descritivos do schema */
  metadata: SchemaMetadata
}

// ============================================================
// SCHEMA VARIABLE - Variáveis e bindings de dados
// ============================================================

/**
 * Variável global do schema.
 * Pode ser estática, vinda de uma API, ou computada.
 */
export interface SchemaVariable {
  /** Chave de acesso nos templates: {{ key }} */
  key: string

  /** Tipo do valor */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'

  /** Valor padrão ou atual */
  defaultValue: any

  /**
   * Origem do valor:
   * - 'static': valor fixo definido no builder
   * - 'datasource': vinculado a um DataSource registrado
   * - 'computed': calculado a partir de outras variáveis
   */
  source: 'static' | 'datasource' | 'computed'

  /**
   * ID do DataSource (se source === 'datasource').
   * Deve existir no DataSource registry.
   */
  dataSourceId?: string

  /**
   * Expressão de cálculo (se source === 'computed').
   * @example '{{ produtos.length }} itens'
   */
  expression?: string
}

// ============================================================
// SCHEMA BREAKPOINTS
// ============================================================

/**
 * Configuração dos breakpoints responsivos do schema.
 * Valores em pixels.
 */
export interface SchemaBreakpoints {
  /** Mobile — aplica estilos responsive.sm abaixo deste valor */
  sm: number    // default: 640
  /** Tablet — aplica estilos responsive.md abaixo deste valor */
  md: number    // default: 768
  /** Desktop — aplica estilos responsive.lg abaixo deste valor */
  lg: number    // default: 1024
  /** Large Desktop — aplica estilos responsive.xl acima deste valor */
  xl: number    // default: 1280
}

export const DEFAULT_BREAKPOINTS: SchemaBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

// ============================================================
// SCHEMA METADATA
// ============================================================

/**
 * Metadados descritivos do schema.
 * Não afetam a renderização — apenas identificação e organização.
 */
export interface SchemaMetadata {
  /** Nome do schema (ex: 'Página Inicial', 'Form de Cadastro') */
  name: string

  /** Descrição opcional */
  description?: string

  /** Timestamp ISO 8601 de criação */
  createdAt: string

  /** Timestamp ISO 8601 da última atualização */
  updatedAt: string

  /** Versão do schema (ex: '1.0.0') — para versionamento do conteúdo */
  contentVersion?: string

  /** Tags para organização e busca */
  tags?: string[]

  /** Categoria (ex: 'dashboard', 'landing-page', 'cadastro') */
  category?: string

  /** Status do schema */
  status?: 'draft' | 'published' | 'archived'

  /** Thumbnail para preview em listas de templates */
  thumbnail?: string

  /** Autor */
  author?: string
}

// ============================================================
// SCHEMA TREE STATE - Para uso nos composables
// ============================================================

/**
 * Estado reativo da árvore de schema.
 * Retornado por useSchemaTree.
 *
 * Todos os campos são readonly para forçar mutações
 * apenas através das funções do composable.
 */
/**
 * Estado reativo do editor low-code (dentro do composable).
 * Representa o estado da UI/editor — separado do SchemaTree (dados do documento).
 */
export interface SchemaEditorState {
  /** ID do nó atualmente selecionado */
  selectedNodeId: string | null

  /** ID do nó com hover no canvas */
  hoveredNodeId: string | null

  /** Breakpoint ativo no painel de propriedades ('base' = sem override) */
  activeBreakpoint: ActiveBreakpoint

  /** Se a paleta lateral está visível */
  paletteVisible: boolean

  /** Se o painel de propriedades está visível */
  propertiesVisible: boolean

  /** Se o modo preview está ativo */
  previewMode: boolean

  /** Se um drag está em andamento */
  isDragging: boolean

  /** ID do nó sendo arrastado */
  dragSourceId: string | null

  /** ID do nó onde o drag está sobre */
  dropTargetId: string | null

  /** Posição de drop em relação ao dropTarget */
  dropPosition: InsertPosition | null
}

// ============================================================
// HELPER TYPES
// ============================================================

/** Posição de inserção relativa a um nó alvo */
export type InsertPosition = 'inside' | 'before' | 'after'

/** Caminho de IDs até um nó na árvore */
export type NodePath = string[]

/**
 * Breakpoint ativo no editor.
 * 'base' = sem breakpoint (estilos padrão, sem responsive override)
 */
export type ActiveBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Resultado de uma operação na árvore.
 * Permite tratamento de erros sem throws.
 */
export type SchemaTreeResult<T = void> =
  | { ok: true; value: T }
  | { ok: false; error: string }
