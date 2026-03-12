/**
 * Low-Code Engine - Types Entry Point
 *
 * Re-exporta todos os tipos do motor low-code de um ponto central.
 * Importe todos os tipos de 'core/low-code-engine/types'.
 *
 * @example
 * ```typescript
 * import type { SchemaNode, SchemaTree, BuilderContextType } from '@/core/low-code-engine/types'
 * import type { ComponentDefinition, PropDefinition } from '@/core/low-code-engine/types'
 * import type { BuilderContext, EditorUIState } from '@/core/low-code-engine/types'
 * import type { DataSource, DataSourceField, DataBinding } from '@/core/low-code-engine/types'
 * ```
 */

// --- Schema (estrutura de dados do documento) ---
export type {
  // Nó da árvore
  SchemaNode,
  SchemaNodeStyle,
  SchemaNodeMeta,

  // Documento completo
  SchemaTree,
  BuilderContextType,
  SchemaVariable,
  SchemaBreakpoints,
  SchemaMetadata,

  // Editor state
  SchemaEditorState,

  // Helpers
  InsertPosition,
  NodePath,
  ActiveBreakpoint,
  SchemaTreeResult,
} from './schema.types'

export { DEFAULT_BREAKPOINTS } from './schema.types'

// --- Component (definição de componentes no registry) ---
export type {
  // Categoria
  ComponentCategory,

  // Props
  StringPropDefinition,
  NumberPropDefinition,
  BooleanPropDefinition,
  SelectPropDefinition,
  MultiSelectPropDefinition,
  ColorPropDefinition,
  IconPropDefinition,
  ResponsivePropDefinition,
  DataBindingPropDefinition,
  ColumnsPropDefinition,
  ColumnConfig,
  PropDefinition,

  // ComponentDefinition
  ComponentDefinition,

  // Registry helpers
  ComponentLookupResult,
  ComponentListFilter,
} from './component.types'

// --- Context (configuração dos builders) ---
export type {
  // Paleta
  PaletteItem,
  PaletteGroup,

  // Canvas
  CanvasCapabilities,

  // Toolbar
  ToolbarAction,

  // BuilderContext
  BuilderContext,
  BuilderContextMap,
  ContextComponentResolver,

  // Editor UI state
  EditorUIState,
} from './context.types'

// --- DataSource (integração com dados externos) ---
export type {
  // Campos
  DataFieldType,
  DataFieldFormat,
  DataSourceField,

  // Config
  HttpMethod,
  HttpHeaders,
  DataSourceParam,
  PaginationConfig,

  // DataSource
  DataSource,
  RestApiConfig,
  StaticDataConfig,
  ComputedDataConfig,

  // Data binding
  DataBinding,

  // Schema inference
  SchemaInferenceOptions,
  SchemaInferenceResult,
} from './datasource.types'

export { isDataBinding } from './datasource.types'
