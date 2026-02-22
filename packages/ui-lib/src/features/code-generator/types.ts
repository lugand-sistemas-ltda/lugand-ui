/**
 * FASE 6 - Code Generator Types
 * 
 * Sistema de tipos para geração de código a partir de PageSchema.
 * Suporta geração de arquivos .vue, .ts, router config, etc.
 */

import type { PageSchema } from '../../core/schema-system/types'

// ============================================
// CODE GENERATION OPTIONS
// ============================================

/**
 * Formato de código a gerar
 */
export type CodeFormat = 'vue-sfc' | 'typescript' | 'javascript' | 'json'

/**
 * Estilo de script Vue
 */
export type ScriptStyle = 'setup' | 'options' | 'composition'

/**
 * Estilo de CSS
 */
export type StyleLang = 'css' | 'scss' | 'sass' | 'less'

/**
 * Estratégia de imports
 */
export type ImportStrategy =
  | 'named'        // import { Button, Card } from 'lib'
  | 'default'      // import Button from 'lib/Button'
  | 'namespace'    // import * as UI from 'lib'

/**
 * Convenção de naming para arquivos
 */
export type NamingConvention =
  | 'PascalCase'   // MyComponent.vue
  | 'kebab-case'   // my-component.vue
  | 'camelCase'    // myComponent.vue
  | 'snake_case'   // my_component.vue

/**
 * Opções de geração de código
 */
export interface CodeGeneratorOptions {
  /** Formato do código gerado */
  format: CodeFormat

  /** Estilo de script (Vue SFC) */
  scriptStyle?: ScriptStyle

  /** Linguagem de estilo (Vue SFC) */
  styleLang?: StyleLang

  /** Estratégia de imports */
  importStrategy?: ImportStrategy

  /** Nome do pacote para imports */
  packageName?: string

  /** Convenção de naming para arquivos */
  namingConvention?: NamingConvention

  /** Incluir TypeScript types */
  typescript?: boolean

  /** Incluir comentários no código */
  includeComments?: boolean

  /** Incluir metadata como comentários */
  includeMetadata?: boolean

  /** Formatar código (prettier-like) */
  formatCode?: boolean

  /** Indentação (espaços) */
  indentSize?: number

  /** Usar aspas simples ou duplas */
  singleQuotes?: boolean

  /** Incluir estilos scoped */
  scopedStyles?: boolean

  /** Incluir eslint-disable comments */
  disableLinting?: boolean

  /** Gerar apenas template (sem script/style) */
  templateOnly?: boolean

  /** Gerar router config junto */
  includeRouter?: boolean

  /** Gerar Pinia store junto */
  includeStore?: boolean

  /** Prefixo para componentes gerados */
  componentPrefix?: string

  /** Diretório base para paths relativos */
  baseDir?: string
}

// ============================================
// CODE TEMPLATES
// ============================================

/**
 * Template de código
 */
export interface CodeTemplate {
  /** Nome do template */
  name: string

  /** Descrição */
  description?: string

  /** Função que gera o código */
  generate: (context: TemplateContext) => string

  /** Dependências do template */
  dependencies?: string[]

  /** Se o template suporta TypeScript */
  supportsTypeScript?: boolean
}

/**
 * Contexto para geração de templates
 */
export interface TemplateContext {
  /** Schema da página */
  schema: PageSchema

  /** Opções de geração */
  options: CodeGeneratorOptions

  /** Imports necessários */
  imports: ImportDeclaration[]

  /** Componentes usados */
  components: ComponentUsage[]

  /** Data sources */
  dataSources: DataSourceInfo[]

  /** Event handlers */
  eventHandlers: EventHandlerInfo[]

  /** Helpers disponíveis */
  helpers: TemplateHelpers
}

/**
 * Helpers para templates
 */
export interface TemplateHelpers {
  /** Formata nome de variável */
  formatVariableName: (name: string) => string

  /** Formata nome de componente */
  formatComponentName: (name: string) => string

  /** Formata nome de arquivo */
  formatFileName: (name: string) => string

  /** Gera indentação */
  indent: (level: number) => string

  /** Gera import statement */
  generateImport: (declaration: ImportDeclaration) => string

