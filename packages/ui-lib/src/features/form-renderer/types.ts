/**
 * Form Renderer - Type Definitions
 * 
 * Sistema de renderização dinâmica de formulários a partir de JSON schemas.
 * Permite criar forms completos sem escrever HTML/Vue.
 * 
 * @module features/form-renderer
 */

/**
 * Tipo de campo de formulário.
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'color'
  | 'range'
  | 'rating'
  | 'hidden'
  | 'cep'        // Brazilian postal code
  | 'cpf'        // Brazilian individual taxpayer ID
  | 'cnpj'       // Brazilian company ID
  | 'phone-br'   // Brazilian phone number
  | 'currency-br' // Brazilian currency

/**
 * Regra de validação de campo.
 */
export interface FieldValidationRule {
  /** Tipo de validação */
  type: 'required' | 'email' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom'

  /** Mensagem de erro customizada */
  message?: string

  /** Valor do parâmetro (ex: min: 5, maxLength: 100) */
  value?: any

  /** Validador customizado */
  validator?: (value: any, formData: Record<string, any>) => boolean | Promise<boolean>
}

/**
 * Opção de select/radio.
 */
export interface FieldOption {
  /** Label exibido */
  label: string

  /** Valor do option */
  value: any

  /** Se está desabilitado */
  disabled?: boolean

  /** Ícone (opcional) */
  icon?: string
}

/**
 * Definição de campo de formulário.
 * Suporta duas estruturas para compatibilidade:
 * 1. Estrutura direta (legado): propriedades diretas como label, placeholder
 * 2. Estrutura nova (form-builder): props object + id
 */
export interface FormField {
  /** Nome único do campo (chave no formData) - LEGADO */
  name?: string

  /** ID único (form-builder) - NOVO */
  id?: string

  /** Tipo do campo */
  type: FieldType

  /** Label exibido - LEGADO */
  label?: string

  /** Placeholder - LEGADO */
  placeholder?: string

  /** Valor padrão - LEGADO */
  defaultValue?: any

  /** Se campo é obrigatório - LEGADO */
  required?: boolean

  /** Se campo está desabilitado - LEGADO */
  disabled?: boolean

  /** Se campo é readonly - LEGADO */
  readonly?: boolean

  /** Texto de ajuda - LEGADO */
  helpText?: string

  /** 
   * Regras de validação - Suporta dois formatos:
   * 1. LEGADO: Array direto de regras
   * 2. NOVO (form-builder): Objeto com rules e trigger
   */
  validation?: FieldValidationRule[] | {
    rules?: FieldValidationRule[]
    trigger?: 'blur' | 'change' | 'submit'
  }

  /** Opções (para select/radio) - LEGADO */
  options?: FieldOption[]

  /** Min/max (para number/range) - LEGADO */
  min?: number
  max?: number
  step?: number

  /** Pattern (para text fields) - LEGADO */
  pattern?: string

  /** Accept (para file) - LEGADO */
  accept?: string

  /** Multiple (para select/file) - LEGADO */
  multiple?: boolean

  /** Rows (para textarea) - LEGADO */
  rows?: number

  /** Condição de exibição (expressão) - LEGADO */
  showIf?: string | ((formData: Record<string, any>) => boolean)

  /** Classe CSS customizada - LEGADO */
  className?: string

  /** Grid layout (col span) - LEGADO */
  colSpan?: number

  /** Metadata customizada - LEGADO */
  meta?: Record<string, any>
  
  /** Props object (form-builder structure) - NOVO */
  props?: {
    label?: string
    placeholder?: string
    defaultValue?: any
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    helperText?: string
    validation?: FieldValidationRule[] | {
      rules?: FieldValidationRule[]
      trigger?: 'blur' | 'change' | 'submit'
    }
    options?: FieldOption[]
    min?: number
    max?: number
    step?: number
    pattern?: string
    accept?: string
    multiple?: boolean
    rows?: number
    [key: string]: any
  }
}

/**
 * Schema de formulário completo.
 * Compatível com BaseSchema mas com propriedades opcionais para suportar legado.
 */
export interface FormSchema {
  /** ID único do form */
  id?: string
  
  /** Nome do schema (BaseSchema compat) */
  name?: string
  
  /** Versão do schema (BaseSchema compat) */
  version?: string

  /** Título do form */
  title?: string

  /** Descrição */
  description?: string

  /** Campos do formulário (estrutura nova) */
  items?: FormField[]

  /** Campos do formulário (estrutura legado) */
  fields?: FormField[]
  
  /** Metadata (BaseSchema compat) */
  metadata?: any
  
  /** Timestamp de criação (BaseSchema compat) */
  createdAt?: string
  
  /** Timestamp de atualização (BaseSchema compat) */
  updatedAt?: string

  /** Número de colunas no grid */
  columns?: number

  /** Gap entre campos */
  gap?: string

  /** Validar ao digitar */
  validateOnInput?: boolean

  /** Validar ao blur */
  validateOnBlur?: boolean

  /** Validar ao submit */
  validateOnSubmit?: boolean

  /** Mostrar erros inline */
  showInlineErrors?: boolean

  /** Texto do botão submit */
  submitText?: string

  /** Texto do botão cancel */
  cancelText?: string

  /** Mostrar botão reset */
  showReset?: boolean

  /** Endpoint de submissão */
  action?: string

  /** Método HTTP */
  method?: 'POST' | 'PUT' | 'PATCH'

  /** Callback de submit */
  onSubmit?: (data: Record<string, any>) => void | Promise<void>

  /** Callback de erro */
  onError?: (errors: FormErrors) => void
}

/**
 * Erros de validação do formulário.
 */
export interface FormErrors {
  /** Erros por campo (fieldName → array de mensagens) */
  fields: Record<string, string[]>

  /** Erros globais do form */
  global?: string[]
}

/**
 * Estado do formulário.
 */
export interface FormState {
  /** Dados atuais do form */
  data: Record<string, any>

  /** Erros de validação */
  errors: FormErrors

  /** Campos que foram tocados (blur) */
  touched: Set<string>

  /** Se form foi submetido */
  submitted: boolean

  /** Se está validando */
  validating: boolean

  /** Se está submetendo */
  submitting: boolean

  /** Se form é válido */
  valid: boolean
}

/**
 * Opções do FormRenderer.
 */
export interface FormRendererOptions {
  /** Schema do formulário */
  schema: FormSchema

  /** Valores iniciais */
  initialValues?: Record<string, any>

  /** Modo de validação */
  validationMode?: 'onBlur' | 'onInput' | 'onSubmit' | 'all'

  /** Se deve fazer scroll para primeiro erro */
  scrollToError?: boolean

  /** Se deve focar primeiro campo com erro */
  focusFirstError?: boolean
}

/**
 * Resultado de validação de campo.
 */
export interface FieldValidationResult {
  /** Se campo é válido */
  valid: boolean

  /** Mensagens de erro */
  errors: string[]
}

/**
 * Evento de mudança de campo.
 */
export interface FieldChangeEvent {
  /** Nome do campo */
  fieldName: string

  /** Valor anterior */
  oldValue: any

  /** Valor novo */
  newValue: any

  /** Timestamp */
  timestamp: number
}

/**
 * Evento de submit do form.
 */
export interface FormSubmitEvent {
  /** Dados do formulário */
  data: Record<string, any>

  /** Se form é válido */
  valid: boolean

  /** Erros (se houver) */
  errors?: FormErrors
}
