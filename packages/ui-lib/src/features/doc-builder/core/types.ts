/**
 * Tipos do Document Builder
 * 
 * Define estruturas de dados para geração de documentos dinâmicos
 */

import type { BaseSchema, BaseSchemaItem } from '@/core/schema-builder'

/**
 * ==========================================
 * DOCUMENT SCHEMA
 * ==========================================
 */

/**
 * Schema completo de um documento
 */
export interface DocumentSchema extends BaseSchema<DocumentBlock, DocumentMetadata> {
  /** Layout e configuração da página */
  layout: DocumentLayout
  
  /** Variáveis do documento (para interpolação) */
  variables: DocumentVariable[]
  
  /** Estilos globais do documento */
  styles?: DocumentStyles
}

/**
 * Metadados específicos do documento
 */
export interface DocumentMetadata {
  /** Título do documento */
  title: string
  
  /** Autor */
  author?: string
  
  /** Assunto/tema */
  subject?: string
  
  /** Palavras-chave */
  keywords?: string[]
  
  /** Tags para organização */
  tags?: string[]
  
  /** Categoria */
  category?: string
}

/**
 * ==========================================
 * DOCUMENT LAYOUT
 * ==========================================
 */

/**
 * Configuração de layout do documento
 */
export interface DocumentLayout {
  /** Tamanho da página */
  pageSize: PageSize
  
  /** Orientação */
  orientation: PageOrientation
  
  /** Margens (em mm) */
  margins: PageMargins
  
  /** Cabeçalho (opcional) */
  header?: DocumentBlock[]
  
  /** Rodapé (opcional) */
  footer?: DocumentBlock[]
}

export type PageSize = 'a4' | 'letter' | 'legal' | 'a3' | 'a5'
export type PageOrientation = 'portrait' | 'landscape'

export interface PageMargins {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * ==========================================
 * DOCUMENT BLOCK
 * ==========================================
 */

/**
 * Bloco de documento (unidade básica de conteúdo)
 */
export interface DocumentBlock extends BaseSchemaItem {
  type: BlockType
  content: BlockContent
  style?: BlockStyle
  conditions?: BlockConditions
}

/**
 * Tipos de blocos disponíveis
 */
export type BlockType =
  | 'text'         // Texto simples
  | 'heading'      // Título/cabeçalho
  | 'variable'     // Variável dinâmica
  | 'qrcode'       // QR Code
  | 'signature'    // Assinatura
  | 'image'        // Imagem
  | 'table'        // Tabela
  | 'spacer'       // Espaçador
  | 'line'         // Linha horizontal
  | 'group'        // Grupo de blocos
  | 'repeater'     // Repetidor (loop sobre array)

/**
 * Conteúdo genérico do bloco
 * (cada tipo de bloco tem seu próprio formato)
 */
export interface BlockContent {
  [key: string]: any
}

/**
 * Estilo do bloco
 */
export interface BlockStyle {
  /** Fonte */
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  fontFamily?: string
  
  /** Cor */
  color?: string
  backgroundColor?: string
  
  /** Alinhamento */
  align?: 'left' | 'center' | 'right' | 'justify'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  
  /** Espaçamento */
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  
  /** Linha */
  lineHeight?: number
  
  /** Borda */
  border?: string
  borderTop?: string
  borderRight?: string
  borderBottom?: string
  borderLeft?: string
  borderRadius?: number
  
  /** Largura/altura */
  width?: number | string
  height?: number | string
  
  /** Posição */
  position?: 'relative' | 'absolute'
  top?: number
  right?: number
  bottom?: number
  left?: number
  
  /** Quebra de página */
  pageBreakBefore?: boolean
  pageBreakAfter?: boolean
}

/**
 * Condições de renderização do bloco
 */
export interface BlockConditions {
  /** Renderizar apenas se condição for true */
  if?: string // Expressão JavaScript (ex: "idade >= 18")
  
  /** Renderizar se outra condição for false */
  else?: boolean
  
  /** Mostrar/ocultar baseado em variável */
  show?: string // Nome da variável booleana
  