  /** Escapa string para template */
  escapeString: (str: string) => string

  /** Converte config object para string */
  stringifyConfig: (config: any) => string
}

// ============================================
// IMPORT DECLARATIONS
// ============================================

/**
 * Declaração de import
 */
export interface ImportDeclaration {
  /** Nome do pacote/módulo */
  source: string

  /** Tipo de import */
  type: 'named' | 'default' | 'namespace' | 'side-effect'

  /** Imports nomeados */
  named?: string[]

  /** Import default */
  default?: string

  /** Namespace (import * as X) */
  namespace?: string

  /** Se é import de tipo (TypeScript) */
  isType?: boolean

  /** Alias para imports */
  alias?: Record<string, string>
}

// ============================================
// COMPONENT USAGE
// ============================================

/**
 * Informação sobre uso de componente
 */
export interface ComponentUsage {
  /** Nome do componente */
  name: string

  /** Tipo do widget (do schema) */
  widgetType: string

  /** Quantidade de vezes usado */
  count: number

  /** Props usadas */
  props: string[]

  /** Eventos usados */
  events: string[]

  /** Slots usados */
  slots: string[]

  /** Se usa v-model */
  hasVModel?: boolean

  /** Se usa refs */
  hasRefs?: boolean
}

// ============================================
// DATA SOURCES
// ============================================

/**
 * Informação sobre data source
 */
export interface DataSourceInfo {
  /** Nome da data source */
  name: string

  /** Tipo (api, store, static, computed) */
  type: 'api' | 'store' | 'static' | 'computed'

  /** Configuração */
  config: any

  /** Se é async */
  isAsync?: boolean

  /** Dependências (outras data sources) */
  dependencies?: string[]
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Informação sobre event handler
 */
export interface EventHandlerInfo {
  /** Nome do handler */
  name: string

  /** Evento que dispara */
  event: string

  /** Widget ID que emite o evento */
  widgetId: string

  /** Código do handler (se inline) */
  code?: string

  /** Se é async */
  isAsync?: boolean

  /** Parâmetros do handler */
  params?: string[]
}

// ============================================
// GENERATED CODE
// ============================================

/**
 * Código gerado
 */
export interface GeneratedCode {
  /** Conteúdo do arquivo principal */
  content: string

  /** Nome do arquivo */
  fileName: string

  /** Tipo do arquivo */
  fileType: CodeFormat

  /** Imports usados */
  imports: ImportDeclaration[]

  /** Componentes usados */
  components: ComponentUsage[]

  /** Arquivos adicionais gerados */
  additionalFiles?: GeneratedFile[]

  /** Warnings/avisos */
  warnings?: string[]

  /** Estatísticas */
  stats?: CodeStats
}

/**
 * Arquivo adicional gerado
 */
export interface GeneratedFile {
  /** Nome do arquivo */
  fileName: string

  /** Conteúdo */
  content: string

  /** Tipo */
  fileType: string

  /** Descrição */
  description?: string
}

/**
 * Estatísticas do código gerado
 */
export interface CodeStats {
  /** Linhas de código */
  totalLines: number

  /** Linhas de template */
  templateLines?: number

  /** Linhas de script */
  scriptLines?: number

  /** Linhas de style */
  styleLines?: number

  /** Total de componentes */
  componentCount: number

  /** Total de imports */
  importCount: number

  /** Tamanho estimado (bytes) */
  estimatedSize: number
}

// ============================================
// ROUTER GENERATION
// ============================================

/**
 * Opções para geração de router
 */
export interface RouterGeneratorOptions {
  /** Nome da rota */
  routeName?: string

  /** Path da rota */
  routePath?: string

  /** Se a rota tem parâmetros */
  hasParams?: boolean

  /** Se a rota requer autenticação */
  requiresAuth?: boolean

  /** Layout da rota */
  layout?: string

  /** Meta data da rota */
  meta?: Record<string, any>
}

/**
 * Configuração de rota gerada
 */
export interface GeneratedRoute {
  /** Nome da rota */
  name: string

  /** Path */
  path: string

  /** Componente (import) */
  component: string

