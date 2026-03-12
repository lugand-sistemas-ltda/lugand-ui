/**
 * Low-Code Engine - DataSource Types
 *
 * Define o contrato de integração com fontes de dados externas.
 * Permite que componentes (DataTable, Select, Chart, etc.) consomam
 * dados de APIs, dados estáticos ou valores computados.
 *
 * CONCEITO:
 * Um DataSource é a "cola" entre o backend do cliente e os componentes
 * do builder. O cliente configura uma fonte de dados (ex: endpoint REST),
 * e o motor infere automaticamente os campos disponíveis para vinculação.
 *
 * MIGRAÇÃO:
 * - Absorve: DataSourceConfig de widget-system/types.ts (method, endpoint, headers)
 * - Absorve: WidgetDataSource de widget-system/types.ts
 * - Novo: DataSourceField (tipagem dos campos inferidos/declarados)
 * - Novo: DataSourceSchema (contrato de DTO/response)
 *
 * @module core/low-code-engine/types/datasource
 */

// ============================================================
// DATA SOURCE FIELD - Um campo de um DTO inferido ou declarado
// ============================================================

/**
 * Tipo primitivo de um campo de DataSource.
 */
export type DataFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'currency'
  | 'email'
  | 'url'
  | 'image-url'
  | 'array'
  | 'object'
  | 'unknown'

/**
 * Formato de exibição de um campo (hint para o Properties Panel).
 * Exibido como sugestão ao vincular o campo a uma prop.
 */
export type DataFieldFormat =
  | 'text'            // string simples
  | 'multiline'       // texto longo (textarea)
  | 'currency-brl'    // R$ 1.234,56
  | 'currency-usd'    // $1,234.56
  | 'percent'         // 42.5%
  | 'date-short'      // 01/01/2025
  | 'date-long'       // 1 de janeiro de 2025
  | 'datetime-short'  // 01/01/2025 14:30
  | 'phone'           // (11) 99999-9999
  | 'cpf'             // 000.000.000-00
  | 'cnpj'            // 00.000.000/0001-00
  | 'boolean-yesno'   // Sim / Não
  | 'boolean-check'   // ✓ / ✗

/**
 * Representação de um campo de uma fonte de dados.
 * Pode ser inferido automaticamente (de JSON response) ou declarado manualmente.
 */
export interface DataSourceField {
  /** Caminho do campo no objeto (suporta dot notation: 'address.city') */
  key: string

  /** Label legível para exibição no seletor de campos */
  label: string

  /** Tipo primitivo do campo */
  type: DataFieldType

  /** Dica de formatação para o Properties Panel */
  format?: DataFieldFormat

  /** Se o campo pode ser null ou undefined no response */
  nullable?: boolean

  /** Se o campo é obrigatório na response */
  required?: boolean

  /**
   * Campos filhos (se type === 'object' ou 'array').
   * Permite drill-down: 'user.address.city'
   */
  fields?: DataSourceField[]

  /** Descrição do campo (extraída de comentários do DTO, se disponível) */
  description?: string

  /** Exemplos de valores para preview no builder */
  examples?: any[]
}

// ============================================================
// DATA SOURCE CONFIG - Configuração da fonte
// ============================================================

/**
 * Método HTTP permitido para DataSources do tipo 'rest-api'.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/** Headers HTTP customizados */
export type HttpHeaders = Record<string, string>

/**
 * Parâmetro de query string ou path param configurável.
 * Pode ser um literal ou uma referência a uma variável do schema.
 */
export interface DataSourceParam {
  key: string
  label: string
  /** Valor literal ou expressão: '$var.userId' */
  value: string
  /** Se o parâmetro é obrigatório para a requisição funcionar */
  required: boolean
}

/**
 * Schema de paginação detectada/configurada no DataSource.
 */
export interface PaginationConfig {
  /** Chave do parâmetro de página na requisição (ex: 'page', 'offset') */
  pageParam: string
  /** Chave do parâmetro de tamanho de página (ex: 'limit', 'size') */
  limitParam: string
  /** Caminho para os dados no response (ex: 'data', 'items', 'results') */
  dataPath: string
  /** Caminho para o total de registros no response (ex: 'total', 'count') */
  totalPath?: string
}

// ============================================================
// DATA SOURCE - A fonte de dados registrada
// ============================================================

/**
 * Uma fonte de dados registrada no motor low-code.
 *
 * @example
 * ```typescript
 * // Fonte REST simples:
 * const produtosDataSource: DataSource = {
 *   id: 'produtos',
 *   label: 'Produtos',
 *   icon: 'inventory',
 *   type: 'rest-api',
 *   config: {
 *     endpoint: 'https://api.loja.com/v1/products',
 *     method: 'GET',
 *     headers: { 'Authorization': 'Bearer $var.authToken' }
 *   },
 *   schema: [
 *     { key: 'id', label: 'ID', type: 'number' },
 *     { key: 'name', label: 'Nome', type: 'string' },
 *     { key: 'price', label: 'Preço', type: 'currency', format: 'currency-brl' },
 *     { key: 'imageUrl', label: 'Imagem', type: 'image-url' },
 *   ]
 * }
 * ```
 */
export interface DataSource {
  // --- Identidade ---

  /** Identificador único (usado em data-binding props) */
  id: string

  /** Nome legível para exibição no Properties Panel */
  label: string

