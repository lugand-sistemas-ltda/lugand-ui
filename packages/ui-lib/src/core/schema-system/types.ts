/**
 * Schema System - Type Definitions
 * 
 * Sistema de schemas JSON que descreve páginas, formulários e layouts completos.
 * Permite persistir e carregar interfaces inteiras via JSON.
 * 
 * Filosofia:
 * - Schema JSON = Contract universal
 * - Backend envia JSON → Frontend renderiza
 * - Page Builder salva JSON → Banco de dados
 * - Versionamento de schemas via Git
 * 
 * @module core/schema-system
 */

import type { WidgetSchema } from '../widget-system/types'

// Re-export WidgetSchema for external use
export type { WidgetSchema } from '../widget-system/types'

/**
 * Versão do schema.
 * Usado para compatibilidade e migrations.
 */
export type SchemaVersion = '1.0' | '1.1' | '2.0'

/**
 * Tipo de schema.
 */
export type SchemaType = 'page' | 'form' | 'layout' | 'dashboard' | 'workflow'

/**
 * Estratégia de layout.
 */
export type LayoutStrategy = 'grid' | 'flex' | 'absolute' | 'stack'

/**
 * Breakpoint para responsividade.
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Schema de layout responsivo.
 * Define como widgets se posicionam em diferentes telas.
 */
export interface ResponsiveLayout {
  /** Estratégia de layout (grid, flex, etc) */
  strategy: LayoutStrategy

  /** Configuração específica da estratégia */
  config: {
    /** Grid: número de colunas */
    columns?: number
    /** Grid: tamanho do gap */
    gap?: string | number
    /** Flex: direção */
    direction?: 'row' | 'column'
    /** Flex: wrap */
    wrap?: boolean
    /** Flex: alinhamento */
    align?: 'start' | 'center' | 'end' | 'stretch'
    /** Flex: justificação */
    justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  }

  /** Breakpoints customizados (sobrescreve config padrão) */
  breakpoints?: Partial<Record<Breakpoint, Partial<ResponsiveLayout['config']>>>
}

/**
 * Metadata do schema.
 * Informações sobre autoria, versionamento, etc.
 */
export interface SchemaMetadata {
  /** Título legível do schema */
  title: string

  /** Descrição do schema */
  description?: string

  /** Autor/criador */
  author?: string

  /** Timestamp de criação */
  createdAt: string

  /** Timestamp de última modificação */
  updatedAt: string

  /** Versão do schema */
  version: SchemaVersion

  /** Tags para organização */
  tags?: string[]

  /** Ícone/emoji */
  icon?: string

  /** Thumbnail/preview */
  thumbnail?: string

  /** Custom metadata (extensível) */
  custom?: Record<string, any>
}

/**
 * Configuração de permissões.
 * Define quem pode ver/editar o schema.
 */
export interface SchemaPermissions {
  /** Roles que podem visualizar */
  view?: string[]

  /** Roles que podem editar */
  edit?: string[]

  /** Roles que podem deletar */
  delete?: string[]

  /** Se é público (ignora roles) */
  public?: boolean

  /** Owner/criador (sempre tem acesso total) */
  owner?: string
}

/**
 * Configuração de tema/estilo.
 */
export interface SchemaTheme {
  /** Tema base (light, dark, custom) */
  mode?: 'light' | 'dark' | 'auto'

  /** Paleta de cores customizada */
  colors?: {
    primary?: string
    secondary?: string
    success?: string
    warning?: string
    danger?: string
    info?: string
  }

  /** Fontes customizadas */
  fonts?: {
    heading?: string
    body?: string
    mono?: string
  }

  /** Espaçamentos customizados */
  spacing?: {
    base?: string
    scale?: number
  }

  /** Border radius customizado */
  borderRadius?: string

  /** Custom CSS variables */
  cssVariables?: Record<string, string>
}

/**
 * Configuração de validação do schema.
 */
export interface SchemaValidation {
  /** Se validação está ativa */
  enabled: boolean

  /** Validar ao carregar */
  onLoad?: boolean

  /** Validar ao salvar */
  onSave?: boolean

  /** Validações customizadas */
  rules?: Array<{
    /** Nome da regra */
    name: string
    /** Validador customizado */
    validator: (schema: PageSchema) => boolean | Promise<boolean>
    /** Mensagem de erro */
    message: string
  }>
}

/**
 * Schema de página completa.
 * Representa uma página inteira com múltiplos widgets.
 */
export interface PageSchema {
  /** ID único do schema */
  id: string

  /** Tipo do schema */
  type: SchemaType

  /** Metadata */
  metadata: SchemaMetadata

  /** Layout responsivo */
  layout: ResponsiveLayout

  /** Lista de widgets na página */
  widgets: WidgetSchema[]

  /** Permissões de acesso */
  permissions?: SchemaPermissions

  /** Tema customizado */
  theme?: SchemaTheme

  /** Validação */
  validation?: SchemaValidation

  /** Data sources globais (compartilhadas entre widgets) */
  dataSources?: Record<string, {
    type: 'api' | 'store' | 'static'
    config: any
  }>

