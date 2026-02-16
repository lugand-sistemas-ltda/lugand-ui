/**
 * Exports de componentes compartilhados
 * Organizados por categoria para facilitar manutenção
 */

// ============================================
// PRIMITIVES - Componentes base simples
// ============================================
export { default as Button } from './primitives/Button.vue'
export { default as BtnToggle } from './primitives/BtnToggle.vue'
export { default as Scrollable } from './primitives/Scrollable.vue'
export { default as InputWithAddon } from './primitives/InputWithAddon.vue'
export { default as InputWithSelectAddon } from './primitives/InputWithSelectAddon.vue'
export { default as ActionButton } from './primitives/ActionButton.vue'
export { default as CopyButton } from './primitives/CopyButton.vue'
export { default as FileIcon } from './primitives/FileIcon.vue'
export { default as BulkActionBar } from './BulkActionBar.vue'

// ============================================
// FORM PRIMITIVES - Inputs base especializados
// ============================================
export { default as NumericTextInput } from './form/primitives/NumericTextInput.vue'

// ============================================
// FORM COMPONENTS - Inputs, Selects, Checks
// ============================================
export { default as Input } from './form/inputs/Input.vue'
export { default as Textarea } from './form/inputs/Textarea.vue'
export { default as MaskInput } from './form/inputs/MaskInput.vue'
export { default as CurrencyInput } from './form/inputs/CurrencyInput.vue'
export { default as DateInput } from './form/inputs/DateInput.vue'
export { default as DateSegmentedInput } from './form/inputs/DateSegmentedInput.vue'
export { default as DateSelectInput } from './form/inputs/DateSelectInput.vue'
export { default as CopyInput } from './form/inputs/CopyInput.vue'
export { default as FileUpload } from './form/FileUpload.vue'
export { default as Select } from './form/selects/Select.vue'
export { default as Checkbox } from './form/selection/Checkbox.vue'
export { default as Switch } from './form/selection/Switch/Switch.vue'
export { default as Radio } from './form/selection/Radio/Radio.vue'
export { default as RadioGroup } from './form/selection/Radio/RadioGroup.vue'


// ============================================
// FORM - Componentes de formulário
// ============================================
// DynamicForm movido para modules


// ============================================
// DISPLAY - Visualização de dados
// ============================================
export { default as Card } from './display/Card.vue'
export { default as MediaCard } from './display/MediaCard.vue'
export { default as Badge } from './display/Badge.vue'
export { default as Tooltip } from './display/Tooltip.vue'
export { default as Avatar } from './display/Avatar.vue'
export { default as Icon } from './display/Icon.vue'
export { default as StatCard } from './display/StatCard.vue'
export { default as Timeline } from './display/Timeline.vue'
export { default as TimelineItem } from './display/TimelineItem.vue'
export { default as ProgressBar } from './display/ProgressBar.vue'
export { default as ProgressCircle } from './display/ProgressCircle.vue'
export { default as Rating } from './display/Rating.vue'
export { default as FileList } from './display/FileList.vue'

// ============================================
// LAYOUT - Componentes de estrutura
// ============================================
// AppShell components moved to modules/AppShell
export { default as ComponentShowcase } from './layout/ComponentShowcase.vue'
export { default as CodeBlock } from './layout/CodeBlock.vue'
export { default as GridContainer } from './layout/GridContainer.vue'
export { default as ScrollContainer } from './layout/ScrollContainer.vue'
export { default as PageHeader } from './layout/PageHeader.vue'
export { default as FilterSidebar } from './layout/FilterSidebar.vue'
export { default as FilterSection } from './layout/FilterSection.vue'

// ============================================
// NAVIGATION - Componentes de navegação
// ============================================
export { default as Pagination } from './navigation/Pagination.vue'

// ============================================
// DATA - Componentes para exibição de dados
// ============================================
export { default as DataToolbar } from './data/DataToolbar.vue'

// ============================================
// FEEDBACK - Componentes de alerta e notificação
// ============================================
// Toast movido para modules/toast
// Modal movido para modules/modal
// Drawer movido para modules/Drawer

export { default as Spinner } from './feedback/Spinner.vue'
export { default as Skeleton } from './feedback/Skeleton.vue'
export { default as EmptyState } from './feedback/EmptyState.vue'
export { default as Alert } from './feedback/Alert.vue'
export { default as AlertDialog } from './feedback/AlertDialog.vue'