  /** Ícone para diferenciação visual na UI */
  icon?: string

  /** Descrição / documentação da fonte */
  description?: string

  // --- Tipo e Configuração ---

  /** Tipo do DataSource — determina qual config shape é usado */
  type: 'rest-api' | 'static' | 'computed'

  /**
   * Configuração específica por tipo.
   * - rest-api: endpoint, method, headers, params
   * - static: data literal (array ou objeto)
   * - computed: expressão avaliada em runtime
   */
  config: RestApiConfig | StaticDataConfig | ComputedDataConfig

  // --- Schema de Campos ---

  /**
   * Campos disponíveis para vinculação.
   * - rest-api: pode ser inferido automaticamente (via schemaInference)
   * - static: deve ser declarado manualmente ou inferido do valor
   * - computed: deve ser declarado manualmente
   */
  schema: DataSourceField[]

  /**
   * Se o schema foi inferido automaticamente (true) ou declarado pelo usuário (false).
   * Campos inferidos podem mudar se a API mudar.
   */
  schemaIsInferred?: boolean

  // --- Paginação ---

  /** Configuração de paginação (se a fonte suporta) */
  pagination?: PaginationConfig

  // --- Metadados ---

  /** Tags para organização */
  tags?: string[]
}

// --- Configs por tipo ---

/**
 * Configuração de DataSource REST.
 * Absorve: DataSourceConfig de widget-system/types.ts
 */
export interface RestApiConfig {
  type: 'rest-api'

  /** URL do endpoint. Pode conter variáveis: '$var.apiUrl/products' */
  endpoint: string

  method: HttpMethod

  /** Headers HTTP. Valores podem referenciar variáveis: 'Bearer $var.token' */
  headers?: HttpHeaders

  /** Query params ou path params configuráveis */
  params?: DataSourceParam[]

  /** Body da requisição (POST/PUT/PATCH). Pode referenciar variáveis. */
  body?: Record<string, any>

  /**
   * Transformação aplicada ao response antes de passar para o componente.
   * Expressão JS: 'response.data.items' ou '(r) => r.data.items'
   */
  transform?: string

  /** Se deve fazer polling automático. Intervalo em ms. 0 = desativado. */
  pollingInterval?: number
}

/** Configuração de DataSource estático */
export interface StaticDataConfig {
  type: 'static'

  /** Dados literais — array ou objeto */
  data: any[] | Record<string, any>
}

/**
 * Configuração de DataSource computado.
 * Valor é gerado por uma expressão avaliada contra as variáveis do schema.
 */
export interface ComputedDataConfig {
  type: 'computed'

  /**
   * Expressão JS avaliada em runtime.
   * Tem acesso a: vars (SchemaTree.variables), $route, $store, etc.
   *
   * @example
   * "vars.produtos.filter(p => p.ativo)"
   */
  expression: string
}

// ============================================================
// DATA BINDING - A vinculação prop → campo de DataSource
// ============================================================

/**
 * Representa uma vinculação entre uma prop de um SchemaNode
 * e um campo (ou o resultado inteiro) de um DataSource.
 *
 * Armazenado em SchemaNode.props quando o usuário faz data binding.
 *
 * @example
 * ```typescript
 * // DataTable vinculando ao DataSource 'produtos':
 * node.props.dataSource = {
 *   __binding: true,
 *   sourceId: 'produtos',
 *   fieldKey: null  // null = usa o resultado inteiro (array de produtos)
 * }
 *
 * // Text vinculando ao campo 'name' do produto selecionado:
 * node.props.text = {
 *   __binding: true,
 *   sourceId: 'produtos',
 *   fieldKey: 'name'
 * }
 * ```
 */
export interface DataBinding {
  /** Marker para identificar que este valor é um binding (não um literal) */
  __binding: true

  /** ID do DataSource registrado */
  sourceId: string

  /**
   * Caminho do campo no DataSourceField (dot notation).
   * null = usa o resultado completo do DataSource
   */
  fieldKey: string | null

  /**
   * Transform aplicado ao valor antes de passar para a prop.
   * Expressão JS: '(v) => v.toUpperCase()' ou 'String(value)'
   */
  transform?: string

  /**
   * Valor de fallback se o DataSource não estiver disponível.
   * Exibido no canvas do builder para preview.
   */
  fallback?: any
}

/**
 * Type guard para detectar se um valor de prop é um DataBinding.
 */
export function isDataBinding(value: unknown): value is DataBinding {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__binding' in value &&
    (value as any).__binding === true
  )
}

// ============================================================
// SCHEMA INFERENCE - Infere campos a partir de JSON
// ============================================================

/**
 * Opções para inferência automática de DataSourceField[] a partir de JSON.
 */
export interface SchemaInferenceOptions {
  /**
   * Caminho no JSON para o array/objeto de amostra.
   * @example 'data.items' para { data: { items: [...] } }
   */
  dataPath?: string

  /**
   * Máximo de itens do array para analisar durante a inferência.
   * Mais itens = inferência mais precisa, mas mais lenta.
   * @default 10
   */
  sampleSize?: number

  /** Se deve tentar detectar formatos automaticamente (currency, date, etc.) */
  detectFormats?: boolean
}

/**
 * Resultado da inferência de schema.
 */
export type SchemaInferenceResult =
  | { success: true; fields: DataSourceField[]; dataPath: string }
  | { success: false; error: string }