  /** Meta data */
  meta?: Record<string, any>

  /** Children routes */
  children?: GeneratedRoute[]

  /** Redirect */
  redirect?: string

  /** Alias */
  alias?: string | string[]
}

// ============================================
// STORE GENERATION
// ============================================

/**
 * Opções para geração de Pinia store
 */
export interface StoreGeneratorOptions {
  /** Nome do store */
  storeName?: string

  /** Se usa setup syntax */
  useSetup?: boolean

  /** Incluir persist plugin */
  includePersist?: boolean

  /** Data sources para incluir */
  dataSources?: DataSourceInfo[]
}

/**
 * Store gerado
 */
export interface GeneratedStore {
  /** Nome do store */
  name: string

  /** Conteúdo do arquivo */
  content: string

  /** Nome do arquivo */
  fileName: string

  /** State properties */
  state: string[]

  /** Getters */
  getters: string[]

  /** Actions */
  actions: string[]
}

// ============================================
// VALIDATION & ANALYSIS
// ============================================

/**
 * Resultado de análise de schema
 */
export interface SchemaAnalysis {
  /** Widgets únicos usados */
  uniqueWidgets: string[]

  /** Total de widgets */
  totalWidgets: number

  /** Profundidade máxima de aninhamento */
  maxDepth: number

  /** Se usa data sources */
  hasDataSources: boolean

  /** Se usa event handlers */
  hasEventHandlers: boolean

  /** Se usa validação */
  hasValidation: boolean

  /** Se usa permissões */
  hasPermissions: boolean

  /** Se usa tema customizado */
  hasCustomTheme: boolean

  /** Componentes complexos detectados */
  complexComponents: string[]

  /** Avisos/problemas */
  warnings: string[]
}

/**
 * Resultado de validação antes de gerar
 */
export interface GeneratorValidation {
  /** Se é válido para gerar */
  isValid: boolean

  /** Erros bloqueantes */
  errors: string[]

  /** Avisos não-bloqueantes */
  warnings: string[]

  /** Sugestões */
  suggestions: string[]

  /** Análise do schema */
  analysis?: SchemaAnalysis
}

// ============================================
// FILE SYSTEM OPERATIONS
// ============================================

/**
 * Opções para salvar arquivo
 */
export interface SaveFileOptions {
  /** Path do diretório */
  directory: string

  /** Nome do arquivo */
  fileName: string

  /** Conteúdo */
  content: string

  /** Se deve sobrescrever arquivo existente */
  overwrite?: boolean

  /** Se deve criar diretórios faltantes */
  createDirs?: boolean

  /** Encoding do arquivo */
  encoding?: 'utf-8' | 'utf-16' | 'ascii'
}

/**
 * Resultado de operação de salvar
 */
export interface SaveFileResult {
  /** Se foi salvo com sucesso */
  success: boolean

  /** Path completo do arquivo salvo */
  filePath?: string

  /** Erro (se houver) */
  error?: string

  /** Tamanho do arquivo (bytes) */
  fileSize?: number
}

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Operação batch de geração
 */
export interface BatchGenerateOperation {
  /** Schemas para gerar */
  schemas: PageSchema[]

  /** Opções de geração (comum a todos) */
  options: CodeGeneratorOptions

  /** Diretório de output */
  outputDir: string

  /** Se deve gerar router index */
  generateRouterIndex?: boolean

  /** Se deve gerar barrel export */
  generateBarrelExport?: boolean

  /** Prefixo para nomes de arquivos */
  filePrefix?: string
}

/**
 * Resultado de batch operation
 */
export interface BatchGenerateResult {
  /** Total de arquivos gerados */
  totalFiles: number

  /** Arquivos gerados com sucesso */
  successCount: number

  /** Arquivos com erro */
  errorCount: number

  /** Detalhes dos arquivos */
  files: Array<{
    fileName: string
    success: boolean
    error?: string
    filePath?: string
  }>

  /** Tempo total (ms) */
  duration: number

  /** Tamanho total (bytes) */
  totalSize: number
}

// ============================================
// EXPORTS
// ============================================

// Tipos já exportados inline acima
// Não há necessidade de re-exportar aqui
