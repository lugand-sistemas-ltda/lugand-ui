/**
 * ============================================
 * COMMON TYPES - Types compartilhados entre componentes
 * ============================================
 */

/**
 * Tamanhos padrão de componentes
 * Usado em: Button, Input, Modal, Badge, Avatar, etc.
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Variantes de cor/estilo padrão
 * Usado em: Button, Badge, Alert, Toast, etc.
 */
export type ComponentVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'ghost'
    | 'outline'

/**
 * Espaçamento interno padrão
 * Usado em: Card, Container, Modal, etc.
 */
export type ComponentPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Tamanhos específicos para Modal/Dialog
 * Inclui 'full' para modais em tela cheia
 */
export type ModalSize = ComponentSize | 'full'

/**
 * Estados de validação para inputs
 * Usado em: Input, Textarea, Select, DynamicForm, etc.
 */
export type ValidationState = 'default' | 'error' | 'success' | 'warning'

/**
 * Posições para Tooltip, Popover, Dropdown, etc.
 */
export type Position =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'

/**
 * Posições para Drawer (slide-in panel)
 * Usado em: Drawer component
 */
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom'

/**
 * Alinhamento de texto/conteúdo
 * Usado em: TableColumn, Typography, etc.
 */
export type Alignment = 'left' | 'center' | 'right' | 'justify'

/**
 * Direção de ordenação
 * Usado em: DataTable, useSorting, etc.
 */
export type SortDirection = 'asc' | 'desc' | null

/**
 * Direção de layout (flex/grid)
 */
export type Direction = 'horizontal' | 'vertical'

/**
 * Formato de bordas
 */
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full' | 'pill'

/**
 * Tipos de input HTML5
 */
export type InputType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'color'
