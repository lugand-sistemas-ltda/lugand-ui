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
export { default as Input } from './primitives/Input.vue'
export { default as Textarea } from './primitives/Textarea.vue'
export { default as Checkbox } from './primitives/Checkbox.vue'
export { default as Select } from './primitives/Select.vue'

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
// LAYOUT - Componentes de estrutura
// ============================================
// AppShell components moved to modules/AppShell
export { default as ComponentShowcase } from './layout/ComponentShowcase.vue'
export { default as CodeBlock } from './layout/CodeBlock.vue'
