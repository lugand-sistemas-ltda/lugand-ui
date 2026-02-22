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
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'color'
  | 'range'
  | 'hidden'

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
 */
export interface FormField {
  /** Nome único do campo (chave no formData) */
  name: string

  /** Tipo do campo */
  type: FieldType

  /** Label exibido */
  label: string

  /** Placeholder */
  placeholder?: string

  /** Valor padrão */
  defaultValue?: any

  /** Se campo é obrigatório */
  required?: boolean

  /** Se campo está desabilitado */
  disabled?: boolean

  /** Se campo é readonly */
  readonly?: boolean

  /** Texto de ajuda */
  helpText?: string

  /** Regras de validação */
  validation?: FieldValidationRule[]

  /** Opções (para select/radio) */
  options?: FieldOption[]

  /** Min/max (para number/range) */
  min?: number
  max?: number
  step?: number

  /** Pattern (para text fields) */
  pattern?: string

  /** Accept (para file) */
  accept?: string

  /** Multiple (para select/file) */
  multiple?: boolean

  /** Rows (para textarea) */
  rows?: number

  /** Condição de exibição (expressão) */
  showIf?: string | ((formData: Record<string, any>) => boolean)

  /** Classe CSS customizada */
  className?: string

  /** Grid layout (col span) */
  colSpan?: number

  /** Metadata customizada */
  meta?: Record<string, any>
}

/**
 * Schema de formulário completo.
 */
export interface FormSchema {
  /** ID único do form */
  id: string

  /** Título do form */
  title?: string

  /** Descrição */
  description?: string

  /** Campos do formulário */
  fields: FormField[]

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
