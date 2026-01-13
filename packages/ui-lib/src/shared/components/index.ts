/**
 * Exports de componentes compartilhados
 * Organizados por categoria para facilitar manutenção
 */

// ============================================
// PRIMITIVES - Componentes base simples
// ============================================
export { default as Btn } from './primitives/Btn.vue'
export { default as BtnToggle } from './primitives/BtnToggle.vue'
export { default as Scrollable } from './primitives/Scrollable.vue'
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
// NAVIGATION - Componentes de navegação
// ============================================
export { default as NavLink } from './navigation/NavLink.vue'
export { default as NavItem } from './navigation/NavItem.vue'
export { default as Navbar } from './navigation/Navbar.vue'

// ============================================
// DISPLAY - Visualização de dados
// ============================================
export { default as Card } from './display/Card.vue'
export { default as MediaCard } from './display/MediaCard.vue'
export { default as Badge } from './display/Badge.vue'
export { default as Tooltip } from './display/Tooltip.vue'
export { default as Avatar } from './display/Avatar.vue'
export { default as Skeleton } from './display/Skeleton.vue'
export { default as Icon } from './display/Icon.vue'

// ============================================
// LAYOUT - Componentes de estrutura
// ============================================
// AppShell components moved to modules/AppShell
export { default as ComponentShowcase } from './layout/ComponentShowcase.vue'
export { default as CodeBlock } from './layout/CodeBlock.vue'
export { default as GridContainer } from './layout/GridContainer.vue'
export { default as ScrollContainer } from './layout/ScrollContainer.vue'

// ============================================
// FEEDBACK - Componentes de alerta e notificação
// ============================================
export { default as ToastProvider } from './feedback/Toast/ToastProvider.vue'
export { default as ToastItem } from './feedback/Toast/ToastItem.vue'
export * from './feedback/Toast/types'