  /** Ocultar se */
  hide?: string
}

/**
 * ==========================================
 * CONTEÚDOS ESPECÍFICOS POR TIPO DE BLOCO
 * ==========================================
 */

/**
 * Conteúdo de bloco de texto
 */
export interface TextBlockContent extends BlockContent {
  text: string
  format?: 'plain' | 'markdown' | 'html'
}

/**
 * Conteúdo de bloco de título
 */
export interface HeadingBlockContent extends BlockContent {
  text: string
  level: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * Conteúdo de bloco de variável
 */
export interface VariableBlockContent extends BlockContent {
  variableName: string
  format?: string // Formato de exibição (ex: "currency", "date")
  fallback?: string // Valor padrão se variável não existir
}

/**
 * Conteúdo de bloco de QR Code
 */
export interface QRCodeBlockContent extends BlockContent {
  data: string // Dados do QR Code (pode conter variáveis: {{var}})
  size?: number
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

/**
 * Conteúdo de bloco de assinatura
 */
export interface SignatureBlockContent extends BlockContent {
  label?: string
  showDate?: boolean
  width?: number
  height?: number
}

/**
 * Conteúdo de bloco de imagem
 */
export interface ImageBlockContent extends BlockContent {
  src: string // URL ou base64
  alt?: string
  width?: number
  height?: number
  fit?: 'contain' | 'cover' | 'fill' | 'none'
}

/**
 * Conteúdo de bloco de tabela
 */
export interface TableBlockContent extends BlockContent {
  headers?: string[]
  rows: any[][] // Array de arrays (células)
  dataSource?: string // Nome da variável com dados
  columns?: DocTableColumn[]
}

export interface DocTableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: number | string
  format?: string
}

/**
 * Conteúdo de bloco espaçador
 */
export interface SpacerBlockContent extends BlockContent {
  height: number // Altura em mm
}

/**
 * Conteúdo de bloco linha
 */
export interface LineBlockContent extends BlockContent {
  color?: string
  width?: number // Espessura
  style?: 'solid' | 'dashed' | 'dotted'
}

/**
 * Conteúdo de bloco grupo
 */
export interface GroupBlockContent extends BlockContent {
  blocks: DocumentBlock[]
}

/**
 * Conteúdo de bloco repetidor
 */
export interface RepeaterBlockContent extends BlockContent {
  dataSource: string // Nome da variável array
  itemVariable: string // Nome da variável para cada item
  template: DocumentBlock[] // Template a ser repetido
  emptyMessage?: string // Mensagem se array vazio
}

/**
 * ==========================================
 * DOCUMENT VARIABLE
 * ==========================================
 */

/**
 * Variável de documento (para interpolação)
 */
export interface DocumentVariable {
  /** Nome da variável (usado em {{name}}) */
  name: string
  
  /** Label amigável */
  label: string
  
  /** Tipo da variável */
  type: VariableType
  
  /** Obrigatória? */
  required: boolean
  
  /** Valor padrão */
  defaultValue?: any
  
  /** Formato de exibição */
  format?: string
  
  /** Descrição/ajuda */
  description?: string
  
  /** Opções (para tipo select) */
  options?: VariableOption[]
  
  /** Validação */
  validation?: VariableValidation
}

export type VariableType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'currency'
  | 'boolean'
  | 'select'
  | 'array'
  | 'object'

export interface VariableOption {
  value: any
  label: string
}

export interface VariableValidation {
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  custom?: string // Expressão JS de validação
}

/**
 * ==========================================
 * DOCUMENT STYLES
 * ==========================================
 */

/**
 * Estilos globais do documento
 */
export interface DocumentStyles {
  /** Fontes customizadas */
  fonts?: FontDefinition[]
  
  /** Paleta de cores */
  colors?: Record<string, string>
  
  /** Espaçamentos padrão */
  spacing?: Record<string, number>
  
  /** Estilos de texto pré-definidos */
  textStyles?: Record<string, BlockStyle>
}

export interface FontDefinition {
  family: string
  url?: string
  weight?: number
  style?: 'normal' | 'italic'
}

/**
 * ==========================================
 * DOCUMENT DATA (para renderização)
 * ==========================================
 */

/**
 * Dados para renderizar documento
 * (valores das variáveis)
 */
export interface DocumentData {
  [variableName: string]: any
}