  /** Event handlers globais */
  eventHandlers?: Record<string, {
    event: string
    handler: string | Function
  }>

  /** Custom scripts (executados no mount) */
  scripts?: {
    onMount?: string
    onUnmount?: string
    onUpdate?: string
  }
}

/**
 * Schema de formulário.
 * Especialização de PageSchema focada em formulários.
 */
export interface FormSchema extends Omit<PageSchema, 'type'> {
  type: 'form'

  /** Configuração específica de formulário */
  formConfig: {
    /** Método HTTP (POST, PUT, etc) */
    method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'

    /** Endpoint de submissão */
    action?: string

    /** Validar ao digitar */
    validateOnInput?: boolean

    /** Validar ao blur */
    validateOnBlur?: boolean

    /** Mostrar erros inline */
    showInlineErrors?: boolean

    /** Mensagem de sucesso */
    successMessage?: string

    /** Mensagem de erro */
    errorMessage?: string

    /** Redirect após sucesso */
    redirectOnSuccess?: string

    /** Reset após sucesso */
    resetOnSuccess?: boolean
  }
}

/**
 * Schema de dashboard.
 * Especialização para dashboards com widgets de visualização.
 */
export interface DashboardSchema extends Omit<PageSchema, 'type'> {
  type: 'dashboard'

  /** Configuração específica de dashboard */
  dashboardConfig: {
    /** Intervalo de refresh (ms) */
    refreshInterval?: number

    /** Auto-refresh ativo */
    autoRefresh?: boolean

    /** Filtros globais */
    globalFilters?: Record<string, any>

    /** Range de datas padrão */
    defaultDateRange?: {
      start: string
      end: string
    }

    /** Permitir export */
    allowExport?: boolean

    /** Formatos de export */
    exportFormats?: Array<'pdf' | 'excel' | 'csv' | 'json'>
  }
}

/**
 * Resultado da validação de schema.
 */
export interface SchemaValidationResult {
  /** Se schema é válido */
  valid: boolean

  /** Lista de erros encontrados */
  errors: Array<{
    /** Path do erro (ex: 'widgets[0].config.fields') */
    path: string
    /** Mensagem de erro */
    message: string
    /** Severidade */
    severity: 'error' | 'warning' | 'info'
  }>

  /** Lista de warnings (não bloqueantes) */
  warnings?: Array<{
    path: string
    message: string
  }>

  /** Timestamp da validação */
  timestamp: string
}

/**
 * Opções de parsing/serialização.
 */
export interface SchemaParseOptions {
  /** Validar ao parsear */
  validate?: boolean

  /** Versão do schema esperada */
  expectedVersion?: SchemaVersion

  /** Aplicar migrations automaticamente */
  autoMigrate?: boolean

  /** Strict mode (rejeita propriedades desconhecidas) */
  strict?: boolean

  /** Remover propriedades null/undefined */
  stripNullish?: boolean
}

/**
 * Opções de serialização.
 */
export interface SchemaSerializeOptions {
  /** Formato de indentação */
  indent?: number | string

  /** Incluir metadata completa */
  includeMetadata?: boolean

  /** Minificar output */
  minify?: boolean

  /** Versão do schema a gerar */
  targetVersion?: SchemaVersion
}

/**
 * Contexto de execução do schema.
 * Injetado quando schema é renderizado.
 */
export interface SchemaContext {
  /** User atual */
  user?: {
    id: string
    name: string
    email: string
    roles: string[]
  }

  /** Permissões do user */
  permissions?: string[]

  /** Dados da rota/navegação */
  route?: {
    path: string
    params: Record<string, string>
    query: Record<string, string>
  }

  /** Dados customizados do parent */
  data?: Record<string, any>

  /** Callbacks para interação com parent */
  callbacks?: {
    onSave?: (data: any) => void | Promise<void>
    onCancel?: () => void
    onError?: (error: Error) => void
  }
}

/**
 * Event de mudança de schema.
 * Emitido quando schema é modificado.
 */
export interface SchemaChangeEvent {
  /** Tipo de mudança */
  type: 'widget-added' | 'widget-removed' | 'widget-updated' | 'layout-changed' | 'metadata-updated'

  /** Path da mudança */
  path: string

  /** Valor anterior */
  oldValue?: any

  /** Valor novo */
  newValue?: any

  /** Timestamp */
  timestamp: string

  /** Autor da mudança */
  author?: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Cria um layout grid padrão
 */
export function createGridLayout(columns: number = 12, gap: number = 16): ResponsiveLayout {
  return {
    strategy: 'grid',
    config: {
      columns,
      gap
    }
  }
}

/**
 * Cria um layout flex padrão
 */
export function createFlexLayout(direction: 'row' | 'column' = 'row'): ResponsiveLayout {
  return {
    strategy: 'flex',
    config: {
      direction,
      wrap: true,
      gap: 16
    }
  }
}

/**
 * Cria metadata padrão para schemas
 */
export function createSchemaMetadata(title: string, description?: string): SchemaMetadata {
  return {
    title,
    description,
    version: '1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
